"use client";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/navigation";
import Modal from "./modal";
import { toast } from "react-toastify";

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
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decoded: any = jwt_decode(token);
        setUser(decoded);
        fetchTables(decoded.id);

        const timeout = setTimeout(() => {
          if (tables.length === 0) {
            setNoTablesTimeout(true);
            setLoading(false);
          }
        }, 5000);

        return () => clearTimeout(timeout);
      } catch (err) {
        console.error("Invalid token:", err);
        setError("Token is invalid or expired.");
        router.push("/login");
      }
    } else {
      setError("No token found.");
      router.push("/login");
    }
  }, [router, tables]);

  const handleCloseModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  return (
    <div className="text-white">
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
        {loading ? (
          <div className=" absolute flex justify-center items-center w-full h-[60%]">
            <div className="border-t-4 border-white border-solid w-16 h-16 rounded-full animate-spin"></div>
          </div>
        ) : noTablesTimeout ? (
          <div className="text-center text-gray-600">No tables found</div>
        ) : (
          filteredTables.length > 0 &&
          filteredTables.map((table: any) => (
            <div
              key={table.id}
              onClick={() => router.push(`/tables/${table.id}`)}
              className={`relative p-4 border border-cyan-800 rounded-md cursor-pointer shadow-sm hover:shadow-md transition transform hover:scale-[102%] ${
                !isGridView ? "ml-20 mr-20" : "ml-10 mr-10"
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

              {/* Delete Button */}
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
