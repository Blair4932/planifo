"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./modal";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { LoadingSpinner } from "../(global-components)/loadingSpinner";

export default function Editor() {
  const [user, setUser] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isGridView, setIsGridView] = useState(true);
  const sanitize = (html: string) => html.replace(/<[^>]*>/g, "");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
          fetchNotes(data.user.id);
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
  }, []);

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
        toast.error("Failed to fetch notes");
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
        toast.error("Failed to create note");
      }
    } catch (error) {
      toast.error(
        "An unexpected error occurred. Try again. If this continues, contact admin@manifo.uk"
      );
      console.error("Error creating note:", error);
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

  const handleCloseModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900/70 via-gray-800/70 to-gray-900/70 backdrop-blur-md shadow-lg fixed w-full z-50">
        <div className="container mx-auto flex justify-between items-center h-28 px-6">
          <h1
            className="text-4xl font-extralight cursor-pointer"
            onClick={() => router.push("/pinboard")}
          >
            Editor{" "}
          </h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => filterNotes(e.target.value)}
              className="border border-gray-700 rounded-md px-4 py-2 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
            <motion.button
              onClick={toggleView}
              className="p-2 bg-gradient-to-r from-yellow-400 to-yellow-200 text-gray-900 rounded-md shadow-md hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-300 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isGridView ? "List View" : "Grid View"}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Editor */}
      <main className="pt-28">
        <div className="container mx-auto px-6 py-12">
          <div
            className={`${isGridView ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6" : "flex flex-col gap-6"}`}
          >
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note: any) => (
                <motion.div
                  key={note.id}
                  onClick={() => router.push(`/editor/${note.id}`)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-6 rounded-xl shadow-lg cursor-pointer transition-all duration-300 bg-gradient-to-br from-gray-800/50 via-gray-700/50 to-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 border-2 border-yellow-400`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="assets/post-it(1).png"
                      alt="Note Icon"
                      className="w-8 h-8"
                    />
                    <h3 className="font-bold text-lg">{note.title}</h3>
                  </div>
                  {isGridView ? (
                    <p className="text-gray-300 mt-2 text-sm">
                      {sanitize(note.content || "")?.slice(0, 50) ||
                        "No content..."}
                    </p>
                  ) : null}

                  {/* Delete Button */}
                  <motion.div
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-4 right-4 cursor-pointer p-1 text-white rounded-full hover:bg-red-600 transition"
                  >
                    <img
                      src="assets/trash.png"
                      alt="Delete"
                      className="w-6 h-6"
                    />
                  </motion.div>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-gray-400">
                {loading ? (
                  <div className="border-t-4 border-yellow-400 border-solid w-16 h-16 rounded-full animate-spin mx-auto"></div>
                ) : (
                  <LoadingSpinner />
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <motion.button
        onClick={toggleShowModal}
        className="fixed bottom-10 right-10 bg-gradient-to-r from-yellow-400 to-yellow-200 text-gray-900 w-16 h-16 rounded-full shadow-lg hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-300 transition text-4xl flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        +
      </motion.button>

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
