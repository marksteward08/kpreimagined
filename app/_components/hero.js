import { useChatStore } from "../state/context";

export default function Hero() {
  const { setAction } = useChatStore();
  return (
    <>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-center">
        Talk to strangers.
        <br />
        Stay curious
      </h1>
      <div className="max-w-xl w-full mx-auto space-y-3 lg:space-y-6">
        <div className="chat chat-start animate-fade-right animate-delay-100">
          <div className="chat-image avatar"></div>
          <div className="chat-bubble shadow-md">
            What kind of nonsense is this
          </div>
        </div>

        <div className="chat chat-end animate-fade-left animate-delay-200">
          <div className="chat-image avatar"></div>
          <div className="chat-bubble chat-bubble-neutral shadow-md">
            Calm down, Anakin. It&apos;s just a demo.
          </div>
        </div>

        <div className="chat chat-start animate-fade-right animate-delay-300">
          <div className="chat-image avatar"></div>
          <div className="chat-bubble shadow-md">
            That&apos;s never been done in the history of the Jedi.
          </div>
        </div>

        <div className="chat chat-end animate-fade-left animate-delay-400">
          <div className="chat-image avatar"></div>
          <div className="chat-bubble chat-bubble-neutral shadow-md">
            You have been given a great honor to be on the Council.
          </div>
        </div>
      </div>
      <button
        onClick={(e) => setAction("uploadImage")}
        className="btn not-hover:btn-neutral hover:btn-soft rounded-xl"
      >
        START CHATTING
      </button>
    </>
  );
}
