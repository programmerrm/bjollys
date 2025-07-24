import { useGetTermsAndConditionsApiQuery } from "~/redux/features/terms-and-conditions/termsAndConditionsApi";

export default function TermsAndConditions() {
  const { data } = useGetTermsAndConditionsApiQuery(undefined, {
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
