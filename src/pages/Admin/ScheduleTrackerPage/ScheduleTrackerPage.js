import React, { useState } from 'react';
import { Select } from 'antd';
import './ScheduleTrackerPage.css';
import { useOutletContext } from 'react-router-dom';
import Class from './Class';
import Trainer from './Trainer';
function ScheduleTracker() {
  const [selectedMethod, setSelectedMethod] = useState(null);
  // const [selectedClass, setSelectedClass] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [trainerOptions, setTrainerOptions] = useState([]);
  // const { selectMenuItem } = useOutletContext();


  const handleSelectMethod = (value) => {
    setSelectedMethod(value);
    resetSelections();
  };

  // Reset các lựa chọn
  const resetSelections = () => {
    setSelectedModule(null);
    setSelectedTrainer(null);
  };


  return (
    <div>
      <div className='tracker-by'>
        <span className='text'>Track by:</span> <br />
        <Select
          style={{ width: 500 }}
          onChange={handleSelectMethod}
          options={[
            { label: 'Class Name', value: 'Class Name' },
            { label: 'Trainer', value: 'Trainer' }
          ]}
        />
      </div>

      {selectedMethod === 'Class Name' && <Class />}

      {selectedMethod === 'Trainer' &&
        <Trainer />
      }

    </div>
  );
}

export default ScheduleTracker;
