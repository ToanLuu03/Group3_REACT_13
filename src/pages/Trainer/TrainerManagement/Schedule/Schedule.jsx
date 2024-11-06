import React, { useEffect, useState } from "react";
import { Calendar, Select, Spin, Badge } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import FreeTimeModal from "../../../../components/Modal/FreeTimeModal/FreeTimeModal";
import ScheduleModal from "../../../../components/Modal/ScheduleModal/ScheduleModal";
import { fetchTrainerSchedule, fetchTrainerFreeTime } from "../../../../services/schedule/index";
import TrainerAPI from "../../../../services/trainer";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

const Schedule = () => {
  const [view, setView] = useState("month");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFreeTimeModalVisible, setIsFreeTimeModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalInitialData, setModalInitialData] = useState(null);
  const [currentDateRange, setCurrentDateRange] = useState({
    start: dayjs().startOf("month"),
    end: dayjs().endOf("month"),
  });
  const [events, setEvents] = useState([]);
  const [calendarDate, setCalendarDate] = useState(dayjs());
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null); // Add state for selected date
  const calendarRef = React.createRef();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

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
        const startDate = dayjs(item.startDate);
        const endDate = dayjs(item.endDate);

        const attendeeColors = {
          "FRESHER": "orange",
          "INTERN": "green",
          "FREETIME": "lightblue",
        };

        const backgroundColor = attendeeColors[item.attendeeType] || "grey";
        
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
              let currentDay = startDate;
              while (currentDay.isBefore(endDate) || currentDay.isSame(endDate)) {
                const eventDate = currentDay.startOf("month").add(day, "day");
                eventDays.push({
                  id: item.id,
                  title: item.module.name,
                  start: `${eventDate.format("YYYY-MM-DD")}T${dayMappings[day].start}`,
                  end: `${eventDate.format("YYYY-MM-DD")}T${dayMappings[day].end}`,
                  attendeeType: item.attendeeType,
                  isFreeTime: false,
                  backgroundColor: backgroundColor,
                });
                currentDay = currentDay.add(1, "month");
              }
            }
          });
        }
        return eventDays;
      });

      const freeTimeData = freeTimeResponse.data.data.map((item) => {
        const startDate = dayjs(item.startTime);
        const endDate = dayjs(item.endTime);
        return {
          id: item.id,
          title: "Free Time",
          start: startDate.format(),
          end: endDate.format(),
          attendeeType: "FREETIME",
          isFreeTime: true,
          backgroundColor: "lightblue",
        };
      });
      setEvents([...scheduleData, ...freeTimeData]);
    } catch (error) {
      console.error("Error fetching schedule or free time data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainerDataAndEvents = async () => {
    setLoading(true);
    const trainer = await fetchTrainerInfo();
    if (trainer) {
      await fetchEvents(trainer.account);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainerDataAndEvents();
  }, [currentDateRange]);

  const handleDateClick = (info) => {
    setModalInitialData({ date: info.dateStr });
    setIsFreeTimeModalVisible(true);
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsFreeTimeModalVisible(false);
    setSelectedEvent(null);
  };

  const onDateSelect = (value) => {
    setSelectedDate(value); // Set the selected date
    if (value.isSame(currentDateRange.start, "month")) {
      setCalendarDate(value);
      if (calendarRef.current) {
        calendarRef.current.getApi().gotoDate(value.format("YYYY-MM-DD"));
      }
    } else {
      setCalendarDate(value);
      setCurrentDateRange({
        start: value.startOf("month"),
        end: value.endOf("month"),
      });
      if (calendarRef.current) {
        calendarRef.current.getApi().gotoDate(value.format("YYYY-MM-DD"));
      }
      fetchTrainerDataAndEvents();
    }
  };
  
  const handleTodayClick = () => {
    const today = dayjs();
    setCalendarDate(today);
    setCurrentDateRange({
      start: today.startOf("month"),
      end: today.endOf("month"),
    });
    calendarRef.current.getApi().today();
  };

  // Helper function to check if a day has events
  const hasEvents = (date) => {
    return events.some((event) => dayjs(event.start).isSame(date, "day"));
  };

  // Custom date cell rendering with a notice for days with events
  const dateFullCellRender = (date) => {
    const hasEvent = hasEvents(date);
    const isSelected = selectedDate && selectedDate.isSame(date, "day");
    return (
      <div className={`relative h-6 w-7 rounded-lg ${isSelected ? 'bg-blue-500 text-white' : ''}`} onClick={() => onDateSelect(date)}>
        {date.date()}
        {hasEvent && (
          <Badge
            color="orange"
            className=" absolute -top-2 right-1"
          />
        )}
      </div>
    );
  };

  return (
    <div className="p-4 relative">
      {loading && (
        <div className="fixed inset-0 z-50 bg-white bg-opacity-75 flex justify-center items-center">
          <Spin size="large" tip="Loading..." />
        </div>
      )}

      <div className={`opacity-${loading ? "50" : "100"} transition-opacity duration-300`}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-1/4 border border-gray-300 rounded-lg p-4 shadow-md h-96 overflow-y-auto">
            <Calendar 
              fullscreen={false}
              onSelect={onDateSelect}
              value={calendarDate}
              dateFullCellRender={dateFullCellRender}
              headerRender={({ value, onChange }) => {
                const year = value.year();
                const month = value.month();
                const monthOptions = [];
                const current = value.clone();
                const localeData = value.localeData();
                for (let i = 0; i < 12; i++) {
                  monthOptions.push(
                    <Select.Option key={i} value={i}>
                      {localeData.monthsShort(current.month(i))}
                    </Select.Option>
                  );
                }
                const yearOptions = [];
                for (let i = year - 10; i < year + 10; i++) {
                  yearOptions.push(
                    <Select.Option key={i} value={i}>
                      {i}
                    </Select.Option>
                  );
                }

                return (
                  <div className="flex justify-center items-center space-x-4">
                    <Select
                      value={year}
                      onChange={(newYear) => {
                        const now = value.clone().year(newYear);
                        onChange(now);
                      }}
                      dropdownMatchSelectWidth={false}
                      className="border rounded-md px-2 py-1" 
                    >
                      {yearOptions}
                    </Select>
                    <Select
                      value={month}
                      onChange={(newMonth) => {
                        const now = value.clone().month(newMonth);
                        onChange(now);
                      }}
                      dropdownMatchSelectWidth={false}
                      className="border rounded-md px-2 py-1"
                    >
                      {monthOptions}
                    </Select>
                  </div>
                );
              }}
            />
          </div>

          <div className="w-full lg:w-3/4 border border-gray-300 rounded-lg p-4 shadow-md">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              initialDate={calendarDate.format("YYYY-MM-DD")}
              events={events}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              headerToolbar={{
                left: "today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              editable={true}
              allDaySlot={false}
              height="auto"
              slotMinTime="08:00:00"
              slotMaxTime="21:00:00"
              customButtons={{
                today: {
                  text: 'today',
                  click: handleTodayClick,
                },
              }}
            />
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
