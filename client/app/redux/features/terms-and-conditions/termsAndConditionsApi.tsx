import { apiSlice } from "../api/apiSlice";

export const termsAndConditionsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTermsAndConditionsApi: builder.query({
            query: () => '/terms-condition/data/',
        }),
    }),
});

export const { useGetTermsAndConditionsApiQuery } = termsAndConditionsApi;
