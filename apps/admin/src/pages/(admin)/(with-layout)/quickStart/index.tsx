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

interface Step {
  title: string
  description: string
  action: string
  icon?: typeof Github | typeof FileText | typeof MessageSquare
}

const requiredSteps: Step[] = [
  {
    title: "注册并登录",
    description: "创建您的账号或使用现有账号登录系统",
    action: "前往注册/登录",
  },
  {
    title: "授权 GitHub",
    description: "授权 CR-Mentor GitHub App 访问您的 GitHub 账户，以便进行代码审查",
    action: "授权 GitHub",
    icon: Github,
  },
]

const optionalSteps: Step[] = [
  {
    title: "创建知识库 PR",
    description: "体验如何创建一个携带知识库的 Pull Request",
    action: "查看演示",
    icon: FileText,
  },
  {
    title: "文档对话",
    description: "创建知识库并上传文档，体验与文档对话的功能",
    action: "开始体验",
    icon: MessageSquare,
  },
]

export function Component() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [showOptional, setShowOptional] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(50)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

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
              key={index}
              className={cn(
                "transition-all duration-300",
                index === currentStep
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
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setCurrentStep(index + 1)
                    setProgress((index + 1) * 50)
                    if (index === requiredSteps.length - 1) {
                      setShowOptional(true)
                    }
                  }}
                >
                  {step.icon && <step.icon className="mr-2 h-4 w-4" />}
                  {step.action}
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
    </div>
  )
}
