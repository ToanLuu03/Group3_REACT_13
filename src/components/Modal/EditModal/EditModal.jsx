import { Row, Col, Button, Modal, Input, Switch, DatePicker, Checkbox, InputNumber } from "antd";
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
      className="max-w-full mx-auto"
      bodyStyle={{ padding: '1rem', overflow: 'hidden' }}  // Ensures no overflow
    >
      <Row className="flex flex-wrap justify-between items-center mb-4">
        <Col lg={18} xs={24} className="mb-4 lg:mb-0">
          <Input
            type="text"
            value={initialData.title}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full p-2 bg-gray-100 border border-gray-300 rounded"
            placeholder="Room Name"
          />
        </Col>
        <Col lg={6} xs={24} className="flex items-center justify-end lg:justify-start">
          <Switch
            className="m-auto"
            defaultChecked={isRepeat}
            onChange={handleRepeatChange}
          />
          <span className="ml-2 text-sm">Repeat</span>
        </Col>
      </Row>

      <Row className="mb-4 lg:mb-0">
        <Col span={24}>
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm:ss"
            value={[startTime, endTime]}
            onChange={handleRangeChange}
            className="w-full md:w-3/4 lg:w-1/2"  // Full width to ensure it fits the modal width
            disabledDate={disablePastDates}
            disabledTime={disablePastTime}
            dropdownClassName="max-w-full"  // Ensures dropdown also respects width
            allowClear={false}
          />
        </Col>
      </Row>

      {isRepeat && (
        <>
          <Row className="flex items-center mb-4">
            <Col span={24}>
              <span>Recur every </span>
              <InputNumber
                min={1}
                value={repeatInterval}
                onChange={(value) => setRepeatInterval(value)}
                className="mx-2"
              />
              <span> week(s)</span>
            </Col>
          </Row>

          <Row className="flex flex-wrap gap-2 mb-4">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
              <Col key={day} lg={8} xs={12}>
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

      <Row className="flex justify-end mt-6 space-x-3">
        <Button className="bg-white text-red-500 border border-red-500" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="bg-indigo-600 text-white" onClick={handleSaveEdit}>
          Save
        </Button>
      </Row>
    </Modal>
  );
};

export default EditModal;
