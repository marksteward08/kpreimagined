"use client";
import {
  ChatStoreProvider,
  UserInfoProvider,
  ChatMessagesProvider,
  RoomIdProvider,
} from "./state/context";

export function Providers({ children }) {
  return (
    <ChatStoreProvider>
      <UserInfoProvider>
        <ChatMessagesProvider>
          <RoomIdProvider>{children}</RoomIdProvider>
        </ChatMessagesProvider>
      </UserInfoProvider>
    </ChatStoreProvider>
  );
}
