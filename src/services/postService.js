import axiosClient from "@/utils/axiosClient";

// ============================================
// PUBLIC APIS
// ============================================

// Get all posts
export const getAllPosts = async (params = {}) => {
  const { page = 1, limit = 10, status = 'published', category, sortBy = 'createdAt', sortOrder = 'desc' } = params;
  
  const queryParams = new URLSearchParams();
  queryParams.append('page', page);
  queryParams.append('limit', limit);
  if (status) queryParams.append('status', status);
  if (category) queryParams.append('category', category);
  queryParams.append('sortBy', sortBy);
  queryParams.append('sortOrder', sortOrder);
  
  return await axiosClient.get(`/posts?${queryParams.toString()}`);
};

// Get post by ID
export const getPostById = async (id) => {
  return await axiosClient.get(`/posts/${id}`);
};

// Search posts
export const searchPosts = async (keyword, params = {}) => {
  const { page = 1, limit = 10, status = 'published' } = params;
  
  const queryParams = new URLSearchParams();
  queryParams.append('keyword', keyword);
  queryParams.append('page', page);
  queryParams.append('limit', limit);
  if (status) queryParams.append('status', status);
  
  return await axiosClient.get(`/posts/search?${queryParams.toString()}`);
};

// Increment view count
export const incrementViewCount = async (id) => {
  return await axiosClient.post(`/posts/${id}/view`);
};

// ============================================
// ADMIN APIS (require authentication)
// ============================================

// Create new post
export const createPost = async (postData) => {
  return await axiosClient.post('/posts', postData);
};

// Update post
export const updatePost = async (id, postData) => {
  return await axiosClient.put(`/posts/${id}`, postData);
};

// Delete post
export const deletePost = async (id) => {
  return await axiosClient.delete(`/posts/${id}`);
};

// Trigger manual crawl
export const triggerCrawl = async () => {
  return await axiosClient.post('/posts/crawl/trigger');
};
