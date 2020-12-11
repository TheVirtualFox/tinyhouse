import { IResolvers } from 'apollo-server-express';

export const userResolver: IResolvers = {
    Query: {
        user: () => {
            return "Query.user";
        }
    }
};