import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Circle,
  FileText,
  Github,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

interface Step {
  key: string;
  title: string;
  description: string;
  action: string;
  icon?: typeof Github | typeof FileText | typeof MessageSquare;
  href?: string;
}

const requiredSteps: Step[] = [
  {
    key: "register",
    title: "Register and Login",
    description: "Create your account or login with an existing account",
    action: "Go to Register/Login",
  },
  {
    key: "auth-github",
    title: "Authorize GitHub",
    description:
      "Authorize CR-Mentor GitHub App to access your GitHub account for code review",
    action: "Authorize GitHub",
    href: "https://github.com/apps/cr-mentor/installations/select_target",
  },
];

const optionalSteps: Step[] = [
  {
    key: "create-pr",
    title: "Create Knowledge Base PR",
    description: "Experience how to create a Pull Request with knowledge base",
    action: "Try Now",
    icon: FileText,
  },
  {
    key: "doc-chat",
    title: "Document Chat",
    description:
      "Create a knowledge base and upload documents to experience document chat functionality",
    action: "Try Now",
    icon: MessageSquare,
  },
];

export function Component() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showOptional, setShowOptional] = useState(false);
  const [isSavingGithubName, setIsSavingGithubName] = useState(false);
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn && !user?.publicMetadata?.githubName) {
      setCurrentStep(1);
      setProgress(50);
    }
    // const initialProgress = isSignedIn ? 50 : 0
    // const initialStep = isSignedIn ? 1 : 0

    // const timer = setTimeout(() => {
    //   setProgress(progress === 100 ? 100 : initialProgress)
    //   setCurrentStep(currentStep === 2 ? 2 : initialStep)
    // }, 500)
    // return () => clearTimeout(timer)
  }, [isSignedIn]);

  useEffect(() => {
    if (user?.publicMetadata && user?.publicMetadata?.githubName) {
      setCurrentStep(2);
      setProgress(100);
      setShowOptional(true);
    }
  }, [user?.publicMetadata?.githubName]);

  const handleSaveGithubName = async (code: string) => {
    try {
      const token = await getToken();
      if (!token) {
        return;
      }

      setIsSavingGithubName(true);
      const result = await fetch(
        `${import.meta.env.VITE_SERVER_HOST}/clerk/saveGithubName`,
        {
          method: "POST",
          body: JSON.stringify({ code }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await result.json();
      if (!data.success) {
        toast.error(data.msg);
        throw new Error(data.msg);
      }

      setCurrentStep(2);
      setProgress(100);
      setShowOptional(true);
      setIsSavingGithubName(false);
    } catch (error) {
      setIsSavingGithubName(false);
      console.error("Failed to save GitHub name:", error);
    }
  };

  useEffect(() => {
    const code = new URLSearchParams(location.search).get("code");
    if (!code || !user?.id) {
      return;
    }
    handleSaveGithubName(code);
  }, [location, user?.id]);

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-6">Quick Start</h1>

      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2">
          {requiredSteps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center text-sm",
                index <= currentStep ? "text-primary" : "text-muted-foreground"
              )}
            >
              {index <= currentStep ? (
                <CheckCircle2 className="w-4 h-4 mr-1" />
              ) : (
                <Circle className="w-4 h-4 mr-1" />
              )}
              Step {index + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          {requiredSteps.map((step, index) => (
            <Card
              key={step.key}
              className={cn(
                "transition-all duration-300",
                currentStep > index
                  ? "scale-95 opacity-70"
                  : "hover:shadow-lg scale-100"
              )}
            >
              <CardHeader>
                <CardTitle>
                  Step {index + 1}: {step.title}
                </CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className={cn("w-full sm:w-auto")}
                  disabled={index === 1 && !isSignedIn}
                  onClick={() => {
                    if (step.key === "auth-github") {
                      window.open(step.href, "_blank");
                    }
                  }}
                >
                  {step.key === "register" && (
                    <div>
                      <SignedOut>
                        <SignInButton />
                      </SignedOut>
                      <SignedIn>
                        <div className="mt-[6px]">
                          <UserButton />
                        </div>
                      </SignedIn>
                    </div>
                  )}
                  {step.key === "auth-github" && (
                    <>
                      {isSavingGithubName ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Github className="mr-2 h-4 w-4" />
                      )}
                      {step.action}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {showOptional && (
          <div className="space-y-4 pt-6">
            <h2 className="text-xl font-semibold">Feature Experience</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {optionalSteps.map((step, index) => (
                <Card
                  key={index}
                  className="transition-all duration-300 hover:shadow-lg"
                  onClick={() => {
                    if (step.key === "create-pr") {
                      navigate("/repository");
                    }
                    if (step.key === "doc-chat") {
                      navigate("/knowledgeBase");
                    }
                  }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {step.icon && <step.icon className="h-5 w-5" />}
                      {step.title}
                    </CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full sm:w-auto">
                      {step.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
