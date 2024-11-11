import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Button, Calendar, Tooltip } from 'antd';
import dayjs from 'dayjs';

const Schedule = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const calendarRef = useRef(null);
  const [tooltipPlacement, setTooltipPlacement] = useState('rightBottom');

  const events = [
    { title: 'Template 1', start: '2024-11-08T10:00:00', end: '2024-11-08T11:00:00', description: 'Send to QA, Test1' },
    { title: 'Template 2', start: '2024-11-09T12:00:00', end: '2024-11-09T13:00:00', description: 'Prepare UX, Module X, Test2' },
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

  // Adjust tooltip placement based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setTooltipPlacement('bottom'); // Place tooltip below on mobile screens
      } else {
        setTooltipPlacement('rightBottom'); // Default placement for larger screens
      }
    };

    handleResize(); // Set initial placement based on screen size
    window.addEventListener('resize', handleResize); // Update on window resize

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full mx-auto p-4 font-sans">
      <div className="flex flex-wrap items-center justify-start mb-4">
        <Tooltip
          trigger="click"
          visible={showDatePicker}
          onVisibleChange={(visible) => setShowDatePicker(visible)}
          placement={tooltipPlacement}
          color="blue"
          overlayInnerStyle={{ width: '300px', padding: '0px' }}
          title={
            <Calendar
              fullscreen={false}
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full h-full"
            />
          }
        >
          <Button type="text" onClick={handleTitleClick} className="text-xl md:text-2xl lg:text-4xl font-semibold">
            {getWeekRange(selectedDate)}
          </Button>
        </Tooltip>
      </div>
      <div className="overflow-x-auto">
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
            <div className="flex flex-col overflow-hidden text-xs md:text-sm lg:text-base">
              <b className="truncate">{eventInfo.timeText}</b>
              <i className="truncate">{eventInfo.event.title}</i>
              <p className="truncate">{eventInfo.event.extendedProps.description}</p>
            </div>
          )}
          height="auto"
          className="custom-calendar"
          initialDate={selectedDate.toISOString()}
          allDaySlot={false}
        />
      </div>
    </div>
  );
};

export default Schedule;
