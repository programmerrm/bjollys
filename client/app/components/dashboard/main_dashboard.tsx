import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import {
  useGetCryptoTradesVideoQuery,
  useGetEcommerceCrousesQuery,
  useGetGetEducationVideoQuery,
  useGetGetMarketUpdatesVideoQuery,
  useGetStockCommoditiesTradesVideoQuery,
} from "~/redux/features/crouses/crousesApi";
import { useGetSubscriptionQuery } from "~/redux/features/payments/paymentsApi";
import { MEDIA_URL } from "~/utils/api";
import { Pagination } from "../pagination/pagination";
dayjs.extend(relativeTime);

export const MainDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [activeTab, setActiveTab] = useState<"crypto" | "stock" | "market" | "education">("crypto"); // Track active tab
  const [eduLevel, setEduLevel] = useState<"basic" | "advance">("basic");

  // Fetch data for all tabs
  const { data: subscriptionData } = useGetSubscriptionQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Fetch data for each tab
  const { data: cryptoTrades } = useGetCryptoTradesVideoQuery(currentPage, { refetchOnMountOrArgChange: true });
  const { data: stockCommoditiesTrades } = useGetStockCommoditiesTradesVideoQuery(currentPage, { refetchOnMountOrArgChange: true });
  const { data: marketUpdates } = useGetGetMarketUpdatesVideoQuery(currentPage, { refetchOnMountOrArgChange: true });
  const { data: education } = useGetGetEducationVideoQuery(currentPage, { refetchOnMountOrArgChange: true });
  const { data: ecommerceVideo } = useGetEcommerceCrousesQuery(currentPage, { refetchOnMountOrArgChange: true });

  const tabButtonClass = (tab: string) =>
    `text-title hover:text-white rounded-full py-1.5 px-3.5 flex items-center capitalize transition-all duration-300 cursor-pointer ease-in-out ${activeTab === tab
      ? "bg-gradient-to-r from-yellow-700 to-red-400 text-white"
      : "hover:bg-gradient-to-r hover:from-yellow-700 hover:to-red-400"
    }`;

  const filterButtonClass = (level: "basic" | "advance") =>
    `p-1.5 rounded-[1.563rem] min-w-[6.75rem] cursor-pointer text-sm md:text-base font-medium ${eduLevel === level ? "bg-black text-white" : "bg-transparent text-black"
    }`;

  const filteredEducation = Array.isArray(education?.results)
    ? education.results.filter((item: any) => item.status === eduLevel)
    : [];

  // Handle page change for each tab
  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Update current page when pagination changes
  }

  // Dynamically choose the correct data set based on active tab
  const getDataForActiveTab = () => {
    switch (activeTab) {
      case "crypto":
        return cryptoTrades;
      case "stock":
        return stockCommoditiesTrades;
      case "market":
        return marketUpdates;
      case "education":
        return education;
      default:
        return null;
    }
  }

  // Get the correct data for the active tab
  const activeTabData = getDataForActiveTab();

  console.log('subscription data : ', subscriptionData);

  return (
    <section className="py-[4.375rem]">
      <div className="container">

        <div className="bg-gradient-to-r from-primary to-secondary rounded-[22px] p-1 max-w-[62.5rem] w-full mx-auto">
          {subscriptionData?.data?.[0].subscription_type === "crypto" &&
            subscriptionData?.data?.[0].status === "active" && (
              <div className="bg-white rounded-[20px] p-5 md:p-10 md:py-[3.25rem] flex flex-col relative">
                <ul className="flex flex-col sm:flex-row flex-wrap items-center w-full lg:w-fit mx-auto bg-section-title rounded-[1.625rem] p-[0.438rem]">
                  <li>
                    <button
                      onClick={() => {
                        setActiveTab("crypto");
                        setCurrentPage(1); // Reset to page 1 when changing tab
                      }}
                      className={tabButtonClass("crypto")}
                    >
                      Crypto Trades
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setActiveTab("stock");
                        setCurrentPage(1); // Reset to page 1 when changing tab
                      }}
                      className={tabButtonClass("stock")}
                    >
                      Stock & Commodities Trades
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setActiveTab("market");
                        setCurrentPage(1); // Reset to page 1 when changing tab
                      }}
                      className={tabButtonClass("market")}
                    >
                      Market Updates
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setActiveTab("education");
                        setCurrentPage(1); // Reset to page 1 when changing tab
                      }}
                      className={tabButtonClass("education")}
                    >
                      Education
                    </button>
                  </li>
                </ul>

                <div className="my-[1.875rem] grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-6">
                  {/* Render the active tab's data */}
                  {activeTab === "crypto" &&
                    activeTabData?.results?.map((item: any) => (
                      <CardItem key={item.id} item={item} />
                    ))}
                  {activeTab === "stock" &&
                    activeTabData?.results?.map((item: any) => (
                      <CardItem key={item.id} item={item} />
                    ))}
                  {activeTab === "market" &&
                    activeTabData?.results?.map((item: any) => (
                      <CardItem key={item.id} item={item} />
                    ))}
                  {activeTab === "education" && (
                    <div className="my-5 p-2.5 rounded-2xl bg-[#f1f3f4] w-full col-span-full">
                      <div className="bg-primary rounded-[1.563rem] p-[0.438rem] flex items-center justify-center w-fit mx-auto mb-5">
                        <button
                          onClick={() => setEduLevel("basic")}
                          className={`${filterButtonClass("basic")}`}
                        >
                          Basic
                        </button>
                        <button
                          onClick={() => setEduLevel("advance")}
                          className={`${filterButtonClass("advance")}`}
                        >
                          Advance
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {filteredEducation?.map((item: any) => (
                          <div key={item.id} className="pt-6 px-4 pb-1.5 bg-[#dadfe2] rounded-2xl relative max-w-[80%] mx-auto">
                            <video className="w-full h-auto rounded" src={`${MEDIA_URL}${item.video}`} controls />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Conditionally render Pagination for tabs other than "education" */}
                {activeTab !== "education" && (
                  <Pagination
                    totalPage={Math.ceil(activeTabData?.count / 4)} // Pass the correct total page count based on the current tab
                    currentPage={currentPage}
                    onPageChange={handlePageChange} // Handle page change
                  />
                )}
              </div>
            )}

          {/* Other Subscription Types */}
          {subscriptionData?.data?.[0].subscription_type === "e-commerce" &&
            subscriptionData?.data?.[0].status === "active" && (
              <div className="bg-white rounded-[20px] p-5 md:p-10 md:py-[3.25rem] flex flex-col relative">
                <h2 className="text-3xl">E-commerce Videos</h2>
                <div className="my-[1.875rem] grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-6">
                  {ecommerceVideo?.results?.map((item: any) => (
                    <CardItem key={item.id} item={item} />
                  ))}
                </div>
                <Pagination
                    totalPage={Math.ceil(ecommerceVideo?.count / 4)} // Pass the correct total page count based on the current tab
                    currentPage={currentPage}
                    onPageChange={handlePageChange} // Handle page change
                  />
              </div>
            )}
        </div>

      </div>
    </section>
  );
};

