import { type ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { items } from "~/data/items";
import { discount } from "~/data/discount";

import { ChatOpenAI } from "@langchain/openai";
import type { ChatBase } from "~/types/chat";
import { transformItemSelectedToItemInCart } from "~/lib/itemFormat";

const llm = new ChatOpenAI({
  model: process.env.OPENAI_MODEL_NAME || "gpt-4.1-mini",
  temperature: 0.7,
});

const itemSelectedSchema = z.object({
  name: z.string().describe("商品名称，例如'卡布奇诺'。"),
  quantity: z.number().describe("用户想要的此商品的数量。"),
  options: z.object({
    cup: z
      .string()
      .describe("杯型，例如'大杯'。如果该商品没有杯型，则返回空字符串。"),
    sugar: z
      .string()
      .describe("糖量，例如'半糖'。如果该商品没有糖量，则返回空字符串。"),
    temperature: z
      .string()
      .describe("温度，例如'常温'。如果该商品没有温度，则返回空字符串。"),
  }),
});

const structuredOutputSchema = z.object({
  message: z.string().describe("给用户的友好回复消息。"),
  itemsSelected: z
    .array(itemSelectedSchema)
    .describe("从对话中识别出的商品列表。如果用户没有明确点单，可以为空。"),
});

const chain = llm.withStructuredOutput(structuredOutputSchema);

export async function action({ request }: ActionFunctionArgs) {
  // 仅允许POST请求
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { chat }: { chat: ChatBase } = await request.json();

  const systemPrompt = `
  <role>
    你是一名点单助手，请根据用户的点单，给出相应的回答。
  </role>
  <instructions>
    请从对话中识别用户想要点的商品，并以结构化的 JSON 格式返回。
  </instructions>
  <menu>
    以下是当前的菜单:
  ${items
    .map(
      (item) =>
        `${item.name} - ${item.description} - ${
          item.basePrice
        }元 - ${item.options.cup
          ?.map((option) => `${option.name} - ${option.addPrice}元`)
          .join("、")}`
    )
    .join("\n")}
  </menu>
  <discount>
    当前店铺存在以下优惠活动:
    ${discount.map((item) => `- ${item}`).join("\n")}
  </discount>
  <constraints>
    1. 使用中文回答。
    2. 如果用户的提问与商品的内容无关，请礼貌地告诉用户，你只能用于当前店铺的信息回答。
    3. 如果用户没有明确点单，可以为空。
    4. 如果用户点单，请根据菜单中的商品，给出相应的回答。有的商品存在选项，如果用户没有明确选择，请给出默认的选项。
    5. 回复客户的语句不要超过100字。
  </constraints>
  `;

  const chatProcessed = [{ role: "system", content: systemPrompt }, ...chat];

  try {
    const result = await chain.invoke(chatProcessed);

    const messageContent = result.message;
    const itemsInChat = result.itemsSelected.map((item) => transformItemSelectedToItemInCart(item)).filter((item) => item !== null);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          chat: [...chat, { role: "assistant", content: messageContent }],
          itemsInChat: itemsInChat,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
