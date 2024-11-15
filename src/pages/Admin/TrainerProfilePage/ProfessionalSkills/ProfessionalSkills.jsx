import React from "react";
import { Select, Button } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const ProfessionalSkills = ({ professionalSkills, isEditing, skillOptions, levelOptions, setProfessionalSkills }) => {
    const handleRemoveSkill = (index) => {
        const updatedSkills = [...professionalSkills];
        updatedSkills.splice(index, 1);
        setProfessionalSkills(updatedSkills);
    };

    const handleAddNewSkill = () => {
        setProfessionalSkills([...professionalSkills, { skill: "", level: "" }]);
    };

    return (
        <div className="p-4">
            <h2 className="font-medium uppercase text-lg text-center rounded-full border py-2 bg-gray-300 mb-4">
                Professional Skills
            </h2>
            {professionalSkills.map((skill, index) => (
                <div key={index} className="flex items-center mb-2 gap-3">
                    <span className="w-4 max-xl:w-[34px] mr-2 h-4 bg-black rounded-full"></span>
                    <div className="w-[200px] max-2xl:w-[120px] max-xl:w-full px-1">
                        {isEditing ? (
                            <div className="mt-[10px]">
                                <Select
                                    placeholder="Skill"
                                    value={skill.skill}
                                    onChange={(value) => {
                                        const updatedSkills = [...professionalSkills];
                                        updatedSkills[index].skill = value;
                                        setProfessionalSkills(updatedSkills);
                                    }}
                                    className="w-full text-center"
                                >
                                    {skillOptions.map((option, idx) => (
                                        <Select.Option key={idx} value={option}>
                                            {option}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>
                        ) : (
                            <p>{skill.skill || "Not Available"}</p>
                        )}
                    </div>
                    <div className="w-[230px] max-2xl:w-[180px] max-xl:w-full px-1 xl:mx-auto">
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
                    {isEditing && (
                        <Button
                            type="danger"
                            className="text-red-500 font-medium"
                            onClick={() => handleRemoveSkill(index)}
                        >
                            <DeleteOutlined />
                        </Button>
                    )}
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
        </div>
    );
};

export default ProfessionalSkills;
