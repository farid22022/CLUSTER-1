


// // src/pages/dashboard/DashboardContact.jsx
// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Mail, Search, Edit3, Trash, Upload, CheckCircle,
//   User, Facebook, Linkedin, Download, Quote
// } from 'lucide-react';
// import Swal from 'sweetalert2';
// import Papa from 'papaparse';

// const initialTeamMembers = [
//   {
//     id: 1,
//     designation: "Director",
//     name: "Professor Dr. Kazi Masudul Alam",
//     student_id: "210123",
//     image_url: "https://i.ibb.co.com/bXynWfb/Money.png",
//     facebook_url: "https://facebook.com/username1",
//     linkedin_url: "https://linkedin.com/in/username1",
//     email: "username1@email.com",
//     quote: "Leading with vision and empowering excellence."
//   },
//   {
//     id: 2,
//     designation: "President",
//     name: "Tahmid Hasan Tasfi",
//     student_id: "210218",
//     image_url: "https://i.ibb.co/TqxvVFb3/tasfi.jpg",
//     facebook_url: "https://facebook.com/username1",
//     linkedin_url: "https://linkedin.com/in/username1",
//     email: "username1@email.com",
//     quote: ""
//   },
//   {
//     id: 3,
//     designation: "Vice President-1",
//     name: "Md Tasbi Hassan",
//     student_id: "210216",
//     image_url: "https://i.ibb.co/4RhPX7Ks/tasbi.jpg",
//     facebook_url: "https://facebook.com/username2",
//     linkedin_url: "https://linkedin.com/in/username2",
//     email: "username2@email.com",
//     quote: ""
//   },
//   {
//     id: 4,
//     designation: "Vice President-2",
//     name: "Razu Sarder",
//     student_id: "220220",
//     image_url: "https://i.ibb.co/tpDz54TM/razu.jpg",
//     facebook_url: "https://facebook.com/username3",
//     linkedin_url: "https://linkedin.com/in/username3",
//     email: "username3@email.com",
//     quote: ""
//   },
//   {
//     id: 5,
//     designation: "General Secretary",
//     name: "Md Anjir Hossain",
//     student_id: "210230",
//     image_url: "https://i.ibb.co/1thHGwzw/anjir.jpg",
//     facebook_url: "https://facebook.com/username4",
//     linkedin_url: "https://linkedin.com/in/username4",
//     email: "username4@email.com",
//     quote: ""
//   },
//   {
//     id: 6,
//     designation: "Joint Secretary",
//     name: "Sohag Chandra",
//     student_id: "220238",
//     image_url: "https://i.ibb.co/jZ5W0PJJ/sohag.jpg",
//     facebook_url: "https://facebook.com/username5",
//     linkedin_url: "https://linkedin.com/in/username5",
//     email: "username5@email.com",
//     quote: ""
//   },
//   {
//     id: 7,
//     designation: "Treasurer",
//     name: "Md Ashiquzzaman Rahad",
//     student_id: "210201",
//     image_url: "https://i.ibb.co/yB7kHjfZ/rahad.jpg",
//     facebook_url: "https://facebook.com/username6",
//     linkedin_url: "https://linkedin.com/in/username6",
//     email: "username6@email.com",
//     quote: ""
//   },
//   {
//     id: 8,
//     designation: "Programming Campaign Secretary",
//     name: "Nahid Hassan",
//     student_id: "220229",
//     image_url: "https://i.ibb.co/cKHbZNg6/nahid.jpg",
//     facebook_url: "https://facebook.com/username7",
//     linkedin_url: "https://linkedin.com/in/username7",
//     email: "username7@email.com",
//     quote: ""
//   },
//   {
//     id: 9,
//     designation: "Workshop Secretary",
//     name: "Muhammad Fahim",
//     student_id: "210210",
//     image_url: "https://i.ibb.co/nq871XvD/Fahim.png",
//     facebook_url: "https://facebook.com/username8",
//     linkedin_url: "https://linkedin.com/in/username8",
//     email: "username8@email.com",
//     quote: ""
//   },
//   {
//     id: 10,
//     designation: "Assistant Workshop Secretary",
//     name: "Sardar Muhammad Sakib Hossain",
//     student_id: "230222",
//     image_url: "https://i.ibb.co.com/gDLBssv/230222-Sardar-Muhammad-Sakib-Hossain.jpg",
//     facebook_url: "https://facebook.com/username9",
//     linkedin_url: "https://linkedin.com/in/username9",
//     email: "username9@email.com",
//     quote: ""
//   },
//   {
//     id: 11,
//     designation: "WISE Secretary",
//     name: "Sharmika Das Banhi",
//     student_id: "210204",
//     image_url: "https://example.com/image10.jpg",
//     facebook_url: "https://facebook.com/username10",
//     linkedin_url: "https://linkedin.com/in/username10",
//     email: "username10@email.com",
//     quote: ""
//   },
//   {
//     id: 12,
//     designation: "Public Relations Secretary",
//     name: "Radhika Chowdhury",
//     student_id: "220239",
//     image_url: "https://example.com/image11.jpg",
//     facebook_url: "https://facebook.com/username11",
//     linkedin_url: "https://linkedin.com/in/username11",
//     email: "username11@email.com",
//     quote: ""
//   },
//   {
//     id: 13,
//     designation: "IT Secretary",
//     name: "Mohaiminul Islam Saad",
//     student_id: "220201",
//     image_url: "https://i.ibb.co/HTLfg95m/shaad.jpg",
//     facebook_url: "https://facebook.com/username12",
//     linkedin_url: "https://linkedin.com/in/username12",
//     email: "username12@email.com",
//     quote: ""
//   },
//   {
//     id: 14,
//     designation: "Assistant IT Secretary",
//     name: "Kazi Rifat Morshed",
//     student_id: "230220",
//     image_url: "https://i.ibb.co/V0RKRzgt/rifat.jpg",
//     facebook_url: "https://facebook.com/username13",
//     linkedin_url: "https://linkedin.com/in/username13",
//     email: "username13@email.com",
//     quote: ""
//   },
//   {
//     id: 15,
//     designation: "Campaign Secretary",
//     name: "Md Abdullah Al Mahin",
//     student_id: "230210",
//     image_url: "https://i.ibb.co.com/nCW3Pj2/Mahin.png",
//     facebook_url: "https://facebook.com/username14",
//     linkedin_url: "https://linkedin.com/in/username14",
//     email: "username14@email.com",
//     quote: ""
//   },
//   {
//     id: 16,
//     designation: "Cultural Secretary",
//     name: "SM Shibly Noman",
//     student_id: "230206",
//     image_url: "https://i.ibb.co.com/64dCbMy/230206-shibly.jpg",
//     facebook_url: "https://facebook.com/username15",
//     linkedin_url: "https://linkedin.com/in/username15",
//     email: "username15@email.com",
//     quote: ""
//   },
//   {
//     id: 17,
//     designation: "Member-1 (MSc.)",
//     name: "Istyaque Ahammed",
//     student_id: "M.Sc. 250235",
//     image_url: "https://i.ibb.co/wFzXp8KJ/istyake.jpg",
//     facebook_url: "https://facebook.com/username16",
//     linkedin_url: "https://linkedin.com/in/username16",
//     email: "username16@email.com",
//     quote: ""
//   },
//   {
//     id: 18,
//     designation: "Member-2 (BSc.)",
//     name: "Sneha Shah",
//     student_id: "240242",
//     image_url: "https://i.ibb.co/tpDz54TM/razu.jpg",
//     facebook_url: "https://facebook.com/username17",
//     linkedin_url: "https://linkedin.com/in/username17",
//     email: "username17@email.com",
//     quote: ""
//   },
//   {
//     id: 19,
//     designation: "Member-3 (BSc.)",
//     name: "Towhid Al Mahmud",
//     student_id: "240239",
//     image_url: "https://example.com/image18.jpg",
//     facebook_url: "https://facebook.com/username18",
//     linkedin_url: "https://linkedin.com/in/username18",
//     email: "username18@email.com",
//     quote: ""
//   },
//   {
//     id: 20,
//     designation: "Member-4 (BSc.)",
//     name: "Abir Khan Siam",
//     student_id: "240228",
//     image_url: "https://example.com/image19.jpg",
//     facebook_url: "https://facebook.com/username19",
//     linkedin_url: "https://linkedin.com/in/username19",
//     email: "username19@email.com",
//     quote: ""
//   }
// ];


