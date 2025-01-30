"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EventModal from "./modal";
import jwt_decode from "jwt-decode";
import EventCard from "./eventCard";
import CalendarGrid from "./calenderGrid";
import { format, addDays, isToday, isTomorrow } from "date-fns";
import { fetchEvents } from "./calenderAPI";

export default function CalendarPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<{ [key: string]: any[] }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decoded: any = jwt_decode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token:", err);
        setError("Token is invalid or expired.");
        router.push("/login");
      }
    } else {
      setError("No token found.");
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      const today = new Date();
      const next10Days = Array.from({ length: 10 }, (_, i) =>
        addDays(today, i)
      );

      setIsLoading(true);

      try {
        const eventsData: { [key: string]: any[] } = {};
        for (const day of next10Days) {
          const dateKey = format(day, "yyyy-MM-dd");
          const eventList = await fetchEvents(dateKey);
          eventsData[dateKey] = eventList;
        }
        setEvents(eventsData);
      } catch (error) {
        console.error("Failed to load events.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  const handleDateClick = async (date: Date) => {
    setSelectedDate(date);
    const dateKey = format(date, "yyyy-MM-dd");

    setIsLoading(true);

    try {
      const eventList = await fetchEvents(dateKey);
      setEvents((prev) => ({ ...prev, [dateKey]: eventList }));
    } catch (error) {
      console.error("Failed to load events.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = async (event: any) => {
    try {
      // Need to add calling delete api
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
    <div className="flex flex-col lg:flex-row h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 bg-gray-800 p-6 text-white overflow-y-auto border-r border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-red-500">
          Upcoming Events
        </h2>
        <div className="space-y-6">
          {Object.entries(events).map(([dateKey, events]) => {
            const date = new Date(dateKey);
            return (
              <div key={dateKey}>
                <h3 className="text-lg font-semibold mb-2 text-gray-400">
                  {formatDayHeading(date)}
                </h3>
                {events.length > 0 ? (
                  <div className="space-y-3">
                    {events.map((event, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors cursor-pointer border border-gray-600"
                        onClick={() => handleEditEvent(event)}
                      >
                        <p className="text-sm font-medium truncate text-red-400 font-semibold">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-300 truncate">
                          {event.startTime} - {event.endTime}
                          <br />
                          {event.duration} minutes
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">
                    No events for this day
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-red-500">Calendars</h1>
          <button
            onClick={() => router.push("/pinboard")}
            className="text-sm text-red-400 hover:underline"
          >
            Back to Pinboard
          </button>
        </div>

        {/* Calendar Grid Component */}
        <CalendarGrid
          selectedDate={selectedDate}
          handleDateClick={handleDateClick}
          setIsModalOpen={setIsModalOpen}
        />

        {/* Event Details Pane */}
        {isLoading ? (
          <div className="flex justify-center items-center mt-10">
            <div className="border-t-4 border-white border-solid w-16 h-16 rounded-full animate-spin"></div>
          </div>
        ) : events[format(selectedDate, "yyyy-MM-dd")]?.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {events[format(selectedDate, "yyyy-MM-dd")].map((event, index) => (
              <EventCard
                key={index}
                event={event}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
              />
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No events for this date.</p>
        )}
      </div>

      {/* Floating Button */}
      <button
        onClick={handleAddButtonClick}
        className="text-[50px] fixed bottom-10 right-10 bg-red-500 text-white w-20 rounded-full shadow-lg hover:bg-red-600 transition"
      >
        +
      </button>

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
