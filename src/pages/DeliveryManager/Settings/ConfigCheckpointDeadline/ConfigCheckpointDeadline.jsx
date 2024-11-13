import React, { useState, useEffect } from 'react';
import { Table, Button, Form, DatePicker, TimePicker, Input, Typography, Divider, theme } from 'antd';
import { fetchConfig, createConfig } from '../../../../api/DM_API/ConfigPayDay_api';
import dayjs from 'dayjs';

export default function ConfigCheckpointDeadline() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [checkpointYear, setCheckpointYear] = useState(dayjs().year());
  const [checkpointMonth, setCheckpointMonth] = useState(dayjs().month() + 1);
  const [editedRows, setEditedRows] = useState(new Set());
  const { token } = theme.useToken();

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
        />
      ),
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (_, record) => (
        <TimePicker
          value={dayjs(record.time, 'HH:mm:ss')}
          format="HH:mm:ss"
          onChange={(time) => handleTimeChange(record.id, time)}
        />
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (_, record) => (
        <Input
          value={record.description}
          onChange={(e) => handleDescriptionChange(record.id, e.target.value)}
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
    setData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, deadline: date?.format('YYYY-MM-DD') } : item
      )
    );
  };

  const handleTimeChange = (id, time) => {
    setEditedRows(prev => new Set(prev.add(id)));
    setData(prevData =>
      prevData.map(item =>
        item.id === id ? {
          ...item,
          time: time ? time.format('HH:mm') : null
        } : item
      )
    );
  };

  const handleDescriptionChange = (id, description) => {
    setEditedRows(prev => new Set(prev.add(id)));
    setData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, description } : item
      )
    );
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
    } catch (error) {
      console.error('Error saving configs:', error);
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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetchConfig();
        setData(response.data);
      } catch (error) {
        console.error('Error loading config data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Function to format the checkpoint display
  const getCheckpointDisplay = () => {
    return dayjs()
      .year(checkpointYear)
      .month(checkpointMonth - 1)
      .format('MMMM-YYYY');
  };

  return (
    <div className='pt-16'>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography.Title level={2} style={{ margin: 0 }}>Config Effort Deadline</Typography.Title>
        <Form layout="inline">
          <Form.Item label="Checkpoint Period" style={{ marginBottom: 0 }}>
            <Input
              value={getCheckpointDisplay()}
              readOnly
              style={{ width: '200px' }}
            />
          </Form.Item>
        </Form>
      </div>
      <Divider style={{ marginTop: "24px", marginBottom: "36px" }} />

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          pageSize: 5,
          total: data.length,
          hideOnSinglePage: true
        }}
        rowKey="id"
        rowClassName={(record) => {
          if (editedRows.has(record.id)) return 'bg-[#FFCC0040]';
          if (isDeadlineOverlapping(record)) return 'bg-[#F5CCCC]';
          return '';
        }}
      />

      <div className=" mt-10 px-6 py-4 bg-white border-t border-gray-200 w-full overflow-x-auto">
        <div className="flex justify-between items-center ">
          {/* Legend/Key */}
          <div className="flex items-center ">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#FFCC0040] border border-[#D9D9D9]"></div>
              <span>Edited</span>
            </div>
            <div className="flex items-center gap-2 ml-5">
              <div className="w-5 h-5 bg-[#F5CCCC] border border-[#D9D9D9]"></div>
              <span>Deadline Overlapping</span>
            </div>
          </div>

          {/* Buttons */}
          <div >
            <Button
              type="default"
              onClick={handleCancel}
              loading={loading}
              className="w-24 p-2 rounded-[30px] mr-4"
              style={{
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
              className="w-24 p-2 rounded-[30px]"
              style={{ backgroundColor: '#5144E4' }}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}