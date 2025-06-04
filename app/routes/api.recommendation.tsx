import { type ActionFunctionArgs } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  // 仅允许POST请求
  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await request.json();
    const { timestamp, browser } = body;

    console.log('请求咖啡推荐:', {
      timestamp,
      browser: browser || 'unknown'
    });

    // 调用后端推荐API
    const response = await fetch('http://106.14.161.78:65000/api/coffeeprefer', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    console.log('后端推荐数据:', data);
    
    // 处理后端返回的数据
    if (data.llmResponse && data.orderInfo) {
      const orderInfo = data.orderInfo;
      const aiResponseText = typeof data.llmResponse === 'string' 
        ? data.llmResponse 
        : data.llmResponse.aiResponse || data.llmResponse;

      // 构建推荐咖啡项目
      const recommendedCoffee = {
        name: orderInfo.name || '咖啡',
        price: parseFloat(orderInfo.price) || 0,
        size: orderInfo.cup || '中杯',
        temperature: orderInfo.temperature || '热',
        sugar: orderInfo.sugar || '正常糖',
        quantity: 1
      };

      return new Response(JSON.stringify({
        success: true,
        isRecommendation: true,
        response: aiResponseText,
        recommendation: recommendedCoffee,
        orderInfo: {
          items: [recommendedCoffee],
          totalAmount: recommendedCoffee.price,
          totalQuantity: 1
        },
        browser: browser || 'unknown',
        processedAt: new Date().toISOString()
      }), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // 如果后端没有返回预期数据，使用默认推荐
    const defaultRecommendation = {
      name: "招牌拿铁",
      price: 28,
      size: "中杯",
      temperature: "热",
      sugar: "微糖",
      quantity: 1
    };

    return new Response(JSON.stringify({
      success: true,
      isRecommendation: true,
      response: `今日推荐：${defaultRecommendation.name}！精选阿拉比卡豆配制，${defaultRecommendation.size}/${defaultRecommendation.temperature}/${defaultRecommendation.sugar}，现在只要¥${defaultRecommendation.price}。这是我们店里的招牌饮品，口感香醇顺滑，很受顾客喜爱呢～`,
      recommendation: defaultRecommendation,
      processedAt: new Date().toISOString()
    }), {
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error('获取推荐咖啡时出错:', error);
    
    // 发生错误时使用默认推荐
    const fallbackRecommendation = {
      name: "招牌拿铁",
      price: 28,
      size: "中杯",
      temperature: "热",
      sugar: "微糖",
      quantity: 1
    };

    return new Response(JSON.stringify({
      success: true,
      isRecommendation: true,
      response: `今日推荐：${fallbackRecommendation.name}！精选阿拉比卡豆配制，${fallbackRecommendation.size}/${fallbackRecommendation.temperature}/${fallbackRecommendation.sugar}，现在只要¥${fallbackRecommendation.price}。这是我们店里的招牌饮品，口感香醇顺滑，很受顾客喜爱呢～`,
      recommendation: fallbackRecommendation,
      processedAt: new Date().toISOString()
    }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
} 