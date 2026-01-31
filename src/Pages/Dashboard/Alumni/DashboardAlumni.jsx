// // src/pages/dashboard/DashboardAlumni.jsx
// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   GraduationCap, Search, Edit3, Trash, Upload, CheckCircle,
//   Users, MapPin, Briefcase, Calendar, Image as ImageIcon, Download
// } from 'lucide-react';
// import Swal from 'sweetalert2';

// const initialAlumni = [
//   {
//     id: 1,
//     name: "Professor Dr. Kazi Masudul Alam",
//     batch: "Faculty",
//     session: "N/A",
//     role: "Faculty Advisor",
//     company: "Khulna University",
//     location: "Khulna, Bangladesh",
//     image_url: "https://i.ibb.co.com/bXynWfb/Money.png",
//     email: "masudul@cseku.edu.bd"
//   },
//   {
//     id: 2,
//     name: "Tahmid Hasan Tasfi",
//     batch: "CSE-21",
//     session: "2021",
//     role: "President",
//     company: "Khulna University Alumni",
//     location: "Dhaka, Bangladesh",
//     image_url: "https://i.ibb.co/TqxvVFb3/tasfi.jpg",
//     email: "tasfi@example.com"
//   },
//   {
//     id: 3,
//     name: "Md Tasbi Hassan",
//     batch: "CSE-21",
//     session: "2021",
//     role: "Vice President-1",
//     company: "Khulna University",
//     location: "Khulna, Bangladesh",
//     image_url: "https://i.ibb.co/4RhPX7Ks/tasbi.jpg",
//     email: "tasbi@example.com"
//   },
// ];

// const initialSuccessStories = [
//   {
//     id: 1,
//     image: "https://images.unsplash.com/photo-1516321310762-479437144403",
//     name: "John Doe",
//     position: "Software Engineer",
//     company: "Google",
//     quote: "CLUSTER helped me build the skills I needed for my dream job."
//   },
//   {
//     id: 2,
//     image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
//     name: "Jane Smith",
//     position: "Data Scientist",
//     company: "Microsoft",
//     quote: "The mentorship program was invaluable in my career journey."
//   },
// ];

// const getAlumniColor = (role) => ({
//   'Faculty Advisor': 'bg-gradient-to-r from-indigo-600 to-purple-700',
//   President: 'bg-gradient-to-r from-blue-600 to-indigo-700',
//   'Vice President-1': 'bg-gradient-to-r from-green-600 to-teal-700'
// }[role] || 'bg-gray-600');

// const getAlumniIcon = (role) => ({
//   'Faculty Advisor': <GraduationCap className="w-7 h-7" />,
//   President: <Users className="w-7 h-7" />,
//   'Vice President-1': <Briefcase className="w-7 h-7" />
// }[role]);

// // Helper function to export data as CSV
// const exportToCSV = (data, filename) => {
//   if (data.length === 0) {
//     Swal.fire('No Data', 'There is nothing to export.', 'info');
//     return;
//   }

//   // Define headers based on section
//   const headers = data[0].position !== undefined
//     ? ['Name', 'Position', 'Company', 'Quote', 'Image']
//     : ['Name', 'Batch', 'Session', 'Role', 'Company', 'Location', 'Email', 'Image URL'];

//   // Convert data to CSV rows
//   const rows = data.map(item => {
//     if (item.position !== undefined) {
//       // Success story
//       return [
//         `"${item.name.replace(/"/g, '""')}"`,
//         `"${item.position.replace(/"/g, '""')}"`,
//         `"${item.company.replace(/"/g, '""')}"`,
//         `"${item.quote.replace(/"/g, '""')}"`,
//         `"${item.image}"`
//       ].join(',');
//     } else {
//       // Alumni
//       return [
//         `"${item.name.replace(/"/g, '""')}"`,
//         `"${item.batch.replace(/"/g, '""')}"`,
//         `"${item.session.replace(/"/g, '""')}"`,
//         `"${item.role.replace(/"/g, '""')}"`,
//         `"${item.company.replace(/"/g, '""')}"`,
//         `"${item.location.replace(/"/g, '""')}"`,
//         `"${item.email.replace(/"/g, '""')}"`,
//         `"${item.image_url}"`
//       ].join(',');
//     }
//   });

//   // Create CSV content
//   const csvContent = [
//     headers.join(','),
//     ...rows
//   ].join('\n');

