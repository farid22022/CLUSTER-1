// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   FiBookOpen, FiSend, FiX, FiLock, FiLoader, FiAlertCircle,
//   FiExternalLink, FiCalendar, FiFileText, FiCheckCircle,
//   FiEye, FiBarChart2, FiTag, FiDownload, FiShare2
// } from 'react-icons/fi';

// import { getResources, createResource, getVisibleResources } from '../../../api';

// // ────────────────────────────────────────────────
// // Shared helper function (moved here so both modal + cards can use it)
// // ────────────────────────────────────────────────
// const getDifficultyColor = (difficulty) => {
//   switch (difficulty) {
//     case 'Beginner':    return 'bg-emerald-100 text-emerald-700';
//     case 'Intermediate': return 'bg-amber-100 text-amber-700';
//     case 'Advanced':    return 'bg-rose-100 text-rose-700';
//     default:            return 'bg-slate-100 text-slate-700';
//   }
// };

// const Notification = ({ type, title, message, onClose }) => {
//   const icons = {
//     success: <FiCheckCircle className="w-5 h-5" />,
//     error: <FiAlertCircle className="w-5 h-5" />,
//     info: <FiAlertCircle className="w-5 h-5" />
//   };

//   const colors = {
//     success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
//     error: 'bg-red-50 border-red-200 text-red-800',
//     info: 'bg-blue-50 border-blue-200 text-blue-800'
//   };

//   return (
//     <motion.div
//       className={`fixed top-6 right-6 z-50 max-w-md p-4 rounded-xl shadow-lg border ${colors[type]} flex items-start gap-3`}
//       initial={{ opacity: 0, x: 100 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: 100 }}
//     >
//       <div className={`mt-0.5 ${type === 'success' ? 'text-emerald-600' : type === 'error' ? 'text-red-600' : 'text-blue-600'}`}>
//         {icons[type]}
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className="font-semibold text-sm">{title}</p>
//         <p className="text-sm mt-1 opacity-90">{message}</p>
//       </div>
//       <button onClick={onClose} className="text-gray-500 hover:text-gray-700 ml-2">
//         <FiX size={18} />
//       </button>
//     </motion.div>
//   );
// };

// const ResourceDetailsModal = ({ resource, isOpen, onClose }) => {
//   if (!isOpen || !resource) return null;

//   const isRestricted = resource.restricted;

//   const formatDate = (dateStr) => {
//     if (!dateStr) return '—';
//     return new Date(dateStr).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };

//   // Safe contributor display
//   const getContributorDisplay = () => {
//     const by = resource.created_by;

//     if (!by) return null; // hide section if no creator

//     let name = 'Anonymous';
//     let initial = '?';

//     if (typeof by === 'string') {
//       name = by;
//       initial = by.charAt(0)?.toUpperCase() || '?';
//     } else if (typeof by === 'number') {
//       name = `User #${by}`;
//       initial = 'U';
//     } else if (by && typeof by === 'object') {
//       // If it's a full user object
//       name = by.name || by.username || by.email || 'Unknown User';
//       initial = (by.name || by.username || by.email || '?').charAt(0)?.toUpperCase() || '?';
//     }

//     return { name, initial };
//   };

//   const contributor = getContributorDisplay();

//   return (
//     <AnimatePresence>
//       <motion.div
//         className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         onClick={onClose}
//       >
//         <motion.div
//           className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-slate-100 flex flex-col"
//           initial={{ scale: 0.95, y: 20 }}
//           animate={{ scale: 1, y: 0 }}
//           exit={{ scale: 0.95, y: 20 }}
//           onClick={(e) => e.stopPropagation()}
//         >
//           {/* Header */}
//           <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8 border-b border-slate-100">
//             <div className="flex justify-between items-start gap-4">
//               <div className="flex-1">
//                 <div className="flex flex-wrap items-center gap-3 mb-4">
//                   <span className="inline-block px-4 py-1.5 bg-white text-blue-600 rounded-full text-sm font-medium shadow-sm">
//                     {resource.category || 'Uncategorized'}
//                   </span>
//                   <span className={`inline-block px-4 py-1.5 bg-white rounded-full text-sm font-medium shadow-sm ${getDifficultyColor(resource.difficulty)}`}>
//                     {resource.difficulty || '—'}
//                   </span>
//                   <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium shadow-sm">
//                     Approved
//                   </span>
//                   {isRestricted && (
//                     <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium shadow-sm flex items-center gap-1.5">
//                       <FiLock size={14} /> Restricted
//                     </span>
//                   )}
//                 </div>

//                 <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3 line-clamp-2">
//                   {resource.title}
//                 </h2>

//                 <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-600 text-sm">
//                   <div className="flex items-center gap-2">
//                     <FiFileText size={16} />
//                     <span>{resource.format || 'Unknown'}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <FiCalendar size={16} />
//                     <span>Added {formatDate(resource.created_at)}</span>
//                   </div>
//                   {resource.updated_at && resource.updated_at !== resource.created_at && (
//                     <div className="flex items-center gap-2">
//                       <FiCalendar size={16} />
//                       <span>Updated {formatDate(resource.updated_at)}</span>
//                     </div>
//                   )}
//                   {resource.year && (
//                     <div className="flex items-center gap-2">
//                       <span className="font-medium">Year {resource.year}</span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <button
//                 onClick={onClose}
//                 className="p-2 hover:bg-white/80 rounded-lg transition-colors flex-shrink-0"
//               >
//                 <FiX className="w-6 h-6 text-slate-500" />
//               </button>
//             </div>
//           </div>

