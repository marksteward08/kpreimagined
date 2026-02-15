"use client";
import { useEffect } from "react";
import { FidgetSpinner } from "react-loader-spinner";
import { io } from "socket.io-client";

export default function LookingForChatMate() {
  return (
    <>
      {/* center this X,Y */}
      <div className="flex items-center justify-center h-screen gap-2 flex-col">
        <FidgetSpinner
          visible={true}
          height="80"
          width="80"
          ariaLabel="fidget-spinner-loading"
          wrapperClass="fidget-spinner-wrapper"
          backgroundColor="black"
          ballColors={["#000", "#000", "#000"]}
        />
        {/* <p className="text-md mt-4">Finding you a stranger to talk to...</p> */}
      </div>
    </>
  );
}
