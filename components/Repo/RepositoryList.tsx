import { Virtuoso } from "react-virtuoso";
import { useRepoStore } from "@/store/useRepo";
import React, { useEffect, memo, useMemo } from "react";
import { Repository } from "./interface";
import { message } from "antd";

// 格式化更新时间
const formatUpdateTime = (dateString: string) => {
  const now = new Date();
  const updateDate = new Date(dateString);
  const diffTime = now.getTime() - updateDate.getTime();
  const diffSeconds = Math.floor(diffTime / 1000);

  if (diffSeconds < 60) {
    return `Updated ${diffSeconds} seconds ago`;
  }

  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  if (diffMinutes < 60) {
    return `Updated ${diffMinutes} ${
      diffMinutes === 1 ? "minute" : "minutes"
    } ago`;
  }

  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  if (diffHours < 24) {
    return `Updated ${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  }

  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 7) {
    return `Updated ${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[updateDate.getMonth()];
  const day = updateDate.getDate();

  if (updateDate.getFullYear() === now.getFullYear()) {
    return `Updated on ${month} ${day}`;
  }

  return `Updated on ${month} ${day}, ${updateDate.getFullYear()}`;
};

// 添加语言颜色映射
const languageColors: { [key: string]: string } = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  PHP: "#4F5D95",
  Ruby: "#701516",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Swift: "#ffac45",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Shell: "#89e051",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Vue: "#41b883",
  Scala: "#c22d40",
  Lua: "#000080",
  Perl: "#0298c3",
  Haskell: "#5e5086",
  R: "#198CE7",
  Elixir: "#6e4a7e",
  Clojure: "#db5855",
  Erlang: "#B83998",
  Julia: "#a270ba",
  Groovy: "#e69f56",
  MATLAB: "#e16737",
  Assembly: "#6E4C13",
};

// 使用 memo 优化列表项渲染
const RepositoryItem = memo(({ repo }: { repo: Repository }) => {
  if (!repo) return null;

  return (
    <div className="border-b py-6 hover:bg-gray-50">
      <div className="flex items-start justify-between">
        <div className="w-[78%]">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold">
              <a
                href={repo.html_url}
                className="text-blue-600 hover:underline"
                target="_blank"
              >
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
          {repo.description && (
            <p className="text-gray-600 mt-2 text-sm leading-relaxed line-clamp-2">
              {repo.description}
            </p>
          )}

          <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
            {repo.language && (
              <div className="flex items-center gap-1">
                <span className="relative flex w-3 h-3">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:
                        languageColors[repo.language] || "#8e8e8e",
                    }}
                  ></span>
                </span>
                {repo.language}
              </div>
            )}
            <a href="#" className="flex items-center gap-1 hover:text-blue-600">
              <svg
                className="w-4 h-4"
                aria-label="star"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeWidth="1"
                  d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"
                />
              </svg>
              {repo.stargazers_count}
            </a>
            <a href="#" className="flex items-center gap-1 hover:text-blue-600">
              <svg
                className="w-4 h-4"
                aria-label="fork"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
              </svg>
              {repo.forks}
            </a>
            {repo.license && (
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  aria-label="license"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.75.75a.75.75 0 00-1.5 0V2h-.984c-.305 0-.604.08-.869.23l-1.288.737A.25.25 0 013.984 3H1.75a.75.75 0 000 1.5h.428L.066 9.192a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.514 3.514 0 00.686.45A4.492 4.492 0 003 11c.88 0 1.556-.22 2.023-.454a3.515 3.515 0 00.686-.45l.045-.04.016-.015.006-.006.002-.002.001-.002L5.25 9.5l.53.53a.75.75 0 00.154-.838L3.822 4.5h.162c.305 0 .604-.08.869-.23l1.289-.737a.25.25 0 01.124-.033h.984V13h-2.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-2.5V3.5h.984a.25.25 0 01.124.033l1.29.736c.264.152.563.231.868.231h.162l-2.112 4.692a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.517 3.517 0 00.686.45A4.492 4.492 0 0013 11c.88 0 1.556-.22 2.023-.454a3.512 3.512 0 00.686-.45l.045-.04.01-.01.006-.005.006-.006.002-.002.001-.002-.529-.531.53.53a.75.75 0 00.154-.838L13.823 4.5h.427a.75.75 0 000-1.5h-2.234a.25.25 0 01-.124-.033l-1.29-.736A1.75 1.75 0 009.735 2H8.75V.75zM1.695 9.227c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327l-1.305 2.9zm10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327l-1.305 2.9z"
                  />
                </svg>
                {repo.license.name}
              </span>
            )}
            <span className="text-gray-500">
              {formatUpdateTime(repo.updated_at)}
            </span>
          </div>
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

const RepositoryList: React.FC<{ searchTerm: string; githubName: string }> = ({
  searchTerm,
  githubName,
}) => {
  const { repositories, addRepository } = useRepoStore();

  const filteredRepositories = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return repositories.filter((repo) =>
      repo.name.toLowerCase().includes(searchLower)
    );
  }, [repositories, searchTerm]);

  const fetchAllRepos = async (githubName: string) => {
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
      fetchAllRepos(githubName);
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
              onClick={() => fetchAllRepos(githubName)}
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
