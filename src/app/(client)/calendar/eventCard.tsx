import React from "react";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    reminder: boolean;
    allDay: boolean;
    duration: string;
    startTime: string;
    endTime: string;
    location?: string;
  };
  onEdit: (event: any) => void;
  onDelete: (event: any) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-red-500/50 transition-colors group">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-red-400">{event.title}</h3>
          <p className="text-sm text-gray-300 mt-1">{event.description}</p>
          {event.location && (
            <p className="text-xs text-gray-400 mt-1">
              <svg
                className="inline mr-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {event.location}
            </p>
          )}
        </div>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(event)}
            className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-700/50"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(event)}
            className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-700/50"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-3 flex items-center text-sm text-gray-400">
        <svg
          className="mr-2 w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {event.reminder
          ? event.startTime
          : event.allDay
            ? "All Day"
            : `${event.startTime} - ${event.endTime}`}
      </div>
    </div>
  );
};

export default EventCard;