//   // Create download link
//   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.href = url;
//   link.setAttribute('download', `${filename}.csv`);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
//   URL.revokeObjectURL(url);

//   Swal.fire('Exported!', `${filename}.csv has been downloaded.`, 'success');
// };

// export default function DashboardAlumni() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [alumni, setAlumni] = useState(initialAlumni);
//   const [successStories, setSuccessStories] = useState(initialSuccessStories);
//   const [showModal, setShowModal] = useState(false);
//   const [editingItem, setEditingItem] = useState(null);
//   const [activeSection, setActiveSection] = useState('alumni'); // 'alumni' or 'stories'

//   const [formData, setFormData] = useState({
//     name: '', batch: '', session: '', role: '', company: '', location: '', image_url: '', email: '',
//     position: '', quote: '', image: ''
//   });

//   const filteredAlumni = alumni.filter(a =>
//     a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     a.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     a.company.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredStories = successStories.filter(s =>
//     s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     s.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     s.company.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const openModal = (item = null, section = 'alumni') => {
//     setEditingItem(item);
//     setActiveSection(section);
//     if (item) {
//       if (section === 'alumni') {
//         setFormData({
//           name: item.name,
//           batch: item.batch,
//           session: item.session,
//           role: item.role,
//           company: item.company,
//           location: item.location,
//           image_url: item.image_url,
//           email: item.email,
//           position: '',
//           quote: '',
//           image: ''
//         });
//       } else {
//         setFormData({
//           name: item.name,
//           position: item.position,
//           company: item.company,
//           image: item.image,
//           quote: item.quote,
//           batch: '', session: '', role: '', location: '', email: '', image_url: ''
//         });
//       }
//     } else {
//       setFormData({ name: '', batch: '', session: '', role: '', company: '', location: '', image_url: '', email: '', position: '', quote: '', image: '' });
//     }
//     setShowModal(true);
//   };

//   const handleSave = async () => {
//     if (activeSection === 'alumni' && (!formData.name || !formData.role || !formData.company)) {
//       Swal.fire('Error!', 'Please fill required fields', 'error');
//       return;
//     }
//     if (activeSection === 'stories' && (!formData.name || !formData.position || !formData.company || !formData.quote)) {
//       Swal.fire('Error!', 'Please fill required fields', 'error');
//       return;
//     }

//     const newItem = { ...formData };

//     if (editingItem) {
//       if (activeSection === 'alumni') {
//         setAlumni(prev => prev.map(a => a.id === editingItem.id ? { ...newItem, id: a.id } : a));
//       } else {
//         setSuccessStories(prev => prev.map(s => s.id === editingItem.id ? { ...newItem, id: s.id } : s));
//       }
//       await Swal.fire('Updated!', `${formData.name} has been updated.`, 'success');
//     } else {
//       newItem.id = Date.now();
//       if (activeSection === 'alumni') {
//         setAlumni(prev => [...prev, newItem]);
//       } else {
//         setSuccessStories(prev => [...prev, newItem]);
//       }
//       await Swal.fire('Added!', `${formData.name} has been added.`, 'success');
//     }

//     setShowModal(false);
//     setEditingItem(null);
//   };

//   const confirmDelete = async (item, section) => {
//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: `Delete ${item.name}?`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#6b7280',
//       confirmButtonText: 'Yes, delete!',
//       cancelButtonText: 'Cancel'
//     });

//     if (result.isConfirmed) {
//       if (section === 'alumni') {
//         setAlumni(prev => prev.filter(a => a.id !== item.id));
//       } else {
//         setSuccessStories(prev => prev.filter(s => s.id !== item.id));
//       }
//       Swal.fire('Deleted!', `${item.name} has been removed.`, 'success');
//     }
//   };

//   const handleCSVImport = (section) => {
//     Swal.fire({
//       title: 'Import CSV File',
//       text: `Upload ${section === 'alumni' ? 'Alumni' : 'Success Stories'} list`,
//       input: 'file',
//       inputAttributes: { accept: '.csv' },
//       showCancelButton: true,
//       confirmButtonText: 'Import',
//       preConfirm: (file) => file || Swal.showValidationMessage('Please select a file')
//     }).then((result) => {
//       if (result.isConfirmed) {
//         // Simulate import
//         setTimeout(() => {
//           const newItem = { id: Date.now(), name: "Imported " + (section === 'alumni' ? 'Alumni' : 'Story'), role: "Imported", company: "Imported" };
//           if (section === 'alumni') {
//             setAlumni(prev => [...prev, newItem]);
//           } else {
//             setSuccessStories(prev => [...prev, newItem]);
//           }
//           Swal.fire('Imported!', 'Sample entry added.', 'success');
//         }, 1200);
//       }
//     });
//   };

