import React, { useState, useRef, useEffect, useMemo } from "react";
import LineChart from "./LineChart/LineChart";
import TechnicalGroupPieChart from "./ClassDistributionPieChart/ClassDistributionPieChart";
import ClassStatusPieChart from "./ClassStatusPieChart/ClassStatusPieChart";
import { MdArrowDropDown } from "react-icons/md";
import IconHome from "../../../assets/image/icon_home.png";
import IconUser from "../../../assets/image/icon _person.png";
import IconWerench from "../../../assets/image/icon _wrench.png";
import { notification, Spin } from "antd";
import {
  fetchClassDistribution,
  fetchClassStatus,
  fetchTechnicalManager,
  fetchTraineeStatistics,
} from "../../../api/AdminAPI/GeneralData_api";
import DateRangePicker from "./DateRangePicker/DateRangePicker";
import TimeRangeButtons from "./TimeRangeButtons/TimeRangeButtons";
import CountUp from "react-countup";

const status = ["Enrolled", "Drop out", "Active", "Rejected"];

const buttonOptions = [
  { label: "Year to date", value: "year_to_date" },
  { label: "1 year", value: "one_year" },
  { label: "All time", value: "all_time" },
];

const getDataKey = (status) => {
  if (status === "Drop out") return "DropOut";
  return status;
};

