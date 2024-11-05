import React, { useState } from "react";
import backgroundFeedback from "../../../assets/image/bgfeedback.png";
import DeleteModal from "../ModalFeedback/DeleteModal";
import { useNavigate } from "react-router-dom";
import { Input, Radio, Space } from "antd";

const FeedbackForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        classCode: "",
        mentor: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle opening the modal
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    // Handle closing the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Handle delete confirmation
    const handleDelete = () => {
        setFormData({ name: "", classCode: "", mentor: "" }); // Clear form data
        setIsModalOpen(false); // Close modal
        console.log("All answers deleted.");
    };

    // Submit form (for now just log data)
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted data:", formData);
        navigate("/FEEDBACK_LINK/feedback-success");
    };

    return (
        <div
            className="max-w-full mx-auto bg-cover bg-center min-h-screen"
            style={{ backgroundImage: `url(${backgroundFeedback})` }}
        >
            {/* Header */}
            <div className="w-full pt-3">
                <h1 className="text-3xl font-bold text-center">FEEDBACK FORM</h1>
                <div className="flex-1 border border-[#0d0606] w-[60%] mx-auto my-2"></div>
            </div>
            <div className="bg-[#ffffff81] max-w-[1100px] mx-auto rounded-lg shadow-lg p-8 space-y-4 mt-10">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-[#F88605] rounded-t-lg h-3 w-full"></div>
                    <div className="p-5 rounded-b-lg mb-4 text-gray-900 shadow-sm bg-white">
                        <h2 className="text-lg font-semibold">
                            Page này để tư vấn và lắng nghe
                        </h2>
                        <p className="text-xs mt-1 text-[#00000096]">16 June 2024</p>
                        <p className="mb-2">
                            First of all, thank you for choosing FPT Software Academy to study
                            and enhance your knowledge and skills. In order to support you
                            timely during the course, we would like to receive your feedback!
                        </p>
                        <p>
                            The survey has 5 short parts, let's fill in now! Khảo sát có 5
                            phần ngắn gọn, mình cùng làm qua từng phần nhé! Khảo theo mức độ
                            hài lòng nhất là 5 và thấp nhất là 1.
                        </p>
                    </div>

                    {/* Session 1 */}
                    <div className="bg-white rounded-lg mb-3">
                        <div className="bg-[#D8D8D8] px-4 py-2 font-bold rounded-t-lg">
                            Session 1
                        </div>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold">Trainee Information</h2>
                            <p className="mb-4 text-sm">
                                In order to support you timely during the course, we would like
                                to receive your feedback!
                            </p>

                            {/* Questions */}
                            <form onSubmit={handleSubmit}>
                                {/* Question 1: Your Name */}
                                <label className="block mb-4">
                                    <span className="font-medium">1. Your Name</span>
                                    <Input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your name"
                                        className="mt-1 block w-full"
                                    />
                                </label>

                                {/* Question 2: Class Code for Internship */}
                                <div className="mb-4">
                                    <span className="font-medium block mb-2">
                                        2. Class Code for Internship
                                    </span>
                                    <Radio.Group
                                        name="classCode"
                                        value={formData.classCode}
                                        onChange={handleInputChange}
                                    >
                                        <Space direction="vertical">
                                            <Radio value="BA_01">BA_01</Radio>
                                            <Radio value="NET_14">NET_14</Radio>
                                            <Radio value="REACT_13">REACT_13</Radio>
                                        </Space>
                                    </Radio.Group>
                                </div>
                                {/* Question 3: Mentors of your class */}
                                <label className="block mb-6">
                                    <span className="font-medium">3. Mentors of your class</span>
                                    <Input
                                        type="text"
                                        name="mentor"
                                        value={formData.mentor}
                                        onChange={handleInputChange}
                                        placeholder="Select your answer"
                                        className="mt-1 block w-full"
                                    />
                                </label>
                            </form>
                        </div>
                    </div>
                    {/* Session 2 */}
                    <div>
                        <div className="bg-white rounded-lg mb-8">
                            <div className="bg-gray-300 px-4 py-2 font-bold rounded-t-lg">
                                Session 2
                            </div>
                            <div className="p-6">
                                <h2 className="text-xl font-semibold">Training Program</h2>
                                <p className="mb-4 text-sm">
                                    In order to support you timely during the course, we would
                                    like to receive your feedback!
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Action Buttons */}
                    <div>
                        <div className="flex flex-col sm:flex-row justify-between">
                            <button
                                type="button"
                                className="text-[#FF0F0F] py-2 px-4 transition-colors"
                                onClick={handleOpenModal}
                            >
                                DELETE ALL ANSWERS
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:w-[242px] rounded-lg bg-[#5750DF] text-white font-bold hover:bg-blue-700 transition duration-300 mt-4 sm:mt-0"
                                onClick={handleSubmit}
                            >
                                SEND
                            </button>
                        </div>
                    </div>
                    <DeleteModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
            {/* Introduction */}
        </div>
    );
};

export default FeedbackForm;
 