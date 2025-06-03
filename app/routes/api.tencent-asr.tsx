import { type ActionFunctionArgs } from "react-router";

// 引入腾讯云SDK
import tencentcloud from "tencentcloud-sdk-nodejs-asr";
const AsrClient = tencentcloud.asr.v20190614.Client;

// 腾讯云配置 - 在实际使用时，请将密钥放在环境变量中
const clientConfig = {
  credential: {
    // 从环境变量读取密钥，如果没有则使用默认值（用于测试）
    secretId: process.env.TENCENT_SECRET_ID || "SecretId",
    secretKey: process.env.TENCENT_SECRET_KEY || "SecretKey",
  },
  region: process.env.TENCENT_REGION || "ap-beijing", // 从环境变量读取地域
  profile: {
    httpProfile: {
      endpoint: "asr.tencentcloudapi.com",
    },
  },
};

// 实例化ASR客户端
const client = new AsrClient(clientConfig);

// 根据文件类型确定音频格式
function getVoiceFormat(audioType: string): string {
  if (audioType.includes('webm')) {
    return 'webm';
  } else if (audioType.includes('mp4') || audioType.includes('m4a')) {
    return 'm4a';
  } else if (audioType.includes('wav')) {
    return 'wav';
  } else if (audioType.includes('mp3')) {
    return 'mp3';
  } else if (audioType.includes('flac')) {
    return 'flac';
  }
  return 'wav'; // 默认格式
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }

  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;
    
    if (!audioFile) {
      return new Response(JSON.stringify({ 
        error: "缺少音频文件" 
      }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    console.log('收到音频文件:', {
      name: audioFile.name,
      size: audioFile.size,
      type: audioFile.type
    });

    // 检查文件大小（腾讯云ASR有大小限制）
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (audioFile.size > maxSize) {
      return new Response(JSON.stringify({
        error: "音频文件过大",
        message: `文件大小不能超过5MB，当前文件大小：${Math.round(audioFile.size / 1024 / 1024 * 100) / 100}MB`
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 将音频文件转换为base64
    const audioBuffer = await audioFile.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');
    
    // 根据音频类型确定格式
    const voiceFormat = getVoiceFormat(audioFile.type);
    
    // 调用腾讯云ASR服务
    const params = {
      "EngSerViceType": "16k_zh", // 16k中文普通话通用
      "SourceType": 1, // 音频数据
      "VoiceFormat": voiceFormat,
      "Data": audioBase64,
      "DataLen": audioBuffer.byteLength
    };

    console.log('调用腾讯云ASR服务...', {
      format: voiceFormat,
      dataLength: audioBuffer.byteLength,
      serviceType: "16k_zh"
    });
    
    const data = await client.SentenceRecognition(params);
    
    console.log('腾讯云ASR返回结果:', data);
    
    // 提取识别结果
    const recognizedText = data.Result || '';
    
    if (!recognizedText) {
      return new Response(JSON.stringify({
        success: false,
        error: "未能识别出语音内容",
        message: "可能原因：音频质量较低、语音不清晰或音频格式不兼容",
        originalResponse: data
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      text: recognizedText,
      audioInfo: {
        format: voiceFormat,
        size: audioBuffer.byteLength,
        duration: data.AudioDuration || 0
      },
      originalResponse: data,
      processedAt: new Date().toISOString()
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('腾讯云ASR调用失败:', error);
    
    // 解析错误信息
    let errorMessage = "语音识别服务调用失败";
    let errorDetails = "";
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // 处理常见的腾讯云错误
      if (error.message.includes('InvalidParameter')) {
        errorMessage = "参数错误：音频格式可能不支持";
        errorDetails = "请确保音频格式为WAV、MP3、M4A等支持的格式";
      } else if (error.message.includes('AuthFailure')) {
        errorMessage = "认证失败：请检查腾讯云密钥配置";
        errorDetails = "请确保TENCENT_SECRET_ID和TENCENT_SECRET_KEY配置正确";
      } else if (error.message.includes('RequestLimitExceeded')) {
        errorMessage = "请求频率限制：请稍后再试";
        errorDetails = "腾讯云ASR服务有频率限制，请等待片刻后重试";
      }
    }
    
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
      details: errorDetails,
      message: error instanceof Error ? error.message : "未知错误"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
} 