//           {/* Body */}
//           <div className="p-6 sm:p-8 overflow-y-auto flex-1">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               {/* Left - Main content */}
//               <div className="lg:col-span-2 space-y-8">
//                 {/* Description */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
//                     <FiBarChart2 className="w-5 h-5 text-blue-500" />
//                     Description
//                   </h3>
//                   <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-line">
//                     {resource.description || 'No description provided.'}
//                   </div>
//                 </div>

//                 {/* Tags */}
//                 {resource.tags?.length > 0 && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
//                       <FiTag className="w-5 h-5 text-blue-500" />
//                       Tags
//                     </h3>
//                     <div className="flex flex-wrap gap-2">
//                       {resource.tags.map((tag, idx) => (
//                         <span
//                           key={idx}
//                           className="px-4 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors cursor-default"
//                         >
//                           {tag}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Contributor - now safe */}
//                 {contributor && (
//                   <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
//                     <h3 className="text-lg font-semibold mb-3">Contributed by</h3>
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-lg">
//                         {contributor.initial}
//                       </div>
//                       <div>
//                         <p className="font-medium">{contributor.name}</p>
//                         <p className="text-sm text-slate-500">Contributor</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Right sidebar */}
//               <div className="space-y-6">
//                 {/* Access card */}
//                 <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
//                   <h3 className="text-lg font-semibold text-slate-800 mb-5">Access Resource</h3>

//                   {isRestricted ? (
//                     <div className="text-center py-8">
//                       <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-sm">
//                         <FiLock className="w-8 h-8 text-amber-500" />
//                       </div>
//                       <p className="text-amber-700 font-medium mb-3">Login Required</p>
//                       <p className="text-slate-600 text-sm">
//                         This resource is restricted to registered members only.
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       <a
//                         href={resource.link}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="block w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 text-center"
//                       >
//                         <FiExternalLink className="w-5 h-5" />
//                         Open Resource
//                       </a>

//                       <div className="grid grid-cols-2 gap-3">
//                         <button className="py-3 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
//                           <FiDownload className="w-4 h-4" />
//                           Download
//                         </button>
//                         <button className="py-3 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
//                           <FiShare2 className="w-4 h-4" />
//                           Share
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Quick Info */}
//                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
//                   <h3 className="text-lg font-semibold text-slate-800 mb-4">Resource Details</h3>
//                   <div className="space-y-4 text-sm">
//                     <div className="flex justify-between py-2 border-b border-slate-100">
//                       <span className="text-slate-600">Resource ID</span>
//                       <span className="font-medium">#{resource.id}</span>
//                     </div>
//                     <div className="flex justify-between py-2 border-b border-slate-100">
//                       <span className="text-slate-600">Format</span>
//                       <span className="font-medium">{resource.format || '—'}</span>
//                     </div>
//                     <div className="flex justify-between py-2 border-b border-slate-100">
//                       <span className="text-slate-600">Difficulty</span>
//                       <span className="font-medium">{resource.difficulty || '—'}</span>
//                     </div>
//                     <div className="flex justify-between py-2 border-b border-slate-100">
//                       <span className="text-slate-600">Status</span>
//                       <span className="font-semibold text-emerald-600">Approved</span>
//                     </div>
//                     <div className="flex justify-between py-2 border-b border-slate-100">
//                       <span className="text-slate-600">Access</span>
//                       <span className={`font-semibold ${isRestricted ? 'text-amber-600' : 'text-emerald-600'}`}>
//                         {isRestricted ? 'Restricted' : 'Public'}
//                       </span>
//                     </div>
//                     {resource.year && (
//                       <div className="flex justify-between py-2">
//                         <span className="text-slate-600">Academic Year</span>
//                         <span className="font-medium">{resource.year}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="p-6 border-t border-slate-100 bg-slate-50">
//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={onClose}
//                 className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
//               >
//                 Close
//               </button>
//               {!isRestricted && (
//                 <a
//                   href={resource.link}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
//                 >
//                   <FiExternalLink size={16} />
//                   Open Now
//                 </a>
//               )}
//             </div>
//           </div>
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// const ResourceCard = () => {
//   const [resources, setResources] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showSubmitModal, setShowSubmitModal] = useState(false);
//   const [selectedResource, setSelectedResource] = useState(null);
//   const [notification, setNotification] = useState(null);

//   const [formData, setFormData] = useState({
//     title: '',
//     category: '',
//     format: 'PDF',
//     difficulty: 'Beginner',
//     link: '',
//     restricted: false,
//     description: '',
//     tags: ''
//   });

//   const [formErrors, setFormErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     let isMounted = true;

//     const fetchResources = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const { data } = await getResources();
//         console.log('Fetched resources:', data);

//         if (!isMounted) return;

//         setResources(data || []);
//       } catch (err) {
//         console.error('Failed to fetch resources:', err);
//         if (isMounted) {
//           setError('Unable to load resources. Please try again later.');
//         }
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     fetchResources();
//     return () => { isMounted = false; };
//   }, []);

//   const visibleResources = getVisibleResources(resources);

//   const showNotification = (type, title, message, duration = 4000) => {
//     setNotification({ type, title, message });
//     if (duration > 0) setTimeout(() => setNotification(null), duration);
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//     if (formErrors[name]) {
//       setFormErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const validateForm = () => {
//     const errors = {};
//     if (!formData.title.trim()) errors.title = 'Title is required';
//     if (!formData.category.trim()) errors.category = 'Category is required';
//     if (!formData.link.trim()) {
//       errors.link = 'Link is required';
//     } else if (!formData.link.match(/^https?:\/\//)) {
//       errors.link = 'Link must start with http:// or https://';
//     }
//     if (!formData.description.trim()) errors.description = 'Description is required';
//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setSubmitting(true);

//     try {
//       await createResource({
//         ...formData,
//         approval_status: 'PENDING',
//         tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
//       });

