import React, { useState, useEffect } from "react";
import { StarFilled, DownOutlined, UpOutlined } from "@ant-design/icons";
import { Progress, Select, Checkbox, Modal } from "antd";

const classOptions = ["FSA.HCM", "FSA.HN", "FSA.DN", "FSA.CT"]; // Danh sách lớp học

const FeedbackDetail = ({ feedback, onBack }) => {
  const [isExpanded, setIsExpanded] = useState(false); // Trạng thái cho việc mở rộng các phần
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [isRateBoxVisible, setIsRateBoxVisible] = useState(true); // State to manage visibility of rate statistics

  const toggleExpandFeedback = () => setIsExpanded(!isExpanded);

  const handleClassChange = (value) => {
    setSelectedClasses(value);
  };

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      setSelectedClasses(classOptions);
    } else {
      setSelectedClasses([]);
    }
  };

  const showModal = () => {
    setIsModalVisible(true); // Show the modal when clicking Details
  };

  const handleModalClose = () => {
    setIsModalVisible(false); // Close the modal when Done is clicked
  };

  // Scroll event handler to hide rate box when scrolling down
  const handleScroll = () => {
    if (window.scrollY > 100) { // Adjust the value based on when you want to hide the box
      setIsRateBoxVisible(false); // Hide the rate box
    } else {
      setIsRateBoxVisible(true); // Show the rate box when at the top
    }
  };

  // Attach scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Check if feedback.content is an array before using .map()
  const renderFeedbackContent = (content) => {
    if (Array.isArray(content)) {
      return content.map((item, index) => (
        <div key={index} className="flex justify-between items-center mb-2">
          <span>{item.question}</span>
          <div className="flex items-center">
            <Progress percent={item.rating} showInfo={false} strokeColor="#1890ff" style={{ width: "150px" }} />
            <button onClick={showModal} className="ml-4 text-blue-500">Details</button>
          </div>
        </div>
      ));
    } else {
      return <p>No content available.</p>; // Fallback if content is not an array
    }
  };

  return (
    <div className="p-6">
      {/* Class Name Dropdown */}
      <div className="mb-6 flex justify-end items-center">
        <label className="font-bold mr-4">Class Name:</label>
        <Select
          mode="multiple"
          placeholder="Select Class"
          value={selectedClasses}
          onChange={handleClassChange}
          style={{ width: 250 }}
          dropdownRender={() => (
            <div style={{ padding: "8px 8px 0" }}>
              <Checkbox
                onChange={handleSelectAllChange}
                checked={selectedClasses.length === classOptions.length}
                indeterminate={selectedClasses.length > 0 && selectedClasses.length < classOptions.length}
                style={{ marginBottom: "8px", fontWeight: "bold" }}
              >
                Select All
              </Checkbox>
              <div>
                {classOptions.map((className) => (
                  <div key={className} style={{ padding: "4px 0" }}>
                    <Checkbox
                      checked={selectedClasses.includes(className)}
                      onChange={(e) => {
                        const newSelectedClasses = e.target.checked
                          ? [...selectedClasses, className]
                          : selectedClasses.filter((c) => c !== className);
                        setSelectedClasses(newSelectedClasses);
                      }}
                    >
                      {className}
                    </Checkbox>
                  </div>
                ))}
              </div>
            </div>
          )}
          options={classOptions.map((className) => ({
            label: className,
            value: className,
          }))}
          notFoundContent={null} // Xóa thông báo "No data"
        />
      </div>

      {/* Rate Statistics Box */}
      {isRateBoxVisible && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Average Rating</h2>
          <div className="flex items-center mb-4">
            <span className="text-3xl font-bold mr-2">5</span>
            <StarFilled style={{ color: "#fadb14", fontSize: "28px" }} />
          </div>
          <div>
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center mb-2">
                <span className="mr-2">{`${star} ★`}</span>
                <Progress
                  percent={star === 5 ? 100 : 0} // Only show 100% for 5 stars as sample data
                  showInfo={false}
                  strokeColor="#fadb14"
                  style={{ width: "200px", marginRight: "8px" }}
                />
                <span>{star === 5 ? 10 : 0}</span> {/* Sample data */}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div className="mb-6">
        <span className="font-bold mr-4">Filter:</span>
        {["All", 5, 4, 3, 2, 1].map((filter, index) => (
          <button
            key={index}
            className={`py-1 px-3 mr-2 border rounded ${filter === "All" ? "border-gray-500" : "border-yellow-400"
              }`}
          >
            {filter} ★
          </button>
        ))}
      </div>

      {/* Feedback Sections */}
      <div className="mb-6">
        {/* Module's Feedback */}
        <div
          className="p-4 border border-gray-300 rounded mb-4 flex justify-between items-center cursor-pointer"
          onClick={toggleExpandFeedback}
        >
          <div className="flex items-start">
            <span className="text-lg font-bold mr-2">5</span>
            <StarFilled style={{ color: "#fadb14", fontSize: "18px", marginRight: "8px", marginTop: "3px" }} />
            <div>
              <span>Module's feedback: I have no problem in this part.</span>
              <p>Trainer's feedback: I have learned many skills in Front End development, but some exercises are too difficult for beginners.</p>
            </div>
          </div>
          {isExpanded ? <UpOutlined /> : <DownOutlined />}
        </div>
        {isExpanded && (
          <>
            {/* Training Program & Content */}
            <div className="p-4 border border-gray-300 rounded mb-4">
              <h3 className="font-bold text-lg mb-2 text-center ">Training Program & Content</h3>
              {renderFeedbackContent(feedback.content)}
            </div>

            {/* Trainer / Coach */}
            <div className="p-4 border border-gray-300 rounded mb-4">
              <h3 className="font-bold text-lg mb-2 text-center">Trainer / Coach</h3>
              {renderFeedbackContent(feedback.trainerFeedbackItems)}
            </div>

            {/* Course Organization */}
            <div className="p-4 border border-gray-300 rounded mb-4">
              <h3 className="font-bold text-lg mb-2 text-center">Course Organization</h3>
              {renderFeedbackContent(feedback.courseOrganization)}
            </div>
          </>
        )}
      </div>

      <button
        onClick={onBack}
        className="fixed bottom-3  text-blue-600 hover:text-blue-800 font-semibold py-1 px-3 rounded-lg border border-blue-500 hover:border-blue-700 transition-all duration-300 ease-in-out"
      >
        ← Back to Feedback List
      </button>

      {/* Modal to show Problem details */}
      <Modal
        title="Problem Details"
        visible={isModalVisible}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        footer={[
          <button key="done" onClick={handleModalClose} className="bg-blue-500 text-white py-2 px-4 rounded">Done</button>
        ]}
      >
        <p>There are some problems in case getting 3 star feedback.</p>
      </Modal>
    </div>
  );
};

export default FeedbackDetail;
