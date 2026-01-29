

import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

const Alumni = () => {
  const [isMentorshipFormOpen, setIsMentorshipFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [ setIsScrolled] = useState(false);
  const statsRef = useRef(null);
  const [statsInView, setStatsInView] = useState(false);
    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Sample images for slider
  const slides = [
    // '/Alumni/cseku.jpg',
    'https://images.unsplash.com/photo-1516321310762-479437144403',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c'
  ];

  // Handle scroll for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setIsScrolled]);

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Stats counter observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsInView(true);
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);


  const floatingAnimation = {
    float: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

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
      

      {/* Hero Section with Slider */}
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
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              onClick={() => setIsMentorshipFormOpen(true)}
              className="bg-white text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              Join as Mentor
            </motion.button>
            <motion.button
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Alumni Directory
            </motion.button>
          </div>
        </div>

        {/* Animated scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-8 h-12 rounded-full border-2 border-white flex justify-center p-1">
            <motion.div 
              className="w-2 h-2 bg-white rounded-full"
              animate={{ y: [0, 8] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Statistics Section */}
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

      {/* Department Info Section */}
      <motion.section 
        className="py-20 bg-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex flex-col lg:flex-row gap-12 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            <motion.div 
              className="lg:w-1/2"
              variants={{
                hidden: { x: -50, opacity: 0 },
                visible: { x: 0, opacity: 1 }
              }}
            >
              <h2 className="text-3xl font-bold mb-6">About KU CSE</h2>
              <p className="text-lg mb-4">
                The Department of Computer Science and Engineering at Khulna University was established in 1991 and has since become one of the premier institutions for computer science education in Bangladesh.
              </p>
              <motion.div 
                className="bg-gray-50 p-6 rounded-xl border border-gray-200"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-semibold mb-3">Key Facts:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Established: 1991</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>4-year B.Sc. Engineering program</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Highly qualified faculty members</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Modern labs and research facilities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Accredited by BAETE</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Industry-academia collaboration</span>
                  </li>
                </ul>
              </motion.div>
            </motion.div>

            <motion.div 
              className="lg:w-1/2"
              variants={{
                hidden: { x: 50, opacity: 0 },
                visible: { x: 0, opacity: 1 }
              }}
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <motion.img
                  src="/Alumni/cseku.jpg"
                  alt="KU CSE Building"
                  className="w-full h-auto"
                  initial={{ scale: 1.1 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                />
                <motion.div 
                  className="absolute flex items-end p-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <p className="text-white text-lg">CSE Building, Khulna University</p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Alumni Tabs Section */}
      <motion.section 
        className="py-16 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex flex-wrap border-b border-gray-200 mb-8"
            initial="hidden"
            whileInView="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            viewport={{ once: true }}
          >
            {['about', 'directory', 'spotlight', 'achievements'].map((tab) => (
              <motion.button
                key={tab}
                className={`px-6 py-3 font-medium capitalize ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab(tab)}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab}
              </motion.button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'about' && (
                <div className="grid md:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                    <p className="text-gray-700 mb-4">
                      The CSE department at KU aims to produce world-class computer engineers through quality education and research, preparing students to meet the challenges of the digital age.
                    </p>
                    <p className="text-gray-700">
                      Our alumni network strengthens this mission by providing mentorship, career opportunities, and maintaining connections between graduates.
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-2xl font-bold mb-4">Programs Offered</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <span className="text-blue-600 mr-3">•</span>
                        <span>B.Sc. in Computer Science & Engineering</span>
                      </li>
                      <li className="flex items-start p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <span className="text-blue-600 mr-3">•</span>
                        <span>M.Sc. in Computer Science & Engineering</span>
                      </li>
                      <li className="flex items-start p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <span className="text-blue-600 mr-3">•</span>
                        <span>Ph.D. in Computer Science & Engineering</span>
                      </li>
                      <li className="flex items-start p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <span className="text-blue-600 mr-3">•</span>
                        <span>Executive Programs for Professionals</span>
                      </li>
                    </ul>
                  </motion.div>
                </div>
              )}

{activeTab === 'directory' && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[
      { 
        name: "Professor Dr. Kazi Masudul Alam",
        batch: "Director",
        role: "Faculty Advisor",
        company: "Khulna University",
        image_url: "https://i.ibb.co.com/bXynWfb/Money.png",
        email: "username1@email.com"
      },
      { 
        name: "Tahmid Hasan Tasfi",
        batch: "210218",
        role: "President",
        company: "Khulna University",
        image_url: "https://i.ibb.co/TqxvVFb3/tasfi.jpg",
        email: "username1@email.com"
      },
      { 
        name: "Md Tasbi Hassan",
        batch: "210216",
        role: "Vice President-1",
        company: "Khulna University",
        image_url: "https://i.ibb.co/4RhPX7Ks/tasbi.jpg",
        email: "username2@email.com"
      },
      { 
        name: "Razu Sarder",
        batch: "220220",
        role: "Vice President-2",
        company: "Khulna University",
        image_url: "https://example.com/image3.jpg",
        email: "username3@email.com"
      },
    ].map((person, index) => (
      <motion.div
        key={index}
        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <div className="flex items-center mb-4">
          {person.image_url ? (
            <img 
              src={person.image_url} 
              alt={person.name}
              className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
          )}
          <div className="ml-4">
            <h3 className="text-xl font-semibold">{person.name}</h3>
            <p className="text-gray-600">{person.role}</p>
          </div>
        </div>
        <div className="flex-grow space-y-1">
          <p className="text-gray-600">Batch: {person.batch}</p>
          <p className="text-gray-600">{person.company}</p>
          {person.email && (
            <p className="text-gray-600 text-sm truncate">{person.email}</p>
          )}
        </div>
        <div className="flex mt-4 space-x-2">
          <motion.button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Connect
          </motion.button>
          {person.email && (
            <motion.a
              href={`mailto:${person.email}`}
              className="px-4 py-2 border border-gray-300 rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Email
            </motion.a>
          )}
        </div>
      </motion.div>
    ))}
  </div>
)}

              {activeTab === 'spotlight' && (
  <div className="grid md:grid-cols-2 gap-8">
    {[
      
      // New committee members
      {
        name: 'Md Anjir Hossain',
        achievement: 'General Secretary',
        description: 'Student ID: 210230 | Email: username4@email.com',
        image: 'https://i.ibb.co/1thHGwzw/anjir.jpg'
      },
      {
        name: 'Sohag Chandra',
        achievement: 'Joint Secretary',
        description: 'Student ID: 220238 | Email: username5@email.com',
        image: 'https://i.ibb.co/jZ5W0PJJ/sohag.jpg'
      },
      {
        name: 'Md Ashiquzzaman Rahad',
        achievement: 'Treasurer',
        description: 'Student ID: 210201 | Email: username6@email.com',
        image: 'https://i.ibb.co/yB7kHjfZ/rahad.jpg'
      },
      {
        name: 'Nahid Hassan',
        achievement: 'Programming Campaign Secretary',
        description: 'Student ID: 220229 | Email: username7@email.com',
        image: 'https://i.ibb.co/cKHbZNg6/nahid.jpg'
      }
    ].map((spotlight, index) => (
      <motion.div
        key={index}
        className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4"
        initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.2 }}
      >
        <img
          src={spotlight.image}
          alt={spotlight.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
        />
        <div>
          <h3 className="text-xl font-semibold mb-2">{spotlight.name}</h3>
          <p className="text-blue-600 font-medium">{spotlight.achievement}</p>
          <p className="text-gray-600 mt-2">{spotlight.description}</p>
        </div>
      </motion.div>
    ))}
  </div>
)}


              {activeTab === 'achievements' && (
                <div className="space-y-6">
                  {[
                    {
                      year: '2024',
                      title: 'International Hackathon Winners',
                      description: 'KU CSE alumni team secured 1st place in the Global CodeFest, solving complex problems in cybersecurity.'
                    },
                    {
                      year: '2023',
                      title: 'Startup of the Year',
                      description: 'Alumni-founded startup "TechTrend" was awarded Startup of the Year for its innovative AI platform.'
                    },
                    {
                      year: '2022',
                      title: 'IEEE Best Paper Award',
                      description: 'A group of KU CSE alumni received the IEEE Best Paper Award for their work on distributed systems.'
                    },
                    {
                      year: '2021',
                      title: 'National Innovation Award',
                      description: 'Alumni project on sustainable computing received the Presidential Innovation Award.'
                    },
                    {
                      year: '2020',
                      title: 'Global Tech Leader',
                      description: 'KU CSE alum named among Top 100 Global Tech Leaders by Technology Review.'
                    },
                    {
                      year: '2019',
                      title: 'Patent Award',
                      description: 'Alumni team granted patent for novel data compression algorithm.'
                    },
                  ].map((achievement, index) => (
                    <motion.div
                      key={index}
                      className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600 flex items-start"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded mr-4 font-bold">
                        {achievement.year}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{achievement.title}</h3>
                        <p className="text-gray-600">{achievement.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Events Section */}
      <motion.section 
        className="py-20 bg-gradient-to-br from-white to-blue-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              Upcoming Events & Reunions
            </motion.h2>
            <motion.p 
              className="max-w-2xl mx-auto text-gray-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              Connect with fellow alumni at our exclusive events and gatherings
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Annual Alumni Meet 2024",
                date: "15 December 2024",
                location: "KU Campus, Khulna",
                description: "Join us for the biggest gathering of KU CSE alumni with keynote speakers and networking sessions."
              },
              {
                title: "Tech Leadership Summit",
                date: "22-24 March 2025",
                location: "Dhaka, Bangladesh",
                description: "Exclusive event for senior tech leaders featuring workshops and panel discussions."
              },
              {
                title: "Global Alumni Conference",
                date: "10-12 September 2025",
                location: "Virtual Event",
                description: "Connect with alumni worldwide in our flagship virtual conference featuring industry pioneers."
              }
            ].map((event, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                viewport={{ once: true }}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{event.title}</h3>
                    <motion.div 
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                    >
                      Register
                    </motion.div>
                  </div>
                  <div className="flex items-center text-gray-600 mb-3">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M1 4c0-1.1.9-2 2-2h14a2 2 0 012 2v14a2 2 0 01-2 2H3a2 2 0 01-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z"/>
                    </svg>
                    {event.date}
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2.5a7.5 7.5 0 017.5 7.5c0 2.982-1.8 5.545-4.375 6.674V18l-3.125-1.875L7.5 18v-1.326A7.5 7.5 0 0110 2.5zm0 16.25a8.75 8.75 0 100-17.5 8.75 8.75 0 000 17.5z"/>
                    </svg>
                    {event.location}
                  </div>
                  <p className="text-gray-700 mb-4">{event.description}</p>
                  <motion.button
                    className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium"
                    whileHover={{ backgroundColor: "#2563eb" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Details
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        className="py-20 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              Alumni Success Stories
            </motion.h2>
            <motion.p 
              className="max-w-2xl mx-auto text-gray-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              Hear from our graduates about their journey and how KU CSE shaped their careers
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Fatima Ahmed",
                role: "AI Research Lead, Google",
                quote: "The research opportunities at KU CSE gave me the foundation to pursue cutting-edge AI work at the world's top tech companies.",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
              },
              {
                name: "Rahim Khan",
                role: "CTO, TechNova",
                quote: "KU CSE's industry partnerships provided invaluable real-world experience that prepared me for leadership roles in tech startups.",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a"
              },
              {
                name: "Tasnim Rahman",
                role: "Senior Engineer, Microsoft",
                quote: "The problem-solving approach I developed at KU CSE continues to drive my success in developing enterprise-scale solutions.",
                image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                viewport={{ once: true }}
                variants={floatingAnimation}
                animate="float"
              >
                <div className="absolute top-0 left-8 transform -translate-y-1/2">
                  <div className="bg-blue-600 p-3 rounded-full">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/>
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"/>
                    </svg>
                  </div>
                </div>
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
                  />
                  <div className="ml-4">
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-blue-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">&quot;{testimonial.quote}&quot;</p>
                <div className="flex mt-6">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      className="w-5 h-5 text-yellow-400" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Mentorship Form Modal */}
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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Become a Mentor</h2>
          <p>Guide the next generation of KU CSE students</p>
        </div>
        
        <form className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Batch</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50"
                placeholder="e.g., 2015"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Role</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50"
                placeholder="e.g., Software Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50"
                placeholder="e.g., Google"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Areas of Expertise</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50"
                placeholder="List your areas of expertise"
                rows={3}
              ></textarea>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 mt-8">
            <motion.button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
              whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Application
            </motion.button>
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