// const initialFAQs = [
//   { id: 1, question: "How can I join CLUSTER?", answer: "Membership is open to all KU CSE students..." },
//   { id: 2, question: "What kind of events does CLUSTER organize?", answer: "We organize programming contests..." },
//   // ... add more as needed
// ];

// export default function DashboardContact() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
//   const [faqs, setFAQs] = useState(initialFAQs);
//   const [showModal, setShowModal] = useState(false);
//   const [editingItem, setEditingItem] = useState(null);
//   const [activeSection, setActiveSection] = useState('team'); // 'team' or 'faqs'

//   const [formData, setFormData] = useState({
//     designation: '', name: '', student_id: '', image_url: '',
//     facebook_url: '', linkedin_url: '', email: '', quote: '',
//     question: '', answer: ''
//   });

//   // Filtered lists
//   const filteredTeam = teamMembers.filter(t =>
//     (t.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (t.designation || '').toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredFAQs = faqs.filter(f =>
//     (f.question || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (f.answer || '').toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // ── CSV EXPORT ───────────────────────────────────────────
//   const exportToCSV = (data, filename) => {
//     if (!data?.length) {
//       Swal.fire('No Data', 'Nothing to export', 'info');
//       return;
//     }

//     let headers, rows;

//     if (filename.includes('Team')) {
//       headers = ['Designation', 'Name', 'Student ID', 'Image URL', 'Facebook URL', 'LinkedIn URL', 'Email', 'Quote'];
//       rows = data.map(r => [
//         `"${(r.designation || '').replace(/"/g, '""')}"`,
//         `"${(r.name || '').replace(/"/g, '""')}"`,
//         `"${(r.student_id || '').replace(/"/g, '""')}"`,
//         `"${(r.image_url || '').replace(/"/g, '""')}"`,
//         `"${(r.facebook_url || '').replace(/"/g, '""')}"`,
//         `"${(r.linkedin_url || '').replace(/"/g, '""')}"`,
//         `"${(r.email || '').replace(/"/g, '""')}"`,
//         `"${(r.quote || '').replace(/"/g, '""')}"`
//       ]);
//     } else {
//       headers = ['Question', 'Answer'];
//       rows = data.map(f => [
//         `"${(f.question || '').replace(/"/g, '""')}"`,
//         `"${(f.answer || '').replace(/"/g, '""')}"`
//       ]);
//     }

