import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
    Button,
    Popover,
} from "antd";
import dayjs from "dayjs";
import "./SchedulePage.css";
import LeftCalendar from "../../../components/Trainer/Schedule/LeftCalendar/LeftCalendar";
import CreateNewEvent from "../../../components/Trainer/Schedule/EventModal/EventModal";

const SchedulePage = () => {

    const [events, setEvents] = useState([]);

    const [apiData, setApiData] = useState([
        {
            id: 1,
            date: new Date("2024-10-09T08:00:00Z").toISOString(),
            attendeeType: "Fresher",
            startTime: new Date("2024-10-09T08:00:00Z").toISOString(),
            endTime: new Date("2024-10-09T12:00:00Z").toISOString(),
            isDeleted: false,
            topic: { topicId: 1, topicName: "Redux-Saga" },
            moduleId: 3
        },
        {
            id: 2,
            date: new Date("2024-10-10T12:30:00Z").toISOString(),
            attendeeType: "Intern",
            startTime: new Date("2024-10-10T08:30:00Z").toISOString(),
            endTime: new Date("2024-10-10T13:00:00Z").toISOString(),
            isDeleted: false,
            topic: { topicId: 1, topicName: "Introduction" },
            moduleId: 6
        },
        {
            id: 3,
            date: new Date("2024-10-11T08:00:00Z").toISOString(),
            attendeeType: "free_time",
            startTime: new Date("2024-10-11T08:00:00Z").toISOString(),
            endTime: new Date("2024-10-11T12:00:00Z").toISOString(),
            isDeleted: false,
            topic: { topicId: 1, topicName: "Free time" },
            moduleId: 0
        },
        {
            id: 4,
            date: new Date("2024-10-15T12:30:00Z").toISOString(),
            attendeeType: "Intern",
            startTime: new Date("2024-10-15T12:30:00Z").toISOString(),
            endTime: new Date("2024-10-15T15:00:00Z").toISOString(),
            isDeleted: false,
            topic: { topicId: 1, topicName: "Introduction" },
            moduleId: 6
        },
    ]);


    const scheduleData = [
        {
            id: 6,
            createdBy: "admin",
            location: "FPT Building, HN",
            admin: "John Doe"
        },
        {
            id: 3,
            createdBy: "admin",
            location: "FPT Building, HN",
            admin: "John Doe"
        }

    ];

    const [visiblePopover, setVisiblePopover] = useState({});
    const calendarRef = useRef(null);
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurrenceWeeks, setRecurrenceWeeks] = useState(1);
    const [selectedDays, setSelectedDays] = useState([]);
    const [isFreeTimeModalVisible, setIsFreeTimeModalVisible] = useState(false);
    const [newEventDates, setNewEventDates] = useState(null);
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleTodayClick = () => {
        setCurrentDate(dayjs());
        calendarRef.current.getApi().today();
    };

    useEffect(() => {
        const formattedEvents = apiData.map((event) => {
            const scheduleInfo = scheduleData.find((item) => item.id === event.moduleId) || {};
            return {
                id: event.id.toString(),
                title: event.topic.topicName,
                start: event.startTime,
                end: event.endTime,
                room: scheduleInfo.location || "",
                admin: scheduleInfo.admin || "",
                type: event.attendeeType.toLowerCase(),
            };
        });
        setEvents(formattedEvents);
    }, [apiData, scheduleData]);

    const handlePopoverVisibleChange = (visible, eventId) => {
        setVisiblePopover((prev) => ({ ...prev, [eventId]: visible }));
    };

    const handleNewEventSave = () => {
        if (newEventDates && newEventDates[0] && newEventDates[1]) {
            const newEvent = {
                id: (apiData.length + 1).toString(),
                date: newEventDates[0].toISOString(),
                attendeeType: "free_time",
                startTime: newEventDates[0].toISOString(),
                endTime: newEventDates[1].toISOString(),
                isDeleted: false,
                topic: {
                    topicId: apiData.length + 1,
                    topicName: "Free time",
                },
                moduleId: 0
            };

            setApiData((prevApiData) => [...prevApiData, newEvent]);

            setIsFreeTimeModalVisible(false);
            setNewEventDates(null);
            setSelectedEvent(null);
            setIsRecurring(false);
            setRecurrenceWeeks(1);
            setSelectedDays([]);

            const calendarApi = calendarRef.current.getApi();
            calendarApi.gotoDate(dayjs(newEventDates[0]).format("YYYY-MM-DD")); // Navigate to the exact date
        } else {
            alert("Please select valid start and end dates for the event.");
        }
    };

    const deleteEvent = (eventId) => {
        const updatedApiData = apiData.filter(event => event.id !== parseInt(eventId, 10));
        setApiData(updatedApiData);
        setEvents(updatedApiData);
        setVisiblePopover((prev) => ({ ...prev, [eventId]: false }));
    };

    const handleSelect = (selectInfo) => {
        setNewEventDates([dayjs(selectInfo.start), dayjs(selectInfo.end)]);
        setIsFreeTimeModalVisible(true);
        setSelectedEvent(null);
    };

    return (
        <div className="calendar-container">
            <div className="left-calendar">
                <LeftCalendar
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    calendarRef={calendarRef}
                />
            </div>

            <div className="right-calendar">
                <FullCalendar
                    key={events.length}
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    events={events}
                    eventContent={(arg) => {
                        const { room, admin, type } = arg.event.extendedProps;
                        const formattedTime = `${dayjs(arg.event.start).format("hh:mm A")} - ${dayjs(arg.event.end).format("hh:mm A")}`;

                        return (
                            <Popover
                                content={
                                    <div>
                                        <p><strong>Location:</strong> {room}</p>
                                        <p><strong>Admin:</strong> {admin}</p>
                                        <p><strong>Time:</strong> {formattedTime}</p>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                            <Button
                                                type="text"
                                                icon={<i className="fas fa-edit"></i>}
                                                onClick={() => {
                                                    setVisiblePopover((prev) => ({ ...prev, [arg.event.id]: false }));
                                                    setSelectedEvent(arg.event);
                                                    setNewEventDates([dayjs(arg.event.start), dayjs(arg.event.end)]);
                                                    setIsFreeTimeModalVisible(true);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                type="text"
                                                danger
                                                icon={<i className="fas fa-trash-alt"></i>}
                                                onClick={() => deleteEvent(arg.event.id)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                }
                                title={arg.event.title}
                                trigger="click"
                                open={visiblePopover[arg.event.id] || false}
                                onOpenChange={(visible) => handlePopoverVisibleChange(visible, arg.event.id)}
                                getPopupContainer={() => document.body}
                            >
                                <div className={`fc-event-title event-${type}`}>
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
                    contentHeight="500px"
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
