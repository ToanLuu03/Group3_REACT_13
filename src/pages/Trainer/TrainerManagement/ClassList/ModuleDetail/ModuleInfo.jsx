import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchModuleData } from "../../../../../services/moduleInfo"; 
import { Spin } from "antd";

const ModuleInfo = ({ moduleData, onBackClick }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (moduleData && moduleData.id) {
      const getModuleData = async () => {
        try {
          const moduleDetails = await fetchModuleData(moduleData.id, token);
          setData(moduleDetails);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      getModuleData();
    }
  }, [moduleData, token]);
  

  if (error) {
    return <p className="text-base sm:text-lg">Error: {error}</p>;
  }

  if (!data) {
    return (
      <div className="p-4 relative">
      {loading && (
        <div className="fixed inset-0 z-50 bg-gray-200 bg-opacity-75 flex justify-center items-center">
          <Spin size="large" tip="Loading..." />
        </div>
      )}
    </div>
    )
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-green-200 text-green-800";
      case "ASSIGNED":
        return "bg-yellow-200 text-yellow-800";
      case "Cancel":
        return "bg-red-200 text-red-800";
      case "ACCEPT":
        return "bg-blue-200 text-blue-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
   
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
          Module Detail: {data.name}
        </h1>
        <span
          className={`px-3 py-1 mt-2 sm:mt-0 rounded-full text-sm sm:text-base font-medium ${getStatusBadge(
            data.status
          )}`}
        >
          {data.status || "Unknown"}
        </span>
      </div>

      <div className="border-t border-gray-300 mt-4 mb-6"></div>

      {/* Mobile Friendly Info Cards */}
      <div className="block sm:hidden">
        <div className="mb-4 p-4 border rounded-lg bg-gray-100">
          <p className="text-base sm:text-lg font-semibold text-gray-600">Module</p>
          <p className="text-sm sm:text-base text-gray-800">{data.name}</p>
        </div>
        <div className="mb-4 p-4 border rounded-lg bg-gray-100">
          <p className="text-base sm:text-lg font-semibold text-gray-600">Class</p>
          <p className="text-sm sm:text-base text-gray-800">{data.className}</p>
        </div>
        <div className="mb-4 p-4 border rounded-lg bg-gray-100">
          <p className="text-base sm:text-lg font-semibold text-gray-600">Role</p>
          <p className="text-sm sm:text-base text-gray-800">{data.roleName}</p>
        </div>
        <div className="mb-4 p-4 border rounded-lg bg-gray-100">
          <p className="text-base sm:text-lg font-semibold text-gray-600">Start Date</p>
          <p className="text-sm sm:text-base text-gray-800">
            {new Date(data.startDate).toLocaleDateString()}
          </p>
        </div>
        <div className="mb-4 p-4 border rounded-lg bg-gray-100">
          <p className="text-base sm:text-lg font-semibold text-gray-600">End Date</p>
          <p className="text-sm sm:text-base text-gray-800">
            {new Date(data.endDate).toLocaleDateString()}
          </p>
        </div>
        <div className="mb-4 p-4 border rounded-lg bg-gray-100">
          <p className="text-base sm:text-lg font-semibold text-gray-600">Status</p>
          <p className="text-sm sm:text-base text-gray-800">{data.status || "N/A"}</p>
        </div>
        <div className="mb-4 p-4 border rounded-lg bg-gray-100">
          <p className="text-base sm:text-lg font-semibold text-gray-600">Note</p>
          <p className="text-sm sm:text-base text-gray-800">{data.note || "N/A"}</p>
        </div>
      </div>

      {/* Table Layout for Larger Screens */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border border-gray-300">
          <tbody>
            <tr>
              <td className="p-3 text-sm sm:text-base font-semibold text-gray-600 border bg-gray-100 border-gray-300">
                Module
              </td>
              <td className="p-3 text-sm sm:text-base border border-gray-300">{data.name}</td>
              <td className="p-3 text-sm sm:text-base font-semibold text-gray-600 border bg-gray-100 border-gray-300">
                Class
              </td>
              <td className="p-3 text-sm sm:text-base border border-gray-300">{data.className}</td>
            </tr>
            <tr>
              <td className="p-3 text-sm sm:text-base font-semibold text-gray-600 border bg-gray-100 border-gray-300">
                Role
              </td>
              <td className="p-3 text-sm sm:text-base border border-gray-300">{data.roleName}</td>
              <td className="p-3 text-sm sm:text-base font-semibold text-gray-600 border bg-gray-100 border-gray-300">
                Start Date
              </td>
              <td className="p-3 text-sm sm:text-base border border-gray-300">
                {new Date(data.startDate).toLocaleDateString()}
              </td>
            </tr>
            <tr>
              <td className="p-3 text-sm sm:text-base font-semibold text-gray-600 border bg-gray-100 border-gray-300">
                End Date
              </td>
              <td className="p-3 text-sm sm:text-base border border-gray-300">
                {new Date(data.endDate).toLocaleDateString()}
              </td>
              <td className="p-3 text-sm sm:text-base font-semibold text-gray-600 border bg-gray-100 border-gray-300">
                Status
              </td>
              <td className="p-3 text-sm sm:text-base border border-gray-300">
                {data.status || "Unavailable"}
              </td>
            </tr>
            <tr>
              <td className="p-3 text-sm sm:text-base font-semibold text-gray-600 border bg-gray-100 border-gray-300">
                Note
              </td>
              <td className="p-3 text-sm sm:text-base border border-gray-300" colSpan="3">
                {data.note || "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 sticky bottom-0 left-0 w-full bg-white py-2">
        <div className="border-t-2 pt-2">
          <button
            onClick={onBackClick}
            className="border border-gray-300 rounded-full py-1 px-4 text-sm sm:text-base text-gray-700 hover:bg-gray-100 transition-all"
          >
            Back to Class List
          </button>
        </div>
      </div>
    </>
  );
};

export default ModuleInfo;
