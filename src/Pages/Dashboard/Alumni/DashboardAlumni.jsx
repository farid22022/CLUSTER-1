
import { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Loader2, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar, 
  GraduationCap, 
  Building, 
  Link, 
  ExternalLink, 
  Clock,
  Check,
  X,
  FileText,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { getAlumni, approveAlumni, rejectAlumni, deleteAlumni } from '../../../api';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const res = await getAlumni();
      setAlumni(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to load alumni', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveAlumni(id);
      Swal.fire('Success', 'Alumni approved', 'success');
      fetchAlumni();
    } catch (err) {
      Swal.fire('Error', 'Failed to approve', 'error', err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectAlumni(id);
      Swal.fire('Success', 'Alumni rejected', 'success');
      fetchAlumni();
    } catch (err) {
      Swal.fire('Error', 'Failed to reject', 'error', err.message);
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete "${name}" permanently? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!result.isConfirmed) return;

    try {
      await deleteAlumni(id);
      Swal.fire('Deleted!', 'Alumni has been deleted.', 'success');
      fetchAlumni();
    } catch (err) {
      Swal.fire('Error', 'Failed to delete alumni', 'error', err.message);
    }
  };

  const handleViewDetails = (alum) => {
    setSelectedAlumni(alum);
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300',
      approved: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300',
      rejected: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300',
    };
    return colors[status] || 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <Check className="w-4 h-4" />;
      case 'rejected':
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-950 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Alumni Management Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Review, approve, or reject alumni applications. View detailed profiles.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading alumni data...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-800">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">Alumni</th>
                  <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">Contact</th>
                  <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">Academic Info</th>
                  <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">Professional Info</th>
                  <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {alumni.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center py-8">
                        <User className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                          No alumni applications yet
                        </p>
                        <p className="text-gray-400 dark:text-gray-500">
                          Alumni will appear here when they submit applications
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  alumni.map((alum) => (
                    <tr 
                      key={alum.id} 
                      className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-150"
                    >
                      {/* Alumni Name and Photo */}
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="relative">
                            <img
                              src={alum.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(alum.name)}&background=2563eb&color=fff&size=64`}
                              alt={alum.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-blue-100 dark:border-blue-900"
                            />
                            {alum.approval_status === 'approved' && (
                              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <p className="font-semibold text-gray-800 dark:text-white">{alum.name}</p>
                            {alum.email && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                                {alum.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Contact Information */}
                      <td className="p-4">
                        <div className="space-y-1">
                          {alum.phone_number && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <Phone className="w-4 h-4 mr-2" />
                              {alum.phone_number}
                            </div>
                          )}
                          {alum.location && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span className="truncate max-w-[150px]">{alum.location}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Academic Information */}
                      <td className="p-4">
                        <div className="space-y-1">
                          {alum.batch && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <GraduationCap className="w-4 h-4 mr-2" />
                              {alum.batch}
                            </div>
                          )}
                          {alum.session && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <Calendar className="w-4 h-4 mr-2" />
                              Session: {alum.session}
                            </div>
                          )}
                          {alum.passing_year && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <Calendar className="w-4 h-4 mr-2" />
                              Pass: {alum.passing_year}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Professional Information */}
                      <td className="p-4">
                        <div className="space-y-1">
                          {alum.current_role && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <Briefcase className="w-4 h-4 mr-2" />
                              {alum.current_role}
                            </div>
                          )}
                          {alum.company && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <Building className="w-4 h-4 mr-2" />
                              <span className="truncate max-w-[150px]">{alum.company}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 ${getStatusColor(alum.approval_status)}`}>
                            {getStatusIcon(alum.approval_status)}
                            <span>{alum.approval_status.charAt(0).toUpperCase() + alum.approval_status.slice(1)}</span>
                          </div>
                          {alum.approved_by && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                              ID: {alum.approved_by}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {/* View Details Button */}
                          <button
                            onClick={() => handleViewDetails(alum)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-lg transition hover:scale-105"
                            title="View full details"
                          >
                            <Eye size={16} />
                            View
                          </button>

                          {/* Action Buttons based on status */}
                          {alum.approval_status === 'pending' ? (
                            <>
                              <button
                                onClick={() => handleApprove(alum.id)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/40 dark:text-green-300 rounded-lg transition hover:scale-105"
                                title="Approve this application"
                              >
                                <CheckCircle size={16} />
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(alum.id)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/40 dark:text-red-300 rounded-lg transition hover:scale-105"
                                title="Reject this application"
                              >
                                <XCircle size={16} />
                                Reject
                              </button>
                            </>
                          ) : (
                            alum.approval_status === 'approved' ? (
                              <button
                                onClick={() => handleReject(alum.id)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 rounded-lg transition hover:scale-105"
                                title="Revoke approval"
                              >
                                <XCircle size={16} />
                                Revoke
                              </button>
                            ) : (
                              <button
                                onClick={() => handleApprove(alum.id)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/40 dark:text-green-300 rounded-lg transition hover:scale-105"
                                title="Approve this application"
                              >
                                <CheckCircle size={16} />
                                Approve
                              </button>
                            )
                          )}

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(alum.id, alum.name)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/40 dark:text-red-300 rounded-lg transition hover:scale-105"
                            title="Delete this entry"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Alumni Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedAlumni && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedAlumni.name}</h2>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                        selectedAlumni.approval_status === 'approved' 
                          ? 'bg-green-500/30 text-green-100' 
                          : selectedAlumni.approval_status === 'rejected'
                          ? 'bg-red-500/30 text-red-100'
                          : 'bg-amber-500/30 text-amber-100'
                      }`}>
                        {getStatusIcon(selectedAlumni.approval_status)}
                        {selectedAlumni.approval_status.charAt(0).toUpperCase() + selectedAlumni.approval_status.slice(1)}
                      </span>
                      {selectedAlumni.approved_by && (
                        <span className="text-sm opacity-90">
                          Approved by ID: {selectedAlumni.approved_by}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-white/10 transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column - Profile & Contact */}
                  <div className="space-y-6">
                    {/* Profile Section */}
                    <div className="bg-gray-50 dark:bg-slate-700/30 p-5 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Profile Information
                      </h3>
                      <div className="flex items-center gap-4 mb-6">
                        <img
                          src={selectedAlumni.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedAlumni.name)}&background=2563eb&color=fff&size=128`}
                          alt={selectedAlumni.name}
                          className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900"
                        />
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedAlumni.name}</p>
                          <p className="text-blue-600 dark:text-blue-400">{selectedAlumni.current_role || 'Alumni'}</p>
                          {selectedAlumni.company && (
                            <p className="text-gray-600 dark:text-gray-400">{selectedAlumni.company}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gray-50 dark:bg-slate-700/30 p-5 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Contact Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                          <div>
                            <p className="font-medium">Email</p>
                            <p className="text-gray-600 dark:text-gray-400">{selectedAlumni.email}</p>
                          </div>
                        </div>
                        {selectedAlumni.phone_number && (
                          <div className="flex items-center">
                            <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                            <div>
                              <p className="font-medium">Phone</p>
                              <p className="text-gray-600 dark:text-gray-400">{selectedAlumni.phone_number}</p>
                            </div>
                          </div>
                        )}
                        {selectedAlumni.location && (
                          <div className="flex items-center">
                            <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                            <div>
                              <p className="font-medium">Location</p>
                              <p className="text-gray-600 dark:text-gray-400">{selectedAlumni.location}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Social Links */}
                    {(selectedAlumni.linkedin_url || selectedAlumni.facebook_url) && (
                      <div className="bg-gray-50 dark:bg-slate-700/30 p-5 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                          <Link className="w-5 h-5" />
                          Social Profiles
                        </h3>
                        <div className="space-y-2">
                          {selectedAlumni.linkedin_url && (
                            <a
                              href={selectedAlumni.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <ExternalLink className="w-4 h-4" />
                              LinkedIn Profile
                            </a>
                          )}
                          {selectedAlumni.facebook_url && (
                            <a
                              href={selectedAlumni.facebook_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Facebook Profile
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Academic & Professional */}
                  <div className="space-y-6">
                    {/* Academic Information */}
                    <div className="bg-gray-50 dark:bg-slate-700/30 p-5 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5" />
                        Academic Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedAlumni.batch && (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Batch</p>
                            <p className="font-medium">{selectedAlumni.batch}</p>
                          </div>
                        )}
                        {selectedAlumni.session && (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Session</p>
                            <p className="font-medium">{selectedAlumni.session}</p>
                          </div>
                        )}
                        {selectedAlumni.passing_year && (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Passing Year</p>
                            <p className="font-medium">{selectedAlumni.passing_year}</p>
                          </div>
                        )}
                        {selectedAlumni.graduation_year && (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Graduation Year</p>
                            <p className="font-medium">{selectedAlumni.graduation_year}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div className="bg-gray-50 dark:bg-slate-700/30 p-5 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Briefcase className="w-5 h-5" />
                        Professional Information
                      </h3>
                      <div className="space-y-4">
                        {selectedAlumni.current_role && (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Current Role</p>
                            <p className="font-medium text-lg">{selectedAlumni.current_role}</p>
                          </div>
                        )}
                        {selectedAlumni.company && (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                            <p className="font-medium">{selectedAlumni.company}</p>
                          </div>
                        )}
                        {selectedAlumni.role && (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Role (Legacy Field)</p>
                            <p className="font-medium">{selectedAlumni.role}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* About Section */}
                    {selectedAlumni.about && (
                      <div className="bg-gray-50 dark:bg-slate-700/30 p-5 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          About
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                          {selectedAlumni.about}
                        </p>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="bg-gray-50 dark:bg-slate-700/30 p-5 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Metadata
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Created</span>
                          <span>{formatDate(selectedAlumni.created_at)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Last Updated</span>
                          <span>{formatDate(selectedAlumni.updated_at)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Record ID</span>
                          <span className="font-mono">{selectedAlumni.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-slate-700/30">
                <div className="flex justify-between items-center">
                  <div className="flex gap-3">
                    {/* Quick Actions */}
                    {selectedAlumni.approval_status === 'pending' ? (
                      <>
                        <button
                          onClick={() => {
                            handleApprove(selectedAlumni.id);
                            setIsModalOpen(false);
                          }}
                          className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            handleReject(selectedAlumni.id);
                            setIsModalOpen(false);
                          }}
                          className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                        >
                          <XCircle className="w-5 h-5" />
                          Reject
                        </button>
                      </>
                    ) : selectedAlumni.approval_status === 'approved' ? (
                      <button
                        onClick={() => {
                          handleReject(selectedAlumni.id);
                          setIsModalOpen(false);
                        }}
                        className="px-5 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition flex items-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        Revoke Approval
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          handleApprove(selectedAlumni.id);
                          setIsModalOpen(false);
                        }}
                        className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Approve
                      </button>
                    )}

                    {/* Delete Button */}
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        handleDelete(selectedAlumni.id, selectedAlumni.name);
                      }}
                      className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete
                    </button>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                  >
                    Close
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

export default DashboardAlumni;