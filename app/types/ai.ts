export interface LLMInput {
    question: string;
}


export interface LLMResponse {
  llmResponse: {
    aiResponse: string;
    aiResponseTime: string;
  };
  orderInfo: {
    name: string;
    price: string;
    cup: string;
    temperature: string;
    sugar: string;
  };
}


export interface MessageBase {
  role: "system" | "human" | "ai";
  content: string;
}


export interface ChatBase {
  messages: MessageBase[];  
}