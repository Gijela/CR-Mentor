import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar"
import { Button } from "@repo/ui/button"
import { Card, CardContent } from "@repo/ui/card"
import { Input } from "@repo/ui/input"
import { ScrollArea } from "@repo/ui/scroll-area"
import { Send } from "lucide-react"
import { useState } from "react"

export function Component() {
  const [selectedMember, setSelectedMember] = useState<string>("Mike")
  const [message, setMessage] = useState("")

  const teamMembers = [
    {
      name: "Mike",
      role: "Team Leader",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Mike",
      contentImage: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80", // 会议/领导场景
    },
    {
      name: "Alex",
      role: "Engineer",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Alex",
      contentImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80", // 编程场景
    },
    {
      name: "Emma",
      role: "Product Manager",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Emma",
      contentImage: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80", // 产品规划场景
    },
    {
      name: "Bob",
      role: "Architect",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Bob",
      contentImage: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80", // 架构设计场景
    },
    {
      name: "David",
      role: "Data Analyst",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=David",
      contentImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80", // 数据分析场景
    },
  ]

  const mockMessages = [
    { id: 1, type: "user", content: "Hi, I need help with the project." },
    { id: 2, type: "agent", content: "Sure, I can help. What specific aspect do you need assistance with?" },
  ]

  return (
    <div className="flex h-full w-full">
      {/* 左侧对话区域 */}
      <div className="w-[320px] border-r flex flex-col">
        {/* 对话历史列表 */}
        <ScrollArea className="flex-1 px-4 py-6">
          <div className="space-y-4">
            {mockMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <Card className={`max-w-[85%] ${msg.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <CardContent className="p-3">
                    <p className="text-sm">{msg.content}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* 底部输入框 */}
        <div className="border-t p-4 bg-background">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 右侧内容区域 */}
      <div className="flex-1 flex flex-col">
        {/* 团队信息和成员列表合并为一个区域 */}
        <div className="border-b bg-card">
          {/* 团队信息 */}
          <div className="px-4 py-2 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35625 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35625 16.1429M7.35625 16.1429C8.0935 14.301 9.89482 13 12 13C14.1052 13 15.9065 14.301 16.6438 16.1429M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7ZM21 10C21 11.1046 20.1046 12 19 12C17.8954 12 17 11.1046 17 10C17 8.89543 17.8954 8 19 8C20.1046 8 21 8.89543 21 10ZM7 10C7 11.1046 6.10457 12 5 12C3.89543 12 3 11.1046 3 10C3 8.89543 3.89543 8 5 8C6.10457 8 7 8.89543 7 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm text-muted-foreground">Team</span>
            <span className="text-sm text-muted-foreground">5</span>
          </div>

          {/* 成员列表 */}
          <div className="flex px-4 py-2 gap-2">
            {teamMembers.map((member) => (
              <button
                key={member.name}
                onClick={() => setSelectedMember(member.name)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${selectedMember === member.name ?
                    "bg-primary text-primary-foreground shadow-md scale-[1.02]" :
                    "hover:bg-accent/40 hover:scale-[1.02]"
                  }
                `}
              >
                <Avatar className="h-9 w-9 border-2 border-background">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="text-sm font-medium leading-none mb-1">{member.name}</div>
                  <div className={`text-xs ${selectedMember === member.name ?
                      "text-primary-foreground/80" :
                      "text-muted-foreground"
                    }`}
                  >
                    {member.role}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 图片展示区域 */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            {selectedMember ? (
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-0">
                    <img
                      src={teamMembers.find((m) => m.name === selectedMember)?.contentImage}
                      alt={`${selectedMember}'s workspace`}
                      className="w-full rounded-lg transition-all duration-300"
                    />
                  </CardContent>
                </Card>
                <div className="text-sm text-muted-foreground text-center">
                  {selectedMember}'s workspace
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Select a team member to view their workspace
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
