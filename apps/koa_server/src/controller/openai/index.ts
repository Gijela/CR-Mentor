import type Koa from "koa"
import OpenAI from "openai"

const openai = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * 流式输出
 * @param {Koa.Context} ctx
 */
export const streamOutput = async (ctx: Koa.Context) => {
  const { messages } = ctx.request.body as { messages: { role: string, content: string }[] }
  const stream = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL!,
    messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
    stream: true,
  })

  // 设置响应头
  ctx.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  })

  // 处理流式响应
  for await (const chunk of stream) {
    ctx.res.write(`data: ${JSON.stringify(chunk)}\n\n`)
  }
  ctx.res.end()
}

/**
 * json 输出
 * @param {Koa.Context} ctx
 * @returns {Promise<Object>}
 */
export const jsonOutput = async (ctx: Koa.Context) => {
  const { messages } = ctx.request.body as { messages: { role: string, content: string }[] }
  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL!,
    messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
    response_format: { type: "json_object" },
  })
  ctx.body = JSON.parse(completion.choices[0].message.content || "{}")
}
