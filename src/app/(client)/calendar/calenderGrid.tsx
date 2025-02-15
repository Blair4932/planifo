import React from "react";
import {
  format,
  startOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";

const CalendarGrid = ({
  selectedDate,
  currentDate,
  handleDateClick,
  setIsModalOpen,
  events,
  onNavigate,
}: {
  selectedDate: Date;
  currentDate: Date;
  handleDateClick: (date: Date) => Promise<void>;
  setIsModalOpen: (state: boolean) => void;
  events: { [key: string]: any[] };
  onNavigate: {
    handlePrevWeek: () => void;
    handleNextWeek: () => void;
    handlePrevMonth: () => void;
    handleNextMonth: () => void;
  };
}) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      {/* Navigation controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <button
            onClick={onNavigate.handlePrevMonth}
            className="text-gray-300 hover:text-red-500 px-3 py-1 rounded-lg transition-colors text-sm"
          >
            ← Month
          </button>
          <button
            onClick={onNavigate.handlePrevWeek}
            className="text-gray-300 hover:text-red-500 px-3 py-1 rounded-lg transition-colors text-sm"
          >
            ← Week
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-lg font-medium text-gray-200">
            {format(currentDate, "MMMM yyyy")}
          </span>
          <button
            onClick={() => handleDateClick(new Date())}
            className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors"
          >
            Today
          </button>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={onNavigate.handleNextWeek}
            className="text-gray-300 hover:text-red-500 px-3 py-1 rounded-lg transition-colors text-sm"
          >
            Week →
          </button>
          <button
            onClick={onNavigate.handleNextMonth}
            className="text-gray-300 hover:text-red-500 px-3 py-1 rounded-lg transition-colors text-sm"
          >
            Month →
          </button>
        </div>
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-7 gap-px bg-gray-700">
        {Array.from({ length: 7 }).map((_, i) => {
          const day = addDays(startOfWeek(currentDate), i);
          const dateKey = format(day, "yyyy-MM-dd");
          const dayEvents = events[dateKey] || [];
          const eventCount = dayEvents.length;

          return (
            <div
              key={day.toString()}
              className={`relative aspect-square bg-gray-800 p-2 select-none ${
                isSameDay(day, selectedDate)
                  ? "bg-red-500/20"
                  : "hover:bg-gray-700"
              } transition-colors cursor-pointer group`}
              onClick={() => handleDateClick(day)}
              onDoubleClick={() => setIsModalOpen(true)}
            >
              {/* Date number */}
              <div
                className={`text-sm ${
                  !isSameMonth(day, currentDate)
                    ? "text-gray-600"
                    : "text-gray-300"
                } ${isToday(day) ? "text-red-500 font-bold" : ""}`}
              >
                {format(day, "d")}
              </div>

              {/* Event indicators */}
              {eventCount > 0 && (
                <div className="absolute bottom-2 right-2 flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-xs text-red-400 font-medium">
                    {eventCount}
                  </span>
                </div>
              )}

              {/* Hover tooltip */}
              {eventCount > 0 && (
                <div className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-700 px-2 py-1 rounded-md text-xs text-gray-300 whitespace-nowrap shadow-lg border border-gray-600">
                  {eventCount} event{eventCount > 1 ? "s" : ""}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
