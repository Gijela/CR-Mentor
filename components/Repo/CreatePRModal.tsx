import React, { useState } from "react";
import SearchableSelect from "./SearchableSelect";

interface CreatePRModalProps {
  // show: boolean;
  closeModal: () => void;
}

// Add option data
const branchOptions = [
  { value: "feature/new-feature", label: "feature/new-feature" },
  { value: "develop", label: "develop" },
  { value: "main", label: "main" },
  // ... more branch options
];

const guidelineOptions = [
  { value: "angular", label: "Angular Commit Convention" },
  { value: "conventional", label: "Conventional Commits" },
  // ... more guideline options
];

const CreatePRModal: React.FC<CreatePRModalProps> = ({ closeModal }) => {
  const [sourceBranch, setSourceBranch] = useState(null);
  const [targetBranch, setTargetBranch] = useState(null);
  const [guideline, setGuideline] = useState(null);

  const [currentOpenSelect, setCurrentOpenSelect] = useState(null); // Track currently open search box

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[600px] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create Pull Request</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source Branch
            </label>
            <SearchableSelect
              options={branchOptions}
              value={sourceBranch}
              onChange={setSourceBranch}
              placeholder="Search source branch..."
              onFocus={() => setCurrentOpenSelect("source")}
              isActive={currentOpenSelect === "source"}
              onClickOutside={() => setCurrentOpenSelect(null)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Branch
            </label>
            <SearchableSelect
              options={branchOptions}
              value={targetBranch}
              onChange={setTargetBranch}
              placeholder="Search target branch..."
              onFocus={() => setCurrentOpenSelect("target")}
              isActive={currentOpenSelect === "target"}
              onClickOutside={() => setCurrentOpenSelect(null)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Guidelines
            </label>
            <SearchableSelect
              options={guidelineOptions}
              value={guideline}
              onChange={setGuideline}
              placeholder="Search guidelines..."
              onFocus={() => setCurrentOpenSelect("guideline")}
              isActive={currentOpenSelect === "guideline"}
              onClickOutside={() => setCurrentOpenSelect(null)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PR Title
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-2"
              placeholder="Enter PR title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PR Description
            </label>
            <textarea
              className="w-full border rounded-lg p-2 h-24"
              placeholder="Enter PR description"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[rgba(99,0,255,0.87)] text-white rounded-lg hover:bg-[rgba(99,0,255,0.95)]"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePRModal;
