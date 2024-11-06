import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button, Modal, Popover, Spin } from "antd";
import dayjs from "dayjs";
import "./SchedulePage.css";
import LeftCalendar from "../../../components/Admin/Schedule/LeftCalendar/LeftCalendar";
import { useDispatch, useSelector } from "react-redux";
import {
  getFreeTimeRequest,
  getScheduleDetailRequest,
  getScheduleRequest,
  removeSlotTimeRequest,
} from "../../../features/schedule/scheduleSlice";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { Link, useOutletContext } from "react-router-dom";
import { MdDelete, MdDomain, MdPerson, MdTimer } from "react-icons/md";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);

const SchedulePage = () => {
  const dispatch = useDispatch();
  const schedule = useSelector((state) => state.schedule.schedule);
  const scheduleDetail = useSelector((state) => state.schedule.scheduleDetail);
  const freeTime = useSelector((state) => state.schedule.freeTime);
  const trainerAccount = localStorage.getItem("trainerAccount");
  const loadingSchedule = useSelector(
    (state) => state.schedule.loading.getSchedule
  );
  const loadingScheduleDetail = useSelector(
    (state) => state.schedule.loading.getScheduleDetail
  );
  const loadingFreeTime = useSelector(
    (state) => state.schedule.loading.getFreeTime
  );
  const errorSchedule = useSelector(
    (state) => state.schedule.error.getSchedule
  );
  const errorScheduleDetail = useSelector(
    (state) => state.schedule.error.getScheduleDetail
  );
  const errorFreeTime = useSelector(
    (state) => state.schedule.error.getFreeTime
  );

  const [visiblePopover, setVisiblePopover] = useState({});
  const calendarRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const { collapsed } = useOutletContext();
  const initialScheduleFetched = useRef(false);

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      if (calendarApi) {
        setTimeout(() => {
          calendarApi.updateSize();
        }, 300);
      }
    }
  }, [collapsed]);

  useEffect(() => {
    dispatch(getScheduleRequest({ account: trainerAccount }));
    dispatch(getFreeTimeRequest({ trainerAccount }));
  }, [dispatch, trainerAccount]);

  useEffect(() => {
    if (
      schedule &&
      Array.isArray(schedule) &&
      !initialScheduleFetched.current
    ) {
      const scheduleIds = schedule.map((item) => item.id);
      if (scheduleIds.length > 0) {
        dispatch(getScheduleDetailRequest({ slotTimeIds: scheduleIds }));
        initialScheduleFetched.current = true;
      }
    }
  }, [dispatch, schedule]);

  const detailMap = useMemo(() => {
    const map = {};
    if (Array.isArray(scheduleDetail)) {
      scheduleDetail.flat().forEach((detail) => {
        map[detail.id] = detail;
      });
    }
    return map;
  }, [scheduleDetail]);

  const formattedEvents = useMemo(() => {
    const events = [];
    const dayOfWeekMap = {
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
      sunday: 0,
    };

    if (!Array.isArray(schedule)) return events;

    schedule.forEach((eventItem) => {
      if (eventItem.deleted) return;

      const moduleName = eventItem.module.name;
      const attendeeType = eventItem.attendeeType.toLowerCase();
      const isFreeTime =
        attendeeType !== "intern" && attendeeType !== "fresher";

      const eventStartDate = dayjs(eventItem.startDate);
      const eventEndDate = dayjs(eventItem.endDate);

      const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
      };

      const roomDetail = detailMap[eventItem.id];
      const room = roomDetail?.location || "Unknown Location";
      const admin = roomDetail?.admin || "";

      eventItem.dayParam.forEach((dayParam) => {
        if (dayParam.deleted) return;

        const selectedDays = dayParam.selectedDayOfWeek
          .toLowerCase()
          .split(",")
          .map((day) => day.trim());

        let currentDate = eventStartDate.clone();

        while (currentDate.isSameOrBefore(eventEndDate, "day")) {
          selectedDays.forEach((day) => {
            const dayNumber = dayOfWeekMap[day.toLowerCase()];
            const currentWeekEventDate = currentDate.day(dayNumber);

            if (
              currentWeekEventDate.isBefore(eventStartDate, "day") ||
              currentWeekEventDate.isAfter(eventEndDate, "day")
            )
              return;

            const startTime = dayParam[`start${capitalizeFirstLetter(day)}`];
            const endTime = dayParam[`end${capitalizeFirstLetter(day)}`];

            if (startTime && endTime && startTime !== endTime) {
              const [startHour, startMinute] = startTime.split(":").map(Number);
              const [endHour, endMinute] = endTime.split(":").map(Number);

              if (
                startHour < endHour ||
                (startHour === endHour && startMinute < endMinute)
              ) {
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

                if (
                  !events.some(
                    (event) =>
                      event.start === startDateTime && event.end === endDateTime
                  )
                ) {
                  events.push({
                    id: `${eventItem.id}-${dayParam.id}-${day}-${currentDate}`,
                    dayParamId: dayParam.id,
                    title: moduleName,
                    start: startDateTime,
                    end: endDateTime,
                    room,
                    admin,
                    type: attendeeType,
                    isFreeTime,
                  });
                }
              }
            }
          });
          currentDate = currentDate.add(1, "day");
        }
      });
    });

    return events;
  }, [schedule, detailMap]);

  const formattedFreeTimeEvents = useMemo(() => {
    return freeTime
      .filter((event) => !event.isDeleted)
      .flatMap((event) => {
        const start = dayjs.utc(event.startTime).tz(dayjs.tz.guess(), true);
        const end = dayjs.utc(event.endTime).tz(dayjs.tz.guess(), true);
        if (!start.isBefore(end)) return [];

        const recurrenceWeeks = event.recur_time
          ? parseInt(event.recur_time)
          : 0;
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
          monday: 1,
          tuesday: 2,
          wednesday: 3,
          thursday: 4,
          friday: 5,
          saturday: 6,
          sunday: 0,
        };
        const events = [];

        let currentDay = start.startOf("day");
        while (
          currentDay.isBefore(end, "day") ||
          currentDay.isSame(end, "day")
        ) {
          const eventStart = currentDay
            .set("hour", start.hour())
            .set("minute", start.minute());
          const eventEnd = currentDay
            .set("hour", end.hour())
            .set("minute", end.minute());

          // Check if the start hour is greater than or equal to end hour
          if (
            eventStart.hour() < eventEnd.hour() ||
            (eventStart.hour() === eventEnd.hour() &&
              eventStart.minute() < eventEnd.minute())
          ) {
            events.push({
              id: `${event.id}-${currentDay.format("YYYY-MM-DD")}`,
              title: "Free Time",
              start: eventStart.toISOString(),
              end: eventEnd.toISOString(),
              isFreeTime: true,
              type: "free_time",
            });
          }

          currentDay = currentDay.add(1, "day");
        }

        if (recurrenceWeeks > 0) {
          for (let i = 1; i <= recurrenceWeeks; i++) {
            Object.keys(recurrenceDays).forEach((dayName) => {
              if (recurrenceDays[dayName]) {
                const dayOffset = dayOfWeekMap[dayName];
                const recurringDay = start
                  .startOf("week")
                  .add(i, "week")
                  .day(dayOffset);

                const eventStart = recurringDay
                  .set("hour", start.hour())
                  .set("minute", start.minute());
                const eventEnd = recurringDay
                  .set("hour", end.hour())
                  .set("minute", end.minute());

                if (
                  eventStart.hour() < eventEnd.hour() ||
                  (eventStart.hour() === eventEnd.hour() &&
                    eventStart.minute() < eventEnd.minute())
                ) {
                  events.push({
                    id: `${event.id}-${recurringDay.format("YYYY-MM-DD")}`,
                    title: "Free Time",
                    start: eventStart.toISOString(),
                    end: eventEnd.toISOString(),
                    isFreeTime: true,
                    type: "free_time",
                  });
                }
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

  const handleDeleteEvent = (dayParamId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this event?",
      onOk: () => {
        dispatch(removeSlotTimeRequest(dayParamId));
      },
    });
  };

  if (loadingSchedule || loadingFreeTime || loadingScheduleDetail) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  if (errorSchedule || errorScheduleDetail || errorFreeTime) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        <p>Error loading schedule data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      {" "}
      <div className="flex flex-col lg:flex-row justify-between h-full overflow-hidden">
        <div className="w-full lg:w-auto lg:flex-1 max-w-full lg:max-w-[250px] lg:mr-2 mb-[24px] lg:mb-0 min-w-[250px]">
          <LeftCalendar
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            calendarRef={calendarRef}
          />
        </div>
        <div className="w-fulllg:ml-2 lg:flex-1 h-[calc(100vh-240px)] min-w-[250px] max-xl:text-[12px] full-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            timeZone="local"
            events={allEvents}
            eventContent={(arg) => {
              const { type, room, admin, isFreeTime } = arg.event.extendedProps;
              const eventClass = `h-full w-full rounded-md p-2 text-white text-center 
                         ${
                           type === "fresher"
                             ? "bg-orange-400"
                             : type === "intern"
                             ? "bg-green-400"
                             : type === "free_time"
                             ? "bg-[#509ADF] bg-opacity-75"
                             : ""
                         }
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
                              <p>
                                <strong>Time:</strong>{" "}
                                {dayjs(arg.event.start).format("hh:mm A")} -{" "}
                                {dayjs(arg.event.end).format("hh:mm A")}
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="modal-section flex items-center mb-2">
                            <MdDomain className="text-xl mr-2" />
                            <div>
                              <p>
                                <strong>Location:</strong> {room}
                              </p>
                            </div>
                          </div>
                          <div className="modal-section flex items-center mb-2">
                            <MdPerson className="text-xl text-black mr-2" />
                            <div>
                              <p>
                                <strong>Admin:</strong> {admin}
                              </p>
                            </div>
                          </div>
                          <div className="modal-section flex items-center mb-2">
                            <MdTimer className="text-xl mr-2" />
                            <div>
                              <p>
                                <strong>Time:</strong>{" "}
                                {dayjs(arg.event.start).format("hh:mm A")} -{" "}
                                {dayjs(arg.event.end).format("hh:mm A")}
                              </p>
                            </div>
                          </div>
                          <Button
                            className="border-none bg-transparent cursor-pointer p-1 text-base text-red-600"
                            onClick={() =>
                              handleDeleteEvent(
                                arg.event.extendedProps.dayParamId
                              )
                            }
                          >
                            <MdDelete className="mr-2" />
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                  title={
                    <span
                      className={`font-bold ${
                        type === "fresher"
                          ? "text-orange-500"
                          : type === "intern"
                          ? "text-green-500"
                          : "text-[#509ADF]"
                      }`}
                    >
                      {arg.event.title}
                    </span>
                  }
                  trigger="click"
                  open={visiblePopover[arg.event.id] || false}
                  onOpenChange={(visible) =>
                    handlePopoverVisibleChange(visible, arg.event.id)
                  }
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
                text: "today",
                click: handleTodayClick,
              },
            }}
            allDaySlot={false}
            slotDuration="00:30:00"
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            contentHeight="420px"
            scrollTime="08:00:00"
            slotEventOverlap={false}
          />
        </div>
      </div>
      <Button type="default" className="max-lg:w-full mt-2 mb-0">
        <Link to="/CLASS_ADMIN/trainer-list">Back to Trainers List</Link>
      </Button>
    </div>
  );
};

export default SchedulePage;
