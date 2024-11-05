import React, { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import checkBox from "../../../../../assets/checkedBox.png";
import unCheckBox from "../../../../../assets/unCheckedBox.png";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { feedbackData } from "./FeedbackData";
import RatingSection from "./RatingSection";

const FeedbackDetail = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

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

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
  };

  const toggleFeedbackDetail = (index) => {
    setExpandedFeedback(expandedFeedback === index ? null : index);
  };

  const ratings = [10, 0, 1, 0, 0];
  const totalVotes = ratings.reduce((sum, count) => sum + count, 0);

  const averageRating = totalVotes
    ? ratings.reduce((sum, count, index) => sum + count * (5 - index), 0) /
      totalVotes
    : 0;

  const feedbacks = Array(8).fill({
    rating: 5,
    moduleFeedback: "I have no problem in this part.",
    trainerFeedback:
      "I have learned many skills in Front End development, but some exercises are too difficult for beginners",
  });

  return (
    <div className="mt-6 flex flex-col">
      {/* Select Section */}
      <div className="flex gap-4 justify-end mt-4 text-gray-600">
        <div className="relative inline-block w-64">
          <div
            className="bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer px-4 py-2 flex justify-between items-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>
              {selectedOptions.length > 0
                ? selectedOptions.join(", ")
                : "Select class"}
            </span>
            <IoMdArrowDropdown className="w-4 h-4" />
          </div>

          {/* Dropdown list */}
          {isOpen && (
            <div className="absolute left-0 w-full bg-white border-2 border-gray-200 rounded-lg shadow-lg z-10 text-black">
              {/* Search box */}
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-1 rounded-t-2xl border-b border-gray-200 focus:outline-none text-ellipsis overflow-hidden whitespace-nowrap"
              />

              {/* List of options */}
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
      </div>

      {/* Average Rating */}
      <div className="flex items-center space-x-4 p-4">
        <div className="flex flex-col items-center">
          <span className="text-xl font-semibold">Average</span>
          <div className="flex items-center space-x-1">
            <span className="text-4xl font-bold">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-yellow-500 text-3xl">★</span>
          </div>
        </div>
        <div className="flex flex-col space-y-1 w-4/12">
          {[...Array(5)].map((_, i) => {
            const ratingCount = ratings[i];
            const percentage =
              totalVotes > 0 ? (ratingCount / totalVotes) * 100 : 0;

            return (
              <div key={i} className="flex items-center">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <span
                      key={j}
                      className={`text-2xl ${
                        j <= 4 - i ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className="w-2/3 h-2 bg-gray-300 rounded-full ml-3">
                  <div
                    className="h-2 bg-yellow-400 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-gray-500">{ratingCount}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex items-center space-x-2 pl-6 pt-4 w-5/12 border-t-gray-200 border-t-2">
        <span className="text-gray-400 font-bold text-2xl">Filter:</span>
        {["All", 5, 4, 3, 2, 1].map((rating) => (
          <button
            key={rating}
            onClick={() => handleFilterClick(rating)}
            className={`flex items-center justify-center w-16 h-9 px-3 py-1 rounded-full border ${
              selectedFilter === rating
                ? "border-blue-500 text-blue-500"
                : "border-gray-300 text-gray-600"
            }`}
          >
            {rating === "All" ? (
              "All"
            ) : (
              <span className="flex items-center space-x-1">
                <span>{rating}</span>
                <span className="text-yellow-400 text-2xl pb-1">★</span>
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Feedback List */}
      {feedbacks.length > 0 ? (
        <div className="mt-4">
          {feedbacks.map((feedback, index) => (
            <div
              key={index}
              className="border-b py-3 px-4 bg-neutral-50 text-lg"
            >
              {/* Phần chính của feedback */}
              <div
                className="flex justify-between items-center gap-2"
                onClick={() => toggleFeedbackDetail(index)}
              >
                <div className="flex gap-2 w-full cursor-pointer">
                  <div className="flex mt-4">
                    <span className="text-xl font-semibold mr-2">
                      {feedback.rating}
                    </span>
                    <span className="text-yellow-400 text-2xl">★</span>
                  </div>
                  <div className="mt-2 text-black font-semibold w-full">
                    <p>Module's feedback: {feedback.moduleFeedback}</p>
                    <p>Trainer's feedback: {feedback.trainerFeedback}</p>
                  </div>
                </div>
                <div className="text-2xl">
                  {expandedFeedback === index ? (
                    <RiArrowDropUpLine />
                  ) : (
                    <RiArrowDropDownLine />
                  )}
                </div>
              </div>

              {/* Phần chi tiết mở rộng */}
              {expandedFeedback === index && (
                <div
                  className="w-full p-6 rounded-lg mt-2"
                  // onClick={() => toggleExpandedFeedbackDetail(index)}
                >
                  {feedbackData.map((section, sectionIndex) => (
                    <RatingSection
                      key={sectionIndex}
                      title={section.title}
                      items={section.items}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="uppercase text-2xl font-bold text-center text-gray-300 flex items-center justify-center h-[360px]">
          No data available
        </div>
      )}
    </div>
  );
};

export default FeedbackDetail;
