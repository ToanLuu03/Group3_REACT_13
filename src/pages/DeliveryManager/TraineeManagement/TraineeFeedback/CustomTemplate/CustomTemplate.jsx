import React, { useState, useRef } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import cvImage from "../../../../../assets/template-cv.png";
import checkBox from "../../../../../assets/checkedBox.png";
import unCheckBox from "../../../../../assets/unCheckedBox.png";
import CVTemplate from "../TemplateCV/TemplateCV";
import Pagination from "../../../../../components/pagination/Pagination";

const CustomTemplate = ({ onEditTemplate }) => {
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // Calculate items to display based on pagination

  // Handlers for pagination
  const handlePageChange = (page) => setCurrentPage(page);
  const handlePageSizeChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1); // Reset to page 1 when page size changes
  };

  const options = [
    "Select All",
    "ClassAdmin 1",
    "ClassAdmin 2",
    "ClassAdmin 3",
    "ClassAdmin 4",
    "ClassAdmin 5",
    "ClassAdmin 6",
  ];

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectOption = (option) => {
    if (option === "Select All") {
      setSelectedOptions((prevSelected) =>
        prevSelected.length === options.length - 1 ? [] : options.slice(1)
      );
    } else {
      setSelectedOptions((prevSelected) =>
        prevSelected.includes(option)
          ? prevSelected.filter((selected) => selected !== option)
          : [...prevSelected, option]
      );
    }
  };

  const handleDropdownToggle = (index) => {
    setDropdownIndex(dropdownIndex === index ? null : index);
  };

  const handleAction = (action, index) => {
    if (action === "Delete") {
      setTemplateToDelete(index);
      setShowDeletePopup(true);
    } else if (action === "Edit") {
      onEditTemplate(index);
    }
    setDropdownIndex(null);
  };

  const confirmDelete = () => {
    console.log("Deleting template at index:", templateToDelete);
    setShowDeletePopup(false);
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
      {/* Select Section */}
      <div className="flex gap-4 justify-end mt-12 text-gray-600">
        <div className="relative">
          <buttton
            className="flex items-center justify-between cursor-pointer md:w-60 border border-gray-300 rounded-lg px-4 py-2 text-left text-gray-600 bg-white shadow-sm hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>
              {selectedOptions.length > 0
                ? selectedOptions.join(", ")
                : "Select options"}
            </span>
            <IoMdArrowDropdown className="w-4 h-4" />
          </buttton>

          {/* Dropdown list */}
          {isOpen && (
            <div className="absolute left-0 w-full bg-white border-2 border-gray-200 rounded-lg shadow-lg z-10 text-black">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-1 rounded-t-2xl border-b border-gray-200 focus:outline-none text-ellipsis overflow-hidden whitespace-nowrap"
              />

              <div className="max-h-48 overflow-y-auto">
                {filteredOptions.map((option) => (
                  <div
                    key={option}
                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectOption(option)}
                  >
                    <img
                      src={
                        option === "Select All" &&
                        selectedOptions.length === options.length - 1
                          ? checkBox
                          : selectedOptions.includes(option)
                          ? checkBox
                          : unCheckBox
                      }
                      alt={
                        selectedOptions.includes(option)
                          ? "Checked"
                          : "Unchecked"
                      }
                      className="w-4 h-4 mr-2"
                    />
                    <span>{option}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
        />
      </div>

      {/* CV Template Section */}
      <div className="mt-6 mx-auto p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-20 lg:gap-y-12 gap-4">
          {displayedData.map((item, index) => (
            <CVTemplate
              key={index}
              item={item}
              index={index}
              onDropdownToggle={handleDropdownToggle}
              dropdownIndex={dropdownIndex}
              handleAction={handleAction}
              dropdownRef={dropdownRef}
            />
          ))}
        </div>
      </div>
      {/* Pagination Component */}
      <Pagination
        totalItems={data.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Delete Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-md shadow-lg w-1/3">
            <div className="flex rounded-t-md items-center justify-between p-3 text-white bg-customRed">
              <h2 className="text-lg font-semibold">DELETE TEMPLATE</h2>
              <span
                onClick={() => setShowDeletePopup(false)}
                className="font-bold text-xl cursor-pointer "
              >
                X
              </span>
            </div>
            <p className="p-2 pb-3 font-semibold">
              Are you sure you want to delete this template?
            </p>
            <div className="flex justify-end p-4 gap-4">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="bg-white border hover:bg-gray-100 text-customRed font-bold py-2 px-6 rounded-full"
              >
                No
              </button>
              <button
                onClick={confirmDelete}
                className="bg-customRed hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTemplate;
