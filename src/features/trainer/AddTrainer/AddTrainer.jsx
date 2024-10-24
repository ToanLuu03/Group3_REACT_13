import { Button, message, Select } from "antd";
import React, { useState } from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { addNewTrainer } from "../../../services/trainers/addNewTrainer";

const { Option } = Select;

const AddTrainerProfile = () => {
  const [dropdownState, setDropdownState] = useState({
    generalInfo: true,
    skills: false,
  });

  const [userInfo, setUserInfo] = useState({
    account: "",
    employeeId: "",
    nationalId: "",
    name: "",
    email: "",
    phone: "",
    type: "",
    status: "",
    site: "",
    jobRank: "",
    trainerRank: "",
    trainTheTrainerCert: "",
    professionalLevel: "",
    professionalIndex: 0,
    note: "",
    educatorContributionType: "",
    trainingCompetencyIndex: 0,
    trainerSkills: [{ skillName: "", level: "", note: "" }],
  });

  const navigate = useNavigate();
  const role = useSelector((state) => state.role.role.role);
  const accessToken = useSelector((state) => state.users.users.userName.token);

  const toggleDropdown = (section) => {
    setDropdownState((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field, value) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...userInfo.trainerSkills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setUserInfo((prev) => ({ ...prev, trainerSkills: newSkills }));
  };

  const handleAddSkill = () => {
    const newSkill = { skillName: "", level: "", note: "" };
    setUserInfo((prev) => ({
      ...prev,
      trainerSkills: [...prev.trainerSkills, newSkill],
    }));
  };

  const handleSaveClick = async () => {
    const formattedData = {
      ...userInfo,
      professionalIndex: parseFloat(userInfo.professionalIndex),
      trainingCompetencyIndex: parseFloat(userInfo.trainingCompetencyIndex),
      trainerSkills: userInfo.trainerSkills.map((skill) => ({
        skillName: skill.skillName,
        note: skill.note,
        level: skill.level,
      })),
    };

    console.log("Saving trainer info:", formattedData);

    try {
      const result = await addNewTrainer(formattedData, accessToken);
      console.log("Trainer profile saved successfully", result);
      message.success("Trainer profile added successfully!");
      navigate(`/${role}/trainer-management`);
    } catch (error) {
      console.error("Error saving trainer profile:", error);
      message.error("Failed to add new trainer!");
    }
  };

  const handleCancelClick = () => {
    console.log("Canceled");
  };

  const handleBackClick = () => {
    navigate(`/${role}/trainer-management`);
    console.log("Back to Trainers List");
  };

  const renderInputField = (field, type = "text") => (
    <input
      type={type}
      name={field}
      value={userInfo[field]}
      onChange={handleChange}
      className="border border-gray-400 p-1 w-full h-10 text-sm rounded-lg"
    />
  );

  const renderSelectField = (field, options) => (
    <Select
      value={userInfo[field]}
      onChange={(value) => handleSelectChange(field, value)}
      className="w-full text-sm"
    >
      {options.map((option) => (
        <Option key={option} value={option}>
          {option}
        </Option>
      ))}
    </Select>
  );

  const renderRow = (fields) => (
    <tr>
      {fields.map(({ label, field, type = "text", options }) => (
        <React.Fragment key={field}>
          <td className="border px-4 py-3 bg-stone-200 border-gray-300 font-semibold text-sm">
            {label}
          </td>
          <td className="border px-4 py-3 border-gray-300 text-sm">
            {options
              ? renderSelectField(field, options)
              : renderInputField(field, type)}
          </td>
        </React.Fragment>
      ))}
    </tr>
  );

  const renderSkillRow = (skill, index) => (
    <tr key={index}>
      <td className="border px-4 py-3 border-gray-300 text-sm">
        <Select
          value={skill.skillName}
          onChange={(value) => handleSkillChange(index, "skillName", value)}
          className="w-full text-sm"
          placeholder="Select skill"
        >
          <Option value="JAVA">JAVA</Option>
          <Option value="React">React</Option>
          <Option value="DOT NET">DOT NET</Option>
          <Option value="C#">C#</Option>
        </Select>
      </td>
      <td className="border px-4 py-3 border-gray-300 text-sm">
        <Select
          value={skill.level}
          onChange={(value) => handleSkillChange(index, "level", value)}
          className="w-full text-sm"
          placeholder="Select level"
        >
          <Option value="STANDARD">STANDARD</Option>
        </Select>
      </td>
      <td className="border px-4 py-3 border-gray-300 text-sm">
        <input
          type="text"
          value={skill.note}
          onChange={(e) => handleSkillChange(index, "note", e.target.value)}
          className="border border-gray-400 p-1 w-full h-10 text-sm rounded-lg"
          placeholder="Enter note"
        />
      </td>
    </tr>
  );

  return (
    <div className="flex flex-col m-5">
      {/* Title */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-4xl font-bold text-gray-800 flex-1 mt-9 mb-2 md:mb-0">
          Add Trainer Profile
        </h2>
      </div>
      {/* General Info Section */}
      <div className="h-full">
        <Button
          onClick={() => toggleDropdown("generalInfo")}
          className="w-full h-10 font-bold flex justify-between bg-gray-200 text-sm"
        >
          General Info
          {dropdownState.generalInfo ? <UpOutlined /> : <DownOutlined />}
        </Button>

        {dropdownState.generalInfo && (
          <div className="overflow-x-auto m-5">
            <table className="min-w-full table-auto border-collapse border border-stone-200 text-left">
              <tbody>
                {renderRow([
                  { label: "Full Name", field: "name" },
                  { label: "Account", field: "account" },
                  { label: "Contact Email", field: "email", type: "email" },
                ])}
                {renderRow([
                  { label: "Phone", field: "phone" },
                  { label: "Employee ID", field: "employeeId" },
                  { label: "National ID", field: "nationalId" },
                ])}
                {renderRow([
                  { label: "Site", field: "site" },
                  {
                    label: "Trainer Type",
                    field: "type",
                    options: ["EXTERNAL", "INTERNAL", "STAFF"],
                  },
                  {
                    label: "Contribution Type",
                    field: "educatorContributionType",
                    options: ["TRAINER", "MENTOR", "AUDITOR"],
                  },
                ])}
                {renderRow([
                  { label: "Trainer Rank", field: "trainerRank" },
                  {
                    label: "Professional Level",
                    field: "professionalLevel",
                    options: ["ADVANCE", "EXPERT", "STANDARD"],
                  },
                  {
                    label: "Train The Trainer Certificate",
                    field: "trainTheTrainerCert",
                    options: ["ADVANCE", "BASIC", "NONE"],
                  },
                ])}
                {renderRow([
                  { label: "Job Rank", field: "jobRank" },
                  {
                    label: "Professional Index",
                    field: "professionalIndex",
                  },
                  {
                    label: "Training Competency Index",
                    field: "trainingCompetencyIndex",
                  },
                ])}
                {renderRow([
                  {
                    label: "Status",
                    field: "status",
                    options: ["AVAILABLE", "BUSY", "OUT", "ONSITE"],
                  },
                  { label: "Note", field: "note" },
                ])}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="h-full">
        <Button
          onClick={() => toggleDropdown("skills")}
          className="w-full h-10 font-bold flex justify-between bg-gray-200 text-sm"
        >
          Skills
          {dropdownState.skills ? <UpOutlined /> : <DownOutlined />}
        </Button>

        {dropdownState.skills && (
          <div className="overflow-x-auto m-5">
            <table className="min-w-full table-auto border-collapse border border-stone-200 text-left">
              <thead>
                <tr>
                  <th className="border px-4 py-3 bg-stone-200 border-gray-300 font-semibold text-sm">
                    Skill Name
                  </th>
                  <th className="border px-4 py-3 bg-stone-200 border-gray-300 font-semibold text-sm">
                    Level
                  </th>
                  <th className="border px-4 py-3 bg-stone-200 border-gray-300 font-semibold text-sm">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody>
                {userInfo.trainerSkills.map((skill, index) =>
                  renderSkillRow(skill, index)
                )}
              </tbody>
            </table>

            <div className="flex justify-end">
              <button
                onClick={handleAddSkill}
                className="bg-blue-500 text-white px-3 py-2 mt-2 rounded"
              >
                Add Skill
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Save/Cancel/Back Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          onClick={handleBackClick}
          className="rounded-full bg-white border border-gray-300 text-black py-2 px-4"
        >
          Back to Trainers List
        </Button>
        <div className="flex space-x-4">
          <Button
            onClick={handleCancelClick}
            className="rounded-full bg-red-500 text-white py-2 px-4"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveClick}
            className="rounded-full bg-blue-500 text-white py-2 px-4"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddTrainerProfile;
