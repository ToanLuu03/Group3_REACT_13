import React, { useState, useEffect } from 'react';
import { Table, Typography, Input, Select, Col, Row, DatePicker, Divider, Spin } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { fetchClassList } from '../../../api/TrainingReportAPI/ClassList_api';
import formatDate from '../../../utils/formatDate';

const { Option } = Select;

function ClassList() {
  const [classSearch, setClassSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const [statusOptions, setStatusOptions] = useState([]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchClassList();
        setTableData(response.data);
        setFilteredData(response.data);

        const uniqueStatuses = [...new Set(response.data.map(item => item.status))];
        setStatusOptions(uniqueStatuses);
      } catch (error) {
        console.error('Failed to fetch class list:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Will format as DD/MM/YYYY
  };

  const [filteredData, setFilteredData] = useState(tableData);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const filtered = tableData.filter(item => {
      const matchesStatus = statusFilter ? item.status === statusFilter : true;
      const matchesClassSearch = classSearch ?
        item.classCode.toLowerCase().includes(classSearch.toLowerCase()) : true;

      const expectedStartDate = item.expectedStartDate ? new Date(item.expectedStartDate) : null;
      const expectedEndDate = item.expectedEndDate ? new Date(item.expectedEndDate) : null;

      const matchesStartDate = startDate ?
        (expectedStartDate && expectedStartDate >= startDate) : true;
      const matchesEndDate = endDate ?
        (expectedEndDate && expectedEndDate <= endDate) : true;

      return matchesStatus && matchesClassSearch && matchesStartDate && matchesEndDate;
    });
    setFilteredData(filtered);
  }, [classSearch, statusFilter, startDate, endDate, tableData]);


  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (_, __, index) => index + 1,

    },
    {
      title: 'Class Code',
      dataIndex: 'classCode',
      key: 'classCode',
      fixed: 'left',

      render: (text, record) => (
         <Link
          onClick={async (e) => {
            e.preventDefault();
            try {
              const targetPath = userRole === 'TRAINER'
                ? `/TRAINER/class-management/training-report`
                : `/CLASS_ADMIN/class-management/training-report`;
              navigate(targetPath, {
                state: { classId: record.id },
              });
            } catch (error) {
              console.error('Failed to navigate:', error);
            }
          }}
        >
          {text}
        </Link>
      ),
    },
    {
      title: 'Trainee Type',
      dataIndex: 'traineeType',
      key: 'traineeType',

    },
    {
      title: 'Class Admin',
      dataIndex: 'classAdmin',
      key: 'classAdmin',

    },
    {
      title: 'Technical Group',
      dataIndex: 'technicalGroup',
      key: 'technicalGroup',

    },
    {
      title: 'Training Program',
      dataIndex: 'trainingProgram',
      key: 'trainingProgram',

    },
    {
      title: 'Site',
      dataIndex: 'site',
      key: 'site',

    },
    {
      title: 'Trainee Numbers',
      children: [
        {
          title: 'Planned',
          dataIndex: 'traineeNumberPlanned',
          key: 'traineeNumberPlanned',

        },
        {
          title: 'Actual',
          dataIndex: 'traineeNumberActual',
          key: 'traineeNumberActual',

        },
      ],
    },
    {
      title: 'Dates',
      children: [
        {
          title: 'Start (Expected)',
          dataIndex: 'expectedStartDate',
          key: 'expectedStartDate',
          width: 120,
          render: (date) => formatDate(date, false),
        },
        {
          title: 'Start (Actual)',
          dataIndex: 'startDateActual',
          key: 'startDateActual',
          width: 200,
        },
        {
          title: 'End (Expected)',
          dataIndex: 'expectedEndDate',
          key: 'expectedEndDate',
          width: 120,
          render: (date) => formatDate(date, false),
        },
        {
          title: 'End (Actual)',
          dataIndex: 'endDateActual',
          key: 'endDateActual',
          width: 120,
        },
      ],
    },
    {
      title: 'Master Trainer',
      dataIndex: 'masterTrainer',
      key: 'masterTrainer',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange, // Update selected rows
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }


  return (
    <div className="pt-16 pr-5 h-[calc(100vh-80px)] overflow-x-hidden">
      <Typography.Title level={2}>Class List</Typography.Title>
      <Divider style={{ marginTop: "0px" }} />
      <Row gutter={[100, 16]} className="mb-10">
        <Col xs={24} sm={12} md={6} xl={6}>
          <Typography.Title level={5}>Status</Typography.Title>
          <Select
            placeholder="Select status"
            onChange={(value) => setStatusFilter(value)}
            style={{ width: '100%' }}
            allowClear
          >
            {statusOptions.map(status => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={6} xl={6}>
          <Typography.Title level={5}>Actual Start Date</Typography.Title>
          <DatePicker
            onChange={(date) => setStartDate(date ? date.toDate() : null)} // Update start date state
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={24} sm={12} md={6} xl={6}>
          <Typography.Title level={5}>Actual End Date</Typography.Title>
          <DatePicker
            onChange={(date) => setEndDate(date ? date.toDate() : null)} // Update end date state
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={24} sm={12} md={6} xl={6}>
          <Typography.Title level={5}>Class</Typography.Title>
          <Input
            placeholder="Search class, code class name"
            onChange={(e) => setClassSearch(e.target.value)}
            value={classSearch}
            style={{ width: '100%', height: 32, marginRight: 16 }}
          />
        </Col>
      </Row>

      {/* Render Table with merged module data */}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredData}
        bordered
        pagination={false}
        scroll={{ x: true }}

      />
    </div>
  );
}

export default ClassList;
