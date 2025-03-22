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
  try {
    const { messages } = ctx.request.body as { messages: { role: string, content: string }[] }
    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL!,
      messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
      stream: true,
    })

    ctx.status = 200
    // 设置响应头
    ctx.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    })

    // 处理流式响应
    for await (const chunk of stream) {
      ctx.res.write(`data: ${JSON.stringify(chunk)}\n\n`)

      // 当收到完成信号时，可以发送一个特殊的消息
      if (chunk.choices[0]?.finish_reason === "stop") {
        ctx.res.write(`data: [DONE]\n\n`)
      }
    }
    ctx.res.end()
  } catch (e) {
    console.log('openai stream error => ', e)
    ctx.status = 500
    ctx.body = { success: false, message: "openai stream error", error: e }
  }
}

/**
 * json 输出
 * @param {Koa.Context} ctx
 * @returns {Promise<Object>}
 */
export const jsonOutput = async (ctx: Koa.Context) => {
  try {
    const { messages } = ctx.request.body as { messages: { role: string, content: string }[] }
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL!,
      messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
      response_format: { type: "json_object" },
    })
    console.log('completion.choices[0] ==> ', completion.choices[0])
    ctx.body = JSON.parse(completion.choices[0].message.content || "{}")
  } catch (e) {
    console.log('openai json error => ', e)
    ctx.status = 500
    ctx.body = { success: false, message: "openai json error", error: e }
  }
}
