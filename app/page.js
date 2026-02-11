"use client";
import { useChatStore } from "./state/context";
import Hero from "./_components/hero";
import UploadImage from "./_components/uploadImage";

export default function Home() {
  const { action } = useChatStore();
  return (
    <>
      <div className="w-full px-2 h-[100dvh] flex flex-col items-center gap-20 justify-center">
        {action === "home" && <Hero />}
        {action === "uploadImage" && <UploadImage />}
      </div>
    </>
  );
}
