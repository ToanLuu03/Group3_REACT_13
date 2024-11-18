import React, { useState, useEffect, useMemo } from "react";
import { DatePicker, Input, Table, Spin } from "antd";
import { SelectBox } from "../../../../components/Admin/Selectbox/SelectBox";
import { FaStarOfLife } from "react-icons/fa6";
import { fetchDataLog, searchLogs, fetchDataLogClass, fetchDataLogModule } from "../../../../api/ScheduleTracker_api";
import moment from 'moment';

const { RangePicker } = DatePicker;

function isDateInRange(date, startDate, endDate) {
    if (!date || !startDate || !endDate) return true; // Nếu không có ngày, trả về true
    const momentDate = moment(date);
    return momentDate.isSameOrAfter(moment(startDate, "YYYY-MM-DD")) &&
           momentDate.isSameOrBefore(moment(endDate, "YYYY-MM-DD"));
}

function Log() {

    const [dateRange, setDateRange] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [logData, setLogData] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [selectedModuleId, setSelectedModuleId] = useState(null);
    const [classOptions, setClassOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modules, setModules] = useState([]);
    const [data, setData] = useState([]);

    const columns = [
        {
            title: () => <div className=" font-bold">Topic</div>,
            dataIndex: 'moduleName',
            key: 'content',
            fixed: 'left',
            className: 'w-[150px] sm:w-[300px]',
            Align: 'left'
        },
        {
            title: () => <div className="text-center font-bold">Contents</div>,
            dataIndex: 'className',
            key: 'topic',
            fixed: 'left',
            width: 150,
            responsive: ['md'],
            className: 'text-center',
        },
        {
            title: () => <div className="text-center font-bold">Trainer/Class Admin</div>,
            dataIndex: 'trainerId',
            key: 'trainer',
            className: 'text-center',
            responsive: ['lg'],
        },
        {
            title: () => <div className="text-center font-bold">Changed Content</div>,
            dataIndex: 'changedContent',
            key: 'changedContent',
            className: 'text-center min-w-[120px]',
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
            className: 'text-center min-w-[100px]',
            responsive: ['sm'],
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
            className: 'text-center min-w-[100px]',
            responsive: ['sm'],
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
            className: 'text-center min-w-[100px]',
            render: (text) => {
                if (text && moment(text, moment.ISO_8601, true).isValid()) {
                    return moment(text).format('YYYY-MM-DD');
                }
                return 'N/A';
            }
        },
    ];

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
    };

    const handleClassChange = async (value) => {
        setSelectedClassId(value);
        setSelectedModuleId(null);
        setLogData([]);
        setDateRange(null);
        setModules([]);
        setSearchTerm("");

        if (value) {
            try {
                const modulesData = await fetchDataLogModule(value); // Fetch modules based on selected class
                console.log('Fetched Modules:', modulesData); // Log fetched modules
                setModules(modulesData.map(mod => ({ label: mod.moduleName, value: mod.moduleId }))); // Map to options

            } catch (error) {
                console.error('Failed to fetch modules:', error);
            }
        }
    };

    // Update the selected module handler
    const handleModuleChange = async (value) => {
        setSelectedModuleId(value); // Update selectedModuleId
        setSearchTerm(""); // Reset search term when module changes

        if (value) {
            // Call fetchDataLog API based on selectedClassId and selectedModuleId
            try {
                const logData = await fetchDataLog(selectedClassId, value); // Fetch log data
                console.log('Fetched Log Data:', logData); // Log fetched data
                // Process and set log data as needed
                setLogData(logData); // Assuming logData is in the correct format
            } catch (error) {
                console.error('Failed to fetch log data:', error);
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
    }, [logData, searchTerm, selectedClassId, selectedModuleId, dateRange]);

    useEffect(() => {
        const loadClassOptions = async () => {
            setLoading(true);
            try {
                const classes = await fetchDataLogClass(); // Fetch class data
                setClassOptions(classes.map(cls => ({ label: cls.className, value: cls.classId }))); // Map to options
            } catch (error) {
                console.error('Failed to fetch class options:', error);
                alert('Có lỗi xảy ra khi tải dữ liệu lớp. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        loadClassOptions();
    }, []);

    useEffect(() => {
        const loadModules = async () => {
            if (selectedClassId) { // Check if a class is selected
                try {
                    const modulesData = await fetchDataLogModule(selectedClassId); // Fetch modules based on selected class
                    console.log('Fetched Modules:', modulesData); // Log fetched modules
                    setModules(modulesData.map(mod => ({ label: mod.moduleName, value: mod.moduleId }))); // Map to options

                } catch (error) {
                    console.error('Failed to fetch modules:', error);
                }
            }
        };

        loadModules();
    }, [selectedClassId]); // Dependency on selectedClassId

    useEffect(() => {
        const fetchLogData = async () => {
            if (selectedClassId && selectedModuleId) {
                try {
                    const logData = await fetchDataLog(selectedClassId, selectedModuleId); // Lấy dữ liệu log
                    setData(logData); // Cập nhật state data
                } catch (error) {
                    console.error('Failed to fetch log data:', error);
                }
            }
        };

        fetchLogData();
    }, [selectedClassId, selectedModuleId]); // Theo dõi selectedClassId và selectedModuleId

    const fetchData = async () => {
        if (dateRange && dateRange[0] && dateRange[1]) {
            setLoading(true);
            setLogData([]);

            try {
                const startDate = dateRange[0].startOf('day').format('YYYY-MM-DD');
                const endDate = dateRange[1].endOf('day').format('YYYY-MM-DD');

                // Ensure data is defined and is an array
                if (Array.isArray(data) && data.length > 0) {
                    const filteredData = data.filter(item => {
                        const changedDate = moment(item.changedDate).format('YYYY-MM-DD');
                        // Sử dụng hàm isDateInRange để kiểm tra
                        return isDateInRange(changedDate, startDate, endDate);
                    });

                    if (filteredData.length > 0) {
                        const formattedData = filteredData.map((item) => ({
                            key: item.id.toString(),
                            className: item.className,
                            moduleName: item.moduleName,
                            trainerId: item.trainerId,
                            changedContent: item.changedContent,
                            oldValue: item.oldValue,
                            newValue: item.newValue,
                            changedDate: moment(item.changedDate).format('YYYY-MM-DD')
                        }));
                        setLogData(formattedData);
                    } else {
                        console.log('No data found within the selected date range.'); // Thông báo nếu không có dữ liệu trong khoảng thời gian
                    }
                } else {
                    console.log('No data found for the selected date range.'); // Thông báo nếu không có dữ liệu
                }
            } catch (error) {
                console.error('Error details:', error);
                setLogData([]);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [dateRange, selectedClassId, selectedModuleId]); // Theo dõi dateRange, selectedClassId và selectedModuleId

    return (
        <div className="px-6 sm:p-5">
            {/* Filter Section */}
            <div className="flex flex-wrap items-start gap-4 mb-4">
                {/* Class Dropdown */}
                <div className="flex-shrink-0 w-full max-w-[200px]">
                    <div className="flex gap-1">
                        <FaStarOfLife className="text-red-600 w-[7px]" />
                        <label className="text-base sm:text-lg font-medium">Class</label>
                    </div>
                    <SelectBox
                        placeholder="Select Class"
                        className="w-full"
                        options={classOptions}
                        value={selectedClassId}
                        allowClear={true}
                        showSearch={true}
                        onChange={handleClassChange} // Update selectedClassId on change
                        filterOption={(input, option) =>
                            option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    />
                </div>

                {/* Module Dropdown - Only show when a class is selected */}
                {selectedClassId && (
                    <div className="flex-shrink-0 w-full max-w-[200px]">
                        <div className="flex gap-1">
                            <FaStarOfLife className="text-red-600 w-[7px]" />
                            <label className="text-base sm:text-lg font-medium">Module</label>
                        </div>
                        <SelectBox
                            placeholder="Select Module"
                            className="w-full"
                            options={modules} // Use the fetched modules
                            value={selectedModuleId}
                            onChange={handleModuleChange} // Update selectedModuleId and fetch log data
                        />
                    </div>
                )}

                {/* Date Range Picker - Only show when a module is selected */}
                {selectedModuleId && (
                    <div className="flex-shrink-0 w-full max-w-[200px]">
                        <div className="flex gap-1">
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
                        <div className="flex gap-1">
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

            {dateRange && (

                < div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 mb-5 px-2 sm:px-8">
                    <div className="text-sm sm:text-[14px] font-[700]">Class: <span className="date">{classOptions.find(cls => cls.value === selectedClassId)?.label || 'N/A'}</span></div>
                    <div className="text-sm sm:text-[14px] font-[700]">Module: <span className="date">{modules.find(mod => mod.value === selectedModuleId)?.label || 'N/A'}</span></div>
                    <div className="text-sm sm:text-[14px] font-[700]">Start Date: <span className="date">{dateRange ? dateRange[0].format('DD/MM/YYYY') : 'N/A'}</span></div>
                    <div className="text-sm sm:text-[14px] font-[700]">End Date: <span className="date">{dateRange ? dateRange[1].format('DD/MM/YYYY') : 'N/A'}</span></div>
                </div>

            )}

            {
                loading && (
                    <div className="flex justify-center my-4">
                        <Spin />
                    </div>
                )
            }
            {
                dateRange && (
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex justify-center my-4">
                                <Spin size="large" />
                            </div>
                        ) : (
                            <Table
                                dataSource={filteredLogs}
                                columns={columns}
                                pagination={{ pageSize: 4 }}
                                size="middle"
                                scroll={{
                                    x: true,
                                }}
                            />
                        )}
                    </div>
                )
            }
        </div >
    );
}

export default Log;
