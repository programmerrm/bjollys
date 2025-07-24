export default function Dashboard() {
    return (
        <section className="min-h-screen pb-5 px-4 flex flex-col bg-white">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-5 grow">
                <div className="rounded-2xl overflow-hidden flex-1/2 grow flex flex-col">
                    <img className="transition-all duration-300 ease-linear hover:scale-[1.1] h-full grow" src={""} alt="" />
                </div>
                <div className="flex-1/2 lg:self-center">
                    <h2 className="text-2xl text-left font-semibold mb-2">Amazon Course Bundle</h2>
                    <div className="mb-4">
                        <span className="line-through text-gray-400 mr-2">AED 1,100.00</span>
                        <span className="text-red-600 font-bold text-xl">AED 850.00</span>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Course Bundle:</label>
                        <div className="flex flex-wrap gap-2">
                            {["Online Course", "Offline Course", "1 by 1 Course", "Full Course with Products", "Business package with Noon & Amazon"].map((label, idx) => (
                                <button key={idx} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition">
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mt-6">
                        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition">Buy Now</button>
                    </div>
                </div>
            </div>
        </section>
    )
}