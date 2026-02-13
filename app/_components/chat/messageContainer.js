"use client";
import { useState } from "react";
export default function MessageContainer({ setMessages }) {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim() !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputValue, sender: "self" },
      ]);
      setInputValue("");
    }
  };

  return (
    <>
      <div className="flex gap-2 bg-gray-400 p-5">
        <input
          type="text"
          placeholder="Type your message here"
          className="input flex-1"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />
        <button className="btn btn-neutral" onClick={handleSend}>
          Send
        </button>
      </div>
    </>
  );
}