//       showNotification('success', 'Submitted!', 'Your resource has been submitted for admin review.');
//       setShowSubmitModal(false);
//       setFormData({
//         title: '', category: '', format: 'PDF', difficulty: 'Beginner',
//         link: '', restricted: false, description: '', tags: ''
//       });
//     } catch (err) {
//       console.error('Resource submission failed:', err);
//       showNotification('error', 'Submission failed', err?.response?.data?.detail || 'Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <section className="py-16 bg-gradient-to-b from-white to-slate-50">
//       <div className="container mx-auto px-5 max-w-7xl">
//         <AnimatePresence>
//           {notification && <Notification {...notification} onClose={() => setNotification(null)} />}
//         </AnimatePresence>

//         {/* Header */}
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
//           <div>
//             <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-full mb-6">
//               <FiBookOpen className="w-5 h-5 text-blue-600" />
//               <span className="text-sm font-medium text-blue-600">Resource Library</span>
//             </div>
//             <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
//               Discover Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Resources</span>
//             </h2>
//             <p className="text-lg text-slate-600 max-w-2xl">
//               Curated collection of high-quality learning materials, tutorials, and references.
//             </p>
//           </div>

//           <button
//             onClick={() => setShowSubmitModal(true)}
//             className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3 whitespace-nowrap"
//           >
//             <FiSend className="w-5 h-5 group-hover:rotate-12 transition-transform" />
//             Submit Resource
//           </button>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
//           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
//             <div className="text-3xl font-bold text-slate-800 mb-1">{visibleResources.length}</div>
//             <div className="text-slate-600 text-sm">Total Resources</div>
//           </div>
//           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
//             <div className="text-3xl font-bold text-slate-800 mb-1">
//               {visibleResources.filter(r => r.difficulty === 'Beginner').length}
//             </div>
//             <div className="text-slate-600 text-sm">Beginner Friendly</div>
//           </div>
//           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
//             <div className="text-3xl font-bold text-slate-800 mb-1">
//               {visibleResources.filter(r => r.format === 'PDF').length}
//             </div>
//             <div className="text-slate-600 text-sm">PDF Documents</div>
//           </div>
//           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
//             <div className="text-3xl font-bold text-slate-800 mb-1">
//               {visibleResources.filter(r => !r.restricted).length}
//             </div>
//             <div className="text-slate-600 text-sm">Public Access</div>
//           </div>
//         </div>

