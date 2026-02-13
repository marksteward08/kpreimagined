"use client";

import { useState } from "react";
import ChatBubbleStart from "./chatBubbleStart";
import ChatBubbleEnd from "./chatBubbleEnd";
import AvatarReveal from "./avatarReveal";
import MessageContainer from "./messageContainer";

export default function ChatContainer() {
  const [messages, setMessages] = useState([
    { text: "Hello! How are you?", sender: "other" },
    { text: "I'm good, thanks! How about you?", sender: "self" },
  ]);
  return (
    <>
      <div className="w-full h-dvh flex flex-col justify-between ">
        <div className="bg-neutral w-full p-5">
          <small className="text-gray-300 text-center block">Say👋 to:</small>
          <h2 className="text-white text-center font-semibold text-xl">
            Chatmate Username
          </h2>
        </div>

        <div className="flex flex-col flex-1 gap-1 sm:gap-2 overflow-x-hidden overflow-y-auto">
          {messages.map((prev, index) => {
            if (prev.sender === "self") {
              return <ChatBubbleEnd key={index} text={prev.text} />;
            } else if (prev.sender === "other") {
              return <ChatBubbleStart key={index} text={prev.text} />;
            }
          })}
        </div>
        <MessageContainer setMessages={setMessages} />
      </div>
    </>
  );
}
