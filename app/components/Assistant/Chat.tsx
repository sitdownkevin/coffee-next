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
  interactionMode,
  setInteractionMode,
  chat,
  setChat,
  itemsInChat,
  setItemsInChat,
}: {
  handleAddToCart: (itemInCart: ItemInCart) => void;
  interactionMode: "chat" | "text";
  setInteractionMode: (interactionMode: "chat" | "text") => void;
  chat: ChatBase;
  setChat: (chat: ChatBase) => void;
  itemsInChat: ItemInCart[];
  setItemsInChat: (itemsInChat: ItemInCart[]) => void;
}) {
  const [chatStatus, setChatStatus] = useState<ChatStatus>(
    ChatStatusEnum.Completed
  );
  const [isSpeaking, setIsSpeaking] = useState(false);

  const playText = async (text: string) => {
    if (!text) return;
    setIsSpeaking(true);
    try {
      const response = await fetch("/api/tencent-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text,
          sessionId: Date.now().toString(),
        }),
      });
      if (!response.ok) throw new Error("TTS request failed");

      const data = await response.json();
      if (data.success) {
        const audioData = data.data.audio;
        console.log("audioData", audioData);
        const audioBlob = new Blob(
          [Uint8Array.from(atob(audioData), (c) => c.charCodeAt(0))],
          { type: "audio/wav" }
        );
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioElement = new Audio(audioUrl);

        await audioElement.play();

        audioElement.onended = () => {
          URL.revokeObjectURL(audioUrl);
          setIsSpeaking(false);
        };
      }
    } catch (error) {
      console.error("TTS error:", error);
      setIsSpeaking(false);
    }
  };

  const fetchRecommendation = async (chat: ChatBase) => {
    const response = await fetch("/api/recommendation", {
      method: "POST",
      body: JSON.stringify(chat),
    });
    const data = await response.json();
    console.log("data", data);
    if (data.success) {
      console.log("data.data.chat", data.data.chat);
      console.log("data.data.itemsInChat", data.data.itemsInChat);
      setChat(data.data.chat);
      setItemsInChat(data.data.itemsInChat);
    }
  };

  const fetchChat = async (chat: ChatBase) => {
    const response = await fetch("/api/langchain-chat-qwen", {
      method: "POST",
      body: JSON.stringify({
        chat: chat,
      }),
    });
    const data = await response.json();
    if (data.success) {
      setChat(data.data.chat);
      setItemsInChat(data.data.itemsInChat);
    }
    return data;
  };

  useEffect(() => {
    if (chat.length === 1 && chat[0].role === "system") {
      setChatStatus(ChatStatusEnum.NlpProcessing);
      fetchRecommendation(chat).finally(() => {
        setChatStatus(ChatStatusEnum.Completed);
      });
    }
  }, []);

  useEffect(() => {
    if (chatStatus === ChatStatusEnum.Pending) {
      setChatStatus(ChatStatusEnum.NlpProcessing);
      fetchChat(chat)
        .then((data) => {
          if (interactionMode === "chat") {
            const lastMessage = data.data.chat[data.data.chat.length - 1];
            if (
              lastMessage &&
              (lastMessage.role === "assistant" ||
                lastMessage.role === "system")
            ) {
              console.log("lastMessage", lastMessage);
              playText(lastMessage.content);
            }
          }
        })
        .finally(() => {
          setChatStatus(ChatStatusEnum.Completed);
        });
    }
  }, [chatStatus, chat]);

  return (
    <>
      {/* 电脑端 */}
      <div className="hidden md:flex flex-row h-full bg-white border-l-gray-500">
        <div className="w-full h-full flex flex-col">
          <ChatCartoon chatStatus={chatStatus} isSpeaking={isSpeaking} />
          <ChatContainer
            chat={chat}
            chatStatus={chatStatus}
            itemsInChat={itemsInChat}
            handleAddToCart={handleAddToCart}
            interactionMode={interactionMode}
            setInteractionMode={setInteractionMode}
          />
          <ChatInput
            chat={chat}
            setChat={setChat}
            chatStatus={chatStatus}
            setChatStatus={setChatStatus}
            setItemsInChat={setItemsInChat}
            interactionMode={interactionMode}
          />
        </div>
      </div>

      {/* 移动端 */}
      <div className="flex md:hidden flex-row h-full bg-white border-l-gray-500">
        <div className="w-full h-full flex flex-col">
          <ChatCartoon chatStatus={chatStatus} isSpeaking={isSpeaking} />
          <ChatContainer
            chat={chat}
            chatStatus={chatStatus}
            itemsInChat={itemsInChat}
            handleAddToCart={handleAddToCart}
            interactionMode={interactionMode}
            setInteractionMode={setInteractionMode}
          />
          <ChatInput
            chat={chat}
            setChat={setChat}
            chatStatus={chatStatus}
            setChatStatus={setChatStatus}
            setItemsInChat={setItemsInChat}
            interactionMode={interactionMode}
          />
        </div>
      </div>
    </>
  );
}
