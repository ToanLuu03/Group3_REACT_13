import React, { useState } from 'react';
import { Collapse, Table, Typography, Tag, Input, Select, Col } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './ClassListPages';

const { Panel } = Collapse;
const { Option } = Select;

function ClassListPages() {
  const [classSearch, setClassSearch] = useState('');
  const [moduleSearch, setModuleSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  const columns = [
    {
      title: 'No.',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: 'Module',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Link
          onClick={(e) => {
            e.preventDefault();
            navigate(`/trainer/trainer_management/module/${record.id}`, {
              state: { moduleData: record },
              className: record.class 
            });
          }}
        >
          {text}
        </Link>
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
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
      },
    },
  ];

  // Mock data for classes and modules
  const data = [
    {
      class: "HCM24_React_JS",
      modules: [
        {
          class: "HCM24_React_JS",
          id: 1,
          no: 1,
          name: "React",
          startDate: "2022-05-15",
          endDate: "2022-06-20",
          skill: "Redux, Redux Toolkit",
          status: "In Progress",
          contribution: "Lecture, Support",
          role: "Trainer",
          note: "",
        },
        {
          
          class: "HCM24_React_JS",
          id: 2,
          no: 2,
          name: "Node.js",
          startDate: "2022-06-21",
          endDate: "2022-07-25",
          skill: "Backend",
          status: "Not Started",
          contribution: "Support",
          role: "Trainer",
          note: "Help me",
        },
      ],
    },
    {
      class: "HCM24_JAVA_JS",
      modules: [
        {
          class: "HCM24_JAVA_JS",
          id: 3,
          no: 1,
          name: "JavaScript",
          startDate: "2021-09-01",
          endDate: "2021-10-15",
          skill: "Frontend",
          status: "In Progress",
          contribution: "Lecture",
          role: "Trainer",
          note: "Nice",
        },
        {
          class: "HCM24_.NET",
          id: 4,
          no: 2,
          name: "Java",
          startDate: "2021-10-16",
          endDate: "2022-04-18",
          skill: "Backend",
          status: "Not Started",
          contribution: "Lecture, Support",
          role: "Trainer",
          note: "",
        },
      ],
    },
    {
      class: "HCM24_.NET",
      modules: [
        {
          class: "HCM24_.NET",
          id: 5,
          no: 1,
          name: "C#",
          startDate: "2023-02-10",
          endDate: "2023-05-15",
          skill: "Backend",
          status: "Closed",
          contribution: "Lecture",
          role: "Trainer",
          note: "",
        },
        {
          id: 6,
          no: 2,
          name: "ASP.NET",
          startDate: "2023-05-16",
          endDate: "2023-08-22",
          skill: "Full-stack",
          status: "In Progress",
          contribution: "Lecture, Support",
          role: "Trainer",
          note: "",
        },
      ],
    },
  ];

  // Filter the data based on search inputs
  const filteredData = data
    .map(classData => {
      const filteredModules = classData.modules.filter(module =>
        module.name.toLowerCase().includes(moduleSearch.toLowerCase()) &&
        (statusFilter === '' || module.status === statusFilter)
      );

      return {
        ...classData,
        modules: filteredModules,
      };
    })
    .filter(classData =>
      classData.class.toLowerCase().includes(classSearch.toLowerCase()) &&
      classData.modules.length > 0
    );

  return (
    <div className="layout-container">
   
      <div className="search-container">
        <Col>
          <Typography.Title level={5}>Class</Typography.Title>
          <Input
            placeholder="Search class"
            onChange={(e) => setClassSearch(e.target.value)}
            style={{ width: 198, height: 32, marginRight: 16, boxShadow: 'none', border: '1px solid #d9d9d9' }}
          />
        </Col>
        <Col>
          <Typography.Title level={5}>Module</Typography.Title>
          <Input
            placeholder="Search module"
            onChange={(e) => setModuleSearch(e.target.value)}
            style={{ width: 198, height: 32, marginRight: 16, boxShadow: 'none', border: '1px solid #d9d9d9' }}
          />
        </Col>
        <Col>
          <Typography.Title level={5}>Status</Typography.Title>
          <Select
            placeholder="Select status"
            onChange={(value) => setStatusFilter(value)}
            style={{ width: 148 }}
          >
            <Option value="In Progress">
              <div className="option-content">
                <Tag className="status-in-progress">In Progress</Tag>
              </div>
            </Option>
            <Option value="Not Started">
              <div className="option-content">
                <Tag className="status-not-started">Not Started</Tag>
              </div>
            </Option>
            <Option value="Closed">
              <div className="option-content">
                <Tag className="status-closed">Closed</Tag>
              </div>
            </Option>
            <Option value="Cancel">
              <div className="option-content">
                <Tag className="status-cancel">Cancel</Tag>
              </div>
            </Option>
          </Select>
        </Col>
      </div>

      {filteredData.map((classData, index) => (
        <Collapse
          className="custom-collapse"
          expandIconPosition="end"
          key={index}
        >
          <Panel className="custom-panel" header={<span className="panel-header">{classData.class}</span>}>
            <Table
              columns={columns}
              dataSource={classData.modules}
              pagination={false}
            />
          </Panel>
        </Collapse>
      ))}
    </div>
  );
}

export default ClassListPages;
