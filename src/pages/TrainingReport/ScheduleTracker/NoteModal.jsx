import React, { useState, useEffect, useMemo } from "react";
import { Modal, Button, DatePicker, Input, message } from "antd";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import TrainerAPI from "../../../services/trainer";

const NoteModal = ({ visible, onClose, onSubmit, filteredData, loading, setLoading }) => {
  const { TextArea } = Input;
  const [errors, setErrors] = useState({});
  const token = useSelector((state) => state.users?.users?.userName?.token);

  const [formData, setFormData] = useState({
    faClassId: null,
    moduleId: null,
    duration: null,
    dateTime: null,
    reason: "",
    note: "",
    dailyReportCreateTopicDTOS: [],
  });
  const [localFilteredData, setLocalFilteredData] = useState([...filteredData]);
  useEffect(() => {
    setLocalFilteredData([...filteredData]);
  }, [filteredData]);

  const dailyReportCreateTopicDTOS = useMemo(() => {
    if (!localFilteredData || localFilteredData.length === 0) return [];

    // Filter topics by moduleId to ensure only valid ones are submitted
    return localFilteredData
      .filter(item => item.moduleId === formData.moduleId) // Only include topics that match the current moduleId
      .map((item) => ({
        id: item.topicId,
        dailyReportCreateContentDTOS: [{ id: item.contentId }]
      }));
  }, [localFilteredData, formData.moduleId]);
  useEffect(() => {
    if (localFilteredData.length > 0) {
      const firstData = localFilteredData[0];
      setFormData((prev) => ({
        ...prev,
        faClassId: firstData.faClassId || null,
        moduleId: firstData.moduleId || null,
        duration: firstData.duration || null,
        dateTime: firstData.date ? dayjs(firstData.date).format('YYYY-MM-DD') : null,
        dailyReportCreateTopicDTOS: dailyReportCreateTopicDTOS,
      }));
    }
  }, [localFilteredData]);

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
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)
          } is required.`;
      }
    });

    setErrors(newErrors); 
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true); 
    try {
      await TrainerAPI.scheduleReport(token, formData);
      onSubmit(); 
    } catch (error) {
      console.error("API Submission Error:", error);
      message.error("Failed to submit report."); 
    } finally {
      setLoading(false); 
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

  const handleRemoveRow = (contentId) => {
    const updatedReportData = localFilteredData.filter(item => item.contentId !== contentId);
    setLocalFilteredData(updatedReportData);
  };

  return (
    <Modal visible={visible} onCancel={onClose} footer={null} width={600}>
      <div className="text-2xl font-medium mb-10">Schedule Report</div>
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
        {/* Table with Topics and Content */}
        <div className="overflow-y-auto max-h-52">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Topic</th>
                <th className="px-4 py-2 text-left">Content</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {localFilteredData.map((item, index) => {
                const isLastItem = index === localFilteredData.length - 1;

                return (
                  <tr key={item.contentId}>
                    <td className="px-4 py-2 border">{item.topicName}</td>
                    <td className="px-4 py-2 border">- {item.contentName}</td>
                    <td className="pl-8 py-2 border">
                      <button
                        onClick={() =>
                          isLastItem && handleRemoveRow(item.contentId)
                        }
                        className={`${isLastItem
                          ? "text-[#FF0000] hover:text-red-700"
                          : "text-[#808080]"
                          }`}
                        disabled={!isLastItem}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
          <Button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded-full"
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            type="primary"
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-full"
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NoteModal;
