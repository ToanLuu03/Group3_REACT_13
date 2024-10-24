import React, { useEffect, useState } from 'react';
import { Card, Button, Tag, Input, Table, Collapse, Select } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'; // Import Icons
import { Link } from 'react-router-dom';
import { fetchTrainerInfo } from '../../../api/AdminAPI/Trainer_info_api'; // Adjust the import path as needed
import './TrainerProfile.css'; // CSS to style the component
import { useSelector } from 'react-redux';

const { Panel } = Collapse;
const { Option } = Select;

const TrainerProfile = () => {
  const [trainerInfo, setTrainerInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false); // State for editing skills
  const [generalInfo, setGeneralInfo] = useState([]);
  const [skills, setSkills] = useState([]);
  const token = useSelector((state) => state.users.users.userName.token)
  useEffect(() => {
    const getTrainerInfo = async () => {
      try {
        const account = localStorage.getItem('trainerAccount');
        const info = await fetchTrainerInfo(account, token); // Replace with dynamic account if needed

        if (info?.generalInfo) {
          setTrainerInfo(info.generalInfo);
          setGeneralInfo([
            { label: 'Full Name', value: info.generalInfo.name || 'N/A' },
            { label: 'Account', value: info.generalInfo.account || 'N/A' },
            { label: 'Contact Email', value: info.generalInfo.email || 'N/A' },
            { label: 'Phone', value: info.generalInfo.phone || 'N/A' },
            { label: 'Employee ID', value: info.generalInfo.employeeId || 'N/A' },
            { label: 'National ID', value: info.generalInfo.nationalId || 'N/A' },
            { label: 'Trainer Type', value: info.generalInfo.type || 'N/A' },
            { label: 'Contribution Type', value: info.generalInfo.educatorContributionType || 'N/A' }, // Added line
            { label: 'Site', value: info.generalInfo.site || 'N/A' },
            { label: 'Job Rank', value: info.generalInfo.jobRank || 'N/A' },
            { label: 'Trainer Rank', value: info.generalInfo.trainerRank || 'N/A' },
            { label: 'Train The Trainer Certificate', value: info.generalInfo.trainTheTrainerCert || 'N/A' },
            { label: 'Professional Level', value: info.generalInfo.professionalLevel || 'N/A' },
            { label: 'Training Competency Index', value: info.generalInfo.trainingCompetencyIndex || 'N/A' },
            { label: 'Professional Index', value: info.generalInfo.professionalIndex || 'N/A' },
            { label: 'Status', value: info.generalInfo.status ? <Tag color="green">Available</Tag> : <Tag color="red">Unavailable</Tag> },
            { label: 'Note', value: info.generalInfo.note || 'N/A' },
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

  const handleEditGeneralClick = () => {
    setIsEditingGeneral(true);
  };

  const handleSaveGeneralClick = () => {
    setIsEditingGeneral(false);
  };

  const handleCancelGeneralClick = () => {
    setIsEditingGeneral(false);
  };

  const handleEditSkillsClick = () => {
    setIsEditingSkills(true);
  };

  const handleSaveSkillsClick = () => {
    setIsEditingSkills(false);
  };

  const handleCancelSkillsClick = () => {
    setIsEditingSkills(false);
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
        isEditingSkills ? (
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
        isEditingSkills ? (
          <Input value={text} onChange={(e) => handleChangeSkill(index, 'level', e.target.value)} className="skills-input" />
        ) : text
      ),
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      render: (text, record, index) => (
        isEditingSkills ? (
          <Input value={text} onChange={(e) => handleChangeSkill(index, 'note', e.target.value)} className="skills-input" />
        ) : text
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record, index) => (
        isEditingSkills && (
          <Button className="delete-skill-button" onClick={() => handleDeleteSkill(index)} icon={  <DeleteOutlined className="icon-small" />}>
            Delete
          </Button>
        )
      ),
    },
  ];

  return (
    <div className="trainer-profile p-4">
      <h2 className="text-xl font-bold">Trainer Profile - {trainerInfo ? trainerInfo.name : "Loading..."}</h2>
      {error && <p className="text-red-500">Error: {error}</p>}
      {!trainerInfo ? (
        <p>Loading trainer information...</p>
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
                        {isEditingGeneral ? (
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
                {isEditingGeneral ? (
                  <div className="flex justify-end gap-4 mt-4">
                    <Button className='icon-small' onClick={handleCancelGeneralClick}>Cancel</Button>
                    <Button type="primary" onClick={handleSaveGeneralClick}>Save</Button>

                  </div>
                ) : (
                  <Button type="primary" onClick={handleEditGeneralClick} className="mt-4">Edit General Info</Button>
                )}
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
                {isEditingSkills ? (
                  <div className="flex flex-col items-end gap-4 mt-4">
                    <div className='bt-ad'>
                      <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddSkill} className="w-full">
                        Add new skill
                      </Button>
                    </div>

                    <div className="flex gap-4">
                      <Button className='icon-small' onClick={handleCancelSkillsClick}>Cancel</Button>
                      <Button type="primary" onClick={handleSaveSkillsClick}>Save</Button>

                    </div>
                  </div>
                ) : (
                  <Button type="primary" onClick={handleEditSkillsClick} className="mt-4">Edit Skills</Button>
                )}
              </Card>
            </Panel>
          </Collapse>
          <div className="mt-4">
            <Button className='custom-button mt-4' type="button">
              <Link to='/ADMIN/trainer-list'>Back to Trainers List</Link>
            </Button>

          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerProfile;