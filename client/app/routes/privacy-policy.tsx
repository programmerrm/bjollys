import { useGetprivacyPolicyQuery } from "~/redux/features/privacy-policy/privacyPolicyApi";

export default function PrivacyPolicy() {
  const { data } = useGetprivacyPolicyQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  return (
    <section className="pt-[3.75rem] pb-10">
      <div className="container">
        <div
          className="text-editor"
          dangerouslySetInnerHTML={{ __html: data?.data?.body }}
        ></div>
      </div>
    </section>
  );
}