const CardItem = ({ item }: { item: any }) => (
  <div className="py-5 px-4 pt-10 bg-[#f5f5f5] relative space-y-2.5">
    <hr className="border-t-[#c8c8c8] mb-2.5" />
    {item.images && (
      <div className="flex flex-col flex-wrap w-full">
        <img className="w-full h-auto rounded" src={`${MEDIA_URL}${item.images}`} alt={item.title} />
      </div>
    )}
    {item.video && (
      <div className="flex flex-col flex-wrap w-full">
        <video className="w-full h-auto rounded" src={`${MEDIA_URL}${item.video}`} controls />
      </div>
    )}
    <div className="px-1 space-y-1.5 mt-1.5">
      <p className="font-semibold">{item.title}</p>
      {item.sub_titles?.map((sub: any) => (
        <p key={sub.id}>{sub.sub_title}</p>
      ))}
      <div className="text-editor" dangerouslySetInnerHTML={{ __html: item.description }}></div>
    </div>
    <div className="absolute bottom-2 right-5">
      <p className="text-xs text-[#0000005e]">{dayjs(item.created_at).fromNow()}</p>
    </div>
  </div>
);




// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
// import { useState, useEffect } from "react";
// import {
//   useGetCryptoTradesVideoQuery,
//   useGetEcommerceCrousesQuery,
//   useGetGetEducationVideoQuery,
//   useGetGetMarketUpdatesVideoQuery,
//   useGetStockCommoditiesTradesVideoQuery,
// } from "~/redux/features/crouses/crousesApi";
// import { useGetSubscriptionQuery } from "~/redux/features/payments/paymentsApi";
// import { MEDIA_URL } from "~/utils/api";
// import { Pagination } from "../pagination/pagination";
// dayjs.extend(relativeTime);

