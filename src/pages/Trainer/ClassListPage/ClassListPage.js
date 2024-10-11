import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Collapse, Table, Typography, Tag, Input, Select, Col, Spin } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './ClassListPage.css';
import { fetchModuleInfoStart } from '../../../features/classlist/moduleSlice';

const { Panel } = Collapse;
const { Option } = Select;

function ClassList() {
  const [classSearch, setClassSearch] = useState('');
  const [moduleSearch, setModuleSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { moduleInfo, loading, error } = useSelector((state) => state.module);

  useEffect(() => {
    dispatch(fetchModuleInfoStart());
  }, [dispatch]);

  console.log('moduleInfo:', moduleInfo);

  // Safely access moduleInfo data
  const moduleData = moduleInfo && moduleInfo[0] && moduleInfo[0].data && moduleInfo[0].data.content
    ? [moduleInfo[0].data.content]  // Wrap the content in an array
    : [];


  // Group data by class
  const groupedData = moduleData.reduce((acc, item) => {
    if (item && item.className) {
      if (!acc[item.className]) {
        acc[item.className] = [];
      }
      acc[item.className].push({...item, no: acc[item.className].length + 1});
    }
    return acc;
  }, {});

  // Filter data
  const filteredData = Object.entries(groupedData)
    .map(([className, modules]) => {
      const filteredModules = modules.filter(module =>
        module.name && module.name.toLowerCase().includes(moduleSearch.toLowerCase()) &&
        (statusFilter === '' || (module.status && module.status.toLowerCase() === statusFilter.toLowerCase()))
      );

      return {
        class: className,
        modules: filteredModules,
      };
    })
    .filter(classData =>
      classData.class.toLowerCase().includes(classSearch.toLowerCase()) &&
      classData.modules.length > 0
    );


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
              className: record.className 
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

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="layout-container">
      <div className="search-container">
        <Col>
          <Typography.Title level={5}>Class</Typography.Title>
          <Input
            placeholder="Search class"
            onChange={(e) => setClassSearch(e.target.value)}
            value={classSearch}
            style={{ width: 198, height: 32, marginRight: 16, boxShadow: 'none', border: '1px solid #d9d9d9' }}
          />
        </Col>
        <Col>
          <Typography.Title level={5}>Module</Typography.Title>
          <Input
            placeholder="Search module"
            onChange={(e) => setModuleSearch(e.target.value)}
            value={moduleSearch}
            style={{ width: 198, height: 32, marginRight: 16, boxShadow: 'none', border: '1px solid #d9d9d9' }}
          />
        </Col>
        <Col>
          <Typography.Title level={5}>Status</Typography.Title>
          <Select
            placeholder="Select status"
            onChange={(value) => setStatusFilter(value)}
            style={{ width: 200 }}
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

      {filteredData.length > 0 ? (
        filteredData.map((classData, index) => (
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
        ))
      ) : (
        <div>No matching modules found.</div>
      )}
    </div>
  );
}

export default ClassList;