import React from 'react';
import {Alert} from "antd";

interface ErrorBannerProps {
    message?: string;
    description?: string;
}

export const ErrorBanner = ({message = "Err", description = "Err"}: ErrorBannerProps) => {
    return <Alert
        banner
        closable
        message={message}
        description={description}
        type={"error"}
        className={"error-banner"}
    />
};