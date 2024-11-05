import { Checkbox } from "antd";
import React from "react";
import { MdOutlineModeEdit } from "react-icons/md";
const TrainingTable = ({ filteredData, onCheckboxChange }) => {
  const handleCheckboxChange = (e) => {
    onCheckboxChange(e.target.checked); // Notify parent about checkbox state
  };

  // Group data by topicName
  const groupedData = filteredData.reduce((acc, item) => {
    if (!acc[item.topicName]) {
      acc[item.topicName] = [];
    }
    acc[item.topicName].push(item);
    return acc;
  }, {});

  return (
    <div className="p-4 md:p-8">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border p-2 text-left">Topics</th>
              <th className="border p-2 text-left"></th>
              <th className="border p-2 text-left">Contents</th>
              <th className="border p-2 text-left">Delivery Type</th>
              <th className="border p-2 text-left">Training Format</th>
              <th className="border p-2 text-left">Scheduled Date</th>
              <th className="border p-2 text-left">Actual Date</th>
              <th className="border p-2 text-left">Duration (hour)</th>
              <th className="border p-2 text-left">Note</th>
              <th className="border p-2 text-left">Reason for mismatch - if any</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedData).map(([topicName, items], index) => (
              <React.Fragment key={index}>
                {items.map((item, subIndex) => (
                  <tr key={subIndex}>
                    {subIndex === 0 && (
                      <>
                        <td
                          className="text-center border px-2 py-2"
                          rowSpan={items.length}
                        >
                          {topicName}
                        </td>
                        <td
                          className="border px-2 text-center"
                          rowSpan={items.length}
                        >
                          <Checkbox onChange={handleCheckboxChange} />
                        </td>
                      </>
                    )}
                    <td className="border px-4 py-2">{item.contentName}</td>
                    <td className="text-center border px-4 py-2">
                      {item.deliveryType}
                    </td>
                    <td className="text-center border px-4 py-2">
                      {item.trainingFormat}
                    </td>
                    <td className="text-center border px-4 py-2">{item.scheduledDate}</td>
                    <td className="text-center border px-4 py-2">{item.actualDate}</td>
                    <td className="text-center border px-4 py-2">{item.duration}</td>
                    <td className="text-center border px-4 py-2">{item.note}</td>
                    <td className="text-center border px-4 py-2">{item.reason}</td>
                    <td className="text-center border px-4 py-2">{item.status}</td>
                    <td className="text-center border px-4 py-2">
                      <button className=""><MdOutlineModeEdit /></button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrainingTable;