import React, { useState } from "react";
import { ClockCircleOutlined, EllipsisOutlined } from "@ant-design/icons";
import { Pagination, Select, Input } from "antd";
import FeedbackDetail from "../../../../components/Admin/FeedbackDetail/FeedbackDetail";

// Define sampleFeedback object for demonstration
const sampleFeedback = {
  moduleFeedback: "I have no problem in this part.",
  trainerFeedback:
    "I have learned many skills in Front End development, but some exercises are too difficult for beginners.",
  content: [
    { question: "I am satisfied with the module/course's content.", rating: 80 },
    { question: "The training objectives are clearly defined.", rating: 70 },
    { question: "The level of the course is appropriate for the trainees.", rating: 90 },
    { question: "The course is useful for your work.", rating: 85 },
    { question: "The materials distributed are appropriate and helpful.", rating: 75 },
  ],
  trainerFeedbackItems: [
    { question: "The trainer has a wide-range of knowledge.", rating: 85 },
    { question: "Training content follows curriculum.", rating: 80 },
    { question: "The trainer’s instructions are clear and understandable.", rating: 90 },
    { question: "Trainer supports enthusiastically.", rating: 95 },
  ],
  courseOrganization: [
    { question: "Materials distributed are appropriate and helpful.", rating: 75 },
    { question: "Course structure is clear.", rating: 80 },
    { question: "Course schedule is well-organized.", rating: 85 }, // New addition
    { question: "The course materials are easy to follow.", rating: 90 }, // New addition
    { question: "The course environment promotes interaction.", rating: 88 }, // New addition
    { question: "The course pace is appropriate.", rating: 92 }, // New addition
  ],
};

const FeedBack = () => {
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const itemsPerPage = 4;

  // Handle sorting change
  const handleSortChange = (option) => {
    setSortOption(option);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle feedback card click
  const handleCardClick = () => {
    setSelectedFeedback(sampleFeedback); // Use the sampleFeedback directly
  };

  // Handle back action to return to the feedback list
  const handleBack = () => {
    setSelectedFeedback(null);
  };

  // Generate feedback data dynamically using FeedbackTemplate
  const feedbackData = [
    {
      id: 1,
      date: "2024-10-15",
      content: "Feedback 1",
      details: sampleFeedback, // Include the sampleFeedback for this feedback item
    },
    {
      id: 2,
      date: "2024-10-14",
      content: "Feedback 2",
      details: sampleFeedback,
    },
    // Add more feedback entries as needed
  ];

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
  const filteredData = sortedData.filter((item) =>
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="p-0 ml-2 mr-4">
      {!selectedFeedback ? (
        <>
          {/* Sort and Search Options */}
          <div className="flex justify-end gap-5 mb-4 flex-wrap">
            <div className="flex flex-col">
              <label className="font-medium text-gray-800">Sort</label>
              <Select
                value={sortOption}
                onChange={handleSortChange}
                style={{ width: 160 }}
                allowClear
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

          {/* Feedback Cards Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-4">
            {currentData.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">No feedback found.</div>
            ) : (
              currentData.map((item) => (
                <div
                  key={item.id}
                  className="border-2 border-gray-400 rounded-lg overflow-hidden shadow-sm cursor-pointer hover:translate-y-[-4px] hover:shadow-xl transition-all duration-200"
                  onClick={handleCardClick} // Open the feedback detail on card click
                >
                  <div className="p-2 bg-gray-50 flex items-center justify-center">
                    <img
                      src="https://hoatuoi360.vn/uploads/file/Baiviet2024/hoa-tulip-trang.jpg"
                      alt={`Image ${item.id}`}
                      className="object-cover w-full h-48 rounded-md shadow-md border border-gray-500"
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
              ))
            )}
          </div>

          {/* Pagination Component */}
          <div className="fixed bottom-0 right-0 w-full bg-white p-4 shadow-md flex justify-end items-center gap-5">
            <Pagination
              current={currentPage}
              total={filteredData.length}
              pageSize={itemsPerPage}
              onChange={handlePageChange}
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
