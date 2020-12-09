import crypto from 'crypto';
import {IResolvers} from 'apollo-server-express';
import {Database, User, Viewer} from "../../../lib/types";
import {Request, Response} from 'express';
import {Google} from "../../../lib/api";
import {LogInArgs} from "./types";

const cookieOptions = {
    httpOnly: true,
    sameSite: true,
    signed: true,
    secure: process.env.NODE_ENV != "development",
};

const logInViaCookie = async (token: string, db: Database, req: Request, res: Response): Promise<User | undefined> => {
    const updateRes = await db.users.findOneAndUpdate(
        { _id: req.signedCookies.viewer },
        { $set: { token }},
        { returnOriginal: false }
    );
    let viewer = updateRes.value;

    if (!viewer) {
        res.clearCookie("viewer", cookieOptions);
    }

    return viewer;
};

const logInViaGoogle = async (code: string, token: string, db: Database, res: Response): Promise<User | undefined> => {
    const { user } = await Google.logIn(code);
    console.log(user);
    if (!user) {
        throw new Error('Google login error');
    }

    const userNamesList = user.names && user.names.length ? user.names : null;
    const userPhotosList = user.photos && user.photos.length ? user.photos : null;
    const userEmailsList = user.emailAddresses && user.emailAddresses.length ? user.emailAddresses : null;

    const userName = userNamesList ? userNamesList[0].displayName : null;
    const userId = userNamesList && userNamesList[0].metadata && userNamesList[0].metadata.source ? userNamesList[0].metadata.source.id : null;
    const userAvatar = userPhotosList && userPhotosList[0].url ? userPhotosList[0].url : null;
    const userEmail = userEmailsList && userEmailsList[0].value ? userEmailsList[0].value : null;

    if (!userName || !userId || !userAvatar || !userEmail) {
        throw new Error('Google login error');
    }

    const updateRes = await db.users.findOneAndUpdate({ _id: userId}, {
        $set: {
            name: userName,
            avatar: userAvatar,
            contact: userEmail,
            token
        }
    }, { returnOriginal: false });

    let viewer = updateRes.value;

    if (!viewer) {
        const insertResult = await db.users.insertOne({
            _id: userId,
            name: userName,
            avatar: userAvatar,
            contact: userEmail,
            token,
            income: 0,
            bookings: [],
            listings: []
        });
        viewer = insertResult.ops[0];
    }
    res.cookie("viewer", userId, {
       ...cookieOptions,
       maxAge: 365 * 24 * 60 * 60 * 1000
    });
    return viewer;
};

export const viewerResolvers: IResolvers = {
    Query: {
        authUrl: (): string => {
            try {
                return Google.authUrl;
            } catch(err) {
                throw new Error(`Failed to query Google Auth Url: ${err}`);
            }
        }
    },
    Mutation: {
        logIn: async (_root: undefined, { input }: LogInArgs, { db, req, res }: {db: Database, req: Request, res: Response}): Promise<Viewer> => {
            try {
                const code = input ? input.code : null;
                console.log(code);
                const token = crypto.randomBytes(16).toString("hex");
                console.log(token);
                const viewer = code ? await logInViaGoogle(code, token, db, res): await logInViaCookie(token, db, req, res);
                console.log(viewer);
                if (!viewer) {
                    return { didRequest: true };
                }
                console.log("gfdsgfdgsfdgfdsg fdgsfdsg");
                return {
                    _id: viewer._id,
                    token: viewer.token,
                    avatar: viewer.avatar,
                    walletId: viewer.walletId,
                    didRequest: true
                };
            } catch(err) {
                throw new Error(`Failed to log in: ${err}`);
            }
        },
        logOut: (_root: undefined, _args: {}, {res}: {res: Response}): Viewer => {
            try {
                res.clearCookie("viewer", cookieOptions);
                return { didRequest: true };
            } catch(err) {
                throw new Error(`Failed to log out: ${err}`);
            }
        }
    },
    Viewer: {
        id: (viewer: Viewer): string | undefined => {return viewer._id;},
        hasWallet: (viewer: Viewer): boolean | undefined => {return viewer.walletId ? true : undefined },
    }
};