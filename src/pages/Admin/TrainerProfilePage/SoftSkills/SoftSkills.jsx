import React from "react";
import { Select, Button } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const SoftSkills = ({ softSkills, isEditing, softSkillOptions, setSoftSkills }) => {
    const handleRemoveSoftSkill = (index) => {
        const updatedSkills = [...softSkills];
        updatedSkills.splice(index, 1);
        setSoftSkills(updatedSkills);
    };
    const handleAddSoftSkill = () => {
        setSoftSkills([...softSkills, ""]);
    };
    return (
        <div className="p-4">
            <h2 className="font-medium uppercase text-lg text-center rounded-full border py-2 bg-gray-300">
                Soft Skills
            </h2>
            {softSkills.map((skill, index) => (
                <div key={index} className="flex items-center mt-[10px] gap-5">
                    <span className="w-4 h-4 bg-black rounded-full"></span>
                    {isEditing ? (
                        <Select
                            value={skill.skill || undefined}
                            placeholder="Skill"
                            onChange={(value) => {
                                const updatedSkills = [...softSkills];
                                updatedSkills[index] = value;
                                setSoftSkills(updatedSkills);
                            }}
                            className="w-full text-center mt-[10px]"
                        >
                            {softSkillOptions.map((option, idx) => (
                                <Select.Option key={idx} value={option}>
                                    {option}
                                </Select.Option>
                            ))}
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
                            <DeleteOutlined />
                        </Button>
                    )}
                </div>
            ))}
            {isEditing && (
                <Button
                    type="dashed"
                    onClick={handleAddSoftSkill}
                    className="w-full mt-4 flex items-center justify-center"
                >
                    <PlusOutlined /> Add New Soft Skill
                </Button>
            )}
        </div>
    );
};

export default SoftSkills;
