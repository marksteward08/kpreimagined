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

export { useChatStore, useUserinfo };
