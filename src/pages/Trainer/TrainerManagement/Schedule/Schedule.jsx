import React, { useEffect, useState } from "react";
import { Calendar, Spin } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import FreeTimeModal from "../../../../components/Modal/FreeTimeModal/FreeTimeModal";
import ScheduleModal from "../../../../components/Modal/ScheduleModal/ScheduleModal";
import { fetchTrainerSchedule, fetchTrainerFreeTime } from "../../../../services/schedule/index"; // Adjust the path as necessary
import { useSelector } from "react-redux";
import TrainerAPI from "../../../../services/trainer";

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

const Schedule = () => {
  const [view, setView] = useState("week");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFreeTimeModalVisible, setIsFreeTimeModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalInitialData, setModalInitialData] = useState(null);
  const [currentDateRange, setCurrentDateRange] = useState({
    start: dayjs().startOf("week"),
    end: dayjs().endOf("week"),
  });
  const [events, setEvents] = useState([]);
  const [calendarDate, setCalendarDate] = useState(dayjs());
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const username = useSelector((state) => state.users.users.userName.username);
  const token = useSelector((state) => state.users.users.userName.token);

  const fetchTrainerInfo = async () => {
    try {
      const response = await TrainerAPI.gettrainerInfo(token, username);
      const trainerInfo = response.data.trainerInfo;
      setSelectedTrainer(trainerInfo.generalInfo);
      return trainerInfo.generalInfo;
    } catch (error) {
      console.error("Failed to fetch trainer info:", error);
      return null;
    }
  };

  const fetchEvents = async (trainerAccount) => {
    try {
      const [scheduleResponse, freeTimeResponse] = await Promise.all([
        fetchTrainerSchedule(trainerAccount),
        fetchTrainerFreeTime(trainerAccount),
      ]);

      const scheduleData = scheduleResponse.data.data.flatMap((item) => {
        const eventDays = [];
        if (item.dayParam && item.dayParam.length > 0) {
          const dayMappings = {
            0: { start: item.dayParam[0].startSunday, end: item.dayParam[0].endSunday },
            1: { start: item.dayParam[0].startMonday, end: item.dayParam[0].endMonday },
            2: { start: item.dayParam[0].startTuesday, end: item.dayParam[0].endTuesday },
            3: { start: item.dayParam[0].startWednesday, end: item.dayParam[0].endWednesday },
            4: { start: item.dayParam[0].startThursday, end: item.dayParam[0].endThursday },
            5: { start: item.dayParam[0].startFriday, end: item.dayParam[0].endFriday },
            6: { start: item.dayParam[0].startSaturday, end: item.dayParam[0].endSaturday },
          };
          Object.keys(dayMappings).forEach((day) => {
            if (dayMappings[day].start && dayMappings[day].end) {
              const eventDate = dayjs(currentDateRange.start).add(day, 'day');
              eventDays.push({
                day: parseInt(day),
                title: item.module.name,
                start_time: dayMappings[day].start,
                end_time: dayMappings[day].end,
                date: eventDate.format("YYYY-MM-DD"),
                selectedDayOfWeek: item.dayParam[0].selectedDayOfWeek,
                attendeeType: item.attendeeType,
                isFreeTime: false
              });
            }
          });
        }
        return eventDays;
      });

      const freeTimeData = freeTimeResponse.data.data.map((item) => {
        const startDate = dayjs(item.startTime);
        const dayIndex = startDate.day();
        const start = startDate.format("HH:mm:ss");
        const end = dayjs(item.endTime).format("HH:mm:ss");
        const eventDate = startDate.format("YYYY-MM-DD");

        const selectedDays = [];
        if (item.sunday) selectedDays.push("Sunday");
        if (item.monday) selectedDays.push("Monday");
        if (item.tuesday) selectedDays.push("Tuesday");
        if (item.wednesday) selectedDays.push("Wednesday");
        if (item.thursday) selectedDays.push("Thursday");
        if (item.friday) selectedDays.push("Friday");
        if (item.saturday) selectedDays.push("Saturday");

        const selectedDayOfWeek = selectedDays.join(", ");

        return {
          day: dayIndex,
          title: "Free Time",
          start_time: start,
          end_time: end,
          date: eventDate,
          attendeeType: "FRESHER",
          selectedDayOfWeek: selectedDayOfWeek,
          isFreeTime: true
        };
      });

      const filteredScheduleData = filterEventsByDateAndTimeRange(scheduleData);
      const filteredFreeTimeData = filterEventsByDateAndTimeRange(freeTimeData);

      setEvents([...filteredScheduleData, ...filteredFreeTimeData]);
    } catch (error) {
      console.error("Error fetching schedule or free time data:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  const fetchTrainerDataAndEvents = async () => {
    setLoading(true); // Start loading when fetching data
    const trainer = await fetchTrainerInfo();
    if (trainer) {
      await fetchEvents(trainer.account);
    } else {
      setLoading(false); // Ensure loading state is reset in case of failure
    }
  };

  useEffect(() => {
    fetchTrainerDataAndEvents();
  }, [currentDateRange]);

  const filterEventsByDateAndTimeRange = (events) => {
    const startTimeRange = dayjs("08:00:00", "HH:mm:ss");
    const endTimeRange = dayjs("19:00:00", "HH:mm:ss");
  
    return events.filter((event) => {
      const eventDate = dayjs(event.date, "YYYY-MM-DD");
      const eventStartTime = dayjs(event.start_time, "HH:mm:ss");
      const eventEndTime = dayjs(event.end_time, "HH:mm:ss");
  
      // Check if event date is within the current date range
      const isWithinDateRange = eventDate.isBetween(currentDateRange.start, currentDateRange.end, "day", "[]");
  
      // Check if the event time is within the desired time range
      const isWithinTimeRange = eventStartTime.isBetween(startTimeRange, endTimeRange, "minute", "[)") &&
                                eventEndTime.isBetween(startTimeRange, endTimeRange, "minute", "[)");
  
      // Return true if both conditions are satisfied
      return isWithinDateRange && isWithinTimeRange;
    });
  };
  

  const filteredEvents = filterEventsByDateAndTimeRange(events);

  const showModal = (event) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsFreeTimeModalVisible(false);
    setSelectedEvent(null);
  };

  const onDateSelect = (value) => {
    setCurrentDateRange({
      start: value.startOf("week"),
      end: value.endOf("week"),
    });
    setCalendarDate(value);
  };

  const handleTodayClick = () => {
    const today = dayjs();
    setView("week");
    setCurrentDateRange({
      start: today.startOf("week"),
      end: today.endOf("week")
    });
    setCalendarDate(today);
  };

  const timeToPosition = (startTime, endTime) => {
    const start = dayjs(startTime, "HH:mm:ss");
    const end = dayjs(endTime, "HH:mm:ss");
    const startInMinutes = (start.hour() - 8) * 60 + start.minute();
    const endInMinutes = (end.hour() - 8) * 60 + end.minute();
    const durationInMinutes = endInMinutes - startInMinutes;
    return { top: (startInMinutes / 60) * 64, height: (durationInMinutes / 60) * 64 };
  };

  const handleEmptySlotClick = (dayIndex, time) => {
    const date = dayjs(currentDateRange.start).add(dayIndex, "day").format("YYYY-MM-DD");
    setModalInitialData({ date, start_time: time, end_time: time });
    setIsFreeTimeModalVisible(true);
  };

  return (
    <div className="p-4 relative">
      {/* Fullscreen loading spinner */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-white bg-opacity-75 flex justify-center items-center">
          <Spin size="large" tip="Loading..." />
        </div>
      )}

      {/* Content of the page */}
      <div className={`opacity-${loading ? '50' : '100'} transition-opacity duration-300`}>
        <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
          <button
            className="bg-[#2c3e50] text-white font-medium text-base py-3 px-7 rounded-md mb-2 lg:mb-0"
            onClick={handleTodayClick}
          >
            Today
          </button>
          <div className="text-lg lg:text-3xl font-semibold text-center mb-2 lg:mb-0">
            {`${currentDateRange.start.format("MMM D")} - ${currentDateRange.end.format("D, YYYY")}`}
          </div>
          <div className="flex space-x-2">
            {["month", "week", "day"].map((mode) => (
              <button
                key={mode}
                className={`p-4 font-medium text-base ${view === mode ? "bg-[#1a252f]" : "bg-[#2c3e50]"} text-white`}
                onClick={() => {
                  setView(mode);
                  setCurrentDateRange({
                    start: mode === "day" ? dayjs() : dayjs().startOf(mode),
                    end: mode === "day" ? dayjs() : dayjs().endOf(mode),
                  });
                }}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3 border border-gray-300 rounded-lg">
            <Calendar 
              fullscreen={false} 
              onSelect={onDateSelect}
              value={calendarDate} // Bind calendar to selected date
            />
          </div>

          <div className="w-full md:w-2/3 grid grid-cols-8 gap-2">
            {/* Row displaying the day and date */}
            <div className="col-span-1"></div> {/* Empty cell for time labels */}
            {Array(7).fill(null).map((_, dayIndex) => {
              const date = dayjs(currentDateRange.start).add(dayIndex, "day");
              return (
                <div key={dayIndex} className="h-16 border text-center flex flex-col items-center justify-center overflow-hidden">
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg block truncate whitespace-nowrap">
                    {date.format("ddd")} {/* Abbreviated day names (e.g., Mon, Tue) */}
                  </span>
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg block truncate whitespace-nowrap">
                    {`${date.format("DD/MM")}`}
                  </span>
                </div>
              );
            })}

            {/* Time Labels */}
            <div className="col-span-1">
              {["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"].map((time, index) => (
                <div 
                  key={index} 
                  className="h-16 border text-center flex flex-col items-center justify-center overflow-hidden text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl"
                >
                  {time}
                </div>
              ))}
            </div>

            {/* Events Grid */}
            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, dayIndex) => (
              <div key={dayIndex} className="col-span-1 relative">
                {Array(12).fill(null).map((_, i) => {
                  const time = `${8 + i}:00:00`;
                  return (
                    <div
                      key={i}
                      className="h-16 border hover:bg-[#addcff] cursor-pointer"
                      onClick={() => handleEmptySlotClick(dayIndex, time)}
                    ></div>
                  );
                })}
                {filteredEvents.filter((event) => event.day === dayIndex).map((event, eventIndex) => {
                  const { top, height } = timeToPosition(event.start_time, event.end_time);
                  const backgroundColor = event.isFreeTime ? "bg-blue-400" : (event.attendeeType === "FRESHER" ? "bg-orange-400" : event.attendeeType === "INTERN" ? "bg-green-500" : "bg-[#2c3e50]");

                  return (
                    <div
                      key={eventIndex}
                      className={`absolute left-0 right-0 p-2 text-white rounded-lg cursor-pointer ${backgroundColor}`}
                      style={{ top: `${top}px`, height: `${height}px` }}
                      onClick={() => showModal(event)}
                    >
                      {event.title}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {selectedEvent && (
          <ScheduleModal isVisible={isModalVisible} event={selectedEvent} onClose={handleCancel} />
        )}

        <FreeTimeModal
          isVisible={isFreeTimeModalVisible}
          onCancel={handleCancel}
          initialData={modalInitialData}
          onSave={fetchTrainerDataAndEvents}
          selectedTrainer={selectedTrainer}
        />
      </div>
    </div>
  );
};

export default Schedule;
