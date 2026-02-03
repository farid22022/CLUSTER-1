
// import { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Code, Search, Edit3, Trash, Upload, CheckCircle,
//   Users, Globe, GitBranch, Download
// } from 'lucide-react';
// import Swal from 'sweetalert2';
// import Papa from 'papaparse';
// import { getProjects, createProject, updateProject, deleteProject } from '../../../api';

// const getProjectColor = (status) => ({
//   Completed: 'bg-gradient-to-r from-green-600 to-teal-700',
//   Ongoing:  'bg-gradient-to-r from-blue-600 to-indigo-700'
// }[status] || 'bg-gray-600');

// const getProjectIcon = (status) => ({
//   Completed: <CheckCircle className="w-9 h-9" />,
//   Ongoing:   <Code className="w-9 h-9" />
// }[status]);

// // ────────────────────────────────────────────────
// // CSV Export
// // ────────────────────────────────────────────────
// const exportToCSV = (projectsToExport, filename) => {
//   if (projectsToExport.length === 0) {
//     Swal.fire('No Data', 'No projects to export.', 'info');
//     return;
//   }

//   const headers = ['Title','Description','Domain','Year','Status','Tech Stack','Team','GitHub','Demo','Image'];

//   const rows = projectsToExport.map(p => [
//     `"${(p.title      || '').replace(/"/g, '""')}"`,
//     `"${(p.description || '').replace(/"/g, '""')}"`,
//     `"${(p.domain     || '').replace(/"/g, '""')}"`,
//     `"${(p.year       || '').replace(/"/g, '""')}"`,
//     `"${(p.status     || 'Ongoing').replace(/"/g, '""')}"`,
//     `"${(p.tech_stack  || []).join(', ')}"`,
//     `"${(p.team       || []).join(', ')}"`,
//     `"${(p.github     || '').replace(/"/g, '""')}"`,
//     `"${(p.demo       || '').replace(/"/g, '""')}"`,
//     `"${(p.image      || '').replace(/"/g, '""')}"`
//   ].join(','));

//   const csvContent = [headers.join(','), ...rows].join('\n');

//   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.href = url;
//   link.setAttribute('download', `${filename}.csv`);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
//   URL.revokeObjectURL(url);

//   Swal.fire('Exported!', `${filename}.csv downloaded.`, 'success');
// };

// export default function DashboardProjects() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [projects, setProjects] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editingProject, setEditingProject] = useState(null);

//   const [formData, setFormData] = useState({
//     title: '', description: '', techStack: '', team: '',
//     github: '', demo: '', year: '', domain: '', status: 'Ongoing', image: ''
//   });

//   // Fetch projects from backend
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const { data } = await getProjects();
//         // Map backend → frontend field names
//         const mapped = data.map(p => ({
//           ...p,
//           techStack: p.tech_stack || [],
//           // team: p.team || []
//         }));
//         setProjects(mapped);
//       } catch (err) {
//         Swal.fire('Error', 'Failed to load projects from server', 'error',err.message);
//       }
//     };
//     fetchProjects();
//   }, []);

//   // Filtered data
//   const filteredProjects = projects.filter(p =>
//     (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (p.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (p.domain || '').toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const ongoingProjects = filteredProjects.filter(p => p.status === 'Ongoing');
//   const completedProjects = filteredProjects.filter(p => p.status === 'Completed');

//   // Open modal for edit or add
//   const openModal = (project = null) => {
//     setEditingProject(project);
//     if (project) {
//       setFormData({
//         title: project.title || '',
//         description: project.description || '',
//         techStack: project.techStack?.join(', ') || '',
//         team: project.team?.join(', ') || '',
//         github: project.github || '',
//         demo: project.demo || '',
//         year: project.year || '',
//         domain: project.domain || '',
//         status: project.status || 'Ongoing',
//         image: project.image || ''
//       });
//     } else {
//       setFormData({
//         title: '', description: '', techStack: '', team: '',
//         github: '', demo: '', year: '', domain: '', status: 'Ongoing', image: ''
//       });
//     }
//     setShowModal(true);
//   };

//   // Save (create or update)
//   const handleSave = async () => {
//     // Required field validation
//     if (!formData.title?.trim() || !formData.description?.trim() ||
//         !formData.year?.trim() || !formData.domain?.trim()) {
//       Swal.fire('Error', 'Title, Description, Year and Domain are required.', 'error');
//       return;
//     }

//     // Prepare payload for backend (correct field names)
//     const payload = {
//       title:       formData.title.trim(),
//       description: formData.description.trim(),
//       tech_stack:  formData.techStack
//         ? formData.techStack.split(',').map(t => t.trim()).filter(Boolean)
//         : [],
//       team:        formData.team
//         ? formData.team.split(',').map(m => m.trim()).filter(Boolean)
//         : [],
//       github:      formData.github?.trim() || '',
//       demo:        formData.demo?.trim()   || '',
//       year:        formData.year.trim(),
//       domain:      formData.domain.trim(),
//       status:      formData.status || 'Ongoing',
//       image:       formData.image?.trim()  || '',     // ← important: see note below
//     };

