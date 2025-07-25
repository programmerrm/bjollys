import { apiSlice } from "../api/apiSlice";

export const ticketApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addTicket: builder.mutation<void, FormData>({
            query: (ticketData) => ({
                url: '/configuration/create-ticker/',
                method: 'POST',
                body: ticketData,
            }),
        }),
        getTicket: builder.query({
            query: () => 'configuration/ticker/',
        }),
    }),
});

export const { useAddTicketMutation, useGetTicketQuery } = ticketApi;
