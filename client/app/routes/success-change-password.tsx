import { Link } from "@remix-run/react";

export default function SuccessPasswordChange() {
    return (
        <section className="relative top-0 left-0 right-0 w-full">
            <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5 w-full flex items-center justify-center h-screen">
                <div className="flex flex-col flex-wrap w-full lg:w-[40%] py-1.5 px-1.5 rounded-[20px] bg-gradient-to-r from-[#384ef4] to-[#b060ed]">
                    <div className="flex flex-col flex-wrap w-full p-4 bg-white rounded-[18px] items-center text-center">
                        <div className="mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2l4 -4m6 2a10 10 0 1 1 -20 0a10 10 0 0 1 20 0z" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold text-green-600 mb-2">Password Changed Successfully!</h2>
                        <p className="text-gray-600 text-sm mb-6">You can now log in with your new password.</p>

                        <Link
                            to="/login"
                            className="inline-block text-base font-medium py-4 px-6 rounded-md uppercase transition-all duration-500 bg-gradient-to-r from-[#384ef4] to-[#b060ed] text-white border hover:border-black hover:bg-none hover:text-black"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}