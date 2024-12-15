declare module '@ant-design/pro-chat' {
  import { FC } from 'react';

  interface Message {
    content: string;
    role: 'user' | 'assistant' | 'system';
  }

  interface ProChatProps {
    styles?: {
      chatListItemContent?: React.CSSProperties;
      chatSendButton?: React.CSSProperties;
      chatInputArea?: React.CSSProperties;
      chatInputAction?: React.CSSProperties;
    };
    helloMessage?: string;
    placeholder?: string;
    sendMessageRequest?: (messages: Message[]) => Promise<Response>;
  }

  export const ProChat: FC<ProChatProps>;
} 