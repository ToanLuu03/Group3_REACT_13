import React from "react";
import { Select } from "antd";

const EmployeeInfo = ({
    employeeInfo,
    isEditing,
    generalInfo,
    setGeneralInfo,
    sites,
    trainerTypes,
    contributionTypes,
    jobRanks,
    jobTitles,
    professionalLevels,
    trainerCertifications,
}) => {
    return (
        <div className=" p-4">
            <h2 className="font-medium uppercase text-lg text-center rounded-full border py-2 bg-gray-300 mb-4">
                Employee Information
            </h2>
            {employeeInfo.map((item, index) => (
                <p key={index} className="flex items-center py-3">
                    <div className="flex w-full">
                        <div className="font-semibold w-[198px] px-1">
                            {item.label}:
                        </div>
                        {item.label === "Account" ? (
                            <div>{item.value || "Not Available"}</div>
                        ) : isEditing && ["Site", "Trainer Type", "Contribution Type", "Trainer Rank", "Professional Level", "Train The Trainer Cert", "Job Title", "Job Rank"].includes(item.label) ? (
                            <div className="flex-1">
                                <Select
                                    value={generalInfo[item.field]}
                                    onChange={(value) =>
                                        setGeneralInfo({
                                            ...generalInfo,
                                            [item.field]: value,
                                        })
                                    }
                                    className="w-full"
                                >
                                    {(item.label === "Site" ? sites :
                                        item.label === "Trainer Type" ? trainerTypes :
                                            item.label === "Contribution Type" ? contributionTypes :
                                                item.label === "Job Rank" ? jobRanks :
                                                    item.label === "Job Title" ? jobTitles :
                                                        item.label === "Professional Level" ? professionalLevels :
                                                            trainerCertifications
                                    ).map((option, idx) => (
                                        <Select.Option key={idx} value={option}>
                                            {option}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>
                        ) : isEditing ? (
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={generalInfo[item.field]}
                                    onChange={(e) =>
                                        setGeneralInfo({
                                            ...generalInfo,
                                            [item.field]: e.target.value,
                                        })
                                    }
                                    className="outline-none border-b-2 w-full"
                                />
                            </div>
                        ) : (
                            <div>{item.value || "Not Available"}</div>
                        )}
                    </div>
                </p>
            ))}
        </div>
    );
};

export default EmployeeInfo;
