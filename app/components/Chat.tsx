import { useEffect, useRef, useState } from "react";

import type { ChatBase, MessageBase } from "~/types/chat";
import type { ItemInCart } from "~/types/item";

import ChatCartoon from "~/components/Three/ChatCartoon";
import ChatContainer from "~/components/Assistant/ChatContainer";
import ChatInput from "~/components/Assistant/ChatInput";

import { ChatStatusEnum } from "~/types/chat";
import type { ChatStatus } from "~/types/chat";

export default function Chat({
  handleAddToCart,
}: {
  handleAddToCart: (itemInCart: ItemInCart) => void;
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
    { role: "human", content: "我想要点一杯冰的卡布奇诺和冰的拿铁" },
    {
      role: "ai",
      content: "你想要加冰嘛？",
    },
    { role: "human", content: "加冰" },
    {
      role: "ai",
      content: "你想要加糖嘛？",
    },
    { role: "human", content: "加糖" },
    {
      role: "ai",
      content: "你想要加糖嘛？",
    },
    { role: "human", content: "加糖" },
    {
      role: "ai",
      content: "你想要加糖嘛？",
    },
    { role: "human", content: "加糖" },
    {
      role: "ai",
      content: "你想要加糖嘛？",
    },
    { role: "human", content: "加糖" },
    {
      role: "ai",
      content: "你想要加糖嘛？",
    },
    { role: "human", content: "加糖" },
    {
      role: "ai",
      content: "你想要加糖嘛？",
    },
    { role: "human", content: "加糖" },
  ]);

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
    fetchChat(chat);
  }, []);

  return (
    <>
      <div className="hidden md:flex flex-row h-full bg-white border-l-gray-500">
        <div className="w-1/3 h-full">
          <ChatCartoon chatStatus={chatStatus} />
        </div>
        <div className="w-2/3 h-full flex flex-col">
          <ChatContainer
            chat={chat}
            chatStatus={chatStatus}
            itemsInChat={itemsInChat}
            handleAddToCart={handleAddToCart}
          />
          <ChatInput chatStatus={chatStatus} setChatStatus={setChatStatus} />
        </div>
      </div>
      <div className="flex md:hidden flex-row h-full bg-white border-l-gray-500">
      <div className="w-full h-full flex flex-col">
        <ChatContainer
          chat={chat}
          chatStatus={chatStatus}
          itemsInChat={itemsInChat}
          handleAddToCart={handleAddToCart}
        />
        <ChatInput chatStatus={chatStatus} setChatStatus={setChatStatus} />
      </div>
    </div>
    </>
  );
}
