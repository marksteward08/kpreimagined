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
      <div className="grid grid-cols-6 gap-2 bg-gray-400 p-5">
        <input
          type="text"
          placeholder="Type your message here"
          className="input col-span-5 sm:col-span-4 w-full"
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
        <button
          className="btn btn-warning col-span-full sm:col-span-1"
          onClick={handleSend}
        >
          End
        </button>
      </div>
    </>
  );
}
