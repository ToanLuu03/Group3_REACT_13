import React, { useState, useEffect } from 'react';
import { Table, DatePicker, Select, message, Input } from 'antd';
import axios from 'axios';
import { fetchReport } from '../../../api/AdminAPI/Report_api'; // Adjust the import based on your file structure
import './TabReport.css'


const { RangePicker } = DatePicker;
const { Option } = Select;

const TabReport = () => {
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);
    const [dataSource, setDataSource] = useState([]); // State for storing fetched report data
    const [classOptions, setClassOptions] = useState([]); // State for class options
    const [moduleOptions, setModuleOptions] = useState([]); // State for module options
    const [searchText, setSearchText] = useState(''); // State for search text

    // Fetch classes and modules from the reports API when the component mounts
    useEffect(() => {
        const fetchClassesAndModules = async () => {
            try {
                const response = await axios.get('https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/trainers/reports-history', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure your token is correctly set
                    },
                });

                if (response.data.success) {
                    const classes = new Set(); // Use a Set to avoid duplicates
                    const modules = new Set(); // Use a Set to avoid duplicates

                    response.data.data.forEach(item => {
                        classes.add(JSON.stringify({
                            id: item.classId,
                            name: item.className,
                        })); 

                        modules.add(item.moduleName); // Add module names to Set
                    });

                    // Update state with unique class and module options
                    setClassOptions(Array.from(classes).map((classStr) => JSON.parse(classStr))); // Convert Set to Array and parse the stringified objects
                    setModuleOptions(Array.from(modules).map((name, index) => ({ id: index, name }))); // Convert Set to Array
                } else {
                    message.error(response.data.message);
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
    
        const startDate = dates[0].startOf('day').toISOString(); // Đảm bảo startDate là đầu ngày
        const endDate = dates[1].endOf('day').toISOString(); // Đảm bảo endDate là cuối ngày
    
        try {
            const response = await fetchReport(); // Gọi API để lấy toàn bộ dữ liệu
    
            if (response.success) {
                // Lọc dữ liệu dựa vào class, module và khoảng thời gian
                const filteredData = response.data.filter(item => {
                    const isClassMatch = item.className === selectedClass;
                    const isModuleMatch = item.moduleName === selectedModule;
                    
                    // So sánh startDate và endDate của item với ngày đã chọn
                    const isDateInRange = new Date(item.startDate) <= new Date(endDate) && new Date(item.endDate) >= new Date(startDate);
    
                    return isClassMatch && isModuleMatch && isDateInRange;
                });
    
                if (filteredData.length > 0) {
                    // Xử lý và định dạng lại dữ liệu báo cáo
                    const formattedData = filteredData.flatMap(item => 
                        item.reports.map(report => ({
                            key: report.date,
                            date: new Date(report.date).toLocaleDateString(),
                            topic: report.topics.map(topic => topic.topicName).join(', '),
                            deliveryType: report.topics.map(topic => topic.deliveryType || 'N/A').join(', '),
                            trainingFormat: report.topics.map(topic => topic.trainingFormat || 'N/A').join(', '),
                            duration: report.topics.reduce((total, topic) => total + (topic.duration || 0), 0),
                            note: report.topics.map(topic => topic.note).join(', '),
                        }))
                    );
                    setDataSource(formattedData); // Cập nhật dữ liệu hiển thị
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
        setSearchText(event.target.value); // Cập nhật giá trị tìm kiếm
    };

    // Lọc dữ liệu dựa trên searchText
    const filteredDataSource = dataSource.filter(item => 
        item.topic.toLowerCase().includes(searchText.toLowerCase()) // Lọc theo topic
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
        <div style={{ padding: '20px' }}>
            <div className="search-container">
                <div className="filter-controls">
                    <div>
                        <strong>Class</strong>
                        <Select
                            placeholder="Select Class"
                            style={{ width: 200, marginTop: 4 }}
                            onChange={handleClassChange}
                        >
                            {classOptions.map((classItem) => (
                                <Option key={classItem.id} value={classItem.name}>
                                    {classItem.name}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <strong>Module</strong>
                        <Select
                            placeholder="Select Module"
                            style={{ width: 200, marginTop: 4 }}
                            onChange={handleModuleChange}
                        >
                            {moduleOptions.map((module) => (
                                <Option key={module.id} value={module.name}>
                                    {module.name}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <strong>Report Date</strong>
                        <RangePicker
                            className="range-picker"
                            style={{ marginTop: 4 }}
                            onChange={handleDateChange}
                        />
                    </div>
                </div>
                <div className="search-input">
                    <strong>Search</strong>
                    <Input
                        placeholder="Search by topic"
                        style={{ width: 200, marginTop: 4 }}
                        value={searchText} // Bind giá trị tìm kiếm
                        onChange={handleSearchChange} // Gọi hàm khi giá trị thay đổi
                    />
                </div>
            </div>
            {filteredDataSource.length > 0 ? ( // Sử dụng filteredDataSource để hiển thị
                <>
                    <Table dataSource={filteredDataSource} columns={columns} pagination={false} />
                    <div style={{ marginTop: 16 }}>
                        <strong>Duration Total: {filteredDataSource.reduce((total, item) => total + item.duration, 0)} h</strong>
                    </div>
                </>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <span style={{ fontSize: '24px', color: '#bfbfbf' }}>No Data</span>
                </div>
            )}
        </div>
    );
};

export default TabReport;
