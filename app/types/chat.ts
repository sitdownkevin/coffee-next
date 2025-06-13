import type { ItemInCart } from "./item";

export interface MessageBase {
  role: "system" | "human" | "assistant";
  content: string;
}

export type ChatBase = MessageBase[];

export enum ChatStatusEnum {
  Inputting = "inputting",
  Pending = "pending",
  AsrProcessing = "asr_processing",
  NlpProcessing = "nlp_processing",
  Completed = "completed",
}


export type ChatStatus = ChatStatusEnum;


export interface ChatResponse {
  chat: ChatBase;
  itemsInChat: ItemInCart[];
}