"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EventModal from "./modal";
import EventCard from "./eventCard";
import CalendarGrid from "./calenderGrid";
import {
  format,
  addDays,
  isToday,
  isTomorrow,
  startOfWeek,
  subWeeks,
  addWeeks,
  subMonths,
  addMonths,
} from "date-fns";
import { deleteEvent, fetchEvents } from "./calenderAPI";
import { handleLogout } from "../(global-functions)/clientSessionHandler";

export default function CalendarPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<{ [key: string]: any[] }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user");
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setIsLoading(false);
      } else {
        handleLogout();
        setError("Failed to fetch user");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      if (!user?.id) return;

      setIsLoading(true);

      try {
        const eventsData: { [key: string]: any[] } = {};

        const today = new Date();
        const next14Days = Array.from({ length: 14 }, (_, i) =>
          addDays(today, i)
        );

        const weekStart = startOfWeek(currentDate);
        const calendarDays = Array.from({ length: 7 }, (_, i) =>
          addDays(weekStart, i)
        );

        const allDates = [...next14Days, ...calendarDays];
        const uniqueDates = Array.from(
          new Set(allDates.map((d) => format(d, "yyyy-MM-dd")))
        );

        for (const dateKey of uniqueDates) {
          const eventList = await fetchEvents(dateKey, user.id);
          eventsData[dateKey] = eventList;
        }

        setEvents((prev) => ({ ...prev, ...eventsData }));
      } catch (error) {
        console.error("Failed to load events.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, [user, currentDate]);

  const handleDateClick = async (date: Date) => {
    if (!user?.id) return;

    setCurrentDate(date);
    setSelectedDate(date);
    const dateKey = format(date, "yyyy-MM-dd");

    if (!events[dateKey]) {
      setIsLoading(true);
      try {
        const eventList = await fetchEvents(dateKey, user.id);
        setEvents((prev) => ({ ...prev, [dateKey]: eventList }));
      } catch (error) {
        console.error("Failed to load events.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePrevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleAddButtonClick = () => setIsModalOpen(true);
  const handleEditEvent = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };
  const handleDeleteEvent = async (event: any) => {
    try {
      await deleteEvent(event.id);
      const dateKey = format(selectedDate, "yyyy-MM-dd");
      setEvents((prev) => ({
        ...prev,
        [dateKey]: prev[dateKey].filter((e) => e.id !== event.id),
      }));
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  const formatDayHeading = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEEE, MMMM d");
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-8">
          <h1
            className="text-3xl font-bold text-red-500 cursor-pointer"
            onClick={() => router.push("/pinboard")}
          >
            Calendar
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleAddButtonClick}
              className="bg-red-500 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
            >
              +
            </button>
            <button
              onClick={() => router.push("/pinboard")}
              className="text-gray-300 hover:text-red-500 transition-colors"
            >
              Back to Pinboard
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Compact Sidebar */}
          <div className="lg:col-span-1 bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-red-500">
              Upcoming
            </h2>
            {isLoading && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
              </div>
            )}
            <div className="space-y-4">
              {Object.entries(events)
                .flatMap(([dateKey, events]) =>
                  events.map((event) => ({ ...event, dateKey }))
                )
                .slice(0, 14)
                .map((event, index, arr) => {
                  const date = new Date(event.dateKey);
                  const showDateHeader =
                    index === 0 || event.dateKey !== arr[index - 1].dateKey;

                  return (
                    <div key={index} className="group">
                      {showDateHeader && (
                        <h3 className="text-sm font-medium mb-1 text-gray-400">
                          {formatDayHeading(date)}
                        </h3>
                      )}
                      <div
                        className="p-2 bg-gray-700/50 rounded-md hover:bg-gray-600/50 transition-colors cursor-pointer border-l-2 border-red-500"
                        onClick={() => handleEditEvent(event)}
                      >
                        <p className="text-xs font-medium truncate text-red-400">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-300 mt-1">
                          {event.reminder
                            ? event.startTime
                            : event.allDay
                              ? "All Day"
                              : `${event.startTime} - ${event.endTime}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Main Calendar Area */}
          <div className="lg:col-span-4">
            {/* Calendar Grid Component */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl">
              <CalendarGrid
                selectedDate={selectedDate}
                currentDate={currentDate}
                handleDateClick={handleDateClick}
                setIsModalOpen={setIsModalOpen}
                events={events}
                onNavigate={{
                  handlePrevWeek,
                  handleNextWeek,
                  handlePrevMonth,
                  handleNextMonth,
                }}
              />
            </div>

            {/* Selected Date Events */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4 text-red-500">
                {format(selectedDate, "EEEE, MMMM d")} Events
              </h2>
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
                </div>
              ) : events[format(selectedDate, "yyyy-MM-dd")]?.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {events[format(selectedDate, "yyyy-MM-dd")]
                    .sort((a, b) => {
                      if (a.allDay && !b.allDay) return -1;
                      if (!a.allDay && b.allDay) return 1;
                      return a.startTime.localeCompare(b.startTime);
                    })
                    .map((event, index) => (
                      <EventCard
                        key={index}
                        event={event}
                        onEdit={handleEditEvent}
                        onDelete={handleDeleteEvent}
                      />
                    ))}
                </div>
              ) : (
                <div className="text-center p-6 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
                  <p className="text-gray-400">No events scheduled</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <EventModal
          setIsModalOpen={setIsModalOpen}
          setEvents={setEvents}
          events={events}
          user={user}
          date={selectedDate}
          selectedEvent={selectedEvent}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
