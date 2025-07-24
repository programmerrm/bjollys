import { apiSlice } from "../api/apiSlice";

export const paymentsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCryptoCheckoutSession: builder.mutation({
            query: (data) => ({
                url: "/payments/create-crypto-checkout-session/",
                method: "POST",
                body: data,
            }),
        }),
        createEcommerceCheckoutSession: builder.mutation({
            query: (data) => ({
                url: "/payments/create-e-commerce-checkout-session/",
                method: "POST",
                body: data,
            }),
        }),
        getSubscription: builder.query({    
            query: () => '/payments/subscription/',
        }),
        getPayment: builder.query({
            query: () => '/payments/all/',
        }),
    }),
});

export const {
    useCreateCryptoCheckoutSessionMutation,
    useCreateEcommerceCheckoutSessionMutation,
    useGetSubscriptionQuery,
    useGetPaymentQuery,
} = paymentsApi;
