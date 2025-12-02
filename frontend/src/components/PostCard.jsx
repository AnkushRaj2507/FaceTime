import React, { useState } from "react";
import { Heart, MessageCircle, Bookmark, MoreHorizontal } from "lucide-react";

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false); // You can also check if user has liked
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(post.likes?.length || 0);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  console.log("Post data:", post);
  return (
    <div className="max-w-md w-full bg-base-200 rounded-2xl shadow-md border border-base-300 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={post.author?.profilePic || "https://i.pravatar.cc/150?img=3"}
            alt="user"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold text-sm">{post.author?.fullName || "Unknown"}</h2>
            <p className="text-xs text-gray-500">{post.location || ""}</p>
          </div>
        </div>
        <MoreHorizontal className="text-gray-600 cursor-pointer" size={20} />
      </div>

      {/* Media */}
      <div className="w-full">
        <img
            
            src={`http://localhost:5001/api/post/${post._id}/media`}
            alt="post"
            className="w-full object-cover max-h-[800px] rounded-md"
            onError={(e) => (e.target.src = "https://picsum.photos/800/500")}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center gap-4">
          <Heart
            className={`cursor-pointer ${liked ? "text-red-500 fill-red-500" : "text-gray-700"}`}
            size={24}
            onClick={handleLike}
          />
          <MessageCircle className="cursor-pointer text-gray-700" size={24} />
        </div>
        <Bookmark
          className={`cursor-pointer ${saved ? "text-blue-600 fill-blue-600" : "text-gray-700"}`}
          size={22}
          onClick={handleSave}
        />
      </div>

      {/* Likes */}
      <div className="px-4 text-sm font-semibold">
        {likes} {likes === 1 ? "like" : "likes"}
      </div>

      {/* Caption */}
      <div className="px-4 py-2 text-sm">
        <span className="font-semibold mr-2">{post.author?.fullName || "Unknown"}</span>
        {post.caption}
      </div>

      {/* Comments */}
      {post.comments?.length > 0 && (
        <div className="px-4 pb-3 text-sm text-gray-500">
          View all {post.comments.length} comments
        </div>
      )}
    </div>
  );
};

export default PostCard;
