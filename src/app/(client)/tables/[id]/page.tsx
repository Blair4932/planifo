"use client";
import "react-toastify/dist/ReactToastify.css";
import * as TableLogic from "./tableLogic";
import { DefaultDeserializer } from "v8";

export default function TablePage() {
  const {
    table,
    loading,
    error,
    saveTable,
    updateCellValue,
    addColumn,
    selectedCell,
    setSelectedCell,
    editedValue,
    setEditedValue,
    setEditedBackgroundColor,
    fetchTableDetails,
    saving,
    addRow,
    deleteTable,
    deleteColumn,
    deleteRow,
    updateCellBackground,
    updateHeaderValue,
    user,
    cells,
    editedHeader,
    editedBackgroundColor,
    params,
    router,
    setEditedHeader,
    selectedColumn,
    setSelectedColumn,
    resetSelection,
  } = TableLogic.useTableLogic();
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
                        onClick={() => {
                          resetSelection();
                          setSelectedColumn(column);
                        }}
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
                        className="border border-gray-300 p-4 cursor-pointer"
                        onClick={() => {
                          resetSelection();
                          setSelectedCell(cell);
                        }}
                        style={{
                          backgroundColor: cell.backgroundColor || "#ffffff",
                          outline:
                            selectedCell?.id === cell.id ||
                            (selectedColumn &&
                              selectedColumn.id === cell.columnId)
                              ? "2px solid #3b82f6"
                              : "none",
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
