"use client";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useRouter, useParams } from "next/navigation";

export default function TableDetails() {
  const [table, setTable] = useState<any>(null);
  const [cells, setCells] = useState<any>([]);
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCell, setSelectedCell] = useState<any>(null);
  const [selectedColumn, setSelectedColumn] = useState<any>(null);
  const [editedHeader, setEditedHeader] = useState("");
  const [editedValue, setEditedValue] = useState("");
  const [editedBackgroundColor, setEditedBackgroundColor] = useState("");
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

  const fetchTableDetails = async () => {
    try {
      if (params.id) {
        const res = await fetch(`/api/get-tables/${params.id}`, {
          method: "GET",
        });

        if (res.ok) {
          const data = await res.json();
          setTable(data.table);
          const cellsArr = [];
          data.table.rows.forEach((row) => {
            row.cells.forEach((cell) => {
              cellsArr.push(cell);
            });
          });
          setCells(cellsArr);
        } else {
          setError("Failed to fetch table details.");
        }
      }
    } catch (error) {
      console.error("Error fetching table details:", error);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const saveTable = async () => {
    try {
      const res = await fetch(`/api/update-table/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: table.title,
          columns: table.columns,
          rows: table.rows,
        }),
      });

      if (res.ok) {
        console.log("Table updated successfully");
      } else {
        console.error("Failed to save note.");
        setError("Failed to save note");
      }
    } catch (error) {
      console.error("Error saving note:", error);
      alert("An unexpected error occurred.");
    }
  };

  const updateHeaderValue = (columnId: number, value: string) => {
    setTable((prevTable: any) => ({
      ...prevTable,
      columns: prevTable.columns.map((column: any) =>
        column.id === columnId ? { ...column, header: value } : column
      ),
    }));
  };

  const updateCellValue = (cellId: number, value: string) => {
    setCells((prevCells: any[]) =>
      prevCells.map((cell) => (cell.id === cellId ? { ...cell, value } : cell))
    );

    setTable((prevTable: any) => ({
      ...prevTable,
      rows: prevTable.rows.map((row: any) => ({
        ...row,
        cells: row.cells.map((cell: any) =>
          cell.id === cellId ? { ...cell, value } : cell
        ),
      })),
    }));
  };

  const updateCellBackground = (cellId: number, backgroundColor: string) => {
    setTable((prevTable: any) => ({
      ...prevTable,
      rows: prevTable.rows.map((row: any) => ({
        ...row,
        cells: row.cells.map((cell: any) =>
          cell.id === cellId ? { ...cell, backgroundColor } : cell
        ),
      })),
    }));
  };

  const deleteTable = async (tableId: any) => {
    try {
      const res = await fetch(`/api/delete-table/${table.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/tables");
      } else {
        console.error("Failed to delete table");
      }
    } catch (error) {
      console.error("Error deleting table:", error);
    }
  };

  useEffect(() => {
    fetchTableDetails();
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

  if (!table) {
    return <p className="text-center text-red-500">Table not found</p>;
  }

  return (
    <div className="flex gap-16 flex-col lg:flex-row p-4 max-w-full mx-auto pt-24">
      {/* Table View */}
      <div className="ml-8 flex-1 p-4 border border-yellow-400 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-left">{table.title}</h1>
        <div className="overflow-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                {table.columns.map((column: any) => (
                  <th
                    key={column.id}
                    className="border border-gray-300 p-2 bg-gray-100"
                  >
                    <input
                      type="text"
                      value={
                        selectedColumn?.id === column.id
                          ? editedHeader
                          : column.header || ""
                      }
                      onClick={() => {
                        setSelectedColumn(column);
                        setEditedHeader(column.header || "");
                      }}
                      onChange={(e) => setEditedHeader(e.target.value)}
                      onBlur={() => {
                        updateHeaderValue(column.id, editedHeader);
                      }}
                      className="bg-transparent w-full border-none outline-none text-center"
                      placeholder="Header"
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row: any) => (
                <tr key={row.id}>
                  {row.cells.map((cell: any) => (
                    <td
                      key={cell.id}
                      className={`border border-gray-300 p-4 cursor-pointer ${
                        selectedCell?.id === cell.id ? "bg-blue-100" : ""
                      }`}
                      onClick={() => {
                        setSelectedCell(cell);
                        setEditedValue(cell.value || "");
                        setEditedBackgroundColor(
                          cell.backgroundColor || "#ffffff"
                        );
                      }}
                      style={{
                        backgroundColor: cell.backgroundColor || "#ffffff",
                      }}
                    >
                      <input
                        type="text"
                        value={cell.value || ""}
                        onChange={(e) =>
                          updateCellValue(cell.id, e.target.value)
                        }
                        className="bg-transparent w-full border-none outline-none text-center"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Pane */}
      <div className="w-full mr-8 lg:w-64 mt-6 lg:mt-0 lg:ml-6 p-4 border border-yellow-400 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Cell Details</h2>
        {selectedCell ? (
          <ul className="space-y-2 text-gray-700">
            <li>
              <strong>Row:</strong> {selectedCell.rowId}
            </li>
            <li>
              <strong>Column:</strong> {selectedCell.columnId}
            </li>
            <li>
              <strong>Background Color:</strong>
              <input
                type="color"
                value={editedBackgroundColor}
                onChange={(e) =>
                  updateCellBackground(selectedCell.id, e.target.value)
                }
                className="ml-2"
              />
            </li>
            <button
              onClick={saveTable}
              className="w-full mt-6 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Save
            </button>

            <button
              onClick={deleteTable}
              className="w-full mt-4 text-white bg-red-500 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition"
            >
              Delete
            </button>
            <button
              onClick={() => router.push("/tables")}
              className="w-full mt-4 bg-gray-800 text-white py-2 rounded-md hover:bg-gray-950 transition"
            >
              Back to Tables
            </button>
            {error && <p className="text-red-600">{error}</p>}
          </ul>
        ) : (
          <p className="text-gray-600">Select a cell to edit its details.</p>
        )}
      </div>
    </div>
  );
}