//         {loading ? (
//           <div className="flex flex-col items-center justify-center min-h-[400px]">
//             <div className="relative">
//               <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>
//               <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
//             </div>
//             <p className="mt-6 text-lg text-slate-600">Loading resources...</p>
//           </div>
//         ) : error ? (
//           <div className="text-center py-20">
//             <FiAlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
//             <p className="text-xl text-slate-800 mb-3">{error}</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50"
//             >
//               Try Again
//             </button>
//           </div>
//         ) : visibleResources.length === 0 ? (
//           <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-2xl">
//             <FiBookOpen className="w-16 h-16 mx-auto mb-6 text-blue-600" />
//             <h3 className="text-2xl font-semibold text-slate-800 mb-3">No approved resources yet</h3>
//             <p className="text-slate-600 mb-8 max-w-md mx-auto">
//               Be the first to contribute — your submission will be reviewed by admins.
//             </p>
//             <button
//               onClick={() => setShowSubmitModal(true)}
//               className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl"
//             >
//               Submit First Resource
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {visibleResources.map(resource => (
//               <motion.div
//                 key={resource.id}
//                 className="bg-white rounded-2xl shadow-2xl hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden group"
//                 whileHover={{ y: -8 }}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="p-6">
//                   <div className="flex justify-between items-start mb-4">
//                     <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
//                       {resource.category}
//                     </span>
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
//                       {resource.difficulty}
//                     </span>
//                   </div>

//                   <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
//                     {resource.title}
//                   </h3>

//                   <p className="text-slate-600 text-sm mb-6 line-clamp-3">
//                     {resource.description}
//                   </p>

//                   <div className="flex items-center justify-between mb-6">
//                     <div className="flex items-center gap-2 text-slate-500">
//                       <FiFileText className="w-4 h-4" />
//                       <span className="text-sm">{resource.format}</span>
//                     </div>
//                     {resource.restricted && (
//                       <div className="flex items-center gap-2 text-amber-600">
//                         <FiLock className="w-4 h-4" />
//                         <span className="text-sm font-medium">Restricted</span>
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex gap-3">
//                     <button
//                       onClick={() => setSelectedResource(resource)}
//                       className="flex-1 py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
//                     >
//                       <FiEye className="w-4 h-4" />
//                       View Details
//                     </button>

//                     {resource.restricted ? (
//                       <button
//                         disabled
//                         className="py-3 px-4 bg-amber-50 text-amber-600 font-medium rounded-xl cursor-not-allowed flex items-center gap-2"
//                       >
//                         <FiLock className="w-4 h-4" />
//                         Locked
//                       </button>
//                     ) : (
//                       <a
//                         href={resource.link}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
//                       >
//                         <FiExternalLink className="w-4 h-4" />
//                         Open
//                       </a>
//                     )}
//                   </div>
//                 </div>

//                 <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//               </motion.div>
//             ))}
//           </div>
//         )}

//         <ResourceDetailsModal
//           resource={selectedResource}
//           isOpen={!!selectedResource}
//           onClose={() => setSelectedResource(null)}
//         />

//         {/* Submit modal – unchanged for now */}
//         <AnimatePresence>
//   {showSubmitModal && (
//     <motion.div
//       className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       onClick={() => setShowSubmitModal(false)}
//     >
//       <motion.div
//         className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-100"
//         initial={{ scale: 0.95, y: 20 }}
//         animate={{ scale: 1, y: 0 }}
//         exit={{ scale: 0.95, y: 20 }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8 border-b border-slate-100">
//           <div className="flex justify-between items-center">
//             <div>
//               <h3 className="text-2xl font-bold text-slate-800 mb-1">
//                 Submit New Resource
//               </h3>
//               <p className="text-slate-600 text-sm">
//                 Share valuable learning materials with the community
//               </p>
//             </div>
//             <button
//               onClick={() => setShowSubmitModal(false)}
//               className="p-2 hover:bg-white/80 rounded-lg transition-colors"
//             >
//               <FiX className="w-6 h-6 text-slate-500" />
//             </button>
//           </div>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Title */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Resource Title <span className="text-red-500">*</span>
//               </label>
//               <input
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 className={`w-full p-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
//                   formErrors.title ? 'border-red-500' : 'border-slate-200'
//                 } bg-white text-slate-800`}
//                 placeholder="e.g., Complete Python Programming Guide"
//               />
//               {formErrors.title && (
//                 <p className="text-red-500 text-sm mt-1.5">{formErrors.title}</p>
//               )}
//             </div>

//             {/* Category */}
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Category <span className="text-red-500">*</span>
//               </label>
//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleInputChange}
//                 className={`w-full p-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
//                   formErrors.category ? 'border-red-500' : 'border-slate-200'
//                 } bg-white text-slate-800`}
//               >
//                 <option value="">Select Category</option>
//                 <option value="Programming">Programming</option>
//                 <option value="Web Development">Web Development</option>
//                 <option value="Data Science">Data Science</option>
//                 <option value="Machine Learning">Machine Learning</option>
//                 <option value="DevOps">DevOps</option>
//                 <option value="Mobile Development">Mobile Development</option>
//                 <option value="Design">Design</option>
//                 <option value="Other">Other</option>
//               </select>
//               {formErrors.category && (
//                 <p className="text-red-500 text-sm mt-1.5">{formErrors.category}</p>
//               )}
//             </div>

//             {/* Format */}
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Format
//               </label>
//               <select
//                 name="format"
//                 value={formData.format}
//                 onChange={handleInputChange}
//                 className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-slate-800"
//               >
//                 <option value="PDF">PDF Document</option>
//                 <option value="Video">Video Tutorial</option>
//                 <option value="Article">Article / Blog Post</option>
//                 <option value="Course">Online Course</option>
//                 <option value="Cheatsheet">Cheatsheet</option>
//                 <option value="Tool">Tool / Software</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             {/* Difficulty */}
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Difficulty Level
//               </label>
//               <select
//                 name="difficulty"
//                 value={formData.difficulty}
//                 onChange={handleInputChange}
//                 className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-slate-800"
//               >
//                 <option value="Beginner">Beginner</option>
//                 <option value="Intermediate">Intermediate</option>
//                 <option value="Advanced">Advanced</option>
//               </select>
//             </div>

//             {/* Tags */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Tags (comma separated)
//               </label>
//               <input
//                 name="tags"
//                 value={formData.tags}
//                 onChange={handleInputChange}
//                 className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-slate-800"
//                 placeholder="e.g., python, tutorial, beginner, data-science"
//               />
//             </div>

//             {/* Link */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Resource URL <span className="text-red-500">*</span>
//               </label>
//               <input
//                 name="link"
//                 value={formData.link}
//                 onChange={handleInputChange}
//                 className={`w-full p-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
//                   formErrors.link ? 'border-red-500' : 'border-slate-200'
//                 } bg-white text-slate-800`}
//                 placeholder="https://example.com/resource"
//               />
//               {formErrors.link && (
//                 <p className="text-red-500 text-sm mt-1.5">{formErrors.link}</p>
//               )}
//             </div>

//             {/* Description */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Description <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows={5}
//                 className={`w-full p-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y ${
//                   formErrors.description ? 'border-red-500' : 'border-slate-200'
//                 } bg-white text-slate-800`}
//                 placeholder="Briefly describe the resource, what learners will gain, target audience, etc..."
//               />
//               {formErrors.description && (
//                 <p className="text-red-500 text-sm mt-1.5">{formErrors.description}</p>
//               )}
//             </div>

//             {/* Restricted Checkbox */}
//             <div className="md:col-span-2">
//               <label className="flex items-start gap-3 cursor-pointer select-none p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
//                 <input
//                   type="checkbox"
//                   name="restricted"
//                   checked={formData.restricted}
//                   onChange={handleInputChange}
//                   className="w-5 h-5 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
//                 />
//                 <div>
//                   <span className="font-medium text-slate-700 block">Restricted Access</span>
//                   <p className="text-sm text-slate-500 mt-1">
//                     Only logged-in users will be able to access this resource
//                   </p>
//                 </div>
//               </label>
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
//             <button
//               type="button"
//               onClick={() => setShowSubmitModal(false)}
//               className="flex-1 py-3.5 px-6 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               disabled={submitting}
//               className={`flex-1 py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 min-w-[180px] ${
//                 submitting
//                   ? 'opacity-70 cursor-not-allowed'
//                   : 'hover:shadow-xl hover:-translate-y-0.5'
//               }`}
//             >
//               {submitting ? (
//                 <>
//                   <FiLoader className="animate-spin" />
//                   Submitting...
//                 </>
//               ) : (
//                 <>
//                   <FiSend className="w-5 h-5" />
//                   Submit for Review
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </motion.div>
//     </motion.div>
//   )}
// </AnimatePresence>
//       </div>
//     </section>
//   );
// };

// export default ResourceCard;

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "@fontsource/noto-sans-bengali";
import {
  FiBookOpen, FiSend, FiX, FiLock,  FiAlertCircle,
  FiExternalLink, FiCalendar, FiFileText, FiCheckCircle,
  FiEye, FiBarChart2, FiTag, FiDownload, FiShare2,
  FiImage, FiVideo,  FiGithub, 
   FiChevronLeft, FiChevronRight, FiChevronDown
} from 'react-icons/fi';

import { getResources, createResource, getVisibleResources } from '../../../api';

// ────────────────────────────────────────────────
// Quill modules and formats configuration
// ────────────────────────────────────────────────
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'color': [] }, { 'background': [] }],
    ['link', 'image', 'video'],
    ['clean']
  ],
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'script',
  'indent',
  'direction',
  'color', 'background',
  'link', 'image', 'video'
];

