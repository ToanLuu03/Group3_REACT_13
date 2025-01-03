import React, { useRef } from "react";
import { MdOutlineModeEdit } from "react-icons/md";

const PersonalInfo = ({ personalInfo, isEditing, generalInfo, setGeneralInfo }) => {
    const inputRefs = useRef([]);
    return (
        <div className="p-4">
            <h2 className="font-medium uppercase text-center text-lg rounded-full border py-2 bg-gray-300 mb-4">
                Personal Information
            </h2>
            {personalInfo.map((item, index) => (
                <p key={index} className="flex items-center gap-5 py-3">
                    <span>
                        <img
                            src={item.icon}
                            className="h-[18px] w-5"
                            alt={`${item.label} Icon`}
                        />
                    </span>
                    <div className="flex w-full">
                        <div className="font-semibold w-40 px-1">{item.label}:</div>
                        {isEditing ? (
                            <div className="flex-1 flex items-end">
                                <input
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    value={generalInfo[item.field] || ""}
                                    onChange={(e) =>
                                        setGeneralInfo({
                                            ...generalInfo,
                                            [item.field]: e.target.value,
                                        })
                                    }
                                    className="outline-none border-b-2 w-full"
                                />
                                <span className="ml-2 text-gray-400 cursor-pointer text-xl"
                                    onClick={() => inputRefs.current[index]?.focus()}
                                >
                                    <MdOutlineModeEdit />
                                </span>
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

export default PersonalInfo;
