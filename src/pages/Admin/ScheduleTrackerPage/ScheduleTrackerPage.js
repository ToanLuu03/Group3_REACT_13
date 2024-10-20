import React, { useEffect, useState } from "react";
import { Select } from "antd";
import DataTable from "../../../components/Admin/Table/DataTable";
import {
  fetchDataClass,
  fetchDataTrainer,
} from "../../../api/ScheduleTracker_api";
import {
  SelectBox,
  SelectOption,
} from "../../../components/Admin/Selectbox/SelectBox";
import "./ScheduleTrackerPage.css";
import { useOutletContext } from "react-router-dom";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Date from "../../../components/Admin/SelectDate/Date";
import moment from "moment";

function ScheduleTracker() {
  const [scheduleData, setScheduleData] = useState([]);
  const [filteredScheduleData, setFilteredScheduleData] = useState([]);
  const { selectMenuItem } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState("");

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
  useEffect(() => {
    selectMenuItem("4");
  }, [selectMenuItem]);

  useEffect(() => {
    if (filters.selectedMethod === "Class Name") {
      fetchData(fetchDataClass);
    } else if (filters.selectedMethod === "Trainer") {
      fetchData(fetchDataTrainer);
    }
  }, [filters.selectedMethod]);

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
      }
    } catch (error) {
      console.error("Error fetching schedule data:", error);
    }
  };

  const getUniqueOptions = (data, key) => {
    if (key === "contentIsDone") {
      return [
        { label: "Reported", value: "Reported" },
        { label: "On going", value: "On going" },
      ];
    }
    return [...new Set(data.map((item) => item[key]).filter(Boolean))].map(
      (option) => ({
        label: option,
        value: option,
      })
    );
  };

  const handleSelectMethod = (value) => {
    setFilters({
      ...filters,
      selectedMethod: value,
      selectedClass: [],
      selectedTrainer: null,
      selectedModule: [],
      selectedDelivery: [],
      selectedStatus: [],
      selectedTraining: [],
    });
  };
  const handleDateChange = (key, value) => {
    setDateFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
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

    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: updatedValue,
    }));

    filterScheduleData({
      ...filters,
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
      const classMatch =
        !selectedClass.length || selectedClass.includes(item.className);
      const trainerMatch =
        !selectedTrainer || selectedTrainer.includes(item.trainerId);
      const moduleMatch =
        !selectedModule.length || selectedModule.includes(item.moduleName);
      const deliveryMatch =
        !selectedDelivery.length ||
        selectedDelivery.includes(item.contentDeliveryType);
      const statusMatch =
        !selectedStatus.length ||
        selectedStatus.includes(item.contentIsDone ? "Reported" : "On going");
      const trainingMatch =
        !selectedTraining.length ||
        selectedTraining.includes(item.contentTrainingFormat);
      const searchMatch =
        !searchTerm ||
        (item.contentDeliveryType &&
          item.contentDeliveryType
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));
      const itemPlannedDate = item.contentPlannedDate
        ? moment(item.contentPlannedDate)
        : null;
      const itemActualDate = item.topicPlannedDate
        ? moment(item.topicPlannedDate)
        : null;

      const scheduleMatch =
        (!scheduleStartDate ||
          itemPlannedDate.isSameOrAfter(
            moment(scheduleStartDate, "YYYY-MM-DD")
          )) &&
        (!scheduleEndDate ||
          itemPlannedDate.isSameOrBefore(
            moment(scheduleEndDate, "YYYY-MM-DD")
          ));

      const actualMatch =
        (!actualStartDate ||
          itemActualDate.isSameOrAfter(
            moment(actualStartDate, "YYYY-MM-DD")
          )) &&
        (!actualEndDate ||
          itemActualDate.isSameOrBefore(moment(actualEndDate, "YYYY-MM-DD")));

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

  return (
    <div>
      <h1> Schedule Tracker</h1>

      <div className="tracker-by">
        <span className="text">Track by:</span> <br />
        <Select
          style={{ width: 500 }}
          onChange={handleSelectMethod}
          options={[
            { label: "Class Name", value: "Class Name" },
            { label: "Trainer", value: "Trainer" },
          ]}
        />
      </div>

      {filters.selectedMethod && (
        <div>
          <div className="filters d-flex">
            {filters.selectedMethod === "Trainer" && (
              <div className="filter-item">
                <span className="text">Trainer</span>
                <SelectBox
                  options={filterOptions.trainerOptions}
                  onChange={(value) =>
                    handleFilterChange("selectedTrainer", value)
                  }
                />
              </div>
            )}

            {filters.selectedClass && (
              <div className="filter-item">
                <span className="text">Class</span>
                <SelectBox
                  options={filterOptions.classOptions}
                  mode="multiple"
                  onChange={(values) =>
                    handleFilterChange("selectedClass", values)
                  }
                />
              </div>
            )}
            {filters.selectedClass.length > 0 && ( // Show Module only if Classes are selected
              <div className="filter-item">
                <span className="text">Module</span>
                <SelectBox
                  options={filterOptions.moduleOptions}
                  mode="multiple"
                  onChange={(values) =>
                    handleFilterChange("selectedModule", values)
                  }
                />
              </div>
            )}
          </div>

          <div className="content">
            {filters.selectedModule.length > 0 && (
              <>
                <div className="filter-item">
                  <span className="text">Delivery Type</span>
                  <SelectOption
                    options={filterOptions.deliveryOptions}
                    mode="multiple"
                    onChange={(values) =>
                      handleFilterChange("selectedDelivery", values)
                    }
                  />
                </div>

                <div className="filter-item">
                  <span className="text">Status</span>
                  <SelectOption
                    options={filterOptions.statusOptions}
                    mode="multiple"
                    onChange={(values) =>
                      handleFilterChange("selectedStatus", values)
                    }
                  />
                </div>

                <div className="filter-item">
                  <span className="text">Training Format</span>
                  <SelectOption
                    options={filterOptions.trainingOptions}
                    mode="multiple"
                    onChange={(values) =>
                      handleFilterChange("selectedTraining", values)
                    }
                  />
                </div>

                <div className="select">
                  <span className="text">Schedule (Start)</span>
                  <Date
                    onChange={handleDateChange}
                    dateKey="scheduleStartDate"
                  />
                </div>

                <div className="select">
                  <span className="text">Schedule (End)</span>
                  <Date onChange={handleDateChange} dateKey="scheduleEndDate" />
                </div>
                <div className='select'>
                  <span className='text'>Actual (Start)</span>
                  <Date onChange={handleDateChange} dateKey="actualStartDate" />
                </div>
                <div className='select'>
                  <span className='text'>Actual (End)</span>
                  <Date onChange={handleDateChange} dateKey="actualEndDate" />
                </div>

                <div className="filter-item">
                  <span className="text">Search</span>
                  <div className="d-flex">
                    <Input
                      placeholder="Search..."
                      className="search"
                      style={{ marginLeft: 0, width: "150px" }}
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        filterScheduleData({
                          ...filters,
                          searchTerm: e.target.value,
                        });
                      }}
                    />
                    <div className="icon">
                      <a href="#1">
                        <SearchOutlined className="search-icon" />
                      </a>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {filteredScheduleData.length > 0 && (
        <div style={{ textAlign: 'center' }}>

          <DataTable
            data={filteredScheduleData}
            style={{ textAlign: 'center' }}
          />
        </div>
      )}
    </div>
  );
}

export default ScheduleTracker;
