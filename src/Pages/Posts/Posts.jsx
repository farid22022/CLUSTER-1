
import  { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPosts } from '../../api';
import { 
  CalendarDays, 
  User, 
  Hash, 
  Newspaper,
  Clock,
  Eye,
   Calendar,
  Share2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRight,
  Sparkles,
    Image,
  Video
} from 'lucide-react';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today at ' + date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const bannerPosts = posts.slice(0, 3); // Top 3 posts for banner

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-800">Loading Stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Latest Updates</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                  CUSTER<span className="text-">Computer Science & Engineering, Discipline</span>
                  <span className="block text-blue-200 text-2xl lg:text-3xl mt-2">
                    Stories that Matter
                  </span>
                </h1>
                <p className="text-lg text-blue-100 mb-8 max-w-2xl">
                  Dive into the latest events, achievements, and stories from our vibrant campus community.
                  Stay informed with fresh perspectives and exciting updates.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold">Join {posts.length}+ readers</p>
                    <p className="text-blue-200">Exploring stories daily</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Banner Posts */}
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                {bannerPosts.map((post, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 10 }}
                    onClick={() => openModal(post)}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                          <Newspaper className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">
                            #{post.id}
                          </span>
                          <span className="text-xs text-blue-200">{formatDate(post.created_at)}</span>
                        </div>
                        <h3 className="font-semibold text-white group-hover:text-blue-100 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-blue-200 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            Author #{post.author}
                          </span>
                          <ChevronRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { label: 'Total Stories', value: posts.length, icon: BookOpen, color: 'bg-blue-100 text-blue-600' },
            { label: 'Active Authors', value: new Set(posts.map(p => p.author)).size, icon: User, color: 'bg-green-100 text-green-600' },
            { label: 'Latest Update', value: posts.length > 0 ? formatDate(posts[0].created_at) : '--', icon: CalendarDays, color: 'bg-purple-100 text-purple-600' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Posts Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Latest Stories</h2>
              <p className="text-gray-500 mt-2">Browse through our collection of recent posts</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Updates
            </div>
          </div>

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

          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Newspaper className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Stories Yet</h3>
              <p className="text-gray-500 mb-6">Check back soon for new updates!</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {posts.map((post) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  onClick={() => openModal(post)}
                  className="group cursor-pointer"
                >
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-3xl h-full">
                    {/* Post Header */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            
                          </div>
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">Author #{post.author}</p>
                            <p className="text-gray-500 text-xs flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(post.created_at)}
                            </p>
                          </div>
                        </div>
                        {post.updated_at !== post.created_at && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Updated
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>

                      <div className="prose prose-sm max-w-none mb-4">
                        <div 
                          className="text-gray-600 line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                      </div>

                      {post.media && post.media.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            Contains media
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Post Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Eye className="w-4 h-4" />
                            <span>Read</span>
                          </div>
                          
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 transition-colors group-hover:translate-x-1 duration-300">
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedPost && (
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
      <div className="bg-white rounded-3xl shadow-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header - Fixed */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-8 py-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                {/* Optional icon */}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedPost.title}
                </h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Author ID: {selectedPost.author}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(selectedPost.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  {selectedPost.year && (
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Year: {selectedPost.year}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
                  {/* Slug */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                <Hash className="w-4 h-4 text-gray-500" />
                <code className="text-sm font-mono text-gray-700">
                  {selectedPost.slug}
                </code>
              </div>
            </div>
        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Media Carousel - At the top like Facebook */}
          {((selectedPost.images && selectedPost.images.length > 0) || 
            (selectedPost.videos && selectedPost.videos.length > 0)) && (
            <div className="relative bg-gray-900">
              {/* Media Counter */}
              <div className="absolute top-4 right-4 z-10 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                {(() => {
                  const total = (selectedPost.images?.length || 0) + (selectedPost.videos?.length || 0);
                  return `1/${total}`;
                })()}
              </div>

              {/* Carousel Content */}
              <div className="relative aspect-[16/9] w-full">
                {/* Show first image if exists */}
                {selectedPost.images && selectedPost.images.length > 0 ? (
                  <img
                    src={selectedPost.images[0]}
                    alt={selectedPost.title}
                    className="w-full h-full object-contain bg-gray-900"
                  />
                ) : selectedPost.videos && selectedPost.videos.length > 0 ? (
                  <video
                    src={selectedPost.videos[0]}
                    controls
                    className="w-full h-full object-contain bg-gray-900"
                  />
                ) : null}

                {/* Navigation Arrows */}
                {(() => {
                  const total = (selectedPost.images?.length || 0) + (selectedPost.videos?.length || 0);
                  if (total > 1) {
                    return (
                      <>
                        <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all">
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all">
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    );
                  }
                  return null;
                })()}

                {/* Media Type Indicator */}
                <div className="absolute bottom-4 left-4 z-10 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  {selectedPost.images && selectedPost.images.length > 0 && (
                    <>
                      <Image className="w-4 h-4" />
                      {selectedPost.images.length} {selectedPost.images.length === 1 ? 'Photo' : 'Photos'}
                    </>
                  )}
                  {selectedPost.videos && selectedPost.videos.length > 0 && (
                    <>
                      {selectedPost.images && selectedPost.images.length > 0 && <span className="mx-1">•</span>}
                      <Video className="w-4 h-4" />
                      {selectedPost.videos.length} {selectedPost.videos.length === 1 ? 'Video' : 'Videos'}
                    </>
                  )}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {(() => {
                const allMedia = [
                  ...(selectedPost.images || []).map(url => ({ type: 'image', url })),
                  ...(selectedPost.videos || []).map(url => ({ type: 'video', url }))
                ];
                
                if (allMedia.length > 1) {
                  return (
                    <div className="bg-black p-2 overflow-x-auto">
                      <div className="flex gap-2">
                        {allMedia.map((media, index) => (
                          <button
                            key={index}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                              index === 0 ? 'border-blue-500' : 'border-transparent hover:border-gray-400'
                            }`}
                          >
                            {media.type === 'image' ? (
                              <img
                                src={media.url}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                <Video className="w-6 h-6 text-white" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          )}

          {/* Content Section */}
          <div className="p-8">
            

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />
            </div>

            {/* All Media Gallery (optional) */}
            {((selectedPost.images && selectedPost.images.length > 1) || 
              (selectedPost.videos && selectedPost.videos.length > 1)) && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">All Media</h3>
                
                {/* Images Grid */}
                {selectedPost.images && selectedPost.images.length > 1 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-600 mb-3">Images</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {selectedPost.images.map((url, index) => (
                        <div key={index} className="relative group rounded-xl overflow-hidden bg-gray-100">
                          <img
                            src={url}
                            alt={`Post image ${index + 1}`}
                            className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                            onClick={() => window.open(url, '_blank')}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Videos Grid */}
                {selectedPost.videos && selectedPost.videos.length > 1 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-3">Videos</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedPost.videos.map((url, index) => (
                        <div key={index} className="rounded-xl overflow-hidden bg-gray-900">
                          <video
                            src={url}
                            controls
                            className="w-full h-40 object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Dates */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-blue-600 font-medium mb-1">Created</p>
                  <p className="text-gray-900">
                    {new Date(selectedPost.created_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {selectedPost.updated_at !== selectedPost.created_at && (
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-sm text-green-600 font-medium mb-1">Last Updated</p>
                    <p className="text-gray-900">
                      {new Date(selectedPost.updated_at).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer - Fixed */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Share2 className="w-4 h-4" />
                Share Story
              </button>
            </div>
            <button
              onClick={closeModal}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
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

export default Posts;