declare module '@mastra/core/tool' {
  export interface ToolParameter {
    type: string;
    description?: string;
    properties?: Record<string, ToolParameter>;
    items?: ToolParameter;
    required?: string[];
  }

  export interface ToolConfig {
    name: string;
    description: string;
    parameters: {
      type: string;
      properties: Record<string, ToolParameter>;
      required?: string[];
    };
    handler: (params: any) => Promise<any>;
  }

  export class Tool {
    constructor(config: ToolConfig);
  }
}

declare module '@mastra/core/agent' {
  export interface AgentConfig {
    name: string;
    instructions: string;
    model: any;
    tools: Record<string, any>;
  }

  export class Agent {
    constructor(config: AgentConfig);
  }
}

declare module '@mastra/core/mastra' {
  import { Agent } from '@mastra/core/agent';

  export interface MastraConfig {
    agents: Record<string, Agent>;
    logger: any;
  }

  export class Mastra {
    constructor(config: MastraConfig);
    createConversation(params: { agentId: string; metadata?: any }): Promise<Conversation>;
  }

  export interface Conversation {
    sendMessage(params: { content: string }): Promise<{ content: string }>;
  }
}

declare module '@mastra/core/logger' {
  export function createLogger(config: { name: string; level: string }): any;
} 