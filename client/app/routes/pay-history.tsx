import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useState } from "react";
import { useGetPaymentQuery } from "~/redux/features/payments/paymentsApi";

dayjs.extend(advancedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export default function PayHistory() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetPaymentQuery(`?page=${page}`, {
    refetchOnMountOrArgChange: true,
  });

  const nextPage = () => {
    if (data?.next) setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (data?.previous && page > 1) setPage((prev) => prev - 1);
  };

  return (
    <section className="py-6">
      <div className="container">
        <h1 className="text-center text-[2rem] font-semibold leading-[1.4] text-title mb-[1.125rem] md:text-[2.625rem]">
          Subscription History
        </h1>

        <div className="p-4 mb-2">
          <div className="overflow-x-auto">
            <table className="w-full mb-4">
              <thead>
                <tr className="bg-[#f6f6f6]">
                  <th className="py-3 px-5 pl-10 text-lg text-left rounded-tl-2xl">
                    Email
                  </th>
                  <th className="py-3 px-5 text-lg text-left">Amount</th>
                  <th className="py-3 px-5 text-lg text-left">Type</th>
                  <th className="py-3 px-5 text-lg text-left rounded-tr-2xl">
                    Paid At
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  data?.results?.map((item: any) => (
                    <tr className="border-b border-[#0003] group" key={item.id}>
                      <td className="py-3 px-5 pl-10 text-sm md:text-lg text-left rounded-bl-2xl">
                        <span className="size-10 bg-[#d9d9d9] rounded-full inline-flex items-center justify-center uppercase mr-2.5">
                          {item.user.name
                            ?.split(" ")
                            .slice(0, 2)
                            .map((word: string) => word[0])
                            .join("")}
                        </span>

                        {item.user.email}
                      </td>
                      <td className="py-3 px-5 text-sm md:text-lg text-left">
                        {item.amount} $
                      </td>
                      <td className="py-3 px-5 text-sm md:text-lg text-left">
                        {item.status}
                      </td>
                      <td className="py-3 px-5 text-sm md:text-lg text-left rounded-br-2xl">
                        {dayjs(item.payment_date)
                          .tz("Asia/Dhaka")
                          .format("MMMM Do YYYY, h:mm:ss a")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={prevPage}
              disabled={!data?.previous}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 disabled:opacity-40 cursor-pointer"
            >
              ‹
            </button>
            <span className="text-base font-medium">{page}</span>
            <button
              onClick={nextPage}
              disabled={!data?.next}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 disabled:opacity-40 cursor-pointer"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
