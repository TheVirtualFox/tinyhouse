import React from 'react';
import {server} from "../../lib/api";
import {ListingData} from "./types";

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

interface ListingsProps {
    title: string;
}

export const Listings = ({title}: ListingsProps) => {

    const fetchListings = async () => {
        const { data } = await server.fetch<ListingData>({query: LISTINGS});
        console.log(data.listings);
    };

    return <div>
        <h2>{title}</h2>
        <button onClick={fetchListings}>Query Listings</button>
    </div>
};