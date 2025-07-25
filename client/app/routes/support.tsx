import { Link } from "@remix-run/react";
import { useState } from "react";
import { useGetTicketQuery } from "~/redux/features/ticket/ticketApi";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export default function Support() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetTicketQuery(`?page=${page}`, {
    refetchOnMountOrArgChange: true,
  });

  const nextPage = () => {
    if (data?.next) setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (data?.previous && page > 1) setPage((prev) => prev - 1);
  };

  return (
    <section className="pt-6">
      <div className="container">
        <h1 className="text-center text-[2rem] font-semibold leading-[1.4] text-title mb-[1.125rem] md:text-[2.625rem]">
          Support
        </h1>
        <div className="p-4">
          <div className="flex items-center justify-end py-5">
            <Link
              className="py-2.5 px-5 text-center bg-gradient-to-r from-primary to-secondary rounded-[30px] text-white uppercase cursor-pointer transition-all duration-[0.3s] ease-in-out inline-block hover:text-secondary outline hover:outline-secondary hover:bg-none"
              to="/ticket/"
            >
              Create Ticket
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full mb-4">
              <thead className="w-full">
                <tr className="bg-[#f6f6f6]">
                  <th className="py-3 px-5 pl-10 text-lg leading-normal text-black font-normal text-left rounded-tl-2xl rounded-bl-2xl shadow-[inset_0_0_0_9999px_transparent] whitespace-nowrap">
                    Issue ID
                  </th>
                  <th className="py-3 px-5 text-lg text-black font-normal text-left shadow-[inset_0_0_0_9999px_transparent] whitespace-nowrap">
                    Status
                  </th>
                  <th className="py-3 px-5 text-lg text-black font-normal text-left shadow-[inset_0_0_0_9999px_transparent] whitespace-nowrap">
                    Issue Type
                  </th>
                  <th className="py-3 px-5 text-lg text-black font-normal text-left shadow-[inset_0_0_0_9999px_transparent] whitespace-nowrap">
                    Created At
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
                    <tr
                      className="border-b border-[#0003] group"
                      key={item.id}
                    >
                      <td className="py-3 px-5 pl-10 text-sm md:text-lg text-left rounded-bl-2xl">
                        {item.id}
                      </td>
                      <td className="py-3 px-5 text-sm md:text-lg text-left">
                        {item.status}
                      </td>
                      <td className="py-3 px-5 text-sm md:text-lg text-left">
                        {item.issueType}
                      </td>
                      <td className="py-3 px-5 text-sm md:text-lg text-left rounded-br-2xl">
                        {item.created_at
                          ? dayjs(item.created_at)
                            .tz("Asia/Dhaka")
                            .format("MMMM Do YYYY, h:mm:ss a")
                          : "N/A"}
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
