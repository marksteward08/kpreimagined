"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserinfo } from "../state/context";

// DEFAULTS
const DEFAULT_IMAGE_URL = "https://picsum.photos/400/400";

export default function UploadImage() {
  const [isChecked, setIsChecked] = useState(false);

  // to be inserted in zustand store later
  const { userInfo, setUserInfo } = useUserinfo();
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGE_URL);
  const [username, setUsername] = useState("");

  const router = useRouter();

  const handleProceed = () => {
    if (!username || !username.trim()) {
      alert("Please enter a username before continuing.");
      return;
    }
    setUserInfo({ username, imageUrl });
    router.push(`/chatnow`);
  };

  const compressImage = (file, callback) => {
    setImageUrl(null);

    const reader = new FileReader();
    reader.readAsImage = true;
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        let quality = 0.9;
        let compressedData;

        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (blob.size > 100 * 1024 && quality > 0.01) {
                quality -= 0.1;
                tryCompress();
              } else {
                const url = URL.createObjectURL(blob);
                callback(url);
              }
            },
            "image/jpeg",
            quality,
          );
        };

        tryCompress();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate that the file is an image
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file only");
        e.target.value = ""; // Clear the input
        return;
      }
      compressImage(file, (compressedUrl) => {
        setImageUrl(compressedUrl);
      });
    }
  };

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);

    if (isChecked) {
      setImageUrl(DEFAULT_IMAGE_URL);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-5 md:gap-8 items-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-center">
          {isChecked ? (
            <>
              <span>
                Are you sure you dont want to
                <br />
                upload an image?🥺
              </span>
            </>
          ) : (
            <>
              <span>
                Let others see<br></br>what you look like.
              </span>
            </>
          )}
        </h1>
        {!isChecked && (
          <img
            src={imageUrl}
            className="size-40 md:size-60 bg-black rounded-full border-2 object-cover object-center"
          ></img>
        )}
        <input
          type="text"
          placeholder="Enter your username"
          className="input input-neutral placeholder:text-center text-center text-xl"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {!isChecked && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input file-input-neutral "
            />
          </>
        )}

        {/* Checkbox for opting out of image upload */}
        <div
          onClick={() => toggleCheckbox()}
          className="flex gap-2 items-center text-lg cursor-pointer"
        >
          <input
            type="checkbox"
            checked={isChecked}
            className="checkbox checkbox-neutral size-4 rounded-sm"
            readOnly
          />
          <p className="italic text-[15px]">I dont want to upload my Image</p>
        </div>

        {isChecked ? (
          <button
            onClick={handleProceed}
            className="btn not-hover:btn-neutral hover:btn-soft rounded-xl"
          >
            Yes, I am sure.
          </button>
        ) : imageUrl !== DEFAULT_IMAGE_URL && imageUrl !== null ? (
          <button
            onClick={handleProceed}
            className="btn not-hover:btn-neutral hover:btn-soft rounded-xl animate-jump-in"
          >
            LOOKS GOOD ✨
          </button>
        ) : null}
      </div>
    </>
  );
}
