/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from "react";
import { ClockCircleOutlined, EllipsisOutlined } from "@ant-design/icons";
import { Pagination, Select, Radio, Input } from "antd";
import FeedbackDetail from "../../../../components/Admin/FeedbackDetail/FeedbackDetail";

const FeedBack = () => {
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const itemsPerPage = 4;

  // Sample feedback data with dates
  const feedbackData = [
    { id: 1, date: "2024-10-15", content: "Feedback 1" },
    { id: 2, date: "2024-10-14", content: "Feedback 2" },
    { id: 3, date: "2024-10-13", content: "Feedback 3" },
    { id: 4, date: "2024-10-12", content: "Feedback 4" },
    { id: 5, date: "2024-10-11", content: "Feedback 5" },
    { id: 6, date: "2024-10-10", content: "Feedback 6" },
    { id: 7, date: "2024-10-09", content: "Feedback 7" },
    { id: 8, date: "2024-10-08", content: "Feedback 8" },
    { id: 9, date: "2024-10-07", content: "Feedback 9" },
    { id: 10, date: "2024-10-06", content: "Feedback 10" },
    { id: 11, date: "2024-10-05", content: "Feedback 11" },
    { id: 12, date: "2024-10-04", content: "Feedback 12" },
    { id: 13, date: "2024-10-03", content: "Feedback 13" },
    { id: 14, date: "2024-10-02", content: "Feedback 14" },
    { id: 15, date: "2024-10-01", content: "Feedback 15" },
    { id: 16, date: "2024-09-30", content: "Feedback 16" },
    { id: 17, date: "2024-09-29", content: "Feedback 17" },
  ];

  // Define sampleFeedback object for demonstration
  const sampleFeedback = {
    moduleFeedback: "I have no problem in this part.",
    trainerFeedback:
      "I have learned many skills in Front End development, but some exercises are too difficult for beginners.",
    content: [
      {
        question: "I am satisfied with the module/course's content.",
        rating: 80,
      },
      { question: "The training objectives are clearly defined.", rating: 70 },
      {
        question: "The level of the course is appropriate for the trainees.",
        rating: 90,
      },
      { question: "The course is useful for your work.", rating: 85 },
      {
        question: "The materials distributed are appropriate and helpful.",
        rating: 75,
      },
    ],
    trainerFeedbackItems: [
      { question: "The trainer has a wide-range of knowledge.", rating: 85 },
      { question: "Training content follows curriculum.", rating: 80 },
      {
        question: "The trainer’s instructions are clear and understandable.",
        rating: 90,
      },
      { question: "Trainer supports enthusiastically.", rating: 95 },
    ],
    courseOrganization: [
      {
        question: "Materials distributed are appropriate and helpful.",
        rating: 75,
      },
      { question: "Course structure is clear.", rating: 80 },
    ],
  };

  const handleSortChange = (option) => {
    if (sortOption === option) {
      setSortOption(null); // Deselect if clicking the same option again
    } else {
      setSortOption(option);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCardClick = (feedback) => {
    setSelectedFeedback(feedback);
  };

  const handleBack = () => {
    setSelectedFeedback(null);
  };

  // Sort feedbackData based on the selected sort option
  const sortedData = [...feedbackData].sort((a, b) => {
    if (sortOption === "Latest") {
      return new Date(b.date) - new Date(a.date); // Sort by date descending
    } else if (sortOption === "Oldest") {
      return new Date(a.date) - new Date(b.date); // Sort by date ascending
    }
    return 0; // No sorting
  });

  // Filter feedbackData based on search query
  const filteredData = sortedData.filter(item =>
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="p-0 ml-2 mr-4">
      {!selectedFeedback ? (
        <>
          <div className="flex justify-end gap-5 mb-4 flex-wrap ">
            <div className="flex flex-col">
              <label className="font-medium text-gray-800">Sort</label>
              <Select
                value={sortOption}
                onChange={handleSortChange}
                style={{ width: 160 }}
                allowClear
                dropdownRender={() => (
                  <Radio.Group
                    value={sortOption}
                    onChange={(e) => handleSortChange(e.target.value)}
                    style={{ display: "flex", flexDirection: "column", padding: 20, gap: 15 }}
                  >
                    <Radio value="Latest">Latest</Radio>
                    <Radio value="Oldest">Oldest</Radio>
                  </Radio.Group>
                )}
              >
                <Select.Option value="Latest">Latest</Select.Option>
                <Select.Option value="Oldest">Oldest</Select.Option>
              </Select>
            </div>

            <div className="flex flex-col">
              <label className="font-medium text-gray-800">Search</label>
              <Input
                placeholder="Enter keywords"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-md bg-gray-100 w-48"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-4">
            {currentData.map((item) => (
              <div
                key={item.id}
                className="border-2 border-gray-400 rounded-lg overflow-hidden shadow-sm cursor-pointer hover:translate-y-[-4px] hover:shadow-xl transition-all duration-200"
                onClick={() => handleCardClick(sampleFeedback)} // Use sampleFeedback here
              >
                <div className="p-2 bg-gray-50 flex items-center justify-center">
                  <img
                    src="https://hoatuoi360.vn/uploads/file/Baiviet2024/hoa-tulip-trang.jpg"
                    alt={`Image ${item.id}`}
                    className="object-cover w-full h-48 rounded-md shadow-md"
                  />
                </div>

                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-1">
                      {item.content}
                    </h3>
                    <p className="text-sm text-gray-800 flex items-center">
                      <ClockCircleOutlined className="mr-1" /> Last Update:
                      {item.date}
                    </p>
                  </div>
                  <EllipsisOutlined className="text-gray-800 text-lg transform rotate-90 self-center" />
                </div>
              </div>
            ))}
          </div>

          <div className="fixed bottom-0 right-0 w-full bg-white p-4 shadow-md flex justify-end items-center gap-5">
            <Pagination
              current={currentPage}
              total={filteredData.length}
              pageSize={itemsPerPage}
              onChange={handlePageChange}
              itemRender={(page, type, originalElement) => {
                const lastPage = Math.ceil(filteredData.length / itemsPerPage);

                if (type === "page") {
                  if (page === 1 || page === lastPage) {
                    return originalElement;
                  }
                  if (Math.abs(page - currentPage) <= 1) {
                    return originalElement;
                  }
                  if (page === currentPage - 2 && page > 2) {
                    return <span>...</span>;
                  }
                  if (page === currentPage + 2 && page < lastPage - 1) {
                    return <span>...</span>;
                  }
                  if (currentPage >= lastPage - 2 && Math.abs(page - lastPage) <= 3) {
                    return originalElement;
                  }
                  return null;
                }
                return originalElement;
              }}
              showSizeChanger={false}
              className="mt-4 text-center"
            />
          </div>
        </>
      ) : (
        <FeedbackDetail feedback={selectedFeedback} onBack={handleBack} />
      )}
    </div>
  );
};

export default FeedBack;
