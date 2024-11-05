// CVTemplate.js
import React from "react";
import { LuAlarmClock } from "react-icons/lu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { MdDownload } from "react-icons/md";
import iconXred from "../../../../../assets/icon-X-red.png";

const CVTemplate = ({
  item,
  index,
  onDropdownToggle,
  dropdownIndex,
  handleAction,
  dropdownRef,
  onClick,
}) => {
  return (
    <div
      key={index}
      className="border rounded-lg shadow-md flex flex-col items-center"
      onClick={onClick}
    >
      {/* Image */}
      <img
        src={item.imageUrl}
        alt="Document preview"
        className="w-full h-auto max-h-160 object-contain rounded-t-lg cursor-pointer"
      />

      {/* Content */}
      <div className="mt-2 w-full mb-2 p-2">
        <h3 className="text-lg font-bold">{item.title}</h3>
        <div className="flex items-center justify-between">
          <div className="gap-2 flex">
            <span className="text-gray-800 mt-2 text-2xl">
              <LuAlarmClock />
            </span>
            <div>
              <div className="text-black text-sm mt-2 flex-col items-center justify-center">
                Last Update: {item.lastUpdate}
              </div>
              <div className="text-black text-sm mt-1">
                Create by: {item.creator}
              </div>
            </div>
          </div>
          <div
            className="text-lg text-gray-500 mr-2 cursor-pointer relative"
            onClick={() => onDropdownToggle(index)}
            ref={dropdownRef}
          >
            <BsThreeDotsVertical />
            {dropdownIndex === index && (
              <div className="absolute w-56 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                <button
                  className="block w-full text-left text-md px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleAction("Edit", index)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      <FaRegEdit />
                    </span>
                    Custom Template
                  </div>
                </button>
                <button
                  className="block w-full text-left text-md px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleAction("Delete", index)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      <img src={iconXred} alt="Delete icon" />
                    </span>
                    Delete Template
                  </div>
                </button>
                <button
                  className="block w-full text-left text-md px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleAction("Export", index)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      <MdDownload />
                    </span>
                    Export Template
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVTemplate;
