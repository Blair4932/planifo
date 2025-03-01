"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useMemo } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default function NoteDetails() {
  const [note, setNote] = useState<any>(null);
  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [noteNotFound, setNoteNotFound] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const quillRef = useRef<Quill | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const router = useRouter();

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        [{ align: ["", "center", "right", "justify"] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["clean"],
      ],
    }),
    []
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
          fetchNoteDetails();
          fetchRecentNotes(data.user.id);
          await initializeQuill();
        } else {
          setError("Failed to get user.");
          router.replace("/login");
        }
      } catch (e) {
        setError("Error getting user: " + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      editorRef.current &&
      !quillRef.current
    ) {
      const quill = new Quill(editorRef.current, {
        theme: "snow",
        modules: modules,
        placeholder: "Start writing your masterpiece...",
      });

      quill.on("text-change", () => {
        const content = quill.root.innerHTML;
        setNote((prev) => ({ ...prev, content }));
      });

      if (note?.content) {
        quill.clipboard.dangerouslyPasteHTML(note.content);
      }

      quillRef.current = quill;
    }
  }, [modules, note?.content]);

  const initializeQuill = () => {
    if (editorRef.current && !quillRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: "snow",
        modules: modules,
        formats: [
          "header",
          "bold",
          "italic",
          "underline",
          "blockquote",
          "list",
          "bullet",
          "link",
          "align",
          "color",
          "background",
          "font",
          "size",
          "clean",
        ],
        placeholder: "Start writing...",
      });

      quill.on("text-change", () => {
        const content = quill.root.innerHTML;
        setNote((prev: any) => ({ ...prev, content }));
      });

      quillRef.current = quill;
    }
  };

  const fetchNoteDetails = async () => {
    try {
      if (params.id) {
        const res = await fetch(`/api/get-notes/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setNote(data.note);
          setEditedTitle(data.note.title);
          if (quillRef.current) {
            quillRef.current.root.innerHTML = data.note.content;
          }
        } else {
          setNoteNotFound(true);
        }
      }
    } catch (error) {
      setError("Failed to load note");
    }
  };

  const saveNote = async () => {
    setSaving(true);
    try {
      const content = quillRef.current?.root.innerHTML || "";
      const res = await fetch(`/api/update-note/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, title: editedTitle }),
      });

      if (res.ok) {
        toast.success("Document saved successfully");
      } else {
        toast.error("Failed to save document");
      }
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
        router.push("/editor");
      }
    } catch (e) {
      console.error("Error deleting note: ", e);
    }
  };

  const fetchRecentNotes = async (userId: string) => {
    try {
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
          .slice(0, 10);

        setRecentNotes(sortedNotes);
      } else {
        console.error("Failed to fetch recent notes:", data.error);
      }
    } catch (error) {
      console.error("Error fetching recent notes:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="border-t-4 border-yellow-400 border-solid w-16 h-16 rounded-full animate-spin"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Top Bar */}
      <div className="p-4 h-24 flex items-center bg-gray-800/90 backdrop-blur-md border-b border-gray-700">
        <div className="max-w-7xl w-[74%] mx-auto flex items-center justify-between">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="text-2xl bg-transparent border-none focus:ring-0 text-white placeholder-gray-400 font-bold w-full max-w-2xl"
            placeholder="Untitled Document"
          />
          <div className="flex gap-4 items-center">
            <button
              onClick={saveNote}
              disabled={saving}
              className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-300 transition font-medium flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <SaveIcon className="w-5 h-5" />
                  Save
                </>
              )}
            </button>
            <button
              onClick={deleteNote}
              className="px-4 py-2 text-red-400 hover:text-red-300 transition font-medium flex items-center gap-2"
            >
              <TrashIcon className="w-5 h-5" />
              Delete
            </button>
            <p
              className="cursor-pointer text-white"
              onClick={() => router.push("/editor")}
            >
              Back to Editor
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 p-4">
        {/* Recent Editor Sidebar */}
        <div className="col-span-2 bg-gray-800/50 backdrop-blur-md rounded-lg p-4 border border-gray-700">
          <h3 className="text-sm font-semibold text-yellow-400 mb-4">
            Recent Editor
          </h3>
          <div className="space-y-2">
            {recentNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => router.push(`/editor/${note.id}`)}
                className="p-2 hover:bg-gray-700/50 rounded cursor-pointer transition group"
              >
                <p className="text-sm text-gray-300 truncate group-hover:text-white">
                  {note.title || "Untitled"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {new Date(note.lastUpdatedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Editor Container */}
        <div className="col-span-10 bg-gray-800/30 backdrop-blur-md rounded-lg border border-gray-700">
          <div
            ref={editorRef}
            className="h-[calc(100vh-180px)] quill-custom-style"
          />
        </div>
      </div>

      <style jsx global>{`
        .ql-toolbar {
          border: none !important;
          background: rgba(31, 41, 55, 0.8) !important;
          border-radius: 8px 8px 0 0;
          padding: 8px !important;
        }

        .ql-container {
          border: none !important;
          font-family: inherit;
          font-size: 1rem;
          background: rgba(17, 24, 39, 0.3) !important;
        }

        .ql-editor {
          min-height: calc(100vh - 180px) !important;
          color: #f3f4f6 !important;
          padding: 2rem !important;
        }
        .ql-editor.ql-blank::before {
          color: white !important;
        }

        .ql-snow .ql-stroke {
          stroke: #e5e7eb !important;
        }

        .ql-snow .ql-fill {
          fill: #e5e7eb !important;
        }

        .ql-snow .ql-picker {
          color: #e5e7eb !important;
        }

        .ql-snow.ql-toolbar button:hover .ql-stroke {
          stroke: #fbbf24 !important;
        }

        .ql-snow .ql-picker-options {
          background-color: #1f2937 !important;
          border: 1px solid #374151 !important;
          border-radius: 6px !important;
          padding: 8px !important;
        }

        .ql-snow .ql-picker-item.ql-selected {
          color: #fbbf24 !important;
        }
      `}</style>
      <footer className="bg-gray-900 text-gray-200 p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <p className="text-sm">© 2025 planifo.com - All rights reserved</p>
          <p className="text-sm">Contact: admin@planifo.com</p>
        </div>
      </footer>
    </div>
  );
}

function SaveIcon(props: any) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function TrashIcon(props: any) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}
