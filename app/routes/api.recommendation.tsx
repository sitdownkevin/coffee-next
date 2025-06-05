import { type ActionFunctionArgs } from "react-router";

import type { ItemInCart } from "~/types/item";
import type { ChatBase, ChatResponse, MessageBase } from "~/types/chat";


function transformChatToText(chat: ChatBase) {
  return chat.map((message: MessageBase) => `${message.role}\n${message.content}`).join("\n\n");
}


function addMessageToChat(chat: ChatBase, message: MessageBase) {
  return [...chat, message];
}


export async function action({ request }: ActionFunctionArgs) {
  // 仅允许POST请求
  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }

  const body = await request.json();
  const chat = body as ChatBase;
  const queryText = transformChatToText(chat);


  try {
    const messageFromBackend: MessageBase = {
      role: "ai",
      content: "以下是为您的推荐。如果还有其他需求，请随时告诉我！",
    }

    const itemsInChatFromBackend: ItemInCart[] = [
      {
        name: "卡布奇诺",
        description: "卡布奇诺",
        type: "coffee",
        basePrice: 20,
        options: {
          cup: [
            {
              name: "中杯",
              addPrice: 0,
            },
          ],
        },
        hash: "",
        optionsSelected: {
          cup: {
            name: "中杯",
            addPrice: 0,
          },
        },
        quantity: 1,
      }
    ]


    const chatResponse: ChatResponse = {
      chat: addMessageToChat(chat, messageFromBackend),
      itemsInChat: itemsInChatFromBackend,
    }

    return new Response(
      JSON.stringify(chatResponse),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        chat: [
          {
            role: "ai",
            content: "推荐服务器错误，请稍后再试",
          },
        ],
        itemsInChat: [],
      }),
      { status: 500 }
    );
  }
}
