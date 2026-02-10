
// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import {
//   ArrowLeft, Shield, Mail, Calendar,  CheckCircle, XCircle
// } from 'lucide-react';
// // import Swal from 'sweetalert2';
// import { getUserById } from '../../../api';

// export default function AdminDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         setLoading(true);
//         const res = await getUserById(id);
//         setUser(res.data);
//       } catch (err) {
//         console.error(err);
//         setError('Failed to load user details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (error || !user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-6">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
//           <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'User not found'}</p>
//           <button
//             onClick={() => navigate('/dashboard/users')}
//             className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
//           >
//             Back to List
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const currentMembership = user.current_membership;
//   const currentRole = currentMembership?.role;
//   const isPresident = currentRole?.is_president;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6"
//     >
//       <div className="max-w-6xl mx-auto">
//         <button
//           onClick={() => navigate('/dashboard/users')}
//           className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-8"
//         >
//           <ArrowLeft size={18} /> Back to Users
//         </button>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Profile Card */}
//           <div className="lg:col-span-1">
//             <div className={`rounded-2xl p-8 text-white shadow-xl ${
//               isPresident
//                 ? 'bg-gradient-to-br from-blue-600 to-indigo-700'
//                 : 'bg-gradient-to-br from-indigo-600 to-purple-700'
//             }`}>
//               <div className="flex flex-col items-center text-center">
//                 <img
//                   src={user.photo || 'https://via.placeholder.com/128?text=User'}
//                   alt={user.name}
//                   className="w-32 h-32 rounded-full object-cover border-4 border-white/30 mb-6"
//                 />
//                 <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
//                 <p className="text-xl opacity-90 mb-4">
//                   {currentRole?.name || 'No Role Assigned'}
//                   {isPresident && <span className="ml-2 font-semibold">(President)</span>}
//                 </p>

//                 <div className="flex flex-col gap-3 text-sm opacity-90">
//                   <p className="flex items-center justify-center gap-2">
//                     <Mail size={16} /> {user.email}
//                   </p>
//                   <p className="flex items-center justify-center gap-2">
//                     <Calendar size={16} /> Joined {new Date(user.date_joined).toLocaleDateString()}
//                   </p>
//                   {user.student_id && (
//                     <p>Student ID: {user.student_id}</p>
//                   )}
//                 </div>

//                 <div className="mt-6">
//                   {user.is_active ? (
//                     <span className="inline-flex items-center gap-2 bg-white/20 px-4 py-1 rounded-full">
//                       <CheckCircle size={16} /> Active
//                     </span>
//                   ) : (
//                     <span className="inline-flex items-center gap-2 bg-red-500/30 px-4 py-1 rounded-full">
//                       <XCircle size={16} /> Inactive
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Details */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Current Role & Permissions */}
//             {currentMembership && (
//               <div className="bg-white dark:bg-slate-800 rounded-2xl p-7 shadow border border-gray-200 dark:border-slate-700">
//                 <h3 className="text-xl font-bold mb-5 flex items-center gap-3">
//                   <Shield size={20} /> Current Committee Role ({currentMembership.year})
//                 </h3>
//                 <div className="space-y-4">
//                   <div>
//                     <p className="text-sm text-gray-500 dark:text-slate-400">Role</p>
//                     <p className="font-medium text-lg">{currentRole.name}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 dark:text-slate-400">Permissions</p>
//                     {currentRole.permissions?.length > 0 ? (
//                       <div className="flex flex-wrap gap-2 mt-2">
//                         {currentRole.permissions.map(p => (
//                           <span
//                             key={p.id}
//                             className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded-full text-sm"
//                           >
//                             {p.name}
//                           </span>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-gray-500 dark:text-slate-400 italic">No specific page permissions</p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Membership History */}
//             {user.memberships?.length > 0 && (
//               <div className="bg-white dark:bg-slate-800 rounded-2xl p-7 shadow border border-gray-200 dark:border-slate-700">
//                 <h3 className="text-xl font-bold mb-5 flex items-center gap-3">
//                   <Calendar size={20} /> Committee History
//                 </h3>
//                 <div className="space-y-4">
//                   {user.memberships.map((m, idx) => (
//                     <div key={idx} className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <p className="font-medium">{m.role.name}</p>
//                           <p className="text-sm text-gray-500 dark:text-slate-400">Year: {m.year}</p>
//                         </div>
//                         <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-slate-600 rounded">
//                           {new Date(m.assigned_at).toLocaleDateString()}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// HandleAdmin.jsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Loader2, Trash2, UserPlus } from 'lucide-react';
import Swal from 'sweetalert2';

