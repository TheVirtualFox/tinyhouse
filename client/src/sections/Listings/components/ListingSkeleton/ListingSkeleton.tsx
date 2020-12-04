import React from 'react';
import {Alert, Divider, Skeleton} from "antd";
import './styles/ListingSkeleton.css';

interface ListingsSkeletonProps {
    title: string;
    error?: boolean;
}

export const ListingsSkeleton = ({title, error = false}:ListingsSkeletonProps) => {

    const errorAlert = error ? <Alert type="error" message="err" className="listings-skeleton__alert" /> : null;

    return <div className="listings-skeleton">
        {errorAlert}
        <h2>{title}</h2>
        <Skeleton active paragraph={{rows: 1}} />
        <Divider />
        <Skeleton active paragraph={{rows: 1}} />
        <Divider />
        <Skeleton active paragraph={{rows: 1}} />
    </div>;
};