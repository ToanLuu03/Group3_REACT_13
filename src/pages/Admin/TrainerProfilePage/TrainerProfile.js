import React, { useEffect, useState } from 'react';
import { Collapse, Button, Tag, Input, Select } from 'antd';
import './TrainerProfile.css'; // Import the CSS file
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

const statusList = [
  { key: '1', label: 'Available' },
  { key: '2', label: 'Unavailable' },
];

const professionalLevelList = [
  { key: '1', label: 'Beginner' },
  { key: '2', label: 'Intermediate' },
  { key: '3', label: 'Advanced' },
  { key: '4', label: 'Expert' },
];

const contributionTypeList = [
  { key: '1', label: 'Trainer' },
  { key: '2', label: 'Mentor' },
  { key: '3', label: 'Evaluator' },
];

const trainTheTrainerCertificateList = [
  { key: '1', label: 'None' },
  { key: '2', label: 'Basic' },
  { key: '3', label: 'Advance' },
];

const TrainerProfile = () => {
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
      <Collapse>
        {/* General Info */}
        <Panel header="General Info" key="1">
          <div className="general-info-grid">
            {generalInfo.map((item, index) => (
              <div key={index} className="general-info-row">
                <strong className="general-info-label">
                  {item.label}
                </strong>
                <span className="general-info-value">
                  {isEditingGeneral ? (
                    item.label === 'Status' || item.label === 'Professional Level' || item.label === 'Contribution Type' || item.label === 'Train The Trainer Certificate' ? (
                      <Select
                        value={item.value}
                        onChange={(value) => handleChangeGeneralSelect(index, value)}
                        className="general-select"
                      >
                        {item.label === 'Status' && statusList.map((status) => (
                          <Option key={status.key} value={status.label}>
                            {status.label}
                          </Option>
                        ))}
                        {item.label === 'Professional Level' && professionalLevelList.map((level) => (
                          <Option key={level.key} value={level.label}>
                            {level.label}
                          </Option>
                        ))}
                        {item.label === 'Contribution Type' && contributionTypeList.map((type) => (
                          <Option key={type.key} value={type.label}>
                            {type.label}
                          </Option>
                        ))}
                        {item.label === 'Train The Trainer Certificate' && trainTheTrainerCertificateList.map((cert) => (
                          <Option key={cert.key} value={cert.label}>
                            {cert.label}
                          </Option>
                        ))}
                      </Select>
                    ) : (
                      <Input
                        value={item.value}
                        onChange={(event) => handleChangeGeneral(index, event)}
                        className="general-input"
                      />
                    )
                  ) : (
                    item.label === 'Status' ? (
                      <Tag color={item.value === 'Available' ? 'green' : 'red'}>{item.value}</Tag>
                    ) : item.value
                  )}
                </span>
              </div>
            ))}
          </div>
          {isEditingGeneral ? (
            <div className="edit-buttons">
              <Button type="primary" onClick={handleSaveGeneralClick}>
                Save
              </Button>
              <Button onClick={handleCancelGeneralClick}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button type="primary" onClick={handleEditGeneralClick}>
              Edit General Info
            </Button>
          )}
        </Panel>

        {/* Professional Skills */}
        <Panel header="Professional Skills" key="2">
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
            <div className="edit-buttons">
              <Button type="primary" onClick={handleSaveSkillsClick}>
                Save
              </Button>
              <Button onClick={handleCancelSkillsClick}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button type="primary" onClick={handleEditSkillsClick}>
              Edit Professional Skills
            </Button>
          )}
        </Panel>
      </Collapse>
      <div>
        <Button className='mt-4'>
          <a href='/admin/trainer_list'>Back to Trainers Lists</a>
        </Button>
      </div>
    </div>
  );
};

export default TrainerProfile;