import {
  getUsers,
  getRoles,
  createUser,
  updateUser,
  deleteUser,
  createMembership,
  importTeamMembers,
  createRole,
  getPages,
  performHandover,
  getUserById,
} from '../../../api';
import { useNavigate, useParams } from 'react-router-dom';

export default function HandleAdmin() {
  const { id } = useParams()
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role_id: '',
    year: new Date().getFullYear(),
  });
  const [importFile, setImportFile] = useState(null);
  const [importYear, setImportYear] = useState(new Date().getFullYear());
  const [archiveOld, setArchiveOld] = useState(false);
  const [importing, setImporting] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);  // New: Role creation modal
  const [roleForm, setRoleForm] = useState({ name: '', is_president: false, permissions_ids: [] });  // New
  const [pages, setPages] = useState([]);  // New: Fetch pages for permissions
  const [showHandoverModal, setShowHandoverModal] = useState(false);  // New: Handover
  const [handoverForm, setHandoverForm] = useState({ new_year: new Date().getFullYear() + 1, new_president_id: '', archive_old: false });  // New

  useEffect(() => {
    loadData();
    getPages().then(res => setPages(res.data));  // New: Fetch pages for role permissions
  }, []);

  useEffect(() => {
    if (!id || isNaN(id) || id === 'undefined') {
      setError('Invalid user ID');
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getUserById(id);
        setUser(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([getUsers(), getRoles()]);
      setUsers(usersRes.data);
      setRoles(rolesRes.data);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

    if (!id || id === 'undefined') {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid User ID</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The user ID is missing or invalid.
            </p>
            <button
              onClick={() => navigate('/dashboard/admins')}  // or wherever your list is
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Users List
            </button>
          </div>
        </div>
      );
    }

  const handleAddUser = async () => {
    if (!form.name || !form.email || !form.password || !form.role_id) {
      Swal.fire('Missing fields', 'Please fill all required fields', 'warning');
      return;
    }

    try {
      const userRes = await createUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      await createMembership({
        user: userRes.data.id,
        role_id: form.role_id,
        year: form.year,
      });

      Swal.fire('Success', 'User and role assigned', 'success');
      setShowAddModal(false);
      setForm({ name: '', email: '', password: '', role_id: '', year: new Date().getFullYear() });
      loadData();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.detail || 'Failed to create user', 'error');
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      Swal.fire('No file', 'Please select a CSV file', 'warning');
      return;
    }

    setImporting(true);
    const data = new FormData();
    data.append('file', importFile);
    data.append('year', importYear);
    data.append('archive_old', archiveOld);

    try {
      await importTeamMembers(data);
      Swal.fire('Success', 'Committee imported successfully', 'success');
      loadData();
    } catch (err) {
      Swal.fire('Error', 'Import failed', 'error',err.message);
    } finally {
      setImporting(false);
    }
  };

  const handleCreateRole = async () => {
    try {
      await createRole(roleForm);
      Swal.fire('Success', 'Role created', 'success');
      setShowRoleModal(false);
      loadData();  // Refresh roles
    } catch (err) {
      Swal.fire('Error', 'Failed to create role', 'error',err);
    }
  };

  const handleHandover = async () => {
    try {
      await performHandover(handoverForm);
      Swal.fire('Success', 'Handover complete', 'success');
      setShowHandoverModal(false);
      loadData();  // Refresh after year change
    } catch (err) {
      Swal.fire('Error', 'Handover failed', 'error');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Committee & Users</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <UserPlus size={18} /> Add User
          </button>
          <button
            onClick={() => setShowRoleModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus size={18} /> Add Role
          </button>
          <button
            onClick={() => setShowHandoverModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <UserPlus size={18} /> Perform Handover
          </button>
        </div>
      </div>

      {/* Search & Import */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600"
          />
        </div>

        {/* Simple import UI – you can make it a modal later */}
        <div className="flex gap-3 items-end">
          <div>
            <label className="block text-sm mb-1">Year</label>
            <input
              type="number"
              value={importYear}
              onChange={e => setImportYear(e.target.value)}
              className="w-24 px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">CSV File</label>
            <input
              type="file"
              accept=".csv"
              onChange={e => setImportFile(e.target.files[0])}
              className="file:px-4 file:py-2 file:bg-blue-600 file:text-white file:rounded-lg"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={archiveOld}
              onChange={e => setArchiveOld(e.target.checked)}
            />
            Archive old
          </label>
          <button
            onClick={handleImport}
            disabled={importing}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {importing ? 'Importing...' : 'Import Committee'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800">
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Current Role</th>
                <th className="p-4 text-left">Year</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                  <td className="p-4">{u.name}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">
                    {u.current_membership?.role?.name || '—'}
                    {u.current_membership?.role?.is_president && ' (President)'}
                  </td>
                  <td className="p-4">{u.current_membership?.year || '—'}</td>
                  <td className="p-4 text-right flex gap-2 justify-end">
                    <button
                      onClick={() => navigate(`/dashboard/users/${u.id}`)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add User Modal – very basic version */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Add New User</h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm">Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">Role</label>
                <select
                  value={form.role_id}
                  onChange={e => setForm({ ...form, role_id: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                >
                  <option value="">Select Role</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} {r.is_president ? '(President)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm">Committee Year</label>
                <input
                  type="number"
                  value={form.year}
                  onChange={e => setForm({ ...form, year: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 bg-gray-200 dark:bg-slate-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl"
              >
                Create & Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Modal (Step a: Add Role) */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Add New Role</h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm">Name</label>
                <input
                  value={roleForm.name}
                  onChange={e => setRoleForm({...roleForm, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={roleForm.is_president} 
                    onChange={e => setRoleForm({...roleForm, is_president: e.target.checked})} 
                  />
                  Is President
                </label>
              </div>

              <div>
                <label className="block mb-1 text-sm">Permissions</label>
                <select
                  multiple
                  value={roleForm.permissions_ids}
                  onChange={e => setRoleForm({...roleForm, permissions_ids: Array.from(e.target.selectedOptions, o => o.value)})}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                >
                  {pages.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowRoleModal(false)}
                className="flex-1 py-3 bg-gray-200 dark:bg-slate-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRole}
                className="flex-1 py-3 bg-green-600 text-white rounded-xl"
              >
                Create Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Handover Modal */}
      {showHandoverModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Perform Handover</h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm">New Year</label>
                <input
                  type="number"
                  value={handoverForm.new_year}
                  onChange={e => setHandoverForm({...handoverForm, new_year: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">New President</label>
                <select
                  value={handoverForm.new_president_id}
                  onChange={e => setHandoverForm({...handoverForm, new_president_id: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                >
                  <option value="">Select New President</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={handoverForm.archive_old} 
                    onChange={e => setHandoverForm({...handoverForm, archive_old: e.target.checked})} 
                  />
                  Archive Old Committee to Alumni
                </label>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowHandoverModal(false)}
                className="flex-1 py-3 bg-gray-200 dark:bg-slate-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleHandover}
                className="flex-1 py-3 bg-purple-600 text-white rounded-xl"
              >
                Confirm Handover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}