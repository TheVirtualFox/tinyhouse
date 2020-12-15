import React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import { useMutation, useQuery} from "react-apollo";
import {User as UserData, UserVariables} from "../../lib/graphql/queries/User/__generated__/User";
import {USER} from "../../lib/graphql/queries/User";
import {Col, Layout, Row} from "antd";
import {UserProfile} from "./components/UserProfile";
import {Viewer} from "../../lib/types";
import {PageSkeleton} from "../../lib/components/PageSkeleton";
import {ErrorBanner} from "../../lib/components/ErrorBanner";

interface Props {
    viewer: Viewer
}

interface MatchParams {
    id: string;
}

const { Content } = Layout;

export const User = ({ viewer, match }: Props & RouteComponentProps<MatchParams>) => {
    const { data, loading, error } = useQuery<UserData, UserVariables>(USER, {
        variables: {
            id: match.params.id
        }
    });

    if (loading) {
        return (
            <Content className="user">
                <PageSkeleton />
            </Content>
        );
    }

    if (error) {
        return (
            <Content className="user">
                <ErrorBanner description="err" />
                <PageSkeleton />
            </Content>
        );
    }

    const user = data ? data.user : null;
    const viewerIsUser = viewer.id === match.params.id;
    const userProfileElement = user ? <UserProfile user={user} viewerIsUser={viewerIsUser} /> : null;
    return (
        <Content className="user">
            <Row gutter={12} type="flex" justify="space-between">
                <Col xs={24}>{userProfileElement}</Col>
            </Row>
        </Content>
    );
};