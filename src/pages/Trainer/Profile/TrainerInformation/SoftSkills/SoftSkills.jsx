import React, { useState } from "react";
import { Select, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DeleteModal } from "../Modals/Modals";
import { FaTrashCan } from "react-icons/fa6";

const SoftSkills = ({ softSkills, isEditing, softSkillOptions, setSoftSkills }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState(null);

    const handleRemoveSoftSkill = (index) => {
        setSkillToDelete(index);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        const updatedSkills = [...softSkills];
        updatedSkills.splice(skillToDelete, 1);
        setSoftSkills(updatedSkills);
        setShowDeleteModal(false);
    };

    const handleAddSoftSkill = () => {
        setSoftSkills([...softSkills, { skill: "" }]);
    };
    return (
        <div className="p-4">
            <h2 className="font-medium uppercase text-lg text-center rounded-full border py-2 bg-gray-300">
                Soft Skills
            </h2>
            {softSkills.map((skill, index) => (
                <div key={index} className="flex items-center mt-[10px] gap-5 w-full">
                    <span className={`w-4 ${isEditing ? "w-[19px]" : ""} h-4 bg-black rounded-full`}></span>
                    {isEditing ? (
                        <Select
                            value={skill.skill || undefined}
                            placeholder="Skill"
                            onChange={(value) => {
                                const updatedSkills = [...softSkills];
                                updatedSkills[index].skill = value;
                                setSoftSkills(updatedSkills);
                            }}
                            className="w-full text-center mt-[10px]"
                        >
                            {softSkillOptions.map((option, idx) => {
                                const isDisabled = softSkills.some(s => s.skill === option);
                                return (
                                    <Select.Option
                                        key={idx}
                                        value={option}
                                        disabled={isDisabled}
                                        title={isDisabled ? 'This soft skill is already selected' : ''}
                                    >
                                        {option}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    ) : (
                        <p className="text-gray-700">{skill.skill}</p>
                    )}
                    {isEditing && (
                        <Button
                            type="danger"
                            className="text-red-500 font-medium"
                            onClick={() => handleRemoveSoftSkill(index)}
                        >
                            <FaTrashCan />
                        </Button>
                    )}
                </div>
            ))}
            {isEditing && (
                <Button
                    type="dashed"
                    onClick={handleAddSoftSkill}
                    className="w-[92%] mt-4 justify-self-center flex items-center"
                >
                    <PlusOutlined /> Add New Soft Skill
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

export default SoftSkills;
