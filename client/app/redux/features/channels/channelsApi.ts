import { apiSlice } from './../api/apiSlice';

export const channelsApi = apiSlice.injectEndpoints({
     endpoints: (builder) => ({
        getChannels: builder.query({
            query: () => '/channels/data/',
        }),
     }),
});

export const { useGetChannelsQuery } = channelsApi;
