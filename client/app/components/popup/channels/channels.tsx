import { Link } from "@remix-run/react";
import { useDispatch } from "react-redux";
import { useGetChannelsQuery } from "~/redux/features/channels/channelsApi";
import { closeChannel } from "~/redux/features/popup/popupSlice";
import { MEDIA_URL } from "~/utils/api";

export const Channels = () => {
  const { data } = useGetChannelsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(closeChannel());
  };

  return (
    <div className="flex justify-center items-center fixed w-screen h-screen top-0 left-0 z-10 bg-[#00000080] transition-all duration-[.15s] ease-linear p-3 overflow-y-auto">
      <div className="bg-gradient-to-r from-primary to-secondary rounded-[22px] p-[5px] max-w-[50rem] w-full border border-[#00000033]">
        <div className="bg-white rounded-[20px] p-[1.625rem] px-4 md:p-[1.625rem] flex flex-col relative">
          <button
            className="cursor-pointer absolute right-2 md:right-4 top-2 md:top-[1.625rem]"
            onClick={handleClose}
          >
            <svg
              className="w-[0.859rem] fill-[#858796]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
            >
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </button>
          <div className="flex items-center justify-center">
            <video
              className="max-w-[23.75rem] w-full rounded"
              controls
              loop
              src={`${MEDIA_URL}${data?.data?.video}`}
            ></video>
          </div>
          <h2 className="text-transparent capitalize bg-gradient-to-r from-primary to-secondary bg-clip-text text-[2.5rem] font-bold text-center leading-normal">
            {data?.data?.title}
          </h2>
          <div
            className="text-editor max-w-[31.25rem] mx-auto text-center"
            dangerouslySetInnerHTML={{ __html: data?.data?.description }}
          ></div>
          <div className="flex flex-col gap-2.5 mt-[1.875rem] md:gap-4 md:flex-row md:justify-center">
            <Link
              className="text-[1.063rem] md:text-xl leading-normal text-white rounded-[1.875rem] py-[0.938rem] px-[1.563rem] bg-gradient-to-r from-primary to-secondary text-center min-w-[14.25rem] uppercase transition-all duration-300 ease-in-out hover:bg-none hover:text-[#140751] outline-none border border-primary"
              to={data?.data?.insta_broadcast}
              target="_blank"
            >
              Insta Broadcast
            </Link>
            <Link
              className="text-[1.063rem] md:text-xl leading-normal hover:text-white rounded-[1.875rem] py-[0.938rem] px-[1.563rem] hover:bg-gradient-to-r from-primary to-secondary text-center min-w-[14.25rem] uppercase transition-all duration-300 ease-in-out bg-none text-[#140751] outline-none border border-primary"
              to={data?.data?.fb_broadcast}
              target="_blank"
            >
              FB Broadcast
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
