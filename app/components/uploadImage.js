import { useState } from "react";

export default function UploadImage() {
  const [isChecked, setIsChecked] = useState(false);
  const [imageUrl, setImageUrl] = useState("https://picsum.photos/400/400");

  const compressImage = (file, callback) => {
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
      setImageUrl("https://picsum.photos/400/400");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-10 items-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-center">
          Let others see<br></br>what you look like.
        </h1>
        {!isChecked && (
          <img
            src={imageUrl}
            className="size-60 bg-black rounded-full border-2 object-cover object-center"
          />
        )}

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

        <div
          onClick={() => toggleCheckbox()}
          className="flex gap-2 items-center text-lg cursor-pointer"
        >
          <input
            type="checkbox"
            checked={isChecked}
            className="checkbox checkbox-neutral size-5"
            readOnly
          />
          <p className="italic">I dont want to upload my Image</p>
        </div>
      </div>
    </>
  );
}
