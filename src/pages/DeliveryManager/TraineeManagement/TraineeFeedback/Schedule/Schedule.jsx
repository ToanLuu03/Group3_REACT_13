import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { DatePicker, Button, Calendar, Tooltip } from 'antd';
import dayjs from 'dayjs';

const Schedule = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const calendarRef = useRef(null);

  const events = [
    { title: 'Template 1', start: '2024-09-16T10:00:00', end: '2024-09-16T11:00:00', description: 'Send to QA, Test1' },
    { title: 'Template 2', start: '2024-09-17T12:00:00', end: '2024-09-17T13:00:00', description: 'Prepare UX, Module X, Test2' },
  ];

  const handleTitleClick = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);

    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(date.toISOString());
    }
  };

  const getWeekRange = (date) => {
    const startOfWeek = date.startOf('week');
    const endOfWeek = date.endOf('week');
    return `${startOfWeek.format('MMM D')} - ${endOfWeek.format('D, YYYY')}`;
  };

  return (
    <div className="w-full mx-auto p-4 font-sans">
      <div className="flex items-center justify-start">
        <Tooltip
          trigger="click"
          visible={showDatePicker}
          onVisibleChange={(visible) => setShowDatePicker(visible)}
          placement='rightBottom'
          color="blue"
          overlayInnerStyle={{ width: '300px', padding: '0px' }} // Adjust tooltip width and padding here
          title={
            <Calendar
              fullscreen={false}
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full h-full" // Adjust size as needed
            />
          }
        >
          <Button type="text" onClick={handleTitleClick} className="text-4xl font-semibold">
            {getWeekRange(selectedDate)}
          </Button>
        </Tooltip>
      </div>
      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin]}
        initialView="timeGridWeek"
        events={events}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        headerToolbar={{
          start: '',
          center: '',
          end: '',
        }}
        eventContent={(eventInfo) => (
          <div className="flex flex-col text-xs">
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
            <p>{eventInfo.event.extendedProps.description}</p>
          </div>
        )}
        height="auto"
        className="custom-calendar"
        initialDate={selectedDate.toISOString()}
        allDaySlot={false}
      />
    </div>
  );
};

export default Schedule;
