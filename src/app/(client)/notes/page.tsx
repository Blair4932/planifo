"use client";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/navigation";
import Modal from "./modal";

export default function Notes() {
  const [user, setUser] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isGridView, setIsGridView] = useState(true);

  const router = useRouter();

  const toggleShowModal = () => {
    setNoteTitle("");
    setShowModal(!showModal);
  };

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  const fetchNotes = async (userId: number) => {
    setLoading(true);
    try {
      const res = await fetch("/api/get-notes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          userId: userId.toString(),
        },
      });

      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes);
        setFilteredNotes(data.notes);
      } else {
        console.error("Failed to fetch notes");
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    if (!noteTitle.trim()) {
      return;
    }

    try {
      const res = await fetch("/api/create-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: noteTitle,
          content: "",
          userId: user?.id,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setNoteTitle("");

        await fetchNotes(user?.id);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create note.");
      }
    } catch (error) {
      console.error("Error creating note:", error);
      alert("An unexpected error occurred.");
    }
  };

  const filterNotes = (query: string) => {
    setSearchQuery(query);
    const filtered = notes.filter((note: any) =>
      note.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredNotes(filtered);
  };

  const deleteNote = async (noteId: number) => {
    try {
      const res = await fetch(`/api/delete-note/${noteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setNotes(notes.filter((note: any) => note.id !== noteId));
        setFilteredNotes(
          filteredNotes.filter((note: any) => note.id !== noteId)
        );
      } else {
        console.error("Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decoded: any = jwt_decode(token);
        setUser(decoded);
        fetchNotes(decoded.id);
      } catch (err) {
        console.error("Invalid token:", err);
        setError("Token is invalid or expired.");
        router.push("/login");
      }
    } else {
      setError("No token found.");
      router.push("/login");
    }
  }, [router]);

  const handleCloseModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-screen">
      <div className="border-t-4 border-white border-solid w-16 h-16 rounded-full animate-spin"></div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="">
      {/* Header */}
      <div className="bg-yellow-600 p-4 mb-4">
        <p className="cursor-pointer" onClick={() => router.push("/pinboard")}>
          Back
        </p>
        <div className=" flex justify-between items-center mb-6">
          <h1 className="text-3xl text-[40px] ml-7 mt-4 text-white">Notes</h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => filterNotes(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 text-black focus:ring-blue-500"
            />
            <button
              onClick={toggleView}
              className="p-2 bg-yellow-400 text-white rounded-md shadow-md hover:bg-yellow-500 transition"
            >
              {isGridView ? "List View" : "Grid View"}
            </button>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div
        className={`${
          isGridView ? "grid grid-cols-4 gap-6" : "flex flex-col gap-4"
        }`}
      >
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note: any) => (
            <div
              key={note.id}
              onClick={() => router.push(`/notes/${note.id}`)}
              className={`relative p-4 border border-yellow-400 rounded-md cursor-pointer shadow-sm hover:shadow-md transition transform hover:scale-105 ${
                !isGridView ? "ml-10 mr-10" : "ml-7 mr-7"
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src="assets/post-it(1).png"
                  alt="Note Icon"
                  className="w-6 h-6"
                />
                <h3 className="font-bold text-lg">{note.title}</h3>
              </div>
              {isGridView ? (
                <p className=" text-gray-300 mt-2 text-sm">
                  {note.content?.slice(0, 50) || "No content..."}
                </p>
              ) : null}

              {/* Delete Buttn */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
                className="absolute top-2 right-2 cursor-pointer p-1 text-white rounded-full hover:bg-red-600 transition"
              >
                <img src="assets/trash.png" alt="Delete" className="w-6 h-6" />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600">
            {loading ? (
              <div className="border-t-4 border-blue-600 border-solid w-16 h-16 rounded-full animate-spin mx-auto"></div>
            ) : (
              "No notes found"
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={toggleShowModal}
        className=" text-[50px] fixed bottom-10 right-10 bg-yellow-400 text-white w-20 rounded-full shadow-lg hover:bg-yellow-500 transition"
      >
        +
      </button>

      <Modal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        noteTitle={noteTitle}
        setNoteTitle={setNoteTitle}
        createNote={createNote}
      />
    </div>
  );
}
