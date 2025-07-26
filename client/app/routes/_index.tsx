import type { MetaFunction } from "@remix-run/node";
import { About } from "~/components/about/about";
import { Banner } from "~/components/banner/banner";
import { Services } from "~/components/services/services";
import { Team } from "~/components/team/team";
import { Why_Us } from "~/components/why_us/why_us";
import { SERVER_URL } from "~/utils/api";

export const meta: MetaFunction = () => {
  return [{ title: "bjollys" }, { name: "description", content: "Welcome to Remix!" }];
};

export default function Index() {
  console.log('SERVER URL : ', SERVER_URL);
  return (
    <section className="relative top-0 left-0 right-0 w-full">
      <section className="relative top-0 left-0 right-0 w-full">
        <Banner />
        <Team />
        <Why_Us />
        <Services />
        <About />
      </section>
    </section>
  );
}
