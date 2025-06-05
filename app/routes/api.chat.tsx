import { type ActionFunctionArgs } from "react-router";

import type { ItemInCart } from "~/types/item";
import type { ChatBase, ChatResponse, MessageBase } from "~/types/chat";

function transformChatToText(chat: ChatBase) {
  const history = chat.slice(0, -1).map((message: MessageBase) => `<history>${message.role}\n${message.content}</history>`).join("\n\n")
  const lastMessage = `<current_question>${chat[chat.length - 1].role}\n${chat[chat.length - 1].content}</current_question>`

  return [history, lastMessage].join("\n\n");
}

function addMessageToChat(chat: ChatBase, message: MessageBase) {
  return [...chat, message];
}


function trasnfromRawItemInCartToNewItemInCart(item: any): ItemInCart {
  const newItemInCart: ItemInCart = {
    name: item.name,
    description: item.name,
    type: 'coffee',
    basePrice: Number(item.price),
    options: {},
    quantity: 1,
    optionsSelected: {},
    hash: "",
  };

  if (item.cup) {
    newItemInCart.options = {
      cup: [
        {
          name: item.cup,
          addPrice: 0,
        },
      ],
    };

    newItemInCart.optionsSelected = {
      cup: {
        name: item.cup,
        addPrice: 0,
      },
    };
  }

  if (item.sugar) {
    newItemInCart.options = {
      sugar: [
        {
          name: item.sugar,
          addPrice: 0,
        },
      ],
    };

    newItemInCart.optionsSelected = {
      sugar: {
        name: item.sugar,
        addPrice: 0,
      },
    };
  }

  if (item.ice) {
    newItemInCart.options = {
      temperature: [
        {
          name: item.ice,
          addPrice: 0,
        },
      ],
    };

    newItemInCart.optionsSelected = {
      temperature: {
        name: item.ice,
        addPrice: 0,
      },
    };
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

    console.log(queryText);

    const responseData = await response.json();
    console.log(responseData);

    const messageFromBackend: MessageBase = {
      role: "ai",
      content: responseData.response.content,
    };

    const itemsInChatFromBackend: ItemInCart[] = responseData.orderInfo.map(
      (item: any) => trasnfromRawItemInCartToNewItemInCart(item)
    );

    console.log(itemsInChatFromBackend);
    // DEBUG
    // const messageFromBackend: MessageBase = {
    //   role: "ai",
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
            role: "ai",
            content: "服务器错误，请稍后再试",
          },
        ],
        itemsInChat: [],
      }),
      { status: 500 }
    );
  }
}
