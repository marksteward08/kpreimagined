import ChatContainer from "../_components/chat/chatContainer";
import Loading from "../_components/loading";
export default function Page() {
  return (
    <>
      <div className="max-w-6xl mx-auto">
        {/* <Loading /> */}
        <ChatContainer />
      </div>
    </>
  );
}
