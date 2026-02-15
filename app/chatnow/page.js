"use client";
import { useEffect } from "react";
import ChatContainer from "../_components/chat/chatContainer";
import LookingForChatMate from "../_components/lookingForChatMate";
import { useRoomId } from "../state/context";
import { io } from "socket.io-client";

export default function Page() {
  const { roomId, setRoomId } = useRoomId();

  useEffect(() => {
    const socket = io("http://100.111.219.117:3001", { autoConnect: true });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("paired", (data) => {
      // add the data.roomId to local storage
      localStorage.setItem("roomId", data.roomId);
      // set the roomId in context
      setRoomId(data.roomId);
      console.log("Paired with:", data);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    // add any additional listeners here
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [setRoomId]);

  return (
    <>
      <div className="max-w-6xl mx-auto">
        {roomId ? <ChatContainer /> : <LookingForChatMate />}
      </div>
    </>
  );
}
