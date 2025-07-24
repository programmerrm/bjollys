import { TicketForm } from "~/components/forms/ticket";

export default function Ticket() {
  return (
    <section className="py-[70px]">
      <div className="container">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-[20px] p-1 max-w-[62.5rem] mx-auto">
          <div className="bg-white rounded-[18px] py-5 px-[7px] md:p-10 flex flex-col gap-[4.063rem]">
            <h2 className="text-center text-[28px] leading-[1.2] font-semibold text-title lg:text-[35px]">
              Create Ticket
            </h2>
            <TicketForm />
          </div>
        </div>
      </div>
    </section>
  );
}
