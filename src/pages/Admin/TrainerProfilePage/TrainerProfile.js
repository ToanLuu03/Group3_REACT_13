import React, { useEffect, useState } from 'react';
import { Collapse, Button, Tag, Input } from 'antd';
import { fetchTrainerInfo } from '../../../api/AdminAPI/Trainer_info_api'; // Adjust the import path if necessary
import './TrainerProfile.css'; // Import the CSS file

const { Panel } = Collapse;

const TrainerProfile = () => {
  const [trainerInfo, setTrainerInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  const [generalInfo, setGeneralInfo] = useState([]);
  const [skills, setSkills] = useState([]); // Add state for skills


  useEffect(() => {
    const getTrainerInfo = async () => {
      try {
        const account = localStorage.getItem('trainerAccount')
        const info = await fetchTrainerInfo(account); // Replace with dynamic account as needed
        console.log('Fetched Trainer Info:', info); // Log fetched trainer info

        if (info?.generalInfo) {
          setTrainerInfo(info.generalInfo);
          setGeneralInfo([
            { label: 'Full Name', value: info.generalInfo.name || 'N/A' },
            { label: 'Account', value: info.generalInfo.account || 'N/A' },
            { label: 'Contact Email', value: info.generalInfo.email || 'N/A' },
            { label: 'Phone', value: info.generalInfo.phone || 'N/A' },
            { label: 'National ID', value: info.generalInfo.nationalId || 'N/A' },
            { label: 'Employee ID', value: info.generalInfo.employeeId || 'N/A' },
            { label: 'Type', value: info.generalInfo.type || 'N/A' },
            { label: 'Site', value: info.generalInfo.site || 'N/A' },
            { label: 'Job Rank', value: info.generalInfo.jobRank || 'N/A' },
            { label: 'Trainer Rank', value: info.generalInfo.trainerRank || 'N/A' },
            { label: 'Train The Trainer Certification', value: info.generalInfo.trainTheTrainerCert || 'N/A' },
            { label: 'Professional Level', value: info.generalInfo.professionalLevel || 'N/A' },
            { label: 'Training Competency Index', value: info.generalInfo.trainingCompetencyIndex || 'N/A' },
            { label: 'Professional Index', value: info.generalInfo.professionalIndex || 'N/A' },
            { label: 'Status', value: info.generalInfo.status ? <Tag color="green">Available</Tag> : <Tag color="red">Unavailable</Tag> },
            { label: 'Note', value: info.generalInfo.note || 'N/A' },
          ]);
        } else {
          console.warn('No generalInfo found');
          setError('General information not available.');
        }

        if (info?.skills) {
          setSkills(info.skills); // Set skills data
        }

      } catch (err) {
        setError('Error fetching trainer information');
        console.error('Error:', err); // Log the error
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

  const handleChangeGeneral = (index, event) => {
    const newGeneralInfo = [...generalInfo];
    newGeneralInfo[index].value = event.target.value;
    setGeneralInfo(newGeneralInfo);
  };

  return (
    <div className="trainer-profile">
      {error && <p>Error: {error}</p>}
      {!trainerInfo ? (
        <p>Loading trainer information...</p>
      ) : (
        <div>
          <h1>Trainer Profile - {trainerInfo?.name}</h1>
          <Collapse>
            {/* General Info */}
            <Panel header="General Info" key="1">
              <div className="general-info-grid">
                {generalInfo.map((item, index) => (
                  <div key={index} className="general-info-row">
                    <strong className="general-info-label">{item.label}</strong>
                    <span className="general-info-value">
                      {isEditingGeneral ? (
                        <Input
                          value={item.value}
                          onChange={(event) => handleChangeGeneral(index, event)}
                          className="general-input"
                        />
                      ) : (
                        item.label === 'Status' ? item.value : item.value
                      )}
                    </span>
                  </div>
                ))}
              </div>
              {isEditingGeneral ? (
                <div className="edit-buttons">
                  <Button type="primary" onClick={handleSaveGeneralClick}>Save</Button>
                  <Button onClick={handleCancelGeneralClick}>Cancel</Button>
                </div>
              ) : (
                <Button type="primary" onClick={handleEditGeneralClick}>Edit General Info</Button>
              )}
            </Panel>

            {/* Professional Skills Section */}
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
                  {skills.map((skill, index) => (
                    <tr key={skill.id}>
                      <td>{index + 1}</td>
                      <td>{skill.skill}</td>
                      <td>{skill.level}</td>
                      <td>{skill.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          </Collapse>
        </div>

      )}
      <div>
        <Button className='mt-4'>
          <a href='/admin/trainer_list'>Back to Trainers Lists</a>
        </Button>
      </div>
    </div>
  );
};

export default TrainerProfile;
