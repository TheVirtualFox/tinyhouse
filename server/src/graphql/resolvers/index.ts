import merge from 'lodash.merge';
import {viewerResolvers} from "./Viewer";
import { userResolver } from "./User";
import { listingResolvers } from './Listing';
import { bookingResolvers } from './Booking';
export const resolvers = merge(viewerResolvers, userResolver, listingResolvers, bookingResolvers);