"use client";
import React from "react";
import Slider from "react-slick";
import { updateMessage } from "@/update";

// Import Slick Carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const WhatsNew: React.FC<any> = ({ events }) => {
  const getNextThreeDays = () => {
    return Array.from({ length: 3 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date;
    });
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
  };

  return (
    <div className="border select-none border-gray-700 w-[40%] h-[500px] rounded-lg p-5 bg-gray-900/80 backdrop-blur-lg shadow-xl">
      <Slider {...settings} className="w-full h-full relative group">
        {/* Slide 1: Updates */}
        <div>
          <div className="flex flex-col h-full p-6 bg-gray-900/50 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-gray-100 mb-4">
              What's New
            </h3>
            <div className="border-l-4 border-teal-400 pl-4">
              <h4 className="text-lg font-semibold text-gray-200">
                {updateMessage.title}
              </h4>
              <p className="text-sm text-gray-400 mt-1">
                Version {updateMessage.version} - {updateMessage.date}
              </p>
              <p className="text-sm text-gray-300 mt-3 leading-relaxed">
                {updateMessage.content}
              </p>
              <p className="text-xs text-gray-500 mt-2 italic">
                {updateMessage.extra}
              </p>
            </div>
          </div>
        </div>

        {/* Slide 2: Upcoming Events */}
        <div>
          <div className="flex flex-col h-full overflow-auto p-6 bg-gray-900/50 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-gray-100 mb-4">
              Upcoming Events
            </h3>
            <div className="space-y-4">
              {getNextThreeDays().map((day, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="text-lg font-semibold text-gray-200">
                    {index === 0
                      ? "Today"
                      : day.toLocaleDateString("en-GB", { weekday: "long" })}
                  </h4>
                  {events
                    .filter((event) => isSameDay(new Date(event.date), day))
                    .sort((a, b) => {
                      if (a.allDay && !b.allDay) return -1;
                      if (!a.allDay && b.allDay) return 1;
                      if (a.startTime < b.startTime) return -1;
                      if (a.startTime > b.startTime) return 1;
                      return 0;
                    })
                    .map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className="border-l-4 border-red-500 bg-gray-700 p-3 rounded-lg rounded-l-sm"
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="text-md font-medium text-gray-200">
                            {event.title}
                          </h4>
                          <span className="text-xs text-gray-400">
                            {event.reminder
                              ? event.startTime
                              : event.allDay
                                ? ""
                                : `${event.startTime} - ${event.endTime}`}
                            <br />
                            {event.duration}{" "}
                            {!event.reminder && !event.allDay && (
                              <span>mins</span>
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                    ))}
                  {events.filter((event) =>
                    isSameDay(new Date(event.date), day)
                  ).length === 0 && (
                    <p className="text-sm text-gray-500">
                      No events scheduled.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default WhatsNew;