//     try {
//       let updatedProjects;

//       if (editingProject) {
//         const { data } = await updateProject(editingProject.id, payload);
//         updatedProjects = projects.map(p =>
//           p.id === data.id ? { ...data, techStack: data.tech_stack || [] } : p
//         );
//         Swal.fire('Success', 'Project updated successfully!', 'success');
//       } else {
//         const { data } = await createProject(payload);
//         updatedProjects = [...projects, { ...data, techStack: data.tech_stack || [] }];
//         Swal.fire('Success', 'Project created successfully!', 'success');
//       }

//       setProjects(updatedProjects);
//       setShowModal(false);
//       setEditingProject(null);
//       setFormData({
//         title: '', description: '', techStack: '', team: '',
//         github: '', demo: '', year: '', domain: '', status: 'Ongoing', image: ''
//       });

//     } catch (error) {
//       console.error('Save error:', error);
//       let errorMsg = 'Failed to save project.';

//       if (error.response?.data) {
//         const errData = error.response.data;
//         if (errData.detail) {
//           errorMsg = errData.detail;
//         } else if (typeof errData === 'object') {
//           errorMsg = Object.entries(errData)
//             .map(([field, msg]) => `${field}: ${Array.isArray(msg) ? msg.join(', ') : msg}`)
//             .join('; ');
//         }
//       }

//       Swal.fire('Error', errorMsg, 'error');
//     }
//   };

//   // Delete project
//   const confirmDelete = async (project) => {
//     const result = await Swal.fire({
//       title: 'Delete Project?',
//       text: `Are you sure you want to delete "${project.title}"?`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#ef4444',
//       cancelButtonColor: '#6b7280',
//       confirmButtonText: 'Yes, delete it!'
//     });

//     if (result.isConfirmed) {
//       try {
//         await deleteProject(project.id);
//         setProjects(prev => prev.filter(p => p.id !== project.id));
//         Swal.fire('Deleted!', 'Project removed successfully.', 'success');
//       } catch (err) {
//         Swal.fire('Error', 'Failed to delete project', 'error');
//       }
//     }
//   };

//   // CSV Import → send each to backend
//   const handleCSVImport = () => {
//     Swal.fire({
//       title: 'Import Projects from CSV',
//       text: 'Upload CSV file',
//       input: 'file',
//       inputAttributes: { accept: '.csv' },
//       showCancelButton: true,
//       confirmButtonText: 'Import',
//       showLoaderOnConfirm: true,
//       preConfirm: (file) => new Promise((resolve, reject) => {
//         if (!file) return reject('No file selected');

//         Papa.parse(file, {
//           header: true,
//           skipEmptyLines: 'greedy',
//           transformHeader: h => h.trim().toLowerCase(),
//           complete: (result) => {
//             if (result.errors.length > 0) {
//               reject('CSV error: ' + result.errors.map(e => e.message).join('; '));
//               return;
//             }
//             if (!result.data.length) return reject('CSV is empty');

//             const valid = result.data
//               .filter(row => row.title?.trim())
//               .map(row => ({
//                 title: row.title?.trim() || 'Untitled',
//                 description: row.description?.trim() || '',
//                 tech_stack: row.techstack
//                   ? row.techstack.split(/[,;]/).map(t => t.trim()).filter(Boolean)
//                   : [],
//                 status: ['Ongoing', 'Completed'].includes(row.status?.trim()) ? row.status.trim() : 'Ongoing',
//                 team: row.team
//                   ? row.team.split(/[,;]/).map(m => m.trim()).filter(Boolean)
//                   : [],
//                 github: row.github?.trim() || '',
//                 demo: row.demo?.trim() || '',
//                 year: row.year?.trim() || '',
//                 domain: row.domain?.trim() || '',
//                 image: row.image?.trim() || ''
//               }));

//             if (!valid.length) return reject('No valid rows (title required)');

//             resolve(valid);
//           },
//           error: err => reject('Read error: ' + err.message)
//         });
//       })
//     }).then(result => {
//       if (result.isConfirmed) {
//         importFromCSV(result.value);
//       }
//     }).catch(err => {
//       if (err && err !== 'cancel') {
//         Swal.fire('Import Failed', String(err), 'error');
//       }
//     });
//   };

//   const importFromCSV = async (rows) => {
//     try {
//       const newProjects = [];
//       for (const row of rows) {
//         const { data: created } = await createProject(row);
//         newProjects.push({ ...created,tech_stack: row.tech_stack || [] });
//       }
//       setProjects(prev => [...prev, ...newProjects]);
//       Swal.fire('Imported!', `${newProjects.length} project(s) added successfully.`, 'success', { timer: 2200 });
//     } catch (err) {
//       console.error('CSV import error:', err);
//       Swal.fire('Error', 'Failed to import some projects', 'error');
//     }
//   };

