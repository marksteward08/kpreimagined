"use client";
import { createContext, useContext, useState } from "react";

// Chat Store Context
const ChatStoreContext = createContext();

export function ChatStoreProvider({ children }) {
  const [action, setAction] = useState("home");

  return (
    <ChatStoreContext.Provider value={{ action, setAction }}>
      {children}
    </ChatStoreContext.Provider>
  );
}

export function useChatStore() {
  const context = useContext(ChatStoreContext);
  if (!context) {
    throw new Error("useChatStore must be used within ChatStoreProvider");
  }
  return context;
}

// User Info Context
const UserInfoContext = createContext();

export function UserInfoProvider({ children }) {
  const [userInfo, setUserInfo] = useState({
    username: "",
    imageUrl: "",
  });

  return (
    <UserInfoContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserInfoContext.Provider>
  );
}

export function useUserinfo() {
  const context = useContext(UserInfoContext);
  if (!context) {
    throw new Error("useUserinfo must be used within UserInfoProvider");
  }
  return context;
}

// Chat Messages Context
const ChatMessagesContext = createContext();

export function ChatMessagesProvider({ children }) {
  const [messages, setMessages] = useState([
    {
      message: "Hello, how can I help you?",
      from: "bot",
    },
  ]);

  const addMessage = (message) => {
    setMessages((state) => [...state, message]);
  };

  return (
    <ChatMessagesContext.Provider value={{ messages, addMessage }}>
      {children}
    </ChatMessagesContext.Provider>
  );
}

export function useChatMessages() {
  const context = useContext(ChatMessagesContext);
  if (!context) {
    throw new Error("useChatMessages must be used within ChatMessagesProvider");
  }
  return context;
}

// Room ID Context
const RoomIdContext = createContext();

export function RoomIdProvider({ children }) {
  const [roomId, setRoomId] = useState(null);

  return (
    <RoomIdContext.Provider value={{ roomId, setRoomId }}>
      {children}
    </RoomIdContext.Provider>
  );
}

export function useRoomId() {
  const context = useContext(RoomIdContext);
  if (!context) {
    throw new Error("useRoomId must be used within RoomIdProvider");
  }
  return context;
}
