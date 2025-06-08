import { type ActionFunctionArgs } from "react-router";

import tencentcloud from "tencentcloud-sdk-nodejs-tts";
const TtsClient = tencentcloud.tts.v20190823.Client;

const clientConfig = {
  credential: {
    secretId: process.env.TENCENT_SECRET_ID || "SecretId",
    secretKey: process.env.TENCENT_SECRET_KEY || "SecretKey",
  },
  region: "",
  profile: {
    httpProfile: {
      endpoint: "tts.tencentcloudapi.com",
    },
  },
};

// 实例化TTS客户端
const client = new TtsClient(clientConfig);


export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }

  try {
    const formData = await request.json();
    const text = formData.text;
    const sessionId = formData.sessionId;

    const params = {
      Text: text,
      SessionId: sessionId,
    };

    // console.log(params);

    const data = await client.TextToVoice(params);
    const audio = data.Audio;

    return new Response(JSON.stringify({ 
      success: true,
      data: {
        audio: audio,
      }
     }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
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