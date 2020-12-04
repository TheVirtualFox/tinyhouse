import React from 'react';
import { useMutation, useQuery} from "react-apollo";
import {DeleteListing as DeleteListingData, DeleteListingVariables} from "./__generated__/DeleteListing";
import {Listing as ListingsData} from "./__generated__/Listing";
import {gql} from "apollo-boost";
import {Avatar, Button, List, Spin} from "antd";
import './styles/Listings.css';
import {ListingsSkeleton} from "./components/ListingSkeleton";

const LISTINGS = gql`
    query Listing {
        listings {
            id
            title
            image
            address
            price
            numOfGuests
            numOfBeds
            numOfBaths
            rating
        }
    }
`;

const DELETE_LISTING = gql`
    mutation DeleteListing($id: ID!) {
        deleteListing(id: $id) {
            id
        }
    }
`;

interface ListingsProps {
    title: string;
}

export const Listings = ({title}: ListingsProps) => {

    const {data, loading, error, refetch} = useQuery<ListingsData>(LISTINGS);
    const [deleteListing, {loading: deleteListingLoading, error: deleteListingError}] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

    const handleDeleteListing = async (id: string) => {
        await deleteListing({variables: { id }});
        refetch();
    };

    const listings = data ? data.listings : null;

    const listingsList = listings ?
        <List itemLayout="horizontal" dataSource={listings} renderItem={(listing) => (
            <List.Item actions={[<Button type={"primary"} onClick={() => handleDeleteListing(listing.id)}>Delete</Button>]}>
                <List.Item.Meta title={listing.title} description={listing.address}
                                avatar={<Avatar src={listing.image} shape={"square"} size={48} />} />
            </List.Item>
        )} /> : null;

    if (loading) {
        return <div className="listings"><ListingsSkeleton title={title} /></div>;
    }

    if (error) {
        return <div className="listings"><ListingsSkeleton title={title} error /></div>;
    }

    const deleteListingErrorText = deleteListingError ? <h4>Delete error</h4> : null;

    return <div className="listings">
        <Spin spinning={deleteListingLoading}>
            <h2>{title}</h2>
            {listingsList}
            {deleteListingErrorText}
        </Spin>
    </div>
};