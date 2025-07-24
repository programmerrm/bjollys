import { useNavigate, useParams } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { Field } from "~/components/field/field";
import { useAddConfirmPasswordMutation } from "~/redux/features/auth/authApi";

interface ConfirmPasswordProps {
    new_password: string;
    confirm_password: string;
}

export default function ConfirmPassword() {
    const navigate = useNavigate();
    const { uidb64, token } = useParams();
    const [addConfirmPassword] = useAddConfirmPasswordMutation();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ConfirmPasswordProps>();

    const onSubmitForm = async (formData: ConfirmPasswordProps) => {
        try {
            if (formData.new_password !== formData.confirm_password) {
                alert("Passwords do not match.");
                return;
            }

            const response = await addConfirmPassword({
                data: { new_password: formData.new_password },
                uidb64,
                token,
            });

            if (response.data) {
                alert("Password reset successful.");
                reset();
                navigate("/success-change-password/");
            } else {
                alert("Failed to reset password. Please try again.");
            }
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <section className="relative top-0 left-0 right-0 w-full">
            <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full flex items-center justify-center h-screen">
                <div className="flex flex-col flex-wrap w-full lg:w-[40%] py-1.5 px-1.5 rounded-[20px] bg-gradient-to-r from-[#384ef4] to-[#b060ed]">
                    <div className="flex flex-col flex-wrap w-full p-5 bg-white rounded-[18px]">
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold text-blue-600">BJollys</h1>
                            <p className="text-gray-500 text-sm mt-1">Set your new password below</p>
                        </div>
                        <form onSubmit={handleSubmit(onSubmitForm)}>
                            <Field label="New Password" error={errors.new_password}>
                                <div className="mb-5">
                                    <input
                                        type="password"
                                        id="new-password"
                                        placeholder="Enter new password"
                                        className="w-full text-black/80 placeholder:text-black/80 text-sm font-normal placeholder:text-sm py-4 px-4 bg-gray-300 rounded-md outline-none border-none"
                                        {...register("new_password", { required: "New password is required" })}
                                    />
                                </div>
                            </Field>

                            <Field label="Confirm Password" error={errors.confirm_password}>
                                <div className="mb-5">
                                    <input
                                        type="password"
                                        id="confirm-password"
                                        placeholder="Re-enter new password"
                                        className="w-full text-black/80 placeholder:text-black/80 text-sm font-normal placeholder:text-sm py-4 px-4 bg-gray-300 rounded-md outline-none border-none"
                                        {...register("confirm_password", { required: "Confirm password is required" })}
                                    />
                                </div>
                            </Field>

                            <button
                                type="submit"
                                className="w-full text-base font-medium py-4 px-5 rounded-md uppercase transition-all duration-500 bg-gradient-to-r from-[#384ef4] to-[#b060ed] text-white border hover:border-black hover:bg-none hover:text-black"
                            >
                                Reset Password
                            </button>
                        </form>
                        <div className="text-center text-sm text-gray-600 mt-4">
                            <p>Remembered your password? <a href="/login" className="text-blue-600 hover:underline">Back to login</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
