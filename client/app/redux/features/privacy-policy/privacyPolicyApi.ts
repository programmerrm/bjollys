import { apiSlice } from "../api/apiSlice";

export const privacyPolicyApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getprivacyPolicy: builder.query({
            query: () => '/privacy-policy/data/',
        }),
    }),
});

export const { useGetprivacyPolicyQuery } = privacyPolicyApi;
