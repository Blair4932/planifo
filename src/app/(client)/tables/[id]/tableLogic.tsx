import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function useTableLogic() {
  const [table, setTable] = useState<any>(null);
  const [cells, setCells] = useState<any>([]);
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedCell, setSelectedCell] = useState<any>(null);
  const [columnCells, setColumnCells] = useState<any>([]);
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

  const resetSelection = () => {
    setSelectedCell(null);
    setSelectedColumn(null);
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
      columns: prevTable.columns.map((column: any) => ({
        ...column,
        cells: column.cells.map((cell: any) =>
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

  return {
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
  };
}
export * from "./tableLogic";
