import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

const Alumni = () => {
  const [isMentorshipFormOpen, setIsMentorshipFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('network');

  // Search & filter states for KU CSE Network tab
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSession, setFilterSession] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterRole, setFilterRole] = useState('');

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);

  const [statsInView, setStatsInView] = useState(false);
  const statsRef = useRef(null);

  // Sample slider images
  const slides = [
    'https://images.unsplash.com/photo-1516321310762-479437144403',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c'
  ];

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sample alumni data – expand this array
  const alumniData = [
    {
      name: "Professor Dr. Kazi Masudul Alam",
      batch: "Faculty",
      session: "N/A",
      role: "Faculty Advisor",
      company: "Khulna University",
      location: "Khulna, Bangladesh",
      image_url: "https://i.ibb.co.com/bXynWfb/Money.png",
      email: "masudul@cseku.edu.bd"
    },
    {
      name: "Tahmid Hasan Tasfi",
      batch: "CSE-21",
      session: "2021",
      role: "President",
      company: "Khulna University Alumni",
      location: "Dhaka, Bangladesh",
      image_url: "https://i.ibb.co/TqxvVFb3/tasfi.jpg",
      email: "tasfi@example.com"
    },
    {
      name: "Md Tasbi Hassan",
      batch: "CSE-21",
      session: "2021",
      role: "Vice President-1",
      company: "Khulna University",
      location: "Khulna, Bangladesh",
      image_url: "https://i.ibb.co/4RhPX7Ks/tasbi.jpg",
      email: "tasbi@example.com"
    },
    {
      name: "Razu Sarder",
      batch: "CSE-22",
      session: "2022",
      role: "Vice President-2",
      company: "Freelancer",
      location: "Chittagong, Bangladesh",
      image_url: "https://via.placeholder.com/64",
      email: "razu@example.com"
    },
    // Add more real entries here
  ];

  const filteredAlumni = alumniData.filter(person => {
    const term = searchTerm.toLowerCase().trim();
    const sessionMatch  = filterSession  ? person.session?.toLowerCase().includes(filterSession.toLowerCase())  : true;
    const batchMatch    = filterBatch    ? person.batch?.toLowerCase().includes(filterBatch.toLowerCase())     : true;
    const locationMatch = filterLocation ? person.location?.toLowerCase().includes(filterLocation.toLowerCase()) : true;
    const roleMatch =
      filterRole
        ? (person.role?.toLowerCase().includes(filterRole.toLowerCase()) ||
           person.company?.toLowerCase().includes(filterRole.toLowerCase()))
        : true;

    return (
      (!term || person.name?.toLowerCase().includes(term)) &&
      sessionMatch &&
      batchMatch &&
      locationMatch &&
      roleMatch
    );
  });

  // Stats observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsInView(true);
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => {
      if (statsRef.current) observer.unobserve(statsRef.current);
    };
  }, []);

  return (
    <div className="relative overflow-hidden font-sans min-h-screen mt-12">
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
                repeatType: "reverse"
              }
            }}
          />
        ))}
      </div>

      {/* Hero */}
      <motion.section
        className="relative bg-gradient-to-r from-blue-800 to-indigo-800 text-white pt-40 pb-32 text-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: `url(${slides[currentSlide]})` }}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          />
        </AnimatePresence>

        <div className="container mx-auto px-4 relative z-10">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            Unite with the KU CSE Alumni Community
          </motion.h1>
          <motion.p
            className="text-xl max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Join a global network of Khulna University CSE graduates, sharing knowledge, opportunities, and innovation.
          </motion.p>
        </div>
      </motion.section>

      {/* Statistics */}
      <motion.section
        ref={statsRef}
        className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 2500, label: 'Alumni Worldwide', suffix: '+' },
              { value: 45, label: 'Countries Represented', suffix: '+' },
              { value: 120, label: 'Industry Leaders', suffix: '+' },
              { value: 85, label: 'Startups Founded', suffix: '+' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-md"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="text-4xl font-bold text-blue-700 mb-2"
                  animate={statsInView ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  {stat.value}{stat.suffix}
                </motion.div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ────────────────────── About KU CSE ────────────────────── */}
      <motion.section
        className="py-20 bg-white"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
              About KU CSE
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              The Department of Computer Science and Engineering at Khulna University
              has been a cornerstone of technological education in Bangladesh since 1991,
              producing skilled professionals who lead in industry, research, and innovation worldwide.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-6">
                  With a strong emphasis on both theoretical foundations and practical application,
                  KU CSE offers a comprehensive curriculum that prepares students for the rapidly
                  evolving digital landscape.
                </p>
              </div>

              <div className="mt-10 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-inner">
                <h3 className="text-2xl font-bold text-blue-800 mb-6">Key Highlights</h3>
                <ul className="space-y-4 text-gray-800 text-lg">
                  <li className="flex items-start">
                    <span className="text-blue-600 text-2xl mr-4">•</span>
                    <span>BAETE accredited 4-year B.Sc. Engineering program</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 text-2xl mr-4">•</span>
                    <span>Modern computing labs and research facilities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 text-2xl mr-4">•</span>
                    <span>Focus areas: AI, Machine Learning, Cybersecurity, Software Engineering</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 text-2xl mr-4">•</span>
                    <span>Strong alumni presence in 45+ countries</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src="/Alumni/cseku.jpg"
                alt="KU CSE Building"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-2xl font-bold">CSE Discipline Building</p>
                <p className="text-lg opacity-90">Khulna University</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ────────────────────── Tabs: Network + Spotlight ────────────────────── */}
      <motion.section
        className="py-16 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            className="flex flex-wrap justify-left border-b border-gray-300 mb-12"
            initial="hidden"
            whileInView="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
          >
            {['network', 'spotlight'].map((tab) => (
              <motion.button
                key={tab}
                className={`px-10 py-5 font-semibold text-xl transition-all duration-300 mx-3 my-2 rounded-t-xl ${
                  activeTab === tab
                    ? 'bg-white text-blue-700 shadow-md border-b-4 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-white/70'
                }`}
                onClick={() => setActiveTab(tab)}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab === 'network' ? 'KU CSE Network' : 'Spotlight'}
              </motion.button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              {/* KU CSE Network */}
              {activeTab === 'network' && (
                <div>
                  <div className="mb-12 bg-white p-8 rounded-2xl shadow-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Tasfi, Rahad"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Session / Year</label>
                        <input
                          type="text"
                          placeholder="e.g. 2021, 2019"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={filterSession}
                          onChange={(e) => setFilterSession(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Batch</label>
                        <input
                          type="text"
                          placeholder="e.g. CSE-22, CSE-18"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={filterBatch}
                          onChange={(e) => setFilterBatch(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          placeholder="e.g. Dhaka, USA, Khulna"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={filterLocation}
                          onChange={(e) => setFilterLocation(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role / Company</label>
                      <input
                        type="text"
                        placeholder="e.g. Software Engineer, Google, President"
                        className="w-full max-w-lg px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                      />
                    </div>
                  </div>

                  <p className="text-center text-gray-600 mb-10">
                    Showing <strong>{filteredAlumni.length}</strong> alumni
                    {(searchTerm || filterSession || filterBatch || filterLocation || filterRole) ? " matching your filters" : ""}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAlumni.map((person, index) => (
                      <motion.div
                        key={index}
                        className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06 }}
                      >
                        <div className="flex items-center mb-5">
                          {person.image_url ? (
                            <img
                              src={person.image_url}
                              alt={person.name}
                              className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              No Photo
                            </div>
                          )}
                          <div className="ml-5">
                            <h3 className="text-xl font-bold">{person.name}</h3>
                            <p className="text-blue-600 font-medium">{person.role}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-gray-700 flex-grow">
                          <p>Batch: {person.batch}</p>
                          <p>Session: {person.session}</p>
                          <p>Location: {person.location}</p>
                          <p>{person.company}</p>
                        </div>
                        <div className="mt-6 flex gap-3">
                          <button className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition">
                            Connect
                          </button>
                          {person.email && (
                            <a
                              href={`mailto:${person.email}`}
                              className="flex-1 border border-gray-300 py-2.5 rounded-lg text-center font-medium hover:bg-gray-50 transition"
                            >
                              Email
                            </a>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {filteredAlumni.length === 0 && (
                    <div className="text-center py-16 text-gray-500 text-xl">
                      No alumni found matching your search criteria.
                    </div>
                  )}
                </div>
              )}

              {/* Spotlight */}
              {activeTab === 'spotlight' && (
                <div className="space-y-16">
                  <div>
                    <h2 className="text-4xl font-bold text-center mb-12 text-blue-900">Featured KU CSE </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {[
                        { name: 'Md Anjir Hossain', role: 'General Secretary', id: '210230', batch: 'CSE-21', img: 'https://i.ibb.co/1thHGwzw/anjir.jpg' },
                        { name: 'Sohag Chandra', role: 'Joint Secretary', id: '220238', batch: 'CSE-22', img: 'https://i.ibb.co/jZ5W0PJJ/sohag.jpg' },
                        { name: 'Md Ashiquzzaman Rahad', role: 'Treasurer', id: '210201', batch: 'CSE-21', img: 'https://i.ibb.co/yB7kHjfZ/rahad.jpg' },
                        { name: 'Nahid Hassan', role: 'Programming Campaign Secretary', id: '220229', batch: 'CSE-22', img: 'https://i.ibb.co/cKHbZNg6/nahid.jpg' },
                      ].map((member, i) => (
                        <motion.div
                          key={i}
                          className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <img src={member.img} alt={member.name} className="w-full h-64 object-cover" />
                          <div className="p-6">
                            <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                            <p className="text-blue-600 font-semibold mb-3">{member.role}</p>
                            <p className="text-gray-600">ID: {member.id} • Batch: {member.batch}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-4xl font-bold text-center mb-12 text-blue-900">Proud Achievements</h2>
                    <div className="space-y-8 max-w-4xl mx-auto">
                      {[
                        { year: 2024, title: 'Global Hackathon Champions', desc: '1st place – Global CodeFest (Cybersecurity)' },
                        { year: 2023, title: 'Startup of the Year', desc: 'TechTrend – Innovative AI Platform' },
                        { year: 2022, title: 'IEEE Best Paper Award', desc: 'Work on Distributed Systems' },
                        { year: 2021, title: 'National Innovation Award', desc: 'Sustainable Computing Project' },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          className="flex items-start bg-white p-7 rounded-xl shadow-md border-l-4 border-blue-600 hover:border-blue-800 transition-colors"
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.15 }}
                        >
                          <div className="bg-blue-100 text-blue-800 px-6 py-4 rounded-lg font-bold text-2xl mr-6 flex-shrink-0">
                            {item.year}
                          </div>
                          <div>
                            <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                            <p className="text-gray-700 text-lg">{item.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Mentorship Modal */}
      <AnimatePresence>
        {isMentorshipFormOpen && (
          <MentorshipForm onClose={() => setIsMentorshipFormOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

const MentorshipForm = ({ onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-8 text-white">
          <h2 className="text-3xl font-bold">Become a Mentor</h2>
          <p className="mt-2 opacity-90">Share your experience with the next generation of KU CSE talents</p>
        </div>

        <form className="p-8 space-y-6">
          <input type="text" placeholder="Full Name" className="w-full p-4 border rounded-lg" />
          <input type="text" placeholder="Batch / Passing Year" className="w-full p-4 border rounded-lg" />
          <input type="text" placeholder="Current Position" className="w-full p-4 border rounded-lg" />
          <input type="text" placeholder="Company / Organization" className="w-full p-4 border rounded-lg" />
          <textarea
            placeholder="Areas you'd like to mentor in (AI, Web Dev, Competitive Programming, Career Advice...)"
            className="w-full p-4 border rounded-lg min-h-[120px]"
          ></textarea>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit Application
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

MentorshipForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Alumni;