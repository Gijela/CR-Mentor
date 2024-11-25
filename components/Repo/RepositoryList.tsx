import { useRepoStore } from "@/store/useRepo";
import React, { useEffect } from "react";
import { Repository } from "./interface";
import { message } from "antd";

const RepositoryList: React.FC = () => {
  const { repositories, addRepository } = useRepoStore();

  const fetchAllRepos = async (githubName: string = "Gijela") => {
    const reposResponse = await fetch(`/api/github/getRepos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ githubName }),
    });
    const {
      success,
      data,
      msg,
    }: { success: boolean; data: Repository[]; msg: string } =
      await reposResponse.json();

    if (!success) {
      message.error(msg);
      return;
    }

    addRepository(data);
  };

  useEffect(() => {
    fetchAllRepos();
  }, []);

  useEffect(() => {
    console.log("🚀 39gh14hg~ repositories:", repositories);
  }, [repositories]);

  return (
    <div className="space-y-6">
      {repositories.length > 0 ? (
        repositories.map((repo) => (
          <div key={repo.name} className="border-b pb-6">
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Setting</span>
                </button>
                <a
                  href={`/${repo.name}/pulls`}
                  className="border rounded-lg px-4 py-1.5 flex items-center gap-2 text-sm bg-white hover:bg-[rgba(99,0,255,0.87)] hover:text-white hover:border-[rgba(99,0,255,0.87)]"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354Z" />
                  </svg>
                  <span>PRs</span>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              {repo.language && (
                <span className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      repo.language === "TypeScript"
                        ? "bg-blue-400"
                        : repo.language === "JavaScript"
                        ? "bg-yellow-400"
                        : repo.language === "Vue"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  ></span>
                  {repo.language}
                </span>
              )}
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 relative top-[0.5px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
                <span className="leading-none relative top-[0.5px]">
                  {repo.stargazers_count}
                </span>
              </span>
              {repo.license && (
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.75.75a.75.75 0 00-1.5 0V2h-.984c-.305 0-.604.08-.869.23l-1.288.737A.25.25 0 013.984 3H1.75a.75.75 0 000 1.5h.428L.066 9.192a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.514 3.514 0 00.686.45A4.492 4.492 0 003 11c.88 0 1.556-.22 2.023-.454a3.515 3.515 0 00.686-.45l.045-.04.016-.015.006-.006.002-.002.001-.002L5.25 9.5l.53.53a.75.75 0 00.154-.838L3.822 4.5h.162c.305 0 .604-.08.869-.23l1.289-.737a.25.25 0 01.124-.033h.984V13h-2.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-2.5V3.5h.984a.25.25 0 01.124.033l1.29.736c.264.152.563.231.868.231h.162l-2.112 4.692a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.517 3.517 0 00.686.45A4.492 4.492 0 0013 11c.88 0 1.556-.22 2.023-.454a3.512 3.512 0 00.686-.45l.045-.04.01-.01.006-.005.006-.006.002-.002.001-.002-.529-.531.53.53a.75.75 0 00.154-.838L13.823 4.5h.427a.75.75 0 000-1.5h-2.234a.25.25 0 01-.124-.033l-1.29-.736A1.75 1.75 0 009.735 2H8.75V.75zM1.695 9.227c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327l-1.305 2.9zm10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327l-1.305 2.9z"
                    />
                  </svg>
                  {repo.license.name}
                </span>
              )}
              {repo.forks_count && (
                <a
                  href={`/${repo.name}/pulls`}
                  className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z" />
                  </svg>
                  <span>{repo.forks_count}</span>
                </a>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-16">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
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
