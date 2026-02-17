"use client";
import { useEffect, useRef } from "react";
import ChatContainer from "../_components/chat/chatContainer";
import LookingForChatMate from "../_components/lookingForChatMate";
import { useRoomId } from "../state/context";
import { io } from "socket.io-client";
import localforage from "localforage";
import { SOCKET_URL } from "../constants";

export default function Page() {
  const { roomId, setRoomId } = useRoomId();
  const socketRef = useRef(null);

  useEffect(() => {
    const setup = async () => {
      // 1. Load roomId FIRST
      const storedRoomId = await localforage.getItem("roomId");

      let isRoomValid = false;

      // 2. Check if valid
      if (storedRoomId) {
        try {
          const response = await fetch(
            `${SOCKET_URL}/check-room/${storedRoomId}`,
          );
          const data = await response.json();

          if (data.isActive) {
            isRoomValid = true;
            setRoomId(storedRoomId);
          } else {
            await localforage.removeItem("roomId");
          }
        } catch (error) {
          console.error("Error checking room:", error);
        }
      }

      // 3. Create socket AFTER checking
      const socket = io(SOCKET_URL, {
        autoConnect: true,
        auth: {
          roomId: isRoomValid ? storedRoomId : null,
          reconnect: isRoomValid ? true : false,
        },
      });

      socketRef.current = socket;

      // 4. Listeners
      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
      });

      socket.on("paired", async (data) => {
        await localforage.setItem("roomId", data.roomId);
        sessionStorage.setItem("roomId", data.roomId);
        setRoomId(data.roomId);

        console.log("Paired with:", data);
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });
    };

    setup();

    // 5. Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [setRoomId]);

  return (
    <div className="max-w-6xl mx-auto">
      {roomId ? <ChatContainer /> : <LookingForChatMate />}
    </div>
  );
}
