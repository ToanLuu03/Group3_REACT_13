import React from "react";

const ReportTable = ({ reportData }) => {
  // Group report data by date
  const groupedData = reportData.reduce((acc, item) => {
    const date = item.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  return (
    <div className="mt-6">
      {/* Normal table for larger screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-2 text-center">Date</th>
              <th className="border px-2 py-2 text-center">Topic</th>
              <th className="border px-2 py-2 text-center">Delivery Type</th>
              <th className="border px-2 py-2 text-center">Training Format</th>
              <th className="border px-2 py-2 text-center">Duration (h)</th>
              <th className="border px-2 py-2 text-center">Note</th>
              <th className="border px-2 py-2 text-center">Reason</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedData).length > 0 ? (
              Object.keys(groupedData).map((date, dateIndex) => {
                const items = groupedData[date];
                const firstItem = items[0];
                const sameDuration = items.every(item => item.duration === firstItem.duration);
                const sameNote = items.every(item => item.note === firstItem.note);
                const sameReason = items.every(item => item.reason === firstItem.reason);

                return items.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    {index === 0 && (
                      <td
                        rowSpan={items.length}
                        className="border px-2 py-2 text-center"
                      >
                        {date}
                      </td>
                    )}
                    <td className="border px-2 py-2 text-left">{item.topicName}</td>
                    <td className="border px-2 py-2 text-center">{item.deliveryType}</td>
                    <td className="border px-2 py-2 text-center">{item.trainingFormat}</td>

                    {sameDuration && index === 0 && (
                      <td rowSpan={items.length} className="border px-2 py-2 text-center">
                        {item.duration}
                      </td>
                    )}
                    {!sameDuration && (
                      <td className="border px-2 py-2 text-center">{item.duration}</td>
                    )}

                    {sameNote && index === 0 && (
                      <td rowSpan={items.length} className="border px-2 py-2 text-center">
                        {item.note}
                      </td>
                    )}
                    {!sameNote && (
                      <td className="border px-2 py-2 text-center">{item.note}</td>
                    )}

                    {sameReason && index === 0 && (
                      <td rowSpan={items.length} className="border px-2 py-2 text-center">
                        {item.reason}
                      </td>
                    )}
                    {!sameReason && (
                      <td className="border px-2 py-2 text-center">{item.reason}</td>
                    )}
                  </tr>
                ));
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-4">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Stacked layout for smaller screens */}
      <div className="block md:hidden">
        {Object.keys(groupedData).length > 0 ? (
          Object.keys(groupedData).map((date, dateIndex) => {
            const items = groupedData[date];
            return (
              <div key={dateIndex} className="mb-4">
                <h3 className="bg-gray-100 text-gray-700 px-4 py-2 font-semibold">
                  Date: {date}
                </h3>
                {items.map((item, index) => (
                  <div key={index} className="border-b border-gray-300">
                    <div className="px-4 py-2">
                      <p>
                        <strong>Topic: </strong> {item.topicName}
                      </p>
                      <p>
                        <strong>Delivery Type: </strong> {item.deliveryType}
                      </p>
                      <p>
                        <strong>Training Format: </strong> {item.trainingFormat}
                      </p>
                      <p>
                        <strong>Duration: </strong> {item.duration} hours
                      </p>
                      <p>
                        <strong>Note: </strong> {item.note}
                      </p>
                      <p>
                        <strong>Reason: </strong> {item.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 py-4">No data available</p>
        )}
      </div>
    </div>
  );
};

export default ReportTable;
