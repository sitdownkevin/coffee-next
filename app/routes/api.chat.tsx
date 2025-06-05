import { type ActionFunctionArgs } from "react-router";
import type { ChatBase } from "~/types/ai";


export async function action({ request }: ActionFunctionArgs) {
  // 仅允许POST请求
  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }

  const body = await request.json();
  const { message } = body;


  return new Response(JSON.stringify({
    messages: [
      { role: "system", content: "我是你的咖啡助手，有什么可以帮助你的？" },
      { role: "human", content: "我想要点一杯红茶玛奇朵" },
      { role: "ai", content: "好的，红茶玛奇朵是吗？" },
      { role: "human", content: "是的，谢谢" },
      { role: "ai", content: "不客气，红茶玛奇朵是吗？" },
      { role: "human", content: "是的，谢谢" },
      { role: "ai", content: "好的，红茶玛奇朵是吗？" },
      { role: "human", content: "是的，谢谢" },
      { role: "ai", content: "不客气，红茶玛奇朵是吗？" },
      { role: "human", content: "是的，谢谢" },
      { role: "ai", content: "好的，红茶玛奇朵是吗？" },
      { role: "human", content: "是的，谢谢" },
      { role: "ai", content: "不客气，红茶玛奇朵是吗？" },
      { role: "human", content: "是的，谢谢" },
    { role: "ai", content: "好的，红茶玛奇朵是吗？" },
      { role: "human", content: "是的，谢谢" },
      { role: "ai", content: "不客气，红茶玛奇朵是吗？" },
      { role: "human", content: "是的，谢谢" },
    ],
  } as ChatBase), { status: 200 });
}