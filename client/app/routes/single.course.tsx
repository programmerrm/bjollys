import { useNavigate } from "@remix-run/react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { SingleCourseBundle, useGetSingleEcommerceCrousesQuery } from "~/redux/features/crouses/crousesApi";
import { useCreateEcommerceCheckoutSessionMutation } from "~/redux/features/payments/paymentsApi";
import { RootState } from "~/redux/store";
import { MEDIA_URL } from "~/utils/api";

export default function Dashboard() {
    const navigate = useNavigate();
    const auth = useSelector((state: RootState) => state.auth);
    const { data } = useGetSingleEcommerceCrousesQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const courseData = data?.data;
    const bundles = courseData?.single_course_bundles || [];

    const [activeBundle, setActiveBundle] = useState<SingleCourseBundle | null>(null);

    useEffect(() => {
        if (bundles.length > 0) {
            setActiveBundle(bundles[0]);
        }
    }, [bundles]);

    const [createCheckoutSession, { isLoading }] =
        useCreateEcommerceCheckoutSessionMutation();

    const handleEcommercePayment = async (price?: number) => {
        if (!auth?.user) return navigate('/login/');
        if (!price) {
            alert("No bundle selected.");
            return;
        }

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
        <section className="min-h-screen pb-5 px-4 flex flex-col bg-white">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-5 grow">
                <div className="rounded-2xl overflow-hidden flex-1/2 grow flex flex-col">
                    <img
                        className="transition-all duration-300 ease-linear hover:scale-[1.1] h-full grow cursor-pointer"
                        src={`${MEDIA_URL}${courseData?.image}`}
                        alt={courseData?.title}
                    />
                </div>
                <div className="flex-1/2 lg:self-center">
                    <h2 className="text-2xl text-left font-semibold mb-2">
                        {courseData?.title}
                    </h2>

                    {activeBundle && (
                        <div className="mb-4">
                            <span className="line-through text-gray-400 mr-2">
                                USD ${activeBundle.price}
                            </span>
                            <span className="text-red-600 font-bold text-xl">
                                USD ${activeBundle.final_price}
                            </span>
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Course Bundle:</label>
                        <div className="flex flex-wrap gap-2">
                            {bundles.map((bundle: SingleCourseBundle) => (
                                <button
                                    key={bundle.id}
                                    onClick={() => setActiveBundle(bundle)}
                                    className={`px-4 py-2 rounded-md text-sm transition border cursor-pointer ${activeBundle?.id === bundle.id
                                            ? "bg-green-600 text-white"
                                            : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                >
                                    {bundle.bundle_name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-6">
                        <button
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition cursor-pointer"
                            onClick={() => {
                                if (activeBundle) {
                                    handleEcommercePayment(activeBundle.final_price);
                                }
                            }}
                            disabled={isLoading || !activeBundle}
                        >
                            {isLoading ? "Processing..." : "Buy Now"}
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}
