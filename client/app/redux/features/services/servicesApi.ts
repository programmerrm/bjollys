import { apiSlice } from "../api/apiSlice";

export const servicesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getServices: builder.query({
            query: () => '/services/data/',
        }),
    }),
});

export const { useGetServicesQuery } = servicesApi;
