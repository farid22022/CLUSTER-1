import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


const Contact = () => {
  const socialLinks = [
    { name: 'Facebook', icon: '/logo/facebook.png', url: 'https://facebook.com' },
    { name: 'Twitter', icon: '/logo/x.jpg', url: 'https://twitter.com' },
    { name: 'LinkedIn', icon: '/logo/linkedin.png', url: 'https://linkedin.com' },
    { name: 'Instagram', icon: '/logo/instagram.png', url: 'https://instagram.com' },
  ];

  const [activeQuestion, setActiveQuestion] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  const faqs = [
    {
      question: "How can I join CLUSTER?",
      answer: "Membership is open to all KU CSE students. Attend our orientation session at the beginning of each semester or contact any executive member for details."
    },
    {
      question: "What kind of events does CLUSTER organize?",
      answer: "We organize programming contests, hackathons, workshops on emerging technologies, seminars with industry experts, and networking events."
    },
    {
      question: "Can alumni participate in CLUSTER activities?",
      answer: "Absolutely! Alumni are welcome to participate as mentors, guest speakers, or event sponsors. Contact us for collaboration opportunities."
    },
    {
      question: "How often does CLUSTER meet?",
      answer: "We hold weekly meetings every Thursday at 4 PM in the CSE building computer lab. Special events are scheduled throughout the semester."
    }
  ];

  const teamMembers = [
    {
      "designation": "Director",
      "name": "Professor Dr. Kazi Masudul Alam",
      "student_id": "210123",
      "image_url": "https://i.ibb.co.com/bXynWfb/Money.png", 
      "facebook_url": "https://facebook.com/username1",
      "linkedin_url": "https://linkedin.com/in/username1",
      "email": "username1@email.com",
      "quote": "Leading with vision and empowering excellence."
    },
    {
      "designation": "President",
      "name": "Tahmid Hasan Tasfi",
      "student_id": "210218",
      "image_url": "https://i.ibb.co/TqxvVFb3/tasfi.jpg",
      "facebook_url": "https://facebook.com/username1",
      "linkedin_url": "https://linkedin.com/in/username1",
      "email": "username1@email.com"
    },
    {
      "designation": "Vice President-1",
      "name": "Md Tasbi Hassan",
      "student_id": "210216",
      "image_url": "https://i.ibb.co/4RhPX7Ks/tasbi.jpg",
      "facebook_url": "https://facebook.com/username2",
      "linkedin_url": "https://linkedin.com/in/username2",
      "email": "username2@email.com"
    },
    {
      "designation": "Vice President-2",
      "name": "Razu Sarder",
      "student_id": "220220",
      "image_url": "https://i.ibb.co/tpDz54TM/razu.jpg",
      "facebook_url": "https://facebook.com/username3",
      "linkedin_url": "https://linkedin.com/in/username3",
      "email": "username3@email.com"
    },
    {
      "designation": "General Secretary",
      "name": "Md Anjir Hossain",
      "student_id": "210230",
      "image_url": "https://i.ibb.co/1thHGwzw/anjir.jpg",
      "facebook_url": "https://facebook.com/username4",
      "linkedin_url": "https://linkedin.com/in/username4",
      "email": "username4@email.com"
    },
    {
      "designation": "Joint Secretary",
      "name": "Sohag Chandra",
      "student_id": "220238",
      "image_url": "https://i.ibb.co/jZ5W0PJJ/sohag.jpg",
      "facebook_url": "https://facebook.com/username5",
      "linkedin_url": "https://linkedin.com/in/username5",
      "email": "username5@email.com"
    },
    {
      "designation": "Treasurer",
      "name": "Md Ashiquzzaman Rahad",
      "student_id": "210201",
      "image_url": "https://i.ibb.co/yB7kHjfZ/rahad.jpg",
      "facebook_url": "https://facebook.com/username6",
      "linkedin_url": "https://linkedin.com/in/username6",
      "email": "username6@email.com"
    },
    {
      "designation": "Programming Campaign Secretary",
      "name": "Nahid Hassan",
      "student_id": "220229",
      "image_url": "https://i.ibb.co/cKHbZNg6/nahid.jpg",
      "facebook_url": "https://facebook.com/username7",
      "linkedin_url": "https://linkedin.com/in/username7",
      "email": "username7@email.com"
    },
    {
      "designation": "Workshop Secretary",
      "name": "Muhammad Fahim",
      "student_id": "210210",
      "image_url": "https://i.ibb.co/nq871XvD/Fahim.png",
      "facebook_url": "https://facebook.com/username8",
      "linkedin_url": "https://linkedin.com/in/username8",
      "email": "username8@email.com"
    },
    {
      "designation": "Assistant Workshop Secretary",
      "name": "Sardar Muhammad Sakib Hossain",
      "student_id": "230222",
      "image_url": "https://i.ibb.co.com/gDLBssv/230222-Sardar-Muhammad-Sakib-Hossain.jpg",
      "facebook_url": "https://facebook.com/username9",
      "linkedin_url": "https://linkedin.com/in/username9",
      "email": "username9@email.com"
    },
    {
      "designation": "WISE Secretary",
      "name": "Sharmika Das Banhi",
      "student_id": "210204",
      "image_url": "https://example.com/image10.jpg",
      "facebook_url": "https://facebook.com/username10",
      "linkedin_url": "https://linkedin.com/in/username10",
      "email": "username10@email.com"
    },
    {
      "designation": "Public Relations Secretary",
      "name": "Radhika Chowdhury",
      "student_id": "220239",
      "image_url": "https://example.com/image11.jpg",
      "facebook_url": "https://facebook.com/username11",
      "linkedin_url": "https://linkedin.com/in/username11",
      "email": "username11@email.com"
    },
    {
      "designation": "IT Secretary",
      "name": "Mohaiminul Islam Saad",
      "student_id": "220201",
      "image_url": "https://i.ibb.co/HTLfg95m/shaad.jpg",
      "facebook_url": "https://facebook.com/username12",
      "linkedin_url": "https://linkedin.com/in/username12",
      "email": "username12@email.com"
    },
    {
      "designation": "Assistant IT Secretary",
      "name": "Kazi Rifat Morshed",
      "student_id": "230220",
      "image_url": "https://i.ibb.co/V0RKRzgt/rifat.jpg",
      "facebook_url": "https://facebook.com/username13",
      "linkedin_url": "https://linkedin.com/in/username13",
      "email": "username13@email.com"
    },
    {
      "designation": "Campaign Secretary",
      "name": "Md Abdullah Al Mahin",
      "student_id": "230210",
      "image_url": "https://i.ibb.co.com/nCW3Pj2/Mahin.png",
      "facebook_url": "https://facebook.com/username14",
      "linkedin_url": "https://linkedin.com/in/username14",
      "email": "username14@email.com"
    },
    {
      "designation": "Cultural Secretary",
      "name": "SM Shibly Noman",
      "student_id": "230206",
      "image_url": "https://i.ibb.co.com/64dCbMy/230206-shibly.jpg",
      "facebook_url": "https://facebook.com/username15",
      "linkedin_url": "https://linkedin.com/in/username15",
      "email": "username15@email.com"
    },
    {
      "designation": "Member-1 (MSc.)",
      "name": "Istyaque Ahammed",
      "student_id": "M.Sc. 250235",
      "image_url": "https://i.ibb.co/wFzXp8KJ/istyake.jpg",
      "facebook_url": "https://facebook.com/username16",
      "linkedin_url": "https://linkedin.com/in/username16",
      "email": "username16@email.com"
    },
    {
      "designation": "Member-2 (BSc.)",
      "name": "Sneha Shah",
      "student_id": "240242",
      "image_url": "https://i.ibb.co/tpDz54TM/razu.jpg",
      "facebook_url": "https://facebook.com/username17",
      "linkedin_url": "https://linkedin.com/in/username17",
      "email": "username17@email.com"
    },
    {
      "designation": "Member-3 (BSc.)",
      "name": "Towhid Al Mahmud",
      "student_id": "240239",
      "image_url": "https://example.com/image18.jpg",
      "facebook_url": "https://facebook.com/username18",
      "linkedin_url": "https://linkedin.com/in/username18",
      "email": "username18@email.com"
    },
    {
      "designation": "Member-4 (BSc.)",
      "name": "Abir Khan Siam",
      "student_id": "240228",
      "image_url": "https://example.com/image19.jpg",
      "facebook_url": "https://facebook.com/username19",
      "linkedin_url": "https://linkedin.com/in/username19",
      "email": "username19@email.com"
    }
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
                repeatType: "reverse"
              }
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
        Reach out to the Club for Updated Search on Computers (CLUSTER), Khulna University CSE vibrant student-led hub for tech enthusiasts.
      </motion.p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              onClick={() => setIsFormOpen(true)}
              className="bg-white text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              Send a Message
            </motion.button>
            <motion.button
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Our Events
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

      {/* Contact Information Section */}
      <motion.section
        className="py-20 bg-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Get in Touch
          </motion.h2>
          
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            initial="hidden"
            whileInView="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1, 
                transition: { 
                  staggerChildren: 0.2 
                } 
              },
            }}
            viewport={{ once: true }}
          >
            <motion.div
              className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg border border-gray-100"
              variants={{
                hidden: { x: -50, opacity: 0 },
                visible: { x: 0, opacity: 1 },
              }}
            >
              <h3 className="text-2xl font-semibold mb-6 text-blue-800">Contact Details</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Phone</h4>
                    <p className="text-gray-600">+880-41-720171-3 (Ext. 1069 office, Ext. 1105 head)</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Email</h4>
                    <a 
                      href="mailto:support@cseku.ac.bd" 
                      className="text-blue-600 hover:underline"
                    >
                      support@cseku.ac.bd
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Location</h4>
                    <p className="text-gray-600">Computer Science Building, Khulna University, Gollamari, Khulna 9208, Bangladesh</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 0h3a1 1 0 011 1v7a1 1 0 01-1 1h-3v2h2a1 1 0 011 1v3a1 1 0 01-1 1h-2v2h2a1 1 0 011 1v4a1 1 0 01-1 1H6a1 1 0 01-1-1v-4a1 1 0 011-1h2v-2H6a1 1 0 01-1-1v-3a1 1 0 011-1h2V9H5a1 1 0 01-1-1V1a1 1 0 011-1h6z"/>
                    </svg>
                  </div>
                  <div>
      <h4 className="font-medium text-gray-800">Social Media</h4>
      <div className="flex space-x-4 mt-2">
        {socialLinks.map((social, index) => (
          <motion.a
            key={index}
            href={social.url}
            className="bg-blue-100 p-3 rounded-full hover:bg-blue-200 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="sr-only">{social.name}</span>
            <img
              src={social.icon}
              alt={`${social.name} icon`}
              className="w-5 h-5 object-contain"
            />
          </motion.a>
        ))}
      </div>
    </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
      className="relative rounded-2xl overflow-hidden shadow-2xl h-96"
      variants={{
        hidden: { x: 50, opacity: 0 },
        visible: { x: 0, opacity: 1 },
      }}
    >
      <img
        src="/Alumni/academic1.jpg"
        alt="Khulna University Campus"
        className="w-full h-full object-cover rounded-xl"
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        viewport={{ once: true }}
      >
        <p className="text-white text-lg">Khulna University Campus</p>
      </motion.div>
    </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Team Contacts Section */}
      <motion.section 
        className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50"
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
              Our Executive Team
            </motion.h2>
            <motion.p 
              className="max-w-2xl mx-auto text-gray-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              Contact our team members directly for specific inquiries
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}
              >
                <img src={member.image_url} className='h-48 rounded-lg mx-auto mb-4' alt="" />
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-blue-600 mb-4">{member.designation}</p>
                <div className="space-y-2 text-left">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                    <a href={`mailto:${member.email}`} className="text-gray-600 hover:text-blue-600 hover:underline">
                      {member.email}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                    <a href={`tel:${member.phone}`} className="text-gray-600 hover:text-blue-600 hover:underline">
                      {member.phone || 'Not provided'}
                    </a>
                  </div>
                </div>
                <motion.button
                  onClick={() => setIsFormOpen(true)}
                  className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg font-medium"
                  whileHover={{ backgroundColor: "#2563eb" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact {member.name.split(' ')[0]}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        className="py-20 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p 
              className="max-w-2xl mx-auto text-gray-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              Find answers to common questions about CLUSTER
            </motion.p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <button
                  className="w-full p-6 text-left flex justify-between items-center bg-blue-50 hover:bg-blue-100 transition-colors"
                  onClick={() => toggleQuestion(index)}
                >
                  <h3 className="font-semibold text-lg">{faq.question}</h3>
                  <motion.div
                    animate={{ rotate: activeQuestion === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
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
                      <div className="p-6 border-t border-gray-200 text-gray-600">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">Contact CLUSTER</h2>
                    <p>Reach out to join or collaborate with our computer club</p>
                  </div>
                  <motion.button
                    onClick={() => setIsFormOpen(false)}
                    className="p-2 rounded-full hover:bg-black/10"
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </div>
              
              <form className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Batch (Optional)</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 2015"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="+880 1XXX XXXXXX"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select a subject</option>
                      <option>Membership Inquiry</option>
                      <option>Event Collaboration</option>
                      <option>Technical Support</option>
                      <option>Sponsorship</option>
                      <option>Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 mt-8">
                  <motion.button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                    whileHover={{ scale: 1.05, backgroundColor: '#2563eb' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Submit Message
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contact;