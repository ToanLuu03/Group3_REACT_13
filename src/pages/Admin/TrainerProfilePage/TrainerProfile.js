import React, { useEffect, useState } from 'react';
import { Card, Button, Tag, Input, Table, Collapse, Select, Spin } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'; // Import Icons
import { Link } from 'react-router-dom';
import { fetchTrainerInfo, updateTrainerInfo } from '../../../api/AdminAPI/Trainer_info_api'; // Adjust the import path as needed
import './TrainerProfile.css'; // CSS to style the component
import { useSelector } from 'react-redux';

const { Panel } = Collapse;
const { Option } = Select;

const TrainerProfile = () => {
  const [trainerInfo, setTrainerInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Unified state for editing both general info and skills
  const [generalInfo, setGeneralInfo] = useState([]);
  const [skills, setSkills] = useState([]);
  const token = useSelector((state) => state.users.users.userName.token);

  useEffect(() => {
    const getTrainerInfo = async () => {
      try {
        const account = localStorage.getItem('trainerAccount');
        const info = await fetchTrainerInfo(account, token);

        if (info?.generalInfo) {
          setTrainerInfo(info.generalInfo);
          setGeneralInfo([
            { label: 'Full Name', value: info.generalInfo.name || 'N/A', key: 'name' },
            { label: 'Account', value: info.generalInfo.account || 'N/A', key: 'account' },
            { label: 'Contact Email', value: info.generalInfo.email || 'N/A', key: 'email' },
            { label: 'Phone', value: info.generalInfo.phone || 'N/A', key: 'phone' },
            { label: 'Employee ID', value: info.generalInfo.employeeId || 'N/A', key: 'employeeId' },
            { label: 'National ID', value: info.generalInfo.nationalId || 'N/A', key: 'nationalId' },
            { label: 'Trainer Type', value: info.generalInfo.type || 'N/A', key: 'type' },
            { label: 'Contribution Type', value: info.generalInfo.educatorContributionType || 'N/A', key: 'educatorContributionType' },
            { label: 'Site', value: info.generalInfo.site || 'N/A', key: 'site' },
            { label: 'Job Rank', value: info.generalInfo.jobRank || 'N/A', key: 'jobRank' },
            { label: 'Trainer Rank', value: info.generalInfo.trainerRank || 'N/A', key: 'trainerRank' },
            { label: 'Train The Trainer Certificate', value: info.generalInfo.trainTheTrainerCert || 'N/A', key: 'trainTheTrainerCert' },
            { label: 'Professional Level', value: info.generalInfo.professionalLevel || 'N/A', key: 'professionalLevel' },
            { label: 'Training Competency Index', value: info.generalInfo.trainingCompetencyIndex || 'N/A', key: 'trainingCompetencyIndex' },
            { label: 'Professional Index', value: info.generalInfo.professionalIndex || 'N/A', key: 'professionalIndex' },
            { label: 'Status', value: info.generalInfo.status ? 'AVAILABLE' : 'UNAVAILABLE', key: 'status' },
            { label: 'Note', value: info.generalInfo.note || 'N/A', key: 'note' }
          ]);
        } else {
          setError('General information not available.');
        }

        if (info?.skills) {
          setSkills(info.skills);
        }
      } catch (err) {
        setError('Error fetching trainer information');
        console.error('Error:', err);
      }
    };

    getTrainerInfo();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);

    const updatedGeneralInfo = generalInfo.reduce((acc, curr) => {
      if (curr.key) {
        acc[curr.key] = curr.value;
      }
      return acc;
    }, {});

    const updatedSkills = skills.map(skill => ({
      skillName: skill.skill,
      level: skill.level,
      note: skill.note,
    }));

    const updatedData = {
      ...updatedGeneralInfo,
      trainerSkills: updatedSkills
    };

    try {
      const account = localStorage.getItem('trainerAccount');
      await updateTrainerInfo(account, updatedData, token);
    } catch (err) {
      console.error('Error saving trainer info:', err);
      setError('Error saving trainer information');
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleChangeGeneral = (index, event) => {
    const newGeneralInfo = [...generalInfo];
    newGeneralInfo[index].value = event.target.value;
    setGeneralInfo(newGeneralInfo);
  };

  const handleChangeSkill = (index, field, value) => {
    const newSkills = [...skills];
    newSkills[index][field] = value;
    setSkills(newSkills);
  };

  const handleDeleteSkill = (index) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  const handleAddSkill = () => {
    setSkills([...skills, { skill: '', level: '', note: '' }]);
  };

  // Columns for the skills table
  const skillColumns = [
    {
      title: 'No.',
      dataIndex: 'no',
      key: 'no',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Skill',
      dataIndex: 'skill',
      key: 'skill',
      render: (text, record, index) => (
        isEditing ? (
          <Select value={text} onChange={(value) => handleChangeSkill(index, 'skill', value)} className="skills-select">
            <Option value="React">React</Option>
            <Option value="Java">Java</Option>
            <Option value="DotNet">DotNet</Option>
          </Select>
        ) : text
      ),
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (text, record, index) => (
        isEditing ? (
          <Select value={text} onChange={(value) => handleChangeSkill(index, 'level', value)} className="skills-select">
            <Option value="INTERMEDIATE">INTERMEDIATE</Option>
            <Option value="LIMITED_EXPERIENCE">LIMITED_EXPERIENCE</Option>
            <Option value="FUNDAMENTAL_AWARENESS">FUNDAMENTAL_AWARENESS</Option>
            <Option value="ADVANCED">ADVANCED</Option>
            <Option value="EXPERT">EXPERT</Option>
          </Select>
        ) : text
      ),
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      render: (text, record, index) => (
        isEditing ? (
          <Input value={text} onChange={(e) => handleChangeSkill(index, 'note', e.target.value)} className="skills-input" />
        ) : text
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record, index) => (
        isEditing && (
          <Button className="delete-skill-button" onClick={() => handleDeleteSkill(index)} icon={<DeleteOutlined className="icon-small" />}>
            Delete
          </Button>
        )
      ),
    },
  ];

  return (
    <div className="trainer-profile p-4">

      {!trainerInfo ? (
        <div className="flex justify-start items-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="trainer-container-profile h-[calc(100vh-260px)] overflow-y-auto scrollbar-hide">
          <Collapse defaultActiveKey={['1', '2']} className="bg-gray-200 shadow-lg mb-5">
            {/* General Info Collapse */}
            <Panel header="General Information" key="1" className="font-bold">
              <Card className="rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-300 p-4 rounded-lg">
                  {generalInfo.map((item, index) => (
                    <div key={index} className="flex justify-between border-b pb-2 md:border-none">
                      <strong className="w-1/3 bg-gray-200 p-2">{item.label}:</strong>
                      <span className="w-2/3 text-right border-l border-gray-300 pl-2">
                        {isEditing ? (
                          <Input
                            value={item.value}
                            onChange={(event) => handleChangeGeneral(index, event)}
                            className="w-full"
                          />
                        ) : (
                          item.label === 'Status' ? item.value : item.value
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </Panel>

            {/* Professional Skills Collapse */}
            <Panel header="Professional Skills" key="2" className="font-bold">
              <Card className="rounded-lg">
                <Table
                  columns={skillColumns}
                  dataSource={skills.map((skill, index) => ({ ...skill, key: index }))}
                  pagination={false}
                />
                {isEditing && (
                  <div className="flex flex-col items-end gap-4 mt-4">
                    <div className='bt-ad'>
                      <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddSkill} className="w-full">
                        Add new skill
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </Panel>
          </Collapse>
          <div className="flex justify-between mt-4">
            <Button type="default">
              <Link to="/ADMIN/trainer-list">Back to Trainers List</Link>
            </Button>

            <div className="flex gap-4">
              {!isEditing ? (
                <Button type="primary" onClick={handleEditClick}>Edit information</Button>
              ) : (
                <>
                  <Button onClick={handleCancelClick}>Cancel</Button>
                  <Button type="primary" onClick={handleSaveClick}>Save</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerProfile;
