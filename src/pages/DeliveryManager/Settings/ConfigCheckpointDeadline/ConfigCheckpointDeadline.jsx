import React, { useState, useEffect } from 'react';
import { Table, Button, Form, DatePicker, TimePicker, Input, Typography, Divider, theme, Row, Col, Space, Select } from 'antd';
import { fetchConfig, createConfig } from '../../../../api/DM_API/ConfigPayDay_api';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

export default function ConfigCheckpointDeadline() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkpointYear, setCheckpointYear] = useState(dayjs().year());
  const [checkpointMonth, setCheckpointMonth] = useState(dayjs().month() + 1);
  const [editedRows, setEditedRows] = useState(new Set());
  const [checkpointOptions, setCheckpointOptions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [collapsed] = useOutletContext();

  const columns = [
    {
      title: 'No.',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Config Key',
      dataIndex: 'configKey',
      key: 'configKey',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (_, record) => (
        <DatePicker
          value={dayjs(record.deadline)}
          onChange={(date) => handleDateChange(record.id, date)}
          disabled={loading}
        />
      ),
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (_, record) => (
        <TimePicker
          value={record.time ? dayjs(record.time, 'HH:mm:ss') : null}
          format="HH:mm:ss"
          onChange={(time) => handleTimeChange(record.id, time)}
          disabled={loading}
        />
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (_, record) => (
        <Input
          value={record.description || ''}
          onChange={(e) => handleDescriptionChange(record.id, e.target.value)}
          disabled={loading}
        />
      ),
    },
    {
      title: 'Last Modified Date',
      dataIndex: 'lastModifiedDate',
      key: 'lastModifiedDate',
      render: (date) => dayjs(date).format('DD-MM-YYYY')

    },
    {
      title: 'Last Modified By',
      dataIndex: 'lastModifiedBy',
      key: 'lastModifiedBy',
    },
  ];

  const isDeadlineOverlapping = (record) => {
    return data.some(item =>
      item.id !== record.id &&
      item.deadline === record.deadline &&
      item.department === record.department
    );
  };

  const handleDateChange = (id, date) => {
    setEditedRows(prev => new Set(prev.add(id)));
    const newData = data.map(item =>
      item.id === id ? { ...item, deadline: date?.format('YYYY-MM-DD') } : item
    );
    setData(newData);
    
    // Update filteredData as well
    const newFilteredData = newData.filter(item => {
      const itemDate = dayjs(item.deadline);
      return checkpointMonth 
        ? itemDate.year() === checkpointYear && (itemDate.month() + 1) === checkpointMonth
        : itemDate.year() === checkpointYear;
    });
    setFilteredData(newFilteredData);
  };

  const handleTimeChange = (id, time) => {
    setEditedRows(prev => new Set(prev.add(id)));
    const newData = data.map(item =>
      item.id === id ? {
        ...item,
        time: time ? time.format('HH:mm:ss') : null
      } : item
    );
    setData(newData);
    setFilteredData(newData.filter(item => {
      const itemDate = dayjs(item.deadline);
      return checkpointMonth 
        ? itemDate.year() === checkpointYear && (itemDate.month() + 1) === checkpointMonth
        : itemDate.year() === checkpointYear;
    }));
  };

  const handleDescriptionChange = (id, description) => {
    setEditedRows(prev => new Set(prev.add(id)));
    const newData = data.map(item =>
      item.id === id ? { ...item, description } : item
    );
    setData(newData);
    setFilteredData(newData.filter(item => {
      const itemDate = dayjs(item.deadline);
      return checkpointMonth 
        ? itemDate.year() === checkpointYear && (itemDate.month() + 1) === checkpointMonth
        : itemDate.year() === checkpointYear;
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Create a single record to save (based on your example format)
      const dataToSave = data.map(record => {
        // Validate the time value
        if (!record.time || record.time === 'Invalid Date') {
          throw new Error(`Invalid time value for record ${record.id}`);
        }

        return {
          id: Number(record.id),
          deadline: dayjs(record.deadline).format('YYYY-MM-DD'),
          time: record.time.substring(0, 5), // Extract just HH:mm from the time string
          description: record.description || ''
        };
      });

      console.log('Data being sent:', dataToSave);
      await createConfig(dataToSave);

      const response = await fetchConfig();
      setData(response.data);
      toast.success('Configuration saved successfully!');
    } catch (error) {
      console.error('Error saving configs:', error);
       toast.error('Failed to save configuration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    // Reset edited rows
    setEditedRows(new Set());

    // Reload original data from server
    setLoading(true);
    try {
      const response = await fetchConfig();
      setData(response.data);
    } catch (error) {
      console.error('Error reloading config data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCheckpointOptions = () => {
    const options = [];
    const currentYear = dayjs().year();
    
    // Add "All Months" option
    options.push({
      value: `${currentYear}`,
      label: `${currentYear}`
    });

    // Add individual months
    for (let month = 12; month >= 1; month--) {
      const date = dayjs(`${currentYear}-${month}-01`);
      options.push({
        value: `${currentYear}-${month}`,
        label: date.format('MMMM YYYY')
      });
    }

    return options;
  };

  const handleCheckpointChange = (value) => {
    // Check if the value contains a hyphen (indicating year-month format)
    if (value.includes('-')) {
      const [year, month] = value.split('-');
      setCheckpointYear(parseInt(year));
      setCheckpointMonth(parseInt(month));
      // Filter for specific month
      const filtered = data.filter(item => {
        const itemDate = dayjs(item.deadline);
        return itemDate.year() === parseInt(year) && (itemDate.month() + 1) === parseInt(month);
      });
      setFilteredData(filtered);
    } else {
      // Handle year-only selection (All months)
      const year = parseInt(value);
      setCheckpointYear(year);
      setCheckpointMonth(null);
      // Filter for all months in the selected year
      const filtered = data.filter(item => {
        const itemDate = dayjs(item.deadline);
        return itemDate.year() === year;
      });
      setFilteredData(filtered);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetchConfig();
        setData(response.data);
        // Initialize filteredData with current month/year data
        const filtered = response.data.filter(item => {
          const itemDate = dayjs(item.deadline);
          return itemDate.year() === checkpointYear && (itemDate.month() + 1) === checkpointMonth;
        });
        setFilteredData(filtered);
        setCheckpointOptions(generateCheckpointOptions());
      } catch (error) {
        console.error('Error loading config data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);


  return (
    <div className='pt-16'>
      <Row gutter={[16, 16]} align="middle" justify="space-between">
        <Col xs={24} sm={12}>
          <Typography.Title level={2} style={{ margin: 0 }}>Config Effort Deadline</Typography.Title>
        </Col>
        <Col xs={24} sm={12}>
          <Form layout="inline" style={{ justifyContent: 'flex-end' }}>
            <Space wrap>
              <Typography.Text strong>
                Checkpoint Period : 
              </Typography.Text>
              <Select
                value={checkpointMonth ? `${checkpointYear}-${checkpointMonth}` : `${checkpointYear}`}
                onChange={handleCheckpointChange}
                options={checkpointOptions}
                style={{ width: '200px', marginBottom: '0px' }}
              />
            </Space>
          </Form>
        </Col>
      </Row>

      <Divider style={{ marginTop: "24px", marginBottom: "36px" }} />

      <div style={{ overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          scroll={{ x: 'max-content' }}
          rowKey="id"
          rowClassName={(record) => {
            if (editedRows.has(record.id)) return 'bg-[#FFCC0040]';
            if (isDeadlineOverlapping(record)) return 'bg-[#F5CCCC]';
            return '';
          }}
        />
      </div>  

      <div style={{
        padding: '18px',
        backgroundColor: '#fff',
        borderTop: '1px solid #f0f0f0',
        position: 'fixed',
        bottom: 0,
        right: 0,
        left: collapsed ? 30 : 260, // Changed to use width instead of left
        transition: 'all 0.2s', // Updated transition property
      }}>
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col xs={24} sm={12}>
            <Space wrap>
              <Space style={{ marginRight: '36px' }}>
                <div style={{ 
                  width: 40, 
                  height: 40, 
                  backgroundColor: '#FFCC0040', 
                  border: '1px solid #D9D9D9',
                  marginRight: '8px',
                  marginLeft: '8px'
                }} />
                <Typography.Text >Edited</Typography.Text>
              </Space>
              <Space>
                <div style={{ 
                  width: 40, 
                  height: 40, 
                  backgroundColor: '#F5CCCC', 
                  border: '1px solid #D9D9D9',
                  marginRight: '8px'
                }} />
                <Typography.Text>Deadline Overlapping</Typography.Text>
              </Space>
            </Space>
          </Col>
          <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
            <Space wrap>
              <Button
                type="default"
                onClick={handleCancel}
                loading={loading}
                style={{
                  width: 96,
                  padding: 8,
                  borderRadius: 30,
                  backgroundColor: '#FFFFFF',
                  color: '#FF0000',
                  borderColor: '#D9D9D9'
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleSave}
                loading={loading}
                style={{
                  width: 96,
                  padding: 8,
                  borderRadius: 30,
                  backgroundColor: '#5144E4'
                }}
              >
                Save
              </Button>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
}