"use client";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/navigation";
import Modal from "./modal";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
// THIS APP IS NO LONGER IN USE. IT IS BEING KEPT IN CASE IT IS NEEDED IN THE FUTURE.
// THIS APP IS NO LONGER IN USE. IT IS BEING KEPT IN CASE IT IS NEEDED IN THE FUTURE.
// THIS APP IS NO LONGER IN USE. IT IS BEING KEPT IN CASE IT IS NEEDED IN THE FUTURE.
// THIS APP IS NO LONGER IN USE. IT IS BEING KEPT IN CASE IT IS NEEDED IN THE FUTURE.
// THIS APP IS NO LONGER IN USE. IT IS BEING KEPT IN CASE IT IS NEEDED IN THE FUTURE.
// THIS APP IS NO LONGER IN USE. IT IS BEING KEPT IN CASE IT IS NEEDED IN THE FUTURE.
// THIS APP IS NO LONGER IN USE. IT IS BEING KEPT IN CASE IT IS NEEDED IN THE FUTURE.
// THIS APP IS NO LONGER IN USE. IT IS BEING KEPT IN CASE IT IS NEEDED IN THE FUTURE.
// THIS APP IS NO LONGER IN USE. IT IS BEING KEPT IN CASE IT IS NEEDED IN THE FUTURE.
// THIS APP IS NO LONGER IN USE. IT IS BEING KEPT IN CASE IT IS NEEDED IN THE FUTURE.
// THIS APP IS NO LONGER IN USE. IT IS BEING KEPT IN CASE IT IS NEEDED IN THE FUTURE.
// THIS APP IS NO LONGER IN USE. IT IS BEING KEPT IN CASE IT IS NEEDED IN THE FUTURE.
// THIS APP IS NO LONGER IN USE. IT IS BEING KEPT IN CASE IT IS NEEDED IN THE FUTURE.
// THIS APP IS NO LONGER IN USE. IT IS BEING KEPT IN CASE IT IS NEEDED IN THE FUTURE.
// THIS APP IS NO LONGER IN USE. IT IS BEING KEPT IN CASE IT IS NEEDED IN THE FUTURE.
// THIS APP IS NO LONGER IN USE. IT IS BEING KEPT IN CASE IT IS NEEDED IN THE FUTURE.
// THIS APP IS NO LONGER IN USE. IT IS BEING KEPT IN CASE IT IS NEEDED IN THE FUTURE.
// THIS APP IS NO LONGER IN USE. IT IS BEING KEPT IN CASE IT IS NEEDED IN THE FUTURE.
// THIS APP IS NO LONGER IN USE. IT IS BEING KEPT IN CASE IT IS NEEDED IN THE FUTURE.
// THIS APP IS NO LONGER IN USE. IT IS BEING KEPT IN CASE IT IS NEEDED IN THE FUTURE.
// THIS APP IS NO LONGER IN USE. IT IS BEING KEPT IN CASE IT IS NEEDED IN THE FUTURE.
// THIS APP IS NO LONGER IN USE. IT IS BEING KEPT IN CASE IT IS NEEDED IN THE FUTURE.
// THIS APP IS NO LONGER IN USE. IT IS BEING KEPT IN CASE IT IS NEEDED IN THE FUTURE.
// THIS APP IS NO LONGER IN USE. IT IS BEING KEPT IN CASE IT IS NEEDED IN THE FUTURE.
// THIS APP IS NO LONGER IN USE. IT IS BEING KEPT IN CASE IT IS NEEDED IN THE FUTURE.

