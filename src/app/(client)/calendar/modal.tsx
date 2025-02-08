"use client";
import { useState, useEffect } from "react";
import format from "date-fns/format";
import { createEvent } from "./calenderAPI";

export default function EventModal({
  user,
  date,
  onClose,
  events,
  setEvents,
  setIsModalOpen,
  selectedEvent,
}: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [startTimePeriod, setStartTimePeriod] = useState<string>("AM");
  const [endTimePeriod, setEndTimePeriod] = useState<string>("AM");

  useEffect(() => {
    const now = new Date();
    const formattedStartTime = format(now, "HH:mm");
    const formattedEndTime = format(
      new Date(now.getTime() + 60 * 60000),
      "HH:mm"
    );

    setStartTime(formattedStartTime);
    setEndTime(formattedEndTime);
    setStartTimePeriod(
      formattedStartTime.startsWith("12") ||
        parseInt(formattedStartTime.split(":")[0]) >= 12
        ? "PM"
        : "AM"
    );
    setEndTimePeriod(
      formattedEndTime.startsWith("12") ||
        parseInt(formattedEndTime.split(":")[0]) >= 12
        ? "PM"
        : "AM"
    );
  }, []);

  const handleSave = async () => {
    const calculatedDuration = calculateDuration(startTime, endTime);
    console.log("DURATION", calculatedDuration, startTime, endTime);

    const event = {
      title,
      description,
      startTime,
      endTime,
      duration: calculatedDuration,
      date: format(date, "yyyy-MM-dd"),
    };

    try {
      const newEvent = await createEvent({
        ...event,
        userId: user?.id,
      });

      let newDate = format(newEvent.date, "yyyy-MM-dd");

      let updatedEvents = [...(events[newDate] || []), newEvent];

      setEvents((prevEvents) => ({ ...prevEvents, [newDate]: updatedEvents }));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  const updatePeriod = (time: string) => {
    const [hours, minutes] = time.split(":");
    const isPM = parseInt(hours) >= 12;
    return isPM ? "PM" : "AM";
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    setStartTimePeriod(updatePeriod(newStartTime));
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndTime = e.target.value;
    setEndTime(newEndTime);
    setEndTimePeriod(updatePeriod(newEndTime));
  };

  const calculateDuration = (start: string, end: string): string => {
    const startTime = new Date(`1970-01-01T${start}`);
    const endTime = new Date(`1970-01-01T${end}`);

    let diff = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

    if (diff < 0) {
      diff += 24 * 60;
    }

    let durationStr;
    if (diff >= 60) {
      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;
      durationStr = `${hours}h ${minutes}m`;
    } else {
      durationStr = `${diff}m`;
    }

    setDuration(durationStr);
    return durationStr;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md shadow-xl border border-gray-700">
        <h2 className="text-2xl font-bold text-red-500 mb-6 text-center">
          Create New Event
        </h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 border border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              placeholder="Event details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 border border-gray-600 h-24"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Time
              </label>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={startTime}
                  onChange={handleStartTimeChange}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 border border-gray-600"
                />
                <span className="px-4 py-3 bg-gray-700 rounded-lg text-white">
                  {startTimePeriod}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Time
              </label>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={endTime}
                  onChange={handleEndTimeChange}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 border border-gray-600"
                />
                <span className="px-4 py-3 bg-gray-700 rounded-lg text-white">
                  {endTimePeriod}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Create Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