//     const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `${filename.replace(/\s+/g, '_')}.csv`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);

//     Swal.fire('Exported!', `${data.length} item(s) exported`, 'success', { timer: 2200 });
//   };

//   // ── CSV IMPORT ───────────────────────────────────────────
//   const handleCSVImport = (section) => {
//     Swal.fire({
//       title: `Import ${section === 'team' ? 'Team Members' : 'FAQs'}`,
//       text: 'Upload your CSV file',
//       input: 'file',
//       inputAttributes: { accept: '.csv' },
//       showCancelButton: true,
//       confirmButtonText: 'Import',
//       showLoaderOnConfirm: true,
//       preConfirm: (file) => {
//         return new Promise((resolve, reject) => {
//           if (!file) return reject('No file selected');

//           Papa.parse(file, {
//             header: true,
//             skipEmptyLines: 'greedy',
//             transformHeader: (header) => {
//               const cleaned = header.trim().toLowerCase().replace(/\s+/g, '_');
//               // Explicit mapping for exported CSV column names
//               const headerMap = {
//                 'designation': 'designation',
//                 'name': 'name',
//                 'student_id': 'student_id',
//                 'student id': 'student_id',
//                 'image_url': 'image_url',
//                 'facebook_url': 'facebook_url',
//                 'linkedin_url': 'linkedin_url',
//                 'email': 'email',
//                 'quote': 'quote',
//                 'question': 'question',
//                 'answer': 'answer'
//               };
//               return headerMap[cleaned] || cleaned;
//             },
//             complete: (result) => {
//               if (result.errors.length > 0) {
//                 return reject('CSV parsing error: ' + result.errors.map(e => e.message).join('; '));
//               }
//               if (!result.data.length) return reject('The CSV file is empty');

//               let validItems = [];

//               if (section === 'team') {
//                 validItems = result.data
//                   .filter(row => (row.name || '').trim() && (row.designation || '').trim())
//                   .map((row, idx) => ({
//                     id: Date.now() + idx,
//                     designation: (row.designation || '').trim(),
//                     name: (row.name || 'Untitled').trim(),
//                     student_id: (row.student_id || '').trim(),
//                     image_url: (row.image_url || '').trim(),
//                     facebook_url: (row.facebook_url || '').trim(),
//                     linkedin_url: (row.linkedin_url || '').trim(),
//                     email: (row.email || '').trim(),
//                     quote: (row.quote || '').trim()
//                   }));
//               } else {
//                 validItems = result.data
//                   .filter(row => (row.question || '').trim() && (row.answer || '').trim())
//                   .map((row, idx) => ({
//                     id: Date.now() + idx,
//                     question: (row.question || '').trim(),
//                     answer: (row.answer || '').trim()
//                   }));
//               }

//               if (validItems.length === 0) {
//                 return reject('No valid rows found (required fields missing)');
//               }

