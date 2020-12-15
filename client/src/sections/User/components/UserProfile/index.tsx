import React from 'react';
import {User as UserData} from "../../../../lib/graphql/queries/User/__generated__/User";
import {Avatar, Button, Card, Divider, Typography} from "antd";

interface Props {
    user: UserData["user"];
    viewerIsUser: boolean;
}

const { Paragraph, Text, Title } = Typography;

export const UserProfile = ({user, viewerIsUser}: Props) => {

    const additionalDetailsSection = viewerIsUser ? (
        <>
            <Divider />
            <div className="user-profile__details">
                <Title level={4}>Additional Details</Title>
                <Button type="primary">Stripe</Button>
            </div>
        </>
    ) : null;

    return (
        <div className="user-profile">
            <Card className="user-profile__card">
                <div className="user-profile__avatar">
                    <Avatar size={100} src={user.avatar} />
                </div>
                <Divider />
                <div className="user-profile__details">
                    <Title level={4}>Details</Title>
                    <Paragraph>
                        Name: <Text strong>{user.name}</Text>
                    </Paragraph>
                    <Paragraph>
                        Contact: <Text strong>{user.contact}</Text>
                    </Paragraph>
                </div>
                { additionalDetailsSection }
            </Card>
        </div>
    );
};