//   // ── SUB-COMPONENT ────────────────────────────────────────
//   const ProjectSection = ({ title, projects: sectionProjects, iconStatus }) => (
//     <div className="mt-12">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//         <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
//           {getProjectIcon(iconStatus)} {title}
//         </h3>
//         <div className="flex flex-wrap gap-3">
//           <motion.button
//             onClick={handleCSVImport}
//             className="px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-xl flex items-center gap-2 text-sm font-medium"
//             whileHover={{ scale: 1.03 }}
//             whileTap={{ scale: 0.97 }}
//           >
//             <Upload size={16} /> Import CSV
//           </motion.button>
//           <motion.button
//             onClick={() => exportToCSV(sectionProjects, title.replace(/\s+/g, '_'))}
//             className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 text-sm font-medium shadow-sm"
//             whileHover={{ scale: 1.03 }}
//             whileTap={{ scale: 0.97 }}
//           >
//             <Download size={16} /> Export CSV
//           </motion.button>
//           <motion.button
//             onClick={() => openModal()}
//             className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl flex items-center gap-2 text-sm font-medium shadow-sm"
//             whileHover={{ scale: 1.03 }}
//             whileTap={{ scale: 0.97 }}
//           >
//             <CheckCircle size={16} /> Add Project
//           </motion.button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {sectionProjects.map(project => (
//           <motion.div
//             key={project.id}
//             className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow"
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             whileHover={{ y: -4 }}
//           >
//             <div className={`${getProjectColor(project.status)} px-5 py-3 text-white`}>
//               <h4 className="font-bold text-lg leading-tight">{project.title}</h4>
//               <p className="text-sm opacity-90 mt-0.5">{project.domain} • {project.year}</p>
//             </div>

//             <div className="p-4 space-y-3 text-sm">
//               <p className="text-gray-700 dark:text-gray-300 line-clamp-3">{project.description}</p>

//               {project.techStack?.length > 0 && (
//                 <div className="flex flex-wrap gap-1.5">
//                   {project.techStack.map((tech, i) => (
//                     <span key={i} className="text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full">
//                       {tech}
//                     </span>
//                   ))}
//                 </div>
//               )}

//               <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
//                 <Users size={16} /> {project.team?.join(', ') || '—'}
//               </div>

//               {(project.github || project.demo) && (
//                 <div className="flex flex-wrap gap-4 pt-1 text-gray-600 dark:text-gray-400">
//                   {project.github && (
//                     <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-blue-500">
//                       <GitBranch size={16} /> GitHub
//                     </a>
//                   )}
//                   {project.demo && (
//                     <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-blue-500">
//                       <Globe size={16} /> Demo
//                     </a>
//                   )}
//                 </div>
//               )}

//               <div className="flex justify-end gap-3 pt-3">
//                 <motion.button
//                   onClick={() => openModal(project)}
//                   className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors"
//                   whileHover={{ scale: 1.1 }}
//                 >
//                   <Edit3 size={18} className="text-blue-600 dark:text-blue-400" />
//                 </motion.button>
//                 <motion.button
//                   onClick={() => confirmDelete(project)}
//                   className="p-2 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
//                   whileHover={{ scale: 1.1 }}
//                 >
//                   <Trash size={18} className="text-red-600 dark:text-red-400" />
//                 </motion.button>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {sectionProjects.length === 0 && (
//         <div className="text-center py-16 text-gray-500 dark:text-gray-400">
//           No {title.toLowerCase()} found.
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="space-y-10 pb-10">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
//           <Code className="w-8 h-8 text-blue-600" />
//           Manage Projects
//         </h1>

//         <div className="relative w-full sm:w-80">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search projects..."
//             value={searchTerm}
//             onChange={e => setSearchTerm(e.target.value)}
//             className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//           />
//         </div>
//       </div>

//       <ProjectSection title="Ongoing Projects"   projects={ongoingProjects}   iconStatus="Ongoing" />
//       <ProjectSection title="Completed Projects" projects={completedProjects} iconStatus="Completed" />

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
//               className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
//               onClick={e => e.stopPropagation()}
//             >
//               <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-700">
//                 <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//                   {editingProject ? 'Edit Project' : 'Create New Project'}
//                 </h3>
//               </div>

