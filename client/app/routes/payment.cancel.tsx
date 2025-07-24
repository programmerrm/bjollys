import { Link } from "@remix-run/react";

export default function PaymentCancel() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-red-50 px-4 sm:px-6 py-10 sm:py-12">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-md sm:max-w-lg text-center border-t-[6px] border-red-500">
        <div className="flex justify-center mb-6 pt-6">
          <div className="p-4 rounded-full shadow-inner bg-red-100">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <div className="px-6 sm:px-10 pb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 text-red-600">Payment Cancelled</h2>
          <p className="text-gray-600 text-sm sm:text-base mb-6">Your payment could not be processed or was cancelled. Please try again or contact support if the issue persists.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/" className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition duration-300">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
