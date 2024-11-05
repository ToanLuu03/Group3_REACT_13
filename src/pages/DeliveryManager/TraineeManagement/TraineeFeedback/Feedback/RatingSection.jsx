import React, { useState } from "react";
import RatingBar from "./RatingBar";
import { RiErrorWarningLine } from "react-icons/ri";

const RatingSection = ({ title, items }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  //   const [selectedItem, setSelectedItem] = useState(null);

  const showModal = (item) => {
    // setSelectedItem(item);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    // setSelectedItem(null);
  };

  return (
    <div className="my-6 relative">
      <h3 className="text-lg font-semibold text-center bg-gray-200 py-2 sticky top-0 z-10">
        {title}
      </h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span>{item.label}</span>
            <div className="flex items-center gap-4">
              <RatingBar rating={item.rating} />
              <button onClick={() => showModal(item)}>Details</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalVisible && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-8  rounded shadow-lg w-1/3 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-4 items-center">
              <RiErrorWarningLine className="text-3xl text-blue-400" />
              <h2 className="text-lg font-semibold">Problem details</h2>
            </div>
            <p>
              {/* {selectedItem ? selectedItem.details : "No details available"} */}
              There are some problems in case getting 3 star feedback
            </p>
            <div className="flex justify-end">
              <button
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
                onClick={closeModal}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingSection;
