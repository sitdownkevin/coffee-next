import { type ActionFunctionArgs } from "react-router";

import { items } from "~/data/items";
import type { Item, ItemInCart } from "~/types/item";
import type { ChatBase, ChatResponse, MessageBase } from "~/types/chat";


function getItemByName({ name }: { name: string }) {
  const item = items.find((item) => item.name === name);
  if (!item) {
    return null;
  }

  return item;
}

function transformChatToText(chat: ChatBase) {
  const history = chat
    .slice(0, -1)
    .map(
      (message: MessageBase) =>
        `<history>${message.role}\n${message.content}</history>`
    )
    .join("\n\n");
  const lastMessage = `<current_question>${chat[chat.length - 1].role}\n${
    chat[chat.length - 1].content
  }</current_question>`;

  return [history, lastMessage].join("\n\n");
}

function addMessageToChat(chat: ChatBase, message: MessageBase) {
  return [...chat, message];
}

function trasnfromRawItemInCartToNewItemInCart(item: any): ItemInCart | null {
  const newItem: Item | null = getItemByName({ name: item.name });

  if (!newItem) {
    return null;
  }

  const newItemInCart: ItemInCart = {
    name: newItem.name,
    description: newItem.description,
    type: newItem.type,
    basePrice: newItem.basePrice,
    options: newItem.options,
    quantity: 1,
    optionsSelected: {},
    hash: "",
  };

  if (item.cup) {
    newItemInCart.optionsSelected["cup"] = newItem.options.cup?.find((option) => option.name === item.cup);
  }

  if (item.sugar) {
    newItemInCart.optionsSelected["sugar"] = newItem.options.sugar?.find((option) => option.name === item.sugar);
  }

  if (item.temperature) {
    newItemInCart.optionsSelected["temperature"] = newItem.options.temperature?.find((option) => option.name === item.temperature);

  }

  return newItemInCart;
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
    const response = await fetch("http://106.14.161.78:65000/api/coffee_new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: queryText,
      }),
    });

    console.log("queryText", queryText);

    const responseData = await response.json();
    console.log("responseData", responseData);

    const messageFromBackend: MessageBase = {
      role: "assistant",
      content: responseData.response.content,
    };

    let itemsInChatFromBackend: ItemInCart[] = responseData.orderInfo.map(
      (item: any) => trasnfromRawItemInCartToNewItemInCart(item)
    );

    itemsInChatFromBackend = itemsInChatFromBackend.filter((item) => item !== null);

    console.log("itemsInChatFromBackend", itemsInChatFromBackend);

    // console.log(itemsInChatFromBackend);
    // DEBUG
    // const messageFromBackend: MessageBase = {
    //   role: "assistant",
    //   content: "你好！以下是您的订单信息：如果还有其他需求，请随时告诉我！",
    // }

    // const itemsInChatFromBackend: ItemInCart[] = [
    //   {
    //     name: "卡布奇诺",
    //     description: "卡布奇诺",
    //     type: "coffee",
    //     basePrice: 20,
    //     options: {
    //       cup: [
    //         {
    //           name: "中杯",
    //           addPrice: 0,
    //         },
    //       ],
    //     },
    //     hash: "",
    //     optionsSelected: {
    //       cup: {
    //         name: "中杯",
    //         addPrice: 0,
    //       },
    //     },
    //     quantity: 1,
    //   },
    // ]

    const chatResponse: ChatResponse = {
      chat: addMessageToChat(chat, messageFromBackend),
      itemsInChat: itemsInChatFromBackend,
    };

    return new Response(JSON.stringify(chatResponse), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        chat: [
          {
            role: "assistant",
            content: "服务器错误，请稍后再试",
          },
        ],
        itemsInChat: [],
      }),
      { status: 500 }
    );
  }
}
