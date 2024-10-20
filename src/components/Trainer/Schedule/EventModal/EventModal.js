import React from "react";
import { Modal, Button, DatePicker, Switch, InputNumber, Checkbox } from "antd";
import dayjs from "dayjs";
import "./EventModal.css";
const { RangePicker } = DatePicker;

const EventModal = ({
    isModalVisible,
    onCancel,
    onSave,
    newEventDates,
    setNewEventDates,
    isRecurring,
    setIsRecurring,
    recurrenceWeeks,
    setRecurrenceWeeks,
    selectedDays,
    setSelectedDays,
    isEditing,
}) => {
    return (
        <Modal
            title={isEditing ? "Edit Event" : "Free Time Registration"}
            open={isModalVisible}
            onOk={onSave}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={onSave} className="save-button-trainer">
                    Save
                </Button>,
            ]}
        >
            <div className="date-time-picker-container-trainer">
                <RangePicker
                    showTime
                    format="YYYY-MM-DD HH:mm"
                    value={newEventDates}
                    onChange={(value) => setNewEventDates(value)}
                    className="date-picker-trainer"
                />
                <div className="switch-container-trainer">
                    <Switch
                        checked={isRecurring}
                        onChange={(checked) => {
                            setIsRecurring(checked);
                            if (checked) {
                                if (newEventDates && newEventDates[0]) {
                                    const startDay = dayjs(newEventDates[0]).day();
                                    setSelectedDays([startDay]);
                                }
                            } else {
                                setSelectedDays([]);
                            }
                        }}
                    />
                    <span className="switch-label-trainer">Repeat</span>
                </div>
            </div>

            {isRecurring && (
                <>
                    <div className="recur-container-trainer">
                        <label>Recur every</label>
                        <InputNumber
                            min={0}
                            value={recurrenceWeeks}
                            onChange={setRecurrenceWeeks}
                            className="input-number-trainer"
                        />
                        <span>Week(s) on:</span>
                    </div>

                    <Checkbox.Group
                        value={selectedDays}
                        onChange={(checkedValues) => setSelectedDays(checkedValues)}
                        className="checkbox-container-trainer"
                    >
                        <div className="checkbox-grid-trainer">
                            <Checkbox value={1}>Monday</Checkbox>
                            <Checkbox value={2}>Tuesday</Checkbox>
                            <Checkbox value={3}>Wednesday</Checkbox>
                            <Checkbox value={4}>Thursday</Checkbox>
                            <Checkbox value={5}>Friday</Checkbox>
                            <Checkbox value={6}>Saturday</Checkbox>
                            <Checkbox value={0}>Sunday</Checkbox>
                        </div>
                    </Checkbox.Group>
                </>
            )}
        </Modal>
    );
};

export default EventModal;
