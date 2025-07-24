import { apiSlice } from "../api/apiSlice";

export const cryptoApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSubscriptionData: builder.query({
            query: () => '/crypto/subscription/',
        }),
    }),
});

export const { useGetSubscriptionDataQuery } = cryptoApi;