//               <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
//                       Title <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.title}
//                       onChange={e => setFormData({ ...formData, title: e.target.value })}
//                       className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                       placeholder="Project title"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
//                       Domain <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.domain}
//                       onChange={e => setFormData({ ...formData, domain: e.target.value })}
//                       className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                       placeholder="AI/ML, IoT, Web Dev..."
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
//                       Description <span className="text-red-500">*</span>
//                     </label>
//                     <textarea
//                       value={formData.description}
//                       onChange={e => setFormData({ ...formData, description: e.target.value })}
//                       className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[140px]"
//                       placeholder="Detailed project description..."
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tech Stack (comma separated)</label>
//                     <input
//                       type="text"
//                       value={formData.techStack}
//                       onChange={e => setFormData({ ...formData, techStack: e.target.value })}
//                       className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                       placeholder="React, Node.js, Python, ..."
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Team Members (comma separated)</label>
//                     <input
//                       type="text"
//                       value={formData.team}
//                       onChange={e => setFormData({ ...formData, team: e.target.value })}
//                       className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                       placeholder="Alice, Bob, Charlie"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
//                       Year <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.year}
//                       onChange={e => setFormData({ ...formData, year: e.target.value })}
//                       className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                       placeholder="2024"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
//                     <select
//                       value={formData.status}
//                       onChange={e => setFormData({ ...formData, status: e.target.value })}
//                       className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                     >
//                       <option value="Ongoing">Ongoing</option>
//                       <option value="Completed">Completed</option>
//                     </select>
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">GitHub Repository</label>
//                     <input
//                       type="url"
//                       value={formData.github}
//                       onChange={e => setFormData({ ...formData, github: e.target.value })}
//                       className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                       placeholder="https://github.com/..."
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Live Demo Link</label>
//                     <input
//                       type="url"
//                       value={formData.demo}
//                       onChange={e => setFormData({ ...formData, demo: e.target.value })}
//                       className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                       placeholder="https://your-demo-link.com"
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Image URL / Path</label>
//                     <input
//                       type="text"
//                       value={formData.image}
//                       onChange={e => setFormData({ ...formData, image: e.target.value })}
//                       className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                       placeholder="/projects/image.jpg or https://..."
//                     />
//                   </div>
//                 </div>
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
//                   {editingProject ? 'Update Project' : 'Create Project'}
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// import { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Code, Search, Edit3, Trash, Upload, CheckCircle,
//   Clock, Check, X, Download, Users, Globe, GitBranch
// } from 'lucide-react';
// import Swal from 'sweetalert2';
// import Papa from 'papaparse';
// import {
//   getProjects,
//   createProject,
//   updateProject,
//   deleteProject,
//   approveProject,
//   rejectProject,
// } from '../../../api';

// const statusColors = {
//   Ongoing:   'bg-gradient-to-r from-blue-600 to-indigo-700',
//   Completed: 'bg-gradient-to-r from-green-600 to-teal-700',
// };

// const approvalColors = {
//   pending:  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
//   approved: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
//   rejected: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
// };

// const exportToCSV = (projectsToExport, filename) => {
//   if (!projectsToExport?.length) {
//     Swal.fire('No Data', 'Nothing to export.', 'info');
//     return;
//   }

//   const headers = [
//     'Title', 'Description', 'Domain', 'Year', 'Status',
//     'Tech Stack', 'Team', 'GitHub', 'Demo', 'Image', 'Approval Status'
//   ];

//   const rows = projectsToExport.map(p => [
//     `"${(p.title || '').replace(/"/g, '""')}"`,
//     `"${(p.description || '').replace(/"/g, '""')}"`,
//     `"${(p.domain || '').replace(/"/g, '""')}"`,
//     `"${(p.year || '').replace(/"/g, '""')}"`,
//     `"${(p.status || 'Ongoing').replace(/"/g, '""')}"`,
//     `"${(p.tech_stack || []).join(', ')}"`,
//     `"${(p.team || []).join(', ')}"`,
//     `"${(p.github || '').replace(/"/g, '""')}"`,
//     `"${(p.demo || '').replace(/"/g, '""')}"`,
//     `"${(p.image || '').replace(/"/g, '""')}"`,
//     `"${(p.approval_status || 'pending').replace(/"/g, '""')}"`,
//   ].join(','));

//   const csv = [headers.join(','), ...rows].join('\n');
//   const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.href = url;
//   link.download = `${filename}.csv`;
//   link.click();
//   URL.revokeObjectURL(url);

//   Swal.fire('Exported', `${filename}.csv downloaded`, 'success');
// };

// export default function DashboardProjects() {
//   const [projects, setProjects] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [editingProject, setEditingProject] = useState(null);

//   const [formData, setFormData] = useState({
//     title: '', description: '', techStack: '', team: '',
//     github: '', demo: '', year: '', domain: '', status: 'Ongoing',
//     image: '', approval_status: 'pending'
//   });

