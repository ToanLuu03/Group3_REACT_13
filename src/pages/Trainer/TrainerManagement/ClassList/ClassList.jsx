import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import arrowUP from "../../../../assets/image/arrow_up.png";
import arrowDown from "../../../../assets/image/arrow_down.png";
import { fetchClassListApi } from "../../../../services/classlist/trainer/index";
import { Spin } from "antd";
import TrainerAPI from "../../../../services/trainer";

const getStatusBadgeClass = (status) => {
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

const ClassList = ({ onModuleClick }) => {
  const token = localStorage.getItem("token");
  const [classData, setClassData] = useState([]);
  const [openClass, setOpenClass] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [classFilter, setClassFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const trainerData = useSelector((state) => state.trainer.trainerInfo);

  const fetchClassList = async () => {
    setLoading(true);
    try {
      const classConfirmations = trainerData.trainerClassList;
      const formattedClassData = classConfirmations.map((classItem) => ({
        className: classItem.className,
        modules: classItem.modules.map((module) => ({
          id: module.id,
          moduleName: module.moduleName,
          startDate: module.startDate,
          endDate: module.endDate,
          status: module.status,
        })),
      }));
      setClassData(formattedClassData);
      const initialOpenClass = formattedClassData.reduce((acc, classItem) => {
        acc[classItem.className] = true;
        return acc;
      }, {});
      setOpenClass(initialOpenClass);
    } catch (error) {
      console.error("Failed to fetch class list", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassList();
  }, [token]);

  const toggleClass = (className) => {
    setOpenClass((prevState) => ({
      ...prevState,
      [className]: !prevState[className],
    }));
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleClassFilterChange = (event) => {
    setClassFilter(event.target.value);
  };

  const handleModuleFilterChange = (event) => {
    setModuleFilter(event.target.value);
  };

  const filteredClassData = classData
    .filter((classItem) =>
      classItem.className.toLowerCase().includes(classFilter.toLowerCase())
    )
    .map((classItem) => ({
      ...classItem,
      modules: classItem.modules.filter((module) =>
        module.moduleName.toLowerCase().includes(moduleFilter.toLowerCase())
      ),
    }))
    .filter((classItem) => classItem.modules.length > 0);

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <Spin size="large" tip="Loading..." />
      </div>
    );

  return (
    <div className="px-3 relative max-h-screen flex flex-col">
      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="w-full">
          <p className="text-gray-700 font-bold">Class</p>
          <input
            type="text"
            placeholder="Enter Class..."
            value={classFilter}
            onChange={handleClassFilterChange}
            className="border rounded-lg p-2 w-full"
          />
        </div>
        <div className="w-full">
          <p className="text-gray-700 font-bold">Module</p>
          <input
            type="text"
            placeholder="Enter Module..."
            value={moduleFilter}
            onChange={handleModuleFilterChange}
            className="border rounded-lg p-2 w-full"
          />
        </div>
        <div className="w-full">
          <p className="text-gray-700 font-bold">Status</p>
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="border rounded-lg p-2 w-full"
          >
            <option value="All">All</option>
            <option value="In Progress">In Progress</option>
            <option value="Not started">Not Started</option>
            <option value="Cancel">Cancel</option>
            <option value="ACCEPT">Accept</option>
          </select>
        </div>
      </div>

      {/* Class List */}
      <div className="space-y-6 flex-grow overflow-y-auto">
        {filteredClassData.map((classItem) => (
          <div
            key={classItem.className}
            className="border rounded-lg shadow p-4"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              {/* Class Name */}
              <h2 className="text-lg md:text-xl font-semibold">
                {classItem.className}
              </h2>

              {/* Toggle Button */}
              <button
                onClick={() => toggleClass(classItem.className)}
                className="text-blue-500 hover:text-blue-700"
              >
                {openClass[classItem.className] ? (
                  <img src={arrowUP} width={20} alt="Collapse" />
                ) : (
                  <img src={arrowDown} width={20} alt="Expand" />
                )}
              </button>
            </div>

            {openClass[classItem.className] && (
              <div className="overflow-x-auto">
                <table className="table-auto w-full text-left border">
                  <thead>
                    <tr>
                      <th className="p-2 border">No.</th>
                      <th className="p-2 border">Module</th>
                      <th className="p-2 border hidden md:table-cell">
                        Start Date
                      </th>
                      <th className="p-2 border hidden md:table-cell">
                        End Date
                      </th>
                      <th className="p-2 border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classItem.modules
                      .filter(
                        (module) =>
                          selectedStatus === "All" ||
                          module.status === selectedStatus
                      )
                      .map((module, index) => (
                        <tr key={module.id}>
                          <td className="p-2 border">{index + 1}</td>
                          <td
                            className="p-2 border text-[#5750DF] cursor-pointer"
                            onClick={() => onModuleClick(module)}
                          >
                            {module.moduleName}
                          </td>
                          <td className="p-2 border hidden md:table-cell">
                            {module.startDate}
                          </td>
                          <td className="p-2 border hidden md:table-cell">
                            {module.endDate}
                          </td>
                          <td className="p-2 border">
                            <span
                              className={`py-1 px-2 rounded ${getStatusBadgeClass(
                                module.status
                              )}`}
                            >
                              {module.status || "Unavailable"}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassList;
