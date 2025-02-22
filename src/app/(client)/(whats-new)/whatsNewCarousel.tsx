"use client";
import React from "react";
import Slider from "react-slick";
import { updateMessage } from "@/update";
import Skeleton from "react-loading-skeleton"; // Use react-loading-skeleton for better animations
import "react-loading-skeleton/dist/skeleton.css"; // Import the CSS

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const WhatsNew: React.FC<any> = ({ events, loading }) => {
  const getNextThreeDays = () => {
    return Array.from({ length: 7 }, (_, i) => {
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
    <div className="border select-none border-gray-700 w-[40%] h-[600px] rounded-lg p-5 bg-gray-900/80 backdrop-blur-lg shadow-xl">
      <Slider {...settings} className="w-full h-[600px] relative group">
        {/* Slide 1: Updates */}
        <div>
          <div className="flex flex-col h-full overflow-y-scroll p-6 bg-gray-900/50 rounded-lg shadow-lg">
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
          <div className="flex flex-col h-[550px] overflow-auto p-6 bg-gray-900/50 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-gray-100 mb-4">
              Upcoming Events
            </h3>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-red-500 bg-gray-700 p-3 rounded-lg rounded-l-sm"
                  >
                    {/* Event Title Skeleton */}
                    <div className="flex justify-between items-start">
                      <Skeleton
                        width={150}
                        height={20}
                        className="mb-2"
                        baseColor="#ffffff"
                        highlightColor="#4FD1C5"
                      />{" "}
                      {/* Title */}
                      <Skeleton
                        width={80}
                        height={15}
                        className="mb-2"
                        baseColor="#ffffff"
                        highlightColor="#4FD1C5"
                      />{" "}
                      {/* Time */}
                    </div>
                    {/* Event Description Skeleton */}
                    <Skeleton
                      width="100%"
                      height={12}
                      count={2}
                      baseColor="#ffffff"
                      highlightColor="#4FD1C5"
                    />{" "}
                    {/* Description */}
                  </div>
                ))}
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default WhatsNew;
