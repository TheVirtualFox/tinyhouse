import React from 'react';
import {server, useQuery} from "../../lib/api";
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

    const {data} = useQuery<ListingsData>(LISTINGS);

    const deleteListing = async (id: string) => {
        await server.fetch<DeleteListingData, DeleteListingVariables>({query: DELETE_LISTING, variables: { id }});
        // fetchListings();
    };

    const listings = data ? data.listings : null;

    const listingsList = listings ? <ul>{listings.map(listing =>
            <li key={listing.id}>{listing.title} <button onClick={() => deleteListing(listing.id)}>Delete</button></li>)}
        </ul> : null;

    return <div>
        <h2>{title}</h2>
        {listingsList}
    </div>
};