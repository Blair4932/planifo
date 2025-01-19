"use client";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useRouter, useParams } from "next/navigation";

export default function NoteDetails() {
  const [note, setNote] = useState<any>(null);
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [noteNotFound, setNoteNotFound] = useState(false);
  const params = useParams();
  const router = useRouter();

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

    setLoading(false);
  }, [router]);

  const fetchNoteDetails = async () => {
    try {
      if (params.id) {
        const res = await fetch(`/api/get-notes/${params.id}`, {
          method: "GET",
        });

        if (res.ok) {
          const data = await res.json();
          setNote(data.note);
          setEditedContent(data.note.content || "");
          setEditedTitle(data.note.title);
        } else {
          setTimeout(() => {
            setNoteNotFound(true);
            setLoading(true);
          }, 1000);
          console.error("Failed to fetch note details");
          setError("Failed to fetch note details.");
        }
      }
    } catch (error) {
      console.error("Error fetching note details:", error);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async () => {
    try {
      const res = await fetch(`/api/update-note/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: editedContent,
          title: editedTitle,
        }),
      });

      if (res.ok) {
        setNote((prevNote: any) => ({
          ...prevNote,
          title: editedTitle,
          content: editedContent,
        }));
      } else {
        console.error("Failed to save note.");
        setError("Failed to save note");
      }
    } catch (error) {
      console.error("Error saving note:", error);
      alert("An unexpected error occurred.");
    }
  };

  const deleteNote = async () => {
    try {
      const res = await fetch(`/api/delete-note/${params.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          noteId: note.id,
        }),
      });

      if (res.ok) {
        router.push("/notes");
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchNoteDetails();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="border-t-4 border-blue-600 border-solid w-16 h-16 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (noteNotFound) {
    return <p className="text-center text-gray-600">Note not found</p>;
  }

  if (!note) {
    return null;
  }

  return (
    <div className="flex gap-16 flex-col lg:flex-row p-4 max-w-full mx-auto pt-24">
      {/* Note Content Section */}
      <div className="ml-8 flex-1 p-4 border border-yellow-400 rounded-lg shadow-md">
        {/* Editable Title */}
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="text-3xl font-bold mb-4 text-left bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 w-full"
          placeholder="Title"
        />
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="text-black w-full h-[400px] p-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="No content"
          readOnly={false}
        />
      </div>

      {/* Details Pane */}
      <div className="w-full mr-8 lg:w-64 mt-6 lg:mt-0 lg:ml-6 p-4 border border-yellow-400 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Details</h2>
        <ul className="space-y-2 text-gray-700">
          <li>
            <strong>Created:</strong>{" "}
            {new Date(note.createdAt).toLocaleString()}
          </li>
          <li>
            <strong>Last Modified:</strong>{" "}
            {new Date(note.lastUpdatedAt).toLocaleString()}
          </li>
          <li>
            <strong>Character Count:</strong> {editedContent.length}
          </li>
        </ul>

        <button
          onClick={saveNote}
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Save
        </button>

        <button
          onClick={deleteNote}
          className="w-full mt-4 text-white bg-red-500 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition"
        >
          Delete
        </button>
        <button
          onClick={() => router.push("/notes")}
          className="w-full mt-4 bg-gray-800 text-white py-2 rounded-md hover:bg-gray-950 transition"
        >
          Back to Notes
        </button>
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </div>
  );
}
