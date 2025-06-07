import { useEffect, useRef } from "react";
import type { ChatBase } from "~/types/chat";
import type { ItemInCart } from "~/types/item";

import { ChatMessage, ChatStatusMessage } from "~/components/Assistant/ChatMessage";
import { OrderPreview } from "~/components/Assistant/OrderPreview";

import type { ChatStatus } from "~/types/chat";

export default function ChatContainer({
  chat,
  chatStatus,
  itemsInChat,
  handleAddToCart,
  interactionMode,
  setInteractionMode,
}: {
  chat: ChatBase;
  chatStatus: ChatStatus;
  itemsInChat: ItemInCart[];
  handleAddToCart: (itemInCart: ItemInCart) => void;
  interactionMode: "chat" | "text";
  setInteractionMode: (interactionMode: "chat" | "text") => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatStatus]);

  return (
    <div
      ref={scrollRef}
      className="flex flex-col gap-4 p-4 overflow-y-auto h-full"
    >
      {interactionMode === "text"
        ? Array.from(chat).map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))
        : null}

      <ChatStatusMessage chatStatus={chatStatus} />

      {itemsInChat.length > 0 && (
        <OrderPreview
          itemsInChat={itemsInChat}
          handleAddToCart={handleAddToCart}
        />
      )}

      {interactionMode === 'chat' && itemsInChat.length === 0 && (
        <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
          <div>TODO</div>
        </div>
      )}
    </div>
  );
}
