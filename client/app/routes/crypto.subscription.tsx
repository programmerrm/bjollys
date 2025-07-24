import { useNavigate } from "@remix-run/react";
import { useSelector } from "react-redux";
import { useGetSubscriptionDataQuery } from "~/redux/features/crypto/cryptoApi";
import { useCreateCryptoCheckoutSessionMutation, useGetSubscriptionQuery } from "~/redux/features/payments/paymentsApi";
import { RootState } from "~/redux/store";

export default function CryptoSubscription() {
  const auth = useSelector((state: RootState) => state.auth);
  const { data: cryptoSubscriptionContent } = useGetSubscriptionDataQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: subscriptionData } = useGetSubscriptionQuery(undefined, { refetchOnMountOrArgChange: true });
  const [createCheckoutSession, { isLoading }] = useCreateCryptoCheckoutSessionMutation();
  const navigate = useNavigate();
  const handlePayment = async () => {
  const price = cryptoSubscriptionContent?.data?.price;
  if (!price) {
    alert("Price not available.");
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
  const handleSubscription = () => {
    if (!auth?.user) {
      navigate("/login");
      return;
    }
    const lastSubscription = subscriptionData?.data?.[subscriptionData.data.length - 1];
    const isCryptoActive = lastSubscription?.subscription_type === "crypto" && lastSubscription?.status === "active";
    if (isCryptoActive) {
      return;
    }
    handlePayment();
  };
  const lastSubscription = subscriptionData?.data?.[subscriptionData.data.length - 1];
  const isCryptoActive = lastSubscription?.subscription_type === "crypto" && lastSubscription?.status === "active";
  return (
    <section className="py-[4.375rem]">
      <div className="container">
        <div className="max-w-[62.5rem] mx-auto p-1 rounded-[1.25rem] bg-gradient-to-r from-primary to-secondary">
          <div className="bg-white rounded-[1.125rem] py-5 px-[0.438rem] sm:p-10">
            <div className="space-y-2.5" dangerouslySetInnerHTML={{ __html: cryptoSubscriptionContent?.data?.body }}></div>
            <div className="flex flex-col gap-6">
              <span>{auth?.user?.email}</span>
              <button
                className="py-2 px-6 rounded-xl sm:text-xl cursor-pointer text-title outline-2 outline-transparent bg-gradient-to-r from-primary to-secondary transition-all duration-500 hover:bg-none hover:outline-primary"
                type="button"
                disabled={isLoading || isCryptoActive}
                onClick={handleSubscription}
              >
                {isLoading
                  ? "Processing..."
                  : isCryptoActive
                    ? "ALL READY SUBSCRIBED"
                    : "PAY NOW"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
