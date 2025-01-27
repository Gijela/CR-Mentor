import React, { useEffect, useState } from "react";
import SearchableSelect from "./SearchableSelect";
import { message } from "antd";
import { CreatePRParams } from "@/app/api/github/createPullRequest/route";

interface CreatePRModalProps {
  closeModal: () => void;
  repoName: string;
  githubName: string;
}

const guidelineOptions = [
  { value: "angular", label: "Angular Commit Convention" },
  { value: "conventional", label: "Conventional Commits" },
  // ... more guideline options
];

export interface Branch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

const CreatePRModal: React.FC<CreatePRModalProps> = ({
  closeModal,
  repoName,
  githubName,
}) => {
  const [sourceBranch, setSourceBranch] = useState(null);
  const [targetBranch, setTargetBranch] = useState(null);
  const [guideline, setGuideline] = useState(null);
  const [prTitle, setPrTitle] = useState("");
  const [prDescription, setPrDescription] = useState("");

  const [currentOpenSelect, setCurrentOpenSelect] = useState(null); // Track currently open search box

  const [branches, setBranches] = useState<{ value: string; label: string }[]>(
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sourceBranch || !targetBranch) {
      alert("Source branch and target branch are required");
      return;
    }

    const formData = {
      sourceBranch: sourceBranch?.value,
      targetBranch: targetBranch?.value,
      guideline: guideline?.value,
      prTitle,
      prDescription,
    };
    console.log("PR Form Data:", formData);

    const response = await fetch(`/api/github/createPullRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        githubName,
        repoName,
        data: {
          title: formData.prTitle,
          body: formData.prDescription,
          head: formData.sourceBranch,
          base: formData.targetBranch,
        } as CreatePRParams,
      }),
    });

    const { success, data, msg }: { success: boolean; data: any; msg: string } =
      await response.json();
    console.log("🚀 ~ handleSubmit ~ RESPONSE:", { success, data, msg });

    if (!success) {
      message.error(msg);
      return;
    } else {
      message.success("create pull request success");
      closeModal();
    }
  };

  const getBranches = async (githubName: string, repoName: string) => {
    const response = await fetch(`/api/github/fetchRepoBranches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ githubName, repoName }),
    });

    const {
      success,
      data,
      msg,
    }: { success: boolean; data: Branch[]; msg: string } =
      await response.json();

    if (!success) {
      message.error(msg);
      return;
    }

    setBranches(
      data.map((branch) => ({ value: branch.name, label: branch.name }))
    );
  };

  useEffect(() => {
    getBranches(githubName, repoName);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[600px] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">[PR] {repoName}</h2>
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

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source Branch<span className="text-red-500 ml-0.5">*</span>
            </label>
            <SearchableSelect
              options={branches}
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
              Target Branch<span className="text-red-500 ml-0.5">*</span>
            </label>
            <SearchableSelect
              options={branches}
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
              value={prTitle}
              onChange={(e) => setPrTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PR Description
            </label>
            <textarea
              className="w-full border rounded-lg p-2 h-24"
              placeholder="Enter PR description"
              value={prDescription}
              onChange={(e) => setPrDescription(e.target.value)}
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
