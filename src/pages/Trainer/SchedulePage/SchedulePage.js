import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { notification, Popover, Spin } from "antd";
import dayjs from "dayjs";
import "./SchedulePage.css";
import LeftCalendar from "../../../components/Trainer/Schedule/LeftCalendar/LeftCalendar";
import CreateNewEvent from "../../../components/Trainer/Schedule/EventModal/EventModal";
import { useDispatch, useSelector } from "react-redux";
import { getScheduleDetailRequest, getScheduleRequest, postFreeTimeRequest } from "../../../features/schedule/actions";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { BankOutlined, FieldTimeOutlined, UserOutlined } from "@ant-design/icons";

dayjs.extend(utc);
dayjs.extend(timezone);

const SchedulePage = () => {
  const dispatch = useDispatch();
  const schedule = useSelector(state => state.schedule.schedule);
  const scheduleDetail = useSelector(state => state.scheduleDetail.scheduleDetail);

  useEffect(() => {
    const account = localStorage.getItem('username')
    dispatch(getScheduleRequest(account));
  }, [dispatch]);

  useEffect(() => {
    if (schedule && Array.isArray(schedule)) {
      const dayParamIds = schedule.reduce((ids, item) => {
        item.dayParam.forEach(param => ids.push(param.id));
        return ids;
      }, []);

      if (dayParamIds.length > 0) {
        dispatch(getScheduleDetailRequest(dayParamIds));
      }
    }
  }, [dispatch, schedule]);

  useEffect(() => {
    if (schedule && scheduleDetail) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [schedule, scheduleDetail]);

  const detailMap = useMemo(() => {
    const map = {};
    if (Array.isArray(scheduleDetail)) {
      scheduleDetail.flat().forEach(detail => {
        map[detail.id] = detail;
      });
    }
    return map;
  }, [scheduleDetail]);

  const formattedEvents = useMemo(() => {
    const events = [];
    const dayOfWeekMap = {
      'monday': 1, 'tuesday': 2, 'wednesday': 3,
      'thursday': 4, 'friday': 5, 'saturday': 6, 'sunday': 0,
    };

    if (!Array.isArray(schedule)) return events;

    schedule.forEach(eventItem => {
      if (eventItem.deleted) return;

      const topicName = eventItem.topic.topicName;
      const attendeeType = eventItem.attendeeType.toLowerCase();
      const startOfCurrentWeek = dayjs(eventItem.startDate);
      const startOfNextWeek = startOfCurrentWeek.add(1, 'week');

      const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
      };

      eventItem.dayParam.forEach(dayParam => {
        const roomDetail = detailMap[dayParam.id];
        const room = roomDetail && roomDetail.location ? roomDetail.location : 'Unknown Location';
        const admin = roomDetail ? roomDetail.admin : '';

        Object.keys(dayOfWeekMap).forEach(day => {
          const dayNumber = dayOfWeekMap[day.toLowerCase()];
          const currentWeekEventDate = startOfCurrentWeek.day(dayNumber);

          const startTime = dayParam[`start${capitalizeFirstLetter(day)}`];
          const endTime = dayParam[`end${capitalizeFirstLetter(day)}`];

          if (startTime && endTime) {
            const [startHour, startMinute] = startTime.split(':').map(Number);
            const [endHour, endMinute] = endTime.split(':').map(Number);

            const startDateTime = dayjs(currentWeekEventDate).hour(startHour).minute(startMinute).second(0).tz().format();
            const endDateTime = dayjs(currentWeekEventDate).hour(endHour).minute(endMinute).second(0).tz().format();

            events.push({
              id: `${eventItem.id}-${day}-${dayParam.id}-currenWeek`,
              title: topicName,
              start: startDateTime,
              end: endDateTime,
              room,
              admin,
              type: attendeeType
            });
          }
        });

        const selectedDays = dayParam.selectedDayOfWeek.split(',').map(day => day.trim().toLowerCase());
        selectedDays.forEach(day => {
          const dayNumber = dayOfWeekMap[day.toLowerCase()];
          if (dayNumber !== undefined) {
            const nextWeekEventDate = startOfNextWeek.day(dayNumber);

            const startTime = dayParam[`start${capitalizeFirstLetter(day)}`];
            const endTime = dayParam[`end${capitalizeFirstLetter(day)}`];

            if (startTime && endTime) {
              const [startHour, startMinute] = startTime.split(':').map(Number);
              const [endHour, endMinute] = endTime.split(':').map(Number);

              const startDateTime = dayjs(nextWeekEventDate).hour(startHour).minute(startMinute).second(0).tz().format();
              const endDateTime = dayjs(nextWeekEventDate).hour(endHour).minute(endMinute).second(0).tz().format();

              events.push({
                id: `${eventItem.id}-${day}-${dayParam.id}-nextweek`,
                title: topicName,
                start: startDateTime,
                end: endDateTime,
                room,
                admin,
                type: attendeeType
              });
            }
          }
        });
      });
    });

    return events;
  }, [schedule, detailMap]);

  const [visiblePopover, setVisiblePopover] = useState({});
  const calendarRef = useRef(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceWeeks, setRecurrenceWeeks] = useState(1);
  const [selectedDays, setSelectedDays] = useState([]);
  const [isFreeTimeModalVisible, setIsFreeTimeModalVisible] = useState(false);
  const [newEventDates, setNewEventDates] = useState(null);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const openNotificationWithIcon = useCallback((type, message, description) => {
    notification[type]({
      message: message,
      description: description,
      placement: "topRight",
    });
  }, []);

  const handleTodayClick = useCallback(() => {
    setCurrentDate(dayjs());
    calendarRef.current.getApi().today();
  }, []);

  const handlePopoverVisibleChange = useCallback((visible, eventId) => {
    setVisiblePopover((prev) => ({ ...prev, [eventId]: visible }));
  }, []);

  const { postFreeTimeSuccess, error } = useSelector(state => state.schedule);

  useEffect(() => {
    if (postFreeTimeSuccess) {
      openNotificationWithIcon("success", "Free Time Registered", "You have successfully registered free time!");
    }
    if (error) {
      openNotificationWithIcon("error", "Registration Failed", "Failed to register free time. Please try again.");
    }
  }, [postFreeTimeSuccess, error, openNotificationWithIcon]);

  const handleNewEventSave = useCallback(() => {
    if (newEventDates && newEventDates[0] && newEventDates[1]) {
      const data = {
        trainerId: 1,
        start_time: newEventDates[0].toISOString(),
        end_time: newEventDates[1].toISOString(),
        recur_time: isRecurring ? recurrenceWeeks : 0,
        monday: selectedDays.includes(0),
        tuesday: selectedDays.includes(1),
        wednesday: selectedDays.includes(2),
        thursday: selectedDays.includes(3),
        friday: selectedDays.includes(4),
        saturday: selectedDays.includes(5),
        sunday: selectedDays.includes(6),
      };

      dispatch(postFreeTimeRequest(data));
      setIsFreeTimeModalVisible(false);
      setNewEventDates(null);
      setIsRecurring(false);
      setRecurrenceWeeks(1);
      setSelectedDays([]);
    } else {
      openNotificationWithIcon("warning", "Invalid Dates", "Please select valid start and end dates for the event.");
    }
  }, [dispatch, isRecurring, newEventDates, openNotificationWithIcon, recurrenceWeeks, selectedDays]);

  const handleSelect = useCallback((selectInfo) => {
    setNewEventDates([dayjs(selectInfo.start), dayjs(selectInfo.end)]);
    setIsRecurring(false);
    setIsFreeTimeModalVisible(true);
    setSelectedEvent(null);
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div className="calendar-container-trainer">
      <div className="left-calendar-trainer">
        <LeftCalendar
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          calendarRef={calendarRef}
        />
      </div>

      <div className="right-calendar-trainer">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          timeZone="local"
          events={formattedEvents}
          eventContent={(arg) => {
            const { type, room, admin } = arg.event.extendedProps;
            const eventClass = `fc-event-title event-${type}`;

            return (
              <Popover
                content={() => (
                  <div>
                    <p><strong><BankOutlined /> Location:</strong> {room}</p>
                    <p><strong><UserOutlined /> Admin:</strong> {admin}</p>
                    <p><strong><FieldTimeOutlined /> Time:</strong> {dayjs(arg.event.start).format("hh:mm A")} - {dayjs(arg.event.end).format("hh:mm A")}</p>
                  </div>
                )}
                title={<span className={`event-title event-title-${type}`}>{arg.event.title}</span>}
                trigger="click"
                open={visiblePopover[arg.event.id] || false}
                onOpenChange={(visible) => handlePopoverVisibleChange(visible, arg.event.id)}
                placement="top"
                overlayStyle={{ position: "fixed" }}
              >
                <div className={eventClass}>
                  {arg.event.title}
                </div>
              </Popover>
            );
          }}
          headerToolbar={{
            left: "today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          customButtons={{
            today: {
              text: 'today',
              click: handleTodayClick
            }
          }}
          allDaySlot={false}
          slotDuration="00:30:00"
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          contentHeight="470px"
          scrollTime="08:00:00"
          slotEventOverlap={false}
          selectable={true}
          select={handleSelect}
        />
      </div>

      <CreateNewEvent
        isModalVisible={isFreeTimeModalVisible}
        onCancel={() => setIsFreeTimeModalVisible(false)}
        onSave={handleNewEventSave}
        newEventDates={newEventDates}
        setNewEventDates={setNewEventDates}
        isRecurring={isRecurring}
        setIsRecurring={setIsRecurring}
        recurrenceWeeks={recurrenceWeeks}
        setRecurrenceWeeks={setRecurrenceWeeks}
        selectedDays={selectedDays}
        setSelectedDays={setSelectedDays}
        isEditing={!!selectedEvent}
      />
    </div>
  );
};

export default SchedulePage;
