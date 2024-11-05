import React, { useState, useRef, useEffect } from "react";
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
} from "../../../api/AdminAPI/GeneralData_api";
import DateRangePicker from "./DateRangePicker/DateRangePicker";
import TimeRangeButtons from "./TimeRangeButtons/TimeRangeButtons";

const status = ["Enrolled", "Drop out", "Active", "Rejected"];

const technicals = ["BA", "C#", ".NET", "AI"];

const buttonOptions = [
  { label: "Year to date", value: "year_to_date" },
  { label: "1 year", value: "one_year" },
  { label: "All time", value: "all_time" },
];

const traineeLineData = [
  { month: "JAN", Active: 60, DropOut: 20, Enrolled: 80, Rejected: 5 },
  { month: "FEB", Active: 100, DropOut: 40, Enrolled: 60, Rejected: 10 },
  { month: "MAR", Active: 120, DropOut: 50, Enrolled: 90, Rejected: 12 },
  { month: "APR", Active: 80, DropOut: 20, Enrolled: 40, Rejected: 4 },
  { month: "MAY", Active: 90, DropOut: 30, Enrolled: 50, Rejected: 6 },
  { month: "JUN", Active: 70, DropOut: 10, Enrolled: 30, Rejected: 3 },
  { month: "JUL", Active: 50, DropOut: 15, Enrolled: 25, Rejected: 2 },
  { month: "AUG", Active: 85, DropOut: 25, Enrolled: 60, Rejected: 8 },
  { month: "SEP", Active: 70, DropOut: 20, Enrolled: 45, Rejected: 7 },
  { month: "OCT", Active: 60, DropOut: 18, Enrolled: 38, Rejected: 5 },
];

const lineDataTechnical = [
  { month: "JAN", BA: 60, "C#": 20, ".NET": 80, AI: 30 },
  { month: "FEB", BA: 100, "C#": 40, ".NET": 60, AI: 45 },
  { month: "MAR", BA: 120, "C#": 50, ".NET": 90, AI: 55 },
  { month: "APR", BA: 80, "C#": 20, ".NET": 40, AI: 25 },
  { month: "MAY", BA: 90, "C#": 30, ".NET": 50, AI: 35 },
  { month: "JUN", BA: 70, "C#": 10, ".NET": 30, AI: 20 },
  { month: "JUL", BA: 50, "C#": 15, ".NET": 25, AI: 15 },
  { month: "AUG", BA: 85, "C#": 25, ".NET": 60, AI: 40 },
  { month: "SEP", BA: 70, "C#": 20, ".NET": 45, AI: 30 },
  { month: "OCT", BA: 60, "C#": 18, ".NET": 38, AI: 22 },
];

const getDataKey = (status) => {
  if (status === "Drop out") return "DropOut";
  return status;
};

