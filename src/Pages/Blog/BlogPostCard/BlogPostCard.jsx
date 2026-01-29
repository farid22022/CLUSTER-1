import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import PropTypes from 'prop-types';

const BlogPostCard = () => {
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const [comments, setComments] = useState({
    1: [
      { id: 1, author: 'Alice Brown', text: 'Great post! Very informative.', date: 'May 16, 2025' },
      { id: 2, author: 'Bob Johnson', text: 'Thanks for sharing these insights.', date: 'May 17, 2025' },
    ],
    // Initialize comments for other posts if needed
  });
  const [newComment, setNewComment] = useState('');

  const posts = [
    {
      id: 1,
      image: '/Events/AIChatBot.png',
      title: 'Building an AI-Powered Chatbot',
      category: 'Tutorial',
      tags: ['AI', 'Python', 'NLP'],
      author: 'John Doe',
      date: 'May 15, 2025',
      excerpt: 'Learn how to create a chatbot using Python and NLP techniques.',
      restricted: false,
    },
    {
      id: 2,
      image: '/Events/QuantumComputing.png',
      title: 'Exploring Quantum Computing',
      category: 'Research',
      tags: ['Quantum', 'Physics', 'Computing'],
      author: 'Jane Smith',
      date: 'May 16, 2025',
      excerpt: 'Dive into the world of quantum computing and its potential applications.',
      restricted: false,
    },
    {
      id: 3,
      image: '/Events/innovationShowcasing.png',
      title: 'Innovation Showcasing Event',
      category: 'Event',
      tags: ['Innovation', 'Technology', 'Showcase'],
      author: 'Alice Johnson',
      date: 'May 17, 2025',
      excerpt: 'Highlights from our recent innovation showcasing event.',
      restricted: false,
    },
    {
      id: 4,
      image: '/Events/MachineLearningAlgorithms.png',
      title: 'Understanding Machine Learning Algorithms',
      category: 'Education',
      tags: ['Machine Learning', 'Algorithms', 'Data Science'],
      author: 'David Lee',
      date: 'May 18, 2025',
      excerpt: 'An in-depth look at various machine learning algorithms and their applications.',
      restricted: false,
    },
    {
      id: 5,
      image: '/Events/FutureOfBlockchain.png',
      title: 'The Future of Blockchain Technology',
      category: 'Technology',
      tags: ['Blockchain', 'Cryptocurrency', 'Future'],
      author: 'Emily Davis',
      date: 'May 19, 2025',
      excerpt: 'Exploring the potential impact of blockchain technology on various industries.',
      restricted: false,
    },
    {
      id: 6,
      image: '/Events/CybersecurityBestPractices.png',
      title: 'Cybersecurity Best Practices',
      category: 'Security',
      tags: ['Cybersecurity', 'Best Practices', 'IT'],
      author: 'Michael Brown',
      date: 'May 20, 2025',
      excerpt: 'Essential cybersecurity practices to protect your digital assets.',
      restricted: false,
    },
    {
      id: 7,
      image: '/Events/AugmentedRealityTrends.png',
      title: 'The Rise of Augmented Reality',
      category: 'Technology',
      tags: ['Augmented Reality', 'AR', 'Virtual Reality'],
      author: 'James Brown',
      date: 'May 22, 2025',
      excerpt: 'An overview of the latest trends in augmented reality technology.',
      restricted: false,
    },
    {
      id: 8,
      image: '/Events/DataPrivacyDigitalAge.png',
      title: 'Data Privacy in the Digital Age',
      category: 'Privacy',
      tags: ['Data Privacy', 'GDPR', 'Digital Rights'],
      author: 'Sophia Turner',
      date: 'May 23, 2025',
      excerpt: 'A comprehensive guide to data privacy in the modern world.',
      restricted: false,
    },
    {
      id: 9,
      image: '/Events/FutureTrendsAI.png',
      title: 'Future Trends in Artificial Intelligence',
      category: 'AI',
      tags: ['Artificial Intelligence', 'Future Trends', 'Tech'],
      author: 'John Doe',
      date: 'May 24, 2025',
      excerpt: 'Exploring the future trends in artificial intelligence and their potential impact.',
      restricted: false,
    },
  ];

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCommentSubmit = (postId, e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments(prev => ({
        ...prev,
        [postId]: [
          ...(prev[postId] || []),
          {
            id: (prev[postId]?.length || 0) + 1,
            author: 'Current User',
            text: newComment,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          }
        ]
      }));
      setNewComment('');
    }
  };
  const CommentSection = ({ postId }) => (
    <motion.div 
      className="mt-6 border-t pt-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h4 
        className="text-lg font-semibold mb-4 flex items-center"
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="mr-2">💬</span> Discussion ({comments[postId]?.length || 0})
      </motion.h4>
      
      <AnimatePresence>
        {comments[postId]?.map((comment) => (
          <motion.div
            key={comment.id}
            className="bg-gray-50 p-4 rounded-lg mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            layout
          >
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                {comment.author.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{comment.author}</p>
                <p className="text-gray-500 text-sm">{comment.date}</p>
                <p className="mt-1 text-gray-700">{comment.text}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      <motion.form 
        onSubmit={(e) => handleCommentSubmit(postId, e)}
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <textarea
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Add a comment..."
          rows="3"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        ></textarea>
        <motion.button
          type="submit"
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Post Comment
        </motion.button>
      </motion.form>
    </motion.div>
  );

  CommentSection.propTypes = {
    postId: PropTypes.number.isRequired,
  };

  return (
    <motion.section 
      className="py-16 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold text-center mb-8"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          Featured Articles
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPosts.map((post, index) => (
            <motion.div 
              key={post.id}
              className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <motion.img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover rounded-md mb-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
              
              <div className="space-y-2">
                <span className="text-sm font-medium text-blue-600">{post.category}</span>
                <h3 className="text-xl font-semibold">{post.title}</h3>
                <p className="text-gray-500 text-sm">{post.author} · {post.date}</p>
                <p className="text-gray-600">{post.excerpt}</p>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <motion.span 
                      key={tag} 
                      className="text-xs bg-gray-200 px-2 py-1 rounded"
                      whileHover={{ scale: 1.05 }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
                
                <motion.button
                  onClick={() => setSelectedPostId(selectedPostId === post.id ? null : post.id)}
                  className="text-blue-600 hover:underline flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {selectedPostId === post.id ? (
                    <>
                      <span>Hide Comments</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>Show Comments</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </motion.button>
              </div>

              <AnimatePresence>
                {selectedPostId === post.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CommentSection postId={post.id} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div 
            className="flex justify-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <nav className="flex items-center gap-1">
              <motion.button
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md border disabled:opacity-50 flex items-center"
                whileHover={{ scale: currentPage > 1 ? 1.05 : 1 }}
                whileTap={{ scale: currentPage > 1 ? 0.95 : 1 }}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </motion.button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <motion.button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-4 py-2 rounded-md ${currentPage === number ? 'bg-blue-600 text-white' : 'border hover:bg-gray-100'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {number}
                </motion.button>
              ))}

              <motion.button
                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md border disabled:opacity-50 flex items-center"
                whileHover={{ scale: currentPage < totalPages ? 1.05 : 1 }}
                whileTap={{ scale: currentPage < totalPages ? 0.95 : 1 }}
              >
                Next
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default BlogPostCard;