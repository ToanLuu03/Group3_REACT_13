import React, { useState, useRef } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import cvImage from "../../../../../assets/template-cv.png";
import FeedbackDetail from "./FeedbackDetail";
import CVTemplate from "../TemplateCV/TemplateCV";
import Pagination from "../../../../../components/pagination/Pagination";

const Feedback = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Select an option");
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [showFeedbackDetail, setShowFeedbackDetail] = useState(false); // Thêm state này
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const dropdownRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // Calculate items to display based on pagination

  // Handlers for pagination
  const handlePageChange = (page) => setCurrentPage(page);
  const handlePageSizeChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1); // Reset to page 1 when page size changes
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleDropdownToggle = (index) => {
    setDropdownIndex(dropdownIndex === index ? null : index);
  };

  const handleAction = (action) => {
    setDropdownIndex(null);
  };

  const handleImageClick = (template) => {
    setSelectedTemplate(template);
    setShowFeedbackDetail(true);
  };

  const data = Array(8).fill({
    title: "Mẫu không có tiêu đề",
    lastUpdate: "2024/10/15",
    creator: "NganDD",
    imageUrl: cvImage,
  });
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = data.slice(startIndex, endIndex);

  return (
    <div className="mt-6">
      {showFeedbackDetail ? (
        <FeedbackDetail template={selectedTemplate} />
      ) : (
        <>
          {/* Select Section */}
          <div className="flex gap-4 justify-end">
            {/* Custom Dropdown */}
            <div className="relative flex flex-col">
              <span>Sort</span>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between md:w-60 border border-gray-300 rounded-lg px-4 py-2 text-left text-gray-600 bg-white shadow-sm hover:bg-gray-100"
              >
                {selectedOption}
                <span>
                  <IoMdArrowDropdown />
                </span>
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute left-0 mt-[66px] w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    <label className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-100 rounded">
                      <input
                        type="radio"
                        name="classAdmin"
                        value="Latest"
                        checked={selectedOption === "Latest"}
                        onChange={() => handleOptionChange("Latest")}
                        className="form-radio text-blue-500"
                      />
                      <span>Latest</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-100 rounded">
                      <input
                        type="radio"
                        name="classAdmin"
                        value="Oldest"
                        checked={selectedOption === "Oldest"}
                        onChange={() => handleOptionChange("Oldest")}
                        className="form-radio text-blue-500"
                      />
                      <span>Oldest</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="flex flex-col">
              <span>Search</span>
              <input
                type="text"
                placeholder="Enter key words"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
              />
            </div>
          </div>
          {/* CV Template Section */}
          <div className="mt-6 mb-10 mx-auto p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 lg:gap-y-12 gap-5 gap-y-10">
              {displayedData.map((item, index) => (
                <CVTemplate
                  key={index}
                  item={item}
                  index={index}
                  onDropdownToggle={handleDropdownToggle}
                  dropdownIndex={dropdownIndex}
                  handleAction={handleAction}
                  dropdownRef={dropdownRef}
                  onClick={handleImageClick}
                />
              ))}
            </div>
          </div>
          {/* Pagination Component */}
          <div className="fixed bottom-0 pb-4 bg-white w-full pr-8 border-t border-gray-300">
          <Pagination
            totalItems={data.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
          </div>
          
        </>
      )}
    </div>
  );
};

export default Feedback;
