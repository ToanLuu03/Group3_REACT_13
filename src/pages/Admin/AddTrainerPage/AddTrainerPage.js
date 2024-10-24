import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Row, Col, Collapse, Table, Space, Popconfirm, message } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './AddTrainerPage.css';
import { AddTrainer_api } from '../../../api/AdminAPI/AddTrainer_api'
const { Panel } = Collapse;
const { Option } = Select;

const AddTrainerPage = () => {
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState({
    name: '',
    account: '',
    employeeId: '',
    type: 'INTERNAL',
    site: '',
    jobRank: '',
    trainCert: 'ADVANCE',
    professionalLevel: 'ADVANCE',
    competencyIndex: '',
    status: 'AVAILABLE',
    contactEmail: '',
    phone: '',
    nationalId: '',
    contributionType: 'TRAINER',
    trainerRank: '',
    professionalIndex: '',
    note: '',
  });

  const [skills, setSkills] = useState([]);
  const [token, setToken] = useState('');

  // Fetch token if needed
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTrainer({ ...trainer, [name]: value });
  };

  const handleSelectChange = (value, field) => {
    setTrainer({ ...trainer, [field]: value });
  };

  const handleSave = async () => {

    const formattedSkills = skills.map(skill => ({
      skillName: skill.skillName,
      level: skill.level,
      note: skill.note
    }));

    const payload = {
      account: trainer.account,
      employeeId: trainer.employeeId,
      nationalId: trainer.nationalId,
      name: trainer.name,
      email: trainer.contactEmail,
      phone: trainer.phone,
      type: trainer.type,
      status: trainer.status,
      site: trainer.site,
      jobRank: trainer.jobRank,
      trainerRank: trainer.trainerRank,
      trainTheTrainerCert: trainer.trainCert,
      professionalLevel: trainer.professionalLevel,
      professionalIndex: Number(trainer.professionalIndex),
      note: trainer.note,
      educatorContributionType: trainer.contributionType,
      trainingCompetencyIndex: Number(trainer.competencyIndex),
      trainerSkills: formattedSkills,
    };

    try {
      await AddTrainer_api(payload, token);
      message.success('Trainer added successfully!');
      navigate('/ADMIN/trainer-list');
    } catch (error) {
      message.error('Failed to add trainer.');
      console.error(error);
    }
  };


  const handleAddSkill = () => {
    setSkills([...skills, { skillName: '', level: '', note: '' }]);
  };

  const handleSkillChange = (index, key, value) => {
    const newSkills = [...skills];
    newSkills[index][key] = value;
    setSkills(newSkills);
  };

  const handleDeleteSkill = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
  };

  const columns = [
    { title: 'No.', dataIndex: 'no', key: 'no', render: (_, __, index) => index + 1 },
    {
      title: 'Skill Name',
      dataIndex: 'skillName',
      key: 'skillName',
      render: (_, record, index) => (
        <Select
          style={{ width: '100%' }}
          value={skills[index]?.skillName}
          onChange={(value) => handleSkillChange(index, 'skillName', value)}
        >
          <Option value="JAVA">JAVA</Option>
          <Option value="React">React</Option>
          <Option value="DOT NET">DOT NET</Option>
          <Option value="C#">C#</Option>
        </Select>
      ),
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (_, record, index) => (
        <Select
          style={{ width: 150 }}
          value={skills[index]?.level}
          onChange={(value) => handleSkillChange(index, 'level', value)}
        >
          <Option value="INTERMEDIATE">INTERMEDIATE</Option>
          <Option value="LIMITED_EXPERIENCE">LIMITED_EXPERIENCE</Option>
          <Option value="FUNDAMENTAL_AWARENESS">FUNDAMENTAL_AWARENESS</Option>
          <Option value="ADVANCED">ADVANCED</Option>
          <Option value="EXPERT">EXPERT</Option>
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
          onChange={(e) => handleSkillChange(index, 'note', e.target.value)}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, __, index) => (
        <Popconfirm
          title="Are you sure to delete?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleDeleteSkill(index)}
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ paddingTop: '60px' }}>
      <h2>Add Trainer Profile</h2>
      <Collapse defaultActiveKey={['1', '2']}>
        <Panel header="General Info" key="1">
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Full Name"
                  name="name"
                  rules={[{ required: true, message: 'Please input the full name!' }]}
                >
                  <Input
                    name="name"
                    value={trainer.name}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Account"
                  name="account"
                  rules={[{ required: true, message: 'Please input the account!' }]}
                >
                  <Input
                    name="account"
                    value={trainer.account}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Contact Email"
                  name="contactEmail"
                  rules={[
                    { required: true, message: 'Please input the email!' },
                    { type: 'email', message: 'The input is not a valid email!' }
                  ]}>
                  <Input
                    name="contactEmail"
                    value={trainer.contactEmail}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Phone"
                  name="phone"
                  rules={[{ required: true, message: 'Please input the phone!' },
                  {
                    pattern: /^\d{10,15}$/,
                    message: 'The input is not a valid phone number!',
                  },
                  ]}
                >
                  <Input
                    name="phone"
                    value={trainer.phone}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Employee ID"
                  name="Employee ID"
                  rules={[{ required: true, message: 'Please input the Employee ID!' }]}>
                  <Input
                    name="employeeId"
                    value={trainer.employeeId}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="National ID"
                  name="National ID"
                  rules={[{ required: true, message: 'Please input the National ID!' }]}
                >
                  <Input
                    name="nationalId"
                    value={trainer.nationalId}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Site"
                  name="Site"
                  rules={[{ required: true, message: 'Please input the Site!' }]}
                >
                  <Input
                    name="site"
                    value={trainer.site}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Trainer Type"
                >
                  <Select
                    value={trainer.type}
                    onChange={(value) => handleSelectChange(value, 'type')}
                  >
                    <Option value="INTERNAL">Internal</Option>
                    <Option value="EXTERNAL">External</Option>
                    <Option value="STAFF">Staff</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Contribution Type">
                  <Select
                    value={trainer.contributionType}
                    onChange={(value) => handleSelectChange(value, 'contributionType')}
                  >
                    <Option value="TRAINER">Trainer</Option>
                    <Option value="MENTOR">Mentor</Option>
                    <Option value="AUDITOR">Auditor</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Trainer Rank"
                  name="Trainer Rank"
                  rules={[{ required: true, message: 'Please input the Trainer Rank!' }]}
                >
                  <Input
                    name="trainerRank"
                    value={trainer.trainerRank}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Professional Level">
                  <Select
                    value={trainer.professionalLevel}
                    onChange={(value) => handleSelectChange(value, 'professionalLevel')}
                  >
                    <Option value="ADVANCE">Advanced</Option>
                    <Option value="STANDARD">Standard</Option>
                    <Option value="EXPERT">Expert</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Train The Trainer Certificate">
                  <Select
                    value={trainer.trainCert}
                    onChange={(value) => handleSelectChange(value, 'trainCert')}
                  >
                    <Option value="ADVANCE">Advanced</Option>
                    <Option value="BASIC">Basic</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Job Rank"
                  name="Job Rank"
                  rules={[{ required: true, message: 'Please input the Job Rank!' }]}
                >
                  <Input
                    name="jobRank"
                    value={trainer.jobRank}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Professional Index"
                  name="Professional Index"
                  rules={[{ required: true, message: 'Please input the Professional Index!' }]}
                >
                  <Input
                    name="professionalIndex"
                    value={trainer.professionalIndex}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Training Competency Index"
                  name="Training Competency Index"
                  rules={[{ required: true, message: 'Please input the Training Competency Index!' }]}
                >
                  <Input
                    name="competencyIndex"
                    value={trainer.competencyIndex}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Status">
                  <Select
                    value={trainer.status}
                    onChange={(value) => handleSelectChange(value, 'status')}
                  >
                    <Option value="AVAILABLE">Available</Option>
                    <Option value="BUSY">Busy</Option>
                    <Option value="OUT">Out</Option>
                    <Option value="ONSITE">On site</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Note"
                  name="Note"
                  rules={[{ required: true, message: 'Please input the Note!' }]}
                >
                  <Input
                    name="note"
                    value={trainer.note}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Panel>

        <Panel header="Professional Skills" key="2">
          <Table
            columns={columns}
            dataSource={skills}
            pagination={false}
            rowKey={(record, index) => index}
            footer={() => (
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={handleAddSkill}
              >
                Add new skill
              </Button>
            )}
          />
        </Panel>
      </Collapse>

      <Space style={{ marginTop: '24px', justifyContent: 'space-between' }}>
        <div className="button-container">
          <Button type="default" onClick={() => navigate('/ADMIN/trainer-list')}>
            Back to Trainers List
          </Button>
          <Button type="default" onClick={() => navigate('/ADMIN/trainer-list')} className="cancel-button">
            Cancel
          </Button>
          <Button type="primary" className="save-button" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Space>
    </div>
  );
};

export default AddTrainerPage;
