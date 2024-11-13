import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select } from "antd";

const CVHistory = () => {
  const dateOptions = [
    { value: "all", label: "All Dates" },
    { value: "today", label: "Today" },
    { value: "this_week", label: "This Week" },
    { value: "this_month", label: "This Month" },
  ];

  const actionOptions = [
    { value: "all", label: "All Actions" },
    { value: "download", label: "Download" },
    { value: "modify", label: "Modify" },
    { value: "upload", label: "Upload" },
  ];

  const fileTypeOptions = [
    { value: "all", label: "All File Types" },
    { value: "excel", label: "Excel" },
    { value: "docx", label: "Docx" },
  ];

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedFileType, setSelectedFileType] = useState("all");
  const [selectedAction, setSelectedAction] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v2/trainer/get-info-v2/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setData(response.data.data.trainerInfo.cv);
          console.log("Data:", response.data.data.trainerInfo);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [username, token]);

  const handleFilter = () => {
    return data.filter((item) => {
      const matchesDate =
        selectedDate === "all" || item.datetime.includes(selectedDate);
      const matchesFileType =
        selectedFileType === "all" ||
        item.cv.toLowerCase().includes(selectedFileType);
      const matchesAction =
        selectedAction === "all" ||
        item.action.toLowerCase() === selectedAction;
      return matchesDate && matchesFileType && matchesAction;
    });
  };

  return (
    <div className="flex flex-col justify-between min-h-[calc(100vh-20px)] p-4">
      {/* Select Section */}
      <div>
        <div className="flex space-x-4 mb-4 items-center">
          <div className="flex flex-col w-1/6">
            <span>Date</span>
            <Select
              options={dateOptions}
              defaultValue="all"
              className="w-full"
              onChange={setSelectedDate}
            />
          </div>
          <div className="flex flex-col w-1/6">
            <span>File Type</span>
            <Select
              options={fileTypeOptions}
              defaultValue="all"
              className="w-full"
              onChange={setSelectedFileType}
            />
          </div>
          <div className="flex flex-col w-1/6">
            <span>Action</span>
            <Select
              options={actionOptions}
              defaultValue="all"
              className="w-full"
              onChange={setSelectedAction}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-y-auto max-h-[70vh]">
          <table className="w-full border border-gray-300 min-h-32">
            <thead className="bg-gray-300 font-semibold text-gray-700">
              <tr>
                <th className="border border-gray-400 p-2 text-center">No.</th>
                <th className="border border-gray-400 p-2 text-center">
                  CV Version
                </th>
                <th className="border border-gray-400 p-2 text-center">
                  Modification Date
                </th>
                <th className="border border-gray-400 p-2 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {handleFilter().length > 0 ? (
                handleFilter().map((item, index) => (
                  <tr key={item.id} className="text-center">
                    <td className="border border-gray-400 p-2">
                      <strong>{index + 1}</strong>
                    </td>
                    <td className="border border-gray-400 p-2">
                      <a href="#" className="underline">
                        {item.cv}
                      </a>
                    </td>
                    <td className="border border-gray-400 p-2">
                      {item.datetime}
                    </td>
                    <td className="border border-gray-400 p-2">
                      <button className="text-blue-500">{item.action}</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="border border-gray-400 p-4 text-4xl text-center text-gray-500"
                  >
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Back Button */}
      <div>
        <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg mt-4">
          Back to pageName
        </button>
      </div>
    </div>
  );
};

export default CVHistory;
