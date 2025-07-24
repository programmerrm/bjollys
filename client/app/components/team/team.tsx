import { Link } from "@remix-run/react";
import React from "react";
import { useGetTeamQuery } from "~/redux/features/homepage/homepageApi";
import { MEDIA_URL } from "~/utils/api";

export const Team: React.FC = () => {
  const { data } = useGetTeamQuery(undefined, { refetchOnMountOrArgChange: true });
  console.log('data' , data)
  return (
    <section className="relative top-0 left-0 right-0 py-5 lg:py-12 w-full">
      <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full">
        <div className="flex flex-col flex-wrap items-center justify-center w-full">
          <div className="flex flex-col flex-wrap justify-center items-center w-full">
            <h2 className="flex flex-col">
              Team <span className="text-secondary"> Acknowledgements</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {data?.data?.map((item: any) => {
              return (
                <Link
                  className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-500 top-0 hover:shadow-[0_7px_10px_-1px_#000000bf] hover:top-[-10px]"
                  key={item.id}
                  to={item.link || "/"}
                >
                  <div className="absolute top-0 left-0 right-0 bottom-0 bg-[linear-gradient(180deg,#0000_17.5%,#000_78%)]"></div>
                  <img src={`${MEDIA_URL}${item.image}`} alt={item.title} />
                  <div className="absolute bottom-0 left-0 right-0 py-5 px-4 md:px-[25px] text-white text-center">
                    <h4 className="text-lg sm:text-[23px] text-secondary font-medium leading-[1.3] mb-[10px]">{item?.title}</h4>
                    <p className="line-clamp-4 lg:line-clamp-6" dangerouslySetInnerHTML={{ __html: item?.description }}></p>
                    <Link className="text-white" to={item?.url} target="_blank">
                      Learn More
                    </Link>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
