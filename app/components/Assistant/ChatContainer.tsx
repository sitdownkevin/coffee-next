import type { ChatBase, MessageBase } from "~/types/chat";
import type { ItemInCart } from "~/types/item";

import OrderPreview from "~/components/Assistant/OrderPreview";

import type { ChatStatus } from "~/types/chat";
import { ChatStatusEnum } from "~/types/chat";

export default function ChatContainer({
    chat,
    chatStatus,
    itemsInChat,
  }: {
    chat: ChatBase;
    chatStatus: ChatStatus;
    itemsInChat: ItemInCart[];
  }) {
    return (
      <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
        {chat.messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "human" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`
                          max-w-[80%] rounded-lg px-4 py-2
                          ${
                            message.role === "human"
                              ? "bg-blue-500 text-white rounded-br-none"
                              : "bg-gray-100 text-gray-800 rounded-bl-none"
                          }
                      `}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        {chatStatus === ChatStatusEnum.Thinking && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100 text-gray-800 rounded-bl-none">
              <div className="flex items-center space-x-1">
                <p className="text-sm">正在思考</p>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
  
        {itemsInChat.length > 0 && (
          <div className="flex justify-start">
            <div className="max-w-[80%]">
              <OrderPreview />
            </div>
          </div>
        )}
      </div>
    );
  }