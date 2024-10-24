import React from "react";
import { Calendar, Select } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const LeftCalendar = ({ currentDate, setCurrentDate, calendarRef }) => {
    return (
        <div className="flex flex-col">
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
                        <div className="flex justify-end pt-2">
                            <Select
                                value={month}
                                onChange={(newMonth) => {
                                    const newDate = value.clone().month(newMonth);
                                    onChange(newDate);
                                }}
                                className="w-full mr-2"
                            >
                                {monthOptions}
                            </Select>
                            <Select
                                value={year}
                                onChange={(newYear) => {
                                    const newDate = value.clone().year(newYear);
                                    onChange(newDate);
                                }}
                                className="w-full"
                            >
                                {yearOptions}
                            </Select>
                        </div>
                    );
                }}
            />
            <div className="mt-2 text-sm">
                <div className="block">
                    <span className="inline-block w-3 h-3 mr-2 rounded bg-orange-400"></span> Fresher
                </div>
                <div className="block">
                    <span className="inline-block w-3 h-3 mr-2 rounded bg-green-700 bold"></span> Intern
                </div>
                <div className="block">
                    <span className="inline-block w-3 h-3 mr-2 rounded bg-[#509ADF] bg-opacity-75"></span> Free Time
                </div>
            </div>
        </div>
    );
};

export default LeftCalendar;
