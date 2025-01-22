"use client";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/navigation";
import Modal from "./modal";

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
        const data = await res.json();
        alert(data.error || "Failed to create table.");
      }
    } catch (error) {
      console.error("Error creating table:", error);
      alert("An unexpected error occurred.");
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
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decoded: any = jwt_decode(token);
        setUser(decoded);
        fetchTables(decoded.id);
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

  const handleCloseModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="border-t-4 border-blue-600 border-solid w-16 h-16 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="bg-cyan-600 p-4 mb-4">
        <p className="cursor-pointer" onClick={() => router.push("/pinboard")}>
          Back
        </p>
        <div className=" flex justify-between items-center mb-6">
          <h1 className="text-3xl text-[40px] ml-7 mt-4 text-white">Tables</h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => filterTables(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 text-black focus:ring-blue-500"
            />
            <button
              onClick={toggleView}
              className="p-2 bg-blue-800 text-white rounded-md shadow-md hover:bg-blue-900 transition"
            >
              {isGridView ? "List View" : "Grid View"}
            </button>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div
        className={`${
          isGridView ? "grid grid-cols-4 gap-6" : "flex flex-col gap-4"
        }`}
      >
        {filteredTables.length > 0 ? (
          filteredTables.map((table: any) => (
            <div
              key={table.id}
              onClick={() => router.push(`/tables/${table.id}`)}
              className={`relative p-4 border border-cyan-800 rounded-md cursor-pointer shadow-sm hover:shadow-md transition transform hover:scale-105 ${
                !isGridView ? "ml-10 mr-10" : "ml-7 mr-7"
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src="assets/cells.png"
                  alt="Table Icon"
                  className="w-6 h-6"
                />
                <h3 className="font-bold text-lg">{table.title}</h3>
              </div>
              {isGridView ? (
                <p className=" mt-2 text-sm">
                  {table.createdAt?.slice(0, 50) || "..."}
                </p>
              ) : null}

              {/* Delete Buttn */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTable(table.id);
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
              "No tables found"
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={toggleShowModal}
        className=" text-[50px] fixed bottom-10 right-10 bg-blue-800 text-white w-20 rounded-full shadow-lg hover:bg-blue-900 transition"
      >
        +
      </button>

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
