import { apiSlice } from "../api/apiSlice";

export const configurationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getLogo: builder.query({
            query: () => '/configuration/logo/',
        }),
        getFooterLogo: builder.query({
            query: () => '/configuration/footer-logo/',
        }),
        getContactInfo: builder.query({
            query: () => '/configuration/contact-info/'
        }),
        getSocialLink: builder.query({
            query: () => '/configuration/social-link',
        }),
        getCopyRight: builder.query({
            query: () => '/configuration/copy-right/',
        }),
        getLegalDisclaimer: builder.query({
            query: () => '/configuration/legal-disclaimer/',
        }),



        getCryptoTrades: builder.query({
            query: () => '/configuration/crypto-trades/',
        }),
        getStockCommoditiesTrades: builder.query({
            query: () => '/configuration/stock-commodities-trades/',
        }),
        getMarketUpdates: builder.query({
            query: () => 'configuration/market-updates/',
        }),
        getEducation: builder.query({
            query: () => '/configuration/education/',
        }),
        getEcommerceService: builder.query({
            query: () => '/configuration/ecommerce-service/',
        }),
       
    }),
});

export const {
    useGetLogoQuery,
    useGetFooterLogoQuery,
    useGetContactInfoQuery,
    useGetSocialLinkQuery,
    useGetCopyRightQuery,
    useGetLegalDisclaimerQuery,



    useGetCryptoTradesQuery,
    useGetStockCommoditiesTradesQuery,
    useGetMarketUpdatesQuery,
    useGetEducationQuery,
    useGetEcommerceServiceQuery,
} = configurationApi;
