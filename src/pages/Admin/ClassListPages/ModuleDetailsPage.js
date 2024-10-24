import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ModuleDetailsPage.css';
import { Divider, Col, Row, Tag, Descriptions, Tabs, Button, } from 'antd'; // Import Button from Ant Design
import Feedback from './Feedback';
import formatDate from '../../../utils/formatDate';



export default function ModuleDetailsPageAD() {
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
    { label: 'Start Date', children: formatDate(moduleData.startDate, false) },
    { label: 'End Date', children: formatDate(moduleData.endDate, false) },
    { label: 'Status', children: moduleData.status },

  ];


  const tabItems = [
    {
      key: '1',
      label: 'Module Info',
      children: (
        <>
          <Descriptions bordered column={{
            xs: 1,
            sm: 1,
            md: 2,
            lg: 2,
            xl: 2,
            xxl:2,
          }} items={items} />
        </>
      )
    },
    {
      key: '2',
      label: 'Feedback',
      children: <Feedback moduleId={moduleData.id} moduleName={moduleData.name} onBack={() => { }} /> // Pass moduleId here
    },
  ];

  const handleBackToClassList = () => {
    navigate('/ADMIN/trainer-management', { state: { defaultActiveKey: '3' } });
  };


  return (
    <div className="module-details-container">
      <Row gutter={[16, 16]} style={{ marginTop:'80px', marginBottom:'16px' }}> {/* Change to column layout */}
        <Col span={10}> {/* Use full width on mobile */}
          <div className='titleMenu'>Module Details: {moduleData.name}</div>
        </Col>
        <Col span={1} >
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
        </Button>
      </div>
    </div>
  );
}