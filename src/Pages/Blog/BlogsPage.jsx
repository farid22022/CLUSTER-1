import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlogSubmissionForm from './BlogSubmissionForm';
import { getBlogs } from './../../api';
import { getVisibleBlogs, getBlogsByStatus, getLatestVisibleBlogs } from './../../utils/blogUtils';
import { 
  CalendarDays, 
  User, 
  Newspaper,
  Eye,
  MessageSquare,
  Share2,
  BookOpen,
  ChevronRight,
  X,
  ArrowRight,
  Sparkles,
  Filter,
  Plus,
  Lock,
  TrendingUp,
  Tag,
  Search,
  ChevronDown
} from 'lucide-react';

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [visibleBlogs, setVisibleBlogs] = useState([]); // Only approved blogs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  
  // Filter states - Default to showing only approved
  const [filter, setFilter] = useState('approved'); // Only show 'approved' by default
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
    restricted: 0,
    categories: 0,
    authors: 0
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await getBlogs();
        const blogsData = response.data || [];
        setBlogs(blogsData);
        
        // Get only visible (approved) blogs for public view
        const visible = getVisibleBlogs(blogsData);
        setVisibleBlogs(visible);
        
        calculateStats(blogsData);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const calculateStats = (blogsData) => {
    const approved = getBlogsByStatus(blogsData, 'approved').length;
    const rejected = getBlogsByStatus(blogsData, 'rejected').length;
    const pending = getBlogsByStatus(blogsData, 'pending').length;
    const restricted = blogsData.filter(blog => blog.restricted).length;
    const categories = [...new Set(blogsData.map(blog => blog.category).filter(Boolean))].length;
    const authors = [...new Set(blogsData.map(blog => blog.author).filter(Boolean))].length;

    setStats({
      total: blogsData.length,
      approved,
      rejected,
      pending,
      restricted,
      categories,
      authors
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    }).replace(',', '');
  };

  // Helper function to get author display
  const getAuthorDisplay = (author) => {
    if (typeof author === 'string') return author;
    if (typeof author === 'number') return `Author ${author}`;
    return 'Anonymous';
  };

  // Helper function to get author initial
  const getAuthorInitial = (author) => {
    if (typeof author === 'string' && author.length > 0) {
      return author.charAt(0).toUpperCase();
    }
    return 'A';
  };

  // Filter blogs based on current filters - Use visibleBlogs as base
  const filteredBlogs = visibleBlogs.filter(blog => {
    // Status filter - Always approved for visibleBlogs, but keep for consistency
    if (filter !== 'all' && blog.approval_status !== filter) return false;
    
    // Category filter
    if (categoryFilter !== 'all' && blog.category !== categoryFilter) return false;
    
    // Search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const authorStr = getAuthorDisplay(blog.author).toLowerCase();
      const title = blog.title ? blog.title.toLowerCase() : '';
      const category = blog.category ? blog.category.toLowerCase() : '';
      const excerpt = blog.excerpt ? blog.excerpt.toLowerCase() : '';
      
      return (
        title.includes(searchLower) ||
        category.includes(searchLower) ||
        excerpt.includes(searchLower) ||
        authorStr.includes(searchLower) ||
        (blog.tags && Array.isArray(blog.tags) && blog.tags.some(tag => 
          typeof tag === 'string' && tag.toLowerCase().includes(searchLower)
        ))
      );
    }
    
    return true;
  });

  // Get latest approved blogs for banner
  const bannerBlogs = getLatestVisibleBlogs(visibleBlogs, 3);
  
  // Get unique categories from visible blogs only
  const categories = ['all', ...new Set(visibleBlogs.map(blog => blog.category).filter(Boolean))];

  const openModal = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleBlogSubmitted = () => {
    // Refresh blogs list after submission
    const fetchBlogs = async () => {
      try {
        const response = await getBlogs();
        const blogsData = response.data || [];
        setBlogs(blogsData);
        
        // Update visible blogs
        const visible = getVisibleBlogs(blogsData);
        setVisibleBlogs(visible);
        
        calculateStats(blogsData);
      } catch (err) {
        console.error('Error refreshing blogs:', err);
      }
    };
    fetchBlogs();
  };

  const clearFilters = () => {
    setFilter('approved'); // Reset to approved only
    setCategoryFilter('all');
    setSearchTerm('');
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-800">Loading Blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Submission Form Modal */}
      <AnimatePresence>
        {showSubmissionForm && (
          <BlogSubmissionForm
            onClose={() => setShowSubmissionForm(false)}
            onSuccess={handleBlogSubmitted}
          />
        )}
      </AnimatePresence>

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-64 h-64 rounded-full border border-white/10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2"
            >
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Published Content</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                CLUSTER
                <span className="block text-3xl lg:text-4xl text-blue-200 mt-3">
                  Community Blog
                </span>
              </h1>
              
              <p className="text-lg text-blue-100 mb-8 max-w-2xl leading-relaxed">
                A platform for students, researchers, and tech enthusiasts to share insights, 
                tutorials, and discoveries. Your voice matters in our growing community.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSubmissionForm(true)}
                  className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Write a Blog
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('blog-filters').scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
                >
                  <Eye className="w-5 h-5" />
                  Explore Blogs
                </motion.button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{visibleBlogs.length}</div>
                  <div className="text-sm text-blue-200">Published Blogs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{stats.categories}</div>
                  <div className="text-sm text-blue-200">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{stats.authors}</div>
                  <div className="text-sm text-blue-200">Authors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {visibleBlogs.filter(blog => blog.restricted).length}
                  </div>
                  <div className="text-sm text-blue-200">Premium Content</div>
                </div>
              </div>
            </motion.div>

            {/* Featured Blogs Banner */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-1/2"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Featured Stories</h3>
                  <TrendingUp className="w-5 h-5" />
                </div>
                
                <div className="space-y-4">
                  {bannerBlogs.length > 0 ? (
                    bannerBlogs.map((blog) => (
                      <motion.div
                        key={blog.id}
                        whileHover={{ x: 8 }}
                        onClick={() => openModal(blog)}
                        className="group cursor-pointer"
                      >
                        <div className="bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all duration-300 border border-white/10 hover:border-white/30">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-14 h-14 bg-gradient-to-br from-white/20 to-transparent rounded-lg flex items-center justify-center">
                                {blog.image ? (
                                  <div className="w-full h-full rounded-lg bg-cover bg-center" 
                                    style={{ backgroundImage: `url(${blog.image})` }} />
                                ) : (
                                  <Newspaper className="w-6 h-6" />
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium">
                                  Published
                                </span>
                                {blog.restricted && (
                                  <Lock className="w-3 h-3 text-amber-400" />
                                )}
                              </div>
                              <h4 className="font-semibold text-white group-hover:text-blue-100 transition-colors line-clamp-1">
                                {blog.title}
                              </h4>
                              <p className="text-sm text-blue-200 mt-1 line-clamp-2">
                                {blog.excerpt}
                              </p>
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2">
                                  <User className="w-3 h-3" />
                                  <span className="text-xs">{getAuthorDisplay(blog.author)}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-blue-300 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-blue-200">No featured blogs available</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-20 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters Section */}
        <motion.div
          id="blog-filters"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Published Blogs</h2>
              <p className="text-gray-500 mt-2">
                Discover {filteredBlogs.length} published blog{filteredBlogs.length !== 1 ? 's' : ''} 
                {categoryFilter !== 'all' ? ` in "${categoryFilter}"` : ''}
              </p>
            </div>
            
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden w-full">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-700">Filters</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Desktop Filters - Simplified for public view */}
            <div className="hidden lg:flex flex-wrap gap-3">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search published blogs..."
                  className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Category Filter Only - No status filter for public */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.filter(cat => cat !== 'all').map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Clear Filters Button */}
              {(categoryFilter !== 'all' || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  Clear
                </button>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSubmissionForm(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-shadow"
              >
                <Plus className="w-4 h-4" />
                New Blog
              </motion.button>
            </div>
          </div>

          {/* Mobile Filters (Collapsible) */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden space-y-4 mt-4"
              >
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search published blogs..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Category Filter Only */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    {categories.filter(cat => cat !== 'all').map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={clearFilters}
                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={() => setShowSubmissionForm(true)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-xl font-medium"
                  >
                    New Blog
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters Bar */}
          {(categoryFilter !== 'all' || searchTerm) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-2 mt-4 p-3 bg-gray-50 rounded-xl"
            >
              <span className="text-sm text-gray-600">Active filters:</span>
              
              {searchTerm && (
                <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm">
                  <span className="mr-2">Search: {searchTerm}</span>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {categoryFilter !== 'all' && (
                <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm">
                  <span className="mr-2">Category: {categoryFilter}</span>
                  <button 
                    onClick={() => setCategoryFilter('all')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              <button
                onClick={clearFilters}
                className="ml-auto text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all
              </button>
            </motion.div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
            {[
              { label: 'Published', value: visibleBlogs.length, icon: BookOpen, color: 'bg-green-100 text-green-600' },
              { label: 'Categories', value: stats.categories, icon: Tag, color: 'bg-blue-100 text-blue-600' },
              { label: 'Authors', value: stats.authors, icon: User, color: 'bg-pink-100 text-pink-600' },
              { label: 'Premium', value: visibleBlogs.filter(blog => blog.restricted).length, icon: Lock, color: 'bg-blue-100 text-blue-600' },
              { label: 'Tutorials', value: visibleBlogs.filter(blog => blog.category === 'Tutorial').length, icon: Newspaper, color: 'bg-blue-100 text-blue-600' },
              { label: 'Research', value: visibleBlogs.filter(blog => blog.category === 'Research').length, icon: BookOpen, color: 'bg-amber-100 text-amber-600' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-2 rounded-lg`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <p className="text-red-700 font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Refresh page
            </button>
          </div>
        )}

        {/* Blogs Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Newspaper className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Published Blogs Found</h3>
            <p className="text-gray-500 mb-6">
              {categoryFilter !== 'all' || searchTerm
                ? 'Try changing your filters'
                : 'Be the first to submit a blog post!'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                clearFilters();
                setShowSubmissionForm(true);
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow"
            >
              <Plus className="w-5 h-5" />
              Write Your First Blog
            </motion.button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredBlogs.map((blog) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                onClick={() => openModal(blog)}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-3xl h-full">
                  {/* Status Badge - Always approved */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor('approved')}`}>
                      Published
                    </span>
                  </div>

                  {/* Image Preview */}
                  {blog.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                            {blog.category}
                          </span>
                          {blog.restricted && (
                            <div className="flex items-center gap-1 text-xs text-amber-600">
                              <Lock className="w-3 h-3" />
                              <span>Premium</span>
                            </div>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {blog.title}
                        </h3>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold text-sm">#{blog.id}</span>
                      </div>
                    </div>

                    {/* Excerpt */}
                    <p className="text-gray-600 line-clamp-3 mb-6">
                      {blog.excerpt}
                    </p>

                    {/* Tags */}
                    {blog.tags && Array.isArray(blog.tags) && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {blog.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                            {typeof tag === 'string' ? tag : String(tag)}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="px-2 py-1 text-gray-500 text-xs">+{blog.tags.length - 3}</span>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {getAuthorInitial(blog.author)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {getAuthorDisplay(blog.author)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(blog.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>

      {/* Blog Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedBlog && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl shadow-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <Newspaper className="w-7 h-7" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedBlog.title}</h2>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1 text-sm text-blue-200">
                            <User className="w-4 h-4" />
                            {getAuthorDisplay(selectedBlog.author)}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-blue-200">
                            <CalendarDays className="w-4 h-4" />
                            {formatDate(selectedBlog.date)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={closeModal}
                      className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
                  {/* Status & Category */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="px-3 py-1.5 bg-green-100 text-green-800 border border-green-200 rounded-full text-sm font-medium">
                      PUBLISHED
                    </span>
                    
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {selectedBlog.category}
                    </span>
                    
                    {selectedBlog.restricted && (
                      <span className="px-3 py-1.5 bg-amber-100 text-amber-800 text-sm font-medium rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Premium Content
                      </span>
                    )}
                    
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                      ID: #{selectedBlog.id}
                    </span>
                  </div>

                  {/* Image */}
                  {selectedBlog.image && (
                    <div className="mb-8">
                      <img
                        src={selectedBlog.image}
                        alt={selectedBlog.title}
                        className="w-full h-64 object-cover rounded-2xl shadow-lg"
                      />
                    </div>
                  )}

                  {/* Tags */}
                  {selectedBlog.tags && Array.isArray(selectedBlog.tags) && selectedBlog.tags.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="w-5 h-5 text-gray-500" />
                        <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedBlog.tags.map((tag, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm">
                            {typeof tag === 'string' ? tag : String(tag)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Excerpt */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">
                      {selectedBlog.excerpt}
                    </p>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-sm text-blue-600 font-medium mb-1">Published On</p>
                      <p className="text-gray-900">{new Date(selectedBlog.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-sm text-blue-600 font-medium mb-1">Last Updated</p>
                      <p className="text-gray-900">{new Date(selectedBlog.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </motion.button>
                      <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        Discuss
                      </button>
                    </div>
                    <button
                      onClick={closeModal}
                      className="px-5 py-2.5 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogsPage;