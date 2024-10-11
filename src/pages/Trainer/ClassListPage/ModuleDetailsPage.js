import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ModuleDetailsPage.css';
import { Divider, Col, Row, Tag, Descriptions, Tabs, Button } from 'antd'; // Import Button from Ant Design
import Feedback from './Feedback';

export default function ModuleDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const moduleData = location.state?.moduleData;
  
  if (!moduleData) {
    return <div>No module data available</div>;
  }

  const renderStatus = (status) => {
    let className = '';
    switch (status.toLowerCase()) {
      case 'in progress':
        className = 'status-in-progress';
        break;
      case 'not started':
        className = 'status-not-started';
        break;
      case 'closed':
        className = 'status-closed';
        break;
      case 'cancel':
        className = 'status-cancel';
        break;
      default:
        className = '';
    }
    return <Tag className={className}>{status}</Tag>;
  };

  const renderArrayAsString = (arr) => {
    return Array.isArray(arr) ? arr.join(', ') : arr;
  };

  const items = [
    { label: 'Module', children: moduleData.name },
    { label: 'Class', children: moduleData.className },
    { label: 'Skill', children: renderArrayAsString(moduleData.skills) },
    { label: 'Role', children: moduleData.roleName },
    { label: 'Contribution Type', children: renderArrayAsString(moduleData.contributeType) },
    { label: 'Start Date', children: moduleData.startDate },
    { label: 'End Date', children: moduleData.endDate },
    { label: 'Status', children: moduleData.status },
    { label: 'Note', children: moduleData.note, span: 2 },
  ];

  const tabItems = [
    {
      key: '1',
      label: 'Module Info',
      children: (
        <>
           <Descriptions bordered column={2} items={items} />
        </>
      )
    },
    {
      key: '2',
      label: 'Feedback',
      children: <Feedback moduleName={moduleData.name} onBack={() => {}} />
    },
  ];

  const handleBackToClassList = () => {
    navigate('/trainer/trainer_management', { state: { defaultActiveKey: '3' } });
  };


  return (
    <div className="module-details-container">
      <Row>
        <Col span={6}>
          <div className='titleMenu'>Module Details: {moduleData.name}</div>
        </Col>
        <Col style={{ marginLeft: '5px' }}>
          <div className='titleMenu'>{renderStatus(moduleData.status)}</div>
        </Col>
      </Row>
      <Divider style={{ margin: '15px 0px 0px' }} />

      <div style={{ marginLeft: '12px' }}>
        <Tabs defaultActiveKey="1" items={tabItems} />
      </div>

      <div className="separator-line" />
      <div className="button-container">
        <div className="divider"></div> {/* Divider line */}
        <Button type="primary" onClick={handleBackToClassList}>
        Back To Class List
      </Button>      </div>
    </div>
  );
}