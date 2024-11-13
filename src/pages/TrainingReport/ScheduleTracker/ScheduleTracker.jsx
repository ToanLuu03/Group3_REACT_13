import React, { useState, useEffect, useMemo, useCallback } from "react";
import { DatePicker, Input, message, Spin } from "antd";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useLocation } from "react-router-dom";
import SelectOptions from "../../../components/portal/SelectOptions.jsx";
import NoteModal from "./NoteModal.jsx";
import ScheduleTable from "./ScheduleTable.jsx";
import TrainerAPI from "../../../services/trainer/index.js";
const ScheduleTracker = ({ collapsed }) => {
  dayjs.extend(isSameOrAfter);
  dayjs.extend(isSameOrBefore);

  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedDeliveryType, setSelectedDeliveryType] = useState(null);
  const [selectedTrainingFormat, setSelectedTrainingFormat] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const [scheduleData, setScheduleData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const location = useLocation();
  const classId = location.state?.classId;
  const token = localStorage.getItem("token");

  const fetchScheduleData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await TrainerAPI.getScheduleByClass(token, classId);
      const data = response.data;
      if (data.length) {
        const firstTopic = data[0].topics[0];
        setDateRange({
          startDate: dayjs(firstTopic.startTime).format("DD/MM/YYYY"),
          endDate: dayjs(firstTopic.endTime).format("DD/MM/YYYY"),
        });
      }
      setScheduleData(data);
    } catch (error) {
      console.error("Error fetching schedule data:", error);
      setError("Failed to fetch schedule data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchScheduleData();
    // console.log("scheduleData", scheduleData);
  }, [fetchScheduleData]);

  const onSingleDateChange = (date, dateString) => {
    setDateRange({ startDate: dateString, endDate: null });
    const filteredByDate = scheduleData
      .flatMap((item) =>
        item.topics.flatMap((topic) =>
          topic.contents.map((content) => ({
            ModuleId: item.id,
            topicId: topic.id,
            topicName: topic.name,
            contentId: content.id,
            contentName: content.name,
            deliveryType: content.deliveryType,
            trainingFormat: content.trainingFormat,
            date: dayjs(content.scheduledTime).format("DD/MM/YYYY"),
            duration: content.duration || 0,
          }))
        )
      )
      .filter((content) =>
        dayjs(content.date, "DD/MM/YYYY").isSame(
          dayjs(dateString, "DD/MM/YYYY")
        )
      );
    setFilteredData(filteredByDate);
  };

  const handleFiltering = useMemo(() => {
    if (!selectedModule) return [];
    return scheduleData
      .filter((item) => item.name === selectedModule)
      .flatMap((item) =>
        item.topics.flatMap((topic) =>
          topic.contents.map((content) => ({
            ModuleId: item.id,
            topicId: topic.id,
            topicName: topic.name,
            contentId: content.id,
            contentName: content.name,
            deliveryType: content.deliveryType,
            trainingFormat: content.trainingFormat,
            date: dayjs(content.scheduledTime).format("DD/MM/YYYY"),
            duration: content.duration || 0,
          }))
        )
      )
      .filter(
        (content) =>
          (!selectedDeliveryType ||
            content.deliveryType === selectedDeliveryType) &&
          (!selectedTrainingFormat ||
            content.trainingFormat === selectedTrainingFormat) &&
          (!dateRange.startDate ||
            dayjs(content.date, "DD/MM/YYYY").isSameOrAfter(
              dayjs(dateRange.startDate, "DD/MM/YYYY")
            )) &&
          (!dateRange.endDate ||
            dayjs(content.date, "DD/MM/YYYY").isSameOrBefore(
              dayjs(dateRange.endDate, "DD/MM/YYYY")
            ))
      );
  }, [
    scheduleData,
    selectedModule,
    selectedDeliveryType,
    selectedTrainingFormat,
    dateRange,
  ]);

  useEffect(() => {
    if (selectedModule) {
      setFilteredData(handleFiltering);
    }
    console.log("Filtered Data:", filteredData);
    // setFilteredData(handleFiltering);
  }, [handleFiltering]);

  const moduleOptions = useMemo(() => {
    return scheduleData.map((item) => ({
      label: item.name,
      value: item.name,
    })) || [];
  }, [scheduleData]);

  const deliveryTypeOptions = useMemo(() => {
    if (!selectedModule) return [];
    return scheduleData
      .filter((item) => item.name === selectedModule)
      .flatMap((item) =>
        item.topics.flatMap((topic) =>
          topic.contents.map((content) => ({
            label: content.deliveryType,
            value: content.deliveryType,
          }))
        )
      )
      .filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.value === value.value)
      );
  }, [selectedModule, scheduleData]);

  const trainingFormatOptions = useMemo(() => {
    if (!selectedModule) return [];
    return scheduleData
      .filter((item) => item.name === selectedModule)
      .flatMap((item) =>
        item.topics.flatMap((topic) =>
          topic.contents.map((content) => ({
            label: content.trainingFormat,
            value: content.trainingFormat,
          }))
        )
      )
      .filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.value === value.value)
      );
  }, [selectedModule, scheduleData]);

  const onModuleChange = (value) => {
    console.log("Selected Module:", value);
    setSelectedModule(value);
    setSelectedDeliveryType(null);
    setSelectedTrainingFormat(null);
    setDateRange({ startDate: null, endDate: null });
  };

  const handleReportClick = () => {
    const reportData = [...filteredData].filter(
      (content) =>
        (!selectedDeliveryType || content.deliveryType === selectedDeliveryType) &&
        (!selectedTrainingFormat || content.trainingFormat === selectedTrainingFormat)
    ).sort((a, b) => a.contentName.localeCompare(b.contentName));

    setFilteredData(reportData); // Pass filtered data to the modal
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setLoading(false);
  };
  const handleCheckboxChange = (isChecked) => setIsCheckboxChecked(isChecked);

  if (loading)
    return (
      <div className="flex justify-center mt-20 ">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  if (error) return <div>{error}</div>;

  return (
    <div
      className={`flex flex-col transition-all duration-300 ${collapsed ? "mr-[0]" : "mr-[0px]"
        }`}
    >
      {/* Main container for the Selects and Inputs in one row */}
      <div className="flex flex-wrap w-full justify-between items-center">
        {/* Module Select */}
        <div className="flex flex-col w-full sm:w-[48%] md:w-[19%] lg:w-[15%] pt-3">
          <h2 className="text-lg font-semibold mb-2">Module</h2>
          <SelectOptions options={moduleOptions} onChange={onModuleChange} />
        </div>

        {/* Delivery Type Select */}
        <div className="flex flex-col w-full sm:w-[48%] md:w-[19%] lg:w-[15%] pt-3">
          <h2 className="text-lg font-semibold mb-2">Delivery Type</h2>
          <SelectOptions
            options={deliveryTypeOptions}
            onChange={setSelectedDeliveryType}
          />
        </div>

        {/* Training Format Select */}
        <div className="flex flex-col w-full sm:w-[48%] md:w-[19%] lg:w-[15%] pt-3">
          <h2 className="text-lg font-semibold mb-2">Training Format</h2>
          <SelectOptions
            options={trainingFormatOptions}
            onChange={setSelectedTrainingFormat}
          />
        </div>

        {/* Date Picker */}
        <div className="flex flex-col w-full sm:w-[48%] md:w-[19%] lg:w-[15%] pt-3">
          <h2 className="text-lg font-semibold mb-2">Schedule Date</h2>
          <DatePicker
            onChange={onSingleDateChange}
            placeholder="Select a date"
            format="DD/MM/YYYY"
            value={
              dateRange.startDate
                ? dayjs(dateRange.startDate, "DD/MM/YYYY")
                : null
            }
          />
        </div>

        {/* Search Input */}
        <div className="flex flex-col w-full sm:w-[48%] md:w-[19%] lg:w-[15%] px-1">
          <h2 className="text-lg font-semibold mb-2">Search</h2>
          <Input placeholder="Enter class code, class name" />
        </div>
      </div>

      {/* Training Table */}
      {selectedModule ? (
        <ScheduleTable
          filteredData={filteredData}
          onCheckboxChange={handleCheckboxChange}
        />
      ) : (
        <div className="flex text-gray-500 text-center p-10 text-3xl font-medium h-[450px] justify-center">
          <div className="flex items-center">
            Please choose a Module
          </div>
        </div>
      )}

      {isCheckboxChecked && (
        <div className="flex justify-end mt-3">
          <div className="rounded-full w-[95px] h-[35px] bg-[#5750DF] flex justify-center">
            <button
              className="text-white font-medium"
              onClick={handleReportClick}
            >
              Report
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      <NoteModal
        visible={isModalVisible}
        onClose={handleModalClose}
        onSubmit={() => setIsModalVisible(false)}
        filteredData={[...filteredData]}
        loading={loading}
        setLoading={setLoading}
      />
    </div>
  );
};

export default ScheduleTracker;
