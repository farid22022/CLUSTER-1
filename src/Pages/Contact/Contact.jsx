import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import {
  getTeamMembers,  
  getFAQs,
} from '../../api';   

const Contact = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [archiveYearFilter, setArchiveYearFilter] = useState('');

  // Data states
  const [currentTeam, setCurrentTeam] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [loadingFaqs, setLoadingFaqs] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCurrentTeam();
    fetchFAQs();
  }, []);

  const fetchCurrentTeam = async () => {
    setLoadingTeam(true);
    try {
      const res = await getTeamMembers(); // Fetches current year's team
      setCurrentTeam(res.data || []);
    } catch (err) {
      console.error('Failed to load team:', err);
      Swal.fire('Error', 'Failed to load current team members', 'error');
    } finally {
      setLoadingTeam(false);
    }
  };

  const fetchFAQs = async () => {
    setLoadingFaqs(true);
    try {
      const res = await getFAQs();
      setFaqs(res.data || []);
    } catch (err) {
      console.error('Failed to load FAQs:', err);
      Swal.fire('Error', 'Failed to load FAQs', 'error');
    } finally {
      setLoadingFaqs(false);
    }
  };

  const socialLinks = [
    { name: 'Facebook', icon: '/logo/facebook.png', url: 'https://facebook.com/clusterku' },
    { name: 'Twitter', icon: '/logo/x.jpg', url: 'https://x.com/clusterku' },
    { name: 'LinkedIn', icon: '/logo/linkedin.png', url: 'https://linkedin.com/company/cluster-ku' },
    { name: 'Instagram', icon: '/logo/instagram.png', url: 'https://instagram.com/clusterku' },
  ];

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <div className="relative overflow-hidden font-sans min-h-screen">
      {/* Floating particles */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-100 opacity-10"
            style={{
              width: Math.random() * 100 + 20,
              height: Math.random() * 100 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              transition: {
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-r from-blue-800 to-indigo-800 text-white pt-40 pb-32 text-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            Get in Touch with CLUSTER of KU
          </motion.h1>
          <motion.p
            className="text-xl max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Reach out to the Club for Updated Search on Computers (CLUSTER), Khulna University CSE — your vibrant student-led hub for tech enthusiasts.
          </motion.p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              onClick={() => setIsFormOpen(true)}
              className="bg-white text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 shadow-lg transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send a Message
            </motion.button>
            <motion.button
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Our Events
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Contact Information */}
      <motion.section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Get in Touch
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Contact Details */}
            <motion.div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-semibold mb-6 text-blue-800">Contact Details</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">📞</div>
                  <div>
                    <h4 className="font-medium">Phone</h4>
                    <p>+880-41-720171-3 (Ext. 1069 office, Ext. 1105 head)</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">✉️</div>
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <a href="mailto:support@cseku.ac.bd" className="text-blue-600 hover:underline">
                      support@cseku.ac.bd
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">📍</div>
                  <div>
                    <h4 className="font-medium">Location</h4>
                    <p>Computer Science Building, Khulna University, Gollamari, Khulna 9208, Bangladesh</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">🌐</div>
                  <div>
                    <h4 className="font-medium">Social Media</h4>
                    <div className="flex space-x-4 mt-2">
                      {socialLinks.map((social, i) => (
                        <motion.a
                          key={i}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-100 p-3 rounded-full hover:bg-blue-200 transition-colors"
                          whileHover={{ scale: 1.1 }}
                        >
                          <img src={social.icon} alt={social.name} className="w-5 h-5 object-contain" />
                        </motion.a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Campus Image */}
            <motion.div className="relative rounded-2xl overflow-hidden shadow-2xl h-96">
              <img
                src="/Alumni/academic1.jpg"
                alt="Khulna University Campus"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <p className="text-white text-lg">Khulna University Campus</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Current Executive Team – from API */}
      <motion.section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Current Executive Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              2024 – 2025 Committee
            </p>
          </div>

          {loadingTeam ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
            </div>
          ) : currentTeam.length === 0 ? (
            <p className="text-center text-gray-500">No current team members found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentTeam.map((member, i) => (
                <motion.div
                  key={i}
                  className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -8 }}
                >
                  <img
                    src={member.image_url || 'https://via.placeholder.com/150'}
                    alt={member.name}
                    className="w-40 h-40 rounded-full mx-auto mb-4 object-cover border-4 border-blue-100"
                  />
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-blue-600 font-medium">{member.designation}</p>
                  <p className="text-gray-500 text-sm mt-1">ID: {member.student_id}</p>
                  {member.quote && (
                    <p className="text-gray-600 text-sm italic mt-3">&quot;{member.quote}&quot;</p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* Archive / Past Executives (static for now – can be made dynamic later) */}
      {/* ... your existing archive section remains unchanged ... */}

      {/* FAQ Section – from API */}
      <motion.section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Find answers to common questions about CLUSTER</p>
          </div>

          {loadingFaqs ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
            </div>
          ) : faqs.length === 0 ? (
            <p className="text-center text-gray-500">No FAQs available at the moment</p>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-white"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    onClick={() => toggleQuestion(index)}
                  >
                    <h3 className="font-semibold text-lg">{faq.question}</h3>
                    <motion.span
                      animate={{ rotate: activeQuestion === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      ▼
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {activeQuestion === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 text-gray-600 border-t">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* Contact Form Modal – remains unchanged */}
      {/* ... your existing modal code ... */}
    </div>
  );
};

export default Contact;