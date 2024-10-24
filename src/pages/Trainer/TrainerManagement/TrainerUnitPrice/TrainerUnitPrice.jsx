import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const TrainerUnitPrice = () => {
  const trainerData = useSelector((state) => state.trainer.trainerInfo);
  const [unitData, setUnitData] = useState([]);

  // Set unitData whenever trainerData changes (component load or trainerData update)
  useEffect(() => {
    if (trainerData) {
      setUnitData(trainerData.trainerUnitPrice || []);
    }
  }, [trainerData]);

  return (
    <div className="p-4 sm:p-6">
      {unitData && unitData.length > 0 ? (
        <div>
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    No.
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    Unit Code
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    Last Modified Date
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    Last Modified By
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    Price
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody>
                {unitData.map((item) => (
                  <tr key={item.id} className="even:bg-gray-50">
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 text-center">
                      {item.id}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2">
                      {item.unitCode}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2">
                      {item.lastModifiedDate}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2">
                      {item.lastModifiedBy}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 text-right">
                      {item.price.toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2">
                      {item.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-4">
            {unitData.map((item) => (
              <div
                key={item.id}
                className="border border-gray-300 p-4 rounded-lg shadow-sm bg-white"
              >
                <p className="font-bold mb-2">No. {item.id}</p>
                <p>
                  <strong>Unit Code: </strong>
                  {item.unitCode}
                </p>
                <p>
                  <strong>Last Modified Date: </strong>
                  {item.lastModifiedDate}
                </p>
                <p>
                  <strong>Last Modified By: </strong>
                  {item.lastModifiedBy}
                </p>
                <p>
                  <strong>Price: </strong>
                  {item.price.toLocaleString()}
                </p>
                <p>
                  <strong>Note: </strong>
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center font-bold text-lg text-gray-500">
          No Data Was Found
        </p>
      )}
    </div>
  );
};

export default TrainerUnitPrice;
