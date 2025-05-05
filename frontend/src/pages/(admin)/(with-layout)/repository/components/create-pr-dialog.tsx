// import { useUser } from "@clerk/clerk-react"
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GitPullRequestIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { RepositorySearch } from "@/components/repository-search";
import { usePlatform } from "@/hooks/use-platform";

interface DiffInfo {
  githubName?: string;
  projectId?: string;
  compareUrl: string;
  headLabel: string;
  baseLabel: string;
  commentUrl: string;
  reviewCommentsUrl: string;
  repoUrl: string;
  sourceBranch: string;
}

export function CreatePRDialog({ githubName }: { githubName: string }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sourceBranch, setSourceBranch] = useState("");
  const [targetBranch, setTargetBranch] = useState("");
  const [selectedKb, setSelectedKb] = useState("");
  const [selectedRepo, setSelectedRepo] = useState(""); // github 存仓库名, gitlab 存项目 id
  const [branches, setBranches] = useState<{ value: string; label: string }[]>(
    []
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const { isGithub, isGitlab } = usePlatform();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSourceBranch("");
    setTargetBranch("");
    setSelectedKb("");
    setSelectedRepo("");
    setBranches([]);
  };

  const handleCreateGithubPR = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_HOST}/github/createPullRequest`,
        {
          method: "POST",
          body: JSON.stringify({
            githubName,
            repoName: selectedRepo,
            data: {
              title,
              body: description,
              head: sourceBranch,
              base: targetBranch,
              kb_name: selectedKb,
            },
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { success, msg, data } = await response.json();
      if (!success) {
        toast.error(msg);
        console.error(msg);
        return;
      }
      toast.success(msg);

      // 保存必要的 diff 信息
      // const diffInfo: DiffInfo = {
      //   githubName: data?.head?.user?.login,
      //   compareUrl: data?.head?.repo?.compare_url,
      //   baseLabel: data?.base?.label,
      //   headLabel: data?.head?.label,
      //   commentUrl: data?._links?.comments?.href,
      //   reviewCommentsUrl: data?._links?.review_comments?.href,
      //   repoUrl: data?.head?.repo?.html_url,
      //   sourceBranch: data?.head?.ref,
      // };

      const deepwikiParams = {
        compareUrl: data?.head?.repo?.compare_url,
        baseLabel: data?.base?.label,
        headLabel: data?.head?.label,
        repo_name: data?.head?.repo?.full_name,
        pull_number: data?.number,
      }

      fetch(`${import.meta.env.VITE_SERVER_HOST}/deepwiki/getResult`, {
        method: "POST",
        body: JSON.stringify(deepwikiParams),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // handleGetDiffInfo(diffInfo)
      // navigate(`/agents?diffInfo=${JSON.stringify(diffInfo)}`);

      resetForm();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGitlabPR = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_HOST}/gitlab/createMergeRequest`,
        {
          method: "POST",
          body: JSON.stringify({
            projectId: selectedRepo,
            title,
            description,
            source_branch: sourceBranch,
            target_branch: targetBranch,
            // kb_name: selectedKb,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { success, msg, data } = await response.json();
      if (!success) {
        throw new Error(msg);
      }
      toast.success(msg);

      // ToDo 保存必要的 diff 信息，跳转到code review 页面
      // const diffInfo: DiffInfo = {
      //   projectId: data?.project_id,
      //   compareUrl: data?.head?.repo?.compare_url,
      //   baseLabel: data?.target_branch, // 目标分支
      //   headLabel: data?.source_branch, // 源分支
      //   commentUrl: data?._links?.comments?.href,
      //   reviewCommentsUrl: data?._links?.review_comments?.href,
      //   repoUrl: data?.head?.repo?.html_url,
      //   sourceBranch: data?.head?.ref,
      // };

      // navigate(`/agents?diffInfo=${JSON.stringify(diffInfo)}`);

      // resetForm();
      // setOpen(false);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("fail to create mr");
      setLoading(false);
    }
  };

  const handleGithubRepoBranch = async (repoName: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_HOST}/github/fetchRepoBranches`,
      {
        method: "POST",
        body: JSON.stringify({ githubName, repoName }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const { success, data: branches, msg } = await response.json();
    if (!success) {
      toast.error(msg);
      console.error(msg);
      return;
    }
    setBranches(
      branches.map((branch: { name: string }) => ({
        value: branch.name,
        label: branch.name,
      }))
    );
  };

  const handleGitlabRepoBranch = async (projectId: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_HOST}/gitlab/fetchRepoBranches`,
      {
        method: "POST",
        body: JSON.stringify({ projectId }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const { success, data, msg } = await response.json();
    if (!success) {
      toast.error(msg);
      console.error(msg);
      return;
    }
    console.log("🚀 ~ handleGitlabRepoBranch ~ data:", data);
    setBranches(
      data.map((branch: { name: string }) => ({
        value: branch.name,
        label: branch.name,
      }))
    );
  };
  // const handleGetDiffInfo = async (dif fInfo: DiffInfo) => {
  //   const response = await fetch(`${import.meta.env.VITE_SERVER_HOST}/github/getDiffsDetails`, {
  //     method: "POST",
  //     body: JSON.stringify(diffInfo),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //   const { success, data, msg } = await response.json()
  //   if (!success) {
  //     toast.error(msg)
  //     console.error(msg)
  //     return
  //   }

  //   const { files, commits } = data
  //   // eslint-disable-next-line no-console
  //   console.log("🚀 ~ handleGetDiffInfo ~ files:", files, "commits:", commits)
  // }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <GitPullRequestIcon className="mr-2 h-4 w-4" />
          {t("repository.create_pr", "Create PR")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{t("repository.create_pr", "Create PR")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{t("repository.pr.repository", "Select Repository")}</Label>
            <RepositorySearch
              owner={githubName}
              value={selectedRepo}
              onChange={(value) => setSelectedRepo(value)}
              onSelect={(repo) => {
                setSelectedRepo(repo.value);
                isGithub && handleGithubRepoBranch(repo.value);
                if (isGitlab && repo.id) {
                  setSelectedRepo(repo.id.toString());
                  handleGitlabRepoBranch(repo.id.toString());
                }
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("repository.pr.source_branch", "Source Branch")}</Label>
              <Select value={sourceBranch} onValueChange={setSourceBranch}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      "repository.pr.source_branch_placeholder",
                      "Select..."
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.value} value={branch.value}>
                      {branch.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("repository.pr.target_branch", "Target Branch")}</Label>
              <Select value={targetBranch} onValueChange={setTargetBranch}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      "repository.pr.target_branch_placeholder",
                      "Select..."
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.value} value={branch.value}>
                      {branch.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t("repository.pr.knowledge_base", "Knowledge Base")}</Label>
            <Select value={selectedKb} onValueChange={setSelectedKb}>
              <SelectTrigger>
                <SelectValue placeholder="Select knowledge base..." />
              </SelectTrigger>
              <SelectContent>
                {(
                  (user?.publicMetadata?.knowledgeBaseList as string[]) || []
                ).map((kb: string) => (
                  <SelectItem key={kb} value={kb}>
                    {kb}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t("repository.pr.title", "PR Title")}</Label>
            <Input
              placeholder={t(
                "repository.pr.title_placeholder",
                "Enter PR title"
              )}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("repository.pr.description", "PR Description")}</Label>
            <Textarea
              placeholder={t(
                "repository.pr.description_placeholder",
                "Enter PR description"
              )}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant="outline">{t("common.cancel", "Cancel")}</Button>
          </DialogTrigger>
          <Button
            onClick={() => {
              if (isGithub) {
                handleCreateGithubPR();
              } else if (isGitlab) {
                handleCreateGitlabPR();
              } else {
                toast.error("Unsupported platform");
              }
            }}
            disabled={loading}
          >
            {loading
              ? t("common.loading", "Loading...")
              : t("repository.pr.submit", "Submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
