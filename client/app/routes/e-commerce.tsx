import { Link } from "@remix-run/react";
import { BookingForm } from "~/components/forms/booking";
import {
  useGetEcommerceAmazonQuery,
  useGetEcommerceCourseDetailsQuery,
  useGetEcommerceFaqQuery,
  useGetEcommerceImageQuery,
  useGetEcommerceServicesQuery,
  useGetEcommerceVideoQuery,
  useGetEcommerceWhatsappNumberQuery,
  useGetEcommerceYoutubeLinkQuery,
} from "~/redux/features/e-commerce/e-commerce";
import { useCreateEcommerceCheckoutSessionMutation } from "~/redux/features/payments/paymentsApi";
import { MEDIA_URL } from "~/utils/api";
import LEFTIMG from "../assets/images/Lets-Grow-Together.png";
import ULT from "../assets/images/Untitled-design-47.png";

export default function Ecommerce() {
  const { data: ecommerceImage } = useGetEcommerceImageQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: ecommerceVideo } = useGetEcommerceVideoQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: ecommerceAmazon } = useGetEcommerceAmazonQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: ecommerceCourseDetails } = useGetEcommerceCourseDetailsQuery(
    undefined,
    { refetchOnMountOrArgChange: true }
  );
  const { data: ecommerceYoutubeLink } = useGetEcommerceYoutubeLinkQuery(
    undefined,
    { refetchOnMountOrArgChange: true }
  );
  const { data: ecommerceFaq } = useGetEcommerceFaqQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: ecommerceServices } = useGetEcommerceServicesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: ecommerceWhatsappNumber } = useGetEcommerceWhatsappNumberQuery(
    undefined,
    { refetchOnMountOrArgChange: true }
  );

  const [createCheckoutSession, { isLoading }] =
    useCreateEcommerceCheckoutSessionMutation();

  const handleEcommercePayment = async (price: number) => {
    try {
      const res = await createCheckoutSession({
        amount: price * 100,
        currency: 'usd',
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

  return (
    <main className="bg-[#f6f6f6] pb-10">
      <section className="pt-10 lg:pt-10">
        <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-5">
          <div className="space-y-2.5">
            {ecommerceImage?.data?.map((item: any) => {
              return (
                <div key={item.id}>
                  <img
                    className="rounded-lg"
                    src={`${MEDIA_URL}${item.image}`}
                    alt=""
                  />
                </div>
              );
            })}
          </div>
          <h2 className="text-secondary text-xl lg:leading-[1.1] lg:text-5xl text-center font-semibold">
            আমি আপনাকে শিখবো, কিভাবে অ্যামাজনে সফল ব্যবসা প্রতিষ্ঠা করতে পারেন |
          </h2>
          <div className="space-y-2.5 border-8 border-[#FFBD00] rounded-3xl shadow-[0_0_10px_0_rgba(0,0,0,0.5)] overflow-hidden">
            {ecommerceVideo?.data?.map((item: any) => {
              return (
                <div>
                  <video src={`${MEDIA_URL}${item.video}`} controls></video>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pt-10 lg:pt-24">
        <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-8">
          <h2 className="text-title text-xl lg:leading-[1.1] lg:text-5xl font-semibold bg-primary p-2.5 rounded-3xl">
            সফল Amazon ব্যবসা করার জন্য যা যা জানা উচিৎ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ecommerceAmazon?.data?.map((item: any) => {
              return (
                <div className="p-5 flex flex-col items-center gap-5 bg-title rounded-xl cursor-pointer">
                  <div>
                    <svg
                      aria-hidden="true"
                      className="size-16 fill-primary text-primary hover:fill-secondary hover:text-secondary transition-all ease-in-out duration-300"
                      viewBox="0 0 512 512"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
                    </svg>
                  </div>
                  <h3
                    className="text-secondary font-medium text-xl lg:text-xl"
                    dangerouslySetInnerHTML={{ __html: item?.title }}
                  ></h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="pt-10 lg:pt-24">
        <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-8">
          <div>
            <img className="rounded-lg" src={LEFTIMG} alt="" />
          </div>
          <h2 className="text-title text-2xl leading-8 lg:leading-14 lg:text-5xl font-semibold bg-primary p-2.5 rounded-3xl">
            এই "COURSE" থেকে যা যা শিখতে পারবেন
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {ecommerceCourseDetails?.data?.map((item: any) => {
              return (
                <div className="p-5 flex flex-col items-center gap-5 bg-title rounded-xl">
                  <div>
                    <svg
                      aria-hidden="true"
                      className="size-16 fill-primary text-primary hover:fill-secondary hover:text-secondary transition-all ease-in-out duration-300"
                      viewBox="0 0 448 512"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"></path>
                    </svg>
                  </div>
                  <div className="space-y-5 lg:space-y-7 text-center">
                    <h3
                      className="text-secondary font-medium text-xl lg:text-3xl"
                      dangerouslySetInnerHTML={{ __html: item?.title }}
                    ></h3>
                    <div
                      className="text-secondary font-medium text-sm lg:text-lg text-start space-y-2 lg:space-y-3 e-com-text-aria text-editor"
                      dangerouslySetInnerHTML={{ __html: item?.description }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pt-10 lg:pt-24">
        <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-8">
          <h2 className="text-title text-2xl leading-8 lg:leading-14 lg:text-5xl font-semibold p-2.5 rounded-2xl border-4 border-primary">
            বিগত সময়ে আমার কোর্সে অংশগ্রহণ করার পর স্টুডেন্টদের ফিডব্যাক
          </h2>
        </div>
      </section>

      <section className="pt-10 lg:pt-24">
        <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-8">
          <div className="flex flex-col lg:flex-row gap-5 items-center flex-nowrap">
            <div className="w-full h-96">
              <img className="w-full h-full" src={ULT} alt="" />
            </div>
            <div className="w-full bg-title">
              <h3 className="text-white text-center p-2.5">
                Book a free call now to discover the Amazon course
              </h3>
              <BookingForm />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-5 items-center flex-nowrap">
            <div className="w-full">
              <h2 className="text-title text-2xl leading-8 lg:leading-14 lg:text-5xl font-semibold">
                Click to send WhatsApp message
              </h2>
            </div>
            <div className="w-full flex justify-center">
              <Link
                to={`https://wa.me/${ecommerceWhatsappNumber?.data?.number}`}
                className="size-36 rounded-2xl flex items-center justify-center bg-[#25d366] transform hover:scale-[0.8] transition duration-300"
                target="_blank"
              >
                <svg
                  className="size-16 fill-white"
                  viewBox="0 0 448 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-10 lg:pt-24">
        <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {ecommerceYoutubeLink?.data?.map((item: any) => {
            return (
              <div>
                <iframe
                  className="rounded"
                  width="100%"
                  height="350"
                  src={item.link}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
              </div>
            );
          })}
        </div>
      </section>

      <section className="pt-10 lg:pt-24">
        <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 grid grid-cols-1 xl:grid-cols-3 gap-x-2.5 gap-y-10">
          <div className="text-center">
            <h3 className="text-4xl xl:text-6xl font-semibold text-title">
              1,500 <span>+</span>
            </h3>
            <p className="underline text-base xl:text-2xl font-normal text-title">
              Clients
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl xl:text-6xl font-semibold text-title text-nowrap">
              $ 10,000,000<span>+</span>
            </h3>
            <p className="underline text-base xl:text-2xl font-normal text-title">
              Revenue generated
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl xl:text-6xl font-semibold text-title">
              500<span>+</span>
            </h3>
            <p className="underline text-base xl:text-2xl font-normal text-title">
              Companies
            </p>
          </div>
        </div>
      </section>

      <section className="pt-10 lg:pt-24">
        <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-5">
          <h2 className="text-title text-2xl leading-8 lg:leading-14 lg:text-5xl font-semibold">
            প্রশ্ন এবং উত্তর
          </h2>
          <div className="">
            {ecommerceFaq?.data?.map((item: any) => {
              return (
                <details className="border-b border-gray-200 p-4" key={item.id}>
                  <summary
                    className="flex justify-between items-center w-full text-left text-xl lg:text-2xl text-title font-semibold cursor-pointer"
                    dangerouslySetInnerHTML={{ __html: item?.question }}
                  />
                  <div className="mt-4">
                    <p
                      className="text-base font-normal text-black"
                      dangerouslySetInnerHTML={{ __html: item?.answer }}
                    ></p>
                  </div>
                </details>
              );
            })}
          </div>
          <div className="mt-5 flex items-center justify-center">
            <Link
              to="/single/course/"
              className="bg-secondary font-medium text-2xl lg:text-3xl rounded-full px-10 py-5 text-white cursor-pointer transition-all duration-300 ease-linear hover:bg-primary hover:text-title"
            >
              কোর্সে জয়েন করুন
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8 lg:py-12">
        <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 flex flex-col gap-y-5 md:gap-y-10">
          <h2 className="text-title text-2xl lg:text-5xl font-semibold bg-primary px-5 py-3 rounded-3xl text-center">
            Service Section
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-5">

            {ecommerceServices?.data?.map((item: any) => {
              return (
                <div
                  className="rounded-2xl bg-white shadow-[0_1px_10px_rgba(29,29,32,0.0784314),_0_4px_5px_rgba(29,29,32,0.0509804),_0_2px_4px_-1px_rgba(29,29,32,0.160784)] overflow-hidden transition-transform hover:scale-[1.02] duration-300"
                  key={item.id}
                >
                  <div className="pt-8 px-8 pb-6 text-center space-y-5 border-b border-[#e5e7eb]">
                    <h3 className="text-3xl font-semibold text-[#140751]">{item.title}</h3>
                    <p className="text-5xl font-bold text-[#140751]">${item.price} <span className="text-lg font-medium text-gray-500">/mo</span></p>
                    <button
                      type="button"
                      onClick={() => handleEcommercePayment(item.price)}
                      className="bg-secondary font-medium text-base lg:text-xl rounded-full px-10 py-5 text-white cursor-pointer transition-all duration-300 ease-linear hover:bg-primary hover:text-title"
                    >
                      Buy Now
                    </button>
                  </div>
                  <ul className="py-6 px-8 list-disc list-inside space-y-2 text-[#333] text-base" dangerouslySetInnerHTML={{ __html: item?.description }}></ul>
                </div>
              );
            })}

          </div>
        </div>
      </section>
    </main>
  );
}