const GeneralData = () => {
  const account = localStorage.getItem("username");

  const [technicalManager, setTechnicalManager] = useState({
    technicalData: [],
    totalClasses: 0,
    totalTechnicalGroups: 0,
    totalTrainees: 0,
    totalTrainer: 0,
  });

  const dropdownStatusRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [activeButton, setActiveButton] = useState(null);
  const [totalClasses, setTotalClasses] = useState(0);
  const [classDistributionData, setClassDistributionData] = useState([]);
  const [startDateDistribution, setStartDateDistribution] = useState(null);
  const [endDateDistribution, setEndDateDistribution] = useState(null);

  const dropdownRef = useRef(null);
  const [isOpenTech, setIsOpenTech] = useState(false);
  const [selectedTech, setSelectedTech] = useState([]);
  const [activeButtonTechnical, setActiveButtonTechnical] = useState(null);
  const [isTechnicalChecked, setIsTechnicalChecked] = useState(false);
  const [classStatusData, setClassStatusData] = useState([]);
  const [startDateClassStatus, setStartDateClassStatus] = useState(null);
  const [endDateClassStatus, setEndDateClassStatus] = useState(null);
  const [isStudentChecked, setIsStudentChecked] = useState(false);
  const [chartTraineeLineData, setChartTraineeLineData] = useState([]);
  const [buttonDataCache, setButtonDataCache] = useState({
    year_to_date: null,
    one_year: null,
    all_time: null,
  });
  const [loadingTraineeLine, setLoadingTraineeLine] = useState(false);
  const [loadingClassDistribution, setLoadingClassDistribution] =
    useState(false);
  const [loadingClassStatus, setLoadingClassStatus] = useState(false);
  const [loadingTechnicalLine, setLoadingTechnicalLine] = useState(false);

  const openErrorNotification = (message) => {
    notification.error({
      message: "Error Notification",
      description: message,
      placement: "topRight",
    });
  };
  const [isLoading, setIsLoading] = useState(true);

  const fetchOverviewData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchTechnicalManager(true, false, false);
      if (data && data.data) {
        setTechnicalManager((prev) => ({
          ...prev,
          totalClasses: data.data.totalClasses,
          totalTechnicalGroups: data.data.totalTechnicalGroups,
          totalTrainees: data.data.totalTrainees,
          totalTrainer: data.data.totalTrainer,
        }));
      } else {
        openErrorNotification("Failed to load overview data!");
      }
    } catch (error) {
      openErrorNotification("Error loading overview data!");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  //get api class distribution pie chart
  useEffect(() => {
    const loadClassDistribution = async () => {
      setLoadingClassDistribution(true);
      try {
        const data = await fetchClassDistribution(
          account,
          startDateDistribution.format("YYYY-MM-DD"),
          endDateDistribution.format("YYYY-MM-DD")
        );

        if (data && data.success && data.data) {
          setTotalClasses(data.data.totalClasses);

          if (data.data.content.length > 0) {
            setClassDistributionData(
              data.data.content.map((item) => ({
                name: item.technicalGroup,
                value: item.numberClasses,
              }))
            );
          } else {
            setClassDistributionData([]);
          }
        } else {
          setClassDistributionData([]);
          setTotalClasses(0);
        }
      } catch (error) {
        openErrorNotification("Failed to load Class Distribution data!");
      } finally {
        setLoadingClassDistribution(false);
      }
    };

    if (startDateDistribution && endDateDistribution) {
      loadClassDistribution();
    }
  }, [account, startDateDistribution, endDateDistribution]);

  //get api class status pie chart
  useEffect(() => {
    const loadClassStatusRatio = async () => {
      setLoadingClassStatus(true);
      try {
        const data = await fetchClassStatus(
          account,
          startDateClassStatus.format("YYYY-MM-DD"),
          endDateClassStatus.format("YYYY-MM-DD")
        );

        if (data && data.success && data.data) {
          if (data.data.content.length > 0) {
            setClassStatusData(
              data.data.content.map((item) => ({
                name: item.status,
                value: item.numberClasses,
              }))
            );
          } else {
            setClassStatusData([]);
          }
        } else if (!data.success) {
          openErrorNotification("Failed to load Class Status Ratio data!");
          setClassStatusData([]);
        }
      } catch (error) {
        openErrorNotification("Failed to load Class Status Ratio data!");
      } finally {
        setLoadingClassStatus(false);
      }
    };

    if (startDateClassStatus && endDateClassStatus) {
      loadClassStatusRatio();
    }
  }, [account, startDateClassStatus, endDateClassStatus]);

  const handleButtonClick = async (button) => {
    setActiveButton(button);
    setLoadingTraineeLine(true);

    if (buttonDataCache[button.value]) {
      setChartTraineeLineData(buttonDataCache[button.value]);
      setLoadingTraineeLine(false);
      return;
    }

    try {
      const data = await fetchTraineeStatistics();
      if (data && data.success && data.data) {
        let filteredData;

        if (
          button.value === "year_to_date" ||
          button.value === "year_to_date"
        ) {
          const currentYear = new Date().getFullYear();
          filteredData = data.data.filter(
            (entry) => entry.labelDate && entry.labelDate.includes(currentYear)
          );
        } else if (button.value === "one_year") {
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
          filteredData = data.data.filter(
            (entry) =>
              new Date(entry.labelDate) >= oneYearAgo &&
              new Date(entry.labelDate) <= new Date()
          );
        } else {
          filteredData = data.data;
        }
        setLoadingTraineeLine(false);
        setChartTraineeLineData(filteredData);
        setButtonDataCache((prevCache) => ({
          ...prevCache,
          [button.value]: filteredData,
        }));
      } else {
        notification.error({
          message: "Data Load Failed",
          description: "Failed to load trainee data. Please try again later.",
        });
        setLoadingTraineeLine(false);
      }
    } catch (error) {
      notification.error({
        message: "Error Fetching Data",
        description:
          "An error occurred while fetching trainee data. Please check your connection or try again later.",
      });
      setLoadingTraineeLine(false);
    }
  };

  const handleButtonClickTechnical = async (button) => {
    setActiveButtonTechnical(button);
    setLoadingTechnicalLine(true);

    if (!isTechnicalChecked && !isStudentChecked) {
      openErrorNotification("Please select either 'Technical' or 'Student'.");
      setLoadingTechnicalLine(false);
      return;
    }

    const allTime = button === "all_time";
    const yearToDate = button === "year_to_date";
    const oneYear = button === "one_year";

    try {
      const data = await fetchTechnicalManager(allTime, yearToDate, oneYear);
      if (data && data.data) {
        let technicalData = [];
        let startDate = null;
        let endDate = null;
        const allTechnologies = new Set();

        const monthNames = [
          "JAN",
          "FEB",
          "MAR",
          "APR",
          "MAY",
          "JUN",
          "JUL",
          "AUG",
          "SEP",
          "OCT",
          "NOV",
          "DEC",
        ];

        if (allTime) {
          const years = Object.keys(data.data.technicalManager.year).sort();
          const firstYear = years[0];
          const lastYear = years[years.length - 1];

          startDate = `01 JAN ${firstYear.slice(-2)}`;
          endDate = `31 DEC ${lastYear.slice(-2)}`;

          technicalData = Object.entries(data.data.technicalManager.year).map(
            ([year, yearData]) => {
              let entry = {
                labelDate: year,
                totalTraineePerTech: {},
                totalClassPerTech: {},
              };

              Object.values(yearData.moth).forEach((monthData) => {
                Object.values(monthData.day).forEach((dayData) => {
                  if (isTechnicalChecked) {
                    Object.entries(dayData.totalClassPerTech || {}).forEach(
                      ([tech, value]) => {
                        allTechnologies.add(tech);
                        entry.totalClassPerTech[tech] =
                          (entry.totalClassPerTech[tech] || 0) + value;
                      }
                    );
                  }

                  if (isStudentChecked) {
                    Object.entries(dayData.totalTraineePerTech || {}).forEach(
                      ([tech, value]) => {
                        allTechnologies.add(tech);
                        entry.totalTraineePerTech[tech] =
                          (entry.totalTraineePerTech[tech] || 0) + value;
                      }
                    );
                  }
                });
              });

              return entry;
            }
          );
        } else if (yearToDate || oneYear) {
          const currentYear = new Date().getFullYear().toString();
          const monthlyData =
            data.data.technicalManager.year[currentYear]?.moth || {};
          if (Object.keys(monthlyData).length > 0) {
            const firstMonth = Object.keys(monthlyData)[0];
            const firstDay = Object.keys(monthlyData[firstMonth].day)[0];
            startDate = `${String(firstDay).padStart(2, "0")} ${monthNames[firstMonth - 1]
              } ${currentYear.slice(-2)}`;

            const lastMonth = Object.keys(monthlyData).pop();
            const lastDay = Object.keys(monthlyData[lastMonth].day).pop();
            endDate = `${String(lastDay).padStart(2, "0")} ${monthNames[lastMonth - 1]
              } ${currentYear.slice(-2)}`;

            technicalData = Object.entries(monthlyData).map(
              ([month, monthData]) => {
                let entry = {
                  labelDate: monthNames[parseInt(month) - 1],
                  totalTraineePerTech: {},
                  totalClassPerTech: {},
                };

                Object.values(monthData.day).forEach((dayData) => {
                  if (isTechnicalChecked) {
                    Object.entries(dayData.totalClassPerTech || {}).forEach(
                      ([tech, value]) => {
                        allTechnologies.add(tech);
                        entry.totalClassPerTech[tech] =
                          (entry.totalClassPerTech[tech] || 0) + value;
                      }
                    );
                  }

                  if (isStudentChecked) {
                    Object.entries(dayData.totalTraineePerTech || {}).forEach(
                      ([tech, value]) => {
                        allTechnologies.add(tech);
                        entry.totalTraineePerTech[tech] =
                          (entry.totalTraineePerTech[tech] || 0) + value;
                      }
                    );
                  }
                });

                return entry;
              }
            );
          }
        }

        technicalData.forEach((entry) => {
          allTechnologies.forEach((tech) => {
            if (isTechnicalChecked) {
              entry.totalClassPerTech[tech] =
                entry.totalClassPerTech[tech] || 0;
            }
            if (isStudentChecked) {
              entry.totalTraineePerTech[tech] =
                entry.totalTraineePerTech[tech] || 0;
            }
          });
        });

        setTechnicalManager((prev) => ({
          ...prev,
          technicalData: technicalData,
          startDate: startDate,
          endDate: endDate,
        }));
      } else {
        openErrorNotification("No data available for Technical Manager!");
      }
    } catch (error) {
      openErrorNotification("Failed to load Technical Manager data!");
    } finally {
      setLoadingTechnicalLine(false);
    }
  };


  const formatChartData = (
    data,
    isTechnicalChecked,
    isStudentChecked,
    selectedTech
  ) => {
    return data.map((entry) => {
      const formattedEntry = { labelDate: entry.labelDate };

      if (isTechnicalChecked && !isStudentChecked) {
        Object.entries(entry.totalClassPerTech || {}).forEach(
          ([tech, value]) => {
            if (
              selectedTech.length === 0 ||
              selectedTech.includes(`${tech}_Classes`)
            ) {
              formattedEntry[`${tech}_Classes`] = value;
            }
          }
        );
      }

      if (isStudentChecked && !isTechnicalChecked) {
        Object.entries(entry.totalTraineePerTech || {}).forEach(
          ([tech, value]) => {
            if (selectedTech.length === 0 || selectedTech.includes(tech)) {
              formattedEntry[tech] = value;
            }
          }
        );
      }

      if (isTechnicalChecked && isStudentChecked) {
        Object.entries(entry.totalClassPerTech || {}).forEach(
          ([tech, value]) => {
            if (
              selectedTech.length === 0 ||
              selectedTech.includes(`${tech}_Classes`)
            ) {
              formattedEntry[`${tech}_Classes`] = value;
            }
          }
        );
        Object.entries(entry.totalTraineePerTech || {}).forEach(
          ([tech, value]) => {
            if (selectedTech.length === 0 || selectedTech.includes(tech)) {
              formattedEntry[tech] = value;
            }
          }
        );
      }

      return formattedEntry;
    });
  };

  const [formattedDataTechnical, setFormattedDataTechnical] = useState([]);

  useEffect(() => {
    if (technicalManager.technicalData.length > 0) {
      const newLinesConfig = generateLinesConfig(
        technicalManager.technicalData
      );
      setLinesConfig(newLinesConfig);

      const updatedData = formatChartData(
        technicalManager.technicalData,
        isTechnicalChecked,
        isStudentChecked,
        selectedTech
      );
      setFormattedDataTechnical(updatedData);
    }
  }, [
    technicalManager.technicalData,
    selectedTech,
    isTechnicalChecked,
    isStudentChecked,
  ]);

  const generateLinesConfig = (data) => {
    const uniqueKeys = new Set();

    data.forEach((entry) => {
      Object.keys(entry.totalTraineePerTech || {}).forEach((key) => {
        uniqueKeys.add(key);
      });
      Object.keys(entry.totalClassPerTech || {}).forEach((key) => {
        uniqueKeys.add(`${key}_Classes`);
      });
    });

    return Array.from(uniqueKeys).map((key) => ({ dataKey: key }));
  };

  const [linesConfig, setLinesConfig] = useState([]);

  useEffect(() => {
    if (technicalManager.technicalData.length > 0) {
      const newLinesConfig = generateLinesConfig(
        technicalManager.technicalData
      );
      setLinesConfig(newLinesConfig);
    }
  }, [technicalManager.technicalData]);

  const handleTechnicalCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsTechnicalChecked(checked);
    setSelectedTech(checked ? [...linesConfig] : []);
  };

  const handleCheckboxChangeTechnical = (tech) => {
    setSelectedTech((prev) =>
      prev.includes(tech)
        ? prev.filter((item) => item !== tech)
        : [...prev, tech]
    );
  };

  const handleCheckboxChangeStatus = (option) => {
    setSelectedStatus((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleStudentCheckboxChange = (e) => {
    setIsStudentChecked(e.target.checked);
  };

  const formattedData = useMemo(() => {
    if (!chartTraineeLineData || chartTraineeLineData.length === 0) return [];

    if (activeButton === "year_to_date" || activeButton === "one_year") {
      const currentYear = new Date().getFullYear();
      const monthlyData = chartTraineeLineData.find(
        (yearData) => yearData.year === currentYear.toString()
      );

      return monthlyData
        ? monthlyData.months.map((month) => ({
          labelDate: month.month,
          Active: month.days.reduce((sum, day) => sum + day.status.ACTIVE, 0),
          DropOut: month.days.reduce(
            (sum, day) => sum + day.status.DROP_OUT,
            0
          ),
          Enrolled: month.days.reduce(
            (sum, day) => sum + day.status.ENROLLED,
            0
          ),
          Rejected: month.days.reduce(
            (sum, day) => sum + day.status.REJECTED,
            0
          ),
        }))
        : [];
    }

    return chartTraineeLineData.map((yearData) => ({
      labelDate: yearData.year,
      Active: yearData.months.reduce(
        (sum, month) =>
          sum +
          month.days.reduce((sumDays, day) => sumDays + day.status.ACTIVE, 0),
        0
      ),
      DropOut: yearData.months.reduce(
        (sum, month) =>
          sum +
          month.days.reduce((sumDays, day) => sumDays + day.status.DROP_OUT, 0),
        0
      ),
      Enrolled: yearData.months.reduce(
        (sum, month) =>
          sum +
          month.days.reduce((sumDays, day) => sumDays + day.status.ENROLLED, 0),
        0
      ),
      Rejected: yearData.months.reduce(
        (sum, month) =>
          sum +
          month.days.reduce((sumDays, day) => sumDays + day.status.REJECTED, 0),
        0
      ),
    }));
  }, [chartTraineeLineData, activeButton]);

  const filteredDataStatus = formattedData.map((entry) => {
    const filteredEntry = { labelDate: entry.labelDate };
    const statusesToShow = selectedStatus.length ? selectedStatus : status;

    statusesToShow.forEach((status) => {
      const dataKey = getDataKey(status);
      if (entry[dataKey] !== undefined) {
        filteredEntry[dataKey] = entry[dataKey];
      }
    });

    return filteredEntry;
  });

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleDropdownTechnical = () => {
    setIsOpenTech((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (
      dropdownStatusRef.current &&
      !dropdownStatusRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpenTech(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isTechnicalChecked && !isStudentChecked) {
      setActiveButtonTechnical(null);
    }
  }, [isTechnicalChecked, isStudentChecked]);

  const dataTotal = [
    {
      value: technicalManager.totalClasses,
      label: "Total classes",
      icon: IconHome,
    },
    {
      value: technicalManager.totalTrainees,
      label: "Total trainees",
      icon: IconUser,
    },
    {
      value: technicalManager.totalTrainer,
      label: "Total trainer",
      icon: IconUser,
    },
    {
      value: technicalManager.totalTechnicalGroups,
      label: "Technical groups",
      icon: IconWerench,
    },
  ];

  const disableTimeRangeButtons = !isTechnicalChecked && !isStudentChecked;

  return (
    <div className="h-[calc(100vh-179px)] overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {dataTotal.map((item, index) => (
          <div
            key={index}
            className="bg-blue-950 text-white text-lg rounded-xl flex items-center justify-around p-5 max-md:justify-between"
          >
            <div>
              <p>
                <CountUp
                  start={isLoading ? 0 : null}
                  end={isLoading ? 0 : item.value}
                  duration={1}
                  preserveValue
                />
              </p>
              {item.label}
            </div>
            <div className="size-12 rounded-full  bg-purple-900 flex justify-center items-center">
              <img src={item.icon} alt="My Icon" className="size-9 p-1" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-5 max-xl:block ">
        <div className="flex-[0.7]">
          <div>
            <h2 className="font-semibold text-xl mb-5">Trainee Management</h2>
            <div className="flex flex-wrap  items-center justify-center gap-5 mb-5 max-sm:gap-1 max-sm:items-start">
              <div
                ref={dropdownStatusRef}
                className="px-4 text-gray-500 w-36 py-[2px] rounded-xl border border-gray-300 inline-block relative"
              >
                <button
                  className="w-full text-left flex justify-around items-center"
                  onClick={toggleDropdown}
                >
                  Status <MdArrowDropDown />
                </button>

                {isOpen && (
                  <div className="absolute top-full left-0 w-36 bg-gray-100 z-50 border border-gray-300 rounded-md mt-1">
                    {status.map((option) => (
                      <label
                        key={option}
                        className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      >
                        <span>{option}</span>
                        <input
                          type="checkbox"
                          className="ml-auto"
                          checked={selectedStatus.includes(option)}
                          onChange={() => handleCheckboxChangeStatus(option)}
                        />
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <TimeRangeButtons
                  activeButton={activeButton}
                  onClick={handleButtonClick}
                  buttonOptions={buttonOptions}
                />
              </div>
            </div>
          </div>
          {loadingTraineeLine ? (
            <div className="flex justify-center items-center h-[300px]">
              <Spin size="large" />
            </div>
          ) : (
            <LineChart data={filteredDataStatus} technical={false} />
          )}
        </div>
        <div className="flex-[0.3] flex flex-col items-center justify-end">
          <div className="flex">
            <DateRangePicker
              startDate={startDateDistribution}
              endDate={endDateDistribution}
              onStartDateChange={setStartDateDistribution}
              onEndDateChange={setEndDateDistribution}
            />
          </div>
          {loadingClassDistribution ? (
            <div className="flex justify-center items-center h-[300px]">
              <Spin size="large" />
            </div>
          ) : (
            <TechnicalGroupPieChart
              data={classDistributionData}
              totalClasses={totalClasses}
              ariaLabelledby="Class Distribution of Technical Groups"
            />
          )}
        </div>
      </div>
      <div>
        <div className="flex gap-5 max-xl:block">
          <div className="flex-[0.7]">
            <div className="mt-5">
              <h2 className="font-semibold text-xl mb-5">
                Techtical Management
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-5 mb-5 max-md:items-start">
                <div className="flex justify-between border w-60 px-2 py-[2px] border-gray-300 rounded-xl">
                  <div ref={dropdownRef} className="flex items-center">
                    <div className="px-1 mr-1 text-gray-500 w-28 rounded-xl border border-gray-300 inline-block relative">
                      <button
                        className="w-full text-left flex justify-around items-center"
                        onClick={toggleDropdownTechnical}
                      >
                        Technical
                      </button>

                      {isOpenTech && (
                        <div className="absolute top-full left-[-30px] w-[180px] bg-gray-100 z-50 border border-gray-300 rounded-md mt-1">
                          {linesConfig.map((option) => (
                            <label
                              key={option.dataKey}
                              className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer"
                            >
                              <span>{option.dataKey}</span>
                              <input
                                type="checkbox"
                                className="ml-auto"
                                checked={selectedTech.includes(option.dataKey)}
                                onChange={() =>
                                  handleCheckboxChangeTechnical(option.dataKey)
                                }
                              />
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      id="technical"
                      checked={isTechnicalChecked}
                      onChange={handleTechnicalCheckboxChange}
                    />
                  </div>
                  <div className="flex items-center">
                    <label htmlFor="student" className="mr-1 cursor-pointer">
                      Student
                    </label>
                    <input
                      type="checkbox"
                      id="student"
                      checked={isStudentChecked}
                      onChange={handleStudentCheckboxChange}
                    />
                  </div>
                </div>
                <div className="max-md:flex max-md:justify-center">
                  <TimeRangeButtons
                    activeButton={activeButtonTechnical}
                    onClick={handleButtonClickTechnical}
                    buttonOptions={buttonOptions}
                    disabled={disableTimeRangeButtons}
                  />
                </div>
              </div>
            </div>
            {loadingTechnicalLine ? (
              <div className="flex w-full justify-center items-center h-[320px]">
                <Spin size="large" />
              </div>
            ) : (
              <div className="h-[320px]">
                <LineChart
                  data={formattedDataTechnical}
                  technical={true}
                  startDate={technicalManager.startDate}
                  endDate={technicalManager.endDate}
                  linesConfig={linesConfig}
                />
              </div>
            )}
          </div>
          <div className="flex-[0.3] flex flex-col items-center justify-end">
            <div className="max-xl:mt-5 flex">
              <DateRangePicker
                startDate={startDateClassStatus}
                endDate={endDateClassStatus}
                onStartDateChange={setStartDateClassStatus}
                onEndDateChange={setEndDateClassStatus}
              />
            </div>
            {loadingClassStatus ? (
              <div className="flex justify-center items-center h-[320px]">
                <Spin size="large" />
              </div>
            ) : (
              <div className="h-[320px] w-full">
                <ClassStatusPieChart
                  data={classStatusData}
                  ariaLabelledby="Class Status Radio By Site Over Time"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralData;