//   const AlumniSection = ({ title, items, section }) => (
//     <div className="mt-12">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//         <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-3">
//           <GraduationCap className="w-9 h-9" /> {title}
//         </h3>
//         <div className="flex flex-wrap gap-3">
//           <motion.button
//             onClick={() => handleCSVImport(section)}
//             className="px-4 py-2 bg-gray-200 dark:bg-slate-700 rounded-xl flex items-center gap-2 hover:bg-gray-300 dark:hover:bg-slate-600 text-sm"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <Upload className="w-4 h-4" /> Import CSV
//           </motion.button>

//           <motion.button
//             onClick={() => openModal(null, section)}
//             className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl flex items-center gap-2 hover:shadow-xl text-sm"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <CheckCircle className="w-4 h-4" /> Add {section === 'alumni' ? 'Alumni' : 'Story'}
//           </motion.button>

//           <motion.button
//             onClick={() => exportToCSV(items, section === 'alumni' ? 'KU_CSE_Alumni' : 'Success_Stories')}
//             className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 text-sm shadow-sm transition-all"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <Download className="w-4 h-4" /> Export CSV
//           </motion.button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {items.map(item => (
//           <motion.div
//             key={item.id}
//             className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             whileHover={{ y: -5 }}
//           >
//             <div className={`${getAlumniColor(item.role || item.position)} p-4 text-white`}>
//               <h4 className="font-bold text-lg">{item.name}</h4>
//               <p className="text-sm opacity-90">{item.role || item.position} • {item.company}</p>
//             </div>
//             <div className="p-4 space-y-2">
//               {section === 'alumni' && (
//                 <>
//                   <p className="text-gray-600 dark:text-gray-300 text-sm">
//                     Batch: <span className="font-medium">{item.batch}</span> • Session: <span className="font-medium">{item.session}</span>
//                   </p>
//                   <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
//                     <MapPin className="w-4 h-4" /> {item.location}
//                   </div>
//                   <div className="text-gray-600 dark:text-gray-300 text-sm break-all">
//                     <Briefcase className="w-4 h-4 inline mr-1" /> {item.email}
//                   </div>
//                 </>
//               )}
//               {section === 'stories' && (
//                 <p className="text-gray-600 dark:text-gray-300 text-sm italic">
//                   "{item.quote}"
//                 </p>
//               )}
//               <div className="flex justify-end gap-3 mt-4">
//                 <motion.button
//                   onClick={() => openModal(item, section)}
//                   className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
//                   whileHover={{ scale: 1.1 }}
//                 >
//                   <Edit3 className="w-5 h-5 text-blue-600 dark:text-blue-300" />
//                 </motion.button>
//                 <motion.button
//                   onClick={() => confirmDelete(item, section)}
//                   className="p-2 bg-red-100 dark:bg-red-900 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
//                   whileHover={{ scale: 1.1 }}
//                 >
//                   <Trash className="w-5 h-5 text-red-600 dark:text-red-300" />
//                 </motion.button>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {items.length === 0 && (
//         <div className="text-center py-12 text-gray-500 dark:text-gray-400">
//           No {section === 'alumni' ? 'alumni' : 'success stories'} found matching your search.
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="space-y-10">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
//           <GraduationCap className="w-8 h-8 text-blue-600" />
//           Manage Alumni Network
//         </h1>

//         <div className="relative w-full sm:w-80">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search by name, role, company..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//           />
//         </div>
//       </div>

//       {/* Sections */}
//       <AlumniSection title="KU CSE Network" items={filteredAlumni} section="alumni" />
//       <AlumniSection title="Success Stories" items={filteredStories} section="stories" />

//       {/* Add/Edit Modal */}
//       <AnimatePresence>
//         {showModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 50 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 50 }}
//               className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-8"
//               onClick={e => e.stopPropagation()}
//             >
//               <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
//                 {editingItem ? 'Edit' : 'Add New'} {activeSection === 'alumni' ? 'Alumni Profile' : 'Success Story'}
//               </h3>

