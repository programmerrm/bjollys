import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";
import { Provider, useSelector } from "react-redux";
import { RootState, store } from "./redux/store";
import { Header } from "./components/header/header";
import { Channels } from "./components/popup/channels/channels";
import { SeeMore } from "./components/popup/see-more/seemore";
import { Footer } from "./components/footer/footer";
import { FooterSeeMore } from "./components/popup/footer-see-more/footer-see-more";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Jost:wght@400;500;700&family=Nunito:wght@400;600;700&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/bjollys-favicon.png" />
        <Meta />
        <Links />
      </head>
      <body>
        
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

function AppContent() {
  const channelOpen = useSelector((state: RootState) => state.popup.channel);
  const seemoreOpen = useSelector((state: RootState) => state.popup.seemore);
  const footerSeemoreOpen = useSelector((state: RootState) => state.popup.footer_seemore);
  return (
    <>
      {channelOpen && <Channels />}
      {seemoreOpen && <SeeMore />}
      {footerSeemoreOpen && <FooterSeeMore />}
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}