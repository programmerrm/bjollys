import { BookingPropsType } from "~/types/booking/booking";
import { apiSlice } from "../api/apiSlice";

export const ecommerceApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getEcommerceImage: builder.query({
            query: () => '/e-commerce/image/',
        }),
        getEcommerceVideo: builder.query({
            query: () => '/e-commerce/video/',
        }),
        getEcommerceAmazon: builder.query({
            query: () => '/e-commerce/amazon/',
        }),
        getEcommerceCourseDetails: builder.query({
            query: () => '/e-commerce/course-details/',
        }),
        getEcommerceYoutubeLink: builder.query({
            query: () => '/e-commerce/youtube-link/',
        }),
        getEcommerceFaq: builder.query({
            query: () => '/e-commerce/faq/',
        }),
        getEcommerceServices: builder.query({
            query: () => '/e-commerce/services/',
        }),
        getEcommerceWhatsappNumber: builder.query({
            query: () => '/e-commerce/whatsapp-number/',
        }),
        addBooking: builder.mutation<void, BookingPropsType>({
            query: (newBookingData) => ({
                url: '/e-commerce/booking/',
                method: 'POST',
                body: newBookingData,
            }),
        }),
    }),
});

export const {
    useGetEcommerceImageQuery,
    useGetEcommerceVideoQuery,
    useGetEcommerceAmazonQuery,
    useGetEcommerceCourseDetailsQuery,
    useGetEcommerceYoutubeLinkQuery,
    useGetEcommerceFaqQuery,
    useGetEcommerceServicesQuery,
    useGetEcommerceWhatsappNumberQuery,
    useAddBookingMutation,
} = ecommerceApi;
