import { Checkbox } from "antd";
import React from "react";
import { MdOutlineModeEdit } from "react-icons/md";

const ScheduleTable = ({ filteredData, selectedModule, onCheckboxChange }) => {
  const handleCheckboxChange = (e) => {
    onCheckboxChange(e.target.checked); // Notify parent about checkbox state
  };

  // Filter data by selected module
  const moduleFilteredData = filteredData.filter(
    (item) => item.moduleName === selectedModule
  );

  // Group data by topicName
  const groupedData = moduleFilteredData.reduce((acc, item) => {
    if (!acc[item.topicName]) {
      acc[item.topicName] = [];
    }
    acc[item.topicName].push(item);
    return acc;
  }, {});

  return (
    <div className="p-4 md:p-8">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse hidden md:table">
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
              <th className="border p-2 text-left">Reason for mismatch</th>
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
                      <button><MdOutlineModeEdit /></button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* Responsive view for smaller screens */}
        <div className="md:hidden">
          {Object.entries(groupedData).map(([topicName, items], index) => (
            <div key={index} className="mb-4 border-b border-gray-300 pb-4">
              <h3 className="text-lg font-semibold mb-2">{topicName}</h3>
              {items.map((item, subIndex) => (
                <div
                  key={subIndex}
                  className="flex flex-col bg-white shadow-md rounded-lg p-4 mb-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <Checkbox onChange={handleCheckboxChange} />
                    <button className="text-gray-500">
                      <MdOutlineModeEdit />
                    </button>
                  </div>
                  <div>
                    <p><strong>Content:</strong> {item.contentName}</p>
                    <p><strong>Delivery Type:</strong> {item.deliveryType}</p>
                    <p><strong>Training Format:</strong> {item.trainingFormat}</p>
                    <p><strong>Scheduled Date:</strong> {item.scheduledDate}</p>
                    <p><strong>Actual Date:</strong> {item.actualDate}</p>
                    <p><strong>Duration:</strong> {item.duration} hours</p>
                    <p><strong>Note:</strong> {item.note}</p>
                    <p><strong>Reason:</strong> {item.reason}</p>
                    <p><strong>Status:</strong> {item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleTable;
