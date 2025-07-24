import React from "react";
import { useGetServicesQuery } from "~/redux/features/services/servicesApi";
import { MEDIA_URL } from "~/utils/api";

export const Services: React.FC = () => {
  const { data } = useGetServicesQuery(undefined, { refetchOnMountOrArgChange: true });
  return (
    <section className="relative top-0 left-0 right-0 py-5 lg:py-12 w-full" id="services">
      <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full">
        <div className="flex flex-col flex-wrap gap-10 w-full">
          <div className="flex flex-col flex-wrap justify-center items-center text-center w-full">
            <h2 className="flex flex-col">
              our <span className="text-secondary"> education services</span>
            </h2>
          </div>
          <div className="grid gap-[1.875rem] sm:grid-cols-2 lg:grid-cols-3">
            {data?.data?.map((item: any) => {
              return (
                <div className="flex flex-col gap-5 hover:-translate-y-3 transition-transform duration-300 ease-in-out cursor-pointer">
                  <div>
                    <img className="w-full max-w-full object-cover h-56 rounded-xl" src={`${MEDIA_URL}${item.image}`} alt={item?.title} />
                  </div>
                  <div>
                    <h4 className="text-title">{item?.title}</h4>
                    <p className="line-clamp-4 lg:line-clamp-6" dangerouslySetInnerHTML={{ __html: item?.description }}></p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