const GeneralData = () => {
  const account = localStorage.getItem("trainerAccount");

  const [loadingTechnicalManager, setLoadingTechnicalManager] = useState(true);
  const [technicalManager, setTechnicalManager] = useState([]);

  const dropdownStatusRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [activeButton, setActiveButton] = useState(null);
  const [loadingDistribution, setLoadingDistribution] = useState(true);
  const [totalClasses, setTotalClasses] = useState(0);
  const [classDistributionData, setClassDistributionData] = useState([]);
  const [startDateDistribution, setStartDateDistribution] = useState(null);
  const [endDateDistribution, setEndDateDistribution] = useState(null);

  const dropdownRef = useRef(null);
  const [isOpenTech, setIsOpenTech] = useState(false);
  const [selectedTech, setSelectedTech] = useState([]);
  const [activeButtonTechnical, setActiveButtonTechnical] = useState(null);
  const [isTechnicalChecked, setIsTechnicalChecked] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [classStatusData, setClassStatusData] = useState([]);
  const [startDateClassStatus, setStartDateClassStatus] = useState(null);
  const [endDateClassStatus, setEndDateClassStatus] = useState(null);

  // Function to show an error notification using Ant Design
  const openErrorNotification = (message) => {
    notification.error({
      message: "Error Notification",
      description: message,
      placement: "topRight",
    });
  };

  //get mockapi technical manager
  useEffect(() => {
    setLoadingTechnicalManager(true);
    fetch(
      "https://me99v.wiremockapi.cloud/api/v1/statistics/technical-manager?year=2024"
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          setTechnicalManager(data.data);
        } else {
          openErrorNotification("No data available for Technical Manager!");
        }
        setLoadingTechnicalManager(false);
      })
      .catch((error) => {
        openErrorNotification("Failed to load Technical Manager data!");
        setLoadingTechnicalManager(false);
      });
  }, []);

  // //get api class distribution pie chart
  // useEffect(() => {
  //   const loadClassDistribution = async () => {
  //     setLoadingDistribution(true);
  //     try {
  //       const data = await fetchClassDistribution(
  //         account,
  //         startDateDistribution.format("YYYY-MM-DD"),
  //         endDateDistribution.format("YYYY-MM-DD")
  //       );

  //       if (data && data.success && data.data) {
  //         setTotalClasses(data.data.totalClasses);

  //         if (data.data.content.length > 0) {
  //           setClassDistributionData(
  //             data.data.content.map((item) => ({
  //               name: item.technicalGroup,
  //               value: item.numberClasses,
  //             }))
  //           );
  //         } else {
  //           setClassDistributionData([]);
  //         }
  //       } else {
  //         setClassDistributionData([]);
  //         setTotalClasses(0);
  //       }
  //     } catch (error) {
  //       openErrorNotification("Failed to load Class Distribution data!");
  //     } finally {
  //       setLoadingDistribution(false);
  //     }
  //   };

  //   if (startDateDistribution && endDateDistribution) {
  //     loadClassDistribution();
  //   }
  // }, [account, startDateDistribution, endDateDistribution]);

  // //get api class status pie chart
  // useEffect(() => {
  //   const loadClassStatusRatio = async () => {
  //     setLoadingStatus(true);
  //     try {
  //       const data = await fetchClassStatus(
  //         account,
  //         startDateClassStatus.format("YYYY-MM-DD"),
  //         endDateClassStatus.format("YYYY-MM-DD")
  //       );

  //       if (data && data.success && data.data) {
  //         if (data.data.content.length > 0) {
  //           setClassStatusData(
  //             data.data.content.map((item) => ({
  //               name: item.status,
  //               value: item.numberClasses,
  //             }))
  //           );
  //         } else {
  //           setClassStatusData([]);
  //         }
  //       } else if (!data.success) {
  //         openErrorNotification("Failed to load Class Status Ratio data!");
  //         setClassStatusData([]);
  //       }
  //     } catch (error) {
  //       openErrorNotification("Failed to load Class Status Ratio data!");
  //     } finally {
  //       setLoadingStatus(false);
  //     }
  //   };

  //   if (startDateClassStatus && endDateClassStatus) {
  //     loadClassStatusRatio();
  //   }
  // }, [account, startDateClassStatus, endDateClassStatus]);

  //get mockapi class distribution pie chart
  useEffect(() => {
    setLoadingDistribution(true);
    fetch(
      "https://671b2132acf9aa94f6aca5ce.mockapi.io/api/v1/statistics/class-distribution/Classdistribution"
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data[0]?.data) {
          setTotalClasses(data[0].data.totalClasses);
          setClassDistributionData(
            data[0].data.content.map((item) => ({
              name: item.technicalGroup,
              value: item.numberClasses,
            }))
          );
        } else {
          openErrorNotification("No data available for Class Distribution!");
        }
        setLoadingDistribution(false);
      })
      .catch((error) => {
        openErrorNotification("Failed to load Class Distribution data!");
        setLoadingDistribution(false);
      });
  }, []);

  //get mockapi class status pie chart
  useEffect(() => {
    setLoadingStatus(true);
    fetch(
      "https://671f40bae7a5792f052d895d.mockapi.io/api/v1/statistics/class-status-ratio"
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data[0]?.data) {
          setClassStatusData(
            data[0].data.content.map((item) => ({
              name: item.status,
              value: item.numberClasses,
            }))
          );
        } else {
          openErrorNotification("No data available for Class Status Ratio!");
        }
        setLoadingStatus(false);
      })
      .catch((error) => {
        openErrorNotification("Failed to load Class Status Ratio data!");
        setLoadingStatus(false);
      });
  }, []);

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  const handleButtonClickTechnical = (button) => {
    setActiveButtonTechnical(button);
  };

  const handleTechnicalCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsTechnicalChecked(checked);
    setSelectedTech(checked ? [...technicals] : []);
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

  const filteredDataTechnical = lineDataTechnical.map((entry) => {
    const filteredEntry = { month: entry.month };
    const techsToShow = selectedTech.length ? selectedTech : technicals;

    techsToShow.forEach((tech) => {
      if (entry[tech] !== undefined) {
        filteredEntry[tech] = entry[tech];
      }
    });

    return filteredEntry;
  });

  const filteredDataStatus = traineeLineData.map((entry) => {
    const filteredEntry = { month: entry.month };
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
    if (selectedTech.length === technicals.length) {
      setIsTechnicalChecked(true);
    } else {
      setIsTechnicalChecked(false);
    }
  }, [selectedTech]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  return loadingTechnicalManager && loadingDistribution && loadingStatus ? (
    <div className="flex justify-start items-center">
      <Spin size="large" />
    </div>
  ) : (
    <div className="h-[calc(100vh-179px)] px-5 overflow-auto [&::-webkit-scrollbar]:w-2  [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-5">
        {dataTotal.map((item, index) => (
          <div
            key={index}
            className="bg-blue-950 text-white text-lg rounded-xl flex items-center justify-around p-5"
          >
            <div>
              <p>{item.value}</p>
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
          <LineChart data={filteredDataStatus} technical={false} />
        </div>
        <div className="flex-[0.3] flex flex-col items-center justify-end">
          <div className="max-xl:mt-5 flex">
            <DateRangePicker
              startDate={startDateDistribution}
              endDate={endDateDistribution}
              onStartDateChange={setStartDateDistribution}
              onEndDateChange={setEndDateDistribution}
            />
          </div>
          <TechnicalGroupPieChart
            data={classDistributionData}
            totalClasses={totalClasses}
            ariaLabelledby="Class Distribution of Technical Groups"
          />
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
                        <div className="absolute top-full left-0 w-28 bg-gray-100 z-50 border border-gray-300 rounded-md mt-1">
                          {technicals.map((option) => (
                            <label
                              key={option}
                              className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer"
                            >
                              <span>{option}</span>
                              <input
                                type="checkbox"
                                className="ml-auto"
                                checked={selectedTech.includes(option)}
                                onChange={() =>
                                  handleCheckboxChangeTechnical(option)
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
                    <input type="checkbox" id="student" />
                  </div>
                </div>
                <div className="max-md:flex max-md:justify-center">
                  <TimeRangeButtons
                    activeButton={activeButtonTechnical}
                    onClick={handleButtonClickTechnical}
                    buttonOptions={buttonOptions}
                  />
                </div>
              </div>
            </div>
            <LineChart data={filteredDataTechnical} technical={true} />
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
            <ClassStatusPieChart
              data={classStatusData}
              ariaLabelledby="Class Status Radio By Site Over Time"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralData;
