import { apiSlice } from "../api/apiSlice";

export const crousesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getEcommerceCrouses: builder.query({
            query: (pageNumber) => `/crouses/ecommerce/videos/?page=${pageNumber}`,
        }),
        getCryptoTradesVideo: builder.query({
            query: (pageNumber) => `/crouses/crypto/videos/?page=${pageNumber}`,
        }),
        getStockCommoditiesTradesVideo: builder.query({
            query: (pageNumber) => `/crouses/stock/videos/?page=${pageNumber}`,
        }),
        getGetMarketUpdatesVideo: builder.query({
            query: (pageNumber) => `/crouses/market/videos/?page=${pageNumber}`,
        }),
        getGetEducationVideo: builder.query({
            query: (pageNumber) => `/crouses/education/videos/?page=${pageNumber}`,
        }),
    }),
});

export const {
    useGetEcommerceCrousesQuery,
    useGetCryptoTradesVideoQuery,
    useGetStockCommoditiesTradesVideoQuery,
    useGetGetMarketUpdatesVideoQuery,
    useGetGetEducationVideoQuery,
} = crousesApi;
