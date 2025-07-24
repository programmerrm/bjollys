import { Link, useNavigate } from "@remix-run/react";
import { useDispatch } from "react-redux";
import { useGetContactInfoQuery, useGetCopyRightQuery, useGetFooterLogoQuery, useGetLegalDisclaimerQuery, useGetSocialLinkQuery } from "~/redux/features/configuration/configurationApi";
import { openFooterSeeMore } from "~/redux/features/popup/popupSlice";
import { MEDIA_URL } from "~/utils/api";
import { ReactIcons } from "~/utils/reactIcons";

export const Footer = () => {
  console.log("Rasel Mahmud");
  const navigate = useNavigate();
  const { data: footerLogo } = useGetFooterLogoQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: contactInfo } = useGetContactInfoQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: socialLink } = useGetSocialLinkQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: copyRight } = useGetCopyRightQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: legalDisclaimer } = useGetLegalDisclaimerQuery(undefined, { refetchOnMountOrArgChange: true });
  const { RiFacebookCircleLine, FaInstagram, RiTwitterXFill, CiLinkedin } = ReactIcons;
  const dispatch = useDispatch();
  const contact = contactInfo?.data?.[0];
  const social = socialLink?.data?.[0];
  return (
    <footer className="relative top-0 left-0 right-0 py-5 lg:py-10 w-full text-white bg-gradient-to-r from-primary to-secondary">
      <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full">
        <div className="flex flex-col flex-wrap w-full">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 w-full pb-5">
            <div className="flex flex-col flex-wrap gap-y-5 w-full">
              <Link className="block w-fit" to={"/"}>
                <img className="w-24 sm:w-28 md:w-32 lg:w-40" src={`${MEDIA_URL}${footerLogo?.data?.logo}`} alt="bijolis" loading="lazy" decoding="async" />
              </Link>
              <p className="text-sm text-black font-normal line-clamp-4" dangerouslySetInnerHTML={{ __html: footerLogo?.data?.description }}></p>
            </div>
            <div className="flex flex-col flex-wrap gap-y-2.5 lg:gap-y-5 w-full">
              <h4 className="text-lg font-medium uppercase">Resources</h4>
              <ul className="flex flex-col flex-wrap gap-y-1.5 lg:gap-y-2.5 w-full text-sm lg:text-base font-normal text-black">
                <li>
                  <button
                    onClick={() => {
                      navigate('/');
                      setTimeout(() => {
                        const el = document.getElementById("about");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }}
                    className="text-left cursor-pointer text-black duration-300 ease-linear hover:translate-x-2 transition-transform"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate('/');
                      setTimeout(() => {
                        const el = document.getElementById("services");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }}
                    className="text-left cursor-pointer text-black duration-300 ease-linear hover:translate-x-2 transition-transform"
                  >
                    Services
                  </button>
                </li>
                <li className="text-left cursor-pointer duration-300 ease-linear hover:translate-x-2 transition-transform">
                  <Link className="text-black" to={"/terms-and-conditions/"}>
                    Terms & conditions
                  </Link>
                </li>
                <li className="text-left cursor-pointer duration-300 ease-linear hover:translate-x-2 transition-transform">
                  <Link className="text-black" to={"/privacy-policy/"}>
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col flex-wrap gap-y-2.5 lg:gap-y-5 w-full">
              <h4 className="text-sm lg:text-lg font-medium uppercase">Official Info</h4>
              <div className="flex flex-col flex-wrap gap-y-2.5 w-full text-black">
                <div className="flex flex-row flex-wrap items-center gap-x-2.5">
                  <span className="text-sm lg:text-base font-normal">Address : </span>
                  <span className="text-sm lg:text-base font-normal">{contact?.address}</span>
                </div>
                <div className="flex flex-row flex-wrap items-center gap-x-2.5">
                  <span className="text-sm lg:text-base font-normal">Email : </span>
                  <Link className="text-sm lg:text-base font-normal text-black" to={`mailto:${contact?.email}`} target="_blank">
                    {contact?.email}
                  </Link>
                </div>
                <div className="flex flex-row flex-wrap items-center gap-x-2.5">
                  <span className="text-sm lg:text-base font-normal">Number : </span>
                  <Link className="text-sm lg:text-base font-normal text-black" to={`tel:${contact?.number}`} target="_blank">
                    {contact?.number}
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex flex-col flex-wrap gap-y-2.5 lg:gap-y-5 w-full">
              <h4 className="text-sm lg:text-lg font-medium uppercase">social link</h4>
              <div className="flex flex-row flex-wrap items-center gap-x-2.5 lg:gap-x-5">
                <Link to={social?.facebook} target="_blank">
                  <RiFacebookCircleLine className="text-xl lg:text-3xl text-black duration-300 ease-linear hover:-translate-y-2 transition-transform" />
                </Link>
                <Link to={social?.instagram} target="_blank">
                  <FaInstagram className="text-xl lg:text-3xl text-black duration-300 ease-linear hover:-translate-y-2 transition-transform" />
                </Link>
                <Link to={social?.twitter} target="_blank">
                  <RiTwitterXFill className="text-xl lg:text-3xl text-black duration-300 ease-linear hover:-translate-y-2 transition-transform" />
                </Link>
                <Link to={social?.linkedin} target="_blank">
                  <CiLinkedin className="text-xl lg:text-3xl text-black duration-300 ease-linear hover:-translate-y-2 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-wrap justify-center items-center py-5 w-full border-t border-b border-black text-black">
            <p className="text-xs lg:text-sm font-normal text-center">{copyRight?.data?.text} <Link className="font-medium text-base text-red-500" to={"https://dreamlabit.com/"} target="_blank">Dreamlabit</Link></p>
          </div>
          <div className="flex flex-col flex-wrap justify-center items-center gap-y-2.5 lg:gap-y-5 py-5 w-full">
            <div className="flex flex-col flex-wrap justify-center items-center gap-y-2.5">
              <h4 className="text-sm lg:text-lg font-medium text-center">{legalDisclaimer?.data?.title}</h4>
              <span className="text-sm lg:text-base font-normal text-black">{legalDisclaimer?.data?.updated_date}</span>
            </div>
            <div className="flex flex-col flex-wrap items-center justify-center w-full lg:w-[65%]">
              <p className="text-xs lg:text-sm font-normal text-justify lg:text-center text-black">{legalDisclaimer?.data?.short_description}</p> <span className="underline cursor-pointer text-title font-bold" onClick={() => dispatch(openFooterSeeMore())}>
                See More
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
