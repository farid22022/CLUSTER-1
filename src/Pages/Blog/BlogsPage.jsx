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
  const [visibleBlogs, setVisibleBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  
  // Using uppercase to match your actual data
  const [filter, setFilter] = useState('APPROVED');
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
        setError(null);

        const response = await getBlogs();
        const blogsData = response.data || [];
        console.log('Fetched blogs:', blogsData);

        setBlogs(blogsData);

        // Safe visible filter – case insensitive
        const visible = blogsData.filter(blog => 
          blog.approval_status?.toUpperCase() === 'APPROVED'
        );
        console.log('Visible approved blogs:', visible);

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
    const getCount = (status) => 
      blogsData.filter(b => b.approval_status?.toUpperCase() === status.toUpperCase()).length;

    setStats({
      total: blogsData.length,
      approved: getCount('APPROVED'),
      rejected: getCount('REJECTED'),
      pending: getCount('PENDING'),
      restricted: blogsData.filter(b => b.restricted).length,
      categories: [...new Set(blogsData.map(b => b.category).filter(Boolean))].length,
      authors: [...new Set(blogsData.map(b => b.author).filter(Boolean))].length
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    }).replace(',', '');
  };

  const getAuthorDisplay = (author) => {
    if (typeof author === 'string' && author.trim()) return author.trim();
    if (typeof author === 'number') return `User #${author}`;
    return 'Anonymous';
  };

  const getAuthorInitial = (author) => {
    const display = getAuthorDisplay(author);
    return display.charAt(0).toUpperCase() || 'A';
  };

  // Filtered blogs
  const filteredBlogs = visibleBlogs.filter(blog => {
    if (filter !== 'all' && blog.approval_status?.toUpperCase() !== filter.toUpperCase()) {
      return false;
    }
    if (categoryFilter !== 'all' && blog.category !== categoryFilter) {
      return false;
    }
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const authorStr = getAuthorDisplay(blog.author).toLowerCase();
    const title = (blog.title || '').toLowerCase();
    const category = (blog.category || '').toLowerCase();
    const excerpt = (blog.excerpt || '').toLowerCase();

    return (
      title.includes(searchLower) ||
      category.includes(searchLower) ||
      excerpt.includes(searchLower) ||
      authorStr.includes(searchLower) ||
      (blog.tags?.some(tag => String(tag || '').toLowerCase().includes(searchLower)))
    );
  });

  const bannerBlogs = getLatestVisibleBlogs(visibleBlogs, 3);
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
    const fetchBlogs = async () => {
      try {
        const response = await getBlogs();
        const blogsData = response.data || [];
        setBlogs(blogsData);
        const visible = blogsData.filter(b => b.approval_status?.toUpperCase() === 'APPROVED');
        setVisibleBlogs(visible);
        calculateStats(blogsData);
      } catch (err) {
        console.error('Refresh failed:', err);
      }
    };
    fetchBlogs();
  };

  const clearFilters = () => {
    setFilter('APPROVED');
    setCategoryFilter('all');
    setSearchTerm('');
  };

  const getStatusColor = (status) => {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING':  return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:         return 'bg-gray-100 text-gray-800 border-gray-200';
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

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="text-red-500 mb-4 text-5xl">⚠️</div>
          <h2 className="text-2xl font-bold mb-3">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Retry
          </button>
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
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-64 h-64 rounded-full border border-white/10"
              style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%` }}
              animate={{ x: [0, Math.random()*100-50], y: [0, Math.random()*100-50], scale: [1, 1.2, 1] }}
              transition={{ duration: Math.random()*10 + 10, repeat: Infinity, repeatType: "reverse" }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Published Content</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-white">Blog Posts</span>
              </h1>
              <p className="text-xl opacity-90 mb-8 max-w-xl">
                Dive into insightful articles, tutorials, and stories from our community of tech enthusiasts and experts.
              </p>
              <button
                onClick={() => setShowSubmissionForm(true)}
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3"
              >
                <Plus className="w-5 h-5" />
                Submit Your Blog
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:w-1/2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {bannerBlogs.map((blog, index) => (
                  <motion.div
                    key={blog.id}
                    className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => openModal(blog)}
                  >
                    <img
                      src={blog.image || 'https://via.placeholder.com/400x225?text=Blog+Image'}
                      alt={blog.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 p-4">
                      <h3 className="text-white font-semibold text-lg line-clamp-2 mb-2">{blog.title}</h3>
                      <div className="flex items-center gap-2 text-white/80 text-sm">
                        <User className="w-4 h-4" />
                        {getAuthorDisplay(blog.author)}
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                      {blog.category}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters - mobile toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full py-3 px-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-slate-700 font-medium"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
          </button>

          {showMobileFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl bg-white"
                >
                  <option value="APPROVED">Approved</option>
                  <option value="PENDING">Pending</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="all">All</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl bg-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search blogs..."
                  className="w-full p-3 pl-10 border border-slate-200 rounded-xl bg-white"
                />
              </div>
              <button
                onClick={clearFilters}
                className="w-full py-3 bg-slate-50 text-slate-700 rounded-xl hover:bg-slate-100"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search blogs..."
                className="w-96 pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-3 px-4 border border-slate-200 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="py-3 px-4 border border-slate-200 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
              <option value="all">All Status</option>
            </select>
          </div>
          <button
            onClick={clearFilters}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Clear
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="text-3xl font-bold text-slate-800 mb-1">{stats.total}</div>
            <div className="text-slate-600">Total Blogs</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="text-3xl font-bold text-slate-800 mb-1">{stats.approved}</div>
            <div className="text-slate-600">Published</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="text-3xl font-bold text-slate-800 mb-1">{stats.categories}</div>
            <div className="text-slate-600">Categories</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="text-3xl font-bold text-slate-800 mb-1">{stats.authors}</div>
            <div className="text-slate-600">Authors</div>
          </div>
        </div>

        {/* Blog Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <BookOpen className="w-16 h-16 mx-auto mb-6 text-blue-600 opacity-50" />
            <h3 className="text-2xl font-semibold text-slate-800 mb-3">No blogs found</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Try adjusting your filters or be the first to contribute!
            </p>
            <button
              onClick={() => setShowSubmissionForm(true)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl"
            >
              Submit a Blog
            </button>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            {filteredBlogs.map((blog) => (
              <motion.article
                key={blog.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer"
                onClick={() => openModal(blog)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={blog.image || 'https://via.placeholder.com/600x300?text=Blog+Cover'}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 text-blue-600 rounded-full text-xs font-medium">
                    {blog.category || 'General'}
                  </span>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {blog.excerpt || 'No summary available.'}
                  </p>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {blog.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="px-2.5 py-1 text-gray-500 text-xs">+{blog.tags.length - 3}</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {getAuthorInitial(blog.author)}
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
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl shadow-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 sm:p-8">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-3 mb-4">
                        <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium">
                          {selectedBlog.category || 'General'}
                        </span>
                        <span className="px-3 py-1 bg-green-500/30 text-green-100 rounded-full text-sm font-medium">
                          Published
                        </span>
                        {selectedBlog.restricted && (
                          <span className="px-3 py-1 bg-amber-500/30 text-amber-100 rounded-full text-sm font-medium flex items-center gap-1.5">
                            <Lock className="w-3 h-3" /> Restricted
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-bold mb-3 line-clamp-2">
                        {selectedBlog.title}
                      </h2>

                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm opacity-90">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {getAuthorDisplay(selectedBlog.author)}
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4" />
                          {formatDate(selectedBlog.created_at)}
                        </div>
                        {selectedBlog.updated_at && selectedBlog.updated_at !== selectedBlog.created_at && (
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4" />
                            Updated {formatDate(selectedBlog.updated_at)}
                          </div>
                        )}
                        {selectedBlog.year && (
                          <div>Year {selectedBlog.year}</div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={closeModal}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 sm:p-8 overflow-y-auto flex-1">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-8">
                      {selectedBlog.image && (
                        <img
                          src={selectedBlog.image}
                          alt={selectedBlog.title}
                          className="w-full h-64 object-cover rounded-2xl shadow-lg mb-8"
                        />
                      )}

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-blue-500" />
                          Summary
                        </h3>
                        <div className="bg-gray-50 p-6 rounded-xl text-gray-700 leading-relaxed whitespace-pre-line">
                          {selectedBlog.excerpt || selectedBlog.description || 'No summary available.'}
                        </div>
                      </div>

                      {selectedBlog.tags && Array.isArray(selectedBlog.tags) && selectedBlog.tags.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Tag className="w-5 h-5 text-blue-500" />
                            Tags
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedBlog.tags.map((tag, idx) => (
                              <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                {typeof tag === 'string' ? tag : String(tag)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedBlog.author && (
                        <div className="bg-gray-50 p-5 rounded-xl">
                          <h3 className="text-lg font-semibold mb-3">Author</h3>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-lg">
                              {getAuthorInitial(selectedBlog.author)}
                            </div>
                            <div>
                              <p className="font-medium">{getAuthorDisplay(selectedBlog.author)}</p>
                              <p className="text-sm text-gray-500">Blog Author</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Details</h3>
                        <div className="space-y-4 text-sm">
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Blog ID</span>
                            <span className="font-medium">#{selectedBlog.id}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Status</span>
                            <span className="font-semibold text-green-600">Published</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Access</span>
                            <span className={`font-semibold ${selectedBlog.restricted ? 'text-amber-600' : 'text-green-600'}`}>
                              {selectedBlog.restricted ? 'Restricted' : 'Public'}
                            </span>
                          </div>
                          {selectedBlog.year && (
                            <div className="flex justify-between py-2">
                              <span className="text-gray-600">Year</span>
                              <span className="font-medium">{selectedBlog.year}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                        <div className="space-y-3">
                          <button className="w-full py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2 border border-gray-200">
                            <Share2 className="w-4 h-4" />
                            Share Post
                          </button>
                          <button className="w-full py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2 border border-gray-200">
                            <MessageSquare className="w-4 h-4" />
                            Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2.5 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  >
                    Close
                  </button>
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