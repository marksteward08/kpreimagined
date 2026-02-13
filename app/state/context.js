// zustand
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useChatStore = create(
  devtools(
    (set) => ({
      action: "home",
      setAction: (action) => set({ action }),
    }),
    { name: "ChatStore" },
  ),
);

const useUserinfo = create(
  devtools(
    (set) => ({
      userInfo: {
        username: "",
        imageUrl: "",
      },
      setUserInfo: (userInfo) => set({ userInfo }),
    }),
    { name: "UserInfoStore" },
  ),
);

//message format
// {
//   message
//   from
// }
const chatMessagesStore = create(
  devtools(
    (set) => ({
      messages: [
        {
          message: "Hello, how can I help you?",
          from: "bot",
        },
      ],
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
    }),
    { name: "ChatMessagesStore" },
  ),
);

export { useChatStore, useUserinfo, chatMessagesStore };
