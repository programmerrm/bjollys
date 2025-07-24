import { Link } from "@remix-run/react";

export default function Support() {
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
                  <th className="py-3 px-5 text-lg text-black font-normal text-left rounded-tr-2xl rounded-br-2xl shadow-[inset_0_0_0_9999px_transparent] whitespace-nowrap">
                    View
                  </th>
                </tr>
              </thead>
              <tbody className="w-full"></tbody>
            </table>
          </div>
          <div className="flex items-center justify-center pagination">
            <button className="size-[2rem] rounded-full flex items-center justify-center opacity-[0.38] cursor-pointer">
              <svg
                className="size-5"
                focusable="false"
                aria-hidden="true"
                viewBox="0 0 24 24"
                data-testid="NavigateBeforeIcon"
              >
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
              </svg>
            </button>
            <button className="size-[2rem] rounded-full flex items-center justify-center opacity-[0.38] cursor-pointer">
              <svg
                className="size-5"
                focusable="false"
                aria-hidden="true"
                viewBox="0 0 24 24"
                data-testid="NavigateNextIcon"
              >
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
