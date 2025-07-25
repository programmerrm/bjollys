import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Field } from "../field/field";
import Download from "../../assets/images/download.png";
import { TicketFormProps } from "~/types/ticket/TicketFormProps";
import { useAddTicketMutation } from "~/redux/features/ticket/ticketApi";
import { useNavigate } from "@remix-run/react";

export const TicketForm = () => {
    const navigate = useNavigate();
    const [addTicket] = useAddTicketMutation();
    const {
        handleSubmit,
        register,
        reset,
        formState: { errors },
        watch,
    } = useForm<TicketFormProps>();

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const watchedFile = watch("file");

    useEffect(() => {
        if (watchedFile?.[0]) {
            const file = watchedFile[0];
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);

            return () => URL.revokeObjectURL(previewUrl);
        }
    }, [watchedFile]);

    const onSubmitForm = async (formData: TicketFormProps) => {
        try {
            const file = formData.file?.[0];

            const payload = new FormData();
            payload.append("issueType", formData.issueType);
            payload.append("description", formData.description);
            if (file) payload.append("file", file);

            await addTicket(payload).unwrap();
            alert("Ticket submitted successfully!");
            navigate('/support/');
            reset();
            setImagePreview(null);
        } catch (error: any) {
            console.error(error);
            alert(
                error?.data?.message ||
                "Failed to submit the ticket. Please try again."
            );
        }
    }


    return (
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
            <div className="flex flex-col gap-4 mb-4">
                <Field label="Issue Type" error={errors.issueType}>
                    <select
                        {...register("issueType", {
                            required: "Issue type is required"
                        })}
                        id="issueType"
                        className="border px-3 py-2 rounded"
                    >
                        <option value="">Select Issue Type*</option>
                        <option value="Account Issue">Account Issue</option>
                        <option value="Payment Issue">Payment Issue</option>
                        <option value="Technical Issue">Technical Issue</option>
                        <option value="Mexc Telegram Group">Mexc Telegram Group</option>
                        <option value="Boflin Telegram Group">Boflin Telegram Group</option>
                        <option value="Welcome Paid Email Issue">Welcome Paid Email Issue</option>
                        <option value="OTP Issues">OTP Issues</option>
                        <option value="Forgot Password Issues">Forgot Password Issues</option>
                        <option value="Other">Other</option>
                    </select>
                </Field>

                <Field label="Description" error={errors.description}>
                    <textarea
                        {...register("description", {
                            required: "Description is required"
                        })}
                        id="description"
                        placeholder="Add Description*"
                        className="border px-3 py-2 rounded"
                    ></textarea>
                </Field>
            </div>

            <div className="flex flex-col gap-2 mb-4">
                <div>Kindly upload a screenshot of the issue (Optional)</div>

                <label
                    className="h-[9.375rem] max-w-[15.625rem] border-2 border-dashed border-[#adadad] rounded-[0.313rem] flex items-center justify-center relative cursor-pointer"
                >
                    <input
                        {...register("file")}
                        type="file"
                        id="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setImagePreview(URL.createObjectURL(file));
                            } else {
                                setImagePreview(null);
                            }
                        }}
                    />
                    <div className="size-[1.875rem] flex items-center justify-center absolute inset-0 bg-white w-full h-full">
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="object-contain max-h-full max-w-full"
                            />
                        ) : (
                            <img
                                className="object-contain"
                                src={Download}
                                alt="Upload Icon"
                            />
                        )}
                    </div>
                </label>
            </div>

            <div className="flex">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    type="submit"
                >
                    Submit
                </button>
            </div>
        </form>
    );
}
