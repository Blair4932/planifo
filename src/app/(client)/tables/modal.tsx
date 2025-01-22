import React from "react";

interface ModalProps {
  showModal: boolean;
  handleCloseModal: (e: React.MouseEvent<HTMLDivElement>) => void;
  tableTitle: string;
  setTableTitle: React.Dispatch<React.SetStateAction<string>>;
  createTable: () => void;
}

const Modal: React.FC<ModalProps> = ({
  showModal,
  handleCloseModal,
  tableTitle,
  setTableTitle,
  createTable,
}) => {
  return (
    <>
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl mb-4 text-center text-black">New Table</h2>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block font-medium mb-2 text-black"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={tableTitle}
                onChange={(e) => setTableTitle(e.target.value)}
                placeholder="Enter table title"
                className="w-full border text-black border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={createTable}
              className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-900 transition"
            >
              Create Table
            </button>

            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
