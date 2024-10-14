import React from "react";
import { Calendar, Select } from "antd";
import dayjs from "dayjs";
import './LeftCalendar.css';

const { Option } = Select;

const LeftCalendar = ({ currentDate, setCurrentDate, calendarRef }) => {
    return (
        <div className="left-calendar-container">
            <Calendar
                fullscreen={false}
                mode="month"
                value={currentDate}
                onSelect={(value) => {
                    setCurrentDate(value);
                    const fullCalendarApi = calendarRef.current.getApi();
                    fullCalendarApi.gotoDate(value.format("YYYY-MM-DD"));
                }}
                headerRender={({ value, onChange }) => {
                    const month = value.month();
                    const year = value.year();

                    const monthOptions = dayjs.months().map((monthName, index) => (
                        <Option key={monthName} value={index}>{monthName}</Option>
                    ));

                    const yearOptions = [];
                    for (let i = 1900; i <= 2100; i++) {
                        yearOptions.push(
                            <Option key={i} value={i}>{i}</Option>
                        );
                    }

                    return (
                        <div className="header-calendar-left">
                            <Select
                                value={month}
                                onChange={(newMonth) => {
                                    const newDate = value.clone().month(newMonth);
                                    onChange(newDate);
                                }}
                                className="calendar-select mr-8"
                            >
                                {monthOptions}
                            </Select>
                            <Select
                                value={year}
                                onChange={(newYear) => {
                                    const newDate = value.clone().year(newYear);
                                    onChange(newDate);
                                }}
                                className="calendar-select"
                            >
                                {yearOptions}
                            </Select>
                        </div>
                    );
                }}
            />
            <div className="calendar-legend">
                <div className="legend-item-calendar">
                    <span className="legend-color-calendar legend-fresher-calendar"></span> Fresher
                </div>
                <div className="legend-item-calendar">
                    <span className="legend-color-calendar legend-intern-calendar"></span> Intern
                </div>
                <div className="legend-item-calendar">
                    <span className="legend-color-calendar legend-free-time-calendar"></span> Free Time
                </div>
            </div>
        </div>
    );
};

export default LeftCalendar;
