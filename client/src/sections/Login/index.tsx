import React, {useEffect, useRef} from 'react';
import {Card, Layout, Spin, Typography} from "antd";
import { useApolloClient, useMutation } from "react-apollo";
import googleLogo from "./assets/google_logo.jpg";
import {Viewer} from "../../lib/types";
import {AuthUrl as AuthUrlData} from "../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl";
import {AUTH_URL} from "../../lib/graphql/queries/AuthUrl";
import {LogIn as LogInData, LogInVariables} from "../../lib/graphql/mutations/LogIn/__generated__/LogIn";
import {LOG_IN} from "../../lib/graphql/mutations/LogIn";
import {displayErrorMessage, displaySuccessNotification} from "../../lib/utils";
import {ErrorBanner} from "../../lib/components/ErrorBanner";
import {Redirect} from "react-router";

const { Content } = Layout;
const { Text, Title } = Typography;

interface LoginProps {
    setViewer: (viewer: Viewer) => void;
}

export const Login = ({setViewer}: LoginProps) => {
    const client = useApolloClient();

    const [logIn, {data: logInData, loading: logInLoading, error: logInError}] = useMutation<LogInData, LogInVariables>(LOG_IN, {
        onCompleted: (data) => {
            if (data && data.logIn && data.logIn.token) {
                setViewer(data.logIn);
                sessionStorage.setItem("token", data.logIn.token);
                displaySuccessNotification("You've successfully logged in");
            }
        }
    });

    const logInRef = useRef(logIn);

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get("code");
        if (code) {
            logInRef.current({
                variables: {
                    input: { code }
                }
            });
        }
    }, []);

    const handleAuthorize = async () => {
        try {
            const { data } = await client.query<AuthUrlData>({
                query: AUTH_URL
            });
            window.location.href = data.authUrl;
        } catch {
            displayErrorMessage("Err");
        }
    };
    if (logInLoading) {
        return (
            <Content className="log-in">
                <Spin size={"large"} tip={"Loading you in..."} />
            </Content>
        )
    }

    if (logInData && logInData.logIn) {
        const {id: viewerId} = logInData.logIn;
        return <Redirect to={`/user/${viewerId}`} />;
    }

    const logInErrorBannerElement = logInError ? (
        <ErrorBanner description={"err"} />
    ) : null;

    return (
        <Content className="log-in">
            {logInErrorBannerElement}
            <Card className="log-in-card">
                <div className="log-in-card-intro">
                    <Title level={3} className="log-in-card__intro-title">
                        <span role="img" aria-label="wave"></span>
                    </Title>
                    <Title level={3} className="log-in-card__intro-title">
                        Log in to TinyHouse
                    </Title>
                    <Text>Sign in with Google to start booking available rentals!</Text>
                </div>
                <button onClick={handleAuthorize} className="log-in-card__google-button">
                    <img src={googleLogo} alt="Google Logo" className="log-in-card__google-button-logo"/>
                    <span className="log-in-card__google-button-text">
                        Sign in with Google
                    </span>
                </button>
                <Text type="secondary">Note: By signing in, you'll be redirected to the Google consent form to sign in with your Google account.</Text>
            </Card>
        </Content>
    );
};