// export const MainDashboard = () => {
//   const [currentPage, setCurrentPage] = useState(1); // Track current page
//   const [activeTab, setActiveTab] = useState<"crypto" | "e-commerce">("crypto"); // Track active tab
//   const [eduLevel, setEduLevel] = useState<"basic" | "advance">("basic");

//   // Fetch subscription data
//   const { data: subscriptionData } = useGetSubscriptionQuery(undefined, {
//     refetchOnMountOrArgChange: true,
//   });

//   // Fetch data for each tab
//   const { data: cryptoTrades } = useGetCryptoTradesVideoQuery(currentPage, { refetchOnMountOrArgChange: true });
//   const { data: stockCommoditiesTrades } = useGetStockCommoditiesTradesVideoQuery(currentPage, { refetchOnMountOrArgChange: true });
//   const { data: marketUpdates } = useGetGetMarketUpdatesVideoQuery(currentPage, { refetchOnMountOrArgChange: true });
//   const { data: education } = useGetGetEducationVideoQuery(currentPage, { refetchOnMountOrArgChange: true });
//   const { data: ecommerceVideo } = useGetEcommerceCrousesQuery(currentPage, { refetchOnMountOrArgChange: true });

//   const tabButtonClass = (tab: string) =>
//     `text-title hover:text-white rounded-full py-1.5 px-3.5 flex items-center capitalize transition-all duration-300 cursor-pointer ease-in-out ${activeTab === tab
//       ? "bg-gradient-to-r from-yellow-700 to-red-400 text-white"
//       : "hover:bg-gradient-to-r hover:from-yellow-700 hover:to-red-400"
//     }`;

//   const filterButtonClass = (level: "basic" | "advance") =>
//     `p-1.5 rounded-[1.563rem] min-w-[6.75rem] cursor-pointer text-sm md:text-base font-medium ${eduLevel === level ? "bg-black text-white" : "bg-transparent text-black"
//     }`;

//   const filteredEducation = Array.isArray(education?.results)
//     ? education.results.filter((item: any) => item.status === eduLevel)
//     : [];

//   // Handle page change for each tab
//   const handlePageChange = (page: number) => {
//     setCurrentPage(page); // Update current page when pagination changes
//   }

//   // Dynamically choose the correct data set based on active tab
//   const getDataForActiveTab = () => {
//     switch (activeTab) {
//       case "crypto":
//         return cryptoTrades;
//       case "e-commerce":
//         return ecommerceVideo;
//       default:
//         return null;
//     }
//   };

//   // Get the correct data for the active tab
//   const activeTabData = getDataForActiveTab();

//   // Check if the user has both subscriptions
//   const hasMultipleSubscriptions = subscriptionData?.data?.length > 1;

//   // Toggle between "Crypto" and "E-commerce" based on subscription data
//   const handleTabToggle = () => {
//     if (activeTab === "crypto") {
//       setActiveTab("e-commerce");
//     } else {
//       setActiveTab("crypto");
//     }
//   };

