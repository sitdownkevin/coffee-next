import { useEffect, useRef, useState } from "react";

import { ChatStatusEnum } from "~/types/chat";
import type { ChatStatus } from "~/types/chat";
import type { ChatBase } from "~/types/chat";
import type { ItemInCart } from "~/types/item";

import ChatCartoon from "~/components/Three/ChatCartoon";
import ChatContainer from "~/components/Assistant/ChatContainer";
import ChatInput from "~/components/Assistant/ChatInput";


export default function Chat({
  handleAddToCart,
  mode,
  setMode,
}: {
  handleAddToCart: (itemInCart: ItemInCart) => void;
  mode: "chat" | "text";
  setMode: (mode: "chat" | "text") => void;
}) {
  const [chatStatus, setChatStatus] = useState<ChatStatus>(
    ChatStatusEnum.Completed
  );

  const [itemsInChat, setItemsInChat] = useState<ItemInCart[]>([]);

  const [chat, setChat] = useState<ChatBase>([
    {
      role: "system",
      content: "你好，我是你的咖啡助手，有什么可以帮助你的？",
    },
  ]);


  const fetchRecommendation = async (chat: ChatBase) => {
    const response = await fetch("/api/recommendation", {
      method: "POST",
      body: JSON.stringify(chat),
    });
    const data = await response.json();
    setChat(data.chat);
    setItemsInChat(data.itemsInChat);
  };

  const fetchChat = async (chat: ChatBase) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify(chat),
    });
    const data = await response.json();
    setChat(data.chat);
    setItemsInChat(data.itemsInChat);
  };

  useEffect(() => {
    fetchRecommendation(chat);
  }, []);

  useEffect(() => {
    if (chatStatus === ChatStatusEnum.Pending) {
      setChatStatus(ChatStatusEnum.NlpProcessing);
      fetchChat(chat).finally(() => {
        setChatStatus(ChatStatusEnum.Completed);
      });
    }
  }, [chatStatus, chat]);


  return (
    <>
      {/* 电脑端 */}
      <div className="hidden md:flex flex-row h-full bg-white border-l-gray-500">
        <div className="w-full h-full flex flex-col">
          <ChatContainer
            chat={chat}
            chatStatus={chatStatus}
            itemsInChat={itemsInChat}
            handleAddToCart={handleAddToCart}
          />
          <ChatInput 
            chat={chat}
            setChat={setChat}
            chatStatus={chatStatus} 
            setChatStatus={setChatStatus}
            setItemsInChat={setItemsInChat}
          />
        </div>
      </div>

      
      {/* 移动端 */}
      <div className="flex md:hidden flex-row h-full bg-white border-l-gray-500">
        <div className="w-full h-full flex flex-col">
          <ChatContainer
            chat={chat}
            chatStatus={chatStatus}
            itemsInChat={itemsInChat}
            handleAddToCart={handleAddToCart}
          />
          <ChatInput 
            chat={chat}
            setChat={setChat}
            chatStatus={chatStatus} 
            setChatStatus={setChatStatus}
            setItemsInChat={setItemsInChat}
          />
        </div>
      </div>
    </>
  );
}
