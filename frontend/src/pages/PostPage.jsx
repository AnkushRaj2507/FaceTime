import React, { useState } from "react";
import { Image, Video, Loader2, Sparkles } from "lucide-react";
import { postPost } from "../lib/api";

const PostPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) setPreview(URL.createObjectURL(selected));
  };

  // Simulate upload
  const handlePost = async () => {
    if (!file) return alert("Please select an image or video!");

    setLoading(true);
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("caption", caption);

        const res = await postPost(formData);

        if (res && (res.status === 200 || res.status === 201 || res.success)) {
        setFile(null);
        setPreview("");
        setCaption("");
        alert("Posted successfully.");
        } else if (res && res.status === 500) {
        alert("Server error (500). Please try again later.");
        } else {
        const text = res.text ? await res.text() : JSON.stringify(res);
        alert(`Upload failed: ${res.status} ${text}`);
        }

    } catch (error) {
        console.error(error);
        alert("Upload error: " + (error.message || error));
    } finally {
        setLoading(false);
    }
    };

//   const handlePost = async () => {
//     if (!file) return alert("Please select an image or video!");

//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("caption", caption);

//       const res = await postPost(formData);

//       // If postPost returns a Fetch Response
//       if (res && typeof res.status === "number") {
//         if (res.status === 200) {
//           setFile(null);
//           setPreview("");
//           setCaption("");
//           alert("Posted successfully.");
//         } else if (res.status === 500) {
//           alert("Server error (500). Please try again later.");
//         } else {
//           const text = res.text ? await res.text() : JSON.stringify(res);
//           alert(`Upload failed: ${res.status} ${text}`);
//         }
//       } else {
//         // Fallback if postPost returns parsed JSON
//         if (res && (res.status === 200 || res.success)) {
//           setFile(null);
//           setPreview("");
//           setCaption("");
//           alert("Posted successfully.");
//         } else if (res && res.status === 500) {
//           alert("Server error (500). Please try again later.");
//         } else {
//           alert("Unexpected response from server.");
//         }
//       }
//     } catch (error) {
//       console.error(error);
//       alert("Upload error: " + (error.message || error));
//     } finally {
//       setLoading(false);
//     }
//   };

  // Simulate AI caption generation
  const generateAICaption = async () => {
    if (!file) return alert("Please upload an image first!");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:5001/api/generate-caption", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.caption) {
        setCaption(data.caption);
      } else {
        alert("Failed to generate caption");
      }

    } catch (err) {
      console.error(err);
      alert("AI error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="bg-base-200 h-full">
    <div className="flex justify-center items-center px-4 py-10">
      <div
        className="bg-base-100 border border-base-content/10 rounded-2xl shadow-xl 
                   w-full max-w-md p-6 space-y-4 transition-all duration-300"
      >
        {/* Title */}
        <h2 className="text-xl font-semibold text-center text-base-content/90">
          Create a Post
        </h2>

        {/* File Upload */}
        <div
          className="border-2 border-dashed border-base-content/20 rounded-xl p-6 
                     flex flex-col items-center justify-center space-y-3 
                     bg-base-200/40 hover:bg-base-200/70 transition-colors duration-200"
        >
          {preview ? (
            file.type.startsWith("video/") ? (
              <video
                src={preview}
                controls
                className="w-full rounded-xl shadow-md"
              ></video>
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-full rounded-xl shadow-md"
              />
            )
          ) : (
            <>
              <Image className="text-base-content/50" size={40} />
              <p className="text-sm text-base-content/60">
                Drag or select a photo/video
              </p>
            </>
          )}

          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            id="upload"
            onChange={handleFileChange}
          />
          <label
            htmlFor="upload"
            className="btn btn-primary btn-sm mt-2 normal-case rounded-xl"
          >
            Choose File
          </label>
        </div>

        {/* Caption */}
        <textarea
          className="textarea textarea-bordered w-full h-24 rounded-xl resize-none 
                     text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        ></textarea>

        {/* AI Caption Button */}
        <button
          onClick={generateAICaption}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full text-sm 
                     text-primary hover:text-primary/80 transition-colors duration-200"
        >
          <Sparkles size={16} />
          {loading ? "Generating..." : "Generate AI Caption"}
        </button>

        {/* Post Button */}
        <button
          onClick={handlePost}
          disabled={loading}
          className="btn btn-primary w-full mt-3 rounded-xl flex justify-center items-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
      </div>
    </div>
  );
};

export default PostPage;
