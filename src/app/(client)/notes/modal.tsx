import React from "react";

interface ModalProps {
  showModal: boolean;
  handleCloseModal: (e: any) => void;
  noteTitle: string;
  setNoteTitle: React.Dispatch<React.SetStateAction<string>>;
  createNote: () => void;
}

const Modal: React.FC<ModalProps> = ({
  showModal,
  handleCloseModal,
  noteTitle,
  setNoteTitle,
  createNote,
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
            <h2 className="text-2xl mb-4 text-center text-black">New Note</h2>
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
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Enter note title"
                className="w-full border text-black border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={createNote}
              className="w-full bg-yellow-400 text-white py-2 rounded-md hover:bg-yellow-500 transition"
            >
              Create Note
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
