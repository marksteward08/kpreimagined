"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserinfo } from "../state/context";
import { initNSFWModel, checkNSFW } from "@/service/nsfwChecker";
import Loading from "../loading";
import { DEFAULT_IMAGE_URL } from "../constants";

// DEFAULTS
// const DEFAULT_IMAGE_URL = "https://picsum.photos/200/200";

export default function UploadImage() {
  const [isChecked, setIsChecked] = useState(false);

  const [loading, setLoading] = useState(false);

  const [isNSFWpassed, setIsNSFWpassed] = useState(false);

  // to be inserted in zustand store later
  const { userInfo, setUserInfo } = useUserinfo();

  // for previewing the image before uploading
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGE_URL);

  // actual file name of the image to be stored in zustand
  const [imageFileName, setImageFileName] = useState(DEFAULT_IMAGE_URL);

  const [username, setUsername] = useState("");

  const router = useRouter();

  // to store the compressed image blob before uploading to backend
  const compressedImageRef = useRef(null);

  const imageRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await initNSFWModel(); // Uses local model by default
      } catch (err) {
        console.error("Failed loading model", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleProceed = () => {
    if (!username || !username.trim()) {
      alert("Please enter a username before continuing.");
      return;
    }

    const blob = compressedImageRef.current;

    const formData = new FormData();
    if (blob) {
      formData.append("username", username);
      formData.append("file", blob, imageFileName || "image.jpg");
      fetch("http://100.111.219.117:3001/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Upload successful:", data);
          setUserInfo({
            username: username,
            imageUrl: data.url,
          });
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    } else {
      setUserInfo({
        username,
        imageUrl: imageFileName,
      });
    }

    router.push(`/chatnow`);
  };

  const compressImage = (file, callback) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Resize if needed
        const MAX_WIDTH = 1920;
        const scale = Math.min(1, MAX_WIDTH / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        // IMPORTANT: remove transparency for JPEG
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        let quality = 0.9;
        const MIN_QUALITY = 0.4;

        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) return;

              if (blob.size > 100 * 1024 && quality > MIN_QUALITY) {
                quality -= 0.1;
                tryCompress();
              } else {
                callback({
                  blob,
                  url: URL.createObjectURL(blob),
                });
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
    setLoading(true);
    const file = e.target.files[0];
    if (file) {
      // Validate that the file is an image
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file only");
        e.target.value = ""; // Clear the input
        return;
      }
      compressImage(file, (compressedUrl) => {
        const { url, blob } = compressedUrl;
        setImageUrl(url);
        setImageFileName(file.name);
        compressedImageRef.current = blob;
      });
    }
  };

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);

    if (isChecked) {
      setImageFileName(DEFAULT_IMAGE_URL);
      setImageUrl(DEFAULT_IMAGE_URL);
    }
  };

  return (
    <>
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <Loading />
        </div>
      )}
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
            crossOrigin="anonymous"
            ref={imageRef}
            onLoad={() => {
              // if imageRef is not the default image, check for NSFW content
              if (imageUrl !== DEFAULT_IMAGE_URL) {
                checkNSFW(imageRef.current, (result) => {
                  if (result.isPorn) {
                    alert(
                      "The uploaded image was detected as inappropriate. Please choose a different image.",
                    );
                    setImageUrl(DEFAULT_IMAGE_URL);
                    setImageFileName(DEFAULT_IMAGE_URL);
                    compressedImageRef.current = null;
                    // reset the input file value to allow re-uploading the same image if user wants to change it
                    fileInputRef.current.value = "";
                    setIsNSFWpassed(false);
                  } else {
                    setIsNSFWpassed(true);
                  }
                });
              }
              // Always stop loading regardless of NSFW check
              setLoading(false);
            }}
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
              ref={fileInputRef}
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

        {isChecked && (
          <button
            onClick={handleProceed}
            className="btn not-hover:btn-neutral hover:btn-soft rounded-xl"
          >
            Yes, I am sure.
          </button>
        )}
        {!isChecked && isNSFWpassed && (
          <button
            onClick={handleProceed}
            className="btn not-hover:btn-neutral hover:btn-soft rounded-xl animate-jump-in"
          >
            LOOKS GOOD ✨
          </button>
        )}
      </div>
    </>
  );
}
