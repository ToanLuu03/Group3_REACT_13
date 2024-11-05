import React, { useState, useRef } from "react";
import { DatePicker } from "antd";

const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startPlaceholder = "Start Date",
  endPlaceholder = "End Date",
}) => {
  const [endDateOpen, setEndDateOpen] = useState(false);
  const endDateRef = useRef(null);

  const handleStartDateChange = (date) => {
    onStartDateChange(date);
    if (!endDate) {
      setEndDateOpen(true);
      endDateRef.current.focus();
    }
  };

  const handleEndDateChange = (date) => {
    onEndDateChange(date);
    setEndDateOpen(false);
  };

  return (
    <div className="flex">
      <DatePicker
        value={startDate}
        placeholder={startPlaceholder}
        className="rounded-full w-28"
        suffixIcon={null}
        onChange={handleStartDateChange}
        disabledDate={(current) => {
          return endDate && current && current.isAfter(endDate, "day");
        }}
      />
      <DatePicker
        value={endDate}
        placeholder={endPlaceholder}
        suffixIcon={null}
        className="ml-5 rounded-full w-28"
        open={endDateOpen}
        onChange={handleEndDateChange}
        onOpenChange={(open) => setEndDateOpen(open)}
        ref={endDateRef}
        disabledDate={(current) => {
          return startDate && current && current.isBefore(startDate, "day");
        }}
      />
    </div>
  );
};

export default DateRangePicker;