//   const fetchProjects = async () => {
//     try {
//       const { data } = await getProjects();
//       setProjects(data.map(p => ({
//         ...p,
//         techStack: p.tech_stack || [],
//       })));
//     } catch (err) {
//       Swal.fire('Error', 'Could not load projects', 'error');
//     }
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const filtered = projects.filter(p =>
//     [p.title, p.description, p.domain]
//       .some(str => (str || '').toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   const pending   = filtered.filter(p => p.approval_status === 'pending');
//   const ongoing   = filtered.filter(p => p.approval_status === 'approved' && p.status === 'Ongoing');
//   const completed = filtered.filter(p => p.approval_status === 'approved' && p.status === 'Completed');

//   const openModal = (project = null) => {
//     setEditingProject(project);
//     setFormData(project ? {
//       title: project.title || '',
//       description: project.description || '',
//       techStack: (project.techStack || []).join(', '),
//       team: (project.team || []).join(', '),
//       github: project.github || '',
//       demo: project.demo || '',
//       year: project.year || '',
//       domain: project.domain || '',
//       status: project.status || 'Ongoing',
//       image: project.image || '',
//       approval_status: project.approval_status || 'pending'
//     } : {
//       title: '', description: '', techStack: '', team: '',
//       github: '', demo: '', year: '', domain: '', status: 'Ongoing',
//       image: '', approval_status: 'pending'
//     });
//     setShowModal(true);
//   };

//   const handleSave = async () => {
//     if (!formData.title?.trim() || !formData.description?.trim() ||
//         !formData.year?.trim() || !formData.domain?.trim()) {
//       return Swal.fire('Required fields', 'Title, Description, Year and Domain are required', 'error');
//     }

//     const payload = {
//       title: formData.title.trim(),
//       description: formData.description.trim(),
//       tech_stack: formData.techStack.split(',').map(t => t.trim()).filter(Boolean),
//       team: formData.team.split(',').map(m => m.trim()).filter(Boolean),
//       github: formData.github?.trim() || null,
//       demo: formData.demo?.trim() || null,
//       year: formData.year.trim(),
//       domain: formData.domain.trim(),
//       status: formData.status,
//       image: formData.image?.trim() || null,
//       approval_status: formData.approval_status
//     };

//     try {
//       if (editingProject) {
//         await updateProject(editingProject.id, payload);
//         Swal.fire('Updated', 'Project updated successfully', 'success');
//       } else {
//         await createProject(payload);
//         Swal.fire('Created', 'Project created successfully', 'success');
//       }
//       fetchProjects();
//       setShowModal(false);
//     } catch (err) {
//       Swal.fire('Error', err.response?.data?.detail || 'Failed to save project', 'error');
//     }
//   };

//   const handleDelete = async (id) => {
//     const res = await Swal.fire({
//       title: 'Delete project?',
//       text: "You won't be able to revert this!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#ef4444',
//       cancelButtonColor: '#6b7280',
//       confirmButtonText: 'Yes, delete it!'
//     });

//     if (res.isConfirmed) {
//       try {
//         await deleteProject(id);
//         fetchProjects();
//         Swal.fire('Deleted!', 'Project has been deleted.', 'success');
//       } catch {
//         Swal.fire('Error', 'Could not delete project', 'error');
//       }
//     }
//   };

//   const handleApprove = async (id) => {
//     try {
//       // await approveProject(id);           // ← use this when endpoint exists
//       await updateProject(id, { approval_status: 'approved' });
//       fetchProjects();
//       Swal.fire('Approved!', 'Project is now visible publicly.', 'success');
//     } catch {
//       Swal.fire('Error', 'Could not approve project', 'error');
//     }
//   };

//   const handleReject = async (id) => {
//     try {
//       // await rejectProject(id);
//       await updateProject(id, { approval_status: 'rejected' });
//       fetchProjects();
//       Swal.fire('Rejected', 'Project marked as rejected.', 'success');
//     } catch {
//       Swal.fire('Error', 'Could not reject project', 'error');
//     }
//   };

//   const ProjectCard = ({ project, showApproveReject = false }) => (
//     <motion.div
//       className="bg-white dark:bg-slate-800 rounded-xl shadow border border-gray-200 dark:border-slate-700 overflow-hidden h-full flex flex-col"
//       whileHover={{ y: -6, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.15)" }}
//       transition={{ type: "spring", stiffness: 300, damping: 20 }}
//     >
//       <div className={`${statusColors[project.status] || 'bg-gray-600'} px-5 py-4 text-white`}>
//         <h3 className="font-semibold text-lg leading-tight">{project.title}</h3>
//         <p className="text-sm opacity-90 mt-1">{project.domain} • {project.year || '—'}</p>
//         <span className={`inline-block mt-2 px-2.5 py-1 text-xs font-medium rounded-full ${approvalColors[project.approval_status]}`}>
//           {project.approval_status?.toUpperCase()}
//         </span>
//       </div>

//       <div className="p-5 flex-1 flex flex-col">
//         <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-4 mb-4">
//           {project.description || 'No description provided.'}
//         </p>

//         {project.techStack?.length > 0 && (
//           <div className="flex flex-wrap gap-1.5 mb-4">
//             {project.techStack.map(t => (
//               <span key={t} className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs rounded-full">
//                 {t}
//               </span>
//             ))}
//           </div>
//         )}

//         <div className="mt-auto space-y-3">
//           {project.team?.length > 0 && (
//             <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
//               <Users size={16} /> {project.team.join(', ')}
//             </div>
//           )}

//           {(project.github || project.demo) && (
//             <div className="flex gap-4 text-sm">
//               {project.github && (
//                 <a href={project.github} target="_blank" rel="noopener noreferrer" 
//                    className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline">
//                   <GitBranch size={16} /> GitHub
//                 </a>
//               )}
//               {project.demo && (
//                 <a href={project.demo} target="_blank" rel="noopener noreferrer"
//                    className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline">
//                   <Globe size={16} /> Demo
//                 </a>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="px-5 py-4 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-2.5">
//         {showApproveReject && (
//           <>
//             <button
//               onClick={() => handleApprove(project.id)}
//               className="p-2.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
//               title="Approve"
//             >
//               <Check size={18} />
//             </button>
//             <button
//               onClick={() => handleReject(project.id)}
//               className="p-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
//               title="Reject"
//             >
//               <X size={18} />
//             </button>
//           </>
//         )}
//         <button
//           onClick={() => openModal(project)}
//           className="p-2.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
//           title="Edit"
//         >
//           <Edit3 size={18} />
//         </button>
//         <button
//           onClick={() => handleDelete(project.id)}
//           className="p-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
//           title="Delete"
//         >
//           <Trash size={18} />
//         </button>
//       </div>
//     </motion.div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-4 md:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
//             <Code className="w-8 h-8 text-blue-600" />
//             Projects Dashboard
//           </h1>

//           <div className="relative w-full sm:w-80">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input
//               type="text"
//               placeholder="Search title, description, domain..."
//               value={searchTerm}
//               onChange={e => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//             />
//           </div>
//         </div>

//         {/* Pending Projects */}
//         <section className="mb-14">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//             <h2 className="text-2xl font-semibold text-yellow-700 dark:text-yellow-400 flex items-center gap-3">
//               <Clock size={28} /> Pending Projects ({pending.length})
//             </h2>
//             <button
//               onClick={() => exportToCSV(pending, 'pending_projects')}
//               className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-lg text-sm font-medium"
//             >
//               <Download size={18} /> Export CSV
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {pending.map(project => (
//               <ProjectCard key={project.id} project={project} showApproveReject={true} />
//             ))}
//             {pending.length === 0 && (
//               <div className="col-span-full py-20 text-center text-gray-500 dark:text-gray-400 text-lg">
//                 No pending projects to review at the moment.
//               </div>
//             )}
//           </div>
//         </section>

//         {/* Ongoing Approved */}
//         <section className="mb-14">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//             <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-3">
//               <Code size={28} /> Ongoing Projects ({ongoing.length})
//             </h2>
//             <button
//               onClick={() => exportToCSV(ongoing, 'ongoing_projects')}
//               className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-lg text-sm font-medium"
//             >
//               <Download size={18} /> Export CSV
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {ongoing.map(project => (
//               <ProjectCard key={project.id} project={project} />
//             ))}
//             {ongoing.length === 0 && (
//               <div className="col-span-full py-20 text-center text-gray-500 dark:text-gray-400 text-lg">
//                 No ongoing approved projects yet.
//               </div>
//             )}
//           </div>
//         </section>

//         {/* Completed Approved */}
//         <section>
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//             <h2 className="text-2xl font-semibold text-green-700 dark:text-green-400 flex items-center gap-3">
//               <CheckCircle size={28} /> Completed Projects ({completed.length})
//             </h2>
//             <button
//               onClick={() => exportToCSV(completed, 'completed_projects')}
//               className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-lg text-sm font-medium"
//             >
//               <Download size={18} /> Export CSV
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {completed.map(project => (
//               <ProjectCard key={project.id} project={project} />
//             ))}
//             {completed.length === 0 && (
//               <div className="col-span-full py-20 text-center text-gray-500 dark:text-gray-400 text-lg">
//                 No completed approved projects yet.
//               </div>
//             )}
//           </div>
//         </section>
//       </div>

//       {/* Modal */}
//       <AnimatePresence>
//         {showModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/65 flex items-center justify-center z-50 p-4"
//             onClick={() => setShowModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.94, y: 30 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.94, y: 30 }}
//               className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto"
//               onClick={e => e.stopPropagation()}
//             >
//               <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-700">
//                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//                   {editingProject ? 'Edit Project' : 'Create New Project'}
//                 </h3>
//               </div>

//               <div className="p-6 space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
//                       Title <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.title}
//                       onChange={e => setFormData({ ...formData, title: e.target.value })}
//                       className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                       placeholder="Project title"
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
//                       Description <span className="text-red-500">*</span>
//                     </label>
//                     <textarea
//                       value={formData.description}
//                       onChange={e => setFormData({ ...formData, description: e.target.value })}
//                       rows={5}
//                       className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                       placeholder="Detailed project description..."
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
//                       Domain <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.domain}
//                       onChange={e => setFormData({ ...formData, domain: e.target.value })}
//                       className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                       placeholder="AI/ML, Web Development, IoT..."
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
//                       Year <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.year}
//                       onChange={e => setFormData({ ...formData, year: e.target.value })}
//                       className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                       placeholder="2025"
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
//                       Tech Stack (comma separated)
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.techStack}
//                       onChange={e => setFormData({ ...formData, techStack: e.target.value })}
//                       className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                       placeholder="React, Node.js, Tailwind CSS, ..."
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
//                       Team Members (comma separated)
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.team}
//                       onChange={e => setFormData({ ...formData, team: e.target.value })}
//                       className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                       placeholder="Alice Smith, Bob Johnson, ..."
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
//                     <select
//                       value={formData.status}
//                       onChange={e => setFormData({ ...formData, status: e.target.value })}
//                       className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                     >
//                       <option value="Ongoing">Ongoing</option>
//                       <option value="Completed">Completed</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
//                       Approval Status
//                     </label>
//                     <select
//                       value={formData.approval_status}
//                       onChange={e => setFormData({ ...formData, approval_status: e.target.value })}
//                       className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="approved">Approved</option>
//                       <option value="rejected">Rejected</option>
//                     </select>
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">GitHub Repository</label>
//                     <input
//                       type="url"
//                       value={formData.github}
//                       onChange={e => setFormData({ ...formData, github: e.target.value })}
//                       className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                       placeholder="https://github.com/username/repo"
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Live Demo Link</label>
//                     <input
//                       type="url"
//                       value={formData.demo}
//                       onChange={e => setFormData({ ...formData, demo: e.target.value })}
//                       className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                       placeholder="https://project-demo.vercel.app"
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Image URL / Path</label>
//                     <input
//                       type="text"
//                       value={formData.image}
//                       onChange={e => setFormData({ ...formData, image: e.target.value })}
//                       className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                       placeholder="/images/project1.jpg or https://..."
//                     />
//                   </div>
//                 </div>
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
//                   {editingProject ? 'Update Project' : 'Create Project'}
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// src/pages/dashboard/DashboardProjects.jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code, Search, Edit, Trash2, CheckCircle,
  Check, X, AlertCircle,Clock, 
} from 'lucide-react';
import Swal from 'sweetalert2';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  approveProject,
  rejectProject
} from '../../../api';

const getStatusColor = (status) => ({
  Completed: 'from-green-600 to-teal-700',
  Ongoing: 'from-blue-600 to-indigo-700'
}[status] || 'from-gray-600 to-slate-700');

export default function DashboardProjects() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: '',
    year: '',
    status: 'Ongoing',
    techStack: '',
    team: '',
    github: '',
    demo: '',
    image: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await getProjects();
      const mapped = data.map(p => ({
        ...p,
        techStack: p.tech_stack?.join(', ') || '',
        team: p.team?.join(', ') || ''
      }));
      setProjects(mapped);
    } catch (err) {
      console.error('Fetch projects failed:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load projects. Please check your connection.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filtered = projects.filter(p =>
    [p.title, p.domain, p.description ?? '']
      .some(f => f.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pending  = filtered.filter(p => p.approval_status === 'pending');
  const approved = filtered.filter(p => p.approval_status === 'approved');
  const rejected = filtered.filter(p => p.approval_status === 'rejected');

  const openModal = (proj = null) => {
    setEditingProject(proj);
    setFormData(proj ? {
      title: proj.title || '',
      description: proj.description || '',
      domain: proj.domain || '',
      year: proj.year || '',
      status: proj.status || 'Ongoing',
      techStack: proj.techStack || '',
      team: proj.team || '',
      github: proj.github || '',
      demo: proj.demo || '',
      image: proj.image || ''
    } : {
      title: '', description: '', domain: '', year: '',
      status: 'Ongoing', techStack: '', team: '',
      github: '', demo: '', image: ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.domain.trim()) errors.domain = 'Domain is required';
    if (!formData.status) errors.status = 'Status is required';

    // Optional but validate if provided
    if (formData.github && !/^https?:\/\//i.test(formData.github)) {
      errors.github = 'GitHub must start with http:// or https://';
    }
    if (formData.demo && !/^https?:\/\//i.test(formData.demo)) {
      errors.demo = 'Demo must start with http:// or https://';
    }
    if (formData.image && !/^https?:\/\//i.test(formData.image) && !formData.image.startsWith('/')) {
      errors.image = 'Image must be a valid URL or path';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Swal.fire('Validation Error', 'Please fix the highlighted fields', 'warning');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      domain: formData.domain.trim(),
      year: formData.year.trim() || null,
      status: formData.status,
      tech_stack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean),
      team: formData.team.split(',').map(s => s.trim()).filter(Boolean),
      github: formData.github.trim() || null,
      demo: formData.demo.trim() || null,
      image: formData.image.trim() || null
      // Important: NO approval_status here — backend sets it to 'pending' on create
    };

    try {
      if (editingProject) {
        await updateProject(editingProject.id, payload);
        Swal.fire('Success', 'Project updated successfully', 'success');
      } else {
        await createProject(payload);
        Swal.fire('Success', 'Project submitted — pending admin approval', 'success');
      }
      fetchProjects();
      setShowModal(false);
    } catch (err) {
      console.error('Save failed:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.detail || 'Failed to save project. Please try again.'
      });
    }
  };

  const handleApprove = async (id) => {
    const result = await Swal.fire({
      title: 'Approve this project?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve',
      confirmButtonColor: '#10b981'
    });

    if (result.isConfirmed) {
      try {
        await approveProject(id);
        Swal.fire('Approved!', 'Project is now live.', 'success');
        fetchProjects();
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.detail || 'Failed to approve project.'
        });
      }
    }
  };

  const handleReject = async (id) => {
    const result = await Swal.fire({
      title: 'Reject this project?',
      text: 'It will be marked as rejected.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, reject',
      confirmButtonColor: '#ef4444'
    });

    if (result.isConfirmed) {
      try {
        await rejectProject(id);
        Swal.fire('Rejected', 'Project has been rejected.', 'success');
        fetchProjects();
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.detail || 'Failed to reject project.'
        });
      }
    }
  };

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: `Delete "${title}"?`,
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#ef4444'
    });

    if (result.isConfirmed) {
      try {
        await deleteProject(id);
        Swal.fire('Deleted!', 'Project has been removed.', 'success');
        fetchProjects();
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.detail || 'Failed to delete project.'
        });
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects Dashboard</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm flex items-center gap-2"
          >
            <Code size={18} /> Add Project
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading projects...</p>
        </div>
      ) : (
        <>
          {/* Pending Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
              <Clock size={24} /> Pending Projects ({pending.length})
            </h2>
            <ProjectTable
              projects={pending}
              onApprove={handleApprove}
              onReject={handleReject}
              onEdit={openModal}
              onDelete={handleDelete}
              showActions={{ approve: true, reject: true }}
            />
          </section>

          {/* Approved Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-400 flex items-center gap-2">
              <CheckCircle size={24} /> Approved Projects ({approved.length})
            </h2>
            <ProjectTable
              projects={approved}
              onEdit={openModal}
              onDelete={handleDelete}
              showActions={{}}
            />
          </section>

          {/* Rejected Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-red-700 dark:text-red-400 flex items-center gap-2">
              <AlertCircle size={24} /> Rejected Projects ({rejected.length})
            </h2>
            <ProjectTable
              projects={rejected}
              onEdit={openModal}
              onDelete={handleDelete}
              showActions={{}}
            />
          </section>
        </>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </h2>
              </div>

              <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.title ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                  />
                  {formErrors.title && <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.description ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                  />
                  {formErrors.description && <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Domain *</label>
                  <input
                    type="text"
                    value={formData.domain}
                    onChange={e => setFormData({ ...formData, domain: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.domain ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                  />
                  {formErrors.domain && <p className="mt-1 text-sm text-red-600">{formErrors.domain}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Year</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={e => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="e.g., 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status *</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.status ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                  >
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                  {formErrors.status && <p className="mt-1 text-sm text-red-600">{formErrors.status}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={formData.techStack}
                    onChange={e => setFormData({ ...formData, techStack: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="e.g., React, Node.js"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Team Members (comma separated)</label>
                  <input
                    type="text"
                    value={formData.team}
                    onChange={e => setFormData({ ...formData, team: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="e.g., John Doe, Jane Smith"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">GitHub Link</label>
                  <input
                    type="url"
                    value={formData.github}
                    onChange={e => setFormData({ ...formData, github: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.github ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                    placeholder="https://github.com/..."
                  />
                  {formErrors.github && <p className="mt-1 text-sm text-red-600">{formErrors.github}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Demo Link</label>
                  <input
                    type="url"
                    value={formData.demo}
                    onChange={e => setFormData({ ...formData, demo: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.demo ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                    placeholder="https://demo.example.com"
                  />
                  {formErrors.demo && <p className="mt-1 text-sm text-red-600">{formErrors.demo}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Image URL/Path</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.image ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                    placeholder="https://... or /path/to/image.jpg"
                  />
                  {formErrors.image && <p className="mt-1 text-sm text-red-600">{formErrors.image}</p>}
                </div>

                <div className="flex gap-4 pt-4 md:col-span-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg font-medium shadow transition-all"
                  >
                    {editingProject ? 'Update Project' : 'Submit Project'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ────────────────────────────────────────────────
// Reusable Table Component
// ────────────────────────────────────────────────
function ProjectTable({ projects, onApprove, onReject, onEdit, onDelete, showActions }) {
  if (!projects?.length) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No projects in this category
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full divide-y divide-gray-200 dark:divide-slate-700">
        <thead>
          <tr className="text-left text-sm font-medium text-gray-500 dark:text-gray-400">
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Domain</th>
            <th className="px-4 py-3">Year</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
          {projects.map(p => (
            <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
              <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">{p.title}</td>
              <td className="px-4 py-4 text-gray-700 dark:text-gray-300">{p.domain}</td>
              <td className="px-4 py-4 text-gray-700 dark:text-gray-300">{p.year || '—'}</td>
              <td className="px-4 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusColor(p.status)} text-white`}>
                  {p.status}
                </span>
              </td>
              <td className="px-4 py-4 flex gap-2">
                {showActions?.approve && (
                  <button
                    onClick={() => onApprove?.(p.id)}
                    className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/30 transition-colors"
                    title="Approve"
                  >
                    <Check size={16} className="text-green-700 dark:text-green-400" />
                  </button>
                )}
                {showActions?.reject && (
                  <button
                    onClick={() => onReject?.(p.id)}
                    className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors"
                    title="Reject"
                  >
                    <X size={16} className="text-red-700 dark:text-red-400" />
                  </button>
                )}
                <button
                  onClick={() => onEdit?.(p)}
                  className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-colors"
                  title="Edit"
                >
                  <Edit size={16} className="text-blue-600 dark:text-blue-400" />
                </button>
                <button
                  onClick={() => onDelete?.(p.id, p.title)}
                  className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}