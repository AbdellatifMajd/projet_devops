import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { useEffect, useRef } from "react";

function RoomImageUpload({
  imageFile,
  setImageFile,
  setUploadedImageURL,
  imageLoading,
  setImageLoading,
}) {
  const inputRef = useRef("");

  const handleImgFileChange = (e) => {
    console.log(e.target.files);
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setImageFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value("");
    }
  };

  const uploadImageToCloudinary = async () => {
    setImageLoading(true);
    try {
      const data = new FormData();
      data.append("my_file", imageFile);

      const response = await axios.post(
        "http://localhost:8080/api/images/upload",
        data,
      );
      if (response.data) {
        setUploadedImageURL(response.data.url);
      }

      setImageLoading(false);
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image :", error);
    }
  };

  useEffect(() => {
    if (imageFile !== null) {
      uploadImageToCloudinary();
    }
  }, [imageFile]);

  return (
    <div className="w-full mx-auto px-6">
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed rounded-lg p-2"
      >
        <TextField
          className="!hidden"
          id="image-upload"
          type="file"
          onChange={handleImgFileChange}
          ref={inputRef}
        />
        {!imageFile ? (
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center h-32 cursor-pointer"
          >
            <UploadCloudIcon className="w-10 h-10 text-muted mb-2" />
            <span>Drag & Drop or click to upload image</span>
          </label>
        ) : imageLoading ? (
          <Skeleton variant="rounded" width="100%" height={100} animation="wave"/>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 text-primary mr-2 h-8" />
            </div>
            <p className="text-sm font-medium">{imageFile.name} </p>
            <div className="h-32 flex items-center">
              <Button
                sx={{ color: "red", borderColor: "red" }}
                onClick={handleRemoveImage}
              >
                <XIcon className="w-4 h-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoomImageUpload;
