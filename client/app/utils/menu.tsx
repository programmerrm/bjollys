import { MenuPropsType } from "~/types/menu/menuPropsType";
import { ReactIcons } from "./reactIcons";

const { HiMiniHome } = ReactIcons;

export const NONAUTHMenu: MenuPropsType[] = [
    {
        id: 1,
        name: undefined,
        path: "/",
        icon: <HiMiniHome className="text-lg" />,
    },
    {
        id: 2,
        name: "channels",
        path: undefined,
        icon: undefined,
    },
    {
        id: 3,
        name: "services",
        path: "/#services",
        icon: undefined,
    },
    {
        id: 4,
        name: "about",
        path: "/#about",
        icon: undefined,
    },
    {
        id: 5,
        name: "e-commerce",
        path: "/e-commerce/",
        icon: undefined,
    },
    {
        id: 6,
        name: "Crypto",
        path: "/crypto/subscription/",
        icon: undefined,
    },
];

export const Menu: MenuPropsType[] = [
    {
        id: 1,
        name: undefined,
        path: "/",
        icon: <HiMiniHome className="text-lg" />,
    },
    {
        id: 2,
        name: "channels",
        path: undefined,
        icon: undefined,
    },
    {
        id: 3,
        name: "services",
        path: "/#services",
        icon: undefined,
    },
    {
        id: 4,
        name: "about",
        path: "/#about",
        icon: undefined,
    },
    {
        id: 5,
        name: "e-commerce",
        path: "/e-commerce/",
        icon: undefined,
    },
    {
        id: 7,
        name: "Crypto",
        path: "/crypto/subscription/",
        icon: undefined,
    },
    {
        id: 8,
        name: "subscription",
        path: "/subscription/",
        icon: undefined,
    },
    {
        id: 9,
        name: "dashboard",
        path: "/dashboard/",
        icon: undefined,
    },
];
