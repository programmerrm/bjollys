import { MainDashboard } from "~/components/dashboard/main_dashboard";
import { useGetSubscriptionQuery } from "~/redux/features/payments/paymentsApi";

export default function Dashboard() {
    const { data: subscriptionData } = useGetSubscriptionQuery(undefined, { refetchOnMountOrArgChange: true });
    return (
        <>
            {subscriptionData?.data?.[0].status === 'active' ? (
                <>
                    <MainDashboard />
                </>
            ) : (
                <section className="py-[4.375rem]">
                    <div className="container">
                        <div className="bg-gradient-to-r from-primary to-secondary rounded-[22px] p-1 max-w-[62.5rem] w-full mx-auto">
                            <div className="bg-white rounded-[20px] p-5 md:p-10 md:py-[3.25rem] flex flex-col relative">
                                <p className="text-xl md:text-3xl font-bold uppercase text-center py-5">This feature is only available for paid users.</p>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
