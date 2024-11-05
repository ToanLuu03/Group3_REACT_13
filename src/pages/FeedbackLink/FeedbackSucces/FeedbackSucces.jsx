import React from "react";
import backgroundFeedback from "../../../assets/image/bgfeedback.png";
import SuccessIcon from "../../../assets/image/succes.png";

const FeedbackSuccess = () => {
    return (
        <div className="min-h-screen p-6 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundFeedback})` }}>
            {/* Main Header */}
            <div className="w-full">
                <h1 className="text-4xl font-bold text-center text-[#000000] mb-8">
                    FEEDBACK FORM
                </h1>
                <div className="flex-1 border-t border-[#000000] w-[70%] mx-auto"></div>
            </div>
            <div className="bg-white max-w-[90%] md:max-w-[1190px] h-auto md:h-[700px] mx-auto rounded-lg shadow-lg p-8 space-y-4 mt-10">
                <div className="flex flex-col items-center justify-center space-y-4 pt-10">
                    {/* Success Icon */}
                    <div className="w-32 h-24 md:w-64 md:h-48 flex items-center justify-center">
                        <img src={SuccessIcon} alt="Success" className="w-full h-full" />
                    </div>

                    {/* Success Message */}
                    <p className="text-[#000000] text-center text-lg font-light">
                        Feedback has been sent
                    </p>

                    {/* Divider Lines */}
                    <div className="flex items-center w-full my-4 gap-4">
                        <div className="flex-1 border-t border-[#000000]"></div>
                        <span className="px-4 text-[#000000] font-semibold text-xl">You can do this</span>
                        <div className="flex-1 border-t border-[#000000]"></div>
                    </div>

                    {/* Button */}
                    <button className="text-[#4D48C7] border-[#4D48C7] border px-6 md:px-11 py-1 rounded-full font-semibold">
                        Save my answer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackSuccess;