import React, { useState } from 'react';
import { Form, Input, Button, Select, Row, Col, Collapse, Table, Space, Popconfirm } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './AddTrainerPage.css';


const { Panel } = Collapse;

const AddTrainerPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [trainer, setTrainer] = useState({
    name: '',
    account: '',
    employeeId: '',
    type: 'Internal',
    trainerType: '',
    site: 'HN',
    jobRank: '',
    trainCert: '',
    professionalLevel: '',
    competencyIndex: '',
    status: 'Available',
    contactEmail: '',
    phone: '',
    nationalId: '',
    contributionType: 'Trainer',
    trainerRank: '',
    professionalIndex: '',
    note: '',
  });


  const [skills, setSkills] = useState([{ skill: '', note: '' }]);

  const handleChange = (value, field) => {
    setTrainer((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    setSkills([...skills, { skill: '', note: '' }]);
  };

  const removeSkill = (index) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  const columns = [
    { title: 'No.', dataIndex: 'no', key: 'no', render: (_, __, index) => index + 1 },
    {
      title: 'Skill',
      dataIndex: 'skill',
      key: 'skill',
      render: (_, record, index) => (
        <Select
          style={{ width: '100%' }}
          value={skills[index]?.skill}
          onChange={(value) => {
            const newSkills = [...skills];
            newSkills[index].skill = value;
            setSkills(newSkills);
          }}
        >
          <Select.Option value="React">React</Select.Option>
          <Select.Option value="JAVA">JAVA</Select.Option>
          <Select.Option value="DOT NET">DOT NET</Select.Option>
        </Select>
      ),
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      render: (_, record, index) => (
        <Input
          value={skills[index]?.note}
          onChange={(e) => {
            const newSkills = [...skills];
            newSkills[index].note = e.target.value;
            setSkills(newSkills);
          }}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record, index) => (
        <Popconfirm
          title="Are you sure to delete?"
          onConfirm={() => removeSkill(index)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  const handleSubmit = () => {
    console.log('Trainer Data:', trainer, 'Skills:', skills);
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2>Add Trainer Profile</h2>
      <Collapse defaultActiveKey={['1', '2']}>
        <Panel header="General Info" key="1">
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Full Name">
                  <Input
                    value={trainer.name}
                    onChange={(e) => handleChange(e.target.value, 'name')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Account">
                  <Input
                    value={trainer.account}
                    onChange={(e) => handleChange(e.target.value, 'account')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Contact Email">
                  <Input
                    value={trainer.contactEmail}
                    onChange={(e) => handleChange(e.target.value, 'contactEmail')}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Phone">
                  <Input
                    value={trainer.phone}
                    onChange={(e) => handleChange(e.target.value, 'phone')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Employee ID">
                  <Input
                    value={trainer.employeeId}
                    onChange={(e) => handleChange(e.target.value, 'employeeId')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="National ID">
                  <Input
                    value={trainer.nationalId}
                    onChange={(e) => handleChange(e.target.value, 'nationalId')}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Site">
                  <Select
                    value={trainer.site}
                    onChange={(value) => handleChange(value, 'site')}
                  >
                    <Select.Option value="HN">HN</Select.Option>
                    <Select.Option value="HCM">HCM</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Trainer Type">
                  <Input
                    value={trainer.trainerType}
                    onChange={(e) => handleChange(e.target.value, 'trainerRank')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Contribution Type">
                  <Select
                    value={trainer.contributionType}
                    onChange={(value) => handleChange(value, 'contributionType')}
                  >
                    <Select.Option value="Trainer">Trainer</Select.Option>
                    <Select.Option value="Assistant">Assistant</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Trainer Rank">
                  <Input
                    value={trainer.trainerRank}
                    onChange={(e) => handleChange(e.target.value, 'trainerRank')}
                  />
                </Form.Item>
              </Col>


              <Col span={8}>
                <Form.Item label="Professional Level">
                  <Select
                    value={trainer.professionalLevel}
                    onChange={(value) => handleChange(value, 'professionalLevel')}
                  >
                    <Select.Option value="Advanced">Advanced</Select.Option>
                    <Select.Option value="Intermediate">Intermediate</Select.Option>
                    <Select.Option value="Beginner">Beginner</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Train The Trainer Certificate">
                  <Select
                    value={trainer.trainCert}
                    onChange={(value) => handleChange(value, 'trainCert')}
                  >
                    <Select.Option value="Advanced">Advanced</Select.Option>
                    <Select.Option value="Basic">Basic</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Job Rank">
                  <Input
                    value={trainer.jobRank}
                    onChange={(e) => handleChange(e.target.value, 'jobRank')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Professional Index">
                  <Input
                    value={trainer.professionalIndex}
                    onChange={(e) => handleChange(e.target.value, 'professionalIndex')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Training Competency Index">
                  <Input
                    value={trainer.competencyIndex}
                    onChange={(e) => handleChange(e.target.value, 'competencyIndex')}
                  />
                </Form.Item>
              </Col>

            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Status">
                  <Select
                    value={trainer.status}
                    onChange={(value) => handleChange(value, 'status')}
                  >
                    <Select.Option value="Available">Available</Select.Option>
                    <Select.Option value="Unavailable">Unavailable</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Note">
                  <Input
                    value={trainer.Note}
                    onChange={(e) => handleChange(e.target.value, 'Note')}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Panel>


        <Panel header="Professional Skills" key="2">
          <Table
            dataSource={skills}
            columns={columns}
            pagination={false}
            rowKey={(record, index) => index}
            footer={() => (
              <Button className="add-skill-button" type="dashed" onClick={addSkill} icon={<PlusOutlined />}>
                Add new skill
              </Button>
            )}
          />
        </Panel>
      </Collapse>

      <Space style={{ marginTop: '24px', justifyContent: 'space-between' }}>
        <div className="button-container">
          <div className="bt-left">
            <Button type="default" onClick={() => navigate('/admin/trainer_list')}>
              Back to Trainers List
            </Button>
          </div>
          <div className="bt-right">
            <Button type="default" onClick={() => navigate('/admin/trainer_list')} className="cancel-button">
              Cancel
            </Button>
            <Button type="primary" onClick={handleSubmit} className="save-button">
              Save
            </Button>
          </div>
        </div>






      </Space>
    </div>
  );
};

export default AddTrainerPage;
