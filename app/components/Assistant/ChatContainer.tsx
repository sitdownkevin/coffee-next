import { useEffect } from "react";
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
}: {
  chat: ChatBase;
  chatStatus: ChatStatus;
  itemsInChat: ItemInCart[];
  handleAddToCart: (itemInCart: ItemInCart) => void;
}) {
  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
      {Array.from(chat).map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}

      <ChatStatusMessage chatStatus={chatStatus} />

      {itemsInChat.length > 0 && (
        <OrderPreview
          itemsInChat={itemsInChat}
          handleAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}
