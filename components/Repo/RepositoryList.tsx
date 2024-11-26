import { Virtuoso } from "react-virtuoso";
import { useRepoStore } from "@/store/useRepo";
import React, { useEffect, memo, useMemo } from "react";
import { Repository } from "./interface";
import { message } from "antd";

// 使用 memo 优化列表项渲染
const RepositoryItem = memo(({ repo }: { repo: Repository }) => {
  if (!repo) return null;

  return (
    <div className="border-b py-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold">
              <a href="#" className="text-blue-600">
                {repo.name}
              </a>
            </h3>
            <span
              className={`text-xs px-2.5 py-1 rounded-full border ${
                repo.private
                  ? "border-yellow-200 text-yellow-800 bg-yellow-50"
                  : "border-gray-200 text-gray-600"
              }`}
            >
              {repo.private ? "Private" : "Public"}
            </span>
          </div>
          <p className="text-gray-600 mt-2 text-sm leading-relaxed">
            {repo.description}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button className="border rounded-lg px-4 py-1.5 flex items-center gap-2 text-sm bg-white hover:bg-[rgba(99,0,255,0.87)] hover:text-white hover:border-[rgba(99,0,255,0.87)]">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
            </svg>
            <span>Setting</span>
          </button>
          <a
            href={`/${repo.name}/pulls`}
            className="border rounded-lg px-4 py-1.5 flex items-center gap-2 text-sm bg-white hover:bg-[rgba(99,0,255,0.87)] hover:text-white hover:border-[rgba(99,0,255,0.87)]"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354Z" />
            </svg>
            <span>PRs</span>
          </a>
        </div>
      </div>
    </div>
  );
});

const RepositoryList: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  const { repositories, addRepository } = useRepoStore();

  const filteredRepositories = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return repositories.filter((repo) =>
      repo.name.toLowerCase().includes(searchLower)
    );
  }, [repositories, searchTerm]);

  const fetchAllRepos = async (githubName: string = "Gijela") => {
    try {
      const reposResponse = await fetch(`/api/github/getRepos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ githubName }),
      });
      const { success, data, msg } = await reposResponse.json();

      if (!success) {
        message.error(msg);
        return;
      }

      addRepository(data);
    } catch (error) {
      message.error("Failed to fetch repositories");
    }
  };

  useEffect(() => {
    if (!repositories.length) {
      fetchAllRepos();
    }
  }, []);

  return (
    <div className="flex-1">
      {filteredRepositories.length ? (
        <Virtuoso
          style={{ height: "100%" }}
          data={filteredRepositories}
          itemContent={(index, repo) => <RepositoryItem repo={repo} />}
          overscan={200}
        />
      ) : (
        <div className="text-center py-16">
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No Repository Data
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            No repositories found. Please check if your GitHub username is
            correct.
          </p>
          <div className="mt-6">
            <button
              onClick={() => fetchAllRepos()}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[rgba(99,0,255,0.87)] hover:bg-[rgba(99,0,255,0.95)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgba(99,0,255,0.87)]"
            >
              <svg
                className="mr-2 -ml-1 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reload
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepositoryList;
