// Re-export from unified API layer for backward compatibility
export {
  getBlogs,
  getBlogBySlug,
  getBlogsByCategory,
  getDistinctBlogCategories,
  getRelatedBlogs,
  getFeaturedBlogs,
} from './services';
