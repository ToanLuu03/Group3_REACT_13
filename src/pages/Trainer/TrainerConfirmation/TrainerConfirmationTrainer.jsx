import React, { useCallback, useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { Checkbox, DatePicker, Input, message, Modal, Spin } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  LeftOutlined,
  RightOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
} from "@ant-design/icons";
import TrainerAPI from "../../../services/trainer";
import Eye from "../../../assets/image/eye.png";

const TrainerConfirmation = () => {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [classes, setClasses] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const username = useSelector((state) => state.users.users.userName.username);
  const token = useSelector((state) => state.users.users.userName.token);
  const role = useSelector((state) => state.role.selectedRole.role);
  const navigate = useNavigate();

  const getTrainerConfirmation = useCallback(async () => {
    setLoading(true);
    try {
      const response = await TrainerAPI.trainerConfirmation(username, token);
      setClasses(response.data.classConfirmations); // Set the classConfirmations data
    } catch (error) {
      console.error("Error fetching trainer confirmation:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getTrainerConfirmation();
    // console.log("🚀 ~ TrainerConfirmation ~ classes:", classes)
  }, []);

  const handleSelectAll = () => {
    setSelectedAll(!selectedAll);
    if (!selectedAll) {
      setCheckedItems(classes.map((classItem) => classItem.id));
    } else {
      setCheckedItems([]);
    }
  };

  const handleSelectRow = (id) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter((itemId) => itemId !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };

  const showModal = (action) => {
    setModalContent(action);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setReason("");
  };

  const handleSubmit = () => {
    console.log(reason);
    setIsModalVisible(false);
  };

  const handleClassCodeClick = (className) => {
    navigate(`/${role}/trainer-confirmation/${className}`);
  };
  if (loading)
    return (
      <div className="flex justify-center mt-20 ">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col flex-grow mt-14 px-3">
        {/* Header */}
        <div className="flex gap-2 items-center flex-wrap">
          <h2 className="text-2xl font-bold">Trainer Confirmation</h2>
          <div className="mb-1 mt-1 px-3 py-1 text-xs rounded-full bg-[#D8FAE6] text-[#648A77]">
            In Progress
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center mb-6 mt-3 gap-4 w-full">
          <div className="flex flex-col lg:flex-row items-start lg:items-center w-full gap-4">
            <div className="flex items-center w-full lg:w-auto">
              <label className="mr-2">Status:</label>
              <select
                className="border border-gray-300 rounded-md p-2 w-full lg:w-auto"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Assigned">Assigned</option>
              </select>
            </div>

            <div className="flex items-center w-full lg:w-auto">
              <label className="mr-2">Start Date:</label>
              <DatePicker className="w-full lg:w-auto" />
            </div>

            <div className="flex items-center w-full lg:w-auto">
              <label className="mr-2">End Date:</label>
              <DatePicker className="w-full lg:w-auto" />
            </div>
          </div>

          <div className="w-full">
            <Input
              type="text"
              placeholder="Enter class code, class name"
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3 border">
                  <Checkbox checked={selectedAll} onChange={handleSelectAll} />
                </th>
                <th className="text-left p-3 border">No.</th>
                <th className="text-left p-3 border">Class Code</th>
                <th className="text-left p-3 border hidden md:table-cell">
                  Technical Group
                </th>
                <th className="text-left p-3 border hidden lg:table-cell">
                  Site
                </th>
                <th className="text-left p-3 border hidden lg:table-cell">
                  Plan Start Date
                </th>
                <th className="text-left p-3 border hidden lg:table-cell">
                  Plan End Date
                </th>
                <th className="text-left p-3 border hidden md:table-cell">
                  Modules
                </th>
                <th className="text-left p-3 border">Status</th>
                <th className="text-left p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((classItem, index) => (
                <tr key={classItem.id} className="border">
                  <td className="p-3 border">
                    <Checkbox
                      checked={checkedItems.includes(classItem.id)}
                      onChange={() => handleSelectRow(classItem.id)}
                    />
                  </td>
                  <td className="p-3 border">{index + 1}</td>
                  <td
                    className="p-3 border text-[#5750DF] cursor-pointer"
                    onClick={() => handleClassCodeClick(classItem.className)}
                  >
                    {classItem.className}
                  </td>
                  <td className="p-3 border hidden md:table-cell">
                    {classItem.technicalGroup}
                  </td>
                  <td className="p-3 border hidden lg:table-cell">
                    {classItem.site}
                  </td>
                  <td className="p-3 border hidden lg:table-cell">
                    {new Date(classItem.planStartDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 border hidden lg:table-cell">
                    {new Date(classItem.planEndDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 border hidden md:table-cell">
                    {classItem.modules.map((module, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div>
                          <Checkbox />
                        </div>
                        <span className="text-sm">{module.moduleName}</span>
                      </div>
                    ))}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="px-3 py-1 rounded-full mb-2 bg-[#D8FAE6] text-[#648A77]">
                        {classItem.modules[0]?.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 border">
                    <div className="flex space-x-2">
                      <button
                        className="text-green-500"
                        onClick={() => showModal("accept")}
                      >
                        <FaCheck />
                      </button>
                      <button>
                        <img src={Eye} alt="" />
                      </button>
                      <button
                        className="text-red-500"
                        onClick={() => showModal("decline")}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title={modalContent === "accept" ? "CONSIDER MODULE" : "DECLINE MODULE"}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        okText={modalContent === "accept" ? "Submit" : "Submit"}
        cancelText="Cancel"
      >
        {modalContent === "decline" ? (
          <div>
            <p>Do you really want to decline “SQL” module?</p>
            <Input.TextArea
              placeholder="Enter reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        ) : (
          <div>
            <p>Do you really want to consider “SQL” module?</p>
            <Input.TextArea
              placeholder="Enter reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TrainerConfirmation;
