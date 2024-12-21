import { Button } from "@repo/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card"
import { Progress } from "@repo/ui/progress"
import { Github, CheckCircle2, Circle, FileText, MessageSquare } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react"
import { useLocation } from "react-router-dom"

interface Step {
  key: string
  title: string
  description: string
  action: string
  icon?: typeof Github | typeof FileText | typeof MessageSquare
  href?: string
}

const requiredSteps: Step[] = [
  {
    key: "register",
    title: "注册并登录",
    description: "创建您的账号或使用现有账号登录系统",
    action: "前往注册/登录",
  },
  {
    key: "auth-github",
    title: "授权 GitHub",
    description: "授权 CR-Mentor GitHub App 访问您的 GitHub 账户，以便进行代码审查",
    action: "授权 GitHub",
    icon: Github,
    href: "https://github.com/apps/cr-mentor"
  },
]

const optionalSteps: Step[] = [
  {
    key: "create-pr",
    title: "创建知识库 PR",
    description: "体验如何创建一个携带知识库的 Pull Request",
    action: "查看演示",
    icon: FileText,
  },
  {
    key: "doc-chat",
    title: "文档对话",
    description: "创建知识库并上传文档，体验与文档对话的功能",
    action: "开始体验",
    icon: MessageSquare,
  },
]

const apiUrl = import.meta.env.VITE_GITHUB_SERVER_API

export function Component() {
  const location = useLocation()
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [showOptional, setShowOptional] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const { isLoaded, isSignedIn, user } = useUser()

  useEffect(() => {
    if (isLoaded) {
      setIsLoggedIn(isSignedIn)
    }
  }, [isLoaded, isSignedIn])

  useEffect(() => {
    const initialProgress = isLoggedIn ? 50 : 0
    const initialStep = isLoggedIn ? 1 : 0

    const timer = setTimeout(() => {
      setProgress(initialProgress)
      setCurrentStep(initialStep)
    }, 500)
    return () => clearTimeout(timer)
  }, [isLoggedIn])


  useEffect(() => {
    const code = new URLSearchParams(location.search).get("code")
    if (!code) return

    const getGithubInfo = async () => {
      try {
        // 获取 access token
        const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            client_id: "Iv23lirfuP3isbwXrgfi",
            client_secret: "dc2f2f7aad207f6810f22739bde31c15abf9a83c",
            code
          })
        })
        const { access_token } = await tokenRes.json()

        // 获取用户信息
        const userRes = await fetch("https://api.github.com/user", {
          headers: {
            "Authorization": `Bearer ${access_token}`
          }
        })
        const { login } = await userRes.json()
        const res = await fetch(`${apiUrl}/api/clerk/setMetadata`, {
          method: "POST",
          body: JSON.stringify({
            userId: user?.id,
            githubName: login
          })
        })
        const { success } = await res.json()
        if (success) {
          setCurrentStep(2)
          setProgress(100)
          setShowOptional(true)
        }
      } catch (error) {
        console.error("获取GitHub信息失败:", error)
      }
    }

    getGithubInfo()
  }, [location])

  console.log(user?.unsafeMetadata)

  // useEffect(() => {
  //   console.log("🚀 ~ useEffect ~ user?.unsafeMetadata?.githubName:", user?.unsafeMetadata?.githubName)
  //   if (user?.unsafeMetadata?.githubName) {
  //     setCurrentStep(2)
  //     setProgress(2 * 50)
  //     setShowOptional(true)
  //   }
  // }, [user?.unsafeMetadata?.githubName])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">快速开始</h1>

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
              必选步骤 {index + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">必选步骤</h2>
          {requiredSteps.map((step, index) => (
            <Card
              key={step.key}
              className={cn(
                "transition-all duration-300",
                (!isLoggedIn && index === 0) || (isLoggedIn && index === 1)
                  ? "border-primary shadow-lg scale-100"
                  : "scale-95 opacity-70"
              )}
            >
              <CardHeader>
                <CardTitle>第 {index + 1} 步：{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-auto",
                    index === 0 && !isLoggedIn && "border-[blue]"
                  )}
                  disabled={index === 1 && !isLoggedIn}
                  onClick={() => {
                    if (step.key === "auth-github") {
                      setCurrentStep(index + 1)
                      setProgress((index + 1) * 50)
                      window.open(step.href, "_blank")
                    }

                    // if (step.key === requiredSteps?.[requiredSteps.length - 1]?.key) {
                    //   setShowOptional(true)
                    // }
                  }}
                >
                  {index === 0 ? (
                    <div className="text-[blue] ">
                      <SignedOut>
                        <SignInButton />
                      </SignedOut>
                      <SignedIn>
                        <div className="mt-[6px]">
                          <UserButton />
                        </div>
                      </SignedIn>
                    </div>
                  ) : (
                    <>
                      {step.icon && <step.icon className="mr-2 h-4 w-4" />}
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
            <h2 className="text-xl font-semibold">可选功能体验</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {optionalSteps.map((step, index) => (
                <Card key={index} className="transition-all duration-300 hover:shadow-lg">
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
    </div >
  )
}
