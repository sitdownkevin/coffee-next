import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("api/speech-processing", "routes/api.speech-processing.tsx"),
  route("api/tencent-asr", "routes/api.tencent-asr.tsx"),
  route("api/tencent-tts", "routes/api.tencent-tts.tsx"),
  route("api/recommendation", "routes/api.recommendation.tsx"),
  route("api/chat", "routes/api.chat.tsx"),
  route("api/langchain-chat", "routes/api.langchain-chat.tsx"),
  route("api/langchain-chat-qwen", "routes/api.langchain-chat-qwen.tsx"),
] satisfies RouteConfig;