import { DatePicker, InputNumber, notification, Select } from "antd";
import React, { useEffect, useState } from "react";
import {
  get_Module_data,
  getByModule,
  getStatisticsByModuleName,
} from "../../../../api/AdminAPI/StatisticsFeedback";

const { RangePicker } = DatePicker;
const { Option } = Select;

function TrainingProgramContent() {
  const [moduleOptions, setModuleOptions] = useState([]);
  const [moduleValue, setModuleValue] = useState([]);
  const [moduleData, setModuleData] = useState([]);
  const [filteredModuleData, setFilteredModuleData] = useState([]);
  const [moduleDetailData, setModuleDetailData] = useState(null);
  const [goodFeedbackList, setGoodFeedbackList] = useState(null);
  const [badFeedbackList, setBadFeedbackList] = useState(null);
  const [minAverage, setMinAverage] = useState(0);
  const [maxAverage, setMaxAverage] = useState(5);
  const [selectDisabled, setSelectDisabled] = useState(false);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await get_Module_data();
        if (response.success) {
          const modules = response.data.map((item) => item.module);
          setModuleOptions(modules);
        } else {
          throw new Error(response.message || "Failed to fetch module data.");
        }
      } catch (error) {
        notification.error({
          message: "Error",
          description: "Failed to fetch module data. Please try again later.",
          duration: 3,
        });
      }
    };

    fetchModules();
  }, []);

  const fetchModuleData = async (selectedModules) => {
    try {
      const response = await getByModule({ modules: selectedModules });
      if (response.success) {
        setModuleData(response.data);
      } else {
        notification.error({
          message: "Error",
          description: response.message,
          duration: 3,
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch data.",
        duration: 3,
      });
    }
  };

  const handleModuleClick = async (moduleName) => {
    handleCloseDetailTable();
    const response = await getStatisticsByModuleName(moduleName);

    if (response.success) {
      if (response.data && response.data.length > 0) {
        const updatedFeedbackList = response.data.map((feedback) => ({
          ...feedback,
          moduleName,
        }));
        setModuleDetailData(updatedFeedbackList);
      } else {
        setTimeout(() => {
          notification.warning({
            message: "No Details Available",
            duration: 3,
          });
        }, 500);
      }
    } else {
      notification.error({
        message: "Error",
        description: response.message || "Failed to fetch module details.",
        duration: 3,
      });
    }
  };

  const handleGoodFeedbackClick = (feedbackList, moduleName) => {
    if (feedbackList.length === 0) {
      handleCloseGoodFeedbackTable();
      setTimeout(() => {
        notification.warning({
          message: "No reason to show",
          duration: 3,
        });
      }, 500);
    } else {
      const updatedFeedbackList = feedbackList.map((feedback) => ({
        ...feedback,
        moduleName,
      }));
      setGoodFeedbackList(updatedFeedbackList);
    }
  };

  const handleBadFeedbackClick = (feedbackList, moduleName) => {
    if (feedbackList.length === 0) {
      handleCloseBadFeedbackTable();
      setTimeout(() => {
        notification.warning({
          message: "No reason to show",
          duration: 3,
        });
      }, 500);
    } else {
      const updatedFeedbackList = feedbackList.map((feedback) => ({
        ...feedback,
        moduleName,
      }));
      setBadFeedbackList(updatedFeedbackList);
    }
  };

  const handleCloseDetailTable = () => {
    setModuleDetailData(null);
  };

  const handleCloseGoodFeedbackTable = () => {
    setGoodFeedbackList(null);
  };

  const handleCloseBadFeedbackTable = () => {
    setBadFeedbackList(null);
  };

  useEffect(() => {
    const filteredData = moduleData.filter((item) => {
      const averageRating =
        typeof item.averageRating === "number" && !isNaN(item.averageRating)
          ? item.averageRating
          : 0;
      return averageRating >= minAverage && averageRating <= maxAverage;
    });

    setFilteredModuleData(filteredData);

    if (moduleValue.length !== 0 && filteredData.length === 0) {
      notification.open({
        message: "No modules found for the average score range",
        type: "warning",
      });
    }
  }, [minAverage, maxAverage, moduleData]);

  const handleSelectAll = async (selectedValues) => {
    if (selectedValues.includes("all")) {
      if (selectedValues.length === moduleOptions.length + 1) {
        setModuleValue([]);
        setModuleData([]);
        setSelectDisabled(true);
        setTimeout(() => setSelectDisabled(false), 500);
        handleCloseDetailTable();
        handleCloseBadFeedbackTable();
        handleCloseGoodFeedbackTable();
      } else {
        setModuleValue(moduleOptions);
        setSelectDisabled(true);
        setTimeout(() => setSelectDisabled(false), 500);
        await fetchModuleData(moduleOptions);
      }
    } else {
      setModuleValue(selectedValues);
      if (selectedValues.length > 0) {
        await fetchModuleData(selectedValues);
      } else {
        setModuleData([]);
      }
    }
  };

  useEffect(() => {
    if (!moduleValue.length) {
      setModuleData([]);
    }
  }, [moduleValue]);

  const tagRender = ({ values = [], allOptions }) => {
    if (!Array.isArray(values)) {
      values = [];
    }

    if (values.length === allOptions.length) {
      return <span>Select All</span>;
    }

    if (values.length === 1)
      return values[0].length > 30 ? values[0].slice(0, 30) + "..." : values[0];
    else {
      const textString = values.slice(0, 3).join(", ");

      return textString.length > 30
        ? textString.slice(0, 30) + "..."
        : textString;
    }
  };

  return (
    <div className="bg-white p-5 mb-6">
      <div className="flex flex-col xl:flex-row items-start space-y-5 xl:space-y-0 xl:space-x-10 mb-10">
        {/* Time */}
        <div className="flex flex-col items-start space-y-1 w-[300px]">
          <div className="font-semibold">Time</div>
          <RangePicker style={{ width: "300px", height: 32 }} />
        </div>

        {/* Module */}
        <div className="flex flex-col items-start space-y-1 w-[300px]">
          <div className="font-semibold">Module</div>
          <Select
            className="w-[300px]"
            mode="multiple"
            placeholder="Select Module"
            value={moduleValue}
            onChange={handleSelectAll}
            maxTagCount={0}
            disabled={selectDisabled}
            tagRender={() =>
              tagRender({
                values: moduleValue,
                allOptions: moduleOptions,
              })
            }
          >
            <Option value="all">Select All</Option>
            {moduleOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </div>

        {/* Average Score Range */}
        <div className="flex flex-col items-start space-y-1 w-[300px]">
          <div className="font-semibold">Average Score Range</div>
          <div className="flex items-center space-x-2">
            <InputNumber
              value={minAverage}
              min={0}
              max={5}
              step={0.1}
              className="w-14 h-[32px]"
              onChange={(value) => setMinAverage(value)}
            />
            <span>-</span>
            <InputNumber
              value={maxAverage}
              min={0}
              max={5}
              step={0.1}
              className="w-14 h-[32px]"
              onChange={(value) => setMaxAverage(value)}
            />
          </div>
        </div>
      </div>

      {filteredModuleData.length > 0 && (
        <div className="mt-4 max-h-[275px] overflow-x-auto overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300">
          <table className="w-[1050px] mx-auto bg-white border-2 border-blue-600 ">
            <thead className=" bg-blue-300 italic">
              <tr>
                <th className="px-4 py-2 border-b border-gray-200">No.</th>
                <th className="px-4 py-2 border-b border-x border-x-slate-400">
                  Module
                </th>
                <th className="px-4 py-2 border-b border-gray-200">
                  Number Class
                </th>
                <th className="px-4 py-2 border-b border-x border-x-slate-400">
                  Number of Feedbacks
                </th>
                <th className="px-4 py-2 border-b border-gray-200">
                  Good Feedback
                </th>
                <th className="px-4 py-2 border-b border-x border-x-slate-400">
                  Bad Feedback
                </th>
                <th className="px-4 py-2 border-b border-gray-200">Average</th>
              </tr>
            </thead>
            <tbody>
              {filteredModuleData.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border-b border-gray-200 text-center">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 border-b bg-orange-100 border-x border-gray-200">
                    {item.moduleName}
                  </td>
                  <td
                    className="px-4 py-2 border-b border-gray-200 text-center cursor-pointer text-amber-400 underline"
                    onClick={() => handleModuleClick(item.moduleName)}
                  >
                    {item.numberOfClass}
                  </td>
                  <td className="px-4 py-2 border-b  border-x border-gray-200 text-center">
                    {item.feedBack}
                  </td>
                  <td
                    className="px-4 py-2 border-b border-gray-200 text-green-500 text-center cursor-pointer underline"
                    onClick={() =>
                      handleGoodFeedbackClick(
                        item.goodFeedbackList,
                        item.moduleName
                      )
                    }
                  >
                    {item.goodFeedback}
                  </td>
                  <td
                    className="px-4 py-2 border-b border-gray-200 text-blue-500 text-center cursor-pointer underline"
                    onClick={() =>
                      handleBadFeedbackClick(
                        item.badFeedbackList,
                        item.moduleName
                      )
                    }
                  >
                    {item.badFeedback}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200 text-red-500 text-center">
                    {isNaN(item.averageRating)
                      ? "N/A"
                      : item.averageRating.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {moduleDetailData && (
        <>
          <div className="flex items-center mx-1 my-5">
            <div className="flex-grow flex justify-center">
              <div className="h-[2px] w-2/3 bg-black"></div>
            </div>

            <span
              className="rounded-md px-3 text-white bg-red-400 cursor-pointer ml-2"
              onClick={handleCloseDetailTable}
            >
              X
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-[1050px] mx-auto bg-white border-2 border-blue-600">
              <thead className=" bg-blue-300 italic">
                <tr>
                  <th className="px-4 py-2 border-b border-gray-200">No.</th>
                  <th className="px-4 py-2 border-b border-x border-x-slate-400">
                    Module
                  </th>
                  <th className="px-4 py-2 border-b border-gray-200">Class</th>
                  <th className="px-4 py-2 border-b border-x border-x-slate-400">
                    Trainer
                  </th>
                  <th className="px-4 py-2 border-b border-gray-200">
                    Good Feedback
                  </th>
                  <th className="px-4 py-2 border-b border-x border-x-slate-400">
                    Bad Feedback
                  </th>
                  <th className="px-4 py-2 border-b border-gray-200">
                    Average
                  </th>
                </tr>
              </thead>
              <tbody>
                {moduleDetailData.map((detail, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border-b bg-orange-100 border-gray-200 text-center">
                      {index + 1}
                    </td>
                    {index === 0 && (
                      <td
                        className="px-4 py-2 border-b border-x border-gray-200 text-center"
                        rowSpan={moduleDetailData.length}
                      >
                        {detail.moduleName}
                      </td>
                    )}
                    <td className="px-4 py-2 border-b border-gray-200 text-center">
                      {detail.className}
                    </td>
                    <td className="px-4 py-2 border-b border-x border-gray-200 text-center">
                      {detail.trainerName}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200 text-center text-green-500">
                      {detail.goodFeedback}
                    </td>
                    <td className="px-4 py-2 border-b border-x border-gray-200 text-center text-blue-500">
                      {detail.badFeedback}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200 text-center text-red-500">
                      {isNaN(detail.averageRating)
                        ? "N/A"
                        : detail.averageRating.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {goodFeedbackList && (
        <div className="overflow-x-auto mt-6">
          <div className="flex items-center mx-1 my-5">
            <div className="flex-grow flex justify-center">
              <div className="h-[2px] w-2/3 bg-black"></div>
            </div>

            <span
              className="rounded-md px-3 text-white bg-red-400 cursor-pointer ml-2"
              onClick={handleCloseGoodFeedbackTable}
            >
              X
            </span>
          </div>
          <table className="w-[1050px] mx-auto bg-white border-2 border-blue-600">
            <thead className="bg-blue-300 italic">
              <tr>
                <th className="w-[50px] px-4 py-2 border-b border-gray-200">
                  No.
                </th>
                <th className="w-[150px] px-4 py-2 border-b border-x border-x-slate-400">
                  Class
                </th>
                <th className="w-[150px] px-4 py-2 border-b border-r border-r-slate-400">
                  Trainer
                </th>
                <th className="w-[150px] px-4 py-2 border-b border-r border-r-slate-400">
                  Module
                </th>
                <th className="w-[300px] px-4 py-2 border-b border-gray-200">
                  Reason For Good Feedbacks
                </th>
              </tr>
            </thead>
            <tbody>
              {goodFeedbackList.map((feedback, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border-b border-gray-200 text-center">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 border-b border-x bg-orange-100 border-gray-200 text-center">
                    {feedback.className}
                  </td>
                  <td className="px-4 py-2 border-b border-r border-gray-200 text-center">
                    {feedback.trainerName}
                  </td>
                  {index === 0 && (
                    <td
                      className="px-4 py-2 border-b border-x bg-orange-100 border-gray-200 text-center"
                      rowSpan={goodFeedbackList.length}
                    >
                      {feedback.moduleName}
                    </td>
                  )}
                  <td className="px-4 py-2 border-b border border-gray-200 text-center">
                    {feedback.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {badFeedbackList && (
        <div className="overflow-x-auto mt-6">
          <div className="flex items-center mx-1 my-5">
            <div className="flex-grow flex justify-center">
              <div className="h-[2px] w-2/3 bg-black"></div>
            </div>
            <span
              className="rounded-md px-3 bg-red-400 text-white cursor-pointer ml-2"
              onClick={handleCloseBadFeedbackTable}
            >
              X
            </span>
          </div>
          <table className="w-[1050px] mx-auto bg-white border-2 border-blue-600">
            <thead className="bg-blue-300 italic">
              <tr>
                <th className="w-[50px] px-4 py-2 border-b border-gray-200">
                  No.
                </th>
                <th className="w-[150px] px-4 py-2 border-b border-x border-x-slate-400">
                  Class
                </th>
                <th className="w-[150px] px-4 py-2 border-b border-r border-r-slate-400">
                  Trainer
                </th>
                <th className="w-[150px] px-4 py-2 border-b border-r border-r-slate-400">
                  Module
                </th>
                <th className="w-[300px] px-4 py-2 border-b border-gray-200">
                  Reason For Bad Feedbacks
                </th>
              </tr>
            </thead>
            <tbody>
              {badFeedbackList.map((feedback, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border-b border-gray-200 text-center">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 border-b border-x bg-orange-100 border-gray-200 text-center">
                    {feedback.className}
                  </td>
                  <td className="px-4 py-2 border-b border-r border-gray-200 text-center">
                    {feedback.trainerName}
                  </td>
                  {index === 0 && (
                    <td
                      className="px-4 py-2 border-b border-x border-gray-200 bg-orange-100 text-center"
                      rowSpan={badFeedbackList.length}
                    >
                      {feedback.moduleName}
                    </td>
                  )}
                  <td className="px-4 py-2 border-b border-gray-200 text-center">
                    {feedback.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TrainingProgramContent;
