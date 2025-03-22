import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// 聊天消息类型
export type Message = {
  id: number;
  type: string;
  content: string;
};

// 聊天组件
export const ChatPanel = ({
  messages,
}: {
  messages: Message[];
  message: string;
  setMessage: (value: string) => void;
}) => {
  return (
    <div className="w-[320px] shrink-0 border-r flex flex-col">
      {/* 对话历史列表 */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex
                ${msg.type === "user" ? "justify-end" : "justify-start"}
                ${index === messages.length - 1 ? "pb-4" : ""}
                ${index === 0 ? "pt-4" : ""}`}
            >
              <Card
                className={`max-w-[85%] ${
                  msg.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <CardContent className="p-3">
                  <p className="text-sm">{msg.content}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* 底部输入框 */}
      {/* <div className="border-t p-4 bg-background">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="输入消息..."
            className="flex-1"
          />
          <Button size="icon" className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div> */}
    </div>
  );
};
