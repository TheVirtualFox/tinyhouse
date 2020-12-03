import React from 'react';
import { useMutation, useQuery} from "../../lib/api";
import {DeleteListingData, DeleteListingVariables, ListingsData} from "./types";

const LISTINGS = `
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

const DELETE_LISTING = `
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
        await deleteListing({ id });
        refetch();
    };

    const listings = data ? data.listings : null;

    const listingsList = listings ? <ul>{listings.map(listing =>
            <li key={listing.id}>{listing.title} <button onClick={() => handleDeleteListing(listing.id)}>Delete</button></li>)}
        </ul> : null;

    if (loading) {
        return <h2>Loading...</h2>
    }

    if (error) {
        return <h2>Error</h2>
    }

    const deleteListingLoadingText = deleteListingLoading ? <h4>Delete in progress...</h4> : null;
    const deleteListingErrorText = deleteListingError ? <h4>Delete error</h4> : null;

    return <div>
        <h2>{title}</h2>
        {listingsList}
        {deleteListingLoadingText}
        {deleteListingErrorText}
    </div>
};