// ────────────────────────────────────────────────
// Shared helper function
// ────────────────────────────────────────────────
const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Beginner':    return 'bg-emerald-100 text-emerald-700';
    case 'Intermediate': return 'bg-amber-100 text-amber-700';
    case 'Advanced':    return 'bg-rose-100 text-rose-700';
    default:            return 'bg-slate-100 text-slate-700';
  }
};

const Notification = ({ type, title, message, onClose }) => {
  const icons = {
    success: <FiCheckCircle className="w-5 h-5" />,
    error: <FiAlertCircle className="w-5 h-5" />,
    info: <FiAlertCircle className="w-5 h-5" />
  };

  const colors = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  return (
    <motion.div
      className={`fixed top-6 right-6 z-50 max-w-md p-4 rounded-xl shadow-lg border ${colors[type]} flex items-start gap-3`}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
    >
      <div className={`mt-0.5 ${type === 'success' ? 'text-emerald-600' : type === 'error' ? 'text-red-600' : 'text-blue-600'}`}>
        {icons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-sm mt-1 opacity-90">{message}</p>
      </div>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700 ml-2">
        <FiX size={18} />
      </button>
    </motion.div>
  );
};

const ResourceDetailsModal = ({ resource, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
    setCurrentVideoIndex(0);
  }, [resource]);

  if (!isOpen || !resource) return null;

  const isRestricted = resource.restricted;

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Safe contributor display
  const getContributorDisplay = () => {
    const by = resource.created_by;

    if (!by) return null;

    let name = 'Anonymous';
    let initial = '?';

    if (typeof by === 'string') {
      name = by;
      initial = by.charAt(0)?.toUpperCase() || '?';
    } else if (typeof by === 'number') {
      name = `User #${by}`;
      initial = 'U';
    } else if (by && typeof by === 'object') {
      name = by.name || by.username || by.email || 'Unknown User';
      initial = (by.name || by.username || by.email || '?').charAt(0)?.toUpperCase() || '?';
    }

    return { name, initial };
  };

  const contributor = getContributorDisplay();

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-slate-100 flex flex-col"
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with image slider if images exist */}
          {resource.images?.length > 0 ? (
            <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl group">
              <motion.img
                key={currentImageIndex}
                src={resource.images[currentImageIndex]}
                alt={`${resource.title} - image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

              {/* Image Navigation */}
              {resource.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(prev => prev === 0 ? resource.images.length - 1 : prev - 1);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"
                  >
                    <FiChevronLeft size={24} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(prev => prev === resource.images.length - 1 ? 0 : prev + 1);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"
                  >
                    <FiChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Image Indicators */}
              {resource.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {resource.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(idx);
                      }}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        idx === currentImageIndex
                          ? 'bg-white scale-125'
                          : 'bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Badges overlay */}
              <div className="absolute bottom-6 left-6 flex flex-wrap gap-3 z-20">
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                  resource.status?.toLowerCase() === 'completed'
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white'
                }`}>
                  {resource.status || 'Published'}
                </span>
                {resource.year && (
                  <span className="px-4 py-1.5 bg-gray-800/80 text-white rounded-full text-sm font-semibold flex items-center gap-1.5">
                    <FiCalendar size={14} />
                    {resource.year}
                  </span>
                )}
              </div>
            </div>
          ) : (
            // Original header without image slider
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8 border-b border-slate-100">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="inline-block px-4 py-1.5 bg-white text-blue-600 rounded-full text-sm font-medium shadow-sm">
                      {resource.category || 'Uncategorized'}
                    </span>
                    <span className={`inline-block px-4 py-1.5 bg-white rounded-full text-sm font-medium shadow-sm ${getDifficultyColor(resource.difficulty)}`}>
                      {resource.difficulty || '—'}
                    </span>
                    <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium shadow-sm">
                      Approved
                    </span>
                    {isRestricted && (
                      <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium shadow-sm flex items-center gap-1.5">
                        <FiLock size={14} /> Restricted
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3 line-clamp-2">
                    {resource.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-600 text-sm">
                    <div className="flex items-center gap-2">
                      <FiFileText size={16} />
                      <span>{resource.format || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCalendar size={16} />
                      <span>Added {formatDate(resource.created_at)}</span>
                    </div>
                    {resource.updated_at && resource.updated_at !== resource.created_at && (
                      <div className="flex items-center gap-2">
                        <FiCalendar size={16} />
                        <span>Updated {formatDate(resource.updated_at)}</span>
                      </div>
                    )}
                    {resource.year && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Year {resource.year}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/80 rounded-lg transition-colors flex-shrink-0"
                >
                  <FiX className="w-6 h-6 text-slate-500" />
                </button>
              </div>
            </div>
          )}

          {/* Body */}
          <div className="p-6 sm:p-8 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left - Main content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <FiBarChart2 className="w-5 h-5 text-blue-500" />
                    Description
                  </h3>
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 prose prose-slate max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: resource.description || 'No description provided.' }} />
                  </div>
                </div>

                {/* Videos Section */}
                {resource.videos?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <FiVideo className="w-5 h-5 text-blue-500" />
                      Videos
                    </h3>
                    <div className="space-y-4">
                      {/* Video Player */}
                      <div className="aspect-video rounded-xl overflow-hidden bg-slate-900">
                        <video
                          key={currentVideoIndex}
                          src={resource.videos[currentVideoIndex]}
                          controls
                          className="w-full h-full"
                          poster={resource.images?.[0]}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>

                      {/* Video Thumbnails/List */}
                      {resource.videos.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {resource.videos.map((video, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentVideoIndex(idx)}
                              className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                                idx === currentVideoIndex
                                  ? 'bg-blue-100 ring-2 ring-blue-500'
                                  : 'bg-slate-100 hover:bg-slate-200'
                              }`}
                            >
                              <FiVideo className={`w-5 h-5 ${
                                idx === currentVideoIndex ? 'text-blue-600' : 'text-slate-600'
                              }`} />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {resource.tags?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <FiTag className="w-5 h-5 text-blue-500" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors cursor-default"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contributor */}
                {contributor && (
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <h3 className="text-lg font-semibold mb-3">Contributed by</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-lg">
                        {contributor.initial}
                      </div>
                      <div>
                        <p className="font-medium">{contributor.name}</p>
                        <p className="text-sm text-slate-500">Contributor</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right sidebar */}
              <div className="space-y-6">
                {/* Access card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                  <h3 className="text-lg font-semibold text-slate-800 mb-5">Access Resource</h3>

                  {isRestricted ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-sm">
                        <FiLock className="w-8 h-8 text-amber-500" />
                      </div>
                      <p className="text-amber-700 font-medium mb-3">Login Required</p>
                      <p className="text-slate-600 text-sm">
                        This resource is restricted to registered members only.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 text-center"
                      >
                        <FiExternalLink className="w-5 h-5" />
                        Open Resource
                      </a>

                      <div className="grid grid-cols-2 gap-3">
                        <button className="py-3 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                          <FiDownload className="w-4 h-4" />
                          Download
                        </button>
                        <button className="py-3 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                          <FiShare2 className="w-4 h-4" />
                          Share
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Info */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Resource Details</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Resource ID</span>
                      <span className="font-medium">#{resource.id}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Format</span>
                      <span className="font-medium">{resource.format || '—'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Difficulty</span>
                      <span className="font-medium">{resource.difficulty || '—'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Status</span>
                      <span className="font-semibold text-emerald-600">Approved</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Access</span>
                      <span className={`font-semibold ${isRestricted ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {isRestricted ? 'Restricted' : 'Public'}
                      </span>
                    </div>
                    {resource.year && (
                      <div className="flex justify-between py-2">
                        <span className="text-slate-600">Academic Year</span>
                        <span className="font-medium">{resource.year}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Links */}
                {resource.github && (
                  <a
                    href={resource.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <FiGithub className="w-5 h-5 text-slate-700" />
                    <span className="text-sm font-medium text-slate-700">View on GitHub</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Close
              </button>
              {!isRestricted && (
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <FiExternalLink size={16} />
                  Open Now
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ResourceCard = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    format: 'PDF',
    difficulty: 'Beginner',
    link: '',
    github: '',
    restricted: false,
    description: '',
    tags: '',
    year: new Date().getFullYear(),
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  
  const imageWidgetRef = useRef(null);
  const videoWidgetRef = useRef(null);

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const cloudName = "dvpbeekmy";
  const uploadPreset = "resources"; 

  const categories = [
    'Programming', 'Web Development', 'Data Science', 
    'Machine Learning', 'DevOps', 'Mobile Development', 
    'Design', 'Other'
  ];

  useEffect(() => {
    let isMounted = true;

    const fetchResources = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await getResources();
        console.log('Fetched resources:', data);

        if (!isMounted) return;

        setResources(data || []);
      } catch (err) {
        console.error('Failed to fetch resources:', err);
        if (isMounted) {
          setError('Unable to load resources. Please try again later.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResources();
    return () => { isMounted = false; };
  }, []);

  // Initialize Cloudinary widgets
  useEffect(() => {
    if (!window.cloudinary) {
      console.error("Cloudinary widget script not loaded. Add <script src='https://upload-widget.cloudinary.com/global/all.js' type='text/javascript'></script> to index.html");
      return;
    }

    const widgetConfig = {
      cloudName,
      uploadPreset,
      sources: ["local", "url", "camera", "dropbox", "google_drive"],
      folder: "resources",
      styles: {
        palette: {
          window: "#FFFFFF",
          sourceBg: "#f4f4f5",
          windowBorder: "#90a0b3",
          tabIcon: "#000000",
          inactiveTabIcon: "#555a5f",
          menuIcons: "#555a5f",
          link: "#37474F",
          action: "#339933",
          inProgress: "#0433ff",
          complete: "#339933",
          error: "#cc0000",
          textDark: "#000000",
          textLight: "#fcfffd"
        }
      }
    };

    // Image widget - multiple
    imageWidgetRef.current = window.cloudinary.createUploadWidget(
      {
        ...widgetConfig,
        multiple: true,
        maxFiles: 8,
        resourceType: "image",
        clientAllowedFormats: ["png", "jpg", "jpeg", "webp", "gif"],
      },
      (error, result) => {
        if (!error && result?.event === "success") {
          setImages(prev => [
            ...prev,
            {
              url: result.info.secure_url,
              thumbnail: result.info.thumbnail_url || result.info.secure_url,
            }
          ]);
        }
      }
    );

    // Video widget - multiple
    videoWidgetRef.current = window.cloudinary.createUploadWidget(
      {
        ...widgetConfig,
        multiple: true,
        resourceType: "video",
        maxFiles: 3,
        clientAllowedFormats: ["mp4", "mov", "webm"],
        maxFileSize: 150 * 1024 * 1024,
      },
      (error, result) => {
        if (!error && result?.event === "success") {
          setVideos(prev => [...prev, result.info.secure_url]);
        }
      }
    );

    return () => {
      imageWidgetRef.current?.destroy();
      videoWidgetRef.current?.destroy();
    };
  }, []);

  const visibleResources = getVisibleResources(resources);

  const showNotification = (type, title, message, duration = 4000) => {
    setNotification({ type, title, message });
    if (duration > 0) setTimeout(() => setNotification(null), duration);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDescriptionChange = (value) => {
    setFormData(prev => ({ ...prev, description: value }));
    if (formErrors.description) {
      setFormErrors(prev => ({ ...prev, description: '' }));
    }
  };

  const openImageUpload = () => imageWidgetRef.current?.open();
  const openVideoUpload = () => videoWidgetRef.current?.open();

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.category.trim()) errors.category = 'Category is required';
    if (!formData.link.trim()) {
      errors.link = 'Resource link is required';
    } else if (!formData.link.match(/^https?:\/\//)) {
      errors.link = 'Link must start with http:// or https://';
    }
    if (formData.github && !formData.github.match(/^https?:\/\//)) {
      errors.github = 'GitHub link must start with http:// or https://';
    }
    if (!formData.description || formData.description === '<p><br></p>') {
      errors.description = 'Description is required';
    }
    if (formData.year && (formData.year < 2000 || formData.year > 2100)) {
      errors.year = 'Please enter a valid year';
    }
    if (images.length === 0) {
      errors.images = 'Please upload at least one image';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        format: formData.format,
        difficulty: formData.difficulty,
        link: formData.link.trim(),
        github: formData.github?.trim() || null,
        restricted: formData.restricted,
        description: formData.description,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        year: formData.year,
        images: images.map(img => img.url),
        videos: videos,
        approval_status: 'PENDING'
      };

      await createResource(payload);

      showNotification('success', 'Submitted!', 'Your resource has been submitted for admin review.');
      setShowSubmitModal(false);
      setFormData({
        title: '', category: '', format: 'PDF', difficulty: 'Beginner',
        link: '', github: '', restricted: false, description: '',
        tags: '', year: new Date().getFullYear(),
      });
      setImages([]);
      setVideos([]);
    } catch (err) {
      console.error('Resource submission failed:', err);
      showNotification('error', 'Submission failed', err?.response?.data?.detail || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-5 max-w-7xl">
        <AnimatePresence>
          {notification && <Notification {...notification} onClose={() => setNotification(null)} />}
        </AnimatePresence>

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-full mb-6">
              <FiBookOpen className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Resource Library</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
              Discover Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Resources</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl">
              Curated collection of high-quality learning materials, tutorials, and references.
            </p>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3 whitespace-nowrap"
          >
            <FiSend className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Submit Resource
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="text-3xl font-bold text-slate-800 mb-1">{visibleResources.length}</div>
            <div className="text-slate-600 text-sm">Total Resources</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="text-3xl font-bold text-slate-800 mb-1">
              {visibleResources.filter(r => r.difficulty === 'Beginner').length}
            </div>
            <div className="text-slate-600 text-sm">Beginner Friendly</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="text-3xl font-bold text-slate-800 mb-1">
              {visibleResources.filter(r => r.format === 'PDF').length}
            </div>
            <div className="text-slate-600 text-sm">PDF Documents</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="text-3xl font-bold text-slate-800 mb-1">
              {visibleResources.filter(r => !r.restricted).length}
            </div>
            <div className="text-slate-600 text-sm">Public Access</div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-6 text-lg text-slate-600">Loading resources...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <FiAlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <p className="text-xl text-slate-800 mb-3">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50"
            >
              Try Again
            </button>
          </div>
        ) : visibleResources.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-2xl">
            <FiBookOpen className="w-16 h-16 mx-auto mb-6 text-blue-600" />
            <h3 className="text-2xl font-semibold text-slate-800 mb-3">No approved resources yet</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Be the first to contribute — your submission will be reviewed by admins.
            </p>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl"
            >
              Submit First Resource
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleResources.map(resource => (
              <motion.div
                key={resource.id}
                className="bg-white rounded-2xl shadow-2xl hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden group"
                whileHover={{ y: -8 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Card Image Preview */}
                {resource.images?.length > 0 && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={resource.images[0]}
                      alt={resource.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                      {resource.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                      {resource.difficulty}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {resource.title}
                  </h3>

                  <div 
                    className="text-slate-600 text-sm mb-6 line-clamp-3 prose prose-sm"
                    dangerouslySetInnerHTML={{ __html: resource.description }}
                  />

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-slate-500">
                      <FiFileText className="w-4 h-4" />
                      <span className="text-sm">{resource.format}</span>
                    </div>
                    {resource.restricted && (
                      <div className="flex items-center gap-2 text-amber-600">
                        <FiLock className="w-4 h-4" />
                        <span className="text-sm font-medium">Restricted</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedResource(resource)}
                      className="flex-1 py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <FiEye className="w-4 h-4" />
                      View Details
                    </button>

                    {resource.restricted ? (
                      <button
                        disabled
                        className="py-3 px-4 bg-amber-50 text-amber-600 font-medium rounded-xl cursor-not-allowed flex items-center gap-2"
                      >
                        <FiLock className="w-4 h-4" />
                        Locked
                      </button>
                    ) : (
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <FiExternalLink className="w-4 h-4" />
                        Open
                      </a>
                    )}
                  </div>
                </div>

                <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        )}

        <ResourceDetailsModal
          resource={selectedResource}
          isOpen={!!selectedResource}
          onClose={() => setSelectedResource(null)}
        />

        {/* Enhanced Submit Modal with Cloudinary Upload - Like SubmissionForm */}
        <AnimatePresence>
          {showSubmitModal && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSubmitModal(false)}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-100"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 relative">
                  <button onClick={() => setShowSubmitModal(false)} className="absolute top-4 right-4 text-white">
                    <FiX size={24} />
                  </button>
                  <h3 className="text-2xl font-bold text-white">Submit New Resource</h3>
                  <p className="text-blue-100 mt-1">Share valuable learning materials with the community</p>
                </div>

                {/* Form */}
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                  <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Title */}
                    <div>
                      <label className="flex items-center font-medium text-gray-700 mb-1">
                        <FiBookOpen className="mr-2 text-blue-600" />
                        Resource Title <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 border ${formErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`}
                        placeholder="e.g. Complete Python Programming Guide"
                      />
                      {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
                    </div>

                    {/* Category + Format */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="relative">
                        <label className="font-medium text-gray-700 mb-1 block">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-4 py-3 border ${formErrors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg appearance-none bg-white`}
                        >
                          <option value="">Select Category</option>
                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <FiChevronDown className="absolute right-4 top-11 text-gray-500 pointer-events-none" />
                        {formErrors.category && <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>}
                      </div>

                      <div>
                        <label className="font-medium text-gray-700 mb-1 block">Format</label>
                        <select
                          name="format"
                          value={formData.format}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
                        >
                          <option value="PDF">PDF Document</option>
                          <option value="Video">Video Tutorial</option>
                          <option value="Article">Article / Blog Post</option>
                          <option value="Course">Online Course</option>
                          <option value="Cheatsheet">Cheatsheet</option>
                          <option value="Tool">Tool / Software</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Difficulty + Year */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="font-medium text-gray-700 mb-1 block">Difficulty Level</label>
                        <select
                          name="difficulty"
                          value={formData.difficulty}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-medium text-gray-700 mb-1 block">Academic Year</label>
                        <input
                          type="number"
                          name="year"
                          value={formData.year}
                          onChange={handleInputChange}
                          min="2000"
                          max="2100"
                          className={`w-full px-4 py-3 border ${formErrors.year ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                        />
                        {formErrors.year && <p className="text-red-500 text-sm mt-1">{formErrors.year}</p>}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="font-medium text-gray-700 mb-1 block">Tags (comma separated)</label>
                      <input
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        placeholder="e.g., python, tutorial, beginner, data-science"
                      />
                    </div>

                    {/* Resource Link */}
                    <div>
                      <label className="font-medium text-gray-700 mb-1 block">
                        Resource URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="link"
                        value={formData.link}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 border ${formErrors.link ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                        placeholder="https://example.com/resource"
                      />
                      {formErrors.link && <p className="text-red-500 text-sm mt-1">{formErrors.link}</p>}
                    </div>

                    {/* GitHub Link */}
                    <div>
                      <label className="font-medium text-gray-700 mb-1 block">GitHub Repository (optional)</label>
                      <input
                        name="github"
                        value={formData.github}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border ${formErrors.github ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                        placeholder="https://github.com/username/repo"
                      />
                      {formErrors.github && <p className="text-red-500 text-sm mt-1">{formErrors.github}</p>}
                    </div>

                    {/* Rich Text Description */}
                    <div>
                      <label className="font-medium text-gray-700 mb-1 block">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <div className={`border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg overflow-hidden bg-white`}>
                        <ReactQuill
                          theme="snow"
                          value={formData.description}
                          onChange={handleDescriptionChange}
                          modules={quillModules}
                          className="min-h-[180px]"
                          placeholder="Provide a detailed description of the resource, what learners will gain, target audience, prerequisites, etc..."
                        />
                      </div>
                      {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
                    </div>

                    {/* Images Section */}
                    <div>
                      <label className="font-medium text-gray-700 mb-2 block flex items-center">
                        <FiImage className="mr-2 text-blue-600" />
                        Resource Images (first one will be used as cover) <span className="text-red-500 ml-1">*</span>
                      </label>

                      <button
                        type="button"
                        onClick={openImageUpload}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                      >
                        Upload Images
                      </button>
                      {formErrors.images && <p className="text-red-500 text-sm mt-2">{formErrors.images}</p>}

                      {images.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {images.map((img, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={img.thumbnail}
                                alt={`preview ${idx + 1}`}
                                className="w-full h-24 object-cover rounded-lg border"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100"
                              >
                                <FiX size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Videos Section */}
                    <div>
                      <label className="font-medium text-gray-700 mb-2 block flex items-center">
                        <FiVideo className="mr-2 text-purple-600" />
                        Resource Videos (optional – multiple allowed)
                      </label>

                      <button
                        type="button"
                        onClick={openVideoUpload}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                      >
                        Upload Videos
                      </button>

                      {videos.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {videos.map((videoUrl, idx) => (
                            <div key={idx} className="relative group">
                              <video
                                src={videoUrl}
                                controls
                                className="w-full h-32 object-cover rounded-lg border"
                              />
                              <button
                                type="button"
                                onClick={() => removeVideo(idx)}
                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <FiX size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Restricted Checkbox */}
                    <div>
                      <label className="flex items-start gap-3 cursor-pointer select-none p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        <input
                          type="checkbox"
                          name="restricted"
                          checked={formData.restricted}
                          onChange={handleInputChange}
                          className="w-5 h-5 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <span className="font-medium text-slate-700 block">Restricted Access</span>
                          <p className="text-sm text-slate-500 mt-1">
                            Only logged-in users will be able to access this resource
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-medium flex justify-center items-center disabled:opacity-60"
                    >
                      <FiSend className="mr-2" />
                      {submitting ? 'Submitting...' : 'Submit Resource'}
                    </motion.button>

                    {error && <p className="text-red-600 text-center font-medium mt-2">{error}</p>}
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ResourceCard;