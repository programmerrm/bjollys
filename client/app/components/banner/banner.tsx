import { Link } from "@remix-run/react";
import React from "react";
import { useDispatch } from "react-redux";
import { useGetBannerQuery } from "~/redux/features/homepage/homepageApi";
import { openSeeMore } from "~/redux/features/popup/popupSlice";
import { MEDIA_URL } from "~/utils/api";
import { ReactIcons } from "~/utils/reactIcons";

export const Banner: React.FC = () => {
  const { data } = useGetBannerQuery(undefined, { refetchOnMountOrArgChange: true });
  const { MdArrowRightAlt, FaFacebook } = ReactIcons;
  const dispatch = useDispatch();
  const handleOpen = () => {
    dispatch(openSeeMore());
  };

  return (
    <section className="py-5 lg:py-12 w-full">
      <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center justify-center w-full">
          <div className="flex flex-col flex-wrap w-full">
            <h3 className="uppercase text-secondary text-2xl font-semibold">{data?.data?.sub_title}</h3>
            <h1 className="mb-5 text-secondary text-4xl lg:text-6xl font-bold mt-2.5">{data?.data?.title}</h1>
            <div className="space-y-4 mb-4 text-body-color">
              <p
                className="text-justify"
                dangerouslySetInnerHTML={{ __html: data?.data?.description }}
              ></p>
            </div>
            <div className="mb-5">
              <button className="text-secondary underline cursor-pointer" type="button" onClick={handleOpen}>
                See More
              </button>
            </div>
            <div>
              <Link
                className="flex items-center p-[0.313rem] border border-primary rounded-[1.875rem] uppercase text-secondary cursor-pointer w-full transition-all duration-300 ease-in-out hover:bg-primary group"
                to={data?.data?.our_channel_url}
                target="_blank"
              >
                <span className="grow text-center">Join Our Channels</span>
                <div className="bg-primary size-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ease-in-out group-hover:bg-secondary">
                  <MdArrowRightAlt className="text-xl text-white" />
                </div>
              </Link>
            </div>
          </div>
          <div className="flex flex-col flex-wrap justify-center items-center w-full h-full">
            <video className="w-full h-auto rounded-2xl" controls src={`${MEDIA_URL}${data?.data?.video}`}></video>
          </div>
        </div>
      </div>
    </section>
  );
};
