import { apiSlice } from "../api/apiSlice";

export const homepageApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBanner: builder.query({
            query: () => '/homepage/banner/',
        }),
        getTeam: builder.query({
            query: () => '/homepage/teams/',
        }),
        getWhy_us: builder.query({
            query: () => '/homepage/why-choose-us/',
        }),
    }),
});

export const { 
    useGetBannerQuery,
    useGetTeamQuery,
    useGetWhy_usQuery,
} = homepageApi;
