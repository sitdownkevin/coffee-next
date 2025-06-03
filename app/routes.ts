import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("api/speech-processing", "routes/api.speech-processing.tsx"),
  route("api/tencent-asr", "routes/api.tencent-asr.tsx")
] satisfies RouteConfig;
