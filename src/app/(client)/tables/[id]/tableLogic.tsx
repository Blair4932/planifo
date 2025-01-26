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
  const [calculateOverlayVisible, setCalculateOverlayVisible] = useState(false);

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

  /**
   * Fetches details of opened table
   */
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

  /**
   * saves table
   */
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

  /**
   * resets selected cells
   */
  const resetSelection = () => {
    setSelectedCell(null);
    setSelectedColumn(null);
  };

  /**
   * updates the table headers value
   * @param columnId selected column id
   * @param value header value
   */
  const updateHeaderValue = (columnId: number, value: string) => {
    setTable((prevTable: any) => ({
      ...prevTable,
      columns: prevTable.columns.map((column: any) =>
        column.id === columnId ? { ...column, header: value } : column
      ),
    }));
  };

  /**
   * updates the selected cell value
   * @param cellId selected cell id
   * @param value cell value
   */
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

  /**
   * updates cell background colour
   * @param cellId selected cell id
   * @param backgroundColor selected cells background colour
   */
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

  /**
   * calls to delete selected table column
   * @returns
   */
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

  /**
   * calls to delete selected table row
   * @returns
   */
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

  /**
   * calls to delete opened table
   * @param tableId opened table id
   */
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

  /**
   * adds column to opened table
   */
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

  /**
   * adds row to opened table
   */
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

  /**
   * toggles calculate view in detail pane
   */
  const handleCalculateButtonClick = () => {
    setCalculateOverlayVisible(!calculateOverlayVisible);
  };

  /**
   * handles table calculations
   * @param operation + or -
   * @returns
   */
  const handleOverlayOptionClick = (operation: string) => {
    let total = 0;

    for (let cell of columnCells) {
      const numericValue = Number(cell.value);

      if (isNaN(numericValue)) {
        toast.error("Calculations can only be performed on numbers");
        return;
      }

      if (operation === "+") {
        total += numericValue;
      } else if (operation === "-") {
        total -= numericValue;
      }
    }

    addRow();
    const targetColumnId = table.columns[0].id;
    updateNewRowWithCalculatedValue(total, targetColumnId);
    setCalculateOverlayVisible(false);
  };

  /**
   * Updates the newly added row with the calculated total in the relevant column
   * @param total The result of the calculation
   */
  const updateNewRowWithCalculatedValue = (
    total: number,
    targetColumnId: string
  ) => {
    const newRow = table.rows[table.rows.length - 1];

    setTable((prevTable: any) => {
      const updatedRows = prevTable.rows.map((row: any) => {
        if (row.id === newRow.id) {
          const updatedCells = row.cells.map((cell: any) => {
            if (cell.columnId === targetColumnId) {
              return { ...cell, value: total.toString() };
            }
            return cell;
          });
          return { ...row, cells: updatedCells };
        }
        return row;
      });

      return { ...prevTable, rows: updatedRows };
    });
  };

  /**
   * fetches table id
   */
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
  };
}
export * from "./tableLogic";
