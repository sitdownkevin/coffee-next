import { type ActionFunctionArgs } from "react-router";
import type { ChatBase, MessageBase } from "~/types/chat";

export async function action({ request }: ActionFunctionArgs) {
  // 仅允许POST请求
  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }

  const body = await request.json();
  const data: ChatBase = body as ChatBase;

  const queryText = data.messages
    .map((message: MessageBase) => `${message.role}\n${message.content}`)
    .join("\n");

  try {
    // const response = await fetch('http://106.14.161.78:65000/api/coffee', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     question: queryText
    //   })
    // });

    // const responseData = await response.json();
    const responseData = {
      orderInfo: [
        {
          cup: "中杯",
          name: "卡布奇诺",
          price: "20",
          sugar: "少甜",
          temperature: "冰",
        },
        {
          cup: "中杯",
          name: "拿铁",
          price: "20",
          sugar: "少甜",
          temperature: "冰",
        },
      ],
      response: {
        content: "你好！以下是您的订单信息：如果还有其他需求，请随时告诉我！",
        role: "ai",
      },
    };
    console.log(responseData);

    return new Response(
      JSON.stringify({
        message: responseData.response,
        orderInfo: responseData.orderInfo,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: {
          role: "ai",
          content: "服务器错误，请稍后再试",
        },
        orderInfo: [],
      }),
      { status: 500 }
    );
  }
}
