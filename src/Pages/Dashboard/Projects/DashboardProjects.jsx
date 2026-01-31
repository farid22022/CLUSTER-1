
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code, Search, Edit3, Trash, Upload, CheckCircle,
  Users, Globe, GitBranch, Download
} from 'lucide-react';
import Swal from 'sweetalert2';
import Papa from 'papaparse';
import { getProjects, createProject, updateProject, deleteProject } from '../../../api';

const getProjectColor = (status) => ({
  Completed: 'bg-gradient-to-r from-green-600 to-teal-700',
  Ongoing:  'bg-gradient-to-r from-blue-600 to-indigo-700'
}[status] || 'bg-gray-600');

const getProjectIcon = (status) => ({
  Completed: <CheckCircle className="w-9 h-9" />,
  Ongoing:   <Code className="w-9 h-9" />
}[status]);

// ────────────────────────────────────────────────
// CSV Export
// ────────────────────────────────────────────────
const exportToCSV = (projectsToExport, filename) => {
  if (projectsToExport.length === 0) {
    Swal.fire('No Data', 'No projects to export.', 'info');
    return;
  }

  const headers = ['Title','Description','Domain','Year','Status','Tech Stack','Team','GitHub','Demo','Image'];

  const rows = projectsToExport.map(p => [
    `"${(p.title      || '').replace(/"/g, '""')}"`,
    `"${(p.description || '').replace(/"/g, '""')}"`,
    `"${(p.domain     || '').replace(/"/g, '""')}"`,
    `"${(p.year       || '').replace(/"/g, '""')}"`,
    `"${(p.status     || 'Ongoing').replace(/"/g, '""')}"`,
    `"${(p.tech_stack  || []).join(', ')}"`,
    `"${(p.team       || []).join(', ')}"`,
    `"${(p.github     || '').replace(/"/g, '""')}"`,
    `"${(p.demo       || '').replace(/"/g, '""')}"`,
    `"${(p.image      || '').replace(/"/g, '""')}"`
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  Swal.fire('Exported!', `${filename}.csv downloaded.`, 'success');
};

export default function DashboardProjects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState({
    title: '', description: '', techStack: '', team: '',
    github: '', demo: '', year: '', domain: '', status: 'Ongoing', image: ''
  });

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await getProjects();
        // Map backend → frontend field names
        const mapped = data.map(p => ({
          ...p,
          techStack: p.tech_stack || [],
          // team: p.team || []
        }));
        setProjects(mapped);
      } catch (err) {
        Swal.fire('Error', 'Failed to load projects from server', 'error',err.message);
      }
    };
    fetchProjects();
  }, []);

  // Filtered data
  const filteredProjects = projects.filter(p =>
    (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.domain || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ongoingProjects = filteredProjects.filter(p => p.status === 'Ongoing');
  const completedProjects = filteredProjects.filter(p => p.status === 'Completed');

  // Open modal for edit or add
  const openModal = (project = null) => {
    setEditingProject(project);
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        techStack: project.techStack?.join(', ') || '',
        team: project.team?.join(', ') || '',
        github: project.github || '',
        demo: project.demo || '',
        year: project.year || '',
        domain: project.domain || '',
        status: project.status || 'Ongoing',
        image: project.image || ''
      });
    } else {
      setFormData({
        title: '', description: '', techStack: '', team: '',
        github: '', demo: '', year: '', domain: '', status: 'Ongoing', image: ''
      });
    }
    setShowModal(true);
  };

  // Save (create or update)
  const handleSave = async () => {
    // Required field validation
    if (!formData.title?.trim() || !formData.description?.trim() ||
        !formData.year?.trim() || !formData.domain?.trim()) {
      Swal.fire('Error', 'Title, Description, Year and Domain are required.', 'error');
      return;
    }

    // Prepare payload for backend (correct field names)
    const payload = {
      title:       formData.title.trim(),
      description: formData.description.trim(),
      tech_stack:  formData.techStack
        ? formData.techStack.split(',').map(t => t.trim()).filter(Boolean)
        : [],
      team:        formData.team
        ? formData.team.split(',').map(m => m.trim()).filter(Boolean)
        : [],
      github:      formData.github?.trim() || '',
      demo:        formData.demo?.trim()   || '',
      year:        formData.year.trim(),
      domain:      formData.domain.trim(),
      status:      formData.status || 'Ongoing',
      image:       formData.image?.trim()  || '',     // ← important: see note below
    };

    try {
      let updatedProjects;

      if (editingProject) {
        const { data } = await updateProject(editingProject.id, payload);
        updatedProjects = projects.map(p =>
          p.id === data.id ? { ...data, techStack: data.tech_stack || [] } : p
        );
        Swal.fire('Success', 'Project updated successfully!', 'success');
      } else {
        const { data } = await createProject(payload);
        updatedProjects = [...projects, { ...data, techStack: data.tech_stack || [] }];
        Swal.fire('Success', 'Project created successfully!', 'success');
      }

      setProjects(updatedProjects);
      setShowModal(false);
      setEditingProject(null);
      setFormData({
        title: '', description: '', techStack: '', team: '',
        github: '', demo: '', year: '', domain: '', status: 'Ongoing', image: ''
      });

    } catch (error) {
      console.error('Save error:', error);
      let errorMsg = 'Failed to save project.';

      if (error.response?.data) {
        const errData = error.response.data;
        if (errData.detail) {
          errorMsg = errData.detail;
        } else if (typeof errData === 'object') {
          errorMsg = Object.entries(errData)
            .map(([field, msg]) => `${field}: ${Array.isArray(msg) ? msg.join(', ') : msg}`)
            .join('; ');
        }
      }

      Swal.fire('Error', errorMsg, 'error');
    }
  };

  // Delete project
  const confirmDelete = async (project) => {
    const result = await Swal.fire({
      title: 'Delete Project?',
      text: `Are you sure you want to delete "${project.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteProject(project.id);
        setProjects(prev => prev.filter(p => p.id !== project.id));
        Swal.fire('Deleted!', 'Project removed successfully.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Failed to delete project', 'error');
      }
    }
  };

  // CSV Import → send each to backend
  const handleCSVImport = () => {
    Swal.fire({
      title: 'Import Projects from CSV',
      text: 'Upload CSV file',
      input: 'file',
      inputAttributes: { accept: '.csv' },
      showCancelButton: true,
      confirmButtonText: 'Import',
      showLoaderOnConfirm: true,
      preConfirm: (file) => new Promise((resolve, reject) => {
        if (!file) return reject('No file selected');

        Papa.parse(file, {
          header: true,
          skipEmptyLines: 'greedy',
          transformHeader: h => h.trim().toLowerCase(),
          complete: (result) => {
            if (result.errors.length > 0) {
              reject('CSV error: ' + result.errors.map(e => e.message).join('; '));
              return;
            }
            if (!result.data.length) return reject('CSV is empty');

            const valid = result.data
              .filter(row => row.title?.trim())
              .map(row => ({
                title: row.title?.trim() || 'Untitled',
                description: row.description?.trim() || '',
                tech_stack: row.techstack
                  ? row.techstack.split(/[,;]/).map(t => t.trim()).filter(Boolean)
                  : [],
                status: ['Ongoing', 'Completed'].includes(row.status?.trim()) ? row.status.trim() : 'Ongoing',
                team: row.team
                  ? row.team.split(/[,;]/).map(m => m.trim()).filter(Boolean)
                  : [],
                github: row.github?.trim() || '',
                demo: row.demo?.trim() || '',
                year: row.year?.trim() || '',
                domain: row.domain?.trim() || '',
                image: row.image?.trim() || ''
              }));

            if (!valid.length) return reject('No valid rows (title required)');

            resolve(valid);
          },
          error: err => reject('Read error: ' + err.message)
        });
      })
    }).then(result => {
      if (result.isConfirmed) {
        importFromCSV(result.value);
      }
    }).catch(err => {
      if (err && err !== 'cancel') {
        Swal.fire('Import Failed', String(err), 'error');
      }
    });
  };

  const importFromCSV = async (rows) => {
    try {
      const newProjects = [];
      for (const row of rows) {
        const { data: created } = await createProject(row);
        newProjects.push({ ...created,tech_stack: row.tech_stack || [] });
      }
      setProjects(prev => [...prev, ...newProjects]);
      Swal.fire('Imported!', `${newProjects.length} project(s) added successfully.`, 'success', { timer: 2200 });
    } catch (err) {
      console.error('CSV import error:', err);
      Swal.fire('Error', 'Failed to import some projects', 'error');
    }
  };

  // ── SUB-COMPONENT ────────────────────────────────────────
  const ProjectSection = ({ title, projects: sectionProjects, iconStatus }) => (
    <div className="mt-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          {getProjectIcon(iconStatus)} {title}
        </h3>
        <div className="flex flex-wrap gap-3">
          <motion.button
            onClick={handleCSVImport}
            className="px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-xl flex items-center gap-2 text-sm font-medium"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Upload size={16} /> Import CSV
          </motion.button>
          <motion.button
            onClick={() => exportToCSV(sectionProjects, title.replace(/\s+/g, '_'))}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 text-sm font-medium shadow-sm"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Download size={16} /> Export CSV
          </motion.button>
          <motion.button
            onClick={() => openModal()}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl flex items-center gap-2 text-sm font-medium shadow-sm"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <CheckCircle size={16} /> Add Project
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sectionProjects.map(project => (
          <motion.div
            key={project.id}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
          >
            <div className={`${getProjectColor(project.status)} px-5 py-3 text-white`}>
              <h4 className="font-bold text-lg leading-tight">{project.title}</h4>
              <p className="text-sm opacity-90 mt-0.5">{project.domain} • {project.year}</p>
            </div>

            <div className="p-4 space-y-3 text-sm">
              <p className="text-gray-700 dark:text-gray-300 line-clamp-3">{project.description}</p>

              {project.techStack?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className="text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Users size={16} /> {project.team?.join(', ') || '—'}
              </div>

              {(project.github || project.demo) && (
                <div className="flex flex-wrap gap-4 pt-1 text-gray-600 dark:text-gray-400">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-blue-500">
                      <GitBranch size={16} /> GitHub
                    </a>
                  )}
                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-blue-500">
                      <Globe size={16} /> Demo
                    </a>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3">
                <motion.button
                  onClick={() => openModal(project)}
                  className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <Edit3 size={18} className="text-blue-600 dark:text-blue-400" />
                </motion.button>
                <motion.button
                  onClick={() => confirmDelete(project)}
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

      {sectionProjects.length === 0 && (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          No {title.toLowerCase()} found.
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <Code className="w-8 h-8 text-blue-600" />
          Manage Projects
        </h1>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <ProjectSection title="Ongoing Projects"   projects={ongoingProjects}   iconStatus="Ongoing" />
      <ProjectSection title="Completed Projects" projects={completedProjects} iconStatus="Completed" />

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
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </h3>
              </div>

              <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="Project title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Domain <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.domain}
                      onChange={e => setFormData({ ...formData, domain: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="AI/ML, IoT, Web Dev..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[140px]"
                      placeholder="Detailed project description..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tech Stack (comma separated)</label>
                    <input
                      type="text"
                      value={formData.techStack}
                      onChange={e => setFormData({ ...formData, techStack: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="React, Node.js, Python, ..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Team Members (comma separated)</label>
                    <input
                      type="text"
                      value={formData.team}
                      onChange={e => setFormData({ ...formData, team: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="Alice, Bob, Charlie"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={e => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    >
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">GitHub Repository</label>
                    <input
                      type="url"
                      value={formData.github}
                      onChange={e => setFormData({ ...formData, github: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Live Demo Link</label>
                    <input
                      type="url"
                      value={formData.demo}
                      onChange={e => setFormData({ ...formData, demo: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="https://your-demo-link.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Image URL / Path</label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={e => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="/projects/image.jpg or https://..."
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-5 border-t border-gray-200 dark:border-slate-700 flex gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-medium shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} />
                  {editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}