//               resolve(validItems);
//             },
//             error: (err) => reject('File read error: ' + err.message)
//           });
//         });
//       }
//     }).then((result) => {
//       if (result.isConfirmed) {
//         const imported = result.value;
//         if (section === 'team') {
//           setTeamMembers(prev => [...prev, ...imported]);
//         } else {
//           setFAQs(prev => [...prev, ...imported]);
//         }
//         Swal.fire({
//           title: 'Success',
//           text: `${imported.length} item${imported.length === 1 ? '' : 's'} imported successfully`,
//           icon: 'success',
//           timer: 2200
//         });
//       }
//     }).catch((err) => {
//       if (err && err !== 'Swal is cancelled') {
//         Swal.fire('Import Failed', err.toString(), 'error');
//       }
//     });
//   };

//   // ── MODAL OPEN / SAVE / DELETE ───────────────────────────
//   const openModal = (item = null, section = 'team') => {
//     setActiveSection(section);
//     setEditingItem(item);
//     setFormData(item ? (section === 'team' ? {
//       designation: item.designation || '',
//       name: item.name || '',
//       student_id: item.student_id || '',
//       image_url: item.image_url || '',
//       facebook_url: item.facebook_url || '',
//       linkedin_url: item.linkedin_url || '',
//       email: item.email || '',
//       quote: item.quote || ''
//     } : {
//       question: item.question || '',
//       answer: item.answer || ''
//     }) : (section === 'team' ? {
//       designation: '', name: '', student_id: '', image_url: '',
//       facebook_url: '', linkedin_url: '', email: '', quote: ''
//     } : {
//       question: '', answer: ''
//     }));
//     setShowModal(true);
//   };

//   const handleSave = async () => {
//     if (activeSection === 'team') {
//       if (!formData.name?.trim() || !formData.designation?.trim()) {
//         Swal.fire('Error', 'Name and Designation are required', 'error');
//         return;
//       }
//     } else {
//       if (!formData.question?.trim() || !formData.answer?.trim()) {
//         Swal.fire('Error', 'Question and Answer are required', 'error');
//         return;
//       }
//     }

//     const newItem = { ...formData };

//     if (editingItem) {
//       if (activeSection === 'team') {
//         setTeamMembers(prev => prev.map(t => t.id === editingItem.id ? { ...newItem, id: t.id } : t));
//       } else {
//         setFAQs(prev => prev.map(f => f.id === editingItem.id ? { ...newItem, id: f.id } : f));
//       }
//       await Swal.fire('Success', 'Updated successfully', 'success');
//     } else {
//       newItem.id = Date.now();
//       if (activeSection === 'team') {
//         setTeamMembers(prev => [...prev, newItem]);
//       } else {
//         setFAQs(prev => [...prev, newItem]);
//       }
//       await Swal.fire('Success', 'Added successfully', 'success');
//     }

//     setShowModal(false);
//     setEditingItem(null);
//   };

//   const confirmDelete = async (item, section) => {
//     const result = await Swal.fire({
//       title: 'Delete Item?',
//       text: `Are you sure you want to delete this ${section === 'team' ? 'team member' : 'FAQ'}?`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#ef4444',
//       cancelButtonColor: '#6b7280',
//       confirmButtonText: 'Yes, delete it!'
//     });

//     if (result.isConfirmed) {
//       if (section === 'team') {
//         setTeamMembers(prev => prev.filter(t => t.id !== item.id));
//       } else {
//         setFAQs(prev => prev.filter(f => f.id !== item.id));
//       }
//       Swal.fire('Deleted!', 'Item removed', 'success');
//     }
//   };

//   // ── RENDER ───────────────────────────────────────────────
//   return (
//     <div className="space-y-10 pb-10">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
//           <Mail className="w-8 h-8 text-blue-600" />
//           Manage Contact Page
//         </h1>

//         <div className="relative w-full sm:w-80">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search team or FAQs..."
//             value={searchTerm}
//             onChange={e => setSearchTerm(e.target.value)}
//             className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//           />
//         </div>
//       </div>

//       {/* Team Members Section */}
//       <div className="mt-10">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//           <h3 className="text-xl font-bold text-gray-800 dark:text-white">Team Members</h3>
//           <div className="flex flex-wrap gap-3">
//             <motion.button
//               onClick={() => handleCSVImport('team')}
//               className="px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-xl flex items-center gap-2 text-sm font-medium"
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.97 }}
//             >
//               <Upload size={16} /> Import CSV
//             </motion.button>

//             <motion.button
//               onClick={() => exportToCSV(filteredTeam, 'Team_Members')}
//               className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 text-sm font-medium shadow-sm"
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.97 }}
//             >
//               <Download size={16} /> Export CSV
//             </motion.button>

