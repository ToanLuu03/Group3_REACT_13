import React from "react";
import { Modal, Button, DatePicker, Switch, Select, Checkbox, InputNumber, notification } from "antd";
import "./EventModal.css";

const { RangePicker } = DatePicker;
const { Option } = Select;

const EventModal = ({
    isVisible,
    onCancel,
    onSave,
    eventDates,
    setEventDates,
    isRecurring,
    setIsRecurring,
    selectedLocation,
    setSelectedLocation,
    selectedDays,
    setSelectedDays,
    recurrenceWeeks,
    setRecurrenceWeeks,
    isEditing
}) => {
    const handleSave = () => {
        if (!selectedLocation) {
            notification.error({
                message: "Location Required",
                description: "Please select a location for the event.",
                placement: "topRight",
            });
            return;
        }

        onSave();
    };

    return (
        <Modal
            title={isEditing ? "Edit Event" : "Create New Event"}
            open={isVisible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel} className="modal-button-admin">
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSave} className="modal-button-admin">
                    Save
                </Button>,
            ]}
            className="custom-modal-admin"
        >
            <div className="modal-section-admin">
                <label>Location: </label>
                <Select
                    value={selectedLocation || undefined}
                    onChange={setSelectedLocation}
                    placeholder="Select a location"
                    className="location-select-admin"
                >
                    <Option value="Room 1">Room 1</Option>
                    <Option value="Room 2">Room 2</Option>
                    <Option value="Room 3">Room 3</Option>
                </Select>
            </div>
            <div className="modal-section-admin time-section-admin">
                <RangePicker
                    showTime
                    format="DD-MM-YYYY HH:mm"
                    value={eventDates}
                    onChange={(value) => setEventDates(value)}
                    className="range-picker-admin"
                />
                <div className="switch-section-admin">
                    <Switch
                        checked={isRecurring}
                        onChange={(checked) => setIsRecurring(checked)}
                    />
                    <span className="switch-label-admin">Repeat</span>
                </div>
            </div>
            {isRecurring && (
                <div className="recurrence-section-admin">
                    <label>Recur every</label>
                    <InputNumber
                        min={0}
                        value={recurrenceWeeks}
                        onChange={setRecurrenceWeeks}
                        className="recurrence-weeks-admin"
                    />
                    <span>Week(s) on:</span>
                    <Checkbox.Group
                        value={selectedDays}
                        onChange={setSelectedDays}
                        className="checkbox-container-admin"
                    >
                        <div className="checkbox-grid-admin">
                            <Checkbox value={1}>Monday</Checkbox>
                            <Checkbox value={2}>Tuesday</Checkbox>
                            <Checkbox value={3}>Wednesday</Checkbox>
                            <Checkbox value={4}>Thursday</Checkbox>
                            <Checkbox value={5}>Friday</Checkbox>
                            <Checkbox value={6}>Saturday</Checkbox>
                            <Checkbox value={0}>Sunday</Checkbox>
                        </div>
                    </Checkbox.Group>
                </div>
            )}
        </Modal>
    );
};

export default EventModal;
