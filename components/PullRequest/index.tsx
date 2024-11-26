import React, { useEffect, useState, useMemo } from "react";
import { Typography, Avatar, Input, Select, message } from "antd";
import {
  MessageOutlined,
  // HeartOutlined,
  LinkOutlined,
  PullRequestOutlined,
} from "@ant-design/icons";
import { useSearchParams } from "next/navigation";
import { TotalPRsResponse } from "@/app/api/github/getTotalPRs/route";
import { PullRequestItem } from "./interface";

const { Link } = Typography;
const { Search } = Input;

const githubName = "Gijela";

// /* PullRequestItem 真正用到的属性 */
// interface PullRequestItem {
//   id: number;
//   number: number;
//   title: string;
//   html_url: string;
//   state: string;
//   created_at: string;
//   user: {
//     login: string;
//     avatar_url: string;
//   };
//   repositoryName: string;
//   comments: number;
// }

function PullRequest() {
  const searchParams = useSearchParams();
  const defaultSelectedRepo = searchParams.get("repository");

  const [prs, setPrs] = useState<PullRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRepo, setSelectedRepo] = useState<string>(
    defaultSelectedRepo || ""
  );
  const [titleSearch, setTitleSearch] = useState<string>("");
  const [selectedStates, setSelectedStates] = useState<Set<string>>(new Set());

  // 获取所有不重复的仓库列表
  const repositories = useMemo(() => {
    const repoSet = new Set(prs.map((pr) => pr.repositoryName).filter(Boolean));
    return Array.from(repoSet).map((repo) => ({
      label: repo,
      value: repo,
    }));
  }, [prs]);

  // 更新过滤逻辑
  const filteredPrs = useMemo(() => {
    return prs.filter((pr) => {
      const matchRepo = !selectedRepo || pr.repositoryName === selectedRepo;
      const matchTitle =
        !titleSearch ||
        pr.title.toLowerCase().includes(titleSearch.toLowerCase());
      const matchState =
        selectedStates.size === 0 || selectedStates.has(pr.state);
      return matchRepo && matchTitle && matchState;
    });
  }, [prs, selectedRepo, titleSearch, selectedStates]);

  const fetchPRs = async (githubName: string) => {
    try {
      const totalPRsData = await fetch(`/api/github/getTotalPRs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ githubName }),
      });
      const { success, data, msg, error }: TotalPRsResponse =
        await totalPRsData.json();

      if (!success) {
        console.error("get total PRs failed", error);
        message.error(msg);
        return;
      }

      if (data.incomplete_results) {
        message.warning(
          `Due to GitHub API limitations, only partial PRs(${data.total_count}) were returned.`
        );
      }

      const allPRData = (data.items || []).map((item) => ({
        ...item,
        repositoryName: item.repository_url?.split("/")?.pop() || "",
      }));

      // 如果是单仓库模式，过滤出该仓库的 PRs
      const filteredData = selectedRepo
        ? allPRData.filter((pr) => pr.repositoryName === selectedRepo)
        : allPRData;

      // 按时间排序，最新的在前
      const sortedData = filteredData.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setPrs(sortedData);
    } catch (error) {
      console.error("获取PR失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPRs(githubName);
  }, [selectedRepo]);

  // 添加一个格式化时间的函数
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - past.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  // 处理状态切换
  const toggleState = (state: string) => {
    setSelectedStates((prev) => {
      const newStates = new Set(prev);
      if (newStates.has(state)) {
        newStates.delete(state);
      } else {
        newStates.add(state);
      }
      return newStates;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-gray-900">Pull Requests</h1>
          <span className="text-gray-500 text-lg">
            {selectedRepo ? (
              <>
                from <span className="text-blue-600">{selectedRepo}</span>
              </>
            ) : (
              "from all Repositories"
            )}
          </span>
        </div>
        <button
          onClick={() => {
            const url = new URL(window.location.href);
            if (selectedRepo) {
              url.searchParams.set("repository", selectedRepo);
              url.hash = "repositories";
              window.location.href = url.toString();
            } else {
              url.hash = "repositories";
              window.location.href = url.toString();
            }
          }}
          className="px-4 py-2 bg-[rgba(99,0,255,0.87)] text-white rounded-lg hover:bg-[rgba(99,0,255,0.95)]"
        >
          New PR
        </button>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Select
              className="w-[280px]"
              placeholder="Select a repository"
              allowClear
              showSearch
              size="large"
              options={repositories}
              value={selectedRepo}
              onChange={setSelectedRepo}
              filterOption={(input, option) =>
                (option?.label as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />

            <Search
              className="flex-1"
              placeholder="Search PR title..."
              allowClear
              size="large"
              onChange={(e) => setTitleSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => toggleState("open")}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                selectedStates.has("open")
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
              }`}
            >
              open {prs.filter((pr) => pr.state === "open").length}
            </button>
            <button
              onClick={() => toggleState("closed")}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                selectedStates.has("closed")
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
              }`}
            >
              closed {prs.filter((pr) => pr.state === "closed").length}
            </button>
            {/* <button
              onClick={() => toggleState("merged")}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                selectedStates.has("merged")
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
              }`}
            >
              已合并 ({prs.filter((pr) => pr.state === "merged").length})
            </button> */}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredPrs.map((pr) => (
          <div
            key={pr.id}
            className="bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="text-gray-400 pt-1">
                <PullRequestOutlined
                  style={{
                    fontSize: "20px",
                    color: pr.state === "open" ? "#238636" : "#8250df",
                  }}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  {!selectedRepo && (
                    <span className="text-sm text-gray-500">
                      {pr.repositoryName} /
                    </span>
                  )}
                  <Link
                    href={pr.html_url}
                    target="_blank"
                    className="text-lg font-medium text-gray-900 hover:text-blue-600"
                  >
                    {pr.title}
                  </Link>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs ${
                      pr.state === "open"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {pr.state}
                  </span>
                </div>

                <div className="text-sm text-gray-500">
                  #{pr.number} opened {formatTimeAgo(pr.created_at)} by{" "}
                  <span className="text-gray-700 hover:text-blue-600 cursor-pointer">
                    {pr.user.login}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-gray-400">
                {/* <button className="flex items-center gap-1 hover:text-gray-900">
                  <HeartOutlined />
                  <span>{pr.reactions.heart}</span>
                </button> */}
                {/* 指派者 */}
                {pr.assignees?.length > 0 && (
                  <div className="flex items-center -space-x-2">
                    {(pr.assignees || []).map((assignee) => (
                      <Avatar
                        key={assignee.id}
                        src={assignee.avatar_url}
                        alt={assignee.login}
                        size={24}
                        className="border-2 border-white rounded-full"
                      />
                    ))}
                  </div>
                )}

                <button
                  onClick={() => {
                    window.open(pr.html_url, "_blank");
                  }}
                  className="flex items-center gap-1 hover:text-gray-900"
                >
                  <MessageOutlined />
                  <span>{pr.comments}</span>
                </button>
                <button className="hover:text-gray-900">
                  <LinkOutlined
                    onClick={() => {
                      window.open(pr.html_url, "_blank");
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}

        {!loading && prs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border">
            <h3 className="text-lg font-medium text-gray-900">
              暂无 Pull Requests
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              当前还没有任何 PR，点击右上角按钮创建新的 PR。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PullRequest;
