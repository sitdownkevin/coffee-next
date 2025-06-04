import { type ActionFunctionArgs } from "react-router";



export async function action({ request }: ActionFunctionArgs) {
  // 仅允许POST请求
  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await request.json();
    const { text, timestamp, browser } = body;

    // 验证输入
    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: '无效的语音文本' }), { 
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    console.log('收到语音识别结果:', {
      text,
      timestamp,
      browser: browser || 'unknown',
      length: text.length
    });

    // 调用后端API
    const response = await fetch('http://106.14.161.78:65000/api/coffee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: text
      })
    });

    const data = await response.json();

    console.log(data);
    
    // 处理后端返回的数据
    if (data.llmResponse) {
      const orderInfo = data.orderInfo || {};
      const isOrder = !!orderInfo.cup; // 如果返回了orderInfo，说明是一个订单
      const aiResponseText = typeof data.llmResponse === 'string' ? data.llmResponse : data.llmResponse.aiResponse;

      if (isOrder) {
        // 构建购物车项目
        const cartItem = {
          name: orderInfo.name || '咖啡',
          price: parseFloat(orderInfo.price) || 0,
          size: orderInfo.cup || '中杯',
          temperature: orderInfo.temperature || '热',
          sugar: orderInfo.sugar || '正常糖',
          quantity: 1,
          totalPrice: parseFloat(orderInfo.price) || 0,
          addedAt: new Date().toISOString()
        };

        return new Response(JSON.stringify({
          success: true,
          isOrder: true,
          response: aiResponseText,
          originalText: text,
          orderInfo: {
            items: [cartItem],
            totalAmount: cartItem.totalPrice,
            totalQuantity: 1
          },
          actions: {
            openCart: true,
            showConfirmDialog: false
          },
          browser: browser || 'unknown',
          processedAt: new Date().toISOString()
        }), {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      // 非订单响应
      return new Response(JSON.stringify({
        success: true,
        isOrder: false,
        response: aiResponseText,
        originalText: text,
        browser: browser || 'unknown',
        processedAt: new Date().toISOString()
      }), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // 处理错误响应
    return new Response(JSON.stringify({ 
      error: '服务器响应无效',
      message: '无法处理服务器返回的数据'
    }), { 
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error('处理语音请求时出错:', error);
    return new Response(JSON.stringify({ 
      error: '服务器内部错误',
      message: '处理语音请求时出现问题，请稍后重试'
    }), { 
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
} 