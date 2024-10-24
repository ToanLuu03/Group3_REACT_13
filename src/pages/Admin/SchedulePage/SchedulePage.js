import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button, Modal, notification, Popover, Spin } from "antd";
import dayjs from "dayjs";
import "./SchedulePage.css";
import LeftCalendar from "../../../components/Trainer/Schedule/LeftCalendar/LeftCalendar";
import { useDispatch, useSelector } from "react-redux";
import { getFreeTimeRequest, getScheduleDetailRequest, getScheduleRequest, removeSlotTimeRequest } from "../../../features/schedule/actions";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { BankOutlined, DeleteOutlined, EditOutlined, FieldTimeOutlined, UserOutlined } from "@ant-design/icons";
import EventModal from "../../../components/Admin/Schedule/EventModal/EventModal";
import { useOutletContext } from "react-router-dom";
import { MdDelete, MdDomain, MdPerson, MdTimer } from "react-icons/md";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);

const SchedulePage = () => {
    const dispatch = useDispatch();
    const schedule = useSelector(state => state.schedule.schedule);
    const scheduleDetail = useSelector(state => state.scheduleDetail.scheduleDetail);
    const freeTime = useSelector(state => state.freeTimeReducer.freeTime);
    const trainerAccount = localStorage.getItem('trainerAccount');

    const [visiblePopover, setVisiblePopover] = useState({});
    const calendarRef = useRef(null);
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [loading, setLoading] = useState(true);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [eventDates, setEventDates] = useState(null);
    const [isRecurring, setIsRecurring] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [recurrenceWeeks, setRecurrenceWeeks] = useState(0);
    const [selectedDays, setSelectedDays] = useState([]);
    const [editingEvent, setEditingEvent] = useState(null);
    const { collapsed } = useOutletContext();
    const dayOfWeekMap = {
        'monday': 1, 'tuesday': 2, 'wednesday': 3,
        'thursday': 4, 'friday': 5, 'saturday': 6, 'sunday': 0,
    };

    useEffect(() => {
        if (calendarRef.current) {
            setTimeout(() => {
                calendarRef.current.getApi().updateSize();
            }, 300);
        }
    }, [collapsed]);

    const initialRender = useRef(true);

    useEffect(() => {
        if (initialRender.current) {
            dispatch(getScheduleRequest(trainerAccount));
            dispatch(getFreeTimeRequest(trainerAccount));
            initialRender.current = false;
        }
    }, [dispatch, trainerAccount]);

    useEffect(() => {
        if (schedule && Array.isArray(schedule)) {
            const scheduleIds = schedule.map(item => item.id);

            if (scheduleIds.length > 0) {
                dispatch(getScheduleDetailRequest(scheduleIds));
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

            const moduleName = eventItem.module.name;
            const attendeeType = eventItem.attendeeType.toLowerCase();
            const isFreeTime = attendeeType !== "intern" && attendeeType !== "fresher";

            const eventStartDate = dayjs(eventItem.startDate);
            const eventEndDate = dayjs(eventItem.endDate);

            const capitalizeFirstLetter = (string) => {
                return string.charAt(0).toUpperCase() + string.slice(1);
            };

            const roomDetail = detailMap[eventItem.id];
            const room = roomDetail?.location || 'Unknown Location';
            const admin = roomDetail?.admin || '';

            eventItem.dayParam.forEach(dayParam => {
                if (dayParam.deleted) return;

                const selectedDays = dayParam.selectedDayOfWeek.toLowerCase().split(',').map(day => day.trim());

                let currentDate = eventStartDate.clone();

                while (currentDate.isSameOrBefore(eventEndDate, 'day')) {
                    selectedDays.forEach(day => {
                        const dayNumber = dayOfWeekMap[day.toLowerCase()];
                        const currentWeekEventDate = currentDate.day(dayNumber);

                        if (currentWeekEventDate.isBefore(eventStartDate, 'day') || currentWeekEventDate.isAfter(eventEndDate, 'day')) return;

                        const startTime = dayParam[`start${capitalizeFirstLetter(day)}`];
                        const endTime = dayParam[`end${capitalizeFirstLetter(day)}`];

                        if (startTime && endTime && startTime !== endTime) {
                            const [startHour, startMinute] = startTime.split(':').map(Number);
                            const [endHour, endMinute] = endTime.split(':').map(Number);

                            const startDateTime = dayjs(currentWeekEventDate)
                                .hour(startHour)
                                .minute(startMinute)
                                .second(0)
                                .tz()
                                .format();
                            const endDateTime = dayjs(currentWeekEventDate)
                                .hour(endHour)
                                .minute(endMinute)
                                .second(0)
                                .tz()
                                .format();

                            if (!events.some(event => event.start === startDateTime && event.end === endDateTime)) {
                                events.push({
                                    id: `${eventItem.id}-${dayParam.id}-${day}-${currentDate}`,
                                    dayParamId: dayParam.id,
                                    title: moduleName,
                                    start: startDateTime,
                                    end: endDateTime,
                                    room,
                                    admin,
                                    type: attendeeType,
                                    isFreeTime
                                });
                            }
                        }
                    });

                    currentDate = currentDate.add(1, 'day');
                }
            });
        });

        return events;
    }, [schedule, detailMap]);

    const formattedFreeTimeEvents = useMemo(() => {
        return freeTime
            .filter(event => !event.isDeleted)
            .flatMap(event => {
                const start = dayjs.utc(event.startTime).tz(dayjs.tz.guess(), true);
                const end = dayjs.utc(event.endTime).tz(dayjs.tz.guess(), true);
                const recurrenceWeeks = event.recur_time ? parseInt(event.recur_time) : 0;
                const recurrenceDays = {
                    monday: event.monday,
                    tuesday: event.tuesday,
                    wednesday: event.wednesday,
                    thursday: event.thursday,
                    friday: event.friday,
                    saturday: event.saturday,
                    sunday: event.sunday,
                };
                const dayOfWeekMap = {
                    'monday': 1, 'tuesday': 2, 'wednesday': 3,
                    'thursday': 4, 'friday': 5, 'saturday': 6, 'sunday': 0,
                };
                const events = [];

                let currentDay = start.startOf('day');
                while (currentDay.isBefore(end, 'day') || currentDay.isSame(end, 'day')) {
                    const eventStart = currentDay.set('hour', start.hour()).set('minute', start.minute());
                    const eventEnd = currentDay.set('hour', end.hour()).set('minute', end.minute());

                    events.push({
                        id: `${event.id}-${currentDay.format('YYYY-MM-DD')}`,
                        title: "Free Time",
                        start: eventStart.toISOString(),
                        end: eventEnd.toISOString(),
                        isFreeTime: true,
                        type: 'free_time'
                    });

                    currentDay = currentDay.add(1, 'day');
                }

                if (recurrenceWeeks > 0) {
                    for (let i = 1; i <= recurrenceWeeks; i++) {
                        Object.keys(recurrenceDays).forEach(dayName => {
                            if (recurrenceDays[dayName]) {
                                const dayOffset = dayOfWeekMap[dayName];
                                const recurringDay = start.startOf('week').add(i, 'week').day(dayOffset);

                                const eventStart = recurringDay.set('hour', start.hour()).set('minute', start.minute());
                                const eventEnd = recurringDay.set('hour', end.hour()).set('minute', end.minute());

                                events.push({
                                    id: `${event.id}-${recurringDay.format('YYYY-MM-DD')}`,
                                    title: "Free Time",
                                    start: eventStart.toISOString(),
                                    end: eventEnd.toISOString(),
                                    isFreeTime: true,
                                    type: 'free_time'
                                });
                            }
                        });
                    }
                }

                return events;
            });
    }, [freeTime]);

    const allEvents = useMemo(() => {
        return [...formattedEvents, ...formattedFreeTimeEvents];
    }, [formattedEvents, formattedFreeTimeEvents]);

    const handleTodayClick = useCallback(() => {
        setCurrentDate(dayjs());
        calendarRef.current.getApi().today();
    }, []);

    const handlePopoverVisibleChange = useCallback((visible, eventId) => {
        setVisiblePopover((prev) => ({ ...prev, [eventId]: visible }));
    }, []);

    const handleSelect = useCallback((selectInfo) => {
        const selectedDay = dayjs(selectInfo.start).format('dddd').toLowerCase();

        setIsRecurring(false);
        setSelectedLocation('');
        setSelectedDays([dayOfWeekMap[selectedDay]]);
        setEventDates([dayjs(selectInfo.start), dayjs(selectInfo.end)]);
        setIsCreateModalVisible(true);
    }, []);

    const handleDeleteEvent = (dayParamId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this event?',
            onOk: () => {
                dispatch(removeSlotTimeRequest(dayParamId))
                    .then(() => {
                        notification.success({
                            message: 'Delete Successful',
                            description: 'The event has been successfully deleted.',
                        });
                    })
                    .catch((error) => {
                        notification.error({
                            message: 'Delete Failed',
                            description: `Error: ${error.message || "Failed to delete the event"}`,
                        });
                    });
            },
        });
    };

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
            <div className="flex justify-start items-center">
                <Spin size="large" />
            </div>
        );
    }
    return (
        <div className="flex flex-col lg:flex-row lg:flex-row justify-between h-[calc(100vh-250px)]">
            <div className="w-full lg:w-auto lg:flex-1 max-w-full lg:max-w-[250px] p-5 bg-gray-100 mb-[24px] lg:mb-0 min-w-[250px]">
                <LeftCalendar
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    calendarRef={calendarRef}
                />
            </div>

            <div className="w-full lg:ml-2 lg:flex-1 h-[calc(100vh-190px)]  min-w-[250px] full-calendar">
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    timeZone="local"
                    events={allEvents}
                    eventContent={(arg) => {
                        const { type, room, admin, isFreeTime } = arg.event.extendedProps;
                        const eventClass = `h-full w-full rounded-md p-2 text-white text-center 
                            ${type === 'fresher' ? 'bg-orange-400' :
                                type === 'intern' ? 'bg-green-400' :
                                    type === 'free_time' ? 'bg-[#509ADF] bg-opacity-75' : ''}
                                        text-xs sm:text-sm lg:text-base`;
                        return (
                            <Popover
                                content={() => (
                                    <div className="p-2 text-xs sm:text-sm lg:text-base">
                                        {isFreeTime ? (
                                            <>
                                                <div className="modal-section flex items-center mb-2">
                                                    <MdTimer className="text-xl mr-2" />
                                                    <div>
                                                        <p><strong>Time:</strong> {dayjs(arg.event.start).format("hh:mm A")} - {dayjs(arg.event.end).format("hh:mm A")}</p>
                                                    </div>
                                                </div>
                                                {/* <div className="popover-actions"> */}
                                                {/* <button className="popover-button delete-button">
                                                        <DeleteOutlined className="button-icon" /> Delete
                                                    </button> */}
                                                {/* </div> */}
                                            </>
                                        ) : (
                                            <>
                                                <div className="modal-section flex items-center mb-2">
                                                    <MdDomain className="text-xl mr-2" />
                                                    <div>
                                                        <p><strong>Location:</strong> {room}</p>
                                                    </div>
                                                </div>
                                                <div className="modal-section flex items-center mb-2">
                                                    <MdPerson className="text-xl text-black mr-2" />
                                                    <div>
                                                        <p><strong>Admin:</strong> {admin}</p>
                                                    </div>
                                                </div>
                                                <div className="modal-section flex items-center mb-2">
                                                    <MdTimer className="text-xl mr-2" />
                                                    <div>
                                                        <p><strong>Time:</strong> {dayjs(arg.event.start).format("hh:mm A")} - {dayjs(arg.event.end).format("hh:mm A")}</p>
                                                    </div>
                                                </div>
                                                {/* <div className="popover-actions">
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
                                                    // 
                                                </div> */}
                                                <Button
                                                    className="border-none bg-transparent cursor-pointer p-1 text-base text-red-600"
                                                    onClick={() => handleDeleteEvent(arg.event.extendedProps.dayParamId)}
                                                >
                                                    <MdDelete className="mr-2" />
                                                    Delete
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                )}
                                title={<span className={`font-bold ${type === 'fresher' ? 'text-orange-500' : type === 'intern' ? 'text-green-500' : 'text-[#509ADF]'}`}>{arg.event.title}</span>}
                                trigger="click"
                                open={visiblePopover[arg.event.id] || false}
                                onOpenChange={(visible) => handlePopoverVisibleChange(visible, arg.event.id)}
                                placement="top"
                                overlayStyle={{ position: "fixed" }}
                            >
                                <div className={`${eventClass} cursor-pointer`}>
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
                    contentHeight="460px"
                    scrollTime="08:00:00"
                    slotEventOverlap={false}
                // selectable={true}
                // select={handleSelect}
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
