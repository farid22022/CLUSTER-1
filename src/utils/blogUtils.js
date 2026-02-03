// src/utils/blogUtils.js

/**
 * Check if a blog post is publicly visible (approved)
 * Primary check uses approval_status field.
 */
export const isBlogVisible = (blog) => {
  // Main check — backend-controlled approval status
  if (blog.approval_status !== undefined) {
    return blog.approval_status === 'approved';
  }

  // Fallback for old data (if any)
  if (blog.is_visible !== undefined) {
    return blog.is_visible === true;
  }

  // Default: not visible if status is missing
  return false;
};

/**
 * Get only visible (approved) blog posts — use this on public pages
 * Sorted by most recent first (newest created/updated)
 */
export const getVisibleBlogs = (blogs = []) => {
  return blogs
    .filter(isBlogVisible)
    .sort((a, b) => {
      const dateA = new Date(b.updated_at || b.created_at || 0);
      const dateB = new Date(a.updated_at || a.created_at || 0);
      return dateA - dateB; // newest first
    });
};

/**
 * Get only pending blog posts (for admin dashboard)
 */
export const getPendingBlogs = (blogs = []) => {
  return blogs.filter(blog => blog.approval_status === 'pending');
};

/**
 * Get only rejected blog posts (for admin dashboard / history)
 */
export const getRejectedBlogs = (blogs = []) => {
  return blogs.filter(blog => blog.approval_status === 'rejected');
};

/**
 * Get blogs by approval status
 * @param {Array} blogs
 * @param {'approved'|'pending'|'rejected'} status
 */
export const getBlogsByStatus = (blogs = [], status) => {
  if (!['approved', 'pending', 'rejected'].includes(status)) {
    return [];
  }
  return blogs.filter(blog => blog.approval_status === status);
};

/**
 * Optional: Get visible blogs from a specific category
 */
export const getVisibleBlogsByCategory = (blogs = [], category) => {
  return getVisibleBlogs(blogs).filter(blog =>
    blog.category?.toLowerCase() === category.toLowerCase()
  );
};

/**
 * Optional: Get latest N visible blog posts (e.g. for homepage showcase)
 */
export const getLatestVisibleBlogs = (blogs = [], limit = 6) => {
  return getVisibleBlogs(blogs).slice(0, limit);
};