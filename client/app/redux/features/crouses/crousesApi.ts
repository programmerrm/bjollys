import { apiSlice } from "../api/apiSlice";

export interface SingleCourseBundle {
    id: number;
    bundle_name: string;
    price: number;
    discount: number;
    final_price: number;
    course: number;
}

export interface EcommerceSingleCourse {
    id: number;
    title: string;
    image: string;
    single_course_bundles: SingleCourseBundle[];
}

export interface EcommerceSingleCourseAPIResponse {
    success: boolean;
    message: string;
    data: EcommerceSingleCourse;
}


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
        getSingleEcommerceCrouses: builder.query<EcommerceSingleCourseAPIResponse, void>({
            query: () => '/crouses/e-commerce-single-course/',
        }),

    }),
});

export const {
    useGetEcommerceCrousesQuery,
    useGetCryptoTradesVideoQuery,
    useGetStockCommoditiesTradesVideoQuery,
    useGetGetMarketUpdatesVideoQuery,
    useGetGetEducationVideoQuery,
    useGetSingleEcommerceCrousesQuery,
} = crousesApi;
