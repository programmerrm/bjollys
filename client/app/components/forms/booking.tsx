import React from "react"
import { useForm } from "react-hook-form";
import { BookingPropsType } from "~/types/booking/booking";
import { Field } from "../field/field";
import { toast } from "react-toastify";
import { useAddBookingMutation } from "~/redux/features/e-commerce/e-commerce";

export const BookingForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<BookingPropsType>();
    // const [ addBooking ] = useAddBookingMutation();

    const onSubmitForm = async (formData: BookingPropsType) => {
    try {
    //   await addBooking(formData).unwrap();
      reset();
      toast.success('Booking successfully submitted!');
    } catch (err) {
      console.error('Error during booking:', err);
      toast.error('Failed to submit booking. Please try again.');
    }
  };

    return (
        <form className="bg-secondary p-2.5 flex flex-col gap-2.5" onSubmit={handleSubmit(onSubmitForm)}>
            <Field label="" error={errors.name}>
                <input {...register("name", {
                    required: 'Name is required'
                })} className="rounded-none border border-title p-2.5 text-title" type="text" placeholder="Name" />
            </Field>
            <Field label="" error={errors.number} >
                <input {...register("number", {
                    required: 'Whatsapp number is required'
                })} className="rounded-none border border-title p-2.5 text-title" type="text" placeholder="What'sApp number" />
            </Field>
            <Field label="" error={errors.country_name}>
                <input {...register("country_name", {
                    required: 'Country name is required'
                })} className="rounded-none border border-title p-2.5 text-title" type="text" placeholder="Country Name" />
            </Field>
            <Field label="" error={errors.message}>
                <input {...register("message", {
                    required: 'Message is required'
                })} className="rounded-none border border-title p-2.5 text-title" type="text" placeholder="Message" />
            </Field>
            <button className="p-2.5 rounded-none text-xl font-medium text-white" type="submit">
                Send
            </button>
        </form>
    );
}
