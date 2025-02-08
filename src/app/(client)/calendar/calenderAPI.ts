export const fetchEvents = async (date: string, userId: string) => {
  try {
    const res = await fetch("/api/events/get-events", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        data: JSON.stringify({ date, userId }),
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch events: ${res.statusText}`);
    }

    const data = await res.json();
    return data.events;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const updateEvent = async (eventData: {
  id: string;
  title?: string;
  description?: string;
  duration?: number;
  startTime?: string;
  endTime?: string;
  date?: string;
}) => {
  try {
    const res = await fetch("/api/events/update-event", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    if (!res.ok) throw new Error("Failed to update event");

    const data = await res.json();
    return data.event;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

export const deleteEvent = async (eventId: string) => {
  try {
    const res = await fetch("/api/events/delete-event", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: eventId }),
    });

    if (!res.ok) throw new Error("Failed to delete event");

    const data = await res.json();
    return data.message;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

export const createEvent = async (eventData: {
  title: string;
  description: string;
  duration: string;
  startTime: string;
  endTime: string;
  date: string;
  userId: string;
}) => {
  try {
    const res = await fetch("/api/events/create-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    if (!res.ok) throw new Error("Failed to create event");

    const data = await res.json();
    return data.event;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};
