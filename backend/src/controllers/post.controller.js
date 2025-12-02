import Post from "../models/Post.js";
import fs from "fs";
import multer from "multer";



const storage = multer.memoryStorage();
export const upload = multer({ storage });


export async function createPost(req, res) {
    // console.log(req)
  try {
    const { caption } = req.body;
    const file = req.file; // multer handles this
    // console.log(file);
    if (!file) {
      return res.status(400).json({ message: "Please upload an image or video file" });
    }

    const mediaType = file.mimetype.startsWith("video/") ? "video" : "image";

    const newPost = new Post({
      author: req.user._id,
      caption,
      media: {
        data : req.file.buffer,
        contentType: req.file.mimetype,
      },
      mediaType,
    });

    await newPost.save();
    // fs.unlinkSync(file.path); // delete temp file from server

    res.status(201).json({ success: true, message: "Post created successfully", post: newPost._id });
  } catch (error) {
    console.error("Error in createPost controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function getAllPosts(req, res) {
  try {
    const posts = await Post.find()
      .populate("author", "fullName profilePic")
      .sort({ createdAt: -1 });

    const formattedPosts = posts.map((post) => ({
      _id: post._id,
      author: post.author,
      caption: post.caption,
      mediaType: post.mediaType,
      mediaUrl: `http://localhost:5001/post/${post._id}/media`,
      createdAt: post.createdAt,
      likes: post.likes.length,
      comments: post.comments,
    }));

    res.status(200).json(formattedPosts);
  } catch (error) {
    console.error("Error in getAllPosts controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function getPostMedia(req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || !post.media || !post.media.data) {
      return res.status(404).json({ message: "Media not found" });
    }

    res.set("Content-Type", post.media.contentType);
    res.send(post.media.data);
  } catch (error) {
    console.error("Error in getPostMedia controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}



export async function toggleLike(req, res) {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ success: true, liked: !alreadyLiked, likesCount: post.likes.length });
  } catch (error) {
    console.error("Error in toggleLike controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
