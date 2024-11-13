import React, { useState, useEffect } from "react";
import { MdOutlineModeEdit } from "react-icons/md";
import { FaTrashCan } from "react-icons/fa6";
const EditTrainerProfile = ({ onSaveChanges, trainerData, onCancelEdit }) => {
  // Initialize states with existing trainer data
  const [personalInfo, setPersonalInfo] = useState({
    fullName: trainerData.generalInfo?.name || "",
    phone: trainerData.generalInfo?.phone || "",
    email: trainerData.generalInfo?.email || "",
    address: trainerData.generalInfo?.address || "",
    nationalId: trainerData.generalInfo?.nationalId || "",
    description: trainerData.generalInfo?.description || "",
    imageUrl: trainerData.generalInfo?.avatar || "",
  });

  const [employeeInfo, setEmployeeInfo] = useState({
    account: trainerData.generalInfo?.account || "",
    employeeId: trainerData.generalInfo?.employeeId || "",
    site: trainerData.generalInfo?.site || "",
    trainerType: trainerData.generalInfo?.type || "",
    contributionType: trainerData.generalInfo?.educatorContributionType || "",
    trainerRank: trainerData.generalInfo?.trainerRank || "",
    professionalLevel: trainerData.generalInfo?.professionalLevel || "",
    trainTheTrainerCert: trainerData.generalInfo?.trainTheTrainerCert || "",
    professionalIndex: trainerData.generalInfo?.professionalIndex || "",
    trainingCompetencyIndex: trainerData.generalInfo?.trainingCompetencyIndex || "",
    jobTitle: trainerData.generalInfo?.jobTitle || "",
    jobRank: trainerData.generalInfo?.jobRank || "",
  });

  const [professionalSkills, setProfessionalSkills] = useState(
    trainerData.skills?.filter(skill => skill.type === "PROFESSIONAL") || []
  );

  const [softSkills, setSoftSkills] = useState(
    trainerData.skills?.filter(skill => skill.type === "SOFTSKILL").map(skill => ({ name: skill.skill })) || []
  );

  const [certificates, setCertificates] = useState(
    trainerData.certificate || []
  );

  // Handler functions
  const handleInputChange = (e, section, key) => {
    if (section === "personal") {
      setPersonalInfo({ ...personalInfo, [key]: e.target.value });
    } else if (section === "employee") {
      setEmployeeInfo({ ...employeeInfo, [key]: e.target.value });
    }
  };

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...professionalSkills];
    newSkills[index][field] = value;
    setProfessionalSkills(newSkills);
  };

  const removeSkill = (index) => {
    const newSkills = [...professionalSkills];
    newSkills.splice(index, 1);
    setProfessionalSkills(newSkills);
  };

  const handleSoftSkillChange = (index, value) => {
    const newSkills = [...softSkills];
    newSkills[index] = value;
    setSoftSkills(newSkills);
  };



  const removeSoftSkill = (index) => {
    const newSkills = [...softSkills];
    newSkills.splice(index, 1);
    setSoftSkills(newSkills);
  };

  const handleCertificateChange = (index, field, value) => {
    const newCertificates = [...certificates];
    if (field === "date") {
        // Ensure the date is in the correct format
        newCertificates[index][field] = new Date(value).toISOString().split('T')[0];
    } else {
        newCertificates[index][field] = value;
    }
    setCertificates(newCertificates);
};



  const removeCertificate = (index) => {
    const newCertificates = [...certificates];
    newCertificates.splice(index, 1);
    setCertificates(newCertificates);
  };
  const handleSave = () => {
    const updatedData = {
      fullName: personalInfo.fullName,
      description: personalInfo.description,
      phone: personalInfo.phone,
      email: personalInfo.email,
      imageUrl: personalInfo.imageUrl,
      address: personalInfo.address,
      nationalID: personalInfo.nationalId,
      account: employeeInfo.account,
      employeeId: employeeInfo.employeeId,
      site: employeeInfo.site,
      trainerType: employeeInfo.trainerType,
      contributionType: employeeInfo.contributionType,
      trainerRank: employeeInfo.trainerRank,
      professionalLevel: employeeInfo.professionalLevel,
      trainTheTrainerCert: employeeInfo.trainTheTrainerCert,
      professionalIndex: employeeInfo.professionalIndex,
      trainingCompetencyIndex: employeeInfo.trainingCompetencyIndex,
      jobTitle: employeeInfo.jobTitle,
      jobRank: employeeInfo.jobRank,
      skills: professionalSkills.map(skill => ({ name: skill.skill, level: skill.level })),
      softSkills: softSkills,
      certificates: certificates,
    };
    onSaveChanges(updatedData);
  };
  const handleCancel = () => {
    onCancelEdit();
  };

  return (
    <div className="mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center mb-8">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-gray-400 text-4xl">📷</span>
        </div>
        <div className="ml-0 md:ml-6 flex-1 mt-4 md:mt-0">
          <input
            type="text"
            placeholder="Full Name"
            className="text-2xl font-bold w-full bg-transparent border-b border-gray-300"
            value={personalInfo.fullName}
            onChange={(e) => handleInputChange(e, "personal", "fullName")}
          />
        </div>
      </div>

      {/* Information Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Personal Information */}
          <div className="p-4 rounded-lg">
            <h2 className="font-bold rounded-full bg-[#D9D9D9] flex justify-center p-2 text-gray-700">
              PERSONAL INFORMATION
            </h2>
            <div className="mt-4 space-y-3">
              {Object.keys(personalInfo).map((key) => (
                <div key={key} className="flex items-center justify-between">
                  <input
                    type="text"
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    className="w-full bg-transparent border-b border-gray-300"
                    value={personalInfo[key]}
                    onChange={(e) => handleInputChange(e, "personal", key)}
                  />
                  <span className="ml-2 text-gray-400 cursor-pointer text-xl">
                    <MdOutlineModeEdit />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Employee Information */}
          <div className="p-4 rounded-lg">
            <h2 className="font-bold rounded-full bg-[#D9D9D9] flex justify-center p-2 text-gray-700">
              EMPLOYEE INFORMATION
            </h2>
            <div className="mt-4 space-y-3">
              {Object.keys(employeeInfo).map((key) => (
                <div key={key} className="flex items-center justify-between">
                  <input
                    type="text"
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    className="w-full bg-transparent border-b border-gray-300"
                    value={employeeInfo[key]}
                    onChange={(e) => handleInputChange(e, "employee", key)}
                  />
                  <span className="ml-2 text-gray-400 cursor-pointer text-xl">
                    <MdOutlineModeEdit />
                  </span>
                </div>
              ))}
            </div>
          </div>

         
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Professional Skills */}
          <div className="p-4 rounded-lg">
            <h2 className="font-bold rounded-full bg-[#D9D9D9] flex justify-center p-2 text-gray-700">
              PROFESSIONAL SKILLS
            </h2>
            {professionalSkills.map((skill, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center justify-between mt-2"
              >
                <input
                  type="text"
                  placeholder="Skill"
                  value={skill.skill}
                  onChange={(e) => handleSkillChange(index, "skill", e.target.value)}
                  className="w-full bg-transparent border-b border-gray-300 mr-2"
                />
                <input
                  type="text"
                  placeholder="Level"
                  value={skill.level}
                  onChange={(e) => handleSkillChange(index, "level", e.target.value)}
                  className="w-full bg-transparent border-b border-gray-300 mr-2"
                />
                <button onClick={() => removeSkill(index)} className="text-lg">
                  <FaTrashCan />
                </button>
              </div>
            ))}
          </div>

          {/* Soft Skills */}
          <div className="p-4 rounded-lg">
            <h2 className="font-bold rounded-full bg-[#D9D9D9] flex justify-center p-2 text-gray-700">
              SOFT SKILLS
            </h2>
            {softSkills.map((skill, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center justify-between mt-2"
              >
                <input
                  type="text"
                  placeholder="Skill"
                  value={skill.name}
                  onChange={(e) => handleSoftSkillChange(index, e.target.value)}
                  className="w-full bg-transparent border-b border-gray-300 mr-2"
                />
                <button onClick={() => removeSoftSkill(index)} className="text-lg">
                  <FaTrashCan />
                </button>
              </div>
            ))}
          </div>

          {/* Certificates */}
          <div className="p-4 rounded-lg">
            <h2 className="font-bold rounded-full bg-[#D9D9D9] flex justify-center p-2 text-gray-700">
              CERTIFICATES
            </h2>
            {certificates.map((cert, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center justify-between mt-2"
              >
                <input
                  type="text"
                  placeholder="Name"
                  value={cert.name}
                  onChange={(e) => handleCertificateChange(index, "name", e.target.value)}
                  className="w-full bg-transparent border-b border-gray-300 mr-2"
                />
                <input
                  type="text"
                  placeholder="Link"
                  value={cert.url}
                  onChange={(e) => handleCertificateChange(index, "link", e.target.value)}
                  className="w-full bg-transparent border-b border-gray-300 mr-2"
                />
                <input
                  type="date"
                  value={cert.date}
                  onChange={(e) => handleCertificateChange(index, "date", e.target.value)}
                  className="w-full bg-transparent border-b border-gray-300 mr-2"
                />
                <button onClick={() => removeCertificate(index)} className="text-lg">
                  <FaTrashCan />
                </button>
              </div>
            ))}
          </div>
        </div>
         {/* Back and Save Buttons */}
         <div className="flex justify-between mt-4">
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            >
              Save changes
            </button>
          </div>
      </div>
    </div>
  );
};

export default EditTrainerProfile;