//   return (
//     <section className="py-[4.375rem]">
//       <div className="container">
//         <div className="bg-gradient-to-r from-primary to-secondary rounded-[22px] p-1 max-w-[62.5rem] w-full mx-auto">
//           {/* Render toggle if the user has both subscriptions */}
//           {hasMultipleSubscriptions && (
//             <div className="mb-4 flex justify-center">
//               <button
//                 onClick={handleTabToggle}
//                 className="text-title hover:text-white rounded-full py-1.5 px-3.5 flex items-center capitalize transition-all duration-300 cursor-pointer ease-in-out bg-gradient-to-r from-yellow-700 to-red-400"
//               >
//                 Switch to {activeTab === "crypto" ? "E-commerce" : "Crypto"}
//               </button>
//             </div>
//           )}

//           {/* Render active tab data */}
//           {subscriptionData?.data?.[0].subscription_type === "crypto" &&
//             subscriptionData?.data?.[0].status === "active" && (
//               <div className="bg-white rounded-[20px] p-5 md:p-10 md:py-[3.25rem] flex flex-col relative">
//                 <ul className="flex flex-col sm:flex-row flex-wrap items-center w-full lg:w-fit mx-auto bg-section-title rounded-[1.625rem] p-[0.438rem]">
//                   <li>
//                     <button
//                       onClick={() => {
//                         setActiveTab("crypto");
//                         setCurrentPage(1); // Reset to page 1 when changing tab
//                       }}
//                       className={tabButtonClass("crypto")}
//                     >
//                       Crypto Trades
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       onClick={() => {
//                         setActiveTab("e-commerce");
//                         setCurrentPage(1); // Reset to page 1 when changing tab
//                       }}
//                       className={tabButtonClass("e-commerce")}
//                     >
//                       E-commerce
//                     </button>
//                   </li>
//                 </ul>

//                 <div className="my-[1.875rem] grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-6">
//                   {/* Render the active tab's data */}
//                   {activeTab === "crypto" &&
//                     activeTabData?.results?.map((item: any) => (
//                       <CardItem key={item.id} item={item} />
//                     ))}
//                   {activeTab === "e-commerce" &&
//                     activeTabData?.results?.map((item: any) => (
//                       <CardItem key={item.id} item={item} />
//                     ))}
//                 </div>

//                 {/* Pagination component for the current tab */}
//                 <Pagination
//                   totalPage={Math.ceil(activeTabData?.count / 4)} // Pass the correct total page count based on the current tab
//                   currentPage={currentPage}
//                   onPageChange={handlePageChange} // Handle page change
//                 />
//               </div>
//             )}

//           {/* Other Subscription Types */}
//         </div>
//       </div>
//     </section>
//   );
// };

// const CardItem = ({ item }: { item: any }) => (
//   <div className="py-5 px-4 pt-10 bg-[#f5f5f5] relative space-y-2.5">
//     <hr className="border-t-[#c8c8c8] mb-2.5" />
//     {item.images && (
//       <div className="flex flex-col flex-wrap w-full">
//         <img className="w-full h-auto rounded" src={`${MEDIA_URL}${item.images}`} alt={item.title} />
//       </div>
//     )}
//     {item.video && (
//       <div className="flex flex-col flex-wrap w-full">
//         <video className="w-full h-auto rounded" src={`${MEDIA_URL}${item.video}`} controls />
//       </div>
//     )}
//     <div className="px-1 space-y-1.5 mt-1.5">
//       <p className="font-semibold">{item.title}</p>
//       {item.sub_titles?.map((sub: any) => (
//         <p key={sub.id}>{sub.sub_title}</p>
//       ))}
//       <div className="text-editor" dangerouslySetInnerHTML={{ __html: item.description }}></div>
//     </div>
//     <div className="absolute bottom-2 right-5">
//       <p className="text-xs text-[#0000005e]">{dayjs(item.created_at).fromNow()}</p>
//     </div>
//   </div>
// );
