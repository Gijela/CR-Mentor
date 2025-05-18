import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "@clerk/clerk-react";
import { format, addDays, subDays } from "date-fns";
import {
  BarChartIcon,
  FilterIcon,
  TrashIcon,
  PlusIcon,
  GithubIcon,
  GitBranchIcon,
  UserIcon,
  ClockIcon,
} from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/loading-spinner";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDateRangePicker } from "@/components/date-range-picker";

type Repository = {
  owner: string;
  repoName: string;
  branchName: string;
};

type TimePreset = {
  label: string;
  range: DateRange;
};

export function AnalyzeRepoDialog({ githubName }: { githubName: string }) {
  const { t } = useTranslation();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Time presets
  const timePresets: TimePreset[] = [
    {
      label: t("repository.time_preset.last_7_days", "Last 7 Days"),
      range: {
        from: subDays(new Date(), 7),
        to: new Date(),
      },
    },
    {
      label: t("repository.time_preset.last_30_days", "Last 30 Days"),
      range: {
        from: subDays(new Date(), 30),
        to: new Date(),
      },
    },
    {
      label: t("repository.time_preset.this_month", "This Month"),
      range: {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(),
      },
    },
    {
      label: t("repository.time_preset.last_month", "Last Month"),
      range: {
        from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        to: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
      },
    },
  ];

  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 7), // 7 days ago
    to: new Date(),
  });
  const [repositories, setRepositories] = useState<Repository[]>([
    {
      owner: githubName || "",
      repoName: "",
      branchName: "main",
    },
  ]);

  // Reset form
  const resetForm = () => {
    setDateRange({
      from: subDays(new Date(), 7),
      to: new Date(),
    });
    setRepositories([
      {
        owner: githubName || "",
        repoName: "",
        branchName: "main",
      },
    ]);
  };

  const handleAddRepo = () => {
    setRepositories([
      ...repositories,
      {
        owner: githubName || "",
        repoName: "",
        branchName: "main",
      },
    ]);
  };

  const handleRemoveRepo = (index: number) => {
    if (repositories.length > 1) {
      setRepositories(repositories.filter((_, i) => i !== index));
    } else {
      toast.error(
        t("repository.min_one_repo", "At least one repository is required")
      );
    }
  };

  const handleRepoChange = (
    index: number,
    field: keyof Repository,
    value: string
  ) => {
    const newRepos = [...repositories];
    newRepos[index] = {
      ...newRepos[index],
      [field]: value,
    } as Repository;
    setRepositories(newRepos);
  };

  const handleTimePresetChange = (preset: TimePreset) => {
    setDateRange(preset.range);
  };

  const handleAnalyze = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error(
        t("repository.error.no_date_range", "Please select a time range")
      );
      return;
    }

    const validRepos = repositories.filter(
      (repo) => repo.repoName.trim() !== ""
    );
    if (validRepos.length === 0) {
      toast.error(
        t(
          "repository.error.no_valid_repo",
          "Please add at least one valid repository"
        )
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_HOST}/deepwiki/getCommitResult`,
        {
          method: "POST",
          body: JSON.stringify({
            repositories: validRepos,
            timeRange: {
              since: dateRange.from.toISOString(),
              until: dateRange.to.toISOString(),
            },
            targetUsername: githubName,
          }),
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        }
      );
      const data = await response.json();

      toast.success(
        t(
          "repository.analyze_success",
          "Repository analysis initiated successfully"
        )
      );
      setOpen(false); // Close dialog
      resetForm(); // Reset form
    } catch (error) {
      console.error("Error analyzing repository:", error);
      toast.error(
        t(
          "repository.error.api_error",
          "Failed to analyze repository, please check API connection"
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
        >
          <BarChartIcon className="mr-2 h-4 w-4" />
          {t("repository.analyze", "Analyze Commits")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {t(
              "repository.analyze_title",
              "Enhance Developer Profile & Knowledge Base"
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4 flex-1">
          {/* Time Range Selection */}
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label className="text-base">
                {t("repository.time_range", "Time Range")}
              </Label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <DateRangePickerWithPresets
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    presets={timePresets}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Repository List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">
                {t("repository.repositories", "Repository List")}
              </Label>
              <Button variant="outline" size="sm" onClick={handleAddRepo}>
                <PlusIcon className="h-4 w-4 mr-1" />
                {t("repository.add_repo", "Add Repository")}
              </Button>
            </div>

            <div className="space-y-3 h-[300px] overflow-y-auto pr-1 rounded border border-muted p-1">
              {repositories.map((repo, index) => (
                <Card key={index} className="border-muted">
                  <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <GithubIcon className="h-4 w-4" />
                      {t("repository.repo_item", "Repository")} #{index + 1}
                    </CardTitle>
                    {repositories.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveRepo(index)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="p-3 pt-2">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="flex items-center gap-1 text-xs font-normal text-muted-foreground">
                          <UserIcon className="h-3 w-3" />
                          {t("repository.owner", "Owner")}
                        </Label>
                        <Input
                          className="h-9"
                          value={repo.owner}
                          disabled
                          onChange={(e) =>
                            handleRepoChange(index, "owner", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="flex items-center gap-1 text-xs font-normal text-muted-foreground">
                          <GithubIcon className="h-3 w-3" />
                          {t("repository.repo_name", "Repository Name")}
                        </Label>
                        <Input
                          className="h-9"
                          value={repo.repoName}
                          onChange={(e) =>
                            handleRepoChange(index, "repoName", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="flex items-center gap-1 text-xs font-normal text-muted-foreground">
                          <GitBranchIcon className="h-3 w-3" />
                          {t("repository.branch_name", "Branch Name")}
                        </Label>
                        <Input
                          className="h-9"
                          value={repo.branchName}
                          onChange={(e) =>
                            handleRepoChange(
                              index,
                              "branchName",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <LoadingSpinner className="mr-2 h-4 w-4" />
            ) : (
              <FilterIcon className="mr-2 h-4 w-4" />
            )}
            {t(
              "repository.run_analyze",
              "Start Analysis & Build Knowledge Base"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Date range picker with presets
interface DateRangePickerWithPresetsProps {
  dateRange: DateRange;
  setDateRange: (dateRange: DateRange) => void;
  presets: TimePreset[];
}

function DateRangePickerWithPresets({
  dateRange,
  setDateRange,
  presets,
}: DateRangePickerWithPresetsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-2">
      <div className="flex items-center">
        <CalendarDateRangePicker
          className="flex-1"
          date={dateRange}
          setDate={(date: DateRange | undefined) => date && setDateRange(date)}
        />

        <div className="flex gap-1 ml-2">
          {presets.map((preset, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className={cn(
                "text-xs h-9",
                dateRange?.from &&
                  preset.range.from &&
                  dateRange?.to &&
                  preset.range.to &&
                  dateRange.from.getTime() === preset.range.from.getTime() &&
                  dateRange.to.getTime() === preset.range.to.getTime() &&
                  "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              onClick={() => setDateRange(preset.range)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
