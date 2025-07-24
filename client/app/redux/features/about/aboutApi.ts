import { apiSlice } from "../api/apiSlice";

export const aboutApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAbout: builder.query({
            query: () => '/about/data/',
        }),
    }),
});

export const { useGetAboutQuery } = aboutApi;
