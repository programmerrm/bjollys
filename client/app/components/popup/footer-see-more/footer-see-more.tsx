import { useDispatch } from "react-redux";
import { useGetLegalDisclaimerQuery } from "~/redux/features/configuration/configurationApi";
import { closeFooterSeeMore } from "~/redux/features/popup/popupSlice";

export const FooterSeeMore = () => {
  const { data: legalDisclaimer } = useGetLegalDisclaimerQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const dispatch = useDispatch();
  return (
    <div className="fixed w-screen h-screen top-0 left-0 z-10 bg-[#00000080] transition-all duration-[.15s] ease-linear p-3 flex justify-center items-start overflow-y-auto">
      <div className="bg-gradient-to-r from-primary to-secondary rounded-[22px] p-[5px] max-w-[50rem] w-full border border-[#00000033]">
        <div className="bg-white rounded-[20px] px-4 py-[3.125rem] md:px-[1.625rem] flex flex-col relative">
          <button
            className="cursor-pointer absolute right-4 top-[1.625rem]"
            type="button"
            onClick={() => dispatch(closeFooterSeeMore())}
          >
            <svg
              className="w-[0.859rem] fill-[#858796]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
            >
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </button>
          <div
            className="text-editor"
            dangerouslySetInnerHTML={{
              __html: legalDisclaimer?.data?.description,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
