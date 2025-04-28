import { Tiktoken, get_encoding } from "@dqbd/tiktoken";

// 定义 TokenHandler 功能的接口
export interface TokenHandler {
  promptTokens: number; // Prompt (例如，系统消息) 本身占用的 Token 数
  countTokens(text: string): number; // 计算给定文本的 Token 数量的方法
}

export class TiktokenHandler implements TokenHandler {
  promptTokens: number;
  private encoder: Tiktoken; // Tiktoken 编码器实例

  constructor(systemPromptText = "") {
    this.promptTokens = 0; // 计算 system prompt 的 Token 数作为初始值

    // 根据模型选择编码，或使用像 'cl100k_base' 这样的默认编码（适用于许多较新模型）
    // 为简单起见，这里直接使用 cl100k_base，因为它很常用。
    // 你可能需要根据确切的模型字符串进行更复杂的逻辑判断。
    try {
      this.encoder = get_encoding("cl100k_base"); // 获取 cl100k_base 编码器
      this.promptTokens = this.countTokens(systemPromptText);
    } catch (e) {
      console.error("获取 Tiktoken 编码 'cl100k_base' 失败。请确保 @dqbd/tiktoken 已正确安装。", e);
      // 可以选择回退到其他方案或抛出错误
      throw new Error("Tiktoken 初始化失败。");
    }
  }

  // 计算文本的 Token 数
  countTokens(text: string): number {
    if (!text) return 0;
    try {
      // 注意：Tiktoken 的 encode 方法返回 Uint32Array，其长度即为 Token 数量。
      return this.encoder.encode(text).length;
    } catch (e) {
      console.error(`编码文本时出错: "${text.substring(0, 50)}..."`, e);
      // 在某些情况下，可能希望回退到近似计算，这里我们返回 0
      return 0;
    }
  }
}