//               <div className="space-y-5">
//                 <input
//                   type="text"
//                   placeholder="Full Name *"
//                   value={formData.name}
//                   onChange={e => setFormData({ ...formData, name: e.target.value })}
//                   className="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:border-blue-500 focus:outline-none"
//                 />

//                 {activeSection === 'alumni' ? (
//                   <>
//                     <input type="text" placeholder="Batch (e.g. CSE-18)" value={formData.batch}
//                       onChange={e => setFormData({ ...formData, batch: e.target.value })}
//                       className="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:border-blue-500 focus:outline-none"
//                     />
//                     <input type="text" placeholder="Session / Passing Year" value={formData.session}
//                       onChange={e => setFormData({ ...formData, session: e.target.value })}
//                       className="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:border-blue-500 focus:outline-none"
//                     />
//                     <input type="text" placeholder="Current Role / Position" value={formData.role}
//                       onChange={e => setFormData({ ...formData, role: e.target.value })}
//                       className="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:border-blue-500 focus:outline-none"
//                     />
//                     <input type="text" placeholder="Company / Organization" value={formData.company}
//                       onChange={e => setFormData({ ...formData, company: e.target.value })}
//                       className="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:border-blue-500 focus:outline-none"
//                     />
//                     <input type="text" placeholder="Location (City, Country)" value={formData.location}
//                       onChange={e => setFormData({ ...formData, location: e.target.value })}
//                       className="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:border-blue-500 focus:outline-none"
//                     />
//                     <input type="email" placeholder="Email Address" value={formData.email}
//                       onChange={e => setFormData({ ...formData, email: e.target.value })}
//                       className="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:border-blue-500 focus:outline-none"
//                     />
//                     <input type="text" placeholder="Profile Picture URL" value={formData.image_url}
//                       onChange={e => setFormData({ ...formData, image_url: e.target.value })}
//                       className="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:border-blue-500 focus:outline-none"
//                     />
//                   </>
//                 ) : (
//                   <>
//                     <input type="text" placeholder="Current Position" value={formData.position}
//                       onChange={e => setFormData({ ...formData, position: e.target.value })}
//                       className="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:border-blue-500 focus:outline-none"
//                     />
//                     <input type="text" placeholder="Company / Organization" value={formData.company}
//                       onChange={e => setFormData({ ...formData, company: e.target.value })}
//                       className="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:border-blue-500 focus:outline-none"
//                     />
//                     <textarea placeholder="Success Story Quote" value={formData.quote}
//                       onChange={e => setFormData({ ...formData, quote: e.target.value })}
//                       className="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:border-blue-500 focus:outline-none min-h-[120px]"
//                     />
//                     <input type="text" placeholder="Photo URL" value={formData.image}
//                       onChange={e => setFormData({ ...formData, image: e.target.value })}
//                       className="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:border-blue-500 focus:outline-none"
//                     />
//                   </>
//                 )}
//               </div>

//               <div className="flex gap-4 mt-8">
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="flex-1 py-4 bg-gray-200 dark:bg-slate-700 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-slate-600 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSave}
//                   className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-bold hover:shadow-xl transition flex items-center justify-center gap-2"
//                 >
//                   <CheckCircle className="w-5 h-5" />
//                   {editingItem ? 'Update' : 'Add'} {activeSection === 'alumni' ? 'Alumni' : 'Story'}
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
// src/pages/dashboard/DashboardAlumni.jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Search, Edit3, Trash, Upload, CheckCircle,
  Users, MapPin, Briefcase,  Image as  Download
} from 'lucide-react';
import Swal from 'sweetalert2';
import Papa from 'papaparse';
import {
  getAlumni, createAlumni, updateAlumni, deleteAlumni,
  getSuccessStories, createSuccessStory, updateSuccessStory, deleteSuccessStory
} from '../../../api'; // Adjust path to your api file

const getAlumniColor = (role) => ({
  'Faculty Advisor': 'bg-gradient-to-r from-indigo-600 to-purple-700',
  President: 'bg-gradient-to-r from-blue-600 to-indigo-700',
  'Vice President-1': 'bg-gradient-to-r from-green-600 to-teal-700'
}[role] || 'bg-gray-600');

