import React, { useState } from "react";
import { Select, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DeleteModal } from "../Modals/Modals";
import { FaTrashCan } from "react-icons/fa6";

const ProfessionalSkills = ({ professionalSkills, isEditing, skillOptions, levelOptions, setProfessionalSkills }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState(null);

    const handleRemoveSkill = (index) => {
        setSkillToDelete(index);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        const updatedSkills = [...professionalSkills];
        updatedSkills.splice(skillToDelete, 1);
        setProfessionalSkills(updatedSkills);
        setShowDeleteModal(false);
    };

    const handleAddNewSkill = () => {
        setProfessionalSkills([...professionalSkills, { skill: "", level: "" }]);
    };

    const handleSkillChange = (index, value) => {
        const updatedSkills = [...professionalSkills];
        updatedSkills[index].skill = value;
        setProfessionalSkills(updatedSkills);
    };
    return (
        <div className="p-4">
            <h2 className="font-medium uppercase text-lg text-center rounded-full border py-2 bg-gray-300 mb-4">
                Professional Skills
            </h2>
            {professionalSkills.map((skill, index) => (
                <div key={index} className="flex items-center mb-2 gap-3">
                    <span className="w-4 mr-2 h-4 bg-black rounded-full"></span>
                    <div className="w-[200px] max-2xl:w-[120px] max-xl:w-[40%] max-lg:w-[25%] px-1">
                        {isEditing ? (
                            <div className="mt-[10px]">
                                <Select
                                    placeholder="Skill"
                                    value={skill.skill}
                                    onChange={(value) => handleSkillChange(index, value)}
                                    className="w-full text-center"
                                >
                                    {skillOptions.map((option, idx) => {
                                        const isDisabled = professionalSkills.some(
                                            (existingSkill, skillIndex) => existingSkill.skill === option && skillIndex !== index
                                        );
                                        return (
                                            <Select.Option key={idx} value={option} disabled={isDisabled} title={isDisabled ? 'This skill is already selected' : ''}>
                                                {option}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        ) : (
                            <p>{skill.skill || "Not Available"}</p>
                        )}
                    </div>
                    <div className="w-[230px] max-2xl:w-[180px] ml-auto max-xl:w-[40%] max-lg:w-[40%] px-1 xl:mx-auto">
                        {isEditing ? (
                            <div className="mt-[10px]">
                                <Select
                                    placeholder="Level"
                                    value={skill.level}
                                    onChange={(value) => {
                                        const updatedSkills = [...professionalSkills];
                                        updatedSkills[index].level = value;
                                        setProfessionalSkills(updatedSkills);
                                    }}
                                    className="w-full text-center italic"
                                >
                                    {levelOptions.map((option, idx) => (
                                        <Select.Option key={idx} value={option}>
                                            {option}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>
                        ) : (
                            <p>{skill.level || "Not Available"}</p>
                        )}
                    </div>
                    <div className="ml-auto">
                        {isEditing && (
                            <Button
                                type="danger"
                                className="text-red-500 font-medium"
                                onClick={() => handleRemoveSkill(index)}
                            >
                                <FaTrashCan />
                            </Button>
                        )}
                    </div>
                </div>
            ))}
            {isEditing && (
                <Button
                    type="dashed"
                    onClick={handleAddNewSkill}
                    className="w-[92%] mt-4 justify-self-center flex items-center"
                >
                    <PlusOutlined /> Add New Skill
                </Button>
            )}
            <DeleteModal
                showDeleteModal={showDeleteModal}
                handleConfirmDelete={handleConfirmDelete}
                setShowDeleteModal={setShowDeleteModal}
            />
        </div>
    );
};

export default ProfessionalSkills;
