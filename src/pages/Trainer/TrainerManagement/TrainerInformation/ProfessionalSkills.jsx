import React, { useState, useEffect } from "react";
import { Button, Select, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import TrainerAPI from "../../../../services/trainer";
import { useDispatch, useSelector } from "react-redux";
import { toggleFetchFlag } from "../../../../features/trainerInfo/trainerSlice"; // To trigger refetching data

const { Option } = Select;

// Skill and level options
const skillOptions = ["React", "JAVA", "C#", "DOT NET"];
const levelOptions = [
  "INTERMEDIATE",
  "LIMITED_EXPERIENCE",
  "FUNDAMENTAL_AWARENESS",
  "ADVANCED",
  "EXPERT",
];

const ProfessionalSkills = () => {
  const [skills, setSkills] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const trainerData = useSelector((state) => state.trainer.trainerInfo);
  const username = useSelector((state) => state.users.users.userName.username);
  const token = useSelector((state) => state.users.users.userName.token);
  const [originalSkills, setOriginalSkills] = useState([]);
  const [cancleFlag, setCancleFlag] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (trainerData && trainerData.trainerInfo) {
      const fetchedSkills = (trainerData.trainerInfo.skills || []).map(
        (skill) => ({
          skillName: skill.skill, // Map from API 'skill' to local 'skillName'
          level: skill.level || "",
          note: skill.note || "",
        })
      );
      setSkills(fetchedSkills);
    }
  }, [trainerData, cancleFlag]);

  const handleEditClick = () => {
    setIsEditing(true);
    setOriginalSkills(skills);
  };

  const handleSaveClick = async () => {
    try {
      const updatedTrainerInfo = {
        ...trainerData.trainerInfo.generalInfo,
        trainerSkills: skills.map((skill) => ({
          skillName: skill.skillName || "",
          level: skill.level || "",
          note: skill.note || "",
        })),
      };

      const response = await TrainerAPI.updateTrainerInfo(
        token,
        username,
        updatedTrainerInfo
      );
      if (response && response.success) {
        message.success("Skills updated successfully!");
        dispatch(toggleFetchFlag()); // Trigger a refetch
      } else {
        message.error("Failed to update skills.");
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update skills:", error);
      message.error("Error occurred while saving skills.");
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setSkills(originalSkills);
    setCancleFlag(!cancleFlag);
  };

  const handleAddSkill = () => {
    setSkills([...skills, { skillName: "", level: "", note: "" }]);
  };

  const handleDelete = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleChange = (value, index, field) => {
    setSkills(
      skills.map((skill, i) =>
        i === index ? { ...skill, [field]: value } : skill
      )
    );
  };

  const renderSkillField = (skill, index, field) =>
    isEditing ? (
      <Select
        value={skill}
        onChange={(value) => handleChange(value, index, field)}
        className="w-full text-sm"
      >
        {skillOptions.map((option) => (
          <Option key={option} value={option}>
            {option}
          </Option>
        ))}
      </Select>
    ) : (
      skill
    );

  const renderLevelField = (level, index, field) =>
    isEditing ? (
      <Select
        value={level}
        onChange={(value) => handleChange(value, index, field)}
        className="w-full text-sm"
      >
        {levelOptions.map((option) => (
          <Option key={option} value={option}>
            {option}
          </Option>
        ))}
      </Select>
    ) : (
      level
    );

  const renderInputField = (value, index, field) =>
    isEditing ? (
      <input
        value={value}
        onChange={(e) => handleChange(e.target.value, index, field)}
        className="border border-gray-400 p-1 w-full h-10 text-sm rounded-lg"
      />
    ) : (
      value
    );

  const renderSkillRow = (skill, index) => (
    <tr key={index}>
      <td className="border px-4 py-2 text-sm">{index + 1}</td>
      <td className="border px-4 py-2 text-sm">
        {renderSkillField(skill.skillName, index, "skillName")}
      </td>
      <td className="border px-4 py-2 text-sm">
        {renderLevelField(skill.level, index, "level")}
      </td>
      <td className="border px-4 py-2 text-sm">
        {renderInputField(skill.note, index, "note")}
      </td>
      {isEditing && (
        <td className="border px-4 py-2 text-center">
          <Button
            className="text-red-500 border-0"
            onClick={() => handleDelete(index)}
            icon={<DeleteOutlined />}
          />
        </td>
      )}
    </tr>
  );

  const renderSkillCard = (skill, index) => (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4" key={index}>
      <div className="flex justify-between mb-2">
        <span className="font-semibold">No:</span>
        <span>{index + 1}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="font-semibold">Skill:</span>
        {renderSkillField(skill.skillName, index, "skillName")}
      </div>
      <div className="flex justify-between mb-2">
        <span className="font-semibold">Level:</span>
        {renderLevelField(skill.level, index, "level")}
      </div>
      <div className="flex justify-between mb-2">
        <span className="font-semibold">Note:</span>
        {renderInputField(skill.note, index, "note")}
      </div>
      {isEditing && (
        <Button
          className="text-red-500 border-0 text-lg p-0"
          onClick={() => handleDelete(index)}
          icon={<DeleteOutlined />}
        />
      )}
    </div>
  );

  return (
    <div className="m-5">
      {/* Table for large screens */}
      <div className="hidden md:block">
        <table className="min-w-full table-auto border-collapse border border-stone-200 text-left">
          <thead>
            <tr>
              <th className="border px-4 py-2 bg-stone-200 text-sm">No</th>
              <th className="border px-4 py-2 bg-stone-200 text-sm">Skill</th>
              <th className="border px-4 py-2 bg-stone-200 text-sm">Level</th>
              <th className="border px-4 py-2 bg-stone-200 text-sm">Note</th>
              {isEditing && (
                <th className="border px-4 py-2 bg-stone-200 text-sm">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {skills.map((skill, index) => renderSkillRow(skill, index))}
          </tbody>
        </table>
      </div>

      {/* Card layout for small screens */}
      <div className="md:hidden">
        {skills.map((skill, index) => renderSkillCard(skill, index))}
      </div>

      <div className="flex justify-end mt-4">
        {isEditing ? (
          <>
            <Button
              onClick={handleAddSkill}
              className="border-dashed border-black border-1 py-2 px-4 text-sm"
            >
              Add Skill
            </Button>
            <Button
              onClick={handleCancelClick}
              className="rounded-full bg-white text-red-500 py-2 px-4 text-sm border border-red-500 mx-3"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveClick}
              className="rounded-full bg-blue-500 text-white py-2 px-4 text-sm"
            >
              Save
            </Button>
          </>
        ) : (
          <Button
            onClick={handleEditClick}
            className="rounded-full bg-blue-500 text-white py-2 px-4 text-sm"
          >
            Edit Skills
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfessionalSkills;
