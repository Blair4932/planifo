import { useState } from "react";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { InputSwitch } from "primereact/inputswitch";
import "primereact/resources/primereact.css";
import { colourVars } from "../(variables)/colourVars";
import { fetchProjects, createNewProject } from "../(logic)/projectAPI";

const CreateProjectModal = ({ userId, setProjects, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [templateSprint, setTemplateSprint] = useState(true);
  const [autoStart, setAutoStart] = useState(true);
  const [defaultTags, setDefaultTags] = useState(true);

  const handleEmojiSelect = (emojiObject: { emoji: string }) => {
    setIcon(emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const createProject = async () => {
    try {
      const newProject = await createNewProject({
        title,
        description,
        icon,
        templateSprint,
        autoStart,
        defaultTags,
        userId,
      });

      const updatedProjects = await fetchProjects(userId);
      setProjects(updatedProjects);
      onClose();
    } catch (error) {
      console.error("Error in project creation:", error);
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center backdrop-blur-sm"
      onClick={handleOutsideClick}
    >
      <div className="bg-gray-800 rounded-2xl p-8 w-[600px] relative text-gray-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
        >
          ✕
        </button>

        {/* Header Section */}
        <div className="flex gap-6">
          {/* Left Column */}
          <div className="flex-1">
            {/* Icon Picker */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Icon</label>
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-14 h-14 rounded-xl bg-gray-700 border-2 border-dashed border-gray-500 flex items-center justify-center text-2xl hover:border-solid hover:border-blue-500 transition-all"
                style={{ borderColor: colourVars.hubPurple }}
              >
                {icon || "✏️"}
              </button>

              {showEmojiPicker && (
                <div className="absolute z-10 mt-2">
                  <EmojiPicker
                    onEmojiClick={handleEmojiSelect}
                    theme={Theme.DARK}
                    emojiStyle={EmojiStyle.NATIVE}
                    searchDisabled
                    skinTonesDisabled
                    height={350}
                    width={300}
                  />
                </div>
              )}
            </div>

            {/* Project Title Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Project Title
              </label>
              <input
                type="text"
                placeholder="Enter project name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                style={{ borderColor: colourVars.hubPurple }}
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                placeholder="Add project description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg px-4 py-3 h-32 placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                style={{ borderColor: colourVars.hubPurple }}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1">
            {/* Config Section */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-2">
                Configuration
              </label>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-700 rounded-lg px-4 py-3">
                  <span>Template Sprint</span>
                  <InputSwitch
                    checked={templateSprint}
                    onChange={(e) => setTemplateSprint(e.value)}
                  />
                </div>
                <div className="flex items-center justify-between bg-gray-700 rounded-lg px-4 py-3">
                  <span>Default Task Tags</span>
                  <InputSwitch
                    checked={defaultTags}
                    onChange={(e) => setDefaultTags(e.value)}
                  />
                </div>
                <div className="flex items-center justify-between bg-gray-700 rounded-lg px-4 py-3">
                  <span>Automatically Start</span>
                  <InputSwitch
                    checked={autoStart}
                    onChange={(e) => setAutoStart(e.value)}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                className="w-full text-white py-3 rounded-lg transition-colors font-medium"
                style={{ backgroundColor: colourVars.hubPurple }}
                onClick={createProject}
              >
                Start Project
              </button>
              <button
                className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-3 rounded-lg transition-colors font-medium"
                style={{ backgroundColor: colourVars.hubGrey }}
              >
                Advanced Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