export default function Tables() {
  const [user, setUser] = useState<any>(null);
  const [tables, setTables] = useState<any[]>([]);
  const [filteredTables, setFilteredTables] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [tableTitle, setTableTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isGridView, setIsGridView] = useState(true);
  const [noTablesTimeout, setNoTablesTimeout] = useState(false);

  const router = useRouter();

  const toggleShowModal = () => {
    setTableTitle("");
    setShowModal(!showModal);
  };

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  const fetchTables = async (userId: number) => {
    try {
      const res = await fetch("/api/get-tables", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          userId: userId.toString(),
        },
      });

      if (res.ok) {
        const data = await res.json();
        setTables(data.tables);
        setFilteredTables(data.tables);
        setLoading(false);
        setNoTablesTimeout(false);
      } else {
        console.error("Failed to fetch tables");
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  const createTable = async () => {
    if (!tableTitle.trim()) {
      return;
    }

    try {
      const res = await fetch("/api/create-table", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: tableTitle,
          userId: user?.id,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setTableTitle("");

        await fetchTables(user?.id);
      } else {
        toast.error("Failed to create table");
        const data = await res.json();
        console.error("Failed to create table:" + data.error);
      }
    } catch (error) {
      console.error("Error creating table:", error);
      toast.error(
        "An unexpected error occurred. Try again. If this continues, contact admin@manifo.uk"
      );
    }
  };

  const filterTables = (query: string) => {
    setSearchQuery(query);
    const filtered = tables.filter((table: any) =>
      table.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTables(filtered);
  };

  const deleteTable = async (tableId: number) => {
    try {
      const res = await fetch(`/api/delete-table/${tableId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTables(tables.filter((table: any) => table.id !== tableId));
        setFilteredTables(
          filteredTables.filter((table: any) => table.id !== tableId)
        );
      } else {
        console.error("Failed to delete table");
      }
    } catch (error) {
      console.error("Error deleting table:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
          fetchTables(data.user.id);
        } else {
          setError("Failed to get user.");
        }
      } catch (e) {
        setError("Error getting user: " + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleCloseModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-screen">
      <div className="border-t-4 border-blue-400 border-solid w-16 h-16 rounded-full animate-spin"></div>
    </div>
  );

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
            Tables{" "}
            <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
              Manager
            </span>
          </h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => filterTables(e.target.value)}
              className="border border-gray-700 rounded-md px-4 py-2 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <motion.button
              onClick={toggleView}
              className="p-2 bg-gradient-to-r from-blue-400 to-blue-200 text-gray-900 rounded-md shadow-md hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-300 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isGridView ? "List View" : "Grid View"}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Tables */}
      <main className="pt-28">
        <div className="container mx-auto px-6 py-12">
          <div
            className={`${isGridView ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6" : "flex flex-col gap-6"}`}
          >
            {filteredTables.length > 0 ? (
              filteredTables.map((table: any) => (
                <motion.div
                  key={table.id}
                  onClick={() => router.push(`/tables/${table.id}`)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-6 rounded-xl shadow-lg cursor-pointer transition-all duration-300 bg-gradient-to-br from-gray-800/50 via-gray-700/50 to-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 border-2 border-blue-400`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="assets/cells.png"
                      alt="Table Icon"
                      className="w-8 h-8"
                    />
                    <h3 className="font-bold text-lg">{table.title}</h3>
                  </div>
                  {isGridView ? (
                    <p className="text-gray-300 mt-2 text-sm">
                      {table.content?.slice(0, 50) || "No content..."}
                    </p>
                  ) : null}

                  {/* Delete Button */}
                  <motion.div
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTable(table.id);
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
                  <div className="border-t-4 border-blue-400 border-solid w-16 h-16 rounded-full animate-spin mx-auto"></div>
                ) : (
                  "No tables found"
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <motion.button
        onClick={toggleShowModal}
        className="fixed bottom-10 right-10 bg-gradient-to-r from-blue-400 to-blue-200 text-gray-900 w-16 h-16 rounded-full shadow-lg hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-300 transition text-4xl flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        +
      </motion.button>

      <Modal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        tableTitle={tableTitle}
        setTableTitle={setTableTitle}
        createTable={createTable}
      />
    </div>
  );
}
