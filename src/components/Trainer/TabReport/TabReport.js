import React, { useState, useEffect } from 'react';
import { Table, DatePicker, Select, message, Input } from 'antd';
import { fetchReport } from '../../../api/AdminAPI/Report_api';
import './TabReport.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

const TabReport = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [moduleOptions, setModuleOptions] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchClassesAndModules = async () => {
      try {
        const response = await fetchReport();

        if (response.success) {
          const classes = new Set();
          const modules = new Set();

          response.data.forEach(item => {
            classes.add(JSON.stringify({
              id: item.classId,
              name: item.className,
            }));

            modules.add(item.moduleName);
          });

          setClassOptions(Array.from(classes).map((classStr) => JSON.parse(classStr)));
          setModuleOptions(Array.from(modules).map((name, index) => ({ id: index, name })));
        } else {
          message.error(response.message);
        }
      } catch (error) {
        console.error('Error fetching classes or modules:', error);
        message.error('Failed to fetch classes or modules');
      }
    };

    fetchClassesAndModules();
  }, []);

  const handleClassChange = (value) => {
    setSelectedClass(value);
  };

  const handleModuleChange = (value) => {
    setSelectedModule(value);
  };

  const handleDateChange = async (dates) => {
    if (!selectedClass || !selectedModule || !dates) {
      message.error('Please select a class, module, and date range.');
      return;
    }

    const startDate = dates[0].startOf('day').toISOString();
    const endDate = dates[1].endOf('day').toISOString();

    try {
      const response = await fetchReport();

      if (response.success) {
        const filteredData = response.data.filter(item => {
          const isClassMatch = item.className === selectedClass;
          const isModuleMatch = item.moduleName === selectedModule;
          const isDateInRange = new Date(item.startDate) <= new Date(endDate) && new Date(item.endDate) >= new Date(startDate);
          return isClassMatch && isModuleMatch && isDateInRange;
        });

        if (filteredData.length > 0) {
          const formattedData = filteredData.flatMap(item =>
            item.reports.flatMap(report =>
              report.topics.map(topic => ({
                key: `${report.date}-${topic.topicName}`,
                date: new Date(report.date).toLocaleDateString(),
                topic: topic.topicName,
                deliveryType: topic.deliveryType || 'N/A',
                trainingFormat: topic.trainingFormat || 'N/A',
                duration: topic.duration || 0,
                note: topic.note || 'N/A',
              }))
            )
          );
          setDataSource(formattedData);
        } else {
          message.error('No reports found for the selected class, module, and date range.');
        }
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      message.error('Failed to fetch report');
    }
  };


  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const filteredDataSource = dataSource.filter(item =>
    item.topic.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Topic',
      dataIndex: 'topic',
      key: 'topic',
    },
    {
      title: 'Delivery Type',
      dataIndex: 'deliveryType',
      key: 'deliveryType',
    },
    {
      title: 'Training Format',
      dataIndex: 'trainingFormat',
      key: 'trainingFormat',
    },
    {
      title: 'Duration (h)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
    },
  ];

  return (
    <div className="tab-report-container p-4 bg-white shadow rounded-lg">
      <div className="search-container mb-4">
        <div className="flex flex-wrap gap-4 justify-between">
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <div className="filter-item w-full sm:w-1/2 lg:w-1/4">
              <strong>Class</strong> <br />
              <Select
                placeholder="Select Class"
                className="w-full sm:w-[150px] mt-1"
                onChange={handleClassChange}
              >
                {classOptions.map((classItem) => (
                  <Option key={classItem.id} value={classItem.name}>
                    {classItem.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="filter-item w-full sm:w-1/2 lg:w-1/4">
              <strong>Module</strong> <br />
              <Select
                placeholder="Select Module"
                className="w-full sm:w-[150px] mt-1"
                onChange={handleModuleChange}
              >
                {moduleOptions.map((module) => (
                  <Option key={module.id} value={module.name}>
                    {module.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="filter-item w-full sm:w-1/2 lg:w-1/4">
              <strong>Report Date</strong>
              <RangePicker
                format={'DD/MM/YYYY'}
                className="w-full sm:w-auto mt-1"
                style={{ height: 32, width: '250px' }}
                onChange={handleDateChange}
              />
            </div>
          </div>

          <div className="w-full sm:w-1/2 lg:w-1/4">
            <strong>Search</strong>
            <Input
              className="w-full sm:w-[240px] mt-1"
              placeholder="Enter class code, class name"
              style={{ height: 32, boxShadow: 'none', border: '1px solid #d9d9d9' }}
              value={searchText}
              onChange={handleSearchChange}
            />
          </div>
        </div>

      </div>

      {filteredDataSource.length > 0 ? (
        <>
          <Table dataSource={filteredDataSource} columns={columns} pagination={false} />
          <div className="mt-4">
            <strong className="text-gray-800">
              Total Duration: {filteredDataSource.reduce((total, item) => total + item.duration, 0)} h
            </strong>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-48">
          <span className="text-2xl text-gray-400">No Data</span>
        </div>
      )}
    </div>


  );
};

export default TabReport;
