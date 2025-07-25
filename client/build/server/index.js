import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, json } from "@remix-run/node";
import { RemixServer, useNavigate, Link, Meta, Links, ScrollRestoration, Scripts, Outlet, useParams, useLoaderData } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useDispatch, useSelector, Provider } from "react-redux";
import { createSlice, configureStore } from "@reduxjs/toolkit";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import React, { useState, useEffect } from "react";
import { HiMiniHome as HiMiniHome$1 } from "react-icons/hi2";
import { IoMdEyeOff, IoMdNotifications } from "react-icons/io";
import { MdArrowRightAlt, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiMenu3Fill, RiFacebookCircleLine, RiTwitterXFill } from "react-icons/ri";
import { FaInstagram } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";
import { IoEye, IoCloseOutline } from "react-icons/io5";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat.js";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import relativeTime from "dayjs/plugin/relativeTime.js";
import ResponsivePagination from "react-responsive-pagination";
import CountryList from "country-list";
import PhoneInput from "react-phone-number-input";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const MEDIA_URL = void 0;
const SERVER_URL = void 0;
let initialState = {
  user: null,
  tokens: {
    access_token: null,
    refresh_token: null
  }
};
if (typeof window !== "undefined") {
  const storedAuth = localStorage.getItem("auth");
  if (storedAuth) {
    const parsed = JSON.parse(storedAuth);
    if (parsed && parsed.tokens) {
      initialState = parsed;
    }
  }
}
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.tokens.access_token = action.payload.tokens.access_token;
      state.tokens.refresh_token = action.payload.tokens.refresh_token;
      if (typeof window !== "undefined") {
        localStorage.setItem("auth", JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.user = null;
      state.tokens.access_token = null;
      state.tokens.refresh_token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth");
      }
    }
  }
});
const { setAuth, logout } = authSlice.actions;
const authReducer = authSlice.reducer;
const baseQuery = fetchBaseQuery({
  baseUrl: SERVER_URL,
  prepareHeaders: (headers, api) => {
    var _a, _b;
    const token = (_b = (_a = api.getState().auth) == null ? void 0 : _a.tokens) == null ? void 0 : _b.access_token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  }
});
const verifyAccessToken = async (accessToken, api, extraOptions) => {
  const result = await baseQuery(
    {
      url: "/token/verify/",
      method: "POST",
      body: { token: accessToken }
    },
    api,
    extraOptions
  );
  return !(result.error && result.error.status === 401);
};
const baseQueryWithReauth = async (args, api, extraOptions) => {
  var _a, _b;
  if (typeof args === "string") {
    args = { url: args };
  }
  const state = api.getState();
  let accessToken = state.auth.tokens.access_token;
  const refreshToken = state.auth.tokens.refresh_token;
  if (accessToken) {
    const isValid = await verifyAccessToken(accessToken, api, extraOptions);
    if (!isValid) {
      console.warn("Access token invalid. Will attempt refresh...");
      accessToken = void 0;
    }
  }
  let headers = {
    ...args.headers ?? {}
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }
  let result = await baseQuery({ ...args, headers }, api, extraOptions);
  if (((_a = result == null ? void 0 : result.error) == null ? void 0 : _a.status) === 401 && refreshToken) {
    console.warn("Access token expired. Trying to refresh...");
    const refreshResult = await baseQuery(
      {
        url: "/token/refresh/",
        method: "POST",
        body: { refresh: refreshToken }
      },
      api,
      extraOptions
    );
    const newAccessToken = (_b = refreshResult.data) == null ? void 0 : _b.access;
    if (newAccessToken) {
      accessToken = newAccessToken;
      api.dispatch(
        setAuth({
          user: state.auth.user,
          tokens: {
            access_token: newAccessToken,
            refresh_token: refreshToken
          }
        })
      );
      headers["Authorization"] = `Bearer ${newAccessToken}`;
      result = await baseQuery({ ...args, headers }, api, extraOptions);
    } else {
      console.error("Refresh token expired or invalid. Logging out...");
      localStorage.removeItem("auth");
      api.dispatch(logout());
    }
  } else if (!refreshToken) {
    console.warn("No refresh token found. Logging out...");
    localStorage.removeItem("auth");
    api.dispatch(logout());
  }
  return result;
};
const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({})
});
const popupSlice = createSlice({
  name: "popup",
  initialState: {
    channel: false,
    seemore: false,
    footer_seemore: false
  },
  reducers: {
    openChannel: (state) => {
      state.channel = true;
    },
    closeChannel: (state) => {
      state.channel = false;
    },
    openSeeMore: (state) => {
      state.seemore = true;
    },
    closeSeeMore: (state) => {
      state.seemore = false;
    },
    openFooterSeeMore: (state) => {
      state.footer_seemore = true;
    },
    closeFooterSeeMore: (state) => {
      state.footer_seemore = false;
    }
  }
});
const {
  openChannel,
  closeChannel,
  openSeeMore,
  closeSeeMore,
  openFooterSeeMore,
  closeFooterSeeMore
} = popupSlice.actions;
const popupSlice$1 = popupSlice.reducer;
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    popup: popupSlice$1
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== "production"
});
const configurationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLogo: builder.query({
      query: () => "/configuration/logo/"
    }),
    getFooterLogo: builder.query({
      query: () => "/configuration/footer-logo/"
    }),
    getContactInfo: builder.query({
      query: () => "/configuration/contact-info/"
    }),
    getSocialLink: builder.query({
      query: () => "/configuration/social-link"
    }),
    getCopyRight: builder.query({
      query: () => "/configuration/copy-right/"
    }),
    getLegalDisclaimer: builder.query({
      query: () => "/configuration/legal-disclaimer/"
    }),
    getCryptoTrades: builder.query({
      query: () => "/configuration/crypto-trades/"
    }),
    getStockCommoditiesTrades: builder.query({
      query: () => "/configuration/stock-commodities-trades/"
    }),
    getMarketUpdates: builder.query({
      query: () => "configuration/market-updates/"
    }),
    getEducation: builder.query({
      query: () => "/configuration/education/"
    }),
    getEcommerceService: builder.query({
      query: () => "/configuration/ecommerce-service/"
    })
  })
});
const {
  useGetLogoQuery,
  useGetFooterLogoQuery,
  useGetContactInfoQuery,
  useGetSocialLinkQuery,
  useGetCopyRightQuery,
  useGetLegalDisclaimerQuery,
  useGetCryptoTradesQuery,
  useGetStockCommoditiesTradesQuery,
  useGetMarketUpdatesQuery,
  useGetEducationQuery,
  useGetEcommerceServiceQuery
} = configurationApi;
const ReactIcons = {
  HiMiniHome: HiMiniHome$1,
  IoMdNotifications,
  MdOutlineKeyboardArrowDown,
  RiFacebookCircleLine,
  FaInstagram,
  RiTwitterXFill,
  CiLinkedin,
  IoEye,
  IoMdEyeOff,
  RiMenu3Fill,
  IoCloseOutline,
  MdArrowRightAlt
};
const { HiMiniHome } = ReactIcons;
const NONAUTHMenu = [
  {
    id: 1,
    name: void 0,
    path: "/",
    icon: /* @__PURE__ */ jsx(HiMiniHome, { className: "text-lg" })
  },
  {
    id: 2,
    name: "channels",
    path: void 0,
    icon: void 0
  },
  {
    id: 3,
    name: "services",
    path: "/#services",
    icon: void 0
  },
  {
    id: 4,
    name: "about",
    path: "/#about",
    icon: void 0
  },
  {
    id: 5,
    name: "e-commerce",
    path: "/e-commerce/",
    icon: void 0
  },
  {
    id: 6,
    name: "Crypto",
    path: "/crypto/subscription/",
    icon: void 0
  }
];
const Menu = [
  {
    id: 1,
    name: void 0,
    path: "/",
    icon: /* @__PURE__ */ jsx(HiMiniHome, { className: "text-lg" })
  },
  {
    id: 2,
    name: "channels",
    path: void 0,
    icon: void 0
  },
  {
    id: 3,
    name: "services",
    path: "/#services",
    icon: void 0
  },
  {
    id: 4,
    name: "about",
    path: "/#about",
    icon: void 0
  },
  {
    id: 5,
    name: "e-commerce",
    path: "/e-commerce/",
    icon: void 0
  },
  {
    id: 7,
    name: "Crypto",
    path: "/crypto/subscription/",
    icon: void 0
  },
  {
    id: 8,
    name: "subscription",
    path: "/subscription/",
    icon: void 0
  },
  {
    id: 9,
    name: "dashboard",
    path: "/dashboard/",
    icon: void 0
  }
];
const pagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPages: builder.query({
      query: () => "/pages/all/"
    })
  })
});
const { useGetPagesQuery } = pagesApi;
const MobileMenu = ({ setIsMenuShow }) => {
  var _a, _b;
  const { data: headerMenus } = useGetPagesQuery(void 0, {
    refetchOnMountOrArgChange: true
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { IoMdNotifications: IoMdNotifications2, MdOutlineKeyboardArrowDown: MdOutlineKeyboardArrowDown2 } = ReactIcons;
  const handleMenuClose = () => {
    setIsMenuShow(false);
  };
  const handleSmoothScroll = (id) => {
    navigate("/");
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
    setIsMenuShow(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap w-full gap-y-2.5 py-5", children: [
    /* @__PURE__ */ jsx("nav", { className: "flex flex-col flex-wrap py-1.5 px-2.5 rounded-xl text-white bg-section-title", children: /* @__PURE__ */ jsx("ul", { className: "flex flex-col flex-wrap items-center gap-y-2.5", children: (auth == null ? void 0 : auth.tokens) && auth.user ? /* @__PURE__ */ jsxs(Fragment, { children: [
      Menu == null ? void 0 : Menu.map((item) => {
        var _a2;
        return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
          Link,
          {
            className: "rounded-full text-title py-1.5 px-3.5 flex flex-row flex-wrap items-center capitalize transition-all duration-500 hover:bg-gradient-to-r hover:from-yellow-700 hover:to-red-400",
            to: item.path ? item.path : "#",
            onClick: ((_a2 = item.path) == null ? void 0 : _a2.startsWith("/#")) ? () => handleSmoothScroll(item.path || "") : void 0,
            children: [
              item.icon && item.icon,
              item.name
            ]
          }
        ) }, item.id);
      }),
      (_a = headerMenus == null ? void 0 : headerMenus.results) == null ? void 0 : _a.map((item) => {
        return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          Link,
          {
            to: item.menu.slug || "#",
            className: "text-title hover:text-white rounded-full py-1.5 px-3.5 flex items-center capitalize transition-all duration-300 hover:bg-gradient-to-r hover:from-yellow-700 hover:to-red-400 ease-linear",
            onClick: handleMenuClose,
            children: item.menu.name
          }
        ) });
      })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      NONAUTHMenu == null ? void 0 : NONAUTHMenu.map((item) => {
        var _a2;
        return /* @__PURE__ */ jsx("li", { children: item.name === "channels" ? /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              dispatch(openChannel());
              setIsMenuShow(false);
            },
            className: "rounded-full text-title py-1.5 px-3.5 flex items-center capitalize transition-all duration-500 hover:bg-gradient-to-r  hover:from-yellow-700 hover:to-red-400 cursor-pointer",
            children: [
              item.icon && item.icon,
              item.name
            ]
          }
        ) : ((_a2 = item.path) == null ? void 0 : _a2.startsWith("/#")) ? /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              navigate("/");
              setTimeout(() => {
                if (item.path) {
                  const element = document.getElementById(item.path.replace("/#", ""));
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }
              }, 100);
              setIsMenuShow(false);
            },
            className: "rounded-full text-title py-1.5 px-3.5 flex items-center capitalize transition-all duration-500 hover:bg-gradient-to-r  hover:from-yellow-700 hover:to-red-400 cursor-pointer",
            children: [
              item.icon && item.icon,
              item.name
            ]
          }
        ) : /* @__PURE__ */ jsxs(
          Link,
          {
            to: item.path || "#",
            className: "rounded-full text-title py-1.5 px-3.5 flex items-center capitalize transition-all duration-500 hover:bg-gradient-to-r  hover:from-yellow-700 hover:to-red-400",
            onClick: handleMenuClose,
            children: [
              item.icon && item.icon,
              item.name
            ]
          }
        ) }, item.id);
      }),
      (_b = headerMenus == null ? void 0 : headerMenus.results) == null ? void 0 : _b.map((item) => {
        return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          Link,
          {
            to: item.menu.slug || "#",
            className: "text-title hover:text-white rounded-full py-1.5 px-3.5 flex items-center capitalize transition-all duration-300 hover:bg-gradient-to-r hover:from-yellow-700 hover:to-red-400 ease-linear",
            onClick: handleMenuClose,
            children: item.menu.name
          }
        ) });
      })
    ] }) }) }),
    auth.tokens && auth.user ? /* @__PURE__ */ jsxs("div", { className: "flex flex-row flex-wrap items-center justify-center", children: [
      /* @__PURE__ */ jsx(Link, { className: "p-2.5", to: "/", onClick: handleMenuClose, children: /* @__PURE__ */ jsx(IoMdNotifications2, { className: "text-2xl" }) }),
      /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsxs("button", { className: "text-sm py-[0.688rem] px-[2.125rem] rounded-[1.875rem] uppercase text-white border border-secondary bg-secondary transition-all duration-[0.3s] flex items-center gap-2 leading-normal font-normal cursor-pointer focus:bg-[#0000] xl:hover:bg-[#0000] xl:hover:border-[#8c8888] focus:border-[#8c8888] xl:hover:text-black focus:text-black xl:hover:rounded-tl-[1.875rem] focus:rounded-tl-[1.875rem] xl:hover:rounded-tr-[1.875rem] focus:rounded-tr-[1.875rem] xl:hover:rounded-bl-none focus:rounded-bl-none xl:hover:rounded-br-none focus:rounded-br-none group font-nunito", children: [
        auth.user.name,
        /* @__PURE__ */ jsx(MdOutlineKeyboardArrowDown2, {}),
        /* @__PURE__ */ jsxs("div", { className: "bg-[#0000] border border-[#8c8888] rounded-br-[1.875rem] rounded-bl-[1.875rem] text-[#000] left-0 p-2 absolute text-center top-[2.975rem] w-full hidden group-focus:block xl:group-hover:block", children: [
          /* @__PURE__ */ jsx(Link, { className: "text-title text-[0.688rem] uppercase block transition-all duration-[0.3s] ease-in-out hover:text-secondary py-0.5", to: "/pay-history/", onClick: handleMenuClose, children: "Pay History" }),
          /* @__PURE__ */ jsx(Link, { className: "text-title text-[0.688rem] uppercase block transition-all duration-[0.3s] ease-in-out hover:text-secondary py-0.5", to: "/support/", onClick: handleMenuClose, children: "Support" }),
          /* @__PURE__ */ jsx(Link, { className: "text-title text-[0.688rem] uppercase block transition-all duration-[0.3s] ease-in-out hover:text-secondary py-0.5", to: "/", onClick: handleMenuClose, children: "Logout" })
        ] })
      ] }) })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "mt-4 flex lg:hidden flex-row flex-wrap justify-center items-center gap-x-4 text-base font-normal", children: [
      /* @__PURE__ */ jsx(Link, { className: "py-3 px-10 border border-primary rounded-full uppercase text-black transition-all duration-500 hover:bg-gradient-to-r hover:from-primary hover:to-secondary", to: "/login/", onClick: handleMenuClose, children: "login" }),
      /* @__PURE__ */ jsx(
        Link,
        {
          className: "py-3 px-10 border border-transparent rounded-full uppercase text-black bg-gradient-to-r from-primary to-secondary transition-all duration-500 hover:bg-none hover:border-primary",
          to: "/register/",
          onClick: handleMenuClose,
          children: "sign up"
        }
      )
    ] })
  ] });
};
const Header = () => {
  var _a, _b, _c;
  const [isMenuShow, setIsMenuShow] = useState(false);
  const {
    IoMdNotifications: IoMdNotifications2,
    MdOutlineKeyboardArrowDown: MdOutlineKeyboardArrowDown2,
    RiMenu3Fill: RiMenu3Fill2,
    IoCloseOutline: IoCloseOutline2
  } = ReactIcons;
  const { data } = useGetLogoQuery(void 0, {
    refetchOnMountOrArgChange: true
  });
  const { data: headerMenus } = useGetPagesQuery(void 0, {
    refetchOnMountOrArgChange: true
  });
  const Logo = (_a = data == null ? void 0 : data.data) == null ? void 0 : _a.logo;
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChannelClick = () => {
    dispatch(openChannel());
  };
  const handleSmoothScroll = (id) => {
    navigate("/");
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };
  const handleLogout = () => {
    dispatch(logout());
  };
  const renderMenuItems = (menuList) => menuList.map((item) => {
    var _a2;
    return /* @__PURE__ */ jsx("li", { children: item.name === "channels" ? /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: handleChannelClick,
        className: "text-title hover:text-white rounded-full py-1.5 px-3.5 flex items-center capitalize transition-all duration-300 hover:bg-gradient-to-r hover:from-yellow-700 hover:to-red-400 cursor-pointer ease-linear",
        children: [
          item.icon && item.icon,
          item.name
        ]
      }
    ) : ((_a2 = item.path) == null ? void 0 : _a2.startsWith("/#")) ? /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => item.path && handleSmoothScroll(item.path.replace("/#", "")),
        className: "text-title hover:text-white rounded-full py-1.5 px-3.5 flex items-center capitalize transition-all duration-300 hover:bg-gradient-to-r hover:from-yellow-700 hover:to-red-400 cursor-pointer ease-linear",
        children: [
          item.icon && item.icon,
          item.name
        ]
      }
    ) : /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(
      Link,
      {
        to: item.path || "#",
        className: "text-title hover:text-white rounded-full py-1.5 px-3.5 flex items-center capitalize transition-all duration-300 hover:bg-gradient-to-r hover:from-yellow-700 hover:to-red-400 ease-linear",
        children: [
          item.icon && item.icon,
          item.name
        ]
      }
    ) }) }, item.id);
  });
  return /* @__PURE__ */ jsx("header", { className: "relative top-0 left-0 right-0 py-5 w-full", children: /* @__PURE__ */ jsxs("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row flex-wrap items-center justify-between w-full", children: [
      /* @__PURE__ */ jsx(Link, { className: "block w-fit", to: "/", children: /* @__PURE__ */ jsx(
        "img",
        {
          className: "w-28 sm:w-28 md:w-32 lg:w-40",
          src: `${MEDIA_URL}${Logo}`,
          alt: "bijolis",
          loading: "lazy",
          decoding: "async"
        }
      ) }),
      /* @__PURE__ */ jsx("nav", { className: "hidden lg:flex flex-col flex-wrap py-1.5 px-2.5 rounded-full text-white bg-section-title", children: /* @__PURE__ */ jsxs("ul", { className: "flex flex-row flex-wrap items-center gap-x-2.5", children: [
        (auth == null ? void 0 : auth.tokens) && auth.user ? renderMenuItems(Menu) : renderMenuItems(NONAUTHMenu),
        (_b = headerMenus == null ? void 0 : headerMenus.results) == null ? void 0 : _b.map((item) => {
          return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            Link,
            {
              to: item.menu.slug || "#",
              className: "text-title hover:text-white rounded-full py-1.5 px-3.5 flex items-center capitalize transition-all duration-300 hover:bg-gradient-to-r hover:from-yellow-700 hover:to-red-400 ease-linear",
              children: item.menu.name
            }
          ) });
        })
      ] }) }),
      auth.tokens && auth.user ? /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex flex-row flex-wrap items-center", children: [
        /* @__PURE__ */ jsx(Link, { className: "p-2.5", to: "/", children: /* @__PURE__ */ jsx(IoMdNotifications2, { className: "text-2xl" }) }),
        /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsxs(
          "div",
          {
            role: "button",
            className: "py-[0.688rem] px-[2.125rem] pr-6 rounded-[1.875rem] uppercase text-white border border-secondary bg-secondary transition-all duration-[0.3s] flex items-center text-base leading-normal font-normal cursor-pointer focus:bg-[#0000] xl:hover:bg-[#0000] xl:hover:border-primary focus:border-primary xl:hover:text-black focus:text-black xl:hover:rounded-tl-[1.875rem] focus:rounded-tl-[1.875rem] xl:hover:rounded-tr-[1.875rem] focus:rounded-tr-[1.875rem] xl:hover:rounded-bl-none focus:rounded-bl-none xl:hover:rounded-br-none focus:rounded-br-none group font-nunito",
            children: [
              (_c = auth == null ? void 0 : auth.user) == null ? void 0 : _c.name,
              /* @__PURE__ */ jsx(MdOutlineKeyboardArrowDown2, {}),
              /* @__PURE__ */ jsxs("div", { className: "bg-[#0000] border border-primary rounded-br-[1.875rem] rounded-bl-[1.875rem] text-[#000] left-0 p-2 absolute text-center top-[2.975rem] w-full hidden group-focus:block xl:group-hover:block z-20", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    className: "text-title text-[0.688rem] uppercase block hover:text-secondary py-0.5",
                    to: "/pay-history/",
                    children: "Pay History"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    className: "text-title text-[0.688rem] uppercase block hover:text-secondary py-0.5",
                    to: "/support/",
                    children: "Support"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "text-title text-[0.688rem] w-full uppercase block hover:text-secondary py-0.5 cursor-pointer",
                    type: "button",
                    onClick: handleLogout,
                    children: "Logout"
                  }
                )
              ] })
            ]
          }
        ) })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex flex-row flex-wrap items-center gap-x-8 text-base font-normal", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            className: "py-3 px-10 border border-primary rounded-full uppercase text-black transition-all duration-500 hover:bg-gradient-to-r hover:from-primary hover:to-secondary",
            to: "/login/",
            children: "login"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            className: "py-3 px-10 border border-transparent rounded-full uppercase text-black bg-gradient-to-r from-primary to-secondary transition-all duration-500 hover:bg-none hover:border-primary",
            to: "/register/",
            children: "sign up"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "block lg:hidden",
          type: "button",
          onClick: () => setIsMenuShow(!isMenuShow),
          children: isMenuShow ? /* @__PURE__ */ jsx(IoCloseOutline2, { className: "text-3xl sm:text-4xl" }) : /* @__PURE__ */ jsx(RiMenu3Fill2, { className: "text-2xl sm:text-3xl" })
        }
      )
    ] }),
    isMenuShow && /* @__PURE__ */ jsx(MobileMenu, { setIsMenuShow })
  ] }) });
};
const channelsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChannels: builder.query({
      query: () => "/channels/data/"
    })
  })
});
const { useGetChannelsQuery } = channelsApi;
const Channels = () => {
  var _a, _b, _c, _d, _e;
  const { data } = useGetChannelsQuery(void 0, {
    refetchOnMountOrArgChange: true
  });
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(closeChannel());
  };
  return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center fixed w-screen h-screen top-0 left-0 z-10 bg-[#00000080] transition-all duration-[.15s] ease-linear p-3 overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-primary to-secondary rounded-[22px] p-[5px] max-w-[50rem] w-full border border-[#00000033]", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-[20px] p-[1.625rem] px-4 md:p-[1.625rem] flex flex-col relative", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "cursor-pointer absolute right-2 md:right-4 top-2 md:top-[1.625rem]",
        onClick: handleClose,
        children: /* @__PURE__ */ jsx(
          "svg",
          {
            className: "w-[0.859rem] fill-[#858796]",
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 384 512",
            children: /* @__PURE__ */ jsx("path", { d: "M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" })
          }
        )
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx(
      "video",
      {
        className: "max-w-[23.75rem] w-full rounded",
        controls: true,
        loop: true,
        src: `${MEDIA_URL}${(_a = data == null ? void 0 : data.data) == null ? void 0 : _a.video}`
      }
    ) }),
    /* @__PURE__ */ jsx("h2", { className: "text-transparent capitalize bg-gradient-to-r from-primary to-secondary bg-clip-text text-[2.5rem] font-bold text-center leading-normal", children: (_b = data == null ? void 0 : data.data) == null ? void 0 : _b.title }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "text-editor max-w-[31.25rem] mx-auto text-center",
        dangerouslySetInnerHTML: { __html: (_c = data == null ? void 0 : data.data) == null ? void 0 : _c.description }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2.5 mt-[1.875rem] md:gap-4 md:flex-row md:justify-center", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          className: "text-[1.063rem] md:text-xl leading-normal text-white rounded-[1.875rem] py-[0.938rem] px-[1.563rem] bg-gradient-to-r from-primary to-secondary text-center min-w-[14.25rem] uppercase transition-all duration-300 ease-in-out hover:bg-none hover:text-[#140751] outline-none border border-primary",
          to: (_d = data == null ? void 0 : data.data) == null ? void 0 : _d.insta_broadcast,
          target: "_blank",
          children: "Insta Broadcast"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          className: "text-[1.063rem] md:text-xl leading-normal hover:text-white rounded-[1.875rem] py-[0.938rem] px-[1.563rem] hover:bg-gradient-to-r from-primary to-secondary text-center min-w-[14.25rem] uppercase transition-all duration-300 ease-in-out bg-none text-[#140751] outline-none border border-primary",
          to: (_e = data == null ? void 0 : data.data) == null ? void 0 : _e.fb_broadcast,
          target: "_blank",
          children: "FB Broadcast"
        }
      )
    ] })
  ] }) }) });
};
const homepageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBanner: builder.query({
      query: () => "/homepage/banner/"
    }),
    getTeam: builder.query({
      query: () => "/homepage/teams/"
    }),
    getWhy_us: builder.query({
      query: () => "/homepage/why-choose-us/"
    })
  })
});
const {
  useGetBannerQuery,
  useGetTeamQuery,
  useGetWhy_usQuery
} = homepageApi;
const SeeMore = () => {
  var _a;
  const { data } = useGetBannerQuery(void 0, {
    refetchOnMountOrArgChange: true
  });
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(closeSeeMore());
  };
  console.log(data);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed w-screen h-screen top-0 left-0 z-10 bg-[#00000080] transition-all duration-[.15s] ease-linear p-3 flex justify-center items-center overflow-y-auto",
      id: "seemore-popup",
      children: /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-primary to-secondary rounded-[22px] p-[5px] max-w-[50rem] w-full border border-[#00000033]", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-[20px] p-[3.125rem] px-4 md:px-[1.625rem] flex flex-col relative", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "cursor-pointer absolute right-4 top-[1.625rem]",
            onClick: handleClose,
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                className: "w-[0.859rem] fill-[#858796]",
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 384 512",
                children: /* @__PURE__ */ jsx("path", { d: "M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" })
              }
            )
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "space-y-[0.313rem]", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "text-editor",
            dangerouslySetInnerHTML: {
              __html: (_a = data == null ? void 0 : data.data) == null ? void 0 : _a.see_more_description
            }
          }
        ) })
      ] }) })
    }
  );
};
const Footer = () => {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  console.log("Rasel Mahmud");
  const navigate = useNavigate();
  const { data: footerLogo } = useGetFooterLogoQuery(void 0, { refetchOnMountOrArgChange: true });
  const { data: contactInfo } = useGetContactInfoQuery(void 0, { refetchOnMountOrArgChange: true });
  const { data: socialLink } = useGetSocialLinkQuery(void 0, { refetchOnMountOrArgChange: true });
  const { data: copyRight } = useGetCopyRightQuery(void 0, { refetchOnMountOrArgChange: true });
  const { data: legalDisclaimer } = useGetLegalDisclaimerQuery(void 0, { refetchOnMountOrArgChange: true });
  const { RiFacebookCircleLine: RiFacebookCircleLine2, FaInstagram: FaInstagram2, RiTwitterXFill: RiTwitterXFill2, CiLinkedin: CiLinkedin2 } = ReactIcons;
  const dispatch = useDispatch();
  const contact = (_a = contactInfo == null ? void 0 : contactInfo.data) == null ? void 0 : _a[0];
  const social = (_b = socialLink == null ? void 0 : socialLink.data) == null ? void 0 : _b[0];
  return /* @__PURE__ */ jsx("footer", { className: "relative top-0 left-0 right-0 py-5 lg:py-10 w-full text-white bg-gradient-to-r from-primary to-secondary", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 w-full pb-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap gap-y-5 w-full", children: [
        /* @__PURE__ */ jsx(Link, { className: "block w-fit", to: "/", children: /* @__PURE__ */ jsx("img", { className: "w-24 sm:w-28 md:w-32 lg:w-40", src: `${MEDIA_URL}${(_c = footerLogo == null ? void 0 : footerLogo.data) == null ? void 0 : _c.logo}`, alt: "bijolis", loading: "lazy", decoding: "async" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-black font-normal line-clamp-4", dangerouslySetInnerHTML: { __html: (_d = footerLogo == null ? void 0 : footerLogo.data) == null ? void 0 : _d.description } })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap gap-y-2.5 lg:gap-y-5 w-full", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-lg font-medium uppercase", children: "Resources" }),
        /* @__PURE__ */ jsxs("ul", { className: "flex flex-col flex-wrap gap-y-1.5 lg:gap-y-2.5 w-full text-sm lg:text-base font-normal text-black", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                navigate("/");
                setTimeout(() => {
                  const el = document.getElementById("about");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 100);
              },
              className: "text-left cursor-pointer text-black duration-300 ease-linear hover:translate-x-2 transition-transform",
              children: "About"
            }
          ) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                navigate("/");
                setTimeout(() => {
                  const el = document.getElementById("services");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 100);
              },
              className: "text-left cursor-pointer text-black duration-300 ease-linear hover:translate-x-2 transition-transform",
              children: "Services"
            }
          ) }),
          /* @__PURE__ */ jsx("li", { className: "text-left cursor-pointer duration-300 ease-linear hover:translate-x-2 transition-transform", children: /* @__PURE__ */ jsx(Link, { className: "text-black", to: "/terms-and-conditions/", children: "Terms & conditions" }) }),
          /* @__PURE__ */ jsx("li", { className: "text-left cursor-pointer duration-300 ease-linear hover:translate-x-2 transition-transform", children: /* @__PURE__ */ jsx(Link, { className: "text-black", to: "/privacy-policy/", children: "Privacy Policy" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap gap-y-2.5 lg:gap-y-5 w-full", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm lg:text-lg font-medium uppercase", children: "Official Info" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap gap-y-2.5 w-full text-black", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-row flex-wrap items-center gap-x-2.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm lg:text-base font-normal", children: "Address : " }),
            /* @__PURE__ */ jsx("span", { className: "text-sm lg:text-base font-normal", children: contact == null ? void 0 : contact.address })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-row flex-wrap items-center gap-x-2.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm lg:text-base font-normal", children: "Email : " }),
            /* @__PURE__ */ jsx(Link, { className: "text-sm lg:text-base font-normal text-black", to: `mailto:${contact == null ? void 0 : contact.email}`, target: "_blank", children: contact == null ? void 0 : contact.email })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-row flex-wrap items-center gap-x-2.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm lg:text-base font-normal", children: "Number : " }),
            /* @__PURE__ */ jsx(Link, { className: "text-sm lg:text-base font-normal text-black", to: `tel:${contact == null ? void 0 : contact.number}`, target: "_blank", children: contact == null ? void 0 : contact.number })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap gap-y-2.5 lg:gap-y-5 w-full", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm lg:text-lg font-medium uppercase", children: "social link" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-row flex-wrap items-center gap-x-2.5 lg:gap-x-5", children: [
          /* @__PURE__ */ jsx(Link, { to: social == null ? void 0 : social.facebook, target: "_blank", children: /* @__PURE__ */ jsx(RiFacebookCircleLine2, { className: "text-xl lg:text-3xl text-black duration-300 ease-linear hover:-translate-y-2 transition-transform" }) }),
          /* @__PURE__ */ jsx(Link, { to: social == null ? void 0 : social.instagram, target: "_blank", children: /* @__PURE__ */ jsx(FaInstagram2, { className: "text-xl lg:text-3xl text-black duration-300 ease-linear hover:-translate-y-2 transition-transform" }) }),
          /* @__PURE__ */ jsx(Link, { to: social == null ? void 0 : social.twitter, target: "_blank", children: /* @__PURE__ */ jsx(RiTwitterXFill2, { className: "text-xl lg:text-3xl text-black duration-300 ease-linear hover:-translate-y-2 transition-transform" }) }),
          /* @__PURE__ */ jsx(Link, { to: social == null ? void 0 : social.linkedin, target: "_blank", children: /* @__PURE__ */ jsx(CiLinkedin2, { className: "text-xl lg:text-3xl text-black duration-300 ease-linear hover:-translate-y-2 transition-transform" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap justify-center items-center py-5 w-full border-t border-b border-black text-black", children: /* @__PURE__ */ jsxs("p", { className: "text-xs lg:text-sm font-normal text-center", children: [
      (_e = copyRight == null ? void 0 : copyRight.data) == null ? void 0 : _e.text,
      " ",
      /* @__PURE__ */ jsx(Link, { className: "font-medium text-base text-red-500", to: "https://dreamlabit.com/", target: "_blank", children: "Dreamlabit" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap justify-center items-center gap-y-2.5 lg:gap-y-5 py-5 w-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap justify-center items-center gap-y-2.5", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm lg:text-lg font-medium text-center", children: (_f = legalDisclaimer == null ? void 0 : legalDisclaimer.data) == null ? void 0 : _f.title }),
        /* @__PURE__ */ jsx("span", { className: "text-sm lg:text-base font-normal text-black", children: (_g = legalDisclaimer == null ? void 0 : legalDisclaimer.data) == null ? void 0 : _g.updated_date })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap items-center justify-center w-full lg:w-[65%]", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs lg:text-sm font-normal text-justify lg:text-center text-black", children: (_h = legalDisclaimer == null ? void 0 : legalDisclaimer.data) == null ? void 0 : _h.short_description }),
        " ",
        /* @__PURE__ */ jsx("span", { className: "underline cursor-pointer text-title font-bold", onClick: () => dispatch(openFooterSeeMore()), children: "See More" })
      ] })
    ] })
  ] }) }) });
};
const FooterSeeMore = () => {
  var _a;
  const { data: legalDisclaimer } = useGetLegalDisclaimerQuery(void 0, {
    refetchOnMountOrArgChange: true
  });
  const dispatch = useDispatch();
  return /* @__PURE__ */ jsx("div", { className: "fixed w-screen h-screen top-0 left-0 z-10 bg-[#00000080] transition-all duration-[.15s] ease-linear p-3 flex justify-center items-start overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-primary to-secondary rounded-[22px] p-[5px] max-w-[50rem] w-full border border-[#00000033]", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-[20px] px-4 py-[3.125rem] md:px-[1.625rem] flex flex-col relative", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "cursor-pointer absolute right-4 top-[1.625rem]",
        type: "button",
        onClick: () => dispatch(closeFooterSeeMore()),
        children: /* @__PURE__ */ jsx(
          "svg",
          {
            className: "w-[0.859rem] fill-[#858796]",
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 384 512",
            children: /* @__PURE__ */ jsx("path", { d: "M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" })
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "text-editor",
        dangerouslySetInnerHTML: {
          __html: (_a = legalDisclaimer == null ? void 0 : legalDisclaimer.data) == null ? void 0 : _a.description
        }
      }
    )
  ] }) }) });
};
const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Jost:wght@400;500;700&family=Nunito:wght@400;600;700&display=swap"
  }
];
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx("link", { rel: "icon", type: "image/x-icon", href: "/bjollys-favicon.png" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(Provider, { store, children: /* @__PURE__ */ jsx(AppContent, {}) });
}
function AppContent() {
  const channelOpen = useSelector((state) => state.popup.channel);
  const seemoreOpen = useSelector((state) => state.popup.seemore);
  const footerSeemoreOpen = useSelector((state) => state.popup.footer_seemore);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    channelOpen && /* @__PURE__ */ jsx(Channels, {}),
    seemoreOpen && /* @__PURE__ */ jsx(SeeMore, {}),
    footerSeemoreOpen && /* @__PURE__ */ jsx(FooterSeeMore, {}),
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx(Outlet, {}),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: App,
  links
}, Symbol.toStringTag, { value: "Module" }));
const Field = ({ label, children, htmlFor, error }) => {
  const getChildId = (children2) => {
    var _a;
    const child = React.Children.only(children2);
    return (_a = child == null ? void 0 : child.props) == null ? void 0 : _a.id;
  };
  const id = htmlFor || getChildId(children);
  return /* @__PURE__ */ jsxs(React.Fragment, { children: [
    label && /* @__PURE__ */ jsx("label", { className: "text-sm md:text-base font-medium", htmlFor: id, children: label }),
    children,
    (error == null ? void 0 : error.message) && /* @__PURE__ */ jsx("p", { className: "text-red-500 font-medium text-sm", role: "alert", children: error.message })
  ] });
};
const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addForgotPassword: builder.mutation({
      query: (data) => ({
        url: "/accounts/user/forgot-password/",
        method: "POST",
        body: data
      })
    }),
    addConfirmPassword: builder.mutation({
      query: ({ data, uidb64, token }) => ({
        url: `/accounts/user/reset-password/${uidb64}/${token}/`,
        method: "POST",
        body: data
      })
    }),
    addRegister: builder.mutation({
      query: (data) => ({
        url: "/accounts/user/register/",
        method: "POST",
        body: data
      })
    }),
    addLogin: builder.mutation({
      query: (data) => ({
        url: "/accounts/user/login/",
        method: "POST",
        body: data
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        var _a, _b;
        try {
          const { data } = await queryFulfilled;
          const authData = {
            user: data.data.user,
            tokens: {
              access_token: data.data.tokens.access_token,
              refresh_token: data.data.tokens.refresh_token
            }
          };
          dispatch(setAuth(authData));
        } catch (err) {
          const errorMsg = ((_b = (_a = err == null ? void 0 : err.error) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "Login failed!";
          console.error("Login time error:", errorMsg);
        }
      }
    })
  })
});
const { useAddRegisterMutation, useAddLoginMutation, useAddForgotPasswordMutation, useAddConfirmPasswordMutation } = authApi;
function ConfirmPassword() {
  const navigate = useNavigate();
  const { uidb64, token } = useParams();
  const [addConfirmPassword] = useAddConfirmPasswordMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();
  const onSubmitForm = async (formData) => {
    try {
      if (formData.new_password !== formData.confirm_password) {
        alert("Passwords do not match.");
        return;
      }
      const response = await addConfirmPassword({
        data: { new_password: formData.new_password },
        uidb64,
        token
      });
      if (response.data) {
        alert("Password reset successful.");
        reset();
        navigate("/success-change-password/");
      } else {
        alert("Failed to reset password. Please try again.");
      }
    } catch (error) {
      alert(error.message);
    }
  };
  return /* @__PURE__ */ jsx("section", { className: "relative top-0 left-0 right-0 w-full", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full flex items-center justify-center h-screen", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap w-full lg:w-[40%] py-1.5 px-1.5 rounded-[20px] bg-gradient-to-r from-[#384ef4] to-[#b060ed]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap w-full p-5 bg-white rounded-[18px]", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-blue-600", children: "BJollys" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm mt-1", children: "Set your new password below" })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmitForm), children: [
      /* @__PURE__ */ jsx(Field, { label: "New Password", error: errors.new_password, children: /* @__PURE__ */ jsx("div", { className: "mb-5", children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "password",
          id: "new-password",
          placeholder: "Enter new password",
          className: "w-full text-black/80 placeholder:text-black/80 text-sm font-normal placeholder:text-sm py-4 px-4 bg-gray-300 rounded-md outline-none border-none",
          ...register("new_password", { required: "New password is required" })
        }
      ) }) }),
      /* @__PURE__ */ jsx(Field, { label: "Confirm Password", error: errors.confirm_password, children: /* @__PURE__ */ jsx("div", { className: "mb-5", children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "password",
          id: "confirm-password",
          placeholder: "Re-enter new password",
          className: "w-full text-black/80 placeholder:text-black/80 text-sm font-normal placeholder:text-sm py-4 px-4 bg-gray-300 rounded-md outline-none border-none",
          ...register("confirm_password", { required: "Confirm password is required" })
        }
      ) }) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "w-full text-base font-medium py-4 px-5 rounded-md uppercase transition-all duration-500 bg-gradient-to-r from-[#384ef4] to-[#b060ed] text-white border hover:border-black hover:bg-none hover:text-black",
          children: "Reset Password"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "text-center text-sm text-gray-600 mt-4", children: /* @__PURE__ */ jsxs("p", { children: [
      "Remembered your password? ",
      /* @__PURE__ */ jsx("a", { href: "/login", className: "text-blue-600 hover:underline", children: "Back to login" })
    ] }) })
  ] }) }) }) });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ConfirmPassword
}, Symbol.toStringTag, { value: "Module" }));
function SuccessPasswordChange() {
  return /* @__PURE__ */ jsx("section", { className: "relative top-0 left-0 right-0 w-full", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full flex items-center justify-center h-screen", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap w-full lg:w-[40%] py-1.5 px-1.5 rounded-[20px] bg-gradient-to-r from-[#384ef4] to-[#b060ed]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap w-full p-4 bg-white rounded-[18px] items-center text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-20 w-20 text-green-500 mx-auto", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M9 12l2 2l4 -4m6 2a10 10 0 1 1 -20 0a10 10 0 0 1 20 0z" }) }) }),
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-green-600 mb-2", children: "Password Changed Successfully!" }),
    /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm mb-6", children: "You can now log in with your new password." }),
    /* @__PURE__ */ jsx(
      Link,
      {
        to: "/login",
        className: "inline-block text-base font-medium py-4 px-6 rounded-md uppercase transition-all duration-500 bg-gradient-to-r from-[#384ef4] to-[#b060ed] text-white border hover:border-black hover:bg-none hover:text-black",
        children: "Back to Login"
      }
    )
  ] }) }) }) });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SuccessPasswordChange
}, Symbol.toStringTag, { value: "Module" }));
const termsAndConditionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTermsAndConditionsApi: builder.query({
      query: () => "/terms-condition/data/"
    })
  })
});
const { useGetTermsAndConditionsApiQuery } = termsAndConditionsApi;
function TermsAndConditions() {
  var _a;
  const { data } = useGetTermsAndConditionsApiQuery(void 0, {
    refetchOnMountOrArgChange: true
  });
  return /* @__PURE__ */ jsx("section", { className: "pt-[3.75rem] pb-10", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx(
    "div",
    {
      className: "text-editor",
      dangerouslySetInnerHTML: { __html: (_a = data == null ? void 0 : data.data) == null ? void 0 : _a.body }
    }
  ) }) });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: TermsAndConditions
}, Symbol.toStringTag, { value: "Module" }));
const cryptoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionData: builder.query({
      query: () => "/crypto/subscription/"
    })
  })
});
const { useGetSubscriptionDataQuery } = cryptoApi;
const paymentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCryptoCheckoutSession: builder.mutation({
      query: (data) => ({
        url: "/payments/create-crypto-checkout-session/",
        method: "POST",
        body: data
      })
    }),
    createEcommerceCheckoutSession: builder.mutation({
      query: (data) => ({
        url: "/payments/create-e-commerce-checkout-session/",
        method: "POST",
        body: data
      })
    }),
    getSubscription: builder.query({
      query: () => "/payments/subscription/"
    }),
    getPayment: builder.query({
      query: () => "/payments/all/"
    })
  })
});
const {
  useCreateCryptoCheckoutSessionMutation,
  useCreateEcommerceCheckoutSessionMutation,
  useGetSubscriptionQuery,
  useGetPaymentQuery
} = paymentsApi;
function CryptoSubscription() {
  var _a, _b, _c;
  const auth = useSelector((state) => state.auth);
  const { data: cryptoSubscriptionContent } = useGetSubscriptionDataQuery(void 0, { refetchOnMountOrArgChange: true });
  const { data: subscriptionData } = useGetSubscriptionQuery(void 0, { refetchOnMountOrArgChange: true });
  const [createCheckoutSession, { isLoading }] = useCreateCryptoCheckoutSessionMutation();
  const navigate = useNavigate();
  const handlePayment = async () => {
    var _a2;
    const price = (_a2 = cryptoSubscriptionContent == null ? void 0 : cryptoSubscriptionContent.data) == null ? void 0 : _a2.price;
    if (!price) {
      alert("Price not available.");
      return;
    }
    try {
      const res = await createCheckoutSession({
        amount: price * 100,
        currency: "usd"
      }).unwrap();
      if (res.url) {
        window.location.href = res.url;
      } else {
        alert("Something went wrong. No URL received.");
      }
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Payment failed. Please try again.");
    }
  };
  const handleSubscription = () => {
    var _a2;
    if (!(auth == null ? void 0 : auth.user)) {
      navigate("/login");
      return;
    }
    const lastSubscription2 = (_a2 = subscriptionData == null ? void 0 : subscriptionData.data) == null ? void 0 : _a2[subscriptionData.data.length - 1];
    const isCryptoActive2 = (lastSubscription2 == null ? void 0 : lastSubscription2.subscription_type) === "crypto" && (lastSubscription2 == null ? void 0 : lastSubscription2.status) === "active";
    if (isCryptoActive2) {
      return;
    }
    handlePayment();
  };
  const lastSubscription = (_a = subscriptionData == null ? void 0 : subscriptionData.data) == null ? void 0 : _a[subscriptionData.data.length - 1];
  const isCryptoActive = (lastSubscription == null ? void 0 : lastSubscription.subscription_type) === "crypto" && (lastSubscription == null ? void 0 : lastSubscription.status) === "active";
  return /* @__PURE__ */ jsx("section", { className: "py-[4.375rem]", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "max-w-[62.5rem] mx-auto p-1 rounded-[1.25rem] bg-gradient-to-r from-primary to-secondary", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-[1.125rem] py-5 px-[0.438rem] sm:p-10", children: [
    /* @__PURE__ */ jsx("div", { className: "space-y-2.5", dangerouslySetInnerHTML: { __html: (_b = cryptoSubscriptionContent == null ? void 0 : cryptoSubscriptionContent.data) == null ? void 0 : _b.body } }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
      /* @__PURE__ */ jsx("span", { children: (_c = auth == null ? void 0 : auth.user) == null ? void 0 : _c.email }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "py-2 px-6 rounded-xl sm:text-xl cursor-pointer text-title outline-2 outline-transparent bg-gradient-to-r from-primary to-secondary transition-all duration-500 hover:bg-none hover:outline-primary",
          type: "button",
          disabled: isLoading || isCryptoActive,
          onClick: handleSubscription,
          children: isLoading ? "Processing..." : isCryptoActive ? "ALL READY SUBSCRIBED" : "PAY NOW"
        }
      )
    ] })
  ] }) }) }) });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CryptoSubscription
}, Symbol.toStringTag, { value: "Module" }));
function ForgotPassword() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();
  const [addForgotPassword] = useAddForgotPasswordMutation();
  const onSubmitForm = async (formData) => {
    try {
      const response = await addForgotPassword(formData);
      reset();
      if (response.data) {
        alert("Password reset request successful. Please check your email.");
      } else {
        alert("Failed to send reset link. Please try again.");
      }
    } catch (error) {
      alert(error.message);
    }
  };
  return /* @__PURE__ */ jsx("section", { className: "relative top-0 left-0 right-0 w-full", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full flex items-center justify-center h-screen", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap w-full lg:w-[40%] py-1.5 px-1.5 rounded-[20px] bg-gradient-to-r from-[#384ef4] to-[#b060ed]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap w-full p-4 bg-white rounded-[18px]", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-blue-600", children: "BJollys" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm mt-1", children: "Forgot your password? No worries." })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmitForm), children: [
      /* @__PURE__ */ jsx("div", { className: "mb-5", children: /* @__PURE__ */ jsx(Field, { label: "Email address", error: errors.email, children: /* @__PURE__ */ jsx(
        "input",
        {
          ...register("email", {
            required: "Email is required"
          }),
          type: "email",
          id: "email",
          name: "email",
          placeholder: "you@example.com",
          className: "w-full text-black/80 placeholder:text-black/80 text-sm font-normal placeholder:text-sm py-4 px-4 bg-gray-300 rounded-md outline-none border-none"
        }
      ) }) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "w-full text-base font-medium py-4 px-5 rounded-md uppercase transition-all duration-500 bg-gradient-to-r from-[#384ef4] to-[#b060ed] text-white border hover:border-black hover:bg-none hover:text-black",
          children: "Send Reset Link"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "text-center text-sm text-gray-600 mt-4", children: /* @__PURE__ */ jsxs("p", { children: [
      "Already have an account? ",
      /* @__PURE__ */ jsx("a", { href: "/login", className: "text-blue-600 hover:underline", children: "Back to login" })
    ] }) })
  ] }) }) }) });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ForgotPassword
}, Symbol.toStringTag, { value: "Module" }));
function PaymentSuccess() {
  return /* @__PURE__ */ jsx("section", { className: "min-h-screen flex items-center justify-center bg-[#fffdf2] px-4 sm:px-6 py-10 sm:py-12", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl shadow-lg w-full max-w-md sm:max-w-lg text-center border-t-[6px] border-primary", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6 pt-6", children: /* @__PURE__ */ jsx("div", { className: "p-4 rounded-full shadow-inner bg-primary", children: /* @__PURE__ */ jsx("svg", { className: "w-10 h-10 text-white", fill: "none", stroke: "currentColor", strokeWidth: "2", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5 13l4 4L19 7" }) }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "px-6 sm:px-10 pb-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl sm:text-3xl font-extrabold mb-3 text-secondary", children: "Payment Successful!" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm sm:text-base mb-6", children: "Thank you for your payment. A confirmation email has been sent to your inbox." }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col sm:flex-row justify-center gap-4", children: /* @__PURE__ */ jsx(Link, { to: "/", className: "bg-primary hover:bg-[#f2cf47] text-black px-5 py-2 rounded-lg font-medium transition duration-300", children: "Go to Home" }) })
    ] })
  ] }) });
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PaymentSuccess
}, Symbol.toStringTag, { value: "Module" }));
function PaymentCancel() {
  return /* @__PURE__ */ jsx("section", { className: "min-h-screen flex items-center justify-center bg-red-50 px-4 sm:px-6 py-10 sm:py-12", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl shadow-lg w-full max-w-md sm:max-w-lg text-center border-t-[6px] border-red-500", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6 pt-6", children: /* @__PURE__ */ jsx("div", { className: "p-4 rounded-full shadow-inner bg-red-100", children: /* @__PURE__ */ jsx("svg", { className: "w-10 h-10 text-red-600", fill: "none", stroke: "currentColor", strokeWidth: "2", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "px-6 sm:px-10 pb-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl sm:text-3xl font-extrabold mb-3 text-red-600", children: "Payment Cancelled" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm sm:text-base mb-6", children: "Your payment could not be processed or was cancelled. Please try again or contact support if the issue persists." }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col sm:flex-row justify-center gap-4", children: /* @__PURE__ */ jsx(Link, { to: "/", className: "bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition duration-300", children: "Go to Home" }) })
    ] })
  ] }) });
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PaymentCancel
}, Symbol.toStringTag, { value: "Module" }));
const privacyPolicyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getprivacyPolicy: builder.query({
      query: () => "/privacy-policy/data/"
    })
  })
});
const { useGetprivacyPolicyQuery } = privacyPolicyApi;
function PrivacyPolicy() {
  var _a;
  const { data } = useGetprivacyPolicyQuery(void 0, {
    refetchOnMountOrArgChange: true
  });
  return /* @__PURE__ */ jsx("section", { className: "pt-[3.75rem] pb-10", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx(
    "div",
    {
      className: "text-editor",
      dangerouslySetInnerHTML: { __html: (_a = data == null ? void 0 : data.data) == null ? void 0 : _a.body }
    }
  ) }) });
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PrivacyPolicy
}, Symbol.toStringTag, { value: "Module" }));
const crousesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEcommerceCrouses: builder.query({
      query: (pageNumber) => `/crouses/ecommerce/videos/?page=${pageNumber}`
    }),
    getCryptoTradesVideo: builder.query({
      query: (pageNumber) => `/crouses/crypto/videos/?page=${pageNumber}`
    }),
    getStockCommoditiesTradesVideo: builder.query({
      query: (pageNumber) => `/crouses/stock/videos/?page=${pageNumber}`
    }),
    getGetMarketUpdatesVideo: builder.query({
      query: (pageNumber) => `/crouses/market/videos/?page=${pageNumber}`
    }),
    getGetEducationVideo: builder.query({
      query: (pageNumber) => `/crouses/education/videos/?page=${pageNumber}`
    }),
    getSingleEcommerceCrouses: builder.query({
      query: () => "/crouses/e-commerce-single-course/"
    })
  })
});
const {
  useGetEcommerceCrousesQuery,
  useGetCryptoTradesVideoQuery,
  useGetStockCommoditiesTradesVideoQuery,
  useGetGetMarketUpdatesVideoQuery,
  useGetGetEducationVideoQuery,
  useGetSingleEcommerceCrousesQuery
} = crousesApi;
function Dashboard$1() {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const { data } = useGetSingleEcommerceCrousesQuery(void 0, {
    refetchOnMountOrArgChange: true
  });
  const courseData = data == null ? void 0 : data.data;
  const bundles = (courseData == null ? void 0 : courseData.single_course_bundles) || [];
  const [activeBundle, setActiveBundle] = useState(null);
  useEffect(() => {
    if (bundles.length > 0) {
      setActiveBundle(bundles[0]);
    }
  }, [bundles]);
  const [createCheckoutSession, { isLoading }] = useCreateEcommerceCheckoutSessionMutation();
  const handleEcommercePayment = async (price) => {
    if (!(auth == null ? void 0 : auth.user)) return navigate("/login/");
    if (!price) {
      alert("No bundle selected.");
      return;
    }
    try {
      const res = await createCheckoutSession({
        amount: price * 100,
        currency: "usd"
      }).unwrap();
      if (res.url) {
        window.location.href = res.url;
      } else {
        alert("Something went wrong. No URL received.");
      }
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Payment failed. Please try again.");
    }
  };
  return /* @__PURE__ */ jsx("section", { className: "min-h-screen pb-5 px-4 flex flex-col bg-white", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-8 lg:gap-5 grow", children: [
    /* @__PURE__ */ jsx("div", { className: "rounded-2xl overflow-hidden flex-1/2 grow flex flex-col", children: /* @__PURE__ */ jsx(
      "img",
      {
        className: "transition-all duration-300 ease-linear hover:scale-[1.1] h-full grow cursor-pointer",
        src: `${MEDIA_URL}${courseData == null ? void 0 : courseData.image}`,
        alt: courseData == null ? void 0 : courseData.title
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1/2 lg:self-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl text-left font-semibold mb-2", children: courseData == null ? void 0 : courseData.title }),
      activeBundle && /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsxs("span", { className: "line-through text-gray-400 mr-2", children: [
          "USD $",
          activeBundle.price
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-red-600 font-bold text-xl", children: [
          "USD $",
          activeBundle.final_price
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("label", { className: "block mb-2 font-medium", children: "Course Bundle:" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: bundles.map((bundle) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveBundle(bundle),
            className: `px-4 py-2 rounded-md text-sm transition border cursor-pointer ${(activeBundle == null ? void 0 : activeBundle.id) === bundle.id ? "bg-green-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`,
            children: bundle.bundle_name
          },
          bundle.id
        )) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4 mt-6", children: /* @__PURE__ */ jsx(
        "button",
        {
          className: "bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition cursor-pointer",
          onClick: () => {
            if (activeBundle) {
              handleEcommercePayment(activeBundle.final_price);
            }
          },
          disabled: isLoading || !activeBundle,
          children: isLoading ? "Processing..." : "Buy Now"
        }
      ) })
    ] })
  ] }) });
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Dashboard$1
}, Symbol.toStringTag, { value: "Module" }));
function Subscription() {
  var _a, _b, _c;
  const auth = useSelector((state) => state.auth);
  const { data: cryptoSubscriptionContent } = useGetSubscriptionDataQuery(void 0, { refetchOnMountOrArgChange: true });
  const { data: subscriptionData } = useGetSubscriptionQuery(void 0, { refetchOnMountOrArgChange: true });
  const [createCheckoutSession, { isLoading }] = useCreateCryptoCheckoutSessionMutation();
  const navigate = useNavigate();
  const handlePayment = async () => {
    var _a2;
    const price = (_a2 = cryptoSubscriptionContent == null ? void 0 : cryptoSubscriptionContent.data) == null ? void 0 : _a2.price;
    if (!price) {
      alert("Price not available.");
      return;
    }
    try {
      const res = await createCheckoutSession({
        amount: price * 100,
        currency: "usd"
      }).unwrap();
      if (res.url) {
        window.location.href = res.url;
      } else {
        alert("Something went wrong. No URL received.");
      }
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Payment failed. Please try again.");
    }
  };
  const handleSubscription = () => {
    var _a2;
    if (!(auth == null ? void 0 : auth.user)) {
      navigate("/login");
      return;
    }
    const lastSubscription2 = (_a2 = subscriptionData == null ? void 0 : subscriptionData.data) == null ? void 0 : _a2[subscriptionData.data.length - 1];
    const isCryptoActive2 = (lastSubscription2 == null ? void 0 : lastSubscription2.subscription_type) === "crypto" && (lastSubscription2 == null ? void 0 : lastSubscription2.status) === "active";
    if (isCryptoActive2) {
      return;
    }
    handlePayment();
  };
  const lastSubscription = (_a = subscriptionData == null ? void 0 : subscriptionData.data) == null ? void 0 : _a[subscriptionData.data.length - 1];
  const isCryptoActive = (lastSubscription == null ? void 0 : lastSubscription.subscription_type) === "crypto" && (lastSubscription == null ? void 0 : lastSubscription.status) === "active";
  return /* @__PURE__ */ jsx("section", { className: "py-[4.375rem]", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "max-w-[62.5rem] mx-auto p-1 rounded-[1.25rem] bg-gradient-to-r from-primary to-secondary", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-[1.125rem] py-5 px-[0.438rem] sm:p-10", children: [
    /* @__PURE__ */ jsx("div", { className: "space-y-2.5", dangerouslySetInnerHTML: { __html: (_b = cryptoSubscriptionContent == null ? void 0 : cryptoSubscriptionContent.data) == null ? void 0 : _b.body } }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
      /* @__PURE__ */ jsx("span", { children: (_c = auth == null ? void 0 : auth.user) == null ? void 0 : _c.email }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "py-2 px-6 rounded-xl sm:text-xl cursor-pointer text-title outline-2 outline-transparent bg-gradient-to-r from-primary to-secondary transition-all duration-500 hover:bg-none hover:outline-primary",
          type: "button",
          disabled: isLoading || isCryptoActive,
          onClick: handleSubscription,
          children: isLoading ? "Processing..." : isCryptoActive ? "ALL READY SUBSCRIBED" : "PAY NOW"
        }
      )
    ] })
  ] }) }) }) });
}
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Subscription
}, Symbol.toStringTag, { value: "Module" }));
dayjs.extend(advancedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
function PayHistory() {
  var _a;
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetPaymentQuery(`?page=${page}`, {
    refetchOnMountOrArgChange: true
  });
  const nextPage = () => {
    if (data == null ? void 0 : data.next) setPage((prev) => prev + 1);
  };
  const prevPage = () => {
    if ((data == null ? void 0 : data.previous) && page > 1) setPage((prev) => prev - 1);
  };
  return /* @__PURE__ */ jsx("section", { className: "py-6", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-center text-[2rem] font-semibold leading-[1.4] text-title mb-[1.125rem] md:text-[2.625rem]", children: "Payment History" }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 mb-2", children: [
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full mb-4", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-[#f6f6f6]", children: [
          /* @__PURE__ */ jsx("th", { className: "py-3 px-5 pl-10 text-lg text-left rounded-tl-2xl", children: "Email" }),
          /* @__PURE__ */ jsx("th", { className: "py-3 px-5 text-lg text-left", children: "Amount" }),
          /* @__PURE__ */ jsx("th", { className: "py-3 px-5 text-lg text-left", children: "Type" }),
          /* @__PURE__ */ jsx("th", { className: "py-3 px-5 text-lg text-left rounded-tr-2xl", children: "Paid At" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: isLoading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 4, className: "text-center py-4", children: "Loading..." }) }) : (_a = data == null ? void 0 : data.results) == null ? void 0 : _a.map((item) => {
          var _a2;
          return /* @__PURE__ */ jsxs("tr", { className: "border-b border-[#0003] group", children: [
            /* @__PURE__ */ jsxs("td", { className: "py-3 px-5 pl-10 text-sm md:text-lg text-left rounded-bl-2xl", children: [
              /* @__PURE__ */ jsx("span", { className: "size-10 bg-[#d9d9d9] rounded-full inline-flex items-center justify-center uppercase mr-2.5", children: (_a2 = item.user.name) == null ? void 0 : _a2.split(" ").slice(0, 2).map((word) => word[0]).join("") }),
              item.user.email
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "py-3 px-5 text-sm md:text-lg text-left", children: [
              item.amount,
              " $"
            ] }),
            /* @__PURE__ */ jsx("td", { className: "py-3 px-5 text-sm md:text-lg text-left", children: item.status }),
            /* @__PURE__ */ jsx("td", { className: "py-3 px-5 text-sm md:text-lg text-left rounded-br-2xl", children: dayjs(item.payment_date).tz("Asia/Dhaka").format("MMMM Do YYYY, h:mm:ss a") })
          ] }, item.id);
        }) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3 mt-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: prevPage,
            disabled: !(data == null ? void 0 : data.previous),
            className: "w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 disabled:opacity-40 cursor-pointer",
            children: "‹"
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-base font-medium", children: page }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: nextPage,
            disabled: !(data == null ? void 0 : data.next),
            className: "w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 disabled:opacity-40 cursor-pointer",
            children: "›"
          }
        )
      ] })
    ] })
  ] }) });
}
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PayHistory
}, Symbol.toStringTag, { value: "Module" }));
const ecommerceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEcommerceImage: builder.query({
      query: () => "/e-commerce/image/"
    }),
    getEcommerceVideo: builder.query({
      query: () => "/e-commerce/video/"
    }),
    getEcommerceAmazon: builder.query({
      query: () => "/e-commerce/amazon/"
    }),
    getEcommerceCourseDetails: builder.query({
      query: () => "/e-commerce/course-details/"
    }),
    getEcommerceYoutubeLink: builder.query({
      query: () => "/e-commerce/youtube-link/"
    }),
    getEcommerceFaq: builder.query({
      query: () => "/e-commerce/faq/"
    }),
    getEcommerceServices: builder.query({
      query: () => "/e-commerce/services/"
    }),
    getEcommerceWhatsappNumber: builder.query({
      query: () => "/e-commerce/whatsapp-number/"
    }),
    addBooking: builder.mutation({
      query: (bookingData) => ({
        url: "/e-commerce/booking/",
        method: "POST",
        body: bookingData
      })
    })
  })
});
const {
  useGetEcommerceImageQuery,
  useGetEcommerceVideoQuery,
  useGetEcommerceAmazonQuery,
  useGetEcommerceCourseDetailsQuery,
  useGetEcommerceYoutubeLinkQuery,
  useGetEcommerceFaqQuery,
  useGetEcommerceServicesQuery,
  useGetEcommerceWhatsappNumberQuery,
  useAddBookingMutation
} = ecommerceApi;
const BookingForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();
  const [addBooking] = useAddBookingMutation();
  const onSubmitForm = async (formData) => {
    try {
      await addBooking(formData).unwrap();
      reset();
      alert("Booking successfully submitted!");
    } catch (err) {
      console.error("Error during booking:", err);
      alert("Failed to submit booking. Please try again.");
    }
  };
  return /* @__PURE__ */ jsxs("form", { className: "bg-secondary p-2.5 flex flex-col gap-2.5", onSubmit: handleSubmit(onSubmitForm), children: [
    /* @__PURE__ */ jsx(Field, { label: "", error: errors.name, children: /* @__PURE__ */ jsx("input", { ...register("name", {
      required: "Name is required"
    }), className: "rounded-none border border-title p-2.5 text-title", type: "text", placeholder: "Name" }) }),
    /* @__PURE__ */ jsx(Field, { label: "", error: errors.number, children: /* @__PURE__ */ jsx("input", { ...register("number", {
      required: "Whatsapp number is required"
    }), className: "rounded-none border border-title p-2.5 text-title", type: "text", placeholder: "What'sApp number" }) }),
    /* @__PURE__ */ jsx(Field, { label: "", error: errors.country_name, children: /* @__PURE__ */ jsx("input", { ...register("country_name", {
      required: "Country name is required"
    }), className: "rounded-none border border-title p-2.5 text-title", type: "text", placeholder: "Country Name" }) }),
    /* @__PURE__ */ jsx(Field, { label: "", error: errors.message, children: /* @__PURE__ */ jsx("input", { ...register("message", {
      required: "Message is required"
    }), className: "rounded-none border border-title p-2.5 text-title", type: "text", placeholder: "Message" }) }),
    /* @__PURE__ */ jsx("button", { className: "p-2.5 rounded-none text-xl font-medium text-white", type: "submit", children: "Send" })
  ] });
};
const LEFTIMG = "/assets/Lets-Grow-Together-B6CbRj7l.png";
const ULT = "/assets/Untitled-design-47-BGHkhlWw.png";
function Ecommerce() {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const { data: ecommerceImage } = useGetEcommerceImageQuery(void 0, {
    refetchOnMountOrArgChange: true
  });
  const { data: ecommerceVideo } = useGetEcommerceVideoQuery(void 0, {
    refetchOnMountOrArgChange: true
  });
  const { data: ecommerceAmazon } = useGetEcommerceAmazonQuery(void 0, {
    refetchOnMountOrArgChange: true
  });
  const { data: ecommerceCourseDetails } = useGetEcommerceCourseDetailsQuery(
    void 0,
    { refetchOnMountOrArgChange: true }
  );
  const { data: ecommerceYoutubeLink } = useGetEcommerceYoutubeLinkQuery(
    void 0,
    { refetchOnMountOrArgChange: true }
  );
  const { data: ecommerceFaq } = useGetEcommerceFaqQuery(void 0, {
    refetchOnMountOrArgChange: true
  });
  const { data: ecommerceServices } = useGetEcommerceServicesQuery(void 0, {
    refetchOnMountOrArgChange: true
  });
  const { data: ecommerceWhatsappNumber } = useGetEcommerceWhatsappNumberQuery(
    void 0,
    { refetchOnMountOrArgChange: true }
  );
  const [createCheckoutSession, { isLoading }] = useCreateEcommerceCheckoutSessionMutation();
  const handleEcommercePayment = async (price) => {
    try {
      const res = await createCheckoutSession({
        amount: price * 100,
        currency: "usd"
      }).unwrap();
      if (res.url) {
        window.location.href = res.url;
      } else {
        alert("Something went wrong. No URL received.");
      }
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Payment failed. Please try again.");
    }
  };
  return /* @__PURE__ */ jsxs("main", { className: "bg-[#f6f6f6] pb-10", children: [
    /* @__PURE__ */ jsx("section", { className: "pt-10 lg:pt-10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-5", children: [
      /* @__PURE__ */ jsx("div", { className: "space-y-2.5", children: (_a = ecommerceImage == null ? void 0 : ecommerceImage.data) == null ? void 0 : _a.map((item) => {
        return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          "img",
          {
            className: "rounded-lg",
            src: `${MEDIA_URL}${item.image}`,
            alt: ""
          }
        ) }, item.id);
      }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-secondary text-xl lg:leading-[1.1] lg:text-5xl text-center font-semibold", children: "আমি আপনাকে শিখবো, কিভাবে অ্যামাজনে সফল ব্যবসা প্রতিষ্ঠা করতে পারেন |" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2.5 border-8 border-[#FFBD00] rounded-3xl shadow-[0_0_10px_0_rgba(0,0,0,0.5)] overflow-hidden", children: (_b = ecommerceVideo == null ? void 0 : ecommerceVideo.data) == null ? void 0 : _b.map((item) => {
        return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("video", { src: `${MEDIA_URL}${item.video}`, controls: true }) });
      }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "pt-10 lg:pt-24", children: /* @__PURE__ */ jsxs("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-title text-xl lg:leading-[1.1] lg:text-5xl font-semibold bg-primary p-2.5 rounded-3xl", children: "সফল Amazon ব্যবসা করার জন্য যা যা জানা উচিৎ" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: (_c = ecommerceAmazon == null ? void 0 : ecommerceAmazon.data) == null ? void 0 : _c.map((item) => {
        return /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-title rounded-xl cursor-pointer", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-primary text-primary hover:fill-secondary hover:text-secondary transition-all ease-in-out duration-300",
              viewBox: "0 0 512 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx("path", { d: "M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" })
            }
          ) }),
          /* @__PURE__ */ jsx(
            "h3",
            {
              className: "text-secondary font-medium text-xl lg:text-xl",
              dangerouslySetInnerHTML: { __html: item == null ? void 0 : item.title }
            }
          )
        ] });
      }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "pt-10 lg:pt-24", children: /* @__PURE__ */ jsxs("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-8", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("img", { className: "rounded-lg", src: LEFTIMG, alt: "" }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-title text-2xl leading-8 lg:leading-14 lg:text-5xl font-semibold bg-primary p-2.5 rounded-3xl", children: 'এই "COURSE" থেকে যা যা শিখতে পারবেন' }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5", children: (_d = ecommerceCourseDetails == null ? void 0 : ecommerceCourseDetails.data) == null ? void 0 : _d.map((item) => {
        return /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col items-center gap-5 bg-title rounded-xl", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "svg",
            {
              "aria-hidden": "true",
              className: "size-16 fill-primary text-primary hover:fill-secondary hover:text-secondary transition-all ease-in-out duration-300",
              viewBox: "0 0 448 512",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx("path", { d: "M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z" })
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-5 lg:space-y-7 text-center", children: [
            /* @__PURE__ */ jsx(
              "h3",
              {
                className: "text-secondary font-medium text-xl lg:text-3xl",
                dangerouslySetInnerHTML: { __html: item == null ? void 0 : item.title }
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "text-secondary font-medium text-sm lg:text-lg text-start space-y-2 lg:space-y-3 e-com-text-aria text-editor",
                dangerouslySetInnerHTML: { __html: item == null ? void 0 : item.description }
              }
            )
          ] })
        ] });
      }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "pt-10 lg:pt-24", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-8", children: /* @__PURE__ */ jsx("h2", { className: "text-title text-2xl leading-8 lg:leading-14 lg:text-5xl font-semibold p-2.5 rounded-2xl border-4 border-primary", children: "বিগত সময়ে আমার কোর্সে অংশগ্রহণ করার পর স্টুডেন্টদের ফিডব্যাক" }) }) }),
    /* @__PURE__ */ jsx("section", { className: "pt-10 lg:pt-24", children: /* @__PURE__ */ jsxs("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-5 items-center flex-nowrap", children: [
        /* @__PURE__ */ jsx("div", { className: "w-full h-96", children: /* @__PURE__ */ jsx("img", { className: "w-full h-full", src: ULT, alt: "" }) }),
        /* @__PURE__ */ jsxs("div", { className: "w-full bg-title", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-white text-center p-2.5", children: "Book a free call now to discover the Amazon course" }),
          /* @__PURE__ */ jsx(BookingForm, {})
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-5 items-center flex-nowrap", children: [
        /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx("h2", { className: "text-title text-2xl leading-8 lg:leading-14 lg:text-5xl font-semibold", children: "Click to send WhatsApp message" }) }),
        /* @__PURE__ */ jsx("div", { className: "w-full flex justify-center", children: /* @__PURE__ */ jsx(
          Link,
          {
            to: `https://wa.me/${(_e = ecommerceWhatsappNumber == null ? void 0 : ecommerceWhatsappNumber.data) == null ? void 0 : _e.number}`,
            className: "size-36 rounded-2xl flex items-center justify-center bg-[#25d366] transform hover:scale-[0.8] transition duration-300",
            target: "_blank",
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                className: "size-16 fill-white",
                viewBox: "0 0 448 512",
                xmlns: "http://www.w3.org/2000/svg",
                children: /* @__PURE__ */ jsx("path", { d: "M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" })
              }
            )
          }
        ) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "pt-10 lg:pt-24", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5", children: (_f = ecommerceYoutubeLink == null ? void 0 : ecommerceYoutubeLink.data) == null ? void 0 : _f.map((item) => {
      return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        "iframe",
        {
          className: "rounded",
          width: "100%",
          height: "350",
          src: item.link,
          title: "YouTube video player",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        }
      ) });
    }) }) }),
    /* @__PURE__ */ jsx("section", { className: "pt-10 lg:pt-24", children: /* @__PURE__ */ jsxs("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 grid grid-cols-1 xl:grid-cols-3 gap-x-2.5 gap-y-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-4xl xl:text-6xl font-semibold text-title", children: [
          "1,500 ",
          /* @__PURE__ */ jsx("span", { children: "+" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "underline text-base xl:text-2xl font-normal text-title", children: "Clients" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-4xl xl:text-6xl font-semibold text-title text-nowrap", children: [
          "$ 10,000,000",
          /* @__PURE__ */ jsx("span", { children: "+" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "underline text-base xl:text-2xl font-normal text-title", children: "Revenue generated" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-4xl xl:text-6xl font-semibold text-title", children: [
          "500",
          /* @__PURE__ */ jsx("span", { children: "+" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "underline text-base xl:text-2xl font-normal text-title", children: "Companies" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "pt-10 lg:pt-24", children: /* @__PURE__ */ jsxs("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-5", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-title text-2xl leading-8 lg:leading-14 lg:text-5xl font-semibold", children: "প্রশ্ন এবং উত্তর" }),
      /* @__PURE__ */ jsx("div", { className: "", children: (_g = ecommerceFaq == null ? void 0 : ecommerceFaq.data) == null ? void 0 : _g.map((item) => {
        return /* @__PURE__ */ jsxs("details", { className: "border-b border-gray-200 p-4", children: [
          /* @__PURE__ */ jsx(
            "summary",
            {
              className: "flex justify-between items-center w-full text-left text-xl lg:text-2xl text-title font-semibold cursor-pointer",
              dangerouslySetInnerHTML: { __html: item == null ? void 0 : item.question }
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(
            "p",
            {
              className: "text-base font-normal text-black",
              dangerouslySetInnerHTML: { __html: item == null ? void 0 : item.answer }
            }
          ) })
        ] }, item.id);
      }) }),
      /* @__PURE__ */ jsx("div", { className: "mt-5 flex items-center justify-center", children: /* @__PURE__ */ jsx(
        Link,
        {
          to: "/single/course/",
          className: "bg-secondary font-medium text-2xl lg:text-3xl rounded-full px-10 py-5 text-white cursor-pointer transition-all duration-300 ease-linear hover:bg-primary hover:text-title",
          children: "কোর্সে জয়েন করুন"
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-8 lg:py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-5 md:gap-y-10", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-title text-2xl lg:text-5xl font-semibold bg-primary px-5 py-3 rounded-3xl text-center", children: "Service Section" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-5", children: (_h = ecommerceServices == null ? void 0 : ecommerceServices.data) == null ? void 0 : _h.map((item) => {
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: "rounded-2xl bg-white shadow-[0_1px_10px_rgba(29,29,32,0.0784314),_0_4px_5px_rgba(29,29,32,0.0509804),_0_2px_4px_-1px_rgba(29,29,32,0.160784)] overflow-hidden transition-transform hover:scale-[1.02] duration-300",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "pt-8 px-8 pb-6 text-center space-y-5 border-b border-[#e5e7eb]", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-3xl font-semibold text-[#140751]", children: item.title }),
                /* @__PURE__ */ jsxs("p", { className: "text-5xl font-bold text-[#140751]", children: [
                  "$",
                  item.price,
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-lg font-medium text-gray-500", children: "/mo" })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleEcommercePayment(item.price),
                    className: "bg-secondary font-medium text-base lg:text-xl rounded-full px-10 py-5 text-white cursor-pointer transition-all duration-300 ease-linear hover:bg-primary hover:text-title",
                    children: "Buy Now"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("ul", { className: "py-6 px-8 list-disc list-inside space-y-2 text-[#333] text-base", dangerouslySetInnerHTML: { __html: item == null ? void 0 : item.description } })
            ]
          },
          item.id
        );
      }) })
    ] }) })
  ] });
}
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ecommerce
}, Symbol.toStringTag, { value: "Module" }));
const Pagination = ({ totalPage, currentPage, onPageChange }) => {
  return /* @__PURE__ */ jsx(
    ResponsivePagination,
    {
      current: currentPage,
      total: totalPage,
      onPageChange
    }
  );
};
dayjs.extend(relativeTime);
const MainDashboard = () => {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("crypto");
  const [eduLevel, setEduLevel] = useState("basic");
  const { data: subscriptionData } = useGetSubscriptionQuery(void 0, {
    refetchOnMountOrArgChange: true
  });
  const { data: cryptoTrades } = useGetCryptoTradesVideoQuery(currentPage, { refetchOnMountOrArgChange: true });
  const { data: stockCommoditiesTrades } = useGetStockCommoditiesTradesVideoQuery(currentPage, { refetchOnMountOrArgChange: true });
  const { data: marketUpdates } = useGetGetMarketUpdatesVideoQuery(currentPage, { refetchOnMountOrArgChange: true });
  const { data: education } = useGetGetEducationVideoQuery(currentPage, { refetchOnMountOrArgChange: true });
  const { data: ecommerceVideo } = useGetEcommerceCrousesQuery(currentPage, { refetchOnMountOrArgChange: true });
  const tabButtonClass = (tab) => `text-title hover:text-white rounded-full py-1.5 px-3.5 flex items-center capitalize transition-all duration-300 cursor-pointer ease-in-out ${activeTab === tab ? "bg-gradient-to-r from-yellow-700 to-red-400 text-white" : "hover:bg-gradient-to-r hover:from-yellow-700 hover:to-red-400"}`;
  const filterButtonClass = (level) => `p-1.5 rounded-[1.563rem] min-w-[6.75rem] cursor-pointer text-sm md:text-base font-medium ${eduLevel === level ? "bg-black text-white" : "bg-transparent text-black"}`;
  const filteredEducation = Array.isArray(education == null ? void 0 : education.results) ? education.results.filter((item) => item.status === eduLevel) : [];
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const getDataForActiveTab = () => {
    switch (activeTab) {
      case "crypto":
        return cryptoTrades;
      case "stock":
        return stockCommoditiesTrades;
      case "market":
        return marketUpdates;
      case "education":
        return education;
      default:
        return null;
    }
  };
  const activeTabData = getDataForActiveTab();
  console.log("subscription data : ", subscriptionData);
  return /* @__PURE__ */ jsx("section", { className: "py-[4.375rem]", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-primary to-secondary rounded-[22px] p-1 max-w-[62.5rem] w-full mx-auto", children: [
    ((_a = subscriptionData == null ? void 0 : subscriptionData.data) == null ? void 0 : _a[0].subscription_type) === "crypto" && ((_b = subscriptionData == null ? void 0 : subscriptionData.data) == null ? void 0 : _b[0].status) === "active" && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-[20px] p-5 md:p-10 md:py-[3.25rem] flex flex-col relative", children: [
      /* @__PURE__ */ jsxs("ul", { className: "flex flex-col sm:flex-row flex-wrap items-center w-full lg:w-fit mx-auto bg-section-title rounded-[1.625rem] p-[0.438rem]", children: [
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setActiveTab("crypto");
              setCurrentPage(1);
            },
            className: tabButtonClass("crypto"),
            children: "Crypto Trades"
          }
        ) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setActiveTab("stock");
              setCurrentPage(1);
            },
            className: tabButtonClass("stock"),
            children: "Stock & Commodities Trades"
          }
        ) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setActiveTab("market");
              setCurrentPage(1);
            },
            className: tabButtonClass("market"),
            children: "Market Updates"
          }
        ) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setActiveTab("education");
              setCurrentPage(1);
            },
            className: tabButtonClass("education"),
            children: "Education"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "my-[1.875rem] grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-6", children: [
        activeTab === "crypto" && ((_c = activeTabData == null ? void 0 : activeTabData.results) == null ? void 0 : _c.map((item) => /* @__PURE__ */ jsx(CardItem, { item }, item.id))),
        activeTab === "stock" && ((_d = activeTabData == null ? void 0 : activeTabData.results) == null ? void 0 : _d.map((item) => /* @__PURE__ */ jsx(CardItem, { item }, item.id))),
        activeTab === "market" && ((_e = activeTabData == null ? void 0 : activeTabData.results) == null ? void 0 : _e.map((item) => /* @__PURE__ */ jsx(CardItem, { item }, item.id))),
        activeTab === "education" && /* @__PURE__ */ jsxs("div", { className: "my-5 p-2.5 rounded-2xl bg-[#f1f3f4] w-full col-span-full", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-primary rounded-[1.563rem] p-[0.438rem] flex items-center justify-center w-fit mx-auto mb-5", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setEduLevel("basic"),
                className: `${filterButtonClass("basic")}`,
                children: "Basic"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setEduLevel("advance"),
                className: `${filterButtonClass("advance")}`,
                children: "Advance"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2.5", children: filteredEducation == null ? void 0 : filteredEducation.map((item) => /* @__PURE__ */ jsx("div", { className: "pt-6 px-4 pb-1.5 bg-[#dadfe2] rounded-2xl relative max-w-[80%] mx-auto", children: /* @__PURE__ */ jsx("video", { className: "w-full h-auto rounded", src: `${MEDIA_URL}${item.video}`, controls: true }) }, item.id)) })
        ] })
      ] }),
      activeTab !== "education" && /* @__PURE__ */ jsx(
        Pagination,
        {
          totalPage: Math.ceil((activeTabData == null ? void 0 : activeTabData.count) / 4),
          currentPage,
          onPageChange: handlePageChange
        }
      )
    ] }),
    ((_f = subscriptionData == null ? void 0 : subscriptionData.data) == null ? void 0 : _f[0].subscription_type) === "e-commerce" && ((_g = subscriptionData == null ? void 0 : subscriptionData.data) == null ? void 0 : _g[0].status) === "active" && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-[20px] p-5 md:p-10 md:py-[3.25rem] flex flex-col relative", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl", children: "E-commerce Videos" }),
      /* @__PURE__ */ jsx("div", { className: "my-[1.875rem] grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-6", children: (_h = ecommerceVideo == null ? void 0 : ecommerceVideo.results) == null ? void 0 : _h.map((item) => /* @__PURE__ */ jsx(CardItem, { item }, item.id)) }),
      /* @__PURE__ */ jsx(
        Pagination,
        {
          totalPage: Math.ceil((ecommerceVideo == null ? void 0 : ecommerceVideo.count) / 4),
          currentPage,
          onPageChange: handlePageChange
        }
      )
    ] })
  ] }) }) });
};
const CardItem = ({ item }) => {
  var _a;
  return /* @__PURE__ */ jsxs("div", { className: "py-5 px-4 pt-10 bg-[#f5f5f5] relative space-y-2.5", children: [
    /* @__PURE__ */ jsx("hr", { className: "border-t-[#c8c8c8] mb-2.5" }),
    item.images && /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap w-full", children: /* @__PURE__ */ jsx("img", { className: "w-full h-auto rounded", src: `${MEDIA_URL}${item.images}`, alt: item.title }) }),
    item.video && /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap w-full", children: /* @__PURE__ */ jsx("video", { className: "w-full h-auto rounded", src: `${MEDIA_URL}${item.video}`, controls: true }) }),
    /* @__PURE__ */ jsxs("div", { className: "px-1 space-y-1.5 mt-1.5", children: [
      /* @__PURE__ */ jsx("p", { className: "font-semibold", children: item.title }),
      (_a = item.sub_titles) == null ? void 0 : _a.map((sub) => /* @__PURE__ */ jsx("p", { children: sub.sub_title }, sub.id)),
      /* @__PURE__ */ jsx("div", { className: "text-editor", dangerouslySetInnerHTML: { __html: item.description } })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-2 right-5", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-[#0000005e]", children: dayjs(item.created_at).fromNow() }) })
  ] });
};
function Dashboard() {
  var _a;
  const { data: subscriptionData } = useGetSubscriptionQuery(void 0, { refetchOnMountOrArgChange: true });
  return /* @__PURE__ */ jsx(Fragment, { children: ((_a = subscriptionData == null ? void 0 : subscriptionData.data) == null ? void 0 : _a[0].status) === "active" ? /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(MainDashboard, {}) }) : /* @__PURE__ */ jsx("section", { className: "py-[4.375rem]", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-primary to-secondary rounded-[22px] p-1 max-w-[62.5rem] w-full mx-auto", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-[20px] p-5 md:p-10 md:py-[3.25rem] flex flex-col relative", children: /* @__PURE__ */ jsx("p", { className: "text-xl md:text-3xl font-bold uppercase text-center py-5", children: "This feature is only available for paid users." }) }) }) }) }) });
}
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Dashboard
}, Symbol.toStringTag, { value: "Module" }));
const RegisterForm = () => {
  const navigate = useNavigate();
  const [addRegister, { isLoading }] = useAddRegisterMutation();
  const [isShow, setIsShow] = useState({
    password: false,
    confirm_password: false
  });
  const [hovered, setHovered] = useState(false);
  const [publicIp, setPublicIp] = useState("");
  const [countries, setCountries] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState(void 0);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();
  const { IoMdEyeOff: IoMdEyeOff2, IoEye: IoEye2 } = ReactIcons;
  useEffect(() => {
    fetch("https://api.ipify.org?format=json").then((res) => res.json()).then((data) => setPublicIp(data.ip)).catch(() => setPublicIp(""));
    const countriesList = CountryList.getNames();
    setCountries(countriesList);
  }, []);
  const togglePasswordVisibility = (field) => {
    setIsShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const onSubmitForm = async (formData) => {
    try {
      const dataWithIp = { ...formData, local_ip: publicIp || void 0, phone: phoneNumber };
      console.log("dataWithIp : ", dataWithIp);
      await addRegister(dataWithIp).unwrap();
      alert("Registered successfully!");
      reset();
      navigate("/login/");
    } catch (err) {
      alert("Something went wrong during registration.");
    }
  };
  return /* @__PURE__ */ jsxs("form", { className: "flex flex-col flex-wrap gap-y-5 w-full", onSubmit: handleSubmit(onSubmitForm), children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap gap-y-2.5 w-full", children: /* @__PURE__ */ jsx(Field, { label: "", error: errors.name, children: /* @__PURE__ */ jsx(
      "input",
      {
        ...register("name", { required: "Name is required" }),
        id: "name",
        placeholder: "Name",
        type: "text",
        className: "input"
      }
    ) }) }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap gap-y-2.5 w-full", children: /* @__PURE__ */ jsx(Field, { label: "", error: errors.email, children: /* @__PURE__ */ jsx(
      "input",
      {
        ...register("email", { required: "Email is required" }),
        id: "email",
        placeholder: "Email",
        type: "email",
        className: "input"
      }
    ) }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-5 w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap gap-y-2.5 w-full", children: /* @__PURE__ */ jsx(Field, { label: "", error: errors.number, children: /* @__PURE__ */ jsx(
        PhoneInput,
        {
          international: true,
          defaultCountry: "BD",
          value: phoneNumber,
          onChange: (value) => setPhoneNumber(value),
          className: "input",
          placeholder: "Enter your phone number"
        }
      ) }) }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap gap-y-2.5 w-full", children: /* @__PURE__ */ jsx(Field, { label: "", error: errors.country, children: /* @__PURE__ */ jsxs(
        "select",
        {
          ...register("country", { required: "Country is required" }),
          className: "input",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select Country" }),
            countries.map((country, index) => /* @__PURE__ */ jsx("option", { value: country, children: country }, index))
          ]
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap gap-y-2.5 w-full", children: /* @__PURE__ */ jsx(Field, { label: "", error: errors.date_of_birth, children: /* @__PURE__ */ jsx(
      "input",
      {
        ...register("date_of_birth", {
          required: "Date of birth is required"
        }),
        id: "date_of_birth",
        type: "date",
        className: "input"
      }
    ) }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5 w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap gap-y-2.5 w-full", children: /* @__PURE__ */ jsx(Field, { label: "", error: errors.password, children: /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ...register("password", { required: "Password is required" }),
            id: "password",
            type: isShow.password ? "text" : "password",
            placeholder: "Password",
            className: "input w-full"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => togglePasswordVisibility("password"),
            className: "absolute right-2 top-1/2 -translate-y-1/2",
            children: isShow.password ? /* @__PURE__ */ jsx(IoMdEyeOff2, { className: "text-gray-600 text-lg" }) : /* @__PURE__ */ jsx(IoEye2, { className: "text-gray-600 text-lg" })
          }
        )
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap gap-y-2.5 w-full", children: /* @__PURE__ */ jsx(Field, { label: "", error: errors.confirm_password, children: /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ...register("confirm_password", {
              required: "Confirm password is required"
            }),
            id: "confirm_password",
            type: isShow.confirm_password ? "text" : "password",
            placeholder: "Confirm Password",
            className: "input w-full"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => togglePasswordVisibility("confirm_password"),
            className: "absolute right-2 top-1/2 -translate-y-1/2",
            children: isShow.confirm_password ? /* @__PURE__ */ jsx(IoMdEyeOff2, { className: "text-gray-600 text-lg" }) : /* @__PURE__ */ jsx(IoEye2, { className: "text-gray-600 text-lg" })
          }
        )
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap gap-y-2.5 w-full", children: /* @__PURE__ */ jsx(Field, { label: "", error: errors.signature, children: /* @__PURE__ */ jsx(
      "input",
      {
        ...register("signature", { required: "Signature is required" }),
        id: "signature",
        placeholder: "Signature",
        type: "text",
        className: "input"
      }
    ) }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5 w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap gap-y-2.5 w-full", children: /* @__PURE__ */ jsx(Field, { label: "", error: errors.gender, children: /* @__PURE__ */ jsxs("select", { ...register("gender", { required: "Gender is required" }), className: "input", children: [
        /* @__PURE__ */ jsx("option", { value: "", children: "Select Gender" }),
        /* @__PURE__ */ jsx("option", { value: "male", children: "Male" }),
        /* @__PURE__ */ jsx("option", { value: "female", children: "Female" }),
        /* @__PURE__ */ jsx("option", { value: "other", children: "Other" })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap gap-y-2.5 w-full", children: /* @__PURE__ */ jsx(Field, { label: "", error: errors.role, children: /* @__PURE__ */ jsxs("select", { ...register("role", { required: "Account type is required" }), className: "input", children: [
        /* @__PURE__ */ jsx("option", { value: "", children: "Account Type" }),
        /* @__PURE__ */ jsx("option", { value: "crypto", children: "Crypto" }),
        /* @__PURE__ */ jsx("option", { value: "e-commerce", children: "E-commerce" })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5 w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap gap-y-2.5 justify-center items-center lg:justify-normal lg:items-start w-full", children: /* @__PURE__ */ jsx(Field, { label: "", error: errors.terms_accepted, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ...register("terms_accepted", {
              required: "You must accept the terms"
            }),
            type: "checkbox",
            id: "terms_accepted",
            className: "w-4 lg:w-5 h-4 lg:h-5"
          }
        ),
        /* @__PURE__ */ jsxs("span", { className: "text-sm lg:text-base", children: [
          "I agree to the",
          " ",
          /* @__PURE__ */ jsx(Link, { to: "/terms-and-conditions/", className: "text-secondary underline", children: "Terms & Conditions" })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap gap-y-2.5 w-full", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col justify-center lg:justify-end items-center lg:items-end", children: /* @__PURE__ */ jsx(Link, { className: "text-secondary text-sm lg:text-base underline", to: "/login/", children: "Already have an account?" }) }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap w-full", children: /* @__PURE__ */ jsx(
      "button",
      {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
        className: `text-base font-medium py-4 px-5 rounded-md uppercase transition-all duration-300 text-title outline-2 outline-transparent bg-gradient-to-r from-primary to-secondary hover:bg-none hover:outline-primary ${hovered ? "bg-transparent outline-primary" : "bg-gradient-to-r from-primary to-secondary"}`,
        type: "submit",
        disabled: isLoading,
        children: isLoading ? "Submitting..." : "Submit"
      }
    ) })
  ] });
};
const meta$2 = () => {
  return [{ title: "Bijolis - Register From" }, { name: "description", content: "Welcome to Remix!" }];
};
function Register() {
  return /* @__PURE__ */ jsx("section", { className: "relative top-0 left-0 right-0 w-full", children: /* @__PURE__ */ jsx("section", { className: "relation top-0 left-0 right-0 py-10 lg:py-20 w-full", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap justify-center items-center w-full", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap w-full lg:w-[70%] py-1.5 px-1.5 rounded-[20px] bg-gradient-to-r from-primary to-secondary", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap w-full py-5 lg:py-10 px-2.5 lg:px-10 gap-y-10 bg-white rounded-[18px]", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-medium uppercase text-center text-title", children: "Signup" }),
    /* @__PURE__ */ jsx(RegisterForm, {})
  ] }) }) }) }) }) });
}
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Register,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
const ticketApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addTicket: builder.mutation({
      query: (ticketData) => ({
        url: "/configuration/create-ticker/",
        method: "POST",
        body: ticketData
      })
    }),
    getTicket: builder.query({
      query: () => "configuration/ticker/"
    })
  })
});
const { useAddTicketMutation, useGetTicketQuery } = ticketApi;
dayjs.extend(utc);
dayjs.extend(timezone);
function Support() {
  var _a;
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetTicketQuery(`?page=${page}`, {
    refetchOnMountOrArgChange: true
  });
  const nextPage = () => {
    if (data == null ? void 0 : data.next) setPage((prev) => prev + 1);
  };
  const prevPage = () => {
    if ((data == null ? void 0 : data.previous) && page > 1) setPage((prev) => prev - 1);
  };
  return /* @__PURE__ */ jsx("section", { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-center text-[2rem] font-semibold leading-[1.4] text-title mb-[1.125rem] md:text-[2.625rem]", children: "Support" }),
    /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end py-5", children: /* @__PURE__ */ jsx(
        Link,
        {
          className: "py-2.5 px-5 text-center bg-gradient-to-r from-primary to-secondary rounded-[30px] text-white uppercase cursor-pointer transition-all duration-[0.3s] ease-in-out inline-block hover:text-secondary outline hover:outline-secondary hover:bg-none",
          to: "/ticket/",
          children: "Create Ticket"
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full mb-4", children: [
        /* @__PURE__ */ jsx("thead", { className: "w-full", children: /* @__PURE__ */ jsxs("tr", { className: "bg-[#f6f6f6]", children: [
          /* @__PURE__ */ jsx("th", { className: "py-3 px-5 pl-10 text-lg leading-normal text-black font-normal text-left rounded-tl-2xl rounded-bl-2xl shadow-[inset_0_0_0_9999px_transparent] whitespace-nowrap", children: "Issue ID" }),
          /* @__PURE__ */ jsx("th", { className: "py-3 px-5 text-lg text-black font-normal text-left shadow-[inset_0_0_0_9999px_transparent] whitespace-nowrap", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "py-3 px-5 text-lg text-black font-normal text-left shadow-[inset_0_0_0_9999px_transparent] whitespace-nowrap", children: "Issue Type" }),
          /* @__PURE__ */ jsx("th", { className: "py-3 px-5 text-lg text-black font-normal text-left shadow-[inset_0_0_0_9999px_transparent] whitespace-nowrap", children: "Created At" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: isLoading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 4, className: "text-center py-4", children: "Loading..." }) }) : (_a = data == null ? void 0 : data.results) == null ? void 0 : _a.map((item) => /* @__PURE__ */ jsxs(
          "tr",
          {
            className: "border-b border-[#0003] group",
            children: [
              /* @__PURE__ */ jsx("td", { className: "py-3 px-5 pl-10 text-sm md:text-lg text-left rounded-bl-2xl", children: item.id }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-5 text-sm md:text-lg text-left", children: item.status }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-5 text-sm md:text-lg text-left", children: item.issueType }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-5 text-sm md:text-lg text-left rounded-br-2xl", children: item.created_at ? dayjs(item.created_at).tz("Asia/Dhaka").format("MMMM Do YYYY, h:mm:ss a") : "N/A" })
            ]
          },
          item.id
        )) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3 mt-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: prevPage,
            disabled: !(data == null ? void 0 : data.previous),
            className: "w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 disabled:opacity-40 cursor-pointer",
            children: "‹"
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-base font-medium", children: page }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: nextPage,
            disabled: !(data == null ? void 0 : data.next),
            className: "w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 disabled:opacity-40 cursor-pointer",
            children: "›"
          }
        )
      ] })
    ] })
  ] }) });
}
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Support
}, Symbol.toStringTag, { value: "Module" }));
const Download = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAEAQAAABQ8GUWAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAGAAAABgAPBrQs8AAAAHdElNRQfmChsTBRZWosY9AAAHGklEQVR42u2bbUxTVxjHn9MWKoFSUFBK/WBmEZMlCjgBxdEWASnonLLiJBN1br5EVLJsEIKVCKJO3QzRRZkzYUgQUdQ5sdSWkorWlwQImmFQZBIRAeXFFnyBlrMPhEptSy+llwu636f23HPuef7/c8+9555zLsD/fNygsa5QxJs+Xf/JtGl6ibs7Ejk7AwBgaU8PPbOzU+fV0qLMe/r0gzFAxPP01M0QCOCyUAgugYGQ6esLSheX4cpgiVaLcurq4J/bt/EupRJfVKnK8trbJ4wBwU+cnFjrly7F6xMSUElUFDxnMEZzPvxzfz/aevMmYuXlvZUVFKhQd/e4NICPPTwcITER39++He1wd7dnkAbUGg38fuwYLeXAAVlTR8e4MEDEYzJ1kuRkOJmSAsyBPk02WKLVoqI9ezrUhw9XVvX1UWZAZJNQiL/LyQG9j89YCDchqbYWpBs3yo/euDGmBojFdHpXkUQCnjt3gj+dTon4Qar1eni+Z89CyMjYjfr7STcgfDGbjWrOnwf/sDBKhb/PudJSp3txcZcWabWkGcDHXl6OYVIpMPz8qNZrlvLKSqiMjpbPbWsjWoRGNOOSYg7H4U1FxbgVDwAgnDcPv7h2LaJm6lS7GiDiubr2t5WUoC94PKo1WgPt9/UFkMvDF7PZdjFALKbTdV0XLsB5f3+qxRHmxzlz4Mzp0+mYZlWf1Tu4d0hGBnJau5ZqTSMFFfv4PPmjt7ehsaJi2HzDHYxsEgr72xQKlGLdyXGJp04HkwWC4cYJFoWJeEwmvnL8OGniD2Vl0TZ7e+PTXC7evW8fKXU8ZzDw5pyceQEODpayWLwCIv6USCA/I4OMuPCVwkKFw+rVRvUVnzkDx+PiyKgPlScnX9UdPGjumNnW5WMPDziZkkJGMAAAKF4mM0kslErJqg+vSEvjYzc3wgY43k1KIvXFprOnh1Cavehis5kBiYmEDOBjFxeo2rqVtGAoAockJQU/cXKyagDTLTYWCsxfLhOauilTWB3Ll1s1AG9Ys4bqWEljp6k2IwNEPE9P/I1QSHWcpMGKjIyJMZ6tMjKgb6VQOGEHPUR4zmC8VYWGWjQAuXzArT9IlfE8hnFrZ8yfT3V8pPMiONiCAQhBpq8v1fGRDTpsrNFggIjH5VpbtPgg6GKz+djLa/CvYdGiN43DoRXYdk58pbAQxctkREdzjMc3b5pL080g+C7g7uyMP4+KQn+vWmVLvMwlXC5AS4uRAbQAFgtsMcBh716FQ1qabda9Q1rf1AT1Z88SLnA2Nzdc3dCA0lNTR1qXXsZiDb4GGroADmGxbAmctuHo0dGKtxX6syNHbCmH2l1dDfFTFbw96Ptr9GMWwwnQjZHNpw+i52zbRpUB9CW21U17806r4R7QX6XV2mInSk9NjSieORMKpdKR3ASl9U1NQ9NEvOnTdTMWLCBSHse7uKACkQhyxWKbnPtWozHEP/gjLIHLpT8zDoo0cFycXGF8w4sIF4sBFRWNRfW9VzkcFRp4ChgaXZnX3IwltnWDCYVaoxkUb2QAAMYo7MEDquMjncK6uqF/jbt99507VMdHNmjHrVuWDVhaXk51gGSDvzfWaLR/p1deXu7oqddTvuZPFtV6Pe2+SjU0yegKUKEXL6DsA74KHsnl7+8tMp0TDD91iuo4yQLHmmozMQApiotxdmcn1cHanfqOjkn7L160aoB8bk8PTKXuBYc0tNnZlz979cqqAQAA+IfsbAiz74ZEI9xNV51wPImTMWqNxjHI/JujWQPK8trbQUrSii0AwNcikUkaPzqatPrWZ2WVlJjv1hZXh8VfOTp2yWtqIHD2bDJiwrv37YNZA10NybZvh1ySFmOTams7JH5+ljZUDrtBIsKDzwcoK5uw44JqvR7PFQgUZdevW8oyrLCGV42NM3toNDglEFCtxRaQQ3q6XJ2fP1weq1MAbnGZmXBIoaBazIg5V1q6oGrvXmvZCG2UFPFcXfsOlJejYwEBVOsixKG7d3vn8Pkq1NVlLSuhSSBpvUbTtyImBl+qr6dam1XoDx/qX0dGEhFP2AAAABVqaemvWbQIVlZXU63RIkH37uF8gUAZ3NpKtMiIpgGVwa2tjF8EAnxQLqdaqwnnSkudokJCFB7NzSMpZuP3AgiF1yYno9CsLMofkWO9XX4okf6hobghJ4eswZJVkmpr8a+bNg33nLfGqFrvUUtj47xlJ068yXr9GgcFBqJrTOaYCFdrNBC+a1dH3rp1N9SPH4/mVHb7aErEc3Xtu7RlC4pJTgbe5MmkCR9vH029Dx9PmuQYsWzZR/fZnDkWJ0yZgr7k81FGWBh8GhQEF2fNgoXvFibNotZooLCuDnpu34Z/lUrabyqVvVp7zA0wx5JiDgfneHvjg2w25g7MAaCn3d3op5cv0abmZlnss2djHdP/fMz8ByXknDIuxn6CAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTEwLTI3VDE5OjA1OjIyKzAwOjAwR2fKCAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMi0xMC0yN1QxOTowNToyMiswMDowMDY6crQAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjItMTAtMjdUMTk6MDU6MjIrMDA6MDBhL1NrAAAAAElFTkSuQmCC";
const TicketForm = () => {
  const navigate = useNavigate();
  const [addTicket] = useAddTicketMutation();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    watch
  } = useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const watchedFile = watch("file");
  useEffect(() => {
    if (watchedFile == null ? void 0 : watchedFile[0]) {
      const file = watchedFile[0];
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [watchedFile]);
  const onSubmitForm = async (formData) => {
    var _a, _b;
    try {
      const file = (_a = formData.file) == null ? void 0 : _a[0];
      const payload = new FormData();
      payload.append("issueType", formData.issueType);
      payload.append("description", formData.description);
      if (file) payload.append("file", file);
      await addTicket(payload).unwrap();
      alert("Ticket submitted successfully!");
      navigate("/support/");
      reset();
      setImagePreview(null);
    } catch (error) {
      console.error(error);
      alert(
        ((_b = error == null ? void 0 : error.data) == null ? void 0 : _b.message) || "Failed to submit the ticket. Please try again."
      );
    }
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmitForm), className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 mb-4", children: [
      /* @__PURE__ */ jsx(Field, { label: "Issue Type", error: errors.issueType, children: /* @__PURE__ */ jsxs(
        "select",
        {
          ...register("issueType", {
            required: "Issue type is required"
          }),
          id: "issueType",
          className: "border px-3 py-2 rounded",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select Issue Type*" }),
            /* @__PURE__ */ jsx("option", { value: "Account Issue", children: "Account Issue" }),
            /* @__PURE__ */ jsx("option", { value: "Payment Issue", children: "Payment Issue" }),
            /* @__PURE__ */ jsx("option", { value: "Technical Issue", children: "Technical Issue" }),
            /* @__PURE__ */ jsx("option", { value: "Mexc Telegram Group", children: "Mexc Telegram Group" }),
            /* @__PURE__ */ jsx("option", { value: "Boflin Telegram Group", children: "Boflin Telegram Group" }),
            /* @__PURE__ */ jsx("option", { value: "Welcome Paid Email Issue", children: "Welcome Paid Email Issue" }),
            /* @__PURE__ */ jsx("option", { value: "OTP Issues", children: "OTP Issues" }),
            /* @__PURE__ */ jsx("option", { value: "Forgot Password Issues", children: "Forgot Password Issues" }),
            /* @__PURE__ */ jsx("option", { value: "Other", children: "Other" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx(Field, { label: "Description", error: errors.description, children: /* @__PURE__ */ jsx(
        "textarea",
        {
          ...register("description", {
            required: "Description is required"
          }),
          id: "description",
          placeholder: "Add Description*",
          className: "border px-3 py-2 rounded"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 mb-4", children: [
      /* @__PURE__ */ jsx("div", { children: "Kindly upload a screenshot of the issue (Optional)" }),
      /* @__PURE__ */ jsxs(
        "label",
        {
          className: "h-[9.375rem] max-w-[15.625rem] border-2 border-dashed border-[#adadad] rounded-[0.313rem] flex items-center justify-center relative cursor-pointer",
          children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                ...register("file"),
                type: "file",
                id: "file",
                accept: "image/*",
                className: "absolute inset-0 opacity-0 cursor-pointer",
                onChange: (e) => {
                  var _a;
                  const file = (_a = e.target.files) == null ? void 0 : _a[0];
                  if (file) {
                    setImagePreview(URL.createObjectURL(file));
                  } else {
                    setImagePreview(null);
                  }
                }
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "size-[1.875rem] flex items-center justify-center absolute inset-0 bg-white w-full h-full", children: imagePreview ? /* @__PURE__ */ jsx(
              "img",
              {
                src: imagePreview,
                alt: "Preview",
                className: "object-contain max-h-full max-w-full"
              }
            ) : /* @__PURE__ */ jsx(
              "img",
              {
                className: "object-contain",
                src: Download,
                alt: "Upload Icon"
              }
            ) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex", children: /* @__PURE__ */ jsx(
      "button",
      {
        className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition",
        type: "submit",
        children: "Submit"
      }
    ) })
  ] });
};
function Ticket() {
  return /* @__PURE__ */ jsx("section", { className: "py-[70px]", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-primary to-secondary rounded-[20px] p-1 max-w-[62.5rem] mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-[18px] py-5 px-[7px] md:p-10 flex flex-col gap-[4.063rem]", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-center text-[28px] leading-[1.2] font-semibold text-title lg:text-[35px]", children: "Create Ticket" }),
    /* @__PURE__ */ jsx(TicketForm, {})
  ] }) }) }) });
}
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ticket
}, Symbol.toStringTag, { value: "Module" }));
const aboutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAbout: builder.query({
      query: () => "/about/data/"
    })
  })
});
const { useGetAboutQuery } = aboutApi;
const About = () => {
  var _a, _b, _c;
  const auth = useSelector((state) => state.auth);
  const { data } = useGetAboutQuery(void 0, { refetchOnMountOrArgChange: true });
  return /* @__PURE__ */ jsx("section", { className: "relative top-0 left-0 right-0 py-5 lg:py-12 w-full", id: "about", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full", children: /* @__PURE__ */ jsxs("div", { className: "py-[1.563rem] px-[0.938rem] sm:p-[3.125rem] rounded-[1.125rem] text-white  bg-gradient-to-r from-primary to-secondary", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-title mb-5", children: "About" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col-reverse gap-6 lg:gap-0 lg:flex-row items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:w-[58.33%] lg:pr-3", children: [
        /* @__PURE__ */ jsx("h5", { className: "mb-[1.875rem] text-[1.188rem] md:text-[1.438rem]", children: (_a = data == null ? void 0 : data.data) == null ? void 0 : _a.title }),
        /* @__PURE__ */ jsx("p", { className: "mb-10 text-black", dangerouslySetInnerHTML: { __html: (_b = data == null ? void 0 : data.data) == null ? void 0 : _b.description } }),
        /* @__PURE__ */ jsx(
          Link,
          {
            className: "min-w-[10.313rem] inline-block bg-secondary border-2 border-secondary rounded-[1.875rem] text-white py-2.5 px-5 text-center uppercase duration-300 ease-linear hover:-translate-y-3 transition-transform",
            to: `${(auth == null ? void 0 : auth.user) ? "/subscription/" : "/login/"}`,
            children: "Join Now"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "lg:w-[41.66%] lg:pl-3", children: /* @__PURE__ */ jsx("video", { className: "rounded", controls: true, src: `${MEDIA_URL}${(_c = data == null ? void 0 : data.data) == null ? void 0 : _c.video}` }) })
    ] })
  ] }) }) });
};
const Banner = () => {
  var _a, _b, _c, _d, _e;
  const { data } = useGetBannerQuery(void 0, { refetchOnMountOrArgChange: true });
  const { MdArrowRightAlt: MdArrowRightAlt2 } = ReactIcons;
  const dispatch = useDispatch();
  const handleOpen = () => {
    dispatch(openSeeMore());
  };
  return /* @__PURE__ */ jsx("section", { className: "py-5 lg:py-12 w-full", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10 items-center justify-center w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap w-full", children: [
      /* @__PURE__ */ jsx("h3", { className: "uppercase text-secondary text-2xl font-semibold", children: (_a = data == null ? void 0 : data.data) == null ? void 0 : _a.sub_title }),
      /* @__PURE__ */ jsx("h1", { className: "mb-5 text-secondary text-4xl lg:text-6xl font-bold mt-2.5", children: (_b = data == null ? void 0 : data.data) == null ? void 0 : _b.title }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4 mb-4 text-body-color", children: /* @__PURE__ */ jsx(
        "p",
        {
          className: "text-justify",
          dangerouslySetInnerHTML: { __html: (_c = data == null ? void 0 : data.data) == null ? void 0 : _c.description }
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "mb-5", children: /* @__PURE__ */ jsx("button", { className: "text-secondary underline cursor-pointer", type: "button", onClick: handleOpen, children: "See More" }) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(
        Link,
        {
          className: "flex items-center p-[0.313rem] border border-primary rounded-[1.875rem] uppercase text-secondary cursor-pointer w-full transition-all duration-300 ease-in-out hover:bg-primary group",
          to: (_d = data == null ? void 0 : data.data) == null ? void 0 : _d.our_channel_url,
          target: "_blank",
          children: [
            /* @__PURE__ */ jsx("span", { className: "grow text-center", children: "Join Our Channels" }),
            /* @__PURE__ */ jsx("div", { className: "bg-primary size-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ease-in-out group-hover:bg-secondary", children: /* @__PURE__ */ jsx(MdArrowRightAlt2, { className: "text-xl text-white" }) })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap justify-center items-center w-full h-full", children: /* @__PURE__ */ jsx("video", { className: "w-full h-auto rounded-2xl", controls: true, src: `${MEDIA_URL}${(_e = data == null ? void 0 : data.data) == null ? void 0 : _e.video}` }) })
  ] }) }) });
};
const servicesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => "/services/data/"
    })
  })
});
const { useGetServicesQuery } = servicesApi;
const Services = () => {
  var _a;
  const { data } = useGetServicesQuery(void 0, { refetchOnMountOrArgChange: true });
  return /* @__PURE__ */ jsx("section", { className: "relative top-0 left-0 right-0 py-5 lg:py-12 w-full", id: "services", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap gap-10 w-full", children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap justify-center items-center text-center w-full", children: /* @__PURE__ */ jsxs("h2", { className: "flex flex-col", children: [
      "our ",
      /* @__PURE__ */ jsx("span", { className: "text-secondary", children: " education services" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-[1.875rem] sm:grid-cols-2 lg:grid-cols-3", children: (_a = data == null ? void 0 : data.data) == null ? void 0 : _a.map((item) => {
      return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5 hover:-translate-y-3 transition-transform duration-300 ease-in-out cursor-pointer", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("img", { className: "w-full max-w-full object-cover h-56 rounded-xl", src: `${MEDIA_URL}${item.image}`, alt: item == null ? void 0 : item.title }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "text-title", children: item == null ? void 0 : item.title }),
          /* @__PURE__ */ jsx("p", { className: "line-clamp-4 lg:line-clamp-6", dangerouslySetInnerHTML: { __html: item == null ? void 0 : item.description } })
        ] })
      ] });
    }) })
  ] }) }) });
};
const Team = () => {
  var _a;
  const { data } = useGetTeamQuery(void 0, { refetchOnMountOrArgChange: true });
  console.log("data", data);
  return /* @__PURE__ */ jsx("section", { className: "relative top-0 left-0 right-0 py-5 lg:py-12 w-full", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap items-center justify-center w-full", children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap justify-center items-center w-full", children: /* @__PURE__ */ jsxs("h2", { className: "flex flex-col", children: [
      "Team ",
      /* @__PURE__ */ jsx("span", { className: "text-secondary", children: " Acknowledgements" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10", children: (_a = data == null ? void 0 : data.data) == null ? void 0 : _a.map((item) => {
      return /* @__PURE__ */ jsxs(
        Link,
        {
          className: "relative flex flex-col rounded-2xl overflow-hidden transition-all duration-500 top-0 hover:shadow-[0_7px_10px_-1px_#000000bf] hover:top-[-10px]",
          to: item.link || "/",
          children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 right-0 bottom-0 bg-[linear-gradient(180deg,#0000_17.5%,#000_78%)]" }),
            /* @__PURE__ */ jsx("img", { src: `${MEDIA_URL}${item.image}`, alt: item.title }),
            /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 left-0 right-0 py-5 px-4 md:px-[25px] text-white text-center", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-lg sm:text-[23px] text-secondary font-medium leading-[1.3] mb-[10px]", children: item == null ? void 0 : item.title }),
              /* @__PURE__ */ jsx("p", { className: "line-clamp-4 lg:line-clamp-6", dangerouslySetInnerHTML: { __html: item == null ? void 0 : item.description } }),
              /* @__PURE__ */ jsx(Link, { className: "text-white", to: item == null ? void 0 : item.url, target: "_blank", children: "Learn More" })
            ] })
          ]
        },
        item.id
      );
    }) })
  ] }) }) });
};
const Why_Us = () => {
  var _a;
  const { data } = useGetWhy_usQuery(void 0, { refetchOnMountOrArgChange: true });
  return /* @__PURE__ */ jsx("section", { className: "relative top-0 left-0 right-0 py-5 lg:py-12 w-full", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full", children: /* @__PURE__ */ jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: (_a = data == null ? void 0 : data.data) == null ? void 0 : _a.map((item) => {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: "pt-12 px-5 pb-[1.875rem] flex flex-col gap-5 bg-cover bg-no-repeat bg-center rounded lg:rounded-2xl hover:-translate-y-3 transition-transform duration-300 ease-in-out cursor-pointer",
        style: { backgroundImage: `url(${MEDIA_URL}${item.image})` },
        children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("img", { src: `${MEDIA_URL}${item.sub_image}`, alt: "" }) }),
          /* @__PURE__ */ jsxs("div", { className: "text-white", children: [
            /* @__PURE__ */ jsx("h5", { className: "mb-2", children: item == null ? void 0 : item.title }),
            /* @__PURE__ */ jsx("p", { className: "text-xs leading-normal", dangerouslySetInnerHTML: { __html: item == null ? void 0 : item.description } })
          ] })
        ]
      }
    );
  }) }) }) });
};
const meta$1 = () => {
  return [{ title: "bjollys" }, { name: "description", content: "Welcome to Remix!" }];
};
function Index() {
  return /* @__PURE__ */ jsx("section", { className: "relative top-0 left-0 right-0 w-full", children: /* @__PURE__ */ jsxs("section", { className: "relative top-0 left-0 right-0 w-full", children: [
    /* @__PURE__ */ jsx(Banner, {}),
    /* @__PURE__ */ jsx(Team, {}),
    /* @__PURE__ */ jsx(Why_Us, {}),
    /* @__PURE__ */ jsx(Services, {}),
    /* @__PURE__ */ jsx(About, {})
  ] }) });
}
const route17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const loader = async ({ params }) => {
  const slug = params.slug;
  const res = await fetch(`${SERVER_URL}/pages/all/`);
  const data = await res.json();
  const matched = data.results.find(
    (item) => item.menu.slug === slug
  );
  if (!matched) {
    throw new Response("Not Found", { status: 404 });
  }
  return json(matched);
};
function PageSlug() {
  const page = useLoaderData();
  return /* @__PURE__ */ jsx("main", { className: "relative top-0 left-0 right-0 w-full py-5", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap gap-y-5", children: [
    page.title && /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-4 text-center", children: page.title }),
    page.image && /* @__PURE__ */ jsx("img", { src: page.image, alt: page.title, className: "mb-4 rounded" }),
    page.video && /* @__PURE__ */ jsx("video", { controls: true, className: "mt-4 w-full rounded", children: /* @__PURE__ */ jsx("source", { src: page.video, type: "video/mp4" }) }),
    page.body && /* @__PURE__ */ jsx(
      "div",
      {
        className: "prose",
        dangerouslySetInnerHTML: { __html: page.body }
      }
    )
  ] }) }) });
}
const route18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PageSlug,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const LoginForm = () => {
  const [addLogin, { isLoading }] = useAddLoginMutation();
  const navigate = useNavigate();
  const [isShow, setIsShow] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [publicIp, setPublicIp] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();
  const { IoEye: IoEye2, IoMdEyeOff: IoMdEyeOff2 } = ReactIcons;
  useEffect(() => {
    fetch("https://api.ipify.org?format=json").then((res) => res.json()).then((data) => setPublicIp(data.ip)).catch(() => setPublicIp(""));
  }, []);
  const onSubmitForm = async (formData) => {
    try {
      const dataWithIp = { ...formData, local_ip: publicIp || void 0 };
      await addLogin(dataWithIp).unwrap();
      alert("Login successfully");
      navigate("/");
      reset();
    } catch (err) {
      alert("Something went wrong");
    }
  };
  return /* @__PURE__ */ jsxs("form", { className: "flex flex-col flex-wrap gap-y-5 w-full", onSubmit: handleSubmit(onSubmitForm), children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap w-full", children: /* @__PURE__ */ jsx(Field, { label: "", error: errors.email, children: /* @__PURE__ */ jsx(
      "input",
      {
        ...register("email", {
          required: "Email is required"
        }),
        className: "w-full",
        type: "email",
        name: "email",
        id: "email",
        placeholder: "Email"
      }
    ) }) }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap w-full", children: /* @__PURE__ */ jsx(Field, { label: "", error: errors.password, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-row flex-wrap w-full relative", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          ...register("password", {
            required: "Password is required"
          }),
          className: "w-full",
          type: isShow ? "text" : "password",
          name: "password",
          id: "password",
          placeholder: "Password"
        }
      ),
      /* @__PURE__ */ jsx("button", { className: "absolute right-2 top-1/2 -translate-y-1/2", type: "button", onClick: () => setIsShow(!isShow), children: isShow ? /* @__PURE__ */ jsx(IoMdEyeOff2, { className: "text-gray-600 text-lg" }) : /* @__PURE__ */ jsx(IoEye2, { className: "text-gray-600 text-lg" }) })
    ] }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row flex-wrap items-center justify-between w-full", children: [
      /* @__PURE__ */ jsx(Link, { className: "text-secondary underline", to: "/register/", children: "Create New Account?" }),
      /* @__PURE__ */ jsx(Link, { className: "text-secondary underline", to: "/forgot-password/", children: "Forgot Password?" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap w-full", children: /* @__PURE__ */ jsx(
      "button",
      {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
        className: `text-base font-medium py-4 px-5 rounded-md uppercase transition-all duration-300 text-title outline-2 outline-transparent bg-gradient-to-r from-primary to-secondary hover:bg-none hover:outline-primary ${hovered ? "bg-transparent outline-primary" : "bg-gradient-to-r from-primary to-secondary"}`,
        type: "submit",
        children: "Submit"
      }
    ) })
  ] });
};
const meta = () => {
  return [{ title: "Bijolis - Login From" }, { name: "description", content: "Welcome to Remix!" }];
};
function Login() {
  return /* @__PURE__ */ jsx("section", { className: "relative top-0 left-0 right-0 w-full", children: /* @__PURE__ */ jsx("section", { className: "relation top-0 left-0 right-0 py-20 w-full", children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap justify-center items-center w-full", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-wrap w-full lg:w-[70%] py-1.5 px-1.5 rounded-[20px] bg-gradient-to-r from-primary to-secondary", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-wrap w-full py-5 lg:py-10 px-2.5 lg:px-10 bg-white rounded-[18px]", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-medium uppercase py-5 lg:py-10 text-center text-title", children: "Login" }),
    /* @__PURE__ */ jsx(LoginForm, {})
  ] }) }) }) }) }) });
}
const route19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Login,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DZNyI-M6.js", "imports": ["/assets/index-7zqVQZSl.js", "/assets/index-BGq1ChQV.js", "/assets/index-BKM5EYG8.js", "/assets/components-D5DyCDxT.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-VDLEtcHh.js", "imports": ["/assets/index-7zqVQZSl.js", "/assets/index-BGq1ChQV.js", "/assets/index-BKM5EYG8.js", "/assets/components-D5DyCDxT.js", "/assets/apiSlice-B07QsG9S.js", "/assets/homepageApi-DE_enf_u.js", "/assets/reactIcons-CaAhgrcf.js"], "css": ["/assets/root-CfbQUbwk.css"] }, "routes/confirm-password.$uidb64.$token": { "id": "routes/confirm-password.$uidb64.$token", "parentId": "root", "path": "confirm-password/:uidb64/:token", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/confirm-password._uidb64._token-076ls9dY.js", "imports": ["/assets/index-7zqVQZSl.js", "/assets/field-ShKTF1df.js", "/assets/authApi-DmKKkXNm.js", "/assets/index-BKM5EYG8.js", "/assets/apiSlice-B07QsG9S.js"], "css": [] }, "routes/success-change-password": { "id": "routes/success-change-password", "parentId": "root", "path": "success-change-password", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/success-change-password-DKe9irNB.js", "imports": ["/assets/index-7zqVQZSl.js", "/assets/components-D5DyCDxT.js", "/assets/index-BGq1ChQV.js", "/assets/index-BKM5EYG8.js"], "css": [] }, "routes/terms-and-conditions": { "id": "routes/terms-and-conditions", "parentId": "root", "path": "terms-and-conditions", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/terms-and-conditions-DmTAAIGv.js", "imports": ["/assets/index-7zqVQZSl.js", "/assets/apiSlice-B07QsG9S.js"], "css": [] }, "routes/crypto.subscription": { "id": "routes/crypto.subscription", "parentId": "root", "path": "crypto/subscription", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/crypto.subscription-BIsH1-__.js", "imports": ["/assets/index-7zqVQZSl.js", "/assets/apiSlice-B07QsG9S.js", "/assets/cryptoApi-BQVtWaVM.js", "/assets/paymentsApi-DkGlB8Q9.js", "/assets/index-BKM5EYG8.js"], "css": [] }, "routes/forgot-password": { "id": "routes/forgot-password", "parentId": "root", "path": "forgot-password", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/forgot-password-C2WEv8TC.js", "imports": ["/assets/index-7zqVQZSl.js", "/assets/field-ShKTF1df.js", "/assets/authApi-DmKKkXNm.js", "/assets/apiSlice-B07QsG9S.js"], "css": [] }, "routes/payment.success": { "id": "routes/payment.success", "parentId": "root", "path": "payment/success", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/payment.success-CnSLxTrD.js", "imports": ["/assets/index-7zqVQZSl.js", "/assets/components-D5DyCDxT.js", "/assets/index-BGq1ChQV.js", "/assets/index-BKM5EYG8.js"], "css": [] }, "routes/payment.cancel": { "id": "routes/payment.cancel", "parentId": "root", "path": "payment/cancel", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/payment.cancel-CsjzvwBc.js", "imports": ["/assets/index-7zqVQZSl.js", "/assets/components-D5DyCDxT.js", "/assets/index-BGq1ChQV.js", "/assets/index-BKM5EYG8.js"], "css": [] }, "routes/privacy-policy": { "id": "routes/privacy-policy", "parentId": "root", "path": "privacy-policy", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/privacy-policy-0EjZ6IaC.js", "imports": ["/assets/index-7zqVQZSl.js", "/assets/apiSlice-B07QsG9S.js"], "css": [] }, "routes/single.course": { "id": "routes/single.course", "parentId": "root", "path": "single/course", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/single.course-BVrwfhxD.js", "imports": ["/assets/index-7zqVQZSl.js", "/assets/apiSlice-B07QsG9S.js", "/assets/crousesApi-BOkHAWIT.js", "/assets/paymentsApi-DkGlB8Q9.js", "/assets/index-BKM5EYG8.js"], "css": [] }, "routes/subscription": { "id": "routes/subscription", "parentId": "root", "path": "subscription", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/subscription-DX3dMznJ.js", "imports": ["/assets/index-7zqVQZSl.js", "/assets/apiSlice-B07QsG9S.js", "/assets/cryptoApi-BQVtWaVM.js", "/assets/paymentsApi-DkGlB8Q9.js", "/assets/index-BKM5EYG8.js"], "css": [] }, "routes/pay-history": { "id": "routes/pay-history", "parentId": "root", "path": "pay-history", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/pay-history-BVUp9klf.js", "imports": ["/assets/index-7zqVQZSl.js", "/assets/dayjs.min-BRK4WLUO.js", "/assets/utc-BIQzp-gY.js", "/assets/paymentsApi-DkGlB8Q9.js", "/assets/apiSlice-B07QsG9S.js"], "css": [] }, "routes/e-commerce": { "id": "routes/e-commerce", "parentId": "root", "path": "e-commerce", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/e-commerce-Cq1vDtWf.js", "imports": ["/assets/index-7zqVQZSl.js", "/assets/field-ShKTF1df.js", "/assets/apiSlice-B07QsG9S.js", "/assets/paymentsApi-DkGlB8Q9.js", "/assets/components-D5DyCDxT.js", "/assets/index-BGq1ChQV.js", "/assets/index-BKM5EYG8.js"], "css": [] }, "routes/dashboard": { "id": "routes/dashboard", "parentId": "root", "path": "dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/dashboard-B7Tk-ayM.js", "imports": ["/assets/index-7zqVQZSl.js", "/assets/dayjs.min-BRK4WLUO.js", "/assets/crousesApi-BOkHAWIT.js", "/assets/paymentsApi-DkGlB8Q9.js", "/assets/apiSlice-B07QsG9S.js", "/assets/index-U7tiAVa-.js", "/assets/index-BGq1ChQV.js"], "css": ["/assets/dashboard-DncTmDE-.css"] }, "routes/register": { "id": "routes/register", "parentId": "root", "path": "register", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/register-BctA2ASy.js", "imports": ["/assets/index-7zqVQZSl.js", "/assets/field-ShKTF1df.js", "/assets/authApi-DmKKkXNm.js", "/assets/reactIcons-CaAhgrcf.js", "/assets/index-U7tiAVa-.js", "/assets/index-BKM5EYG8.js", "/assets/components-D5DyCDxT.js", "/assets/apiSlice-B07QsG9S.js", "/assets/index-BGq1ChQV.js"], "css": ["/assets/register-DpsRipQV.css"] }, "routes/support": { "id": "routes/support", "parentId": "root", "path": "support", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/support-uScztm63.js", "imports": ["/assets/index-7zqVQZSl.js", "/assets/ticketApi-BNFKSctp.js", "/assets/dayjs.min-BRK4WLUO.js", "/assets/utc-BIQzp-gY.js", "/assets/components-D5DyCDxT.js", "/assets/apiSlice-B07QsG9S.js", "/assets/index-BGq1ChQV.js", "/assets/index-BKM5EYG8.js"], "css": [] }, "routes/ticket": { "id": "routes/ticket", "parentId": "root", "path": "ticket", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/ticket-NIuvFQhA.js", "imports": ["/assets/index-7zqVQZSl.js", "/assets/field-ShKTF1df.js", "/assets/ticketApi-BNFKSctp.js", "/assets/index-BKM5EYG8.js", "/assets/apiSlice-B07QsG9S.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-BSpogyyY.js", "imports": ["/assets/index-7zqVQZSl.js", "/assets/apiSlice-B07QsG9S.js", "/assets/components-D5DyCDxT.js", "/assets/homepageApi-DE_enf_u.js", "/assets/reactIcons-CaAhgrcf.js", "/assets/index-BGq1ChQV.js", "/assets/index-BKM5EYG8.js"], "css": [] }, "routes/$slug": { "id": "routes/$slug", "parentId": "root", "path": ":slug", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_slug-wVM7ripd.js", "imports": ["/assets/index-7zqVQZSl.js", "/assets/components-D5DyCDxT.js", "/assets/index-BGq1ChQV.js", "/assets/index-BKM5EYG8.js"], "css": [] }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/login-_D_iwePB.js", "imports": ["/assets/index-7zqVQZSl.js", "/assets/field-ShKTF1df.js", "/assets/authApi-DmKKkXNm.js", "/assets/reactIcons-CaAhgrcf.js", "/assets/index-BKM5EYG8.js", "/assets/components-D5DyCDxT.js", "/assets/apiSlice-B07QsG9S.js", "/assets/index-BGq1ChQV.js"], "css": [] } }, "url": "/assets/manifest-b9fe8daa.js", "version": "b9fe8daa" };
const mode = "production";
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": true, "v3_lazyRouteDiscovery": true, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/confirm-password.$uidb64.$token": {
    id: "routes/confirm-password.$uidb64.$token",
    parentId: "root",
    path: "confirm-password/:uidb64/:token",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/success-change-password": {
    id: "routes/success-change-password",
    parentId: "root",
    path: "success-change-password",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/terms-and-conditions": {
    id: "routes/terms-and-conditions",
    parentId: "root",
    path: "terms-and-conditions",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/crypto.subscription": {
    id: "routes/crypto.subscription",
    parentId: "root",
    path: "crypto/subscription",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/forgot-password": {
    id: "routes/forgot-password",
    parentId: "root",
    path: "forgot-password",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/payment.success": {
    id: "routes/payment.success",
    parentId: "root",
    path: "payment/success",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/payment.cancel": {
    id: "routes/payment.cancel",
    parentId: "root",
    path: "payment/cancel",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/privacy-policy": {
    id: "routes/privacy-policy",
    parentId: "root",
    path: "privacy-policy",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/single.course": {
    id: "routes/single.course",
    parentId: "root",
    path: "single/course",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/subscription": {
    id: "routes/subscription",
    parentId: "root",
    path: "subscription",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/pay-history": {
    id: "routes/pay-history",
    parentId: "root",
    path: "pay-history",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/e-commerce": {
    id: "routes/e-commerce",
    parentId: "root",
    path: "e-commerce",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/dashboard": {
    id: "routes/dashboard",
    parentId: "root",
    path: "dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/register": {
    id: "routes/register",
    parentId: "root",
    path: "register",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "routes/support": {
    id: "routes/support",
    parentId: "root",
    path: "support",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  },
  "routes/ticket": {
    id: "routes/ticket",
    parentId: "root",
    path: "ticket",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route17
  },
  "routes/$slug": {
    id: "routes/$slug",
    parentId: "root",
    path: ":slug",
    index: void 0,
    caseSensitive: void 0,
    module: route18
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route19
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
