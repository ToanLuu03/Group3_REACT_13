import React, { useState, useEffect, useMemo } from "react";
import { Modal, Button, DatePicker, Input } from "antd";
import { useSelector } from "react-redux";
import TrainerAPI from "../../../../../services/trainer";
import dayjs from "dayjs";

const ReportModal = ({
  visible,
  onClose,
  onSubmit,
  filteredData,
}) => {
  const { TextArea } = Input;
  const [errors, setErrors] = useState({});
  const token = useSelector((state) => state.users?.users?.userName?.token);
  const [isLoading, setIsLoading] = useState(false);
  // Initialize form data
  const [formData, setFormData] = useState({
    faClassId: null,
    moduleId: null,
    duration: null,
    dateTime: null,
    reason: "",
    note: "",
    dailyReportCreateTopicDTOS: [],
  });

  // Memoize filteredData processing to avoid unnecessary recalculations
  const dailyReportCreateTopicDTOS = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    // Check that topicId belongs to the correct moduleId
    return filteredData.map((item) => {
      if (item.moduleId === formData.moduleId) {
        return {
          id: item.topicId,
          dailyReportCreateContentDTOS: [{ id: item.contentId }]
        };
      } else {
        return null; // or handle error
      }
    }).filter(item => item !== null); // filter out invalid data
  }, [filteredData, formData.moduleId]);

  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      const firstData = filteredData[0];

      setFormData((prev) => ({
        ...prev,
        faClassId: firstData.faClassId || null,
        moduleId: firstData.moduleId || null,
        duration: firstData.duration || null,
        dateTime: firstData.date ? dayjs(firstData.date).format('YYYY-MM-DD') : null,
        dailyReportCreateTopicDTOS: dailyReportCreateTopicDTOS,
      }));
    }
  }, [filteredData, dailyReportCreateTopicDTOS]);

  const handleInputChange = (field) => (value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value?.target ? value.target.value : value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  const validateForm = () => {
    const requiredFields = ["dateTime", "duration", "reason"];
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
      }
    });
    return newErrors;
  };

  const handleSubmit = async () => {
    setIsLoading(true)
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
    } else {
      try {
        console.log("Submitting formData:", formData);
        await TrainerAPI.scheduleReport(token, formData);
        onSubmit();
      } catch (error) {
        console.error("API Submission Error:", error);
      }finally{
        setIsLoading(false);
      }
    }
  };

  const renderField = (label, field, component) => (
    <div>
      <div className="font-medium">{label}</div>
      {component}
      {errors[field] && (
        <div className="text-red-500 text-sm">{errors[field]}</div>
      )}
    </div>
  );

  const inputClassName = (error) =>
    `w-full px-3 border rounded-md ${error ? "border-red-500" : "border-gray-300"}`;

  return (
    <Modal visible={visible} onCancel={onClose} footer={null} width={600}>
      <div className="text-2xl font-medium pb-10">Schedule Report</div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {renderField(
            "Date",
            "dateTime",
            <DatePicker
              className={inputClassName(errors.dateTime)}
              onChange={handleInputChange("dateTime")}
              placeholder="DD/MM/YYYY"
              format="DD/MM/YYYY"
            />
          )}
          {renderField(
            "Duration",
            "duration",
            <Input
              placeholder="Duration"
              value={formData.duration}
              onChange={handleInputChange("duration")}
              className={inputClassName(errors.duration)}
            />
          )}
        </div>

        <div className="h-auto">
          <h3 className="text-base font-medium mb-2">Schedule 01</h3>
          <div className="flex flex-wrap border-gray-300">
            {filteredData.map((item, index) => (
              <div key={index} className="flex w-1/2 justify-between items-center space-x-4 mb-2">
                <span className="flex-grow">{item.topicName}</span>
                <button className="text-gray-500 hover:text-gray-600 font-bold pr-3">
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {renderField(
          "Note",
          "note",
          <TextArea
            rows={4}
            placeholder="Enter note"
            value={formData.note}
            onChange={handleInputChange("note")}
            className="w-full py-2 px-3 border rounded-md"
          />
        )}

        {renderField(
          "Reason",
          "reason",
          <TextArea
            placeholder="Enter reason"
            value={formData.reason}
            onChange={handleInputChange("reason")}
            className={inputClassName(errors.reason)}
          />
        )}

        <div className="flex justify-end space-x-4">
          <Button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded-full">
            Cancel
          </Button>
          <Button disabled={isLoading} type="primary" onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-full">
          {isLoading ? 'Submiting...' : 'Submit'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReportModal;
