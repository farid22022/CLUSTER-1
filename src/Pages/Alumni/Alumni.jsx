import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail,  MapPin,  Calendar, Loader2, Search,  Rocket, GraduationCap, Building, CheckCircle, ExternalLink, ChevronDown } from 'lucide-react';
import Swal from 'sweetalert2';
import { createAlumni, getAlumni } from "../../api";

const Alumni = () => {
  // Main states
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMentorshipFormOpen, setIsMentorshipFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('network');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [statsInView, setStatsInView] = useState(false);
  const statsRef = useRef(null);

  // Search & filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSession, setFilterSession] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterCompany, setFilterCompany] = useState('');

  // Batch dropdown state
  const [isBatchDropdownOpen, setIsBatchDropdownOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    batch: '',
    session: '',
    role: '',
    company: '',
    location: '',
    image_url: '',
    email: '',
    phone_number: '',
    graduation_year: '',
    passing_year: '',
    current_role: '',
    current_status: 'employed',
    linkedin_url: '',
    is_graduated: true,
    is_employed: true
  });

  // Generate batch options from CSE-91 to CSE-50 (assuming 1991 to 2050)
  const batchOptions = Array.from({ length: 60 }, (_, i) => {
    const year = 1991 + i; // Starting from 1991
    return `CSE-${year.toString().slice(-2)}`; // CSE-91, CSE-92, ..., CSE-50
  });

  // Slides for hero section
  const slides = [
    'https://images.unsplash.com/photo-1516321310762-479437144403?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
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
    fetchAlumni();
  }, []);

  // Fetch alumni data
  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const res = await getAlumni();
      
      // Filter: Only show approved alumni who are graduated AND employed
      // Also filter out committee members who are not graduated
      const graduatedEmployedAlumni = res.data.filter(a => {
        // Must be approved
        if (a.approval_status !== 'approved') return false;
        
        // Check if it's a current committee member (not graduated)
        const isCurrentCommittee = a.batch?.toLowerCase().includes('committee') || 
                                  a.current_role?.toLowerCase().includes('secretary') ||
                                  a.current_role?.toLowerCase().includes('president') ||
                                  a.current_role?.toLowerCase().includes('treasurer') ||
                                  a.current_role?.toLowerCase().includes('coordinator');
        
        // Skip if it's a current committee member without graduation info
        if (isCurrentCommittee && (!a.passing_year && !a.graduation_year)) {
          return false;
        }
        
        // Check graduation status
        const hasGraduated = a.passing_year || 
                            a.graduation_year || 
                            (a.batch && !a.batch.toLowerCase().includes('committee'));
        
        // Check employment status
        const isEmployed = a.current_role && 
                          a.current_role.trim() !== '' && 
                          !a.current_role.toLowerCase().includes('student');
        
        return hasGraduated && isEmployed;
      });
      
      setAlumni(graduatedEmployedAlumni);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to load alumni data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filter alumni based on search criteria
  const filteredAlumni = alumni.filter(person => {
    const term = searchTerm.toLowerCase().trim();
    const sessionMatch = filterSession ? 
      (person.session?.toLowerCase().includes(filterSession.toLowerCase()) || 
       person.passing_year?.toString().includes(filterSession)) : true;
    
    const batchMatch = filterBatch ? 
      person.batch?.toLowerCase().includes(filterBatch.toLowerCase()) : true;
    
    const locationMatch = filterLocation ? 
      person.location?.toLowerCase().includes(filterLocation.toLowerCase()) : true;
    
    const roleMatch = filterRole ? 
      (person.current_role?.toLowerCase().includes(filterRole.toLowerCase()) ||
       person.role?.toLowerCase().includes(filterRole.toLowerCase())) : true;
    
    const companyMatch = filterCompany ? 
      person.company?.toLowerCase().includes(filterCompany.toLowerCase()) : true;

    return (
      (!term || 
        person.name?.toLowerCase().includes(term) ||
        person.company?.toLowerCase().includes(term) ||
        person.current_role?.toLowerCase().includes(term) ||
        person.role?.toLowerCase().includes(term) ||
        person.batch?.toLowerCase().includes(term)
      ) &&
      sessionMatch &&
      batchMatch &&
      locationMatch &&
      roleMatch &&
      companyMatch
    );
  });

  // Get employment statistics
  const employmentStats = {
    totalEmployed: alumni.filter(a => a.current_role || a.role).length,
    entrepreneurs: alumni.filter(a => 
      a.current_role?.toLowerCase().includes('founder') || 
      a.current_role?.toLowerCase().includes('entrepreneur') ||
      a.role?.toLowerCase().includes('founder') ||
      a.role?.toLowerCase().includes('entrepreneur')
    ).length,
    topCompanies: [...new Set(alumni.map(a => a.company).filter(Boolean))].slice(0, 10),
    graduatedYears: [...new Set(alumni.map(a => a.passing_year || a.graduation_year).filter(Boolean))]
  };

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

  // Form submission
  const handleSubmit = async () => {
    if (!formData.name || !formData.email || (!formData.passing_year && !formData.graduation_year)) {
      Swal.fire('Missing fields', 'Please fill name, email, and passing/graduation year', 'warning');
      return;
    }

    // Auto-set graduated and employed status
    const submitData = {
      ...formData,
      is_graduated: true,
      is_employed: true
    };

    try {
      await createAlumni(submitData);
      Swal.fire({
        title: 'Success!',
        text: 'Your profile has been submitted for approval',
        icon: 'success',
        confirmButtonColor: '#2563eb',
      });
      setIsMentorshipFormOpen(false);
      setFormData({
        name: '', batch: '', session: '', role: '', company: '',
        location: '', image_url: '', email: '', phone_number: '',
        graduation_year: '', passing_year: '', current_role: '',
        current_status: 'employed', linkedin_url: '',
        is_graduated: true, is_employed: true
      });
      fetchAlumni(); // Refresh the list
    } catch (err) {
      Swal.fire('Error', 'Failed to submit profile', 'error',err.message);
    }
  };

  // Get status badge color
  const getStatusBadge = (alumni) => {
    const role = alumni.current_role || alumni.role || '';
    
    if (role.toLowerCase().includes('founder') || role.toLowerCase().includes('entrepreneur')) {
      return { color: 'bg-purple-100 text-purple-800', icon: '🚀', label: 'Entrepreneur' };
    } else if (role.toLowerCase().includes('manager') || role.toLowerCase().includes('director') || role.toLowerCase().includes('lead')) {
      return { color: 'bg-orange-100 text-orange-800', icon: '👔', label: 'Management' };
    } else if (role.toLowerCase().includes('engineer')) {
      return { color: 'bg-green-100 text-green-800', icon: '⚙️', label: 'Engineer' };
    } else if (role.toLowerCase().includes('researcher') || role.toLowerCase().includes('scientist')) {
      return { color: 'bg-blue-100 text-blue-800', icon: '🔬', label: 'Researcher' };
    } else {
      return { color: 'bg-gray-100 text-gray-800', icon: '👤', label: 'Professional' };
    }
  };

  // Get graduation year
  const getGraduationYear = (alumni) => {
    return alumni.passing_year || alumni.graduation_year || 'N/A';
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

      {/* Hero Section */}
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
            KU CSE Graduated Professionals
          </motion.h1>
          <motion.p
            className="text-xl max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Network with successful KU CSE alumni who have graduated and are now working professionals worldwide
          </motion.p>
          <motion.button
            className="bg-white text-blue-800 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMentorshipFormOpen(true)}
          >
            <GraduationCap className="inline w-6 h-6 mr-2" />
            Add Your Profile
          </motion.button>
        </div>
      </motion.section>

      {/* Employment Statistics */}
      <motion.section
        ref={statsRef}
        className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
            Professional Network Overview
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {[
              { 
                value: employmentStats.totalEmployed, 
                label: 'Graduated Professionals', 
                suffix: '', 
                icon: <CheckCircle className="w-8 h-8 mb-2" />,
                color: 'from-green-500 to-emerald-600'
              },
              { 
                value: employmentStats.entrepreneurs, 
                label: 'Entrepreneurs', 
                suffix: '', 
                icon: <Rocket className="w-8 h-8 mb-2" />,
                color: 'from-purple-500 to-pink-600'
              },
              { 
                value: employmentStats.graduatedYears.length, 
                label: 'Graduation Years', 
                suffix: '', 
                icon: <GraduationCap className="w-8 h-8 mb-2" />,
                color: 'from-blue-500 to-cyan-600'
              },
              { 
                value: employmentStats.topCompanies.length, 
                label: 'Companies', 
                suffix: '+', 
                icon: <Building className="w-8 h-8 mb-2" />,
                color: 'from-indigo-500 to-purple-600'
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`bg-gradient-to-r ${stat.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
                <motion.div
                  className="text-4xl font-bold text-gray-800 mb-2"
                  animate={statsInView ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  {stat.value}{stat.suffix}
                </motion.div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Top Companies */}
          {employmentStats.topCompanies.length > 0 && (
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Building className="w-6 h-6 mr-3 text-blue-600" />
                Alumni Work At Top Companies
              </h3>
              <div className="flex flex-wrap gap-4">
                {employmentStats.topCompanies.map((company, index) => (
                  <motion.span
                    key={index}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium hover:bg-blue-100 transition"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    {company}
                  </motion.span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.section>

      {/* Tabs: Network + Join */}
      <motion.section
        className="py-16 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap justify-center border-b border-gray-300 mb-12">
            {['network', 'join'].map((tab) => (
              <motion.button
                key={tab}
                className={`px-10 py-5 font-semibold text-xl transition-all duration-300 mx-3 my-2 rounded-t-xl ${
                  activeTab === tab
                    ? 'bg-white text-blue-700 shadow-md border-b-4 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-white/70'
                }`}
                onClick={() => setActiveTab(tab)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab === 'network' ? 'Professional Network' : 'Add Your Profile'}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              {/* Professional Network Tab */}
              {activeTab === 'network' && (
                <div>
                  {/* Search and Filter Section */}
                  <div className="mb-12 bg-white p-8 rounded-2xl shadow-lg">
                    <div className="flex items-center mb-6">
                      <Search className="w-6 h-6 text-gray-500 mr-3" />
                      <h3 className="text-2xl font-bold text-gray-800">Find Professional Alumni</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search Professionals</label>
                        <div className="relative">
                          <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Name, role, or skills..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Batch</label>
                        <div className="relative">
                          <button
                            type="button"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left flex justify-between items-center"
                            onClick={() => setIsBatchDropdownOpen(!isBatchDropdownOpen)}
                          >
                            <span>{filterBatch || 'Select Batch'}</span>
                            <ChevronDown className={`w-5 h-5 transition-transform ${isBatchDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {/* Batch Dropdown */}
                          {isBatchDropdownOpen && (
                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              <div className="p-2">
                                <div className="mb-2">
                                  <input
                                    type="text"
                                    placeholder="Search batch..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <button
                                    className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded text-sm"
                                    onClick={() => {
                                      setFilterBatch('');
                                      setIsBatchDropdownOpen(false);
                                    }}
                                  >
                                    All Batches
                                  </button>
                                  {batchOptions.map((batch) => (
                                    <button
                                      key={batch}
                                      className={`w-full text-left px-3 py-2 hover:bg-blue-50 rounded text-sm ${
                                        filterBatch === batch ? 'bg-blue-100 text-blue-700' : ''
                                      }`}
                                      onClick={() => {
                                        setFilterBatch(batch);
                                        setIsBatchDropdownOpen(false);
                                      }}
                                    >
                                      {batch}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          placeholder="City or Country"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={filterLocation}
                          onChange={(e) => setFilterLocation(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                        <input
                          type="text"
                          placeholder="Google, Microsoft..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={filterCompany}
                          onChange={(e) => setFilterCompany(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-gray-600">
                        <CheckCircle className="w-5 h-5 inline mr-2 text-green-500" />
                        <span>Showing <strong>{filteredAlumni.length}</strong> graduated professionals</span>
                      </div>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setFilterBatch('');
                          setFilterLocation('');
                          setFilterRole('');
                          setFilterCompany('');
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Clear filters
                      </button>
                    </div>
                  </div>

                  {/* Alumni Grid */}
                  {loading ? (
                    <div className="flex justify-center py-20">
                      <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
                    </div>
                  ) : filteredAlumni.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredAlumni.map((person, index) => {
                        const status = getStatusBadge(person);
                        const graduationYear = getGraduationYear(person);
                        
                        return (
                          <motion.div
                            key={person.id || index}
                            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-100"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.06 }}
                            whileHover={{ y: -5 }}
                          >
                            {/* Status Badge */}
                            <div className="flex justify-between items-start mb-4">
                              <div className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                                <span className="mr-1">{status.icon}</span>
                                {status.label}
                              </div>
                              <div className="text-sm text-gray-500">
                                <GraduationCap className="inline w-4 h-4 mr-1" />
                                {graduationYear}
                              </div>
                            </div>

                            {/* Profile */}
                            <div className="flex items-center mb-5">
                              <div className="relative">
                                <img
                                  src={person.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=2563eb&color=fff&size=128`}
                                  alt={person.name}
                                  className="w-20 h-20 rounded-full object-cover border-4 border-blue-50"
                                />
                                {person.batch && !person.batch.toLowerCase().includes('committee') && (
                                  <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                    {person.batch}
                                  </div>
                                )}
                              </div>
                              <div className="ml-5">
                                <h3 className="text-xl font-bold">{person.name}</h3>
                                <p className="text-blue-600 font-medium">
                                  {person.current_role || person.role || 'Professional'}
                                </p>
                                {person.company && (
                                  <p className="text-gray-600 text-sm">
                                    <Building className="inline w-3 h-3 mr-1" />
                                    {person.company}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            {/* Details */}
                            <div className="space-y-3 text-gray-700 flex-grow mb-4">
                              {person.session && (
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                  <span>Session: {person.session}</span>
                                </div>
                              )}
                              {person.location && (
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                  <span>{person.location}</span>
                                </div>
                              )}
                              {person.email && (
                                <div className="flex items-center">
                                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                                  <span className="truncate">{person.email}</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                              {person.email && (
                                <a
                                  href={`mailto:${person.email}`}
                                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center"
                                >
                                  <Mail className="w-4 h-4 mr-2" />
                                  Connect
                                </a>
                              )}
                              {person.linkedin_url && (
                                <a
                                  href={person.linkedin_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center justify-center"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-gray-500 text-xl">
                      <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p>No graduated professionals found matching your search criteria.</p>
                      <p className="text-lg mt-2">Be the first to add your profile!</p>
                      <button
                        onClick={() => setActiveTab('join')}
                        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add Your Profile
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Add Profile Tab */}
              {activeTab === 'join' && (
                <motion.div
                  className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-center mb-10">
                    <GraduationCap className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold mb-4">Add Your Professional Profile</h2>
                    <p className="text-gray-600">
                      Share your journey as a graduated KU CSE professional. Only graduated and employed alumni profiles are displayed.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 text-sm font-medium">Full Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium">Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="professional@email.com"
                      />
                    </div>

                    <div className="relative">
                      <label className="block mb-2 text-sm font-medium">Batch *</label>
                      <div className="relative">
                        <button
                          type="button"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left flex justify-between items-center"
                          onClick={() => setIsBatchDropdownOpen(!isBatchDropdownOpen)}
                        >
                          <span>{formData.batch || 'Select Your Batch'}</span>
                          <ChevronDown className={`w-5 h-5 transition-transform ${isBatchDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {/* Batch Dropdown for Form */}
                        {isBatchDropdownOpen && (
                          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            <div className="p-2">
                              <div className="space-y-1">
                                {batchOptions.map((batch) => (
                                  <button
                                    key={batch}
                                    type="button"
                                    className={`w-full text-left px-3 py-2 hover:bg-blue-50 rounded text-sm ${
                                      formData.batch === batch ? 'bg-blue-100 text-blue-700' : ''
                                    }`}
                                    onClick={() => {
                                      setFormData({ ...formData, batch });
                                      setIsBatchDropdownOpen(false);
                                    }}
                                  >
                                    {batch}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium">Passing/Graduation Year *</label>
                      <input
                        type="text"
                        value={formData.passing_year || formData.graduation_year}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          passing_year: e.target.value,
                          graduation_year: e.target.value 
                        })}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 2022"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium">Current Role *</label>
                      <input
                        type="text"
                        value={formData.current_role || formData.role}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          current_role: e.target.value,
                          role: e.target.value 
                        })}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Software Engineer"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium">Company *</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tech Company Inc."
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Dhaka, Bangladesh"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone_number}
                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+880 1234 567890"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium">LinkedIn Profile</label>
                      <input
                        type="url"
                        value={formData.linkedin_url}
                        onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://linkedin.com/in/your-profile"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block mb-2 text-sm font-medium">Profile Image URL</label>
                      <input
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/photo.jpg"
                      />
                      <p className="text-sm text-gray-500 mt-1">Professional photo recommended</p>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <CheckCircle className="inline w-4 h-4 mr-2" />
                      <strong>Note:</strong> Only graduated and employed alumni profiles are displayed. 
                      Current committee members without graduation info will not appear in the professional network.
                    </p>
                  </div>

                  <div className="flex justify-end gap-4 mt-12">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          name: '', batch: '', session: '', role: '', company: '',
                          location: '', image_url: '', email: '', phone_number: '',
                          graduation_year: '', passing_year: '', current_role: '',
                          current_status: 'employed', linkedin_url: '',
                          is_graduated: true, is_employed: true
                        });
                      }}
                      className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Clear Form
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-lg flex items-center"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Submit Professional Profile
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Modal */}
      <AnimatePresence>
        {isMentorshipFormOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMentorshipFormOpen(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-8 text-white">
                <h2 className="text-3xl font-bold flex items-center">
                  <GraduationCap className="w-8 h-8 mr-3" />
                  Join Professional Network
                </h2>
                <p className="mt-2 opacity-90">Connect with fellow KU CSE professionals worldwide</p>
              </div>

              <div className="p-8">
                <p className="text-gray-600 mb-6">
                  To join our professional alumni network, please use the &quot;Add Your Profile&quot; tab above to submit your details.
                  Only graduated and employed alumni profiles are displayed.
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setIsMentorshipFormOpen(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setIsMentorshipFormOpen(false);
                      setActiveTab('join');
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Go to Profile Form
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Alumni;