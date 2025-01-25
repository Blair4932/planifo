"use client";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useRouter, useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TableDetails() {
  const [table, setTable] = useState<any>(null);
  const [cells, setCells] = useState<any>([]);
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
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
    setLoading(true);
    try {
      if (params.id) {
        const res = await fetch(`/api/get-tables/${params.id}`, {
          method: "GET",
        });

        if (res.ok) {
          const data = await res.json();
          data.table.columns.sort(
            (a: any, b: any) => a.columnIndex - b.columnIndex
          );
          data.table.rows.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
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
    setSaving(true);
    try {
      const res = await fetch(`/api/update-table/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: table.title,
          columns: table.columns.sort((a, b) => a.columnIndex - b.columnIndex),
          rows: table.rows.sort((a, b) => a.rowIndex - b.rowIndex),
        }),
      });

      if (res.ok) {
        toast.success("Table saved successfully!");
      } else {
        console.error("Failed to save table.");
        setError("Failed to save table");
      }
    } catch (error) {
      console.error("Error saving table:", error);
      toast.error(
        "An unexpected error occurred. Try again. If this continues, contact admin@manifo.uk"
      );
    } finally {
      setSaving(false);
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

  const updateCellValue = (cellId: string, value: string) => {
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

  const updateCellBackground = (cellId: any, backgroundColor: any) => {
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

  const deleteColumn = async () => {
    if (!selectedColumn) return;

    try {
      const res = await fetch(`/api/delete-column/${selectedColumn.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTable((prevTable) => ({
          ...prevTable,
          columns: prevTable.columns.filter(
            (column) => column.id !== selectedColumn.id
          ),
          rows: prevTable.rows.map((row) => ({
            ...row,
            cells: row.cells.filter(
              (cell, index) =>
                index !==
                prevTable.columns.findIndex(
                  (col) => col.id === selectedColumn.id
                )
            ),
          })),
        }));

        setSelectedColumn(null);
      } else {
        console.error("Failed to delete column");
      }
    } catch (error) {
      console.error("Error deleting column:", error);
    }
  };

  const deleteRow = async () => {
    if (!selectedCell) return;

    try {
      const res = await fetch(`/api/delete-row/${selectedCell.rowId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTable((prevTable) => ({
          ...prevTable,
          rows: prevTable.rows.filter((row) =>
            row.cells.every((cell) => cell.id !== selectedCell.id)
          ),
        }));

        setSelectedCell(null);
      } else {
        console.error("Failed to delete row");
      }
    } catch (error) {
      console.error("Error deleting row:", error);
    }
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

  const addColumn = () => {
    const columnId = uuidv4();

    setTable((prevTable) => {
      const newColumnCells = prevTable.rows.map((row) => {
        const cellId = uuidv4();
        return {
          id: cellId,
          value: "",
          backgroundColor: "#ffffff",
          rowId: row.id,
          columnId: columnId,
        };
      });

      const newTable = {
        ...prevTable,
        columns: [
          ...prevTable.columns,
          {
            id: columnId,
            header: "New Column",
            columnIndex: prevTable.columns.length,
            cells: newColumnCells,
          },
        ],
        rows: prevTable.rows.map((row, rowIndex) => ({
          ...row,
          cells: [
            ...row.cells,
            {
              id: newColumnCells[rowIndex].id,
              value: "",
              backgroundColor: "#ffffff",
              rowId: row.id,
              columnId: columnId,
            },
          ],
        })),
      };

      return newTable;
    });
  };

  const addRow = () => {
    const rowId = uuidv4();

    setTable((prevTable) => {
      const newRowCells = prevTable.columns.map((col) => {
        const cellId = uuidv4();
        return {
          id: cellId,
          value: "",
          backgroundColor: "#ffffff",
          rowId: rowId,
          columnId: col.id,
        };
      });

      const newTable = {
        ...prevTable,
        rows: [
          ...prevTable.rows,
          {
            id: rowId,
            rowIndex: prevTable.rows.length,
            cells: newRowCells,
          },
        ],
      };

      return newTable;
    });
  };

  useEffect(() => {
    fetchTableDetails();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="border-t-4 border-white border-solid w-16 h-16 rounded-full animate-spin"></div>
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
    <>
      <div className="bg-cyan-600 p-4 mb-4">
        <p className="cursor-pointer" onClick={() => router.push("/pinboard")}>
          Pinboard
        </p>
        <div className=" flex justify-between items-center mb-3">
          <h1
            className="text-3xl text-[40px] ml-7 mt-4 text-white cursor-pointer"
            onClick={() => router.push("/tables")}
          >
            Tables
          </h1>
        </div>
      </div>
      <div className="flex gap-16 flex-col lg:flex-row p-4 max-w-full mx-auto pt-24">
        {/* Table View */}
        <div className="ml-8 flex-1 p-4 border border-yellow-400 rounded-lg shadow-md">
          <h1 className="text-3xl text-white font-bold mb-4 text-left">
            {table.title}
          </h1>
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
                        value={column.header || ""}
                        onChange={(e) => setEditedHeader(e.target.value)}
                        className="bg-transparent w-full border-none outline-none text-center"
                        placeholder="Header"
                      />
                    </th>
                  ))}
                  <th>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded-md"
                      onClick={addColumn}
                    >
                      + Add Column
                    </button>
                  </th>
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
                <tr>
                  <td>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded-md w-[100%]"
                      onClick={addRow}
                    >
                      + Add Row
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Pane */}
        <div className="w-full mr-8 lg:w-64 mt-6 lg:mt-0 lg:ml-6 p-4 border border-yellow-400 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Cell Details</h2>
          <ul className="space-y-5 text-gray-700 ">
            {/* Background color for selected cell */}
            {selectedCell && (
              <li className="flex items-center text-white">
                <span>Background Color:</span>
                <input
                  type="color"
                  value={editedBackgroundColor}
                  onChange={(e) =>
                    updateCellBackground(selectedCell.id, e.target.value)
                  }
                  className={`ml-2 ${
                    !selectedCell ? "disabled:opacity-50" : ""
                  }`}
                  disabled={!selectedCell}
                />
              </li>
            )}

            {/* Save Table Button (Always enabled) */}
            <button
              onClick={saveTable}
              className="w-full mt-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              {saving ? (
                <div className="w-4 h-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
              ) : (
                "Save"
              )}
            </button>

            {/* Delete Row Button (Enabled if a regular cell is selected) */}
            <button
              disabled={!selectedCell || selectedColumn}
              onClick={deleteRow}
              className={`w-full mt-4 py-2 rounded-md ${
                !selectedCell || selectedColumn
                  ? "bg-gray-300"
                  : "bg-yellow-400 text-white"
              } hover:bg-yellow-400 transition`}
            >
              Delete Row
            </button>

            {/* Delete Column Button (Enabled if a column header is selected) */}
            <button
              disabled={!selectedColumn}
              onClick={deleteColumn}
              className={`w-full mt-4 py-2 rounded-md ${
                !selectedColumn ? "bg-gray-300" : "bg-yellow-400 text-white"
              } hover:bg-yellow-400 transition`}
            >
              Delete Column
            </button>

            {/* Delete Table Button (Always enabled) */}
            <button
              onClick={deleteTable}
              className="w-full mt-4 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
            >
              Delete Table
            </button>
            {/* Error Message */}
            {error && <p className="text-red-600">{error}</p>}
          </ul>
        </div>
      </div>
    </>
  );
}