//             <motion.button
//               onClick={() => openModal(null, 'team')}
//               className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl flex items-center gap-2 text-sm font-medium shadow-sm"
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.97 }}
//             >
//               <CheckCircle size={16} /> Add Member
//             </motion.button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredTeam.map(member => (
//             <motion.div
//               key={member.id}
//               className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700 p-5 hover:shadow-lg transition-shadow"
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//             >
//               <div className="font-bold text-lg mb-1">{member.name}</div>
//               <div className="text-blue-600 dark:text-blue-400 mb-2">{member.designation}</div>
//               <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
//                 ID: {member.student_id || '—'}
//               </div>
//               <div className="flex justify-end gap-3 mt-4">
//                 <motion.button
//                   onClick={() => openModal(member, 'team')}
//                   className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors"
//                   whileHover={{ scale: 1.1 }}
//                 >
//                   <Edit3 size={18} className="text-blue-600 dark:text-blue-400" />
//                 </motion.button>
//                 <motion.button
//                   onClick={() => confirmDelete(member, 'team')}
//                   className="p-2 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
//                   whileHover={{ scale: 1.1 }}
//                 >
//                   <Trash size={18} className="text-red-600 dark:text-red-400" />
//                 </motion.button>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {!filteredTeam.length && (
//           <div className="text-center py-12 text-gray-500 dark:text-gray-400">
//             No team members found
//           </div>
//         )}
//       </div>

//       {/* FAQs Section */}
//       <div className="mt-12">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//           <h3 className="text-xl font-bold text-gray-800 dark:text-white">Frequently Asked Questions</h3>
//           <div className="flex flex-wrap gap-3">
//             <motion.button
//               onClick={() => handleCSVImport('faqs')}
//               className="px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-xl flex items-center gap-2 text-sm font-medium"
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.97 }}
//             >
//               <Upload size={16} /> Import CSV
//             </motion.button>

//             <motion.button
//               onClick={() => exportToCSV(filteredFAQs, 'FAQs')}
//               className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 text-sm font-medium shadow-sm"
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.97 }}
//             >
//               <Download size={16} /> Export CSV
//             </motion.button>

//             <motion.button
//               onClick={() => openModal(null, 'faqs')}
//               className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl flex items-center gap-2 text-sm font-medium shadow-sm"
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.97 }}
//             >
//               <CheckCircle size={16} /> Add FAQ
//             </motion.button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredFAQs.map(faq => (
//             <motion.div
//               key={faq.id}
//               className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700 p-5 hover:shadow-lg transition-shadow"
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//             >
//               <div className="font-semibold text-base mb-2">{faq.question}</div>
//               <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-4">{faq.answer}</p>
//               <div className="flex justify-end gap-3 mt-4">
//                 <motion.button
//                   onClick={() => openModal(faq, 'faqs')}
//                   className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors"
//                   whileHover={{ scale: 1.1 }}
//                 >
//                   <Edit3 size={18} className="text-blue-600 dark:text-blue-400" />
//                 </motion.button>
//                 <motion.button
//                   onClick={() => confirmDelete(faq, 'faqs')}
//                   className="p-2 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
//                   whileHover={{ scale: 1.1 }}
//                 >
//                   <Trash size={18} className="text-red-600 dark:text-red-400" />
//                 </motion.button>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {!filteredFAQs.length && (
//           <div className="text-center py-12 text-gray-500 dark:text-gray-400">
//             No FAQs found
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       <AnimatePresence>
//         {showModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.92, y: 40 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.92, y: 40 }}
//               className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
//               onClick={e => e.stopPropagation()}
//             >
//               <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-700">
//                 <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//                   {editingItem ? 'Edit' : 'Add New'} {activeSection === 'team' ? 'Team Member' : 'FAQ'}
//                 </h3>
//               </div>

//               <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
//                 {activeSection === 'team' ? (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
//                         Designation <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         value={formData.designation}
//                         onChange={e => setFormData({ ...formData, designation: e.target.value })}
//                         className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
//                         Full Name <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         value={formData.name}
//                         onChange={e => setFormData({ ...formData, name: e.target.value })}
//                         className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Student ID</label>
//                       <input
//                         type="text"
//                         value={formData.student_id}
//                         onChange={e => setFormData({ ...formData, student_id: e.target.value })}
//                         className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                       />
//                     </div>

//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Image URL</label>
//                       <input
//                         type="url"
//                         value={formData.image_url}
//                         onChange={e => setFormData({ ...formData, image_url: e.target.value })}
//                         className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                         placeholder="https://..."
//                       />
//                     </div>

//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Facebook URL</label>
//                       <input
//                         type="url"
//                         value={formData.facebook_url}
//                         onChange={e => setFormData({ ...formData, facebook_url: e.target.value })}
//                         className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                       />
//                     </div>

