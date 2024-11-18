import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal, Switch, DatePicker, Checkbox, InputNumber } from "antd";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import '../EditModal/editmodal.css';
import { useSelector } from "react-redux";
import { saveTrainerFreeTime } from "../../../services/schedule";


dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

const FreeTimeModal = ({ isVisible, onCancel, initialData, onSave, selectedTrainer }) => {
  const [roomName, setRoomName] = useState(initialData?.location || "");
  const [startTime, setStartTime] = useState(dayjs(`${initialData?.date} ${initialData?.start_time}`, 'YYYY-MM-DD HH:mm:ss') || dayjs());
  const [endTime, setEndTime] = useState(
    initialData?.start_time 
      ? dayjs(`${initialData.date} ${initialData.start_time}`, 'YYYY-MM-DD HH:mm:ss').add(1, 'hour') 
      : dayjs().add(1, 'hour')
  );
  const [isRepeat, setIsRepeat] = useState(false);
  const [repeatInterval, setRepeatInterval] = useState(1);
  const [selectedDays, setSelectedDays] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {     
    if (initialData) {
      setRoomName(initialData.location || "");
      
      const start = dayjs(`${initialData.date} ${initialData.start_time}`, 'YYYY-MM-DD HH:mm:ss');
      setStartTime(start);
      const end = start.add(1, 'hour');
      setEndTime(end);
      
      setSelectedDays(initialData.selectedDayOfWeek ? initialData.selectedDayOfWeek.split(', ').map(day => day.trim()) : []);
    }
  }, [initialData]);

  const handleSaveEdit = async () => {
    setLoading(true); // Disable button after initial click
    const updatedData = {
      trainerAccount: selectedTrainer.account || username,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      recur_time: isRepeat ? repeatInterval : 0,
      monday: selectedDays.includes("Monday"),
      tuesday: selectedDays.includes("Tuesday"),
      wednesday: selectedDays.includes("Wednesday"),
      thursday: selectedDays.includes("Thursday"),
      friday: selectedDays.includes("Friday"),
      saturday: selectedDays.includes("Saturday"),
    };
    
    try {
      const response = await saveTrainerFreeTime(updatedData, token); // Use the API function
      onSave(); // Trigger data refresh in the parent component
      onCancel(); // Close the modal after saving
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          alert('Cannot register a date from the past'); // Specific message for status 400
        } else {
          alert(`Server responded with status: ${error.response.status}`);
        }
      } else if (error.request) {
        alert('No response from server. Please try again later.');
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false); // Re-enable button if error occurs
    }
  }    


  const handleRangeChange = (values) => {
    const [start, end] = values;
    setStartTime(start);
    setEndTime(end);
  };

  const handleRepeatChange = (checked) => {
    setIsRepeat(checked);
  };

  const handleDayChange = (day, checked) => {
    setSelectedDays(checked ? [...selectedDays, day] : selectedDays.filter(d => d !== day));
  };

  const disablePastDates = (current) => current && current < dayjs().startOf('day');
  const disablePastTime = (current) => {
    const now = dayjs();
    if (current && current.isSame(now, 'day')) {
      return {
        disabledHours: () => [...Array(now.hour()).keys()],
        disabledMinutes: (selectedHour) => selectedHour === now.hour() ? [...Array(now.minute()).keys()] : []
      };
    }
    return {};
  };

  return (
    <Modal
      title="Register Free Time"
      visible={isVisible}
      onCancel={onCancel}
      footer={null}
      className="edit-modal"
    >
      <Row className="edit-modal-row">
        <Col span={24}>
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm:ss"
            value={[startTime, endTime]}
            onChange={handleRangeChange}
            className="edit-modal-rangepicker"
            disabledDate={disablePastDates}
            disabledTime={disablePastTime}
            allowClear={false}
          />
        </Col>
      </Row>

      <Row className="edit-modal-row">
        <Col lg={6} className="repeat-section">
          <Switch
            className="repeat-switch"
            checked={isRepeat}
            onChange={handleRepeatChange}
          />
          <span className="repeat-label">Repeat</span>
        </Col>
      </Row>

      {isRepeat && (
        <>
          <Row className="edit-modal-row">
            <Col span={24}>
              <span>Recur every </span>
              <InputNumber
                min={1}
                value={repeatInterval}
                onChange={setRepeatInterval}
              />
              <span> week(s)</span>
            </Col>
          </Row>

          <Row className="edit-modal-row repeat-days">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
              <Col key={day} span={8}>
                <Checkbox
                  checked={selectedDays.includes(day)}
                  onChange={(e) => handleDayChange(day, e.target.checked)}
                >
                  {day}
                </Checkbox>
              </Col>
            ))}
          </Row>
        </>
      )}

      <Row className="button-section">
        <Button className="modal-cancel-button" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          className="modal-save-button" 
          onClick={handleSaveEdit} 
          loading={loading} // Disable button when loading
        >
           {loading ? "Saving..." : "Save"}
        </Button>
      </Row>
    </Modal>
  );
};

export default FreeTimeModal;
