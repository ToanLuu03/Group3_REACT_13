import React, { useEffect, useState } from "react";
import LogoFptwordunder from "../../../assets/image/LogoFpTwordunder.png";
import fptSoftwareAcademyLogo from "../../../assets/image/FSALogo.png";
import backgroundFeedback from "../../../assets/image/bgfeedback.png";
import { LuAlarmClock } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const FeedbackLink = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(150); // 2 phút 30 giây (tính bằng giây)
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const navigate = useNavigate();
  const correctOtp = "123456";
  // Countdown cho OTP
  useEffect(() => {
    if (timer > 0 && isOtpSent) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer, isOtpSent]);

  // Định dạng thời gian cho bộ đếm
  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Xử lý gửi email
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Giả lập API call
    setIsOtpSent(true);
    setTimer(150); // Reset bộ đếm
  };

  // Xử lý nhập OTP
  const handleOtpChange = (value, index) => {
    if (!isNaN(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
  
      // Automatically focus on the next input field when a digit is entered
      if (value && index < otp.length - 1) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
  
      // Automatically focus on the previous input field when a digit is deleted
      if (!value && index > 0) {
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
        }
      }
    }
  };

  // Xử lý resend OTP
  const handleResendOtp = () => {
    setTimer(150); // Reset bộ đếm
    setOtp(Array(6).fill("")); // Xóa các ô OTP
  };

  // Xử lý submit OTP
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    // Kiểm tra nếu mã OTP nhập vào là "123456"
    if (otp.join("") === correctOtp) {
      navigate("/FEEDBACK_LINK/feedback-form"); // Điều hướng tới feedback-form nếu OTP đúng
    } else {
      message.error("Mã OTP không đúng, vui lòng thử lại.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundFeedback})` }}
    >
      <div className="bg-white p-10 w-[1000px] h-[600px] rounded-lg text-center shadow-lg">
        <div className="flex items-center justify-center pb-10">
          <img
            src={LogoFptwordunder}
            alt="FPT Software Logo"
            className=" w-[200px]"
          />
          <div className="w-[2px] h-[138px] bg-[#000000]"></div>
          <img
            src={fptSoftwareAcademyLogo}
            alt="FPT Software Academy Logo"
            className="w-[225px]"
          />
        </div>
        <div>
          <div className="w-full flex justify-center items-center">
            <h2 className="text-2xl font-medium mb-4 border-b-[2px] border-[#000000] w-[70%] ">
              Enter email to confirm information
            </h2>
          </div>
          <form
            onSubmit={isOtpSent ? handleOtpSubmit : handleEmailSubmit}
            className="flex flex-col items-center"
          >
            <span className="justify-start pr-[37%] text-sm text-[#454545] mb-1">
              Mail
            </span>
            <input
              type="email"
              placeholder="Enter your email"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-[372px] px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            {/* Hiển thị phần nhập OTP khi OTP được gửi */}
            {isOtpSent && (
              <>
                <div className="flex gap-2">
                  <div className="flex justify-between gap-2 mb-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-input-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        className="w-8 h-8 text-center border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 text-lg"
                      />
                    ))}
                  </div>
                  {/* Countdown Timer và Resend */}
                  <div className="flex items-center justify-between mb-4 text-sm border rounded-lg">
                    <span className="text-[#000000] mr-2">
                      {timer > 0 && (
                        <div className="flex px-2 justify-center items-center gap-1">
                          <LuAlarmClock className="text-2xl" />
                          <div className="text-xl">{formatTime()}</div>
                        </div>
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center mb-7">
                  <p>Don't received OTP code? </p>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="ml-2 text-[#FF9000] font-semibold"
                  >
                    Resend
                  </button>
                </div>
              </>
            )}
            {/* Nút SEND chuyển thành SUBMIT */}
            <button
              type="submit"
              className="w-[242px]  rounded-full bg-[#5750DF] text-white font-bold hover:bg-blue-700 transition duration-300"
            >
              {isOtpSent ? "SUBMIT" : "SEND"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

};

export default FeedbackLink;
