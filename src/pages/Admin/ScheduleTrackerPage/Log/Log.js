import React, { useState, useEffect } from "react";
import { DatePicker, Input, Table } from "antd";
import { SelectBox } from "../../../../components/Admin/Selectbox/SelectBox";
import { FaStarOfLife } from "react-icons/fa6";
import { fetchDataLog, fetchClasses, fetchModules } from "../../../../api/ScheduleTracker_api";

const { RangePicker } = DatePicker;

function Log() {
    // State variables
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);
    const [dateRange, setDateRange] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [logData, setLogData] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [selectedModuleId, setSelectedModuleId] = useState(null);
    const [classOptions, setClassOptions] = useState([]);
    const [moduleOptions, setModuleOptions] = useState([]);

    const handleDateChange = (dates) => {
        setSelectedDate(dates);
    }

    // Fetch classes when component mounts
    useEffect(() => {
        const getClasses = async () => {
            const classes = await fetchClasses();
            const formattedClasses = classes.map(cls => ({
                value: cls.id.toString(),
                label: cls.className
            }));
            setClassOptions(formattedClasses);
        };
        getClasses();
    }, []);

    // Fetch modules when class is selected
    useEffect(() => {
        const getModules = async () => {
            if (selectedClassId) {
                const modules = await fetchModules(selectedClassId);
                const formattedModules = modules.map(module => ({
                    value: module.id.toString(),
                    label: module.moduleName
                }));
                setModuleOptions(formattedModules);
            } else {
                setModuleOptions([]);
            }
        };
        getModules();
    }, [selectedClassId]);

    const columns = [
        {
            title: 'Topic',
            dataIndex: 'topic',
            key: 'topic',
            fixed: 'left',
            width: 150, // Set a width to keep it visible
            className: 'text-center', // Center-align text
            render: (text) => (
                <span className="">
                    {text}
                </span>
            ),
        },
        {
            title: 'Contents',
            dataIndex: 'content',
            key: 'content',
            fixed: 'left',
            width: 150, // Set a width to keep it visible
            className: 'text-center', // Center-align text
            render: (text) => (
                <span className="">
                    {text}
                </span>
            ),
        },
        {
            title: 'Trainer/Class Admin',
            dataIndex: 'trainer',
            key: 'trainer',
            className: 'text-center',
        },
        {
            title: 'Changed Content',
            dataIndex: 'changedContent',
            key: 'changedContent',
            className: 'text-center',
        },
        {
            title: 'Old Value',
            dataIndex: 'oldValue',
            key: 'oldValue',
            className: 'text-center',
        },
        {
            title: 'New Value',
            dataIndex: 'newValue',
            key: 'newValue',
            className: 'text-center',
        },
        {
            title: 'Date Change',
            dataIndex: 'dateChange',
            key: 'dateChange',
            className: 'text-center',
        },
    ];

    // Fetch data khi component mount
    useEffect(() => {
        const fetchLogs = async () => {
            if (selectedClassId && selectedModuleId) {
                const data = await fetchDataLog(selectedClassId, selectedModuleId);
                
                // Check if data exists and is not empty
                if (data && data.length > 0) {
                    const formattedData = data.map((item, index) => ({
                        key: index.toString(),
                        topic: item.topicName || 'N/A',
                        content: item.contentName || 'N/A',
                        trainer: item.trainerName || 'N/A',
                        changedContent: item.changedField || 'N/A',
                        oldValue: item.oldValue || 'N/A',
                        newValue: item.newValue || 'N/A',
                        dateChange: item.changeDate || 'N/A'
                    }));
                    setLogData(formattedData);
                } else {
                    // If no data, set empty array
                    setLogData([]);
                }
            }
        };

        fetchLogs();
    }, [selectedClassId, selectedModuleId]);

    // Update the class selection handler
    const handleClassChange = (value, option) => {
        setSelectedClass(option.label);
        setSelectedClassId(value);
        setSelectedModule(null);
        setSelectedModuleId(null);
        setDateRange(null);
    };

    // Update the module selection handler
    const handleModuleChange = (value, option) => {
        setSelectedModule(option.label);
        setSelectedModuleId(value);
    };

    return (
        <div className="p-8 min-h-screen">
            {/* Filter Section */}
            <div className="grid grid-cols-4 gap-4 mb-4">
                {/* Class Dropdown */}
                <div>
                    <div className="flex gap-1">
                        <FaStarOfLife className="text-red-600 w-[10px] " />
                        <span className="text-[20px] font-semibold">Class</span>
                    </div>
                    <SelectBox
                        placeholder="Select Class"
                        className="w-[80%]"
                        options={classOptions}
                        onChange={handleClassChange}
                        value={selectedClassId}
                    />
                </div>

                {/* Module Dropdown */}
                {selectedClassId && (
                    <div>
                        <div className="flex gap-1">
                            <FaStarOfLife className="text-red-600 w-[10px] " />
                            <span className="text-[20px] font-semibold">Module</span>
                        </div>
                        <SelectBox
                            placeholder="Select Module"
                            className="w-[80%]"
                            options={moduleOptions}
                            onChange={handleModuleChange}
                            value={selectedModuleId}
                        />
                    </div>
                )}

                {/* Date Range Picker, enabled only if Module is selected */}
                {selectedModule && (
                    <div>
                        <div className="flex gap-1">
                            <FaStarOfLife className="text-red-600 w-[10px]" />
                            <span className="text-[20px] font-semibold">Select Report Date</span>
                        </div>
                        <RangePicker
                            style={{ width: selectedDate ? '450px' : '250px', height: 32, border: '1px solid #d9d9d9' }}
                            onChange={(dates) => setDateRange(dates)}
                            format={'DD/MM/YYYY'}
                        />
                    </div>
                )}
                {/* Conditionally render Search Input only if dateRange is set */}
                {dateRange && (
                    <div className="w-[80%]">
                        <span className="text-[20px] font-semibold">Search </span>
                        <Input
                            placeholder="Search..."
                            className="search w-[100%]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}
            </div>

            {/* Displaying Selected Information */}
            <div className="flex items-center space-x-4 mb-4">
                <div className="flex gap-12 mb-6 ml-8">
                    <div className="text-[14px] font-[700]">Class: <span className="date">{selectedClass || 'N/A'}</span></div>
                    <div className="text-[14px] font-[700]">Module:  <span className="date">{selectedModule || 'N/A'}</span></div>
                    <div className="text-[14px] font-[700]">Start Date:  <span className="date">{dateRange ? dateRange[0].format('DD/MM/YYYY') : 'N/A'}</span></div>
                    <div className="text-[14px] font-[700]">End Date:  <span className="date">{dateRange ? dateRange[1].format('DD/MM/YYYY') : 'N/A'}</span></div>
                </div>
            </div>

            {/* Table Display */}
            <Table
                bordered
                size="middle"
                pagination={{ pageSize: 10 }}
                scroll={{
                    x: 'calc(700px + 100%)',
                }}
                className="text-center"
                columns={columns}
                dataSource={logData.filter((item) =>
                    searchTerm
                        ? item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.content.toLowerCase().includes(searchTerm.toLowerCase())
                        : true
                )}

            />
        </div>
    );
}

export default Log;
