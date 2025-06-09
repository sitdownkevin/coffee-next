import { type ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { items } from "~/data/items";
import { discount } from "~/data/discount";

import OpenAI from "openai";
import type { ChatBase } from "~/types/chat";
import { transformItemSelectedToItemInCartQwen } from "~/lib/itemFormat";


const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: process.env.DASHSCOPE_BASE_URL,
});

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
    6. 请严格按照 JSON 格式返回，不要包含任何其他内容。
    7. options下面必须包含cup、sugar、temperature三个选项，如果商品没有选项，则返回空字符串。
  </constraints>
  <format_instructions>
  \`\`\`json
    {
      "message": "给用户的友好回复消息",
      "itemsSelected": [
        {
          "name": "商品名称",
          "quantity": 数量（数字类型）,
          "cup": "杯型选项（如果商品没有杯型选项则为空字符串）",
          "sugar": "糖量选项（如果商品没有糖量选项则为空字符串）",
          "temperature": "温度选项（如果商品没有温度选项则为空字符串）"
        }
      ]
    }
  \`\`\`
  
  重要提醒：
  - itemsSelected 是一个数组，每个元素包含 name、quantity、options 三个字段
  - options 是一个对象，必须包含 cup、sugar、temperature 三个字段
  - cup、sugar、temperature 是 options 对象内部的属性，不是与 options 并列的属性
  - quantity 是数字类型，不是字符串
  </format_instructions>
  
  <example>
  用户说："我想点一杯大杯，半糖，常温的卡布奇诺"
  正确的返回格式：
  \`\`\`json
  {
    "message": "为您点了一杯大杯，半糖，常温的卡布奇诺。",
    "itemsSelected": [
      {
        "name": "卡布奇诺",
        "quantity": 1,
        "cup": "大杯",
        "sugar": "半糖",
        "temperature": "常温"
      }
    ]
  }
  \`\`\`
  </example>
  `;

  const chatProcessed = [
    { role: "system" as const, content: systemPrompt },
    ...chat.map(msg => ({
      role: (msg.role === "human" ? "user" : msg.role) as "system" | "user" | "assistant",
      content: msg.content
    }))
  ];

  try {
    const result = await openai.chat.completions.create({
      model: process.env.DASHSCOPE_MODEL_NAME || "qwen-plus",
      messages: chatProcessed,
      response_format: { type: "json_object" },
      temperature: 0.7,
    });
    // console.log(result);
    // const messageContent = result.message;
    // const itemsInChat = result.itemsSelected.map((item) => transformItemSelectedToItemInCart(item)).filter((item) => item !== null);
    const resultJson = JSON.parse(result.choices[0].message.content || "{}");
    const messageContent = resultJson.message;
    const itemsInChat = resultJson.itemsSelected?.map((item: any) => transformItemSelectedToItemInCartQwen(item)).filter((item: any) => item !== null) || [];
    console.log(itemsInChat);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          chat: [...chat, { role: "assistant", content: messageContent }],
          itemsInChat: itemsInChat,
          // result: result.choices[0].message.content,
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
