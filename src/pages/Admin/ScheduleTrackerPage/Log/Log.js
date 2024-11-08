import React, { useState, useEffect, useMemo } from "react";
import { DatePicker, Input, Table, Spin } from "antd";
import { SelectBox } from "../../../../components/Admin/Selectbox/SelectBox";
import { FaStarOfLife } from "react-icons/fa6";
import { fetchDataLog, fetchDataClass, fetchModules, searchLogs } from "../../../../api/ScheduleTracker_api";
import moment from 'moment';

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
    const [fullData, setFullData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleDateChange = (dates) => {
        setSelectedDate(dates);
    }

    // Fetch classes and prepare data when component mounts
    useEffect(() => {
        const getClassesAndModules = async () => {
            try {
                const data = await fetchDataClass();

                // Get unique classes
                const uniqueClasses = Array.from(new Set(data.map(item => item.classId)))
                    .map(classId => {
                        const classItem = data.find(item => item.classId === classId);
                        return {
                            value: classId,
                            label: classItem.className
                        };
                    });
                setClassOptions(uniqueClasses);

                // Store full data for later use in module selection
                setFullData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setClassOptions([]);
            }
        };
        getClassesAndModules();
    }, []);

    // Update modules when class is selected
    useEffect(() => {
        if (selectedClassId && fullData) {
            // Filter modules for selected class
            const classModules = fullData
                .filter(item => item.classId === selectedClassId)
                .reduce((unique, item) => {
                    if (!unique.some(module => module.value === item.moduleId)) {
                        unique.push({
                            value: item.moduleId,
                            label: item.moduleName
                        });
                    }
                    return unique;
                }, []);
            setModuleOptions(classModules);
        } else {
            setModuleOptions([]);
        }
    }, [selectedClassId, fullData]);

    const columns = [
        {
            title: () => <div className="text-center font-bold">Topic</div>,
            dataIndex: 'className',
            key: 'topic',
            fixed: 'left',
            className: 'w-[200px] text-center',
            render: (value, _, index) => {
                const previousRecord = index > 0 ? logData[index - 1].className : null;
                const currentClassName = logData[index].className;

                let rowSpan = 1;
                if (currentClassName === previousRecord) {
                    rowSpan = 0;
                } else {
                    let count = 1;
                    while (index + count < logData.length && currentClassName === logData[index + count].className) {
                        count++;
                    }
                    rowSpan = count;
                }

                return {
                    children: <span className="text-center">{value || 'No data'}</span>,
                    props: { rowSpan },
                };
            },
        },
        {
            title: () => <div className="text-center font-bold">Contents</div>,
            dataIndex: 'moduleName',
            key: 'content',
            fixed: 'left',
            width: 300,
            className: 'text-center',
        },
        {
            title: () => <div className="text-center font-bold">Trainer/Class Admin</div>,
            dataIndex: 'trainerId',
            key: 'trainer',
            className: 'text-center',
            render: (value, _, index) => {
                const previousRecord = index > 0 ? logData[index - 1].trainerId : null;
                const currentTrainerId = logData[index].trainerId;

                let rowSpan = 1;
                if (currentTrainerId === previousRecord) {
                    rowSpan = 0;
                } else {
                    let count = 1;
                    while (index + count < logData.length && currentTrainerId === logData[index + count].trainerId) {
                        count++;
                    }
                    rowSpan = count;
                }

                return {
                    children: value || 'N/A',
                    props: { rowSpan },
                };
            },
        },
        {
            title: () => <div className="text-center font-bold">Changed Content</div>,
            dataIndex: 'changedContent',
            key: 'changedContent',
            className: 'text-center',
            render: (text) => {
                const contentMap = {
                    "Update actual date": "Update Actual Date",
                    "Update planned date": "Update Planned Date",
                    "Update duration": "Update Duration",
                    "Update note": "Update Note",
                    "Update reason": "Update Reason",
                    "Update status": "Update Status"
                };
                return contentMap[text] || text;
            }
        },
        {
            title: () => <div className="text-center font-bold">Old Value</div>,
            dataIndex: 'oldValue',
            key: 'oldValue',
            className: 'text-center',
            render: (text) => {
                if (text && moment(text, moment.ISO_8601, true).isValid()) {
                    return moment(text).format('YYYY-MM-DD');
                }
                return text || 'N/A';
            }
        },
        {
            title: () => <div className="text-center font-bold">New Value</div>,
            dataIndex: 'newValue',
            key: 'newValue',
            className: 'text-center',
            render: (text) => {
                if (text && moment(text, moment.ISO_8601, true).isValid()) {
                    return moment(text).format('YYYY-MM-DD');
                }
                return text || 'N/A';
            }
        },
        {
            title: () => <div className="text-center font-bold">Date Change</div>,
            dataIndex: 'changedDate',
            key: 'dateChange',
            className: 'text-center',
            render: (text) => {
                if (text && moment(text, moment.ISO_8601, true).isValid()) {
                    return moment(text).format('YYYY-MM-DD');
                }
                return 'N/A';
            }
        },
    ];

    // Fetch data khi component mount
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                if (selectedClassId && selectedModuleId) {
                    const data = await fetchDataLog(selectedClassId, selectedModuleId);
                    console.log("data Log", data)
                    if (data && data.length > 0) {
                        const formattedData = data.map((item) => ({
                            key: item.id.toString(),
                            className: item.className,
                            moduleName: item.moduleName,
                            trainerId: item.trainerId,
                            changedContent: item.changedContent,
                            oldValue: item.oldValue,
                            newValue: item.newValue,
                            changedDate: item.changedDate
                        }));
                        setLogData(formattedData);
                    } else {
                        setLogData([]);
                    }
                }
            } catch (error) {
                console.error("Error fetching logs:", error);
                setLogData([]);
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
        setLogData([]);
        setSelectedDate(null);
        setDateRange(null); // Reset date range
        setSearchTerm(""); // Reset search term
    };

    // Update the module selection handler
    const handleModuleChange = (value, option) => {
        setSelectedModule(option.label);
        setSelectedModuleId(value);
        setDateRange(null); // Reset date range
        setSearchTerm(""); // Reset search term
    };

    // Update the date range handler
    const handleDateRangeChange = async (dates) => {
        setDateRange(dates);
        if (dates && dates[0] && dates[1]) {
            setLoading(true);
            try {
                const startDate = dates[0].format('YYYY-MM-DD');
                const endDate = dates[1].format('YYYY-MM-DD');
                const data = await searchLogs(
                    selectedClassId,
                    selectedModuleId,
                    startDate,
                    endDate
                );
                if (data && data.length > 0) {
                    const formattedData = data.map((item) => ({
                        key: item.id.toString(),
                        className: item.className,
                        moduleName: item.moduleName,
                        trainerId: item.trainerId,
                        changedContent: item.changedContent,
                        oldValue: item.oldValue,
                        newValue: item.newValue,
                        changedDate: item.changedDate
                    }));
                    setLogData(formattedData);
                } else {
                    setLogData([]);
                }
            } catch (error) {
                console.error('Error fetching logs:', error);
                setLogData([]);
            } finally {
                setLoading(false);
            }
        }
    };

    // Add search filtering
    const filteredLogs = useMemo(() => {
        if (!searchTerm) return logData;

        return logData.filter(log =>
            log.changedContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.oldValue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.newValue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.trainerId?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [logData, searchTerm]);

    return (
        <div className="px-6  sm:p-5">
            {/* Filter Section */}
            <div className="flex flex-wrap items-start gap-4 mb-4">
                {/* Class Dropdown */}
                <div className="flex-shrink-0 w-full max-w-[200px]">
                    <div className="flex gap-1">
                        <div className="flex gap-1 pb-1">
                            <FaStarOfLife className="text-red-600 w-[7px]" />
                            <label className="text-base sm:text-lg font-medium">Class</label>
                        </div>
                    </div>
                    <SelectBox
                        placeholder="Select Class"
                        className="w-full"
                        options={classOptions}
                        onChange={handleClassChange}
                        value={selectedClassId}
                    />
                </div>

                {/* Module Dropdown */}
                {selectedClassId && (
                    <div className="flex-shrink-0 w-full max-w-[200px]">
                        <div className="flex gap-1 pb-1">
                            <FaStarOfLife className="text-red-600 w-[7px]" />
                            <label className="text-base sm:text-lg font-medium">Module</label>
                        </div>
                        <SelectBox
                            placeholder="Select Module"
                            className="w-full"
                            options={moduleOptions}
                            onChange={handleModuleChange}
                            value={selectedModuleId}
                        />
                    </div>
                )}

                {/* Date Range Picker */}
                {selectedModule && (
                    <div className="flex-shrink-0 w-full max-w-[200px]">
                        <div className="flex gap-1 pb-1">
                            <FaStarOfLife className="text-red-600 w-[7px]" />
                            <label className="text-base sm:text-lg font-medium">Select Report Date</label>
                        </div>
                        <RangePicker
                            onChange={handleDateRangeChange}
                            format={'DD/MM/YYYY'}
                            style={{ width: '100%', border: '1px solid #d9d9d9', height: '32px' }}
                            value={dateRange}
                        />
                    </div>
                )}

                {/* Search Input - Only show when dateRange is selected */}
                {dateRange && (
                    <div className="flex-shrink-0 w-full max-w-[200px]">
                        <div className="flex gap-1 pb-1">
                            <label className="text-base sm:text-lg font-medium">Search</label>
                        </div>
                        <Input
                            placeholder="Search..."
                            className="w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}
            </div>

            {/* Selected Information - Updated layout */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 mb-5 px-2 sm:px-8">
                <div className="text-sm sm:text-[14px] font-[700]">Class: <span className="date">{selectedClass || 'N/A'}</span></div>
                <div className="text-sm sm:text-[14px] font-[700]">Module: <span className="date">{selectedModule || 'N/A'}</span></div>
                <div className="text-sm sm:text-[14px] font-[700]">Start Date: <span className="date">{dateRange ? dateRange[0].format('DD/MM/YYYY') : 'N/A'}</span></div>
                <div className="text-sm sm:text-[14px] font-[700]">End Date: <span className="date">{dateRange ? dateRange[1].format('DD/MM/YYYY') : 'N/A'}</span></div>
            </div>

            {/* Add loading state */}
            {loading && (
                <div className="flex justify-center my-4">
                    <Spin />
                </div>
            )}

            {/* Display logs with existing table structure */}
            {dateRange && (
                <Table
                    dataSource={filteredLogs}
                    columns={columns}
                  
                    pagination={{ pageSize: 4 }}
                    size="middle"
                    scroll={{
                        x: 'calc(700px + 100%)',
                    }}
                />
            )}
        </div>
    );
}

export default Log;
