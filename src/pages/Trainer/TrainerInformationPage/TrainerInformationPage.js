import React, { useEffect, useState } from 'react';
import { Collapse, Button, Tag, Input, Select, Descriptions } from 'antd';
import './TrainerInformation.css'; // Import the CSS file
import { useOutletContext } from 'react-router-dom';

const { Panel } = Collapse;
const { Option } = Select;

const skillsList = [
  { key: '1', label: 'REACT' },
  { key: '2', label: 'JAVA' },
  { key: '3', label: 'DOT NET' },
  { key: '4', label: 'JAVASCRIPT' },
  { key: '5', label: 'PYTHON' },
  { key: '6', label: 'C++' },
  { key: '7', label: 'HTML/CSS' },
];



const TrainerInformation = () => {
  const { selectMenuItem } = useOutletContext();
  useEffect(() => {
    selectMenuItem('3');
  }, [selectMenuItem]);

  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [generalInfo, setGeneralInfo] = useState([
    { label: 'Full Name', value: 'Trần Thị Bành Bạch' },
    { label: 'Account', value: 'BachTTB100' },
    { label: 'Contact Email', value: 'helloconde@gmail.com' },
    { label: 'Phone', value: '0123456789' },
    { label: 'Employee ID', value: 'BLa1200' },
    { label: 'National ID', value: '174552610' },
    { label: 'Site', value: 'HN' },
    { label: 'Trainer Type', value: 'Internal' },
    { label: 'Contribution Type', value: 'Trainer' }, // Updated for select
    { label: 'Trainer Rank', value: '1' },
    { label: 'Professional Level', value: 'Advanced' }, // Updated for select
    { label: 'Train The Trainer Certificate', value: 'Advance' }, // Updated for select
    { label: 'Job Rank', value: 'Developer 3' },
    { label: 'Professional Index', value: '1' },
    { label: 'Training Competency Index', value: '1.2' },
    { label: 'Status', value: <Tag color="green">Available</Tag> }, // Updated for select
    { label: 'Note', value: 'Note' },
  ]);

  const [skillsData, setSkillsData] = useState([
    { key: '1', no: '1', skills: 'REACT', level: 'Advanced', note: 'Strong' },
    { key: '2', no: '2', skills: 'JAVA', level: 'Intermediate', note: 'Good' },
    { key: '3', no: '3', skills: 'DOT NET', level: 'Basic', note: 'Entry-level' },
  ]);

  const handleEditGeneralClick = () => {
    setIsEditingGeneral(true);
  };

  const handleSaveGeneralClick = () => {
    setIsEditingGeneral(false);
  };

  const handleCancelGeneralClick = () => {
    setIsEditingGeneral(false);
  };

  const handleChangeGeneral = (index, event) => {
    const newGeneralInfo = [...generalInfo];
    newGeneralInfo[index].value = event.target.value;
    setGeneralInfo(newGeneralInfo);
  };

  const handleChangeGeneralSelect = (index, value) => {
    const newGeneralInfo = [...generalInfo];
    newGeneralInfo[index].value = value;
    setGeneralInfo(newGeneralInfo);
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

  const handleChangeSkills = (index, field, value) => {
    const newSkillsData = [...skillsData];
    if (field === 'skills') {
      newSkillsData[index].skills = value;
    } else if (field === 'level') {
      newSkillsData[index].level = value;
    } else if (field === 'note') {
      newSkillsData[index].note = value;
    }
    setSkillsData(newSkillsData);
  };

  return (
    <div className="trainer-container-info">
              <Collapse
          className="custom-collapse"
          expandIconPosition="end"
   
        >
        {/* General Info */}
        <Panel header={<span className="panel-header"> General Info </span>} key="1" >
          <Descriptions
            bordered
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
          >
            {generalInfo.map((item, index) => (
              <Descriptions.Item key={index} label={item.label}>
                {isEditingGeneral ? (
                  item.label === 'Status' || item.label === 'Professional Level' || item.label === 'Contribution Type' || item.label === 'Train The Trainer Certificate' ? (
                    <Select
                      value={item.value}
                      onChange={(value) => handleChangeGeneralSelect(index, value)}
                      style={{ width: '100%' }}
                    >
                      {/* ... Select options remain the same ... */}
                    </Select>
                  ) : (
                    <Input
                      value={item.value}
                      onChange={(event) => handleChangeGeneral(index, event)}
                      style={{ width: '100%' }}
                    />
                  )
                ) : (
                  item.label === 'Status' ? (
                    <Tag style={{ border: 'none' }}>{item.value}</Tag>
                  ) : item.value
                )}
              </Descriptions.Item>
            ))}
          </Descriptions>
          {isEditingGeneral ? (
            <div className="edit-buttons" >
              <Button type="primary" onClick={handleSaveGeneralClick}>
                Save
              </Button>
              <Button  danger  onClick={handleCancelGeneralClick} >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="edit-buttons" >
            <Button type="primary" onClick={handleEditGeneralClick} style={{ width: '164px' }} >
              Edit General Info
            </Button>
            </div>
          )}
        </Panel>
        </Collapse>

        {/* Professional Skills */}
        <Collapse
          className="custom-collapse"
          expandIconPosition="end"
   
        >
        <Panel header={<span className="panel-header"> Professional Skills </span>} key="2">
          <table className="skills-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Skills</th>
                <th>Level</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {skillsData.map((skill, index) => (
                <tr key={index}>
                  <td>{skill.no}</td>
                  <td>
                    {isEditingSkills ? (
                      <Select
                        value={skill.skills}
                        onChange={(value) => handleChangeSkills(index, 'skills', value)}
                        className="skills-select"
                      >
                        {skillsList.map((skillOption) => (
                          <Option key={skillOption.key} value={skillOption.label}>
                            {skillOption.label}
                          </Option>
                        ))}
                      </Select>
                    ) : (
                      skill.skills
                    )}
                  </td>
                  <td>
                    {isEditingSkills ? (
                      <Select
                        value={skill.level}
                        onChange={(value) => handleChangeSkills(index, 'level', value)}
                        className="skills-select"
                      >
                        <Option value="Advanced">Advanced</Option>
                        <Option value="Intermediate">Intermediate</Option>
                        <Option value="Basic">Basic</Option>
                      </Select>
                    ) : (
                      skill.level
                    )}
                  </td>
                  <td>
                    {isEditingSkills ? (
                      <Input
                        value={skill.note}
                        onChange={(event) => handleChangeSkills(index, 'note', event.target.value)}
                        className="skills-input"
                      />
                    ) : (
                      skill.note
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isEditingSkills ? (
            <div className="edit-buttons" >
              <Button type="primary" onClick={handleSaveSkillsClick}>
                Save
              </Button>
              <Button danger onClick={handleCancelSkillsClick}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="edit-buttons" >
            <Button type="primary" onClick={handleEditSkillsClick} >
              Edit Skills
            </Button>
            </div>
          )}
        </Panel>
        </Collapse>
      
    </div>
  );
};

export default TrainerInformation;
