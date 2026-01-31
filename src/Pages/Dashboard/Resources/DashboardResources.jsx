
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Book, Search, Edit3, Trash, Upload, CheckCircle,
  Tag, FileText, Globe, Lock, Unlock, Download
} from 'lucide-react';
import Swal from 'sweetalert2';
import Papa from 'papaparse';
import {
  getResources, createResource, updateResource, deleteResource
} from '../../../api'; // Adjust path

const getResourceColor = (format) => ({
  PDF: 'bg-gradient-to-r from-red-600 to-pink-700',
  Video: 'bg-gradient-to-r from-purple-600 to-violet-700',
  Article: 'bg-gradient-to-r from-blue-600 to-indigo-700'
}[format] || 'bg-gray-600');

const getResourceIcon = (format) => ({
  PDF: <FileText className="w-6 h-6" />,
  Video: <Globe className="w-6 h-6" />,
  Article: <Book className="w-6 h-6" />
}[format]);

// ────────────────────────────────────────────────
// CSV Export
// ────────────────────────────────────────────────
const exportToCSV = (resources, filename = 'Resources') => {
  if (resources.length === 0) {
    Swal.fire('No Data', 'No resources to export.', 'info');
    return;
  }

  const headers = ['Title', 'Category', 'Format', 'Difficulty', 'Link', 'Restricted', 'Description'];

  const rows = resources.map(r => [
    `"${(r.title || '').replace(/"/g, '""')}"`,
    `"${(r.category || '').replace(/"/g, '""')}"`,
    `"${(r.format || '').replace(/"/g, '""')}"`,
    `"${(r.difficulty || '').replace(/"/g, '""')}"`,
    `"${(r.link || '').replace(/"/g, '""')}"`,
    `"${r.restricted ? 'Yes' : 'No'}"`,
    `"${(r.description || '').replace(/"/g, '""')}"`
  ].join(','));

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().slice(0,10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);

  Swal.fire('Exported!', `${resources.length} resource(s) exported.`, 'success');
};

