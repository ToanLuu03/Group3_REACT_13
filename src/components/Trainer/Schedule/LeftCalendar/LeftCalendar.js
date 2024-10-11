import React from "react";
import { Calendar, Select } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const LeftCalendar = ({ currentDate, setCurrentDate, calendarRef }) => {
    return (
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
                    <div style={{ padding: 8 }}>
                        <Select
                            value={month}
                            onChange={(newMonth) => {
                                const newDate = value.clone().month(newMonth);
                                onChange(newDate);
                            }}
                            style={{ width: '45%', marginRight: 8 }}
                        >
                            {monthOptions}
                        </Select>
                        <Select
                            value={year}
                            onChange={(newYear) => {
                                const newDate = value.clone().year(newYear);
                                onChange(newDate);
                            }}
                            style={{ width: '45%' }}
                        >
                            {yearOptions}
                        </Select>
                    </div>
                );
            }}
        />
    );
};

export default LeftCalendar;
