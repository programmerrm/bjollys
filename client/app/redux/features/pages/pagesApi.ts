import { apiSlice } from './../api/apiSlice';

export const pagesApi = apiSlice.injectEndpoints({
     endpoints: (builder) => ({
        getPages: builder.query({
            query: () => '/pages/all/',
        }),
     }),
});

export const { useGetPagesQuery } = pagesApi;