export default function DashboardResources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    format: 'PDF',
    difficulty: '',
    link: '',
    restricted: false,
    description: ''
  });

  // Fetch from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await getResources();
        setResources(data);
      } catch (err) {
        Swal.fire('Error', 'Failed to load resources', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredResources = resources.filter(r =>
    (r.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.category.trim()) errors.category = 'Category is required';
    if (!formData.link.trim()) errors.link = 'Link is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openModal = (resource = null) => {
    setEditingResource(resource);
    setFormErrors({});
    if (resource) {
      setFormData({
        title: resource.title || '',
        category: resource.category || '',
        format: resource.format || 'PDF',
        difficulty: resource.difficulty || '',
        link: resource.link || '',
        restricted: !!resource.restricted,
        description: resource.description || ''
      });
    } else {
      setFormData({
        title: '', category: '', format: 'PDF', difficulty: '',
        link: '', restricted: false, description: ''
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Swal.fire('Missing Fields', 'Please fill all required fields', 'warning');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      category: formData.category.trim(),
      format: formData.format,
      difficulty: formData.difficulty.trim(),
      link: formData.link.trim(),
      restricted: formData.restricted,
      description: formData.description.trim()
    };

    try {
      let updated;
      if (editingResource) {
        const { data } = await updateResource(editingResource.id, payload);
        updated = resources.map(r => r.id === data.id ? data : r);
        Swal.fire('Success', 'Resource updated', 'success');
      } else {
        const { data } = await createResource(payload);
        updated = [...resources, data];
        Swal.fire('Success', 'Resource created', 'success');
      }
      setResources(updated);
      setShowModal(false);
      setEditingResource(null);
    } catch (err) {
      let msg = 'Failed to save resource';
      if (err.response?.data) msg = JSON.stringify(err.response.data, null, 2);
      Swal.fire('Error', msg, 'error');
    }
  };

  const confirmDelete = async (resource) => {
    const res = await Swal.fire({
      title: 'Delete Resource?',
      text: `Delete "${resource.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete'
    });

    if (res.isConfirmed) {
      try {
        await deleteResource(resource.id);
        setResources(prev => prev.filter(r => r.id !== resource.id));
        Swal.fire('Deleted', 'Resource removed', 'success');
      } catch (err) {
        Swal.fire('Error', 'Failed to delete', 'error',err.message);
      }
    }
  };

  // ────────────────────────────────────────────────
  // CSV Import
  // ────────────────────────────────────────────────
  const handleCSVImport = () => {
    Swal.fire({
      title: 'Import Resources from CSV',
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

            const valid = result.data
              .filter(row => row.title?.trim() && row.link?.trim())
              .map(row => ({
                title: row.title.trim(),
                category: row.category?.trim() || 'Uncategorized',
                format: ['PDF','Video','Article'].includes(row.format?.trim()) ? row.format.trim() : 'PDF',
                difficulty: row.difficulty?.trim() || '',
                link: row.link.trim(),
                restricted: row.restricted?.toLowerCase() === 'yes' || 
                            row.restricted?.toLowerCase() === 'true' || 
                            row.restricted === true,
                description: row.description?.trim() || ''
              }));

            if (!valid.length) reject('No valid rows (title and link required)');
            resolve(valid);
          },
          error: err => reject(err.message)
        });
      })
    }).then(result => {
      if (result.isConfirmed) importFromCSV(result.value);
    }).catch(err => {
      if (err && err !== 'cancel') Swal.fire('Import Failed', String(err), 'error');
    });
  };

  const importFromCSV = async (rows) => {
    try {
      const added = [];
      for (const row of rows) {
        try {
          const { data } = await createResource(row);
          added.push(data);
        } catch (e) {
          console.error('Failed row:', row, e.response?.data);
        }
      }
      if (added.length > 0) {
        setResources(prev => [...prev, ...added]);
        Swal.fire('Imported', `${added.length} resource(s) added`, 'success');
      }
    } catch (err) {
      Swal.fire('Error', 'Import failed', 'error',err.message);
    }
  };

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <Book className="w-8 h-8 text-blue-600" />
          Manage Resources
        </h1>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <motion.button
          onClick={handleCSVImport}
          className="px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-xl flex items-center gap-2 text-sm"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Upload size={16} /> Import CSV
        </motion.button>
        <motion.button
          onClick={() => exportToCSV(filteredResources)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 text-sm shadow-sm"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Download size={16} /> Export CSV
        </motion.button>
        <motion.button
          onClick={() => openModal()}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl flex items-center gap-2 text-sm shadow-sm"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <CheckCircle size={16} /> Add Resource
        </motion.button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading resources...</div>
      ) : filteredResources.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          No resources found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(r => (
            <motion.div
              key={r.id}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
            >
              <div className={`${getResourceColor(r.format)} px-5 py-3 text-white flex items-center gap-3`}>
                {getResourceIcon(r.format)}
                <h4 className="font-bold text-lg truncate">{r.title}</h4>
              </div>

              <div className="p-4 space-y-3 text-sm">
                <p className="text-gray-700 dark:text-gray-300 line-clamp-3">{r.description}</p>

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Tag size={16} /> {r.category} • {r.difficulty || '—'}
                </div>

                <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-100 dark:border-slate-700">
                  <span className="font-medium">{r.format}</span>
                  {r.restricted ? (
                    <div className="flex items-center gap-1 text-red-500">
                      <Lock size={14} /> Restricted
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-green-500">
                      <Unlock size={14} /> Public
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-3">
                  <a
                    href={r.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                  >
                    Open Resource →
                  </a>

                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => openModal(r)}
                      className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Edit3 size={18} className="text-blue-600 dark:text-blue-400" />
                    </motion.button>
                    <motion.button
                      onClick={() => confirmDelete(r)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Trash size={18} className="text-red-600 dark:text-red-400" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
                  {editingResource ? 'Edit Resource' : 'Add Resource'}
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
                      className={`w-full px-4 py-3 rounded-lg border ${formErrors.title ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                      placeholder="Resource title"
                    />
                    {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border ${formErrors.category ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                      placeholder="e.g. Tutorials, Event Materials"
                    />
                    {formErrors.category && <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Format</label>
                    <select
                      value={formData.format}
                      onChange={e => setFormData({ ...formData, format: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    >
                      <option value="PDF">PDF</option>
                      <option value="Video">Video</option>
                      <option value="Article">Article</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Difficulty</label>
                    <input
                      type="text"
                      value={formData.difficulty}
                      onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="Beginner / Intermediate / Advanced"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Link / URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.link ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                    placeholder="https://... or /file/path.pdf"
                  />
                  {formErrors.link && <p className="text-red-500 text-xs mt-1">{formErrors.link}</p>}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="restricted"
                    checked={formData.restricted}
                    onChange={e => setFormData({ ...formData, restricted: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="restricted" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                    Restricted (login required)
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.description ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[140px]`}
                    placeholder="Resource description..."
                  />
                  {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
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
                  {editingResource ? 'Update' : 'Add'} Resource
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}