//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">LinkedIn URL</label>
//                       <input
//                         type="url"
//                         value={formData.linkedin_url}
//                         onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })}
//                         className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                       />
//                     </div>

//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
//                       <input
//                         type="email"
//                         value={formData.email}
//                         onChange={e => setFormData({ ...formData, email: e.target.value })}
//                         className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                       />
//                     </div>

//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Quote</label>
//                       <textarea
//                         value={formData.quote}
//                         onChange={e => setFormData({ ...formData, quote: e.target.value })}
//                         className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[100px]"
//                       />
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="space-y-5">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
//                         Question <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         value={formData.question}
//                         onChange={e => setFormData({ ...formData, question: e.target.value })}
//                         className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
//                         Answer <span className="text-red-500">*</span>
//                       </label>
//                       <textarea
//                         value={formData.answer}
//                         onChange={e => setFormData({ ...formData, answer: e.target.value })}
//                         className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[160px]"
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="px-6 py-5 border-t border-gray-200 dark:border-slate-700 flex gap-4">
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="flex-1 py-3.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-xl font-medium transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSave}
//                   className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-medium shadow-sm transition-all flex items-center justify-center gap-2"
//                 >
//                   <CheckCircle size={18} />
//                   {editingItem ? 'Update' : 'Add'}
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// src/pages/dashboard/DashboardContact.jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Search, Edit3, Trash, Upload, CheckCircle,
  User, Facebook, Linkedin, Download, Quote
} from 'lucide-react';
import Swal from 'sweetalert2';
import Papa from 'papaparse';
import {
  getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember,
  // You'll need to add these FAQ endpoints in api.js and backend
  getFAQs, createFAQ, updateFAQ, deleteFAQ
} from '../../../api'; // Adjust path

export default function DashboardContact() {
  const [searchTerm, setSearchTerm] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [faqs, setFAQs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeSection, setActiveSection] = useState('team'); // 'team' or 'faqs'

  const [formData, setFormData] = useState({
    designation: '', name: '', student_id: '', image_url: '',
    facebook_url: '', linkedin_url: '', email: '', quote: '',
    question: '', answer: ''
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [teamRes, faqRes] = await Promise.all([
          getTeamMembers(),
          getFAQs() // ← implement this
        ]);
        setTeamMembers(teamRes.data);
        setFAQs(faqRes.data);
      } catch (err) {
        Swal.fire('Error', 'Failed to load contact data', 'error',err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTeam = teamMembers.filter(t =>
    (t.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.designation || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFAQs = faqs?.filter(f =>
    (f.question || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.answer || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ────────────────────────────────────────────────
  // CSV Export
  // ────────────────────────────────────────────────
  const exportToCSV = (data, filename) => {
    if (!data?.length) {
      Swal.fire('No Data', 'Nothing to export', 'info');
      return;
    }

    let headers, rows;
    if (filename.includes('Team')) {
      headers = ['Designation', 'Name', 'Student ID', 'Image URL', 'Facebook URL', 'LinkedIn URL', 'Email', 'Quote'];
      rows = data.map(r => [
        `"${(r.designation || '').replace(/"/g, '""')}"`,
        `"${(r.name || '').replace(/"/g, '""')}"`,
        `"${(r.student_id || '').replace(/"/g, '""')}"`,
        `"${(r.image_url || '').replace(/"/g, '""')}"`,
        `"${(r.facebook_url || '').replace(/"/g, '""')}"`,
        `"${(r.linkedin_url || '').replace(/"/g, '""')}"`,
        `"${(r.email || '').replace(/"/g, '""')}"`,
        `"${(r.quote || '').replace(/"/g, '""')}"`
      ]);
    } else {
      headers = ['Question', 'Answer'];
      rows = data.map(f => [
        `"${(f.question || '').replace(/"/g, '""')}"`,
        `"${(f.answer || '').replace(/"/g, '""')}"`
      ]);
    }

    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    Swal.fire('Exported!', `${data.length} item(s) exported`, 'success');
  };

  // ────────────────────────────────────────────────
  // CSV Import
  // ────────────────────────────────────────────────
  const handleCSVImport = (section) => {
    Swal.fire({
      title: `Import ${section === 'team' ? 'Team Members' : 'FAQs'}`,
      text: 'Upload CSV file',
      input: 'file',
      inputAttributes: { accept: '.csv' },
      showCancelButton: true,
      confirmButtonText: 'Import',
      showLoaderOnConfirm: true,
      preConfirm: file => new Promise((resolve, reject) => {
        if (!file) return reject('No file selected');

        Papa.parse(file, {
          header: true,
          skipEmptyLines: 'greedy',
          transformHeader: h => h.trim().toLowerCase(),
          complete: result => {
            if (result.errors.length) return reject(result.errors.map(e => e.message).join('; '));
            if (!result.data.length) return reject('CSV is empty');

            let valid = [];
            if (section === 'team') {
              valid = result.data
                .filter(row => row.name?.trim() && row.designation?.trim())
                .map(row => ({
                  designation: row.designation.trim(),
                  name: row.name.trim(),
                  student_id: row.student_id?.trim() || '',
                  image_url: row.image_url?.trim() || '',
                  facebook_url: row.facebook_url?.trim() || '',
                  linkedin_url: row.linkedin_url?.trim() || '',
                  email: row.email?.trim() || '',
                  quote: row.quote?.trim() || ''
                }));
            } else {
              valid = result.data
                .filter(row => row.question?.trim() && row.answer?.trim())
                .map(row => ({
                  question: row.question.trim(),
                  answer: row.answer.trim()
                }));
            }

            if (!valid.length) reject('No valid rows found');
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
      const createMethod = section === 'team' ? createTeamMember : createFAQ;
      for (const row of rows) {
        try {
          const { data } = await createMethod(row);
          added.push(data);
        } catch (e) {
          console.error('Failed row:', row, e.response?.data);
        }
      }
      if (added.length > 0) {
        if (section === 'team') setTeamMembers(prev => [...prev, ...added]);
        else setFAQs(prev => [...prev, ...added]);
        Swal.fire('Imported', `${added.length} item(s) added`, 'success');
      }
    } catch (err) {
      Swal.fire('Error', 'Import failed', 'error',err.message);
    }
  };

  // ────────────────────────────────────────────────
  // Modal & CRUD
  // ────────────────────────────────────────────────
  const openModal = (item = null, section = 'team') => {
    setActiveSection(section);
    setEditingItem(item);
    setFormData(item ? (section === 'team' ? {
      designation: item.designation || '',
      name: item.name || '',
      student_id: item.student_id || '',
      image_url: item.image_url || '',
      facebook_url: item.facebook_url || '',
      linkedin_url: item.linkedin_url || '',
      email: item.email || '',
      quote: item.quote || ''
    } : {
      question: item.question || '',
      answer: item.answer || ''
    }) : (section === 'team' ? {
      designation: '', name: '', student_id: '', image_url: '',
      facebook_url: '', linkedin_url: '', email: '', quote: ''
    } : {
      question: '', answer: ''
    }));
    setShowModal(true);
  };

  const handleSave = async () => {
    const isTeam = activeSection === 'team';
    const requiredFields = isTeam
      ? ['name', 'designation']
      : ['question', 'answer'];

    const errors = requiredFields.filter(f => !formData[f]?.trim());
    if (errors.length) {
      Swal.fire('Missing Fields', 'Please fill required fields', 'error');
      return;
    }

    const payload = isTeam ? {
      designation: formData.designation.trim(),
      name: formData.name.trim(),
      student_id: formData.student_id?.trim() || '',
      image_url: formData.image_url?.trim() || '',
      facebook_url: formData.facebook_url?.trim() || '',
      linkedin_url: formData.linkedin_url?.trim() || '',
      email: formData.email?.trim() || '',
      quote: formData.quote?.trim() || ''
    } : {
      question: formData.question.trim(),
      answer: formData.answer.trim()
    };

    try {
      let updatedList;
      if (editingItem) {
        const method = isTeam ? updateTeamMember : updateFAQ;
        const { data } = await method(editingItem.id, payload);
        updatedList = isTeam
          ? teamMembers.map(t => t.id === data.id ? data : t)
          : faqs.map(f => f.id === data.id ? data : f);
        if (isTeam) setTeamMembers(updatedList); else setFAQs(updatedList);
        Swal.fire('Success', 'Updated', 'success');
      } else {
        const method = isTeam ? createTeamMember : createFAQ;
        const { data } = await method(payload);
        updatedList = isTeam
          ? [...teamMembers, data]
          : [...faqs, data];
        if (isTeam) setTeamMembers(updatedList); else setFAQs(updatedList);
        Swal.fire('Success', 'Added', 'success');
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
      text: `Delete this ${section === 'team' ? 'team member' : 'FAQ'}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280'
    });

    if (res.isConfirmed) {
      try {
        const method = section === 'team' ? deleteTeamMember : deleteFAQ;
        await method(item.id);
        if (section === 'team') {
          setTeamMembers(prev => prev.filter(t => t.id !== item.id));
        } else {
          setFAQs(prev => prev.filter(f => f.id !== item.id));
        }
        Swal.fire('Deleted', 'Removed successfully', 'success');
      } catch (err) {
        Swal.fire('Error', 'Delete failed', 'error',err.message);
      }
    }
  };

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <Mail className="w-8 h-8 text-blue-600" />
          Manage Contact Page
        </h1>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search team or FAQs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Team Members */}
      <div className="mt-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Team Members</h3>
          <div className="flex flex-wrap gap-3">
            <motion.button
              onClick={() => handleCSVImport('team')}
              className="px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-xl flex items-center gap-2 text-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Upload size={16} /> Import CSV
            </motion.button>
            <motion.button
              onClick={() => exportToCSV(filteredTeam, 'Team_Members')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 text-sm shadow-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Download size={16} /> Export CSV
            </motion.button>
            <motion.button
              onClick={() => openModal(null, 'team')}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl flex items-center gap-2 text-sm shadow-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <CheckCircle size={16} /> Add Member
            </motion.button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading team members...</div>
        ) : filteredTeam.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            No team members found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeam.map(member => (
              <motion.div
                key={member.id}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
              >
                <div className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                  <h4 className="font-bold text-lg">{member.name}</h4>
                  <p className="text-sm opacity-90">{member.designation}</p>
                </div>
                <div className="p-4 space-y-2 text-sm">
                  {member.student_id && <p>ID: {member.student_id}</p>}
                  {member.email && <p className="break-all">{member.email}</p>}
                  {member.quote && <p className="italic text-gray-600 dark:text-gray-400">"{member.quote}"</p>}
                  <div className="flex justify-end gap-3 pt-3">
                    <motion.button
                      onClick={() => openModal(member, 'team')}
                      className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Edit3 size={18} className="text-blue-600 dark:text-blue-400" />
                    </motion.button>
                    <motion.button
                      onClick={() => confirmDelete(member, 'team')}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
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

      {/* FAQs */}
      <div className="mt-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Frequently Asked Questions</h3>
          <div className="flex flex-wrap gap-3">
            <motion.button
              onClick={() => handleCSVImport('faqs')}
              className="px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-xl flex items-center gap-2 text-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Upload size={16} /> Import CSV
            </motion.button>
            <motion.button
              onClick={() => exportToCSV(filteredFAQs, 'FAQs')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 text-sm shadow-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Download size={16} /> Export CSV
            </motion.button>
            <motion.button
              onClick={() => openModal(null, 'faqs')}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl flex items-center gap-2 text-sm shadow-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <CheckCircle size={16} /> Add FAQ
            </motion.button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading FAQs...</div>
        ) : filteredFAQs.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            No FAQs found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFAQs.map(faq => (
              <motion.div
                key={faq.id}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
              >
                <div className="px-5 py-3 bg-gradient-to-r from-purple-600 to-violet-700 text-white">
                  <h4 className="font-bold text-lg">{faq.question}</h4>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-4">{faq.answer}</p>
                  <div className="flex justify-end gap-3 mt-4">
                    <motion.button
                      onClick={() => openModal(faq, 'faqs')}
                      className="p-2 hover:bg-purple-50 dark:hover:bg-purple-950 rounded-lg"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Edit3 size={18} className="text-purple-600 dark:text-purple-400" />
                    </motion.button>
                    <motion.button
                      onClick={() => confirmDelete(faq, 'faqs')}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
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
                  {editingItem ? 'Edit' : 'Add New'} {activeSection === 'team' ? 'Team Member' : 'FAQ'}
                </h3>
              </div>

              <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                {activeSection === 'team' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Designation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.designation}
                        onChange={e => setFormData({ ...formData, designation: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="e.g. President"
                      />
                    </div>
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Student ID</label>
                      <input
                        type="text"
                        value={formData.student_id}
                        onChange={e => setFormData({ ...formData, student_id: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="e.g. 210218"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Image URL</label>
                      <input
                        type="text"
                        value={formData.image_url}
                        onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="https://... or /images/member.jpg"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Facebook URL</label>
                      <input
                        type="url"
                        value={formData.facebook_url}
                        onChange={e => setFormData({ ...formData, facebook_url: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">LinkedIn URL</label>
                      <input
                        type="url"
                        value={formData.linkedin_url}
                        onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                    <div className="md:col-span-2">
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Quote</label>
                      <textarea
                        value={formData.quote}
                        onChange={e => setFormData({ ...formData, quote: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[100px]"
                        placeholder="Personal quote (optional)"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Question <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.question}
                        onChange={e => setFormData({ ...formData, question: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="e.g. How can I join CLUSTER?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Answer <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.answer}
                        onChange={e => setFormData({ ...formData, answer: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[160px]"
                        placeholder="Detailed answer..."
                      />
                    </div>
                  </div>
                )}
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
                  {editingItem ? 'Update' : 'Add'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}