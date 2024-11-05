import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { SelectBox, SelectOption } from '../../../../components/Admin/Selectbox/SelectBox'
import { fetchDataClass, fetchDataClassAdmin, fetchDataTrainer } from "../../../../api/ScheduleTracker_api";
import "./ScheduleTracker.css";
import { Input } from "antd";
import DataTable from "./Table/DataTable";
import ExcelJS from 'exceljs';
import formatDate from '../../../../utils/formatDate';
import { saveAs } from 'file-saver';
import { SearchOutlined } from "@ant-design/icons";
import Date from "../../../../components/Admin/SelectDate/Date";
import moment from "moment";
import { CiFilter } from "react-icons/ci";


function ScheduleTracker() {
    const [scheduleData, setScheduleData] = useState([]);
    const [filteredScheduleData, setFilteredScheduleData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [tableKey, setTableKey] = useState(0);
    const [filterOptions, setFilterOptions] = useState({
        classOptions: [],
        moduleOptions: [],
        trainerOptions: [],
        deliveryOptions: [],
        statusOptions: [],
        trainingOptions: [],
    });
    const [filters, setFilters] = useState({
        selectedMethod: null,
        selectedClass: [],
        selectedTrainer: null,
        selectedModule: [],
        selectedDelivery: [],
        selectedStatus: [],
        selectedTraining: [],
    });
    const [dateFilters, setDateFilters] = useState({
        scheduleStartDate: null,
        scheduleEndDate: null,
        actualStartDate: null,
        actualEndDate: null,
    });
    const [showFilterPopup, setShowFilterPopup] = useState(false);

    useEffect(() => {
        if (filters.selectedModule.length > 0) {
            // Tăng tableKey để buộc DataTable render lại
            setTableKey(prevKey => prevKey + 1);
        }
    }, [filters.selectedModule]);

    useEffect(() => {
        if (filters.selectedMethod === "ClassName") {
            fetchData(fetchDataClass);
        } else if (filters.selectedMethod === "Trainer") {
            fetchData(fetchDataTrainer);
        } else if (filters.selectedMethod === "ClassAdmin") {
            fetchData(fetchDataClassAdmin);
        }
    }, [filters.selectedMethod]);

    useEffect(() => {
        if (searchTerm) {
            filterScheduleData({
                ...filters,
                searchTerm
            });
        }
    }, [searchTerm]);

    const fetchData = async (fetchFunction) => {
        try {

            const result = await fetchFunction();


            if (Array.isArray(result)) {
                setScheduleData(result);
                setFilteredScheduleData(result);
                setFilterOptions({
                    classOptions: getUniqueOptions(result, "className"),
                    moduleOptions: getUniqueOptions(result, "moduleName"),
                    trainerOptions: getUniqueOptions(result, "trainerId"),
                    deliveryOptions: [
                        { label: "Select All", value: "all" },
                        ...getUniqueOptions(result, "contentDeliveryType"),
                    ],
                    statusOptions: [
                        { label: "Select All", value: "all" },
                        ...getUniqueOptions(result, "contentIsDone"),
                    ],
                    trainingOptions: [
                        { label: "Select All", value: "all" },
                        ...getUniqueOptions(result, "contentTrainingFormat"),
                    ],
                });
            } else {
                setFilterOptions({
                    classOptions: [],
                    moduleOptions: [],
                    trainerOptions: [],
                    deliveryOptions: [],
                    statusOptions: [],
                    trainingOptions: [],
                });
            }
        } catch (error) {
            setFilterOptions({
                classOptions: [],
                moduleOptions: [],
                trainerOptions: [],
                deliveryOptions: [],
                statusOptions: [],
                trainingOptions: [],
            });
        }
    };

    const getUniqueOptions = (data, key) => {
        if (!data || !Array.isArray(data)) {
            return [];
        }
        if (key === "contentIsDone") {
            return [
                { label: "Reported", value: "Reported" },
                { label: "On going", value: "On going" },
            ];
        }

        const validItems = data.filter(item => item && item[key]);


        const uniqueValues = [...new Set(validItems.map(item => item[key]))];


        return uniqueValues.map(option => ({
            label: option,
            value: option,
        }));
    };

    const handleSelectMethod = (value) => {
        setFilters({
            selectedMethod: value,
            selectedClass: [],
            selectedTrainer: null,
            selectedModule: [],

            selectedDelivery: [],
            selectedStatus: [],
            selectedTraining: [],
        });

        // Reset date filters
        setDateFilters({
            scheduleStartDate: null,
            scheduleEndDate: null,
            actualStartDate: null,
            actualEndDate: null,
        });
        setSearchTerm("");
        setFilteredScheduleData(scheduleData);
    };

    const handleDateChange = (key, value) => {
        setDateFilters((prev) => ({
            ...prev,
            [key]: value,
        }));

        // Trigger filtering with updated date
        filterScheduleData({
            ...filters,
            dateFilters: {
                ...dateFilters,
                [key]: value,
            },
        });
    };

    const handleFilterChange = (key, value) => {
        let updatedValue = value;

        if (value.includes("all")) {
            const allOptions = (filterOptions[`${key}Options`] || [])
                .filter((option) => option.value !== "all")
                .map((option) => option.value);
            updatedValue = value.length === 1 ? allOptions : [];
        }

        const resetFilters = (key === "selectedClass") || (key === "selectedTrainer") ? {
            selectedModule: [],
            selectedDelivery: [],
            selectedStatus: [],
            selectedTraining: [],
            dateFilters: {
                scheduleStartDate: null,
                scheduleEndDate: null,
                actualStartDate: null,
                actualEndDate: null,
            },
        } : {};

        setFilters((prevFilters) => ({
            ...prevFilters,
            ...resetFilters,
            [key]: updatedValue,
        }));

        filterScheduleData({
            ...filters,
            ...resetFilters,
            [key]: updatedValue,
        });
    };

    const filterScheduleData = (currentFilters) => {
        const {
            selectedClass,
            selectedTrainer,
            selectedModule,
            selectedDelivery,
            selectedStatus,
            selectedTraining,
        } = currentFilters;
        const {
            scheduleStartDate,
            scheduleEndDate,
            actualStartDate,
            actualEndDate,
        } = currentFilters.dateFilters || {};

        const filteredData = scheduleData.filter((item) => {
            const classMatch = !selectedClass.length || selectedClass.includes(item.className);
            const trainerMatch = !selectedTrainer || (item.trainerId && selectedTrainer.includes(item.trainerId));
            const moduleMatch = !selectedModule.length || selectedModule.includes(item.moduleName);
            const deliveryMatch = !selectedDelivery.length ||
                selectedDelivery.includes(item.contentDeliveryType);
            const statusMatch = !selectedStatus.length ||
                selectedStatus.includes(item.contentIsDone ? "Reported" : "On going");
            const trainingMatch = !selectedTraining.length ||
                selectedTraining.includes(item.contentTrainingFormat);
            const searchMatch = !searchTerm ||
                (item.contentDeliveryType &&
                    item.contentDeliveryType.toLowerCase().includes(searchTerm.toLowerCase()));

            const itemPlannedDate = item.contentPlannedDate ? moment(item.contentPlannedDate) : null;
            const itemActualDate = item.topicPlannedDate ? moment(item.topicPlannedDate) : null;

            const scheduleMatch = !scheduleStartDate || !scheduleEndDate || !itemPlannedDate ? true :
                itemPlannedDate.isSameOrAfter(moment(scheduleStartDate, "YYYY-MM-DD")) &&
                itemPlannedDate.isSameOrBefore(moment(scheduleEndDate, "YYYY-MM-DD"));

            const actualMatch = !actualStartDate || !actualEndDate || !itemActualDate ? true :
                itemActualDate.isSameOrAfter(moment(actualStartDate, "YYYY-MM-DD")) &&
                itemActualDate.isSameOrBefore(moment(actualEndDate, "YYYY-MM-DD"));

            return (
                classMatch &&
                trainerMatch &&
                moduleMatch &&
                deliveryMatch &&
                statusMatch &&
                trainingMatch &&
                searchMatch &&
                scheduleMatch &&
                actualMatch
            );
        });

        setFilteredScheduleData(filteredData);
    };

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Schedule Data');

        // Define the columns
        worksheet.columns = [
            { header: 'Topics', key: 'topicName', width: 55 },
            { header: 'Contents', key: 'contentName', width: 40 },
            { header: 'Trainer/Class Admin', key: 'trainerId', width: 20 },
            { header: 'Delivery Type', key: 'contentDeliveryType', width: 20 },
            { header: 'Scheduled Date', key: 'scheduleData', width: 20 },
            { header: 'Actual Date', key: 'reportActualDate', width: 20 },
            { header: 'Duration', key: 'reportDuration', width: 10 },
            { header: 'Note', key: 'reportNote', width: 20 },
            { header: 'Reason for mismatch', key: 'reportReason', width: 20 },
            { header: 'Status', key: 'status', width: 15 },
        ];

        worksheet.spliceRows(1, 0, ['Schedule Tracker']);
        worksheet.mergeCells('A1:A1');

        // Add data rows
        filteredScheduleData.forEach(item => {
            worksheet.addRow({
                topicName: item.topicName,
                contentName: item.contentName,
                trainerId: item.trainerId,
                contentDeliveryType: item.contentDeliveryType,
                scheduleData: item.contentPlannedDate ? formatDate(item.contentPlannedDate, false) : '',
                reportActualDate: item.reportActualDate ? formatDate(item.reportActualDate, false) : '',
                reportDuration: item.reportDuration,
                reportNote: item.reportNote,
                reportReason: item.reportReason,
                status: item.status || 'Reported'
            });
        });

        const mergeCells = (columnIndex) => {
            let startRow = 3; // Start from row 2 (after header)
            let currentValue = worksheet.getCell(startRow, columnIndex).value;

            for (let row = 4; row <= worksheet.rowCount; row++) {
                const cellValue = worksheet.getCell(row, columnIndex).value;

                if (cellValue !== currentValue) {
                    // If there were multiple rows with same value, merge them
                    if (row - 1 > startRow) {
                        worksheet.mergeCells(startRow, columnIndex, row - 1, columnIndex);
                    }
                    // Start new group
                    startRow = row;
                    currentValue = cellValue;
                }
            }

            // Handle the last group
            if (worksheet.rowCount > startRow) {
                worksheet.mergeCells(startRow, columnIndex, worksheet.rowCount, columnIndex);
            }
        };

        // Apply styles to all cells
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };

                cell.alignment = {
                    vertical: 'middle',
                    horizontal: 'center'
                };

                if (rowNumber === 2) {

                    cell.font = { bold: true };
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: '93c47d' }
                    };
                }
            });
        });

        const headerRow = worksheet.getRow(2);
        headerRow.height = 50;

        mergeCells(1); // Topics column
        mergeCells(3); // Trainer column

        // Export the workbook
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'schedule_data.xlsx');
    };

    return (
        <div className="pt-1 px-6">
            <span>

            </span>
            <div className="w-full">
                {/* Track by and Trainer on the same row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 ">
                    <div className="col-span-1">
                        <strong className="text-lg font-medium">Track by:</strong> <br />
                        <Select
                            className="mt-2 w-[80%]"
                            onChange={handleSelectMethod}
                            options={[
                                { label: "Class Admin", value: "ClassAdmin" },
                                { label: "Class Name", value: "ClassName" },
                                { label: "Trainer", value: "Trainer" },
                            ]}
                        />
                    </div>

                    {filters.selectedMethod === "ClassName" && (
                        <div className="col-span-1">
                            <label className="text-lg font-medium">Class Admin</label>
                            <SelectBox
                                options={filterOptions.trainerOptions}
                                className="mt-2 w-[80%]"
                                onChange={(values) => handleFilterChange("selectedTrainer", values)}
                            />
                        </div>
                    )}

                    {filters.selectedMethod === "ClassAdmin" && (
                        <div className="col-span-1">
                            <label className="text-lg font-medium">Class Admin</label>
                            <SelectBox
                                options={filterOptions.trainerOptions}
                                className="mt-2 w-[80%]"
                                onChange={(values) => handleFilterChange("selectedTrainer", values)}
                            />
                        </div>
                    )}


                    {filters.selectedMethod === "Trainer" && (
                        <div className="col-span-1">
                            <label className="text-lg font-medium">Class Admin</label>
                            <SelectBox
                                options={filterOptions.trainerOptions}
                                className="mt-2 w-[80%]"
                                onChange={(value) => {
                                    handleFilterChange("selectedTrainer", value);
                                    if (value) {
                                        setFilters((prevFilters) => ({
                                            ...prevFilters,
                                            selectedClass: [],
                                            selectedModule: [],
                                        }));
                                    }
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Class and Module on the same row */}
                {filters.selectedTrainer && (
                    <div className="grid grid-cols-1 sm:grid-cols-2">
                        <div className="col-span-1">
                            <label className="text-lg font-medium">Class</label>
                            <SelectBox
                                options={filterOptions.classOptions}
                                className="mt-2 w-[80%]"
                                onChange={(values) => handleFilterChange("selectedClass", values)}
                            />
                        </div>

                        {filters.selectedClass.length > 0 && (
                            <div className="col-span-1">
                                <label className="text-lg font-medium">Module</label>
                                <SelectBox
                                    options={filterOptions.moduleOptions}
                                    className="mt-2 w-[80%]"
                                    onChange={(values) => handleFilterChange("selectedModule", values)}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {filters.selectedModule.length > 0 && (
                <div className="w-full sm:w-auto">
                    <label className="text-lg font-medium">Search</label>
                    <div className="flex justify-between items-center">
                        <div className="w-[80%]">
                            <Input
                                placeholder="Search..."
                                className="search w-[100%]"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                }}
                            />
                        </div>

                        <div
                            className="cursor-pointer"
                            onClick={() => setShowFilterPopup(!showFilterPopup)}
                        >
                            <CiFilter size={24} />
                        </div>

                        {/* Filter Popup */}
                        {showFilterPopup && (
                            <>
                                {/* Overlay nền tối */}
                                <div
                                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                                    onClick={() => setShowFilterPopup(false)}
                                />

                                {/* Popup */}
                                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded-lg p-6 z-50 min-w-[400px] max-h-[90vh] overflow-y-auto">
                                    <h2 className="text-xl font-semibold ">Filter</h2>
                                    <hr />

                                    <div className="mt-4">
                                        <div className="flex flex-col">
                                            <strong className="mb-1">Status</strong>
                                            <SelectOption
                                                options={filterOptions.statusOptions}
                                                className="w-full"
                                                placeholder="Please select..."
                                                onChange={(values) => handleFilterChange("selectedStatus", values)}
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <strong className="mb-1">Delivery Type</strong>
                                            <SelectOption
                                                options={filterOptions.deliveryOptions}
                                                className="w-full"
                                                placeholder="Please select..."
                                                onChange={(values) => handleFilterChange("selectedDelivery", values)}
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <strong className="mb-1">Training Format</strong>
                                            <SelectOption
                                                options={filterOptions.trainingOptions}
                                                className="w-full"
                                                placeholder="Please select..."
                                                onChange={(values) => handleFilterChange("selectedTraining", values)}
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <strong className="mb-1">Schedule (start)</strong>
                                            <Date
                                                onChange={handleDateChange}
                                                className="w-[450px]"

                                                dateKey="scheduleStartDate"
                                                placeholder="To date..."
                                            />
                                        </div>

                                        <div className="flex flex-col w-full">
                                            <strong className="mb-1">Schedule (end)</strong>
                                            <Date
                                                onChange={handleDateChange}
                                                className="w-[450px]"
                                                dateKey="scheduleEndDate"
                                                placeholder="To date..."
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <strong className="mb-1">Actual (start)</strong>
                                            <Date
                                                onChange={handleDateChange}
                                                className="w-[450px]"
                                                dateKey="actualStartDate"
                                                placeholder="Topic taught"
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <strong className="mb-1">Actual (end)</strong>
                                            <Date
                                                onChange={handleDateChange}
                                                className="w-[450px]"
                                                dateKey="actualEndDate"
                                                placeholder="To..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="mr-8">
                            <button className="bg-blue-600 p-2 rounded-[30px]" onClick={exportToExcel}>
                                <span className="text-white font-semibold">Export data</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-6">
                {(filters.selectedModule.length > 0 && filters.selectedClass.length > 0) && (
                    <div>
                        {filteredScheduleData.length > 0 ? (
                            <DataTable
                                key={tableKey}
                                data={filteredScheduleData}
                            />
                        ) : (
                            <div>
                                <DataTable
                                    key={tableKey}
                                    data={filteredScheduleData}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ScheduleTracker;
