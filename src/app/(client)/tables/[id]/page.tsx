'use client';
import 'react-toastify/dist/ReactToastify.css';
import * as TableLogic from './tableLogic';
import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { useRouter } from 'next/navigation';

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
    saving,
    addRow,
    deleteTable,
    deleteColumn,
    deleteRow,
    updateCellBackground,
    editedBackgroundColor,
    router,
    setEditedHeader,
    selectedColumn,
    setSelectedColumn,
    resetSelection,
    calculateOverlayVisible,
    setCalculateOverlayVisible,
    handleCalculateButtonClick,
    handleOverlayOptionClick,
    columnCells,
    setColumnCells,
  } = TableLogic.useTableLogic();

  const [recentTables, setRecentTables] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded: any = jwt_decode(token);
        setUser(decoded);
      } catch (err) {
        console.error('Invalid token:', err);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  const fetchRecentTables = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found.');
      }

      const decoded: any = jwt_decode(token);
      const userId = decoded.id;

      if (!userId) {
        throw new Error('userId not found in token.');
      }

      const res = await fetch('/api/get-tables', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          userId: userId.toString(),
        },
      });

      const data = await res.json();
      if (res.ok) {
        const sortedTables = data.tables
          .filter((t: any) => t.id !== table?.id)
          .sort(
            (a: any, b: any) =>
              new Date(b.lastUpdatedAt).getTime() -
              new Date(a.lastUpdatedAt).getTime()
          )
          .slice(0, 5);

        setRecentTables(sortedTables);
      } else {
        console.error('Failed to fetch recent tables:', data.error);
      }
    } catch (error) {
      console.error('Error fetching recent tables:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecentTables();
    }
  }, [user, table?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="border-t-4 border-cyan-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
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
    <div className="flex flex-col lg:flex-row h-screen bg-cyan-50">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 bg-cyan-900 p-6 text-white">
        <h2 className="text-2xl font-bold mb-6">Recently Worked On Tables</h2>
        <div className="space-y-4">
          {recentTables.length > 0 ? (
            recentTables.map((recentTable) => (
              <div
                key={recentTable.id}
                className="p-4 bg-cyan-800 rounded-md cursor-pointer hover:bg-cyan-700 transition-colors"
                onClick={() => router.push(`/tables/${recentTable.id}`)}
              >
                <h3 className="text-lg font-semibold truncate">
                  {recentTable.title || 'Untitled'}
                </h3>
                <p className="text-sm truncate text-cyan-200">
                  {recentTable.description || 'No description available'}
                </p>
              </div>
            ))
          ) : (
            <p className="text-cyan-400">No recent tables found.</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1
            className="text-3xl font-bold text-cyan-900 cursor-pointer"
            onClick={() => router.push('/tables')}
          >
            Tables
          </h1>
          <button
            onClick={() => router.push('/pinboard')}
            className="text-sm text-cyan-600 hover:underline"
          >
            Back to Pinboard
          </button>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md border border-cyan-200">
          <h1 className="text-3xl font-bold mb-4 text-left text-cyan-900">
            {table.title}
          </h1>
          <div className="overflow-auto">
            <table className="table-auto w-full border-collapse border border-cyan-300">
              <thead>
                <tr>
                  {table.columns.map((column: any) => (
                    <th
                      key={column.id}
                      className="border border-cyan-300 p-2 bg-cyan-100"
                    >
                      <input
                        type="text"
                        value={column.header || ''}
                        onClick={() => {
                          resetSelection();
                          setSelectedColumn(column);
                          setColumnCells(column.cells);
                        }}
                        onChange={(e) => setEditedHeader(e.target.value)}
                        className="bg-transparent w-full border-none outline-none text-center"
                        placeholder="Header"
                      />
                    </th>
                  ))}
                  <th>
                    <button
                      className="bg-cyan-500 text-white px-2 py-1 rounded-md"
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
                        className="border border-cyan-300 p-4 cursor-pointer"
                        onClick={() => {
                          resetSelection();
                          setSelectedCell(cell);
                        }}
                        style={{
                          backgroundColor: cell.backgroundColor || '#ffffff',
                          outline:
                            selectedCell?.id === cell.id ||
                            (selectedColumn &&
                              selectedColumn.id === cell.columnId)
                              ? '2px solid #06b6d4'
                              : 'none',
                        }}
                      >
                        <input
                          type="text"
                          value={cell.value || ''}
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
                      className="bg-cyan-500 text-white px-2 py-1 rounded-md w-[100%]"
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
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md border border-cyan-200">
          <h2 className="text-xl font-semibold text-cyan-900 mb-4">
            Table Details
          </h2>
          <ul className="space-y-5 text-cyan-800">
            {selectedCell && (
              <li className="flex items-center">
                <span>Background Color:</span>
                <input
                  type="color"
                  value={editedBackgroundColor}
                  onChange={(e) =>
                    updateCellBackground(selectedCell.id, e.target.value)
                  }
                  className="ml-2"
                />
              </li>
            )}

            <button
              onClick={saveTable}
              className="w-full mt-6 py-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-700 transition"
            >
              {saving ? (
                <div className="w-4 h-4 border-t-4 border-cyan-500 border-solid rounded-full animate-spin mx-auto"></div>
              ) : (
                'Save'
              )}
            </button>

            <button
              onClick={handleCalculateButtonClick}
              className="w-full mt-4 py-2 rounded-md bg-cyan-400 text-white hover:bg-cyan-500 transition"
            >
              Calculate
            </button>

            <button
              onClick={deleteTable}
              className="w-full mt-4 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
            >
              Delete Table
            </button>
          </ul>
        </div>
      </div>
    </div>
  );
}