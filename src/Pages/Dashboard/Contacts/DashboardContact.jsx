
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Search, Eye, Upload, CheckCircle,
  Facebook, Linkedin, Archive, Loader2, X, Plus, User, Calendar
} from 'lucide-react';
import Swal from 'sweetalert2';
import {
  getCurrentYear,
  getCommittee,
  importTeamMembers,
} from '../../../api';

const DashboardContact = () => {
  const [activeTab, setActiveTab] = useState('team');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [viewingItem, setViewingItem] = useState(null);
  const [committeeMembers, setCommitteeMembers] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  // Form data for adding new member
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    year: new Date().getFullYear(),
    phone: '',
    assigned_at: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get current year
      const yearRes = await getCurrentYear();
      const fetchedYear = yearRes.data?.current_year || new Date().getFullYear();
      setCurrentYear(fetchedYear);
      setFormData(prev => ({ ...prev, year: fetchedYear }));

      // Get committee for current year
      const committeeRes = await getCommittee(fetchedYear);
      const data = committeeRes.data;
      const members = Array.isArray(data) ? data : data?.results || [];
      setCommitteeMembers(members);
    } catch (err) {
      console.error('Fetch error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to load data',
        text: err.response?.data?.detail || 'Please check network or login status'
      });
      setCommitteeMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Derived data
  const currentMembers = committeeMembers.filter(m => m.year === currentYear);
  const archivedMembers = committeeMembers
    .filter(m => m.year < currentYear)
    .reduce((acc, m) => {
      const y = m.year;
      if (!acc[y]) acc[y] = [];
      acc[y].push(m);
      return acc;
    }, {});

  const filteredCurrent = currentMembers.filter(m =>
    (m.user_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.user_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.role?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await Swal.fire({
      title: 'Import Committee CSV',
      text: `Target year: ${currentYear}`,
      input: 'checkbox',
      inputLabel: 'Archive previous year members',
      showCancelButton: true,
      confirmButtonText: 'Import',
    });

    if (!result.isConfirmed) return;

    const archiveOld = !!result.value;

    const formDataToSend = new FormData();
    formDataToSend.append('file', file);
    formDataToSend.append('year', currentYear);
    formDataToSend.append('archive_old', archiveOld);

    try {
      await importTeamMembers(formDataToSend);
      Swal.fire('Success', 'Committee imported', 'success');
      fetchData();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.error || 'Import failed', 'error');
    }
  };

  const handleView = (member) => {
    setViewingItem(member);
    setShowModal(true);
  };

  const handleAdd = () => {
    setViewingItem(null);
    setFormData({
      name: '',
      email: '',
      role: '',
      year: currentYear,
      phone: '',
      assigned_at: '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.role) {
      Swal.fire('Required', 'Name, Email, and Role are required', 'warning');
      return;
    }

    try {
      // Placeholder for actual API call
      Swal.fire('Placeholder', 'Member save not implemented yet', 'info');
      setShowModal(false);
      fetchData();
    } catch (err) {
      Swal.fire('Error', 'Save failed', 'error',err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading committee data...</p>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-slate-700 mb-8">
            <button
              onClick={() => setActiveTab('team')}
              className={`px-8 py-4 font-medium text-lg transition-colors ${
                activeTab === 'team'
                  ? 'border-b-4 border-blue-600 text-blue-700 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              Committee Members
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`px-8 py-4 font-medium text-lg transition-colors ${
                activeTab === 'faqs'
                  ? 'border-b-4 border-blue-600 text-blue-700 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              FAQs
            </button>
          </div>

          {activeTab === 'team' && (
            <>
              {/* Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search name, email or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl cursor-pointer shadow-sm hover:from-blue-700">
                    <Upload size={18} />
                    Import CSV
                    <input type="file" accept=".csv" onChange={handleImport} className="hidden" />
                  </label>
                  <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-sm"
                  >
                    <Plus size={18} /> Add Member
                  </button>
                </div>
              </div>

              {/* Current Committee - Table View */}
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    Current Committee <span className="text-blue-600">({currentYear})</span>
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredCurrent.length} members
                  </span>
                </div>

                {filteredCurrent.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-dashed">
                    <User size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No members in current committee yet</p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-slate-700/50">
                          <tr>
                            <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Email</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Role</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">assigned_at</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                          {filteredCurrent.map((member, index) => (
                            <motion.tr
                              key={member.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="hover:bg-gray-50 dark:hover:bg-slate-700/30"
                            >
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.user_name || member.user_email.split('@')[0])}&background=0D8ABC&color=fff&size=48`}
                                    alt={member.user_name}
                                    className="w-10 h-10 rounded-full"
                                  />
                                  <div>
                                    <div className="font-medium text-gray-900 dark:text-white">
                                      {member.user_name || member.user_email.split('@')[0]}
                                    </div>
                                    {member.role?.is_president && (
                                      <span className="inline-block px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full font-medium">
                                        President
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2">
                                  <Mail size={16} className="text-gray-400" />
                                  <a 
                                    href={`mailto:${member.user_email}`}
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                  >
                                    {member.user_email}
                                  </a>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-yellow-500  rounded-full text-sm font-medium">
                                  {member.role?.name || 'Unknown Role'}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-red-600 ">
                                {member.assigned_at
                                  ? new Date(member.assigned_at).toLocaleString('en-GB', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: true,
                                    })
                                  : 'Not specified'}
                              </td>

                              <td className="py-4 px-6">
                                <button
                                  onClick={() => handleView(member)}
                                  className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                                >
                                  <Eye size={16} />
                                  View
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </section>

              {/* Archived Committees - Compact View */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <Archive size={24} className="text-purple-600" />
                  Archived Committees
                </h2>

                {Object.keys(archivedMembers).length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 py-8">No archived committees yet.</p>
                ) : (
                  <div className="space-y-6">
                    {Object.keys(archivedMembers)
                      .sort((a, b) => Number(b) - Number(a))
                      .map(year => (
                        <div key={year} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
                          <div className="px-6 py-4 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-800">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Calendar size={18} />
                                {year} Committee
                              </h3>
                              <span className="text-sm text-purple-600 dark:text-purple-400">
                                {archivedMembers[year].length} members
                              </span>
                            </div>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-gray-50 dark:bg-slate-700/30">
                                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Name</th>
                                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Role</th>
                                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Email</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {archivedMembers[year].map(member => (
                                  <tr key={member.id}>
                                    <td className="py-3 px-6">
                                      <div className="flex items-center gap-3">
                                        <img
                                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.user_name || member.user_email.split('@')[0])}&size=40`}
                                          alt={member.user_name}
                                          className="w-8 h-8 rounded-full"
                                        />
                                        <span className="font-medium">{member.user_name || member.user_email.split('@')[0]}</span>
                                      </div>
                                    </td>
                                    <td className="py-3 px-6">
                                      <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded text-sm">
                                        {member.role?.name}
                                      </span>
                                    </td>
                                    <td className="py-3 px-6 text-gray-600 dark:text-gray-400 text-sm">
                                      {member.user_email}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </section>
            </>
          )}

          {activeTab === 'faqs' && (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold mb-4">FAQs Management</h2>
              <p className="text-gray-500 dark:text-gray-400">
                FAQ section coming soon – CRUD will be added here.
              </p>
            </div>
          )}

          {/* Modal - View/Add Member */}
          <AnimatePresence>
            {showModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
                onClick={() => setShowModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {viewingItem ? 'View Committee Member' : 'Add New Committee Member'}
                    </h2>
                    <button 
                      onClick={() => setShowModal(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                    >
                      <X size={24} className="text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>

                  <div className="p-6">
                    {viewingItem ? (
                      // View Mode
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Profile</label>
                            <div className="flex items-center gap-4">
                              <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(viewingItem.user_name || viewingItem.user_email.split('@')[0])}&background=0D8ABC&color=fff&size=128`}
                                alt={viewingItem.user_name}
                                className="w-20 h-20 rounded-full border-4 border-gray-100 dark:border-slate-700"
                              />
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                  {viewingItem.user_name || viewingItem.user_email.split('@')[0]}
                                </h3>
                                <p className="text-blue-600 dark:text-blue-400 font-medium">
                                  {viewingItem.role?.name}
                                </p>
                                {viewingItem.role?.is_president && (
                                  <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 rounded-full text-sm font-medium">
                                    Committee President
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Contact</label>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <Mail size={18} className="text-gray-400" />
                                <a 
                                  href={`mailto:${viewingItem.user_email}`}
                                  className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  {viewingItem.user_email}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Committee Details</label>
                            <div className="space-y-3">
                              <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Year:</span>
                                <p className="text-gray-900 dark:text-white font-medium">
                                  {viewingItem.year}
                                </p>
                              </div>
                              <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">assigned_at:</span>
                                <p className="text-gray-900 dark:text-white font-medium">
                                  {viewingItem.assigned_at || 'Not specified'}
                                </p>
                              </div>
                              <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Member Since:</span>
                                <p className="text-gray-900 dark:text-white font-medium">
                                  {viewingItem.created_at ? new Date(viewingItem.created_at).toLocaleDateString() : 'Unknown'}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Social Links</label>
                            <div className="flex gap-3">
                              <button className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400">
                                <Facebook size={20} />
                              </button>
                              <button className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400">
                                <Linkedin size={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Add Mode
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              value={formData.name}
                              onChange={e => setFormData({ ...formData, name: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none"
                              placeholder="Enter full name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={e => setFormData({ ...formData, email: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none"
                              placeholder="Enter email address"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Role *
                            </label>
                            <select
                              value={formData.role}
                              onChange={e => setFormData({ ...formData, role: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none"
                            >
                              <option value="">Select a role</option>
                              <option value="president">President</option>
                              <option value="vice_president">Vice President</option>
                              <option value="secretary">Secretary</option>
                              <option value="treasurer">Treasurer</option>
                              <option value="member">Member</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              assigned_at
                            </label>
                            <input
                              type="text"
                              value={formData.assigned_at}
                              onChange={e => setFormData({ ...formData, assigned_at: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none"
                              placeholder="e.g., Marketing, IT, Finance"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={e => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none"
                              placeholder="Enter phone number"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Year
                            </label>
                            <input
                              type="number"
                              value={formData.year}
                              onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none"
                              min="2000"
                              max="2030"
                            />
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                          <div className="flex justify-end gap-4">
                            <button
                              onClick={() => setShowModal(false)}
                              className="px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSave}
                              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                              <CheckCircle size={18} />
                              Add Member
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {viewingItem && (
                    <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end">
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default DashboardContact;