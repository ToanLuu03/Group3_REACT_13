import React, { useEffect, useState, useMemo, useCallback } from "react";
import { DatePicker, Input, message } from "antd";
import SelectOptions from "../../../../../components/portal/SelectOptions";
import ReportTable from "./ReportTable.jsx";
import { useSelector } from "react-redux";
import TrainerAPI from "../../../../../services/trainer/index.js";
import moment from "moment";
import { debounce } from "lodash"; // Import debounce from lodash

const { RangePicker } = DatePicker;

const ScheduleReport = ({ collapsed }) => {
  const [scheduleReport, setScheduleReport] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedReportClass, setSelectedReportClass] = useState(null);
  const [selectedReportModule, setSelectedReportModule] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  const token = useSelector((state) => state.users.users.userName.token);

  const fetchtrainersReportHistory = useCallback(async () => {
    try {
      const response = await TrainerAPI.trainersReportHistory(token);
      const data = response.data;
      setScheduleReport(data);

      const uniqueClasses = data.map((item) => ({
        value: item.classId,
        label: item.className,
      }));

      setFilteredClasses(uniqueClasses);

      const formattedReportData = data.flatMap((item) =>
        item.modules.flatMap((module) =>
          module.reports.flatMap((report) =>
            report.topics.map((topic) => ({
              classId: item.classId,
              moduleId: module.moduleID,
              date: moment(report.date).format("YYYY-MM-DD"),
              topicName: topic.topicName,
              deliveryType: topic.deliveryType || "N/A",
              trainingFormat: topic.trainingFormat || "N/A",
              duration: report.duration || 0,
              note: report.note || "No notes",
              reason: report.reason || "No reason provided",
            }))
          )
        )
      );

      setReportData(formattedReportData);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch report data");
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchtrainersReportHistory();
    }
  }, [token, fetchtrainersReportHistory]);


  const onClassChange = (classId) => {
    setSelectedReportClass(classId);
    setSelectedReportModule(null);
    setFilteredModules([]);
    setDateRange({ startDate: null, endDate: null });

    const selectedClassData = scheduleReport.find(
      (report) => report.classId === classId
    );

    if (selectedClassData) {
      setDateRange({
        startDate: moment(selectedClassData.modules[0].startDate).format("YYYY-MM-DD"),
        endDate: moment(selectedClassData.modules[0].endDate).format("YYYY-MM-DD"),
      });

      const classModules = selectedClassData.modules.map((module) => ({
        value: module.moduleID,
        label: module.moduleName,
      }));

      setFilteredModules(classModules);
    }
  };

  const onModuleChange = (moduleId) => {
    setSelectedReportModule(moduleId);

    const filteredByModule = reportData.filter(
      (report) =>
        report.classId === selectedReportClass && report.moduleId === moduleId
    );
    setFilteredData(filteredByModule);
  };

  const onDateRangeChange = (dates, dateStrings) => {
    const startDate = dateStrings[0];
    const endDate = dateStrings[1];
    setDateRange({ startDate, endDate });

    const filteredByDate = reportData.filter((report) => {
      const reportDate = moment(report.date);
      return (
        report.classId === selectedReportClass &&
        report.moduleId === selectedReportModule &&
        reportDate.isBetween(startDate, endDate, null, "[]")
      );
    });

    setFilteredData(filteredByDate);
  };

  // Debounced search input
  const handleSearchChange = useCallback(
    debounce((value) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  const filteredClassesBySearch = useMemo(() => {
    if (!searchQuery) return filteredClasses;
    return filteredClasses.filter(
      (option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.value.toString().includes(searchQuery)
    );
  }, [filteredClasses, searchQuery]);

  const allFieldsSelected = selectedReportClass && selectedReportModule;

  return (
    <div
      className={`flex flex-col m-5 transition-all duration-300 ${collapsed ? "mr-[0]" : "mr-[0px]"}`}
    >
      <div className="flex flex-wrap justify-between items-center gap-4">
        {/* Left side (Class, Module, Report Date) */}
        <div className="flex flex-wrap gap-4 sm:w-full lg:w-auto flex-grow">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Class</h2>
            <SelectOptions
              options={filteredClassesBySearch}
              onChange={onClassChange}
              value={selectedReportClass}
            />
          </div>

          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Module</h2>
            <SelectOptions
              options={filteredModules}
              onChange={onModuleChange}
              value={selectedReportModule}
            />
          </div>

          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Report Date</h2>
            <RangePicker
              onChange={onDateRangeChange}
              value={
                dateRange.startDate && dateRange.endDate
                  ? [moment(dateRange.startDate), moment(dateRange.endDate)]
                  : null
              }
              format="DD/MM/YYYY"
            />
          </div>
        </div>

        {/* Right side (Search input) */}
        <div className="flex flex-col sm:w-full lg:w-auto">
          <h2 className="text-lg font-semibold mb-2">Search</h2>
          <Input
            placeholder="Enter class code, class name"
            className="w-full"
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-wrap lg:flex-row justify-between mt-4">
        <div className="sm:w-full lg:w-1/2">
          {selectedReportModule && (
            <div className="text-sm">
              <span className="font-semibold">Module:</span>{" "}
              {filteredModules.find((option) => option.value === selectedReportModule)?.label}
            </div>
          )}
        </div>

        <div className="sm:w-full lg:w-1/2 px-4">
          {dateRange.startDate && dateRange.endDate && (
            <div className="flex items-center">
              <div className="text-sm w-1/2">
                <span className="font-semibold">Start Date:</span> {dateRange.startDate}
              </div>
              <div className="text-sm w-1/2">
                <span className="font-semibold">End Date:</span> {dateRange.endDate}
              </div>
            </div>
          )}
        </div>
      </div>

      {allFieldsSelected ? (
        <>
          <ReportTable reportData={filteredData} />
          <div className="flex justify-end p-4 font-medium">
            Duration Total: {filteredData.reduce((total, report) => total + report.duration, 0)} h
          </div>
        </>
      ) : (
        <div className="flex text-gray-500 text-center p-10 text-3xl font-medium h-[450px] justify-center">
          <div className="flex items-center">No data available</div>
        </div>
      )}
    </div>
  );
};

export default ScheduleReport;