const getAlumniIcon = (role) => ({
  'Faculty Advisor': <GraduationCap className="w-7 h-7" />,
  President: <Users className="w-7 h-7" />,
  'Vice President-1': <Briefcase className="w-7 h-7" />
}[role] || <GraduationCap className="w-7 h-7" />);

// ────────────────────────────────────────────────
// CSV Export
// ────────────────────────────────────────────────
const exportToCSV = (data, filename) => {
  if (data.length === 0) {
    Swal.fire('No Data', 'Nothing to export.', 'info');
    return;
  }

  const isSuccessStory = !!data[0]?.position;

  const headers = isSuccessStory
    ? ['Name', 'Position', 'Company', 'Quote', 'Image']
    : ['Name', 'Batch', 'Session', 'Role', 'Company', 'Location', 'Email', 'Image URL'];

  const rows = data.map(item => {
    if (isSuccessStory) {
      return [
        `"${(item.name || '').replace(/"/g, '""')}"`,
        `"${(item.position || '').replace(/"/g, '""')}"`,
        `"${(item.company || '').replace(/"/g, '""')}"`,
        `"${(item.quote || '').replace(/"/g, '""')}"`,
        `"${(item.image || '')}"`
      ].join(',');
    } else {
      return [
        `"${(item.name || '').replace(/"/g, '""')}"`,
        `"${(item.batch || '').replace(/"/g, '""')}"`,
        `"${(item.session || '').replace(/"/g, '""')}"`,
        `"${(item.role || '').replace(/"/g, '""')}"`,
        `"${(item.company || '').replace(/"/g, '""')}"`,
        `"${(item.location || '').replace(/"/g, '""')}"`,
        `"${(item.email || '').replace(/"/g, '""')}"`,
        `"${(item.image_url || '')}"`
      ].join(',');
    }
  });

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().slice(0,10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);

  Swal.fire('Exported!', `${data.length} item(s) exported.`, 'success');
};

