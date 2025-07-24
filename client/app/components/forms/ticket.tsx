export const TicketForm = () => {
    return (
        <form>
            <div className="flex flex-col gap-4 mb-4">
                <select name="issueType">
                    <option value="">Select Issue Type*</option>
                    <option value="Account Issue">Account Issue</option>
                    <option value="Payment Issue">Payment Issue</option>
                    <option value="Technical Issue">
                        Technical Issue
                    </option>
                    <option value="Mexc Telegram Group">
                        Mexc Telegram Group
                    </option>
                    <option value="Boflin Telegram Group">
                        Boflin Telegram Group
                    </option>
                    <option value="Welcome Paid Email Issue">
                        Welcome Paid Email Issue
                    </option>
                    <option value="OTP Issues">OTP Issues</option>
                    <option value="Forgot Password Issues">
                        Forgot Password Issues
                    </option>
                    <option value="Other">Other</option>
                </select>
                <textarea
                    name="description"
                    id=""
                    placeholder="Add Description*"
                ></textarea>
            </div>
            <div className="flex flex-col gap-1 mb-4">
                <label>Kindly upload a screenshot of the issue
                    (Optional)</label>
                <label
                    className="h-[9.375rem] max-w-[15.625rem] border-2 border-dashed border-[#adadad] rounded-[0.313rem] flex items-center justify-center relative"
                >
                    <input
                        className="w-full"
                        type="file"
                        name=""
                        id="file"
                    />
                    <div
                        className="size-[1.875rem] flex items-center justify-center absolute inset-0 w-full h-full bg-white"
                    >
                        <img
                            className="size-[1.875rem]"
                            src="./src/img/download.png"
                            alt=""
                        />
                    </div>
                </label>
            </div>
            <div className="flex">
                <button className="w-auto" type="submit">Submit</button>
            </div>
        </form>
    );
}
