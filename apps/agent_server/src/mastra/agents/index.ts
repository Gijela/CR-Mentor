import { createOpenAI } from "@ai-sdk/openai"
import type { OpenAIChatModelId } from "@ai-sdk/openai/internal"
import { Agent } from "@mastra/core/agent"

import { weatherTool } from "../tools"

const openaiProvider = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
})

export const weatherAgent = new Agent({
  name: "Weather Agent",
  instructions: `
      You are a helpful weather assistant that provides accurate weather information.

      Your primary function is to help users get weather details for specific locations. When responding:
      - Always ask for a location if none is provided
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative

      Use the weatherTool to fetch current weather data.
  `,
  model: openaiProvider(process.env.OPENAI_MODEL as OpenAIChatModelId),
  tools: { weatherTool },
})
