import { Link, useNavigate } from "@remix-run/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetPagesQuery } from "~/redux/features/pages/pagesApi";
import { openChannel } from "~/redux/features/popup/popupSlice";
import { RootState } from "~/redux/store";
import { Menu, NONAUTHMenu } from "~/utils/menu";
import { ReactIcons } from "~/utils/reactIcons";

interface MobileMenuProps {
  setIsMenuShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ setIsMenuShow }) => {
  const { data: headerMenus } = useGetPagesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const { IoMdNotifications, MdOutlineKeyboardArrowDown } = ReactIcons;

  const handleMenuClose = () => {
    setIsMenuShow(false);
  };

  // Handle smooth scrolling
  const handleSmoothScroll = (id: string) => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
    setIsMenuShow(false);
  };

  return (
    <div className="flex flex-col flex-wrap w-full gap-y-2.5 py-5">
      <nav className="flex flex-col flex-wrap py-1.5 px-2.5 rounded-xl text-white bg-section-title">
        <ul className="flex flex-col flex-wrap items-center gap-y-2.5">
          {auth?.tokens && auth.user ? (
            <>
              {Menu?.map((item) => {
                return (
                  <li key={item.id}>
                    <Link
                      className="rounded-full text-title py-1.5 px-3.5 flex flex-row flex-wrap items-center capitalize transition-all duration-500 hover:bg-gradient-to-r hover:from-yellow-700 hover:to-red-400"
                      to={item.path ? item.path : "#"}
                      onClick={item.path?.startsWith("/#") ? () => handleSmoothScroll(item.path || '') : undefined}
                    >
                      {item.icon && item.icon}
                      {item.name}
                    </Link>
                  </li>
                );
              })}
              {headerMenus?.results?.map((item: any) => {
                return (
                  <li>
                    <Link
                      to={item.menu.slug || "#"}
                      className="text-title hover:text-white rounded-full py-1.5 px-3.5 flex items-center capitalize transition-all duration-300 hover:bg-gradient-to-r hover:from-yellow-700 hover:to-red-400 ease-linear"
                      onClick={handleMenuClose} 
                    >
                      {item.menu.name}
                    </Link>
                  </li>
                );
              })}
            </>
          ) : (
            <>
              {NONAUTHMenu?.map((item) => {
                return (
                  <li key={item.id}>
                    {item.name === "channels" ? (
                      <button
                        type="button"
                        onClick={() => {
                          dispatch(openChannel());
                          setIsMenuShow(false);
                        }}
                        className="rounded-full text-title py-1.5 px-3.5 flex items-center capitalize transition-all duration-500 hover:bg-gradient-to-r  hover:from-yellow-700 hover:to-red-400 cursor-pointer"
                      >
                        {item.icon && item.icon}
                        {item.name}
                      </button>
                    ) : item.path?.startsWith("/#") ? (
                      <button
                        type="button"
                        onClick={() => {
                          navigate('/')
                          setTimeout(() => {
                            if (item.path) {
                              const element = document.getElementById(item.path.replace("/#", ""));
                              if (element) {
                                element.scrollIntoView({ behavior: "smooth" });
                              }
                            }
                          }, 100);
                          setIsMenuShow(false);
                        }}
                        className="rounded-full text-title py-1.5 px-3.5 flex items-center capitalize transition-all duration-500 hover:bg-gradient-to-r  hover:from-yellow-700 hover:to-red-400 cursor-pointer"
                      >
                        {item.icon && item.icon}
                        {item.name}
                      </button>
                    ) : (
                      <Link
                        to={item.path || "#"}
                        className="rounded-full text-title py-1.5 px-3.5 flex items-center capitalize transition-all duration-500 hover:bg-gradient-to-r  hover:from-yellow-700 hover:to-red-400"
                        onClick={handleMenuClose}  // Close the menu on link click
                      >
                        {item.icon && item.icon}
                        {item.name}
                      </Link>
                    )}
                  </li>
                );
              })}
              {headerMenus?.results?.map((item: any) => {
                return (
                  <li>
                    <Link
                      to={item.menu.slug || "#"}
                      className="text-title hover:text-white rounded-full py-1.5 px-3.5 flex items-center capitalize transition-all duration-300 hover:bg-gradient-to-r hover:from-yellow-700 hover:to-red-400 ease-linear"
                      onClick={handleMenuClose} 
                    >
                      {item.menu.name}
                    </Link>
                  </li>
                );
              })}
            </>
          )}
        </ul>
      </nav>

      {auth.tokens && auth.user ? (
        <div className="flex flex-row flex-wrap items-center justify-center">
          <Link className="p-2.5" to={"/"} onClick={handleMenuClose}>
            <IoMdNotifications className="text-2xl" />
          </Link>
          <div className="relative">
            <button className="text-sm py-[0.688rem] px-[2.125rem] rounded-[1.875rem] uppercase text-white border border-secondary bg-secondary transition-all duration-[0.3s] flex items-center gap-2 leading-normal font-normal cursor-pointer focus:bg-[#0000] xl:hover:bg-[#0000] xl:hover:border-[#8c8888] focus:border-[#8c8888] xl:hover:text-black focus:text-black xl:hover:rounded-tl-[1.875rem] focus:rounded-tl-[1.875rem] xl:hover:rounded-tr-[1.875rem] focus:rounded-tr-[1.875rem] xl:hover:rounded-bl-none focus:rounded-bl-none xl:hover:rounded-br-none focus:rounded-br-none group font-nunito">
              {auth.user.name}
              <MdOutlineKeyboardArrowDown />
              <div className="bg-[#0000] border border-[#8c8888] rounded-br-[1.875rem] rounded-bl-[1.875rem] text-[#000] left-0 p-2 absolute text-center top-[2.975rem] w-full hidden group-focus:block xl:group-hover:block">
                <Link className="text-title text-[0.688rem] uppercase block transition-all duration-[0.3s] ease-in-out hover:text-secondary py-0.5" to={"/pay-history/"} onClick={handleMenuClose}>
                  Pay History
                </Link>
                <Link className="text-title text-[0.688rem] uppercase block transition-all duration-[0.3s] ease-in-out hover:text-secondary py-0.5" to={"/support/"} onClick={handleMenuClose}>
                  Support
                </Link>
                <Link className="text-title text-[0.688rem] uppercase block transition-all duration-[0.3s] ease-in-out hover:text-secondary py-0.5" to={"/"} onClick={handleMenuClose}>
                  Logout
                </Link>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex lg:hidden flex-row flex-wrap justify-center items-center gap-x-4 text-base font-normal">
          <Link className="py-3 px-10 border border-primary rounded-full uppercase text-black transition-all duration-500 hover:bg-gradient-to-r hover:from-primary hover:to-secondary" to={"/login/"} onClick={handleMenuClose}>
            login
          </Link>
          <Link
            className="py-3 px-10 border border-transparent rounded-full uppercase text-black bg-gradient-to-r from-primary to-secondary transition-all duration-500 hover:bg-none hover:border-primary"
            to={"/register/"} onClick={handleMenuClose}
          >
            sign up
          </Link>
        </div>
      )}
    </div>
  );
};

