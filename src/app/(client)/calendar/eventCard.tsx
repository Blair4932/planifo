import React from "react";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    duration: number;
    startTime: string;
    endTime: string;
    location?: string;
  };
  onEdit: (event: any) => void;
  onDelete: (event: any) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  return (
    <li className="p-4 bg-gray-700 rounded-lg shadow-sm hover:bg-gray-600 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-red-400">{event.title}</h3>
          <p className="text-sm text-gray-300">{event.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">{event.duration} mins</span>
          <button
            className="text-gray-400 hover:text-red-500 transition-colors"
            onClick={() => onEdit(event)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            className="text-gray-400 hover:text-red-500 transition-colors"
            onClick={() => onDelete(event)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      {event.startTime && (
        <div className="mt-2 flex items-center text-sm text-gray-400">
          <span>
            {event.startTime} - {event.endTime}
          </span>
        </div>
      )}
    </li>
  );
};

export default EventCard;
