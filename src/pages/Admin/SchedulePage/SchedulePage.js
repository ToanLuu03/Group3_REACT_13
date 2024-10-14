import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { notification, Popover, Spin } from "antd";
import dayjs from "dayjs";
import "./SchedulePage.css";
import LeftCalendar from "../../../components/Trainer/Schedule/LeftCalendar/LeftCalendar";
import { useDispatch, useSelector } from "react-redux";
import { getScheduleDetailRequest, getScheduleRequest } from "../../../features/schedule/actions";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { BankOutlined, DeleteOutlined, EditOutlined, FieldTimeOutlined, UserOutlined } from "@ant-design/icons";
import EventModal from "../../../components/Admin/Schedule/EventModal/EventModal";

dayjs.extend(utc);
dayjs.extend(timezone);

const SchedulePage = () => {
    const dispatch = useDispatch();
    const schedule = useSelector(state => state.schedule.schedule);
    const scheduleDetail = useSelector(state => state.scheduleDetail.scheduleDetail);

    const [visiblePopover, setVisiblePopover] = useState({});
    const calendarRef = useRef(null);
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [loading, setLoading] = useState(true);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [eventDates, setEventDates] = useState(null);
    const [isRecurring, setIsRecurring] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [recurrenceWeeks, setRecurrenceWeeks] = useState(1);
    const [selectedDays, setSelectedDays] = useState([]);
    const [editingEvent, setEditingEvent] = useState(null);

    const dayOfWeekMap = {
        'monday': 1, 'tuesday': 2, 'wednesday': 3,
        'thursday': 4, 'friday': 5, 'saturday': 6, 'sunday': 0,
    };

    useEffect(() => {
        dispatch(getScheduleRequest('VinhNT37_test'));
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

    const handleSelect = useCallback((selectInfo) => {
        const selectedDay = dayjs(selectInfo.start).format('dddd').toLowerCase();

        setIsRecurring(false);
        setSelectedLocation('');
        setSelectedDays([dayOfWeekMap[selectedDay]]);
        setEventDates([dayjs(selectInfo.start), dayjs(selectInfo.end)]);
        setIsCreateModalVisible(true);
    }, []);


    useEffect(() => {
        if (editingEvent) {
            setEventDates([dayjs(editingEvent.start), dayjs(editingEvent.end)]);
            setSelectedLocation(editingEvent.extendedProps.room || '');

            const dayOfWeekString = editingEvent.id || '';
            const daysArray = dayOfWeekString.split('-')[1].toLowerCase();
            setSelectedDays([dayOfWeekMap[daysArray]]);
        }
    }, [editingEvent]);

    if (loading) {
        return (
            <div className="spinner-container">
                <Spin size="large" />
            </div>
        );
    }
    return (
        <div className="calendar-container-admin">
            <div className="left-calendar-admin">
                <LeftCalendar
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    calendarRef={calendarRef}
                />
            </div>

            <div className="right-calendar-admin">
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
                                    <div className="popover-content">
                                        <p className="popover-detail"><strong><BankOutlined /> Location:</strong> {room}</p>
                                        <p className="popover-detail"><strong><UserOutlined /> Admin:</strong> {admin}</p>
                                        <p className="popover-detail"><strong><FieldTimeOutlined /> Time:</strong> {dayjs(arg.event.start).format("hh:mm A")} - {dayjs(arg.event.end).format("hh:mm A")}</p>
                                        <div className="popover-actions">
                                            <button
                                                className="popover-button edit-button"
                                                onClick={() => {
                                                    setEditingEvent(arg.event);
                                                    setEventDates([dayjs(arg.event.start), dayjs(arg.event.end)]);
                                                    setSelectedLocation(arg.event.extendedProps.room);
                                                    setSelectedDays([dayjs(arg.event.start).format('dddd')]);
                                                    setIsCreateModalVisible(true);
                                                    setVisiblePopover((prev) => ({ ...prev, [arg.event.id]: false }));
                                                    setIsRecurring(false);
                                                }}
                                            >
                                                <EditOutlined className="button-icon" /> Edit
                                            </button>
                                            <button className="popover-button delete-button">
                                                <DeleteOutlined className="button-icon" /> Remove
                                            </button>
                                        </div>
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
                    contentHeight="490px"
                    scrollTime="08:00:00"
                    slotEventOverlap={false}
                    selectable={true}
                    select={handleSelect}
                />
            </div>
            <EventModal
                isVisible={isCreateModalVisible}
                onCancel={() => {
                    setIsCreateModalVisible(false);
                    setEditingEvent(null);
                }}
                onSave={() => {
                    setIsCreateModalVisible(false);
                }}
                eventDates={eventDates}
                setEventDates={setEventDates}
                isRecurring={isRecurring}
                setIsRecurring={setIsRecurring}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                selectedDays={selectedDays}
                setSelectedDays={setSelectedDays}
                recurrenceWeeks={recurrenceWeeks}
                setRecurrenceWeeks={setRecurrenceWeeks}
                isEditing={!!editingEvent}
            />
        </div>
    );
};

export default SchedulePage;
