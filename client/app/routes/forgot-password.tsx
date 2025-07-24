import { useForm } from "react-hook-form";
import { Field } from "~/components/field/field";
import { useAddForgotPasswordMutation } from "~/redux/features/auth/authApi";

interface ForgotPasswordProps {
    email: string;
}

export default function ForgotPassword() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ForgotPasswordProps>();
    const [addForgotPassword] = useAddForgotPasswordMutation();


    const onSubmitForm = async (formData: ForgotPasswordProps) => {
        try {
            const response = await addForgotPassword(formData);
            reset();
            if (response.data) {
                alert("Password reset request successful. Please check your email.");
            } else {
                alert("Failed to send reset link. Please try again.");
            }
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <section className="relative top-0 left-0 right-0 w-full">
            <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full flex items-center justify-center h-screen">
                <div className="flex flex-col flex-wrap w-full lg:w-[40%] py-1.5 px-1.5 rounded-[20px] bg-gradient-to-r from-[#384ef4] to-[#b060ed]">
                    <div className="flex flex-col flex-wrap w-full p-4 bg-white rounded-[18px]">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-blue-600">BJollys</h2>
                            <p className="text-gray-500 text-sm mt-1">Forgot your password? No worries.</p>
                        </div>
                        <form onSubmit={handleSubmit(onSubmitForm)}>
                            <div className="mb-5">
                                <Field label="Email address" error={errors.email}>
                                    <input
                                        {...register("email", {
                                            required: "Email is required"
                                        })}
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        className="w-full text-black/80 placeholder:text-black/80 text-sm font-normal placeholder:text-sm py-4 px-4 bg-gray-300 rounded-md outline-none border-none"
                                    />
                                </Field>
                            </div>
                            <button
                                type="submit"
                                className="w-full text-base font-medium py-4 px-5 rounded-md uppercase transition-all duration-500 bg-gradient-to-r from-[#384ef4] to-[#b060ed] text-white border hover:border-black hover:bg-none hover:text-black"
                            >
                                Send Reset Link
                            </button>
                        </form>
                        <div className="text-center text-sm text-gray-600 mt-4">
                            <p>Already have an account? <a href="/login" className="text-blue-600 hover:underline">Back to login</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
