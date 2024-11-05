import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Collapse, Table, Typography, Tag, Input, Select, Col, Spin, Row } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './ClassListPages.css';
import { fetchModuleDetail } from '../../../api/AdminAPI/Classlist_api';
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

  const classList = moduleInfo?.['trainerClassList'] || [];

  // Filter data
  const filteredData = classList
    .map((classItem) => {
      const filteredModules = classItem.modules.filter((module) =>
        module.moduleName.toLowerCase().includes(moduleSearch.toLowerCase()) &&
        (statusFilter === '' || (module.status && module.status.toLowerCase() === statusFilter.toLowerCase()))
      );

      return {
        class: classItem.className,
        modules: filteredModules,
      };
    })
    .filter((classData) =>
      classData.class.toLowerCase().includes(classSearch.toLowerCase()) &&
      classData.modules.length > 0
    );

  const columns = [
    {
      title: 'Module Name',
      dataIndex: 'moduleName',
      key: 'moduleName',
      fixed: 'left',
      render: (text, record) => (
        <Link
          onClick={async (e) => {
            e.preventDefault();
            try {
              const moduleDetails = await fetchModuleDetail(record.id); // Fetch module details using the record ID
              navigate(`/CLASS_ADMIN/trainer-management/module/info`, {
                state: { moduleData: moduleDetails.data }, // Pass the fetched module data to the next page
              });
            } catch (error) {
              console.error('Failed to fetch module details:', error);
            }
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
        if (!status) return null; // Handle null status
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
      <Row gutter={[16, 16]} className="search-space">
        <Col xs={24} sm={12} md={6} xl={4}>
          <Typography.Title level={5}>Class</Typography.Title>
          <Input
            placeholder="Search class"
            onChange={(e) => setClassSearch(e.target.value)}
            value={classSearch}
            style={{ width: '100%', height: 32, marginRight: 16 }}
          />
        </Col>
        <Col xs={24} sm={12} md={6} xl={4}>
          <Typography.Title level={5}>Module</Typography.Title>
          <Input
            placeholder="Search module"
            onChange={(e) => setModuleSearch(e.target.value)}
            value={moduleSearch}
            style={{ width: '100%', height: 32, marginRight: 16 }}
          />
        </Col>
        <Col xs={24} sm={12} md={6} xl={4}>
          <Typography.Title level={5}>Status</Typography.Title>
          <Select
            placeholder="Select status"
            onChange={(value) => setStatusFilter(value)}
            style={{ width: '100%' }}
          >
            <Option  value="In Progress">
              <Tag className="status-in-progress">In Progress</Tag>
            </Option>
            <Option value="Not Started">
              <Tag className="status-not-started">Not Started</Tag>
            </Option>
            <Option value="Closed">
              <Tag className="status-closed">Closed</Tag>
            </Option>
            <Option value="Cancel">
              <Tag className="status-cancel">Cancel</Tag>
            </Option>
          </Select>
        </Col>
      </Row>

      {filteredData.length > 0 ? (
        filteredData.map((classData, index) => (
          <Collapse className="custom-collapse" expandIconPosition="end" key={index}>
            <Panel className="custom-panel" header={<span className="panel-header">{classData.class}</span>}>
              <div className="table-container">
                <Table
                bordered
                  columns={columns}
                  dataSource={classData.modules}
                  pagination={false}
                  scroll={{ x: true }} 
                />
              </div>
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
