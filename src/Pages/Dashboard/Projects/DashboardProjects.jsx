
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
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

ProjectTable.propTypes = {
  projects: PropTypes.array.isRequired,
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  showActions: PropTypes.object
};

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

ProjectTable.propTypes = {
  projects: PropTypes.array.isRequired,
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  showActions: PropTypes.object
};
