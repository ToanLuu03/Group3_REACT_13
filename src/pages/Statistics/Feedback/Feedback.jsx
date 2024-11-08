import React from 'react';
import { Collapse } from 'antd';
import TrainerSection from './TrainerSection/TrainerSection';
import TrainingProgramContent from './TrainingProgramContent/TrainingProgramContent';
import CourseOrganization from './CourseOrganization/CourseOrganization';

const { Panel } = Collapse;

const Feedback = () => {
 
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Collapse defaultActiveKey={['1', '2', '3']} expandIconPosition="right">
        <Panel header="Trainer" key="1">
          <TrainerSection />
        </Panel>

        {/* Training Program & Content Section */}
        <Panel header="Training Program & Content" key="2">
          <TrainingProgramContent />
        </Panel>

        {/* Course organization*/}
        <Panel header="Course organization" key="3">
          <CourseOrganization />
        </Panel>
      </Collapse>
    </div>
  );
};

export default Feedback;
