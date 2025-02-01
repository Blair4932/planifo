"use client";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NoteDetails() {
  const [note, setNote] = useState<any>(null);
  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    setLoading(true);
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

  const fetchRecentNotes = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token found.");
      }

      const decoded: any = jwt_decode(token);
      const userId = decoded.id;

      if (!userId) {
        throw new Error("userId not found in token.");
      }

      const res = await fetch("/api/get-notes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          userId: userId.toString(),
        },
      });

      const data = await res.json();

      if (res.ok) {
        const sortedNotes = data.notes
          .filter((note: any) => note.id !== params.id)
          .sort(
            (a: any, b: any) =>
              new Date(b.lastUpdatedAt).getTime() -
              new Date(a.lastUpdatedAt).getTime()
          )
          .slice(0, 5);

        setRecentNotes(sortedNotes);
      } else {
        console.error("Failed to fetch recent notes:", data.error);
      }
    } catch (error) {
      console.error("Error fetching recent notes:", error);
    }
  };

  const saveNote = async () => {
    setSaving(true);
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
        toast.success("Note Saved Successfully");
      } else {
        toast.error("Failed to save: Note cannot be empty");
        console.error("Failed to save note.");
      }
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setSaving(false);
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
    } catch (e) {
      console.error("Error deleting note: ", e);
    }
  };

  useEffect(() => {
    fetchNoteDetails();
    fetchRecentNotes();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="border-t-4 border-yellow-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (noteNotFound) {
    return <p className="text-center text-gray-400">Note not found</p>;
  }

  if (!note) {
    return null;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 bg-gray-800 p-6 border-r border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400">
          Recently Worked On Notes
        </h2>
        <div className="space-y-4">
          {recentNotes.length > 0 ? (
            recentNotes.map((recentNote) => (
              <div
                key={recentNote.id}
                className="p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={() => router.push(`/notes/${recentNote.id}`)}
              >
                <h3 className="text-lg font-semibold truncate text-yellow-300">
                  {recentNote.title || "Untitled"}
                </h3>
                <p className="text-sm truncate text-gray-300">
                  {recentNote.content || "No content available"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No recent notes found.</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1
            className="text-3xl font-bold text-yellow-400 cursor-pointer hover:underline"
            onClick={() => router.push("/notes")}
          >
            Notes
          </h1>
          <button
            onClick={() => router.push("/pinboard")}
            className="text-sm text-yellow-400 hover:underline"
          >
            Back to Pinboard
          </button>
        </div>

        {/* Note Editor */}
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="text-3xl font-bold mb-4 text-left bg-transparent border-none outline-none focus:ring-2 focus:ring-yellow-500 w-full text-yellow-400 placeholder-yellow-600"
            placeholder="Title"
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-96 p-4 border border-gray-600 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-700 text-gray-100 placeholder-gray-400"
            placeholder="No content"
          />
        </div>

        {/* Buttons */}
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={saveNote}
            disabled={saving}
            className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-md hover:bg-yellow-600 transition disabled:bg-yellow-700 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="w-4 h-4 border-t-4 border-gray-900 border-solid rounded-full animate-spin mx-auto"></div>
            ) : (
              "Save"
            )}
          </button>

          <button
            onClick={deleteNote}
            className="px-6 py-2 bg-red-600 text-gray-100 rounded-md hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>

        {/* Note Details */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-yellow-400 mb-4">
            Details
          </h2>
          <ul className="space-y-2 text-gray-300">
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
        </div>
      </div>
    </div>
  );
}
