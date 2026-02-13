export default function AvatarReveal() {
  return (
    <>
      <div className="bg-gray-100 py-5">
        <p className="text-center mb-5 text-2xl font-bold">
          Look who it is.. 😏
        </p>
        <div className="flex justify-center ">
          <img
            src="https://picsum.photos/200"
            className="size-43 sm:size-60 md:size-70 bg-black rounded-full relative left-5 border-2 border-black "
          ></img>
          <img
            src="https://picsum.photos/200"
            className="size-43 sm:size-60 md:size-70 bg-black rounded-full relative right-5 border-2 border-black "
          ></img>
        </div>
      </div>
    </>
  );
}
