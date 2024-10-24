import { Checkbox } from "antd";
import React from "react";

const TrainingTable = ({ filteredData, onCheckboxChange }) => {
  const handleCheckboxChange = (e) => {
    onCheckboxChange(e.target.checked); // Notify parent about checkbox state
  };

  return (
    <div className="p-4 md:p-8">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse hidden md:table">
          <thead>
            <tr>
              <th className="border p-2 text-left">Schedule</th>
              <th className="border p-2 text-left"></th>
              <th className="border p-2 text-left">Topic</th>
              <th className="border p-2 text-left">Delivery Type</th>
              <th className="border p-2 text-left">Training Format</th>
              <th className="border p-2 text-left">Schedule Date</th>
              <th className="border p-2 text-left">Schedule Duration (h)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index}>
                  {index === 0 && (
                    <>
                      <td
                        rowSpan={filteredData.length}
                        className="text-center border px-2 py-2"
                      >
                        Overview
                      </td>
                      <td
                        rowSpan={filteredData.length}
                        className="border px-2 text-center"
                      >
                        <Checkbox onChange={handleCheckboxChange} />
                      </td>
                    </>
                  )}

                  <td className="border px-4 py-2">{item.topicName}</td>
                  <td className="text-center border px-4 py-2">
                    {item.deliveryType}
                  </td>
                  <td className="text-center border px-4 py-2">
                    {item.trainingFormat}
                  </td>
                  <td className="text-center border px-4 py-2">{item.date}</td>
                  <td className="text-center border px-4 py-2">
                    {item.duration}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-4">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Mobile version with stacked layout */}
        <div className="md:hidden">
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 mb-4 shadow-sm bg-white"
              >
                {index === 0 && (
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Overview</span>
                    <Checkbox onChange={handleCheckboxChange} />
                  </div>
                )}
                <div className="mb-2">
                  <span className="font-semibold">Topic:</span> {item.topicName}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Delivery Type:</span>{" "}
                  {item.deliveryType}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Training Format:</span>{" "}
                  {item.trainingFormat}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Schedule Date:</span>{" "}
                  {item.date}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">
                    Schedule Duration (h):
                  </span>{" "}
                  {item.duration}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingTable;
