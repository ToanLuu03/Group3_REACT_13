import React, { useState } from "react";
import { StarFilled, DownOutlined, UpOutlined } from "@ant-design/icons";
import { Progress } from "antd";

const FeedbackDetail = ({ feedback, onBack }) => {
  const [isModuleOpen, setIsModuleOpen] = useState(false);
  const [isTrainerOpen, setIsTrainerOpen] = useState(false);

  const toggleModuleFeedback = () => setIsModuleOpen(!isModuleOpen);
  const toggleTrainerFeedback = () => setIsTrainerOpen(!isTrainerOpen);

  return (
    <div className="p-4">
      {/* Overall Rating */}
      <div className="mb-6">
        <h2 className="text-3xl font-semibold">Average</h2>
        <div className="flex items-center">
          <span className="text-4xl font-bold mr-2">5</span>
          <StarFilled style={{ color: "#fadb14", fontSize: "32px" }} />
        </div>
        <div className="mt-4">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center mb-2">
              <span className="mr-2">{`${star} ★`}</span>
              <Progress
                percent={star === 5 ? 100 : 0} // Only show 100% for 5 stars
                showInfo={false}
                strokeColor="#fadb14"
                style={{ width: "200px", marginRight: "8px" }}
              />
              <span>{star === 5 ? 10 : 0}</span> {/* Sample data */}
            </div>
          ))}
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-6">
        <span className="font-bold mr-4">Filter:</span>
        {["All", 5, 4, 3, 2, 1].map((filter, index) => (
          <button
            key={index}
            className={`py-1 px-3 mr-2 border rounded ${
              filter === "All" ? "border-gray-500" : "border-yellow-400"
            }`}
          >
            {filter} ★
          </button>
        ))}
      </div>

      {/* Student Feedback Content */}
      <div className="mb-6">
        {/* Module's Feedback */}
        <div
          className="p-4 border border-gray-300 rounded mb-4 flex justify-between items-center cursor-pointer"
          onClick={toggleModuleFeedback}
        >
          <div className="flex items-start">
            <span className="text-lg font-bold mr-2">5</span>
            <StarFilled style={{ color: "#fadb14", fontSize: "18px", marginRight: "8px", marginTop: "3px" }} />
            <div>
              <span>Module's feedback: {feedback.moduleFeedback}</span>
              <p>Trainer's feedback: {feedback.trainerFeedback}</p>
            </div>
          </div>
          {isModuleOpen ? <UpOutlined /> : <DownOutlined />}
        </div>
        {isModuleOpen && (
          <div className="p-4 border border-gray-300 rounded mb-4">
            {feedback.content.map((item, index) => (
              <div key={index} className="flex justify-between items-center mb-2">
                <span>{item.question}</span>
                <Progress percent={item.rating} showInfo={false} strokeColor="#1890ff" style={{ width: "200px" }} />
              </div>
            ))}
          </div>
        )}

        {/* Trainer's Feedback */}
        <div
          className="p-4 border border-gray-300 rounded flex justify-between items-center cursor-pointer"
          onClick={toggleTrainerFeedback}
        >
          <div className="flex items-start">
            <span className="text-lg font-bold mr-2">5</span>
            <StarFilled style={{ color: "#fadb14", fontSize: "18px", marginRight: "8px", marginTop: "3px" }} />
            <div>
              <span>Module's feedback: {feedback.moduleFeedback}</span>
              <p>Trainer's feedback: {feedback.trainerFeedback}</p>
            </div>
          </div>
          {isTrainerOpen ? <UpOutlined /> : <DownOutlined />}
        </div>
        {isTrainerOpen && (
          <div className="p-4 border border-gray-300 rounded mb-4">
            {feedback.trainerFeedbackItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center mb-2">
                <span>{item.question}</span>
                <Progress percent={item.rating} showInfo={false} strokeColor="#1890ff" style={{ width: "200px" }} />
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={onBack} className="text-blue-500 mb-4">
        ← Back to Feedback List
      </button>
    </div>
  );
};

export default FeedbackDetail;
