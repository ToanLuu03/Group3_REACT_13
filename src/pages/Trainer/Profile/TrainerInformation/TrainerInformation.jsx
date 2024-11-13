import React from 'react';
import LinkCert from '../../../../assets/image/Link.png';
import { Link } from 'react-router-dom';
import { LuDownload } from "react-icons/lu";
import { notification, Spin } from 'antd';

const TrainerInformation = ({ trainerData }) => {
  if (!trainerData || !trainerData.generalInfo) {
    return (
      <div className="flex justify-center mt-20 ">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  const professionalSkills = trainerData.skills?.filter(skill => skill.type === "PROFESSIONAL") || [];
  const softSkills = trainerData.skills?.filter(skill => skill.type === "SOFTSKILL") || [];

  const downloadImage = async (url, filename) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(objectUrl); // Clean up the URL object
    } catch (error) {
      notification.error({
        message: 'Download Failed',
        description: 'There was an issue downloading the image.',
      });
    }
  };

  return (
    <div className="mx-auto p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center mb-8">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-4xl"><img src={trainerData.generalInfo.avatar} alt="" className="rounded-full" /></span>
        </div>
        <div className="mt-4 md:mt-0 md:ml-6">
          <h1 className="text-2xl font-bold">{trainerData.generalInfo.name}</h1>
          <p className="text-gray-500">{trainerData.generalInfo.jobTitle} - {trainerData.generalInfo.jobRank}</p>
          <div className="mt-4 w-full md:w-[940px] h-20 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Info Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Personal Information */}
          <div className=" p-4 rounded-lg">
            <h2 className="font-bold rounded-full bg-[#D9D9D9] flex justify-center py-2 text-gray-700">PERSONAL INFORMATION</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span>📞 Phone</span>
                <span className="border-gray-300 flex-1 ml-4">{trainerData.generalInfo.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>✉️ Email</span>
                <span className="border-gray-300 flex-1 ml-4">{trainerData.generalInfo.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>🏠 Address</span>
                <span className="border-gray-300 flex-1 ml-4">{trainerData.generalInfo.address || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>🆔 National ID</span>
                <span className="border-gray-300 flex-1 ml-4">{trainerData.generalInfo.nationalId}</span>
              </div>
            </div>
          </div>

          {/* Employee Information */}
          <div className=" p-4 rounded-lg">
            <h2 className="font-bold rounded-full bg-[#D9D9D9] flex justify-center py-2 text-gray-700">EMPLOYEE INFORMATION</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span>Account</span>
                <span className="border-gray-300 flex-1 ml-4">{trainerData.generalInfo.account}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Employee ID</span>
                <span className="border-gray-300 flex-1 ml-4">{trainerData.generalInfo.employeeId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Site</span>
                <span className="border-gray-300 flex-1 ml-4">{trainerData.generalInfo.site}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Trainer Type</span>
                <span className="border-gray-300 flex-1 ml-4">{trainerData.generalInfo.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Contribution Type</span>
                <span className="border-gray-300 flex-1 ml-4">{trainerData.generalInfo.educatorContributionType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Trainer Rank</span>
                <span className="border-gray-300 flex-1 ml-4">{trainerData.generalInfo.trainerRank}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Professional Level</span>
                <span className="border-gray-300 flex-1 ml-4">{trainerData.generalInfo.professionalLevel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Train The Trainer Cert</span>
                <span className="border-gray-300 flex-1 ml-4">{trainerData.generalInfo.trainTheTrainerCert}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Professional Index</span>
                <span className="border-gray-300 flex-1 ml-4">{trainerData.generalInfo.professionalIndex}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Training Competency Index</span>
                <span className="border-gray-300 flex-1 ml-4">{trainerData.generalInfo.trainingCompetencyIndex}</span>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <Link to='/TRAINER' className="bg-gray-300 text-gray-700 py-2 px-4 rounded-full mt-4">Back to pageName</Link>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Professional Skills */}
          <div className=" p-4 rounded-lg">
            <h2 className="font-bold rounded-full bg-[#D9D9D9] flex justify-center p-2  text-gray-700">PROFESSIONAL SKILLS</h2>
            <div className="mt-4 space-y-3">
              {professionalSkills.map((skill, index) => (
                <div key={index} className="flex justify-between">
                  <span>• {skill.skill}</span>
                  <span className="text-gray-500">{skill.level}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Soft Skills */}
          <div className=" p-4 rounded-lg">
            <h2 className="font-bold rounded-full bg-[#D9D9D9] flex justify-center p-2  text-gray-700">SOFT SKILLS</h2>
            <div className="mt-4 space-y-3">
              {softSkills.map((skill, index) => (
                <span key={index}>• {skill.skill}<br /></span>
              ))}
            </div>
          </div>

          {/* Certificates */}
          <div className=" p-4 rounded-lg">
            <h2 className="font-bold rounded-full bg-[#D9D9D9] flex justify-center p-2  text-gray-700">CERTIFICATES</h2>
            <div className="mt-4 space-y-3">
              {trainerData.certificate && trainerData.certificate.map((cert, index) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <span>• {cert.name}</span>
                    <Link
                      to={cert.url}
                      target="_blank"
                      className="flex items-center gap-1"
                    >
                      <img src={LinkCert} alt="Link" />
                      {cert.url}
                    </Link>
                  </div>
                  <div className=''>
                    <span className="text-gray-500">{new Date(cert.date).toLocaleDateString()}</span>
                    <div className='flex justify-end text-2xl'>
                      <a onClick={() => downloadImage(cert.url, 'certificate.png')} className="cursor-pointer">
                        <LuDownload />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerInformation;