export default function DashboardAlumni() {
  const [searchTerm, setSearchTerm] = useState('');
  const [alumni, setAlumni] = useState([]);
  const [successStories, setSuccessStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeSection, setActiveSection] = useState('alumni'); // 'alumni' or 'stories'

  const [formData, setFormData] = useState({
    name: '', batch: '', session: '', role: '', company: '', location: '', image_url: '', email: '',
    position: '', quote: '', image: ''
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [alumniRes, storiesRes] = await Promise.all([
          getAlumni(),
          getSuccessStories()
        ]);
        setAlumni(alumniRes.data);
        setSuccessStories(storiesRes.data);
      } catch (err) {
        Swal.fire('Error', 'Failed to load alumni data', 'error',err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAlumni = alumni.filter(a =>
    a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStories = successStories.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (item = null, section = 'alumni') => {
    setEditingItem(item);
    setActiveSection(section);
    if (item) {
      setFormData(section === 'alumni' ? {
        name: item.name || '',
        batch: item.batch || '',
        session: item.session || '',
        role: item.role || '',
        company: item.company || '',
        location: item.location || '',
        image_url: item.image_url || '',
        email: item.email || '',
        position: '', quote: '', image: ''
      } : {
        name: item.name || '',
        position: item.position || '',
        company: item.company || '',
        image: item.image || '',
        quote: item.quote || '',
        batch: '', session: '', role: '', location: '', email: '', image_url: ''
      });
    } else {
      setFormData({
        name: '', batch: '', session: '', role: '', company: '', location: '', image_url: '', email: '',
        position: '', quote: '', image: ''
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    const isAlumni = activeSection === 'alumni';
    const required = isAlumni
      ? ['name', 'role', 'company']
      : ['name', 'position', 'company', 'quote'];

    const errors = required.filter(field => !formData[field]?.trim());
    if (errors.length > 0) {
      Swal.fire('Missing Fields', 'Please fill all required fields', 'error');
      return;
    }

    const payload = isAlumni ? {
      name: formData.name.trim(),
      batch: formData.batch?.trim() || '',
      session: formData.session?.trim() || '',
      role: formData.role.trim(),
      company: formData.company.trim(),
      location: formData.location?.trim() || '',
      image_url: formData.image_url?.trim() || '',
      email: formData.email?.trim() || ''
    } : {
      name: formData.name.trim(),
      position: formData.position.trim(),
      company: formData.company.trim(),
      quote: formData.quote.trim(),
      image: formData.image?.trim() || ''
    };

    try {
      let updated;
      if (editingItem) {
        const method = isAlumni ? updateAlumni : updateSuccessStory;
        const { data } = await method(editingItem.id, payload);
        updated = isAlumni
          ? alumni.map(a => a.id === data.id ? data : a)
          : successStories.map(s => s.id === data.id ? data : s);
        if (isAlumni) setAlumni(updated); else setSuccessStories(updated);
        Swal.fire('Success', 'Updated successfully', 'success');
      } else {
        const method = isAlumni ? createAlumni : createSuccessStory;
        const { data } = await method(payload);
        updated = isAlumni
          ? [...alumni, data]
          : [...successStories, data];
        if (isAlumni) setAlumni(updated); else setSuccessStories(updated);
        Swal.fire('Success', 'Added successfully', 'success');
      }
      setShowModal(false);
      setEditingItem(null);
    } catch (err) {
      let msg = 'Failed to save';
      if (err.response?.data) msg = JSON.stringify(err.response.data, null, 2);
      Swal.fire('Error', msg, 'error');
    }
  };

  const confirmDelete = async (item, section) => {
    const res = await Swal.fire({
      title: 'Delete?',
      text: `Delete ${item.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes'
    });

    if (res.isConfirmed) {
      try {
        const method = section === 'alumni' ? deleteAlumni : deleteSuccessStory;
        await method(item.id);
        if (section === 'alumni') {
          setAlumni(prev => prev.filter(a => a.id !== item.id));
        } else {
          setSuccessStories(prev => prev.filter(s => s.id !== item.id));
        }
        Swal.fire('Deleted', 'Item removed', 'success');
      } catch (err) {
        Swal.fire('Error', 'Delete failed', 'error',err);
      }
    }
  };

  const handleCSVImport = (section) => {
    Swal.fire({
      title: `Import ${section === 'alumni' ? 'Alumni' : 'Success Stories'}`,
      text: 'Upload CSV',
      input: 'file',
      inputAttributes: { accept: '.csv' },
      showCancelButton: true,
      confirmButtonText: 'Import',
      showLoaderOnConfirm: true,
      preConfirm: file => new Promise((resolve, reject) => {
        if (!file) return reject('No file');

        Papa.parse(file, {
          header: true,
          skipEmptyLines: 'greedy',
          transformHeader: h => h.trim().toLowerCase(),
          complete: result => {
            if (result.errors.length) return reject(result.errors.map(e => e.message).join('; '));
            if (!result.data.length) return reject('Empty CSV');

            const isAlumni = section === 'alumni';

            const valid = result.data
              .filter(row => row.name?.trim())
              .map(row => {
                if (isAlumni) {
                  return {
                    name: row.name.trim(),
                    batch: row.batch?.trim() || '',
                    session: row.session?.trim() || '',
                    role: row.role?.trim() || '',
                    company: row.company?.trim() || '',
                    location: row.location?.trim() || '',
                    image_url: row.image_url?.trim() || row.image?.trim() || '',
                    email: row.email?.trim() || ''
                  };
                } else {
                  return {
                    name: row.name.trim(),
                    position: row.position?.trim() || '',
                    company: row.company?.trim() || '',
                    quote: row.quote?.trim() || '',
                    image: row.image?.trim() || row.image_url?.trim() || ''
                  };
                }
              });

            if (!valid.length) reject('No valid rows');
            resolve(valid);
          },
          error: err => reject(err.message)
        });
      })
    }).then(result => {
      if (result.isConfirmed) importFromCSV(result.value, section);
    }).catch(err => {
      if (err && err !== 'cancel') Swal.fire('Import Failed', String(err), 'error');
    });
  };

  const importFromCSV = async (rows, section) => {
    try {
      const added = [];
      const method = section === 'alumni' ? createAlumni : createSuccessStory;
      for (const row of rows) {
        try {
          const { data } = await method(row);
          added.push(data);
        } catch (e) {
          console.error('Failed row:', row, e.response?.data);
        }
      }
      if (added.length > 0) {
        if (section === 'alumni') setAlumni(prev => [...prev, ...added]);
        else setSuccessStories(prev => [...prev, ...added]);
        Swal.fire('Imported', `${added.length} item(s) added`, 'success');
      }
    } catch (err) {
      Swal.fire('Error', 'Import failed', 'error',err.message);
    }
  };

  const AlumniSection = ({ title, items, section }) => (
    <div className="mt-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <GraduationCap className="w-9 h-9" /> {title}
        </h3>
        <div className="flex flex-wrap gap-3">
          <motion.button
            onClick={() => handleCSVImport(section)}
            className="px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-xl flex items-center gap-2 text-sm"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Upload size={16} /> Import CSV
          </motion.button>
          <motion.button
            onClick={() => openModal(null, section)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl flex items-center gap-2 text-sm shadow-sm"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <CheckCircle size={16} /> Add {section === 'alumni' ? 'Alumni' : 'Story'}
          </motion.button>
          <motion.button
            onClick={() => exportToCSV(items, section === 'alumni' ? 'Alumni' : 'Success_Stories')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 text-sm shadow-sm"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Download size={16} /> Export CSV
          </motion.button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          No {section === 'alumni' ? 'alumni' : 'success stories'} found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <motion.div
              key={item.id}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
            >
              <div className={`${getAlumniColor(item.role || item.position)} px-5 py-3 text-white flex items-center gap-3`}>
                {getAlumniIcon(item.role || item.position)}
                <h4 className="font-bold text-lg truncate">{item.name}</h4>
              </div>

              <div className="p-4 space-y-3 text-sm">
                {section === 'alumni' ? (
                  <>
                    <p className="text-gray-700 dark:text-gray-300">
                      {item.role} • {item.company}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Batch: {item.batch || '—'} • Session: {item.session || '—'}
                    </p>
                    {item.location && (
                      <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin size={16} /> {item.location}
                      </p>
                    )}
                    {item.email && (
                      <p className="text-gray-600 dark:text-gray-400 break-all">
                        {item.email}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 italic line-clamp-3">
                    &quot;{item.quote}&quot;
                  </p>
                )}

                <div className="flex justify-end gap-3 pt-3">
                  <motion.button
                    onClick={() => openModal(item, section)}
                    className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Edit3 size={18} className="text-blue-600 dark:text-blue-400" />
                  </motion.button>
                  <motion.button
                    onClick={() => confirmDelete(item, section)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Trash size={18} className="text-red-600 dark:text-red-400" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-blue-600" />
          Manage Alumni & Success Stories
        </h1>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, role, company..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <AlumniSection title="KU CSE Alumni" items={filteredAlumni} section="alumni" />
      <AlumniSection title="Success Stories" items={filteredStories} section="stories" />

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 40 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingItem ? 'Edit' : 'Add'} {activeSection === 'alumni' ? 'Alumni' : 'Success Story'}
                </h3>
              </div>

              <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="Full name"
                    />
                  </div>

                  {activeSection === 'alumni' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Batch</label>
                        <input
                          type="text"
                          value={formData.batch}
                          onChange={e => setFormData({ ...formData, batch: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                          placeholder="e.g. CSE-21"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Session / Year</label>
                        <input
                          type="text"
                          value={formData.session}
                          onChange={e => setFormData({ ...formData, session: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                          placeholder="e.g. 2021"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Role <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.role}
                          onChange={e => setFormData({ ...formData, role: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                          placeholder="e.g. President"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Company <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={e => setFormData({ ...formData, company: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                          placeholder="e.g. Google"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Location</label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={e => setFormData({ ...formData, location: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                          placeholder="e.g. Dhaka, Bangladesh"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Image URL</label>
                        <input
                          type="text"
                          value={formData.image_url}
                          onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                          placeholder="https://... or /images/alumni.jpg"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Position <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.position}
                          onChange={e => setFormData({ ...formData, position: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                          placeholder="e.g. Software Engineer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Company <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={e => setFormData({ ...formData, company: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                          placeholder="e.g. Google"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Quote <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={formData.quote}
                          onChange={e => setFormData({ ...formData, quote: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[140px]"
                          placeholder="Inspirational quote..."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Image URL</label>
                        <input
                          type="text"
                          value={formData.image}
                          onChange={e => setFormData({ ...formData, image: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                          placeholder="https://... or /images/story.jpg"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="px-6 py-5 border-t border-gray-200 dark:border-slate-700 flex gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-medium shadow-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} />
                  {editingItem ? 'Update' : 'Add'} {activeSection === 'alumni' ? 'Alumni' : 'Story'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}