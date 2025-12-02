import React from 'react'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllPosts } from '../lib/api'
import PostCard from '../components/PostCard'


const HomePage = () => {
  // Fetch posts using React Query
  const { data: posts = [], isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });

  if (isLoading) return <p className="text-center mt-10">Loading posts...</p>;
  if (isError) return <p className="text-center mt-10 text-red-500">Error loading posts</p>;
  if (!posts.length) return <p className="text-center mt-10">No posts yet.</p>;

  return (
    <div className="flex flex-col items-center mt-5 space-y-6">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
      
    </div>
  );
};

export default HomePage;
