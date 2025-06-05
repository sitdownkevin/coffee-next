export interface MessageBase {
  role: "system" | "human" | "ai";
  content: string;
}

export interface ChatBase {
  messages: MessageBase[];  
}

export enum ChatStatusEnum {
  Inputting = "inputting",
  Thinking = "thinking",
  Completed = "completed",
}

export type ChatStatus = ChatStatusEnum;