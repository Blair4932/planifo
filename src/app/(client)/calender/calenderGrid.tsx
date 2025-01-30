import React, { useState } from "react";
import {
  format,
  startOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
} from "date-fns";

const CalendarGrid = ({
  selectedDate,
  handleDateClick,
  setIsModalOpen,
}: {
  selectedDate: Date;
  handleDateClick: (date: Date) => Promise<void>;
  setIsModalOpen: (state: boolean) => void;
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleGoToToday = async () => {
    const today = new Date();
    setCurrentDate(today);
    await handleDateClick(today);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 select-none">
      <div className="flex justify-between items-center ">
        <button
          onClick={handlePrevMonth}
          className="text-gray-200 hover:text-red-500 transition-colors p-2 rounded-full"
        >
          &#8592; Month
        </button>
        <button
          onClick={handlePrevWeek}
          className="text-gray-200 hover:text-red-500 transition-colors p-2 rounded-full"
        >
          &#8592; Week
        </button>
        <span className="text-xl font-bold text-gray-200">
          {format(currentDate, "MMMM yyyy")}
        </span>
        <button
          onClick={handleNextWeek}
          className="text-gray-200 hover:text-red-500 transition-colors p-2 rounded-full"
        >
          Week &#8594;
        </button>
        <button
          onClick={handleNextMonth}
          className="text-gray-200 hover:text-red-500 transition-colors p-2 rounded-full"
        >
          Month &#8594;
        </button>
      </div>

      <div className="flex justify-center items-center mb-5 mt-1">
        <button
          onClick={handleGoToToday}
          className="bg-red-500 text-white p-2 rounded-full px-3 hover:bg-red-700 transition-colors text-sm"
        >
          Jump to Today
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-bold text-red-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => {
          const day = addDays(startOfWeek(currentDate), i);
          return (
            <div
              key={day.toString()}
              className={`flex flex-col items-center justify-center h-32 border border-gray-700 ${
                !isSameMonth(day, currentDate)
                  ? "text-gray-500"
                  : "text-gray-200"
              } ${isSameDay(day, selectedDate) ? "bg-red-600 text-white" : "hover:bg-gray-700"} transition-colors cursor-pointer p-2`}
              onClick={() => handleDateClick(day)}
              onDoubleClick={() => setIsModalOpen(true)}
            >
              <span className="text-lg">{format(day, "d")}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
