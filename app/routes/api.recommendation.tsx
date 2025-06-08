import { type ActionFunctionArgs } from "react-router";

import type { ItemSelected, ItemInCart } from "~/types/item";


import { transformItemSelectedToItemInCart } from "~/lib/itemFormat";



export async function action({ request }: ActionFunctionArgs) {
  // 仅允许POST请求
  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }

  try {
    const chat = [
      {
        role: "assistant",
        content: "您好！我是您的咖啡助手，下面是为您推荐的商品。如有其他需求，请随时告诉我！",
      },
    ]

    const itemsSelected: ItemSelected[] = [
      {
        name: "卡布奇诺",
        quantity: 1,
        options: {
          cup: "中杯",
          sugar: "正常糖",
          temperature: "常温",
        },
      },
      {
        name: "凯撒沙拉",
        quantity: 1,
        options: {
          cup: "",
          sugar: "",
          temperature: "",
        }
      }
    ]

    const itemsInChat: ItemInCart[] = itemsSelected.map((item) => transformItemSelectedToItemInCart(item)).filter((item) => item !== null);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          chat: chat,
          itemsInChat: itemsInChat,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
