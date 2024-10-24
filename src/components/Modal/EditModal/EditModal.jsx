import { Row, Col, Button, Modal, Input, Switch, DatePicker, Checkbox, InputNumber } from "antd";
import './editmodal.css';
import { useState, useEffect } from "react";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const EditModal = ({ isVisible, onCancel, initialData, onSave }) => {
  const initialStartTime = dayjs(`${initialData?.date} ${initialData?.start_time}`, 'YYYY-MM-DD HH:mm:ss');
  const initialEndTime = dayjs(`${initialData?.date} ${initialData?.end_time}`, 'YYYY-MM-DD HH:mm:ss');

  const [roomName, setRoomName] = useState(initialData?.location || "");
  const [startTime, setStartTime] = useState(initialStartTime || dayjs());
  const [endTime, setEndTime] = useState(initialEndTime || dayjs());
  const [isRepeat, setIsRepeat] = useState(false);
  const [repeatInterval, setRepeatInterval] = useState(1);
  const [selectedDays, setSelectedDays] = useState([]);

  // Set initial selected days based on selectedDayOfWeek
  useEffect(() => {
    if (initialData?.selectedDayOfWeek) {
      const daysArray = initialData.selectedDayOfWeek.split(', ').map(day => day.trim());
      setSelectedDays(daysArray);
    }
  }, [initialData]);

  const handleSaveEdit = () => {
    const updatedData = {
      location: roomName,
      startTime,
      endTime,
      isRepeat,
      repeatInterval,
      selectedDays
    };
    onSave(updatedData);
  };

  const handleRangeChange = (values) => {
    const [start, end] = values;
    setStartTime(start);
    setEndTime(end);
  };

  const handleRepeatChange = (checked) => {
    setIsRepeat(checked);
  };

  const handleDayChange = (day, checked) => {
    const updatedDays = checked
      ? [...selectedDays, day]
      : selectedDays.filter(d => d !== day);
    setSelectedDays(updatedDays);
  };

  const disablePastDates = (current) => {
    return current && current < dayjs().startOf('day');
  };

  const disablePastTime = (current) => {
    const now = dayjs();
    const startHour = 8;
    const endHour = 19;
  
    if (current && current.isSame(now, 'day')) {
      return {
        disabledHours: () => [
          ...Array(startHour).keys(),
          ...Array(24 - endHour - 1).keys().map(i => i + endHour + 1),
          ...Array(now.hour()).keys()
        ],
        disabledMinutes: (selectedHour) => 
          selectedHour === now.hour() ? [...Array(now.minute()).keys()] : [],
      };
    }
  
    return {
      disabledHours: () => [
        ...Array(startHour).keys(),
        ...Array(24 - endHour - 1).keys().map(i => i + endHour + 1),
      ],
    };
  };

  return (
    <Modal
      title="EDIT"
      visible={isVisible}
      onCancel={onCancel}
      footer={null}
      className="edit-modal"
    >
      <Row className="edit-modal-row">
        <Col lg={18}>
          <Input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="edit-modal-input"
            placeholder="Room Name"
          />
        </Col>
        <Col lg={6} className="repeat-section">
          <Switch 
            className="repeat-switch" 
            defaultChecked={isRepeat}
            onChange={handleRepeatChange} 
          />
          <span className="repeat-label">Repeat</span>
        </Col>
      </Row>

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
          />
        </Col>
      </Row>

      {isRepeat && (
        <>
          <Row className="edit-modal-row">
            <Col span={24}>
              <span>Recur every </span>
              <InputNumber
                size={2}
                min={1}
                value={repeatInterval}
                onChange={(value) => setRepeatInterval(value)}
              />
              <span> week(s)</span>
            </Col>
          </Row>

          <Row className="edit-modal-row repeat-days">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
              <Col key={day} span={8}>
                <Checkbox
                  checked={selectedDays.includes(day)} // Check the box if day is in selectedDays
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
        <Button className="modal-save-button" onClick={handleSaveEdit}>
          Save
        </Button>
      </Row>
    </Modal>
  );
};

export default EditModal;
