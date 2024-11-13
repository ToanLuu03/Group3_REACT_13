import { Button, notification, Spin } from "antd";
import React, { useEffect, useState } from "react";
import {
    fetchMasterData,
    fetchTrainerInfoV2,
    uploadAvatar,
    updateTrainerInfoV2,
} from "../../../api/AdminAPI/Trainer_info_api";
import Phone_icon from "../../../assets/image/phone_icon.png";
import Email_icon from "../../../assets/image/email_icon.png";
import Address_icon from "../../../assets/image/address_icon.png";
import National_icon from "../../../assets/image/national_icon.png";
import { Link, useOutletContext } from "react-router-dom";
import ProfessionalSkills from "./ProfessionalSkills/ProfessionalSkills";
import PersonalInfo from "./PersonalInfo/PersonalInfo";
import EmployeeInfo from "./EmployeeInfo/EmployeeInfo";
import SoftSkills from "./SoftSkills/SoftSkills";
import Certificates from "./Certificates/Certificates";
import { CancelModal, SaveModal } from "./Modals/Modals";
import { PlusOutlined } from "@ant-design/icons";
function TrainerProfile() {
    const [trainerTypes, setTrainerTypes] = useState([]);
    const [contributionTypes, setContributionTypes] = useState([]);
    const [sites, setSites] = useState([]);
    const [jobRanks, setJobRanks] = useState([]);
    const [jobTitles, setJobTitles] = useState([]);
    const [professionalLevels, setProfessionalLevels] = useState([]);
    const [trainerCertifications, setTrainerCertifications] = useState([]);
    const [skillOptions, setSkillOptions] = useState([]);
    const [softSkillOptions, setSoftSkillOptions] = useState([]);
    const [levelOptions, setLevelOptions] = useState([]);
    const [generalInfo, setGeneralInfo] = useState(null);
    const [softSkills, setSoftSkills] = useState([]);
    const [professionalSkills, setProfessionalSkills] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const { collapsed } = useOutletContext();
    const [isEditing, setIsEditing] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const fetchTrainerData = async () => {
            const account = localStorage.getItem("trainerAccount");
            const token = localStorage.getItem("token");

            try {
                const data = await fetchTrainerInfoV2(account, token);
                const professionalSkills = data.skills.filter(skill => skill.type === "PROFESSIONAL");
                const softSkills = data.skills.filter(skill => skill.type === "SOFTSKILL");
                setGeneralInfo(data.generalInfo);
                setProfessionalSkills(professionalSkills);
                setSoftSkills(softSkills);
                setCertificates(data.certificate || []);
                setOriginalData({
                    generalInfo: JSON.parse(JSON.stringify(data.generalInfo)),
                    professionalSkills: JSON.parse(JSON.stringify(professionalSkills)),
                    softSkills: JSON.parse(JSON.stringify(softSkills)),
                    certificates: JSON.parse(JSON.stringify(data.certificate || [])),
                });
            } catch (error) {
                notification.error({
                    message: "Error Fetching Trainer Info",
                    description:
                        "There was an issue fetching the trainer info. Please try again later.",
                    duration: 3,
                });
            }
        };

        fetchTrainerData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            try {
                const data = await fetchMasterData(token);
                setTrainerTypes(data.trainerTypes || []);
                setContributionTypes(data.contributionTypes || []);
                setSites(data.sites || []);
                setJobRanks(data.jobRank || []);
                setJobTitles(data.jobTitle || []);
                setProfessionalLevels(data.professionalLevel || []);
                setTrainerCertifications(data.trainTheTrainerCert || []);
                setSkillOptions(data.professionalSkill || []);
                setLevelOptions(data.professionalSkillLevel || []);
                setSoftSkillOptions(data.softSkill || []);
            } catch (error) {
                notification.error({
                    message: "Error Fetching Data",
                    description:
                        "There was an issue fetching the trainer data. Please try again later.",
                    duration: 3,
                });
            }
        };

        fetchData();
    }, []);

    const handleEditClick = () => setIsEditing(true);
    const handleSaveClick = () => setShowSaveModal(true);
    const handleCancelClick = () => setShowCancelModal(true);
    const handleConfirmSave = async () => {
        const invalidSoftSkills = softSkills.some((skill) => !skill.skill || skill.skill === null);
        const invalidProfessionalSkills = professionalSkills.some((skill) => !skill.skill || skill.skill === null);
        const invalidCertificates = certificates.some((cert) => !cert.name || !cert.url || !cert.date);

        if (invalidProfessionalSkills) {
            notification.error({
                message: "Error Saving Data",
                description: "All skills must have a valid name. Please check your entries.",
                duration: 3,
            });
            setShowSaveModal(false);
            return;
        }

        if (invalidSoftSkills) {
            notification.error({
                message: "Error Saving Data",
                description: "All soft skills must have a valid name. Please check your entries.",
                duration: 3,
            });
            setShowSaveModal(false)
            return;
        }

        if (invalidCertificates) {
            notification.error({
                message: "Error Saving Data",
                description: "All certificates must have a name, a valid link and a select date. Please check your entries.",
                duration: 3,
            });
            setShowSaveModal(false);
            return;
        }

        const token = localStorage.getItem("token");
        const account = localStorage.getItem("trainerAccount");

        const updatedData = {
            fullName: generalInfo.name,
            description: generalInfo.description,
            phone: generalInfo.phone,
            email: generalInfo.email,
            imageUrl: generalInfo.avatar,
            address: generalInfo.address,
            nationalID: generalInfo.nationalId,
            account: generalInfo.account,
            employeeId: generalInfo.employeeId,
            site: generalInfo.site,
            trainerType: generalInfo.type,
            contributionType: generalInfo.educatorContributionType,
            trainerRank: generalInfo.trainerRank,
            professionalLevel: generalInfo.professionalLevel,
            trainTheTrainerCert: generalInfo.trainTheTrainerCert,
            professionalIndex: generalInfo.professionalIndex,
            trainingCompetencyIndex: generalInfo.trainingCompetencyIndex,
            jobTitle: generalInfo.jobTitle,
            jobRank: generalInfo.jobRank,
            skills: professionalSkills.map((skill) => ({
                name: skill.skill,
                level: skill.level,
            })),
            softSkills: softSkills.map((skill) => ({ name: skill.skill })),
            certificates: certificates.map((cert) => ({
                name: cert.name,
                link: cert.url,
                date: formatDate(cert.date),
            })),
        };

        setIsEditing(false);
        setShowSaveModal(false);
        try {
            await updateTrainerInfoV2(account, updatedData, token);
            setOriginalData({
                generalInfo: { ...generalInfo },
                professionalSkills: [...professionalSkills],
                softSkills: [...softSkills],
                certificates: [...certificates],
            });
            notification.success({
                message: "Trainer Info Updated",
                description: "Your trainer information has been updated successfully.",
                duration: 3,
            });
            setIsEditing(false);
            setShowSaveModal(false);
        } catch (error) {
            notification.error({
                message: "Error Updating Trainer Info",
                description: error.response
                    ? error.response.data.message
                    : "An unexpected error occurred.",
                duration: 3,
            });
        }
    };

    const handleConfirmCancel = () => {
        if (originalData) {
            setGeneralInfo(originalData.generalInfo);
            setProfessionalSkills(originalData.professionalSkills);
            setSoftSkills(originalData.softSkills);
            setCertificates(originalData.certificates);
        }
        setIsEditing(false);
        setShowCancelModal(false);
    };

    const handleAvatarChange = async (event) => {
        const token = localStorage.getItem("token");
        const file = event.target.files[0];
        if (file) {
            try {
                const response = await uploadAvatar(file, token);
                if (response.success) {
                    setGeneralInfo({ ...generalInfo, avatar: `https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/images/${response.data.name}` });
                    setTimeout(() => {
                        notification.success({
                            message: "Avatar Uploaded",
                            description: "Your avatar has been uploaded successfully.",
                            duration: 3,
                        });
                    }, 1000)
                }
            } catch (error) {
                notification.error({
                    message: "Error Uploading Avatar",
                    description: "Could not upload the new avatar. Please try again.",
                    duration: 3,
                });
            }
        }
    };

    if (!generalInfo) {
        return (
            <div className="flex justify-start items-start h-screen">
                <Spin size="large" />
            </div>
        );
    }

    const personalInfo = [
        { label: "Phone", field: "phone", value: generalInfo.phone, icon: Phone_icon },
        { label: "Email", field: "email", value: generalInfo.email, icon: Email_icon },
        { label: "Address", field: "address", value: generalInfo.address, icon: Address_icon },
        { label: "National ID", field: "nationalId", value: generalInfo.nationalId, icon: National_icon },
    ];

    const employeeInfo = [
        { label: "Account", field: "account", value: generalInfo.account },
        { label: "Employee ID", field: "employeeId", value: generalInfo.employeeId },
        { label: "Site", field: "site", value: generalInfo.site },
        { label: "Trainer Type", field: "type", value: generalInfo.type },
        { label: "Contribution Type", field: "educatorContributionType", value: generalInfo.educatorContributionType },
        { label: "Trainer Rank", field: "trainerRank", value: generalInfo.trainerRank },
        { label: "Professional Level", field: "professionalLevel", value: generalInfo.professionalLevel },
        { label: "Train The Trainer Cert", field: "trainTheTrainerCert", value: generalInfo.trainTheTrainerCert },
        { label: "Professional Index", field: "professionalIndex", value: generalInfo.professionalIndex },
        { label: "Training Competency Index", field: "trainingCompetencyIndex", value: generalInfo.trainingCompetencyIndex },
        { label: "Job Title", field: "jobTitle", value: generalInfo.jobTitle },
        { label: "Job Rank", field: "jobRank", value: generalInfo.jobRank },
    ];

    return (
        <div className="h-[calc(100vh - 300px)] m-5">
            <div className="h-full overflow-y-auto mb-10">
                <div className="flex items-start p-4 mb-6">
                    {isEditing ? (
                        <>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                                id="avatar-upload"
                            />
                            <label htmlFor="avatar-upload">
                                <div className="flex items-center mr-[14px] h-32 w-32 relative">
                                    <img
                                        src={generalInfo.avatar || "https://via.placeholder.com/100"}
                                        alt="Trainer Avatar"
                                        className="h-32 w-32 rounded-full cursor-pointer"
                                    />
                                    <span className="text-2xl font-bold cursor-pointer absolute top-0 right-0 bg-slate-50 rounded-full w-8 h-8 flex items-center justify-center">
                                        <PlusOutlined className="text-xl" />
                                    </span>

                                </div>
                            </label>
                        </>
                    ) : (
                        <label htmlFor="avatar-upload">
                            <div className="flex items-center mr-[14px] h-32 w-32">
                                <img
                                    src={generalInfo.avatar || "https://via.placeholder.com/100"}
                                    alt="Trainer Avatar"
                                    className="h-32 w-32 rounded-full mr-8"
                                />
                            </div>
                        </label>
                    )
                    }
                    <div className="flex flex-col w-full">
                        <h1 className="text-xl font-medium">
                            {isEditing ? (
                                <input
                                    type="text"
                                    defaultValue={generalInfo.name || "Full Name"}
                                    onChange={(e) =>
                                        setGeneralInfo({ ...generalInfo, name: e.target.value })
                                    }
                                    className="outline-none border-b-2"
                                />
                            ) : (
                                <div className="pb-[2px]">{generalInfo.name || "Full Name"}</div>
                            )}
                        </h1>
                        <p className="text-gray-500">
                            {generalInfo.jobTitle} - {generalInfo.jobRank}
                        </p>
                        <div className="flex-1">
                            {isEditing ? (
                                <textarea
                                    value={generalInfo.description}
                                    onChange={(e) =>
                                        setGeneralInfo({
                                            ...generalInfo,
                                            description: e.target.value,
                                        })
                                    }
                                    className="outline-none border-none w-full h-20 bg-gray-200 p-1 resize-none"
                                />
                            ) : (
                                <p className="h-20 p-1 bg-gray-200">{generalInfo.description}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex max-2xl:block gap-6 w-full">
                    <div className="flex-1">
                        <PersonalInfo
                            personalInfo={personalInfo}
                            isEditing={isEditing}
                            generalInfo={generalInfo}
                            setGeneralInfo={setGeneralInfo}
                        />
                        <EmployeeInfo
                            employeeInfo={employeeInfo}
                            isEditing={isEditing}
                            generalInfo={generalInfo}
                            setGeneralInfo={setGeneralInfo}
                            sites={sites}
                            trainerTypes={trainerTypes}
                            contributionTypes={contributionTypes}
                            jobRanks={jobRanks}
                            jobTitles={jobTitles}
                            professionalLevels={professionalLevels}
                            trainerCertifications={trainerCertifications}
                        />
                    </div>

                    <div className="flex-1">
                        <ProfessionalSkills
                            professionalSkills={professionalSkills}
                            isEditing={isEditing}
                            skillOptions={skillOptions}
                            levelOptions={levelOptions}
                            setProfessionalSkills={setProfessionalSkills}
                        />
                        <SoftSkills
                            softSkills={softSkills}
                            isEditing={isEditing}
                            softSkillOptions={softSkillOptions}
                            setSoftSkills={setSoftSkills}
                        />
                        <Certificates
                            certificates={certificates}
                            isEditing={isEditing}
                            setCertificates={setCertificates}
                        />
                    </div>
                </div>
            </div>
            <div
                className={`fixed bottom-0 left-0 ${collapsed ? "md:left-0" : "md:left-64"
                    } right-0 bg-white p-4 flex flex-col md:flex-row justify-between border-t shadow-lg gap-2`}
            >
                <Button
                    type="default"
                    className="w-full md:w-auto text-sm md:text-base order-last md:order-first"
                >
                    <Link to="/CLASS_ADMIN/trainer-list">Back to Trainers List</Link>
                </Button>

                <div className="flex gap-4 flex-col md:flex-row w-full md:w-auto justify-end">
                    {!isEditing ? (
                        <Button
                            type="primary"
                            onClick={handleEditClick}
                            className="w-full md:w-auto text-sm md:text-base"
                        >
                            Update
                        </Button>
                    ) : (
                        <>
                            <Button
                                type="primary"
                                onClick={handleSaveClick}
                                className="w-full md:w-auto text-sm md:text-base"
                            >
                                Save changes
                            </Button>
                            <Button
                                onClick={handleCancelClick}
                                className="max-md:mb-2 w-full md:w-auto text-sm md:text-base"
                            >
                                Cancel
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <SaveModal
                showSaveModal={showSaveModal}
                handleConfirmSave={handleConfirmSave}
                setShowSaveModal={setShowSaveModal}
            />

            <CancelModal
                showCancelModal={showCancelModal}
                handleConfirmCancel={handleConfirmCancel}
                setShowCancelModal={setShowCancelModal}
            />
        </div>
    );
}

export default TrainerProfile;