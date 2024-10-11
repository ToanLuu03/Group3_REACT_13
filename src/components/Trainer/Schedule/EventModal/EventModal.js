import React from "react";
import { Modal, Button, DatePicker, Switch, InputNumber, Checkbox } from "antd";

const { RangePicker } = DatePicker;

const CreateNewEvent = ({
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
                <Button key="submit" type="primary" onClick={onSave} style={{ backgroundColor: "#6F4DE7", borderColor: "#6F4DE7" }}>
                    Save
                </Button>,
            ]}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <RangePicker
                    showTime
                    format="YYYY-MM-DD HH:mm"
                    value={newEventDates}
                    onChange={(value) => setNewEventDates(value)}
                    style={{ width: "70%" }}
                />
                <div>
                    <Switch checked={isRecurring} onChange={setIsRecurring} />
                    <span style={{ marginLeft: 8 }}>Repeat</span>
                </div>
            </div>

            {isRecurring && (
                <>
                    <div style={{ marginTop: "20px" }}>
                        <label>Recur every</label>
                        <InputNumber
                            min={1}
                            value={recurrenceWeeks}
                            onChange={setRecurrenceWeeks}
                            style={{ width: "60px", marginLeft: "10px", marginRight: "10px" }}
                        />
                        <span>Week(s) on:</span>
                    </div>

                    <Checkbox.Group
                        value={selectedDays}
                        onChange={setSelectedDays}
                        style={{ marginTop: "20px" }}
                    >
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                            <div style={{ width: "45%", marginBottom: "10px" }}>
                                <Checkbox value="0">Monday</Checkbox>
                            </div>
                            <div style={{ width: "45%", marginBottom: "10px" }}>
                                <Checkbox value="1">Tuesday</Checkbox>
                            </div>
                            <div style={{ width: "45%", marginBottom: "10px" }}>
                                <Checkbox value="2">Wednesday</Checkbox>
                            </div>
                            <div style={{ width: "45%", marginBottom: "10px" }}>
                                <Checkbox value="3">Thursday</Checkbox>
                            </div>
                            <div style={{ width: "45%", marginBottom: "10px" }}>
                                <Checkbox value="4">Friday</Checkbox>
                            </div>
                            <div style={{ width: "45%", marginBottom: "10px" }}>
                                <Checkbox value="5">Saturday</Checkbox>
                            </div>
                            <div style={{ width: "45%", marginBottom: "10px" }}>
                                <Checkbox value="6">Sunday</Checkbox>
                            </div>
                        </div>
                    </Checkbox.Group>
                </>
            )}
        </Modal>
    );
};

export default CreateNewEvent;
