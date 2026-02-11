

// import { useState, useEffect } from 'react';
// import { Search, Plus, Loader2, UserPlus } from 'lucide-react';
// import Swal from 'sweetalert2';

// import {
//   getUsers,
//   getRoles,
//   createUser,
//   createMembership,
//   importTeamMembers,
//   createRole,
//   getPages,
//   performHandover,
// } from '../../../api';
// import { useNavigate } from 'react-router-dom';

// export default function HandleAdmin() {
//   const navigate = useNavigate();

//   // Data states
//   const [users, setUsers] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [pages, setPages] = useState([]);

//   // Import states
//   const [importFile, setImportFile] = useState(null);
//   const [importYear, setImportYear] = useState(new Date().getFullYear());
//   const [archiveOld, setArchiveOld] = useState(false);
//   const [importing, setImporting] = useState(false);

//   // Modal states
//   const [showAddChoiceModal, setShowAddChoiceModal] = useState(false);
//   const [showAddExistingModal, setShowAddExistingModal] = useState(false);
//   const [showAddNewUserModal, setShowAddNewUserModal] = useState(false);
//   const [showRoleModal, setShowRoleModal] = useState(false);
//   const [showHandoverModal, setShowHandoverModal] = useState(false);

//   // Form states
//   const [newUserForm, setNewUserForm] = useState({
//     name: '',
//     email: '',
//     password: '',
//     role_id: '',
//     year: new Date().getFullYear(),
//   });

//   const [existingForm, setExistingForm] = useState({
//     user_id: '',
//     role_id: '',
//     year: new Date().getFullYear(),
//   });

//   const [roleForm, setRoleForm] = useState({
//     name: '',
//     is_president: false,
//     permissions_ids: [],
//   });

//   const [handoverForm, setHandoverForm] = useState({
//     new_year: new Date().getFullYear() + 1,
//     new_president_id: '',
//     archive_old: false,
//   });

//   useEffect(() => {
//     loadData();
//     getPages()
//       .then((res) => setPages(res.data))
//       .catch((err) => console.error('Failed to load pages', err));
//   }, []);

//   const loadData = async () => {
//     setLoading(true);
//     try {
//       const [usersRes, rolesRes] = await Promise.all([getUsers(), getRoles()]);
//       setUsers(usersRes.data || []);
//       setRoles(rolesRes.data || []);
//     } catch (err) {
//       console.error(err);
//       Swal.fire('Error', 'Failed to load data', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ─── Add NEW user ────────────────────────────────────────
//   const handleAddNewUser = async () => {
//     const { name, email, password, role_id, year } = newUserForm;
//     if (!name || !email || !password || !role_id) {
//       Swal.fire('Missing fields', 'Please fill Name, Email, Password and Role', 'warning');
//       return;
//     }

//     try {
//       const userRes = await createUser({ name, email, password });
//       await createMembership({ user: userRes.data.id, role_id, year });
//       Swal.fire('Success', 'New user created and added to committee', 'success');
//       setShowAddNewUserModal(false);
//       setNewUserForm({
//         name: '',
//         email: '',
//         password: '',
//         role_id: '',
//         year: new Date().getFullYear(),
//       });
//       loadData();
//     } catch (err) {
//       Swal.fire('Error', err.response?.data?.detail || 'Failed to create user', 'error');
//     }
//   };

//   // ─── Add EXISTING user to committee ──────────────────────
//   const handleAddExistingUser = async () => {
//     const { user_id, role_id, year } = existingForm;
//     if (!user_id || !role_id) {
//       Swal.fire('Missing fields', 'Please select a user and a role', 'warning');
//       return;
//     }

//     try {
//       await createMembership({ user: user_id, role_id, year });
//       Swal.fire('Success', 'User successfully added to committee', 'success');
//       setShowAddExistingModal(false);
//       fetchData()
//       setExistingForm({
//         user_id: '',
//         role_id: '',
//         year: new Date().getFullYear(),
//       });
//       loadData();
//     } catch (err) {
//       Swal.fire('Error', err.response?.data?.detail || 'Failed to assign user', 'error');
//     }
//   };

//   // ─── Create new Role ─────────────────────────────────────
//   const handleCreateRole = async () => {
//     if (!roleForm.name) {
//       Swal.fire('Missing name', 'Role name is required', 'warning');
//       return;
//     }

//     try {
//       await createRole(roleForm);
//       Swal.fire('Success', 'Role created successfully', 'success');
//       setShowRoleModal(false);
//       setRoleForm({ name: '', is_president: false, permissions_ids: [] });
//       loadData();
//     } catch (err) {
//       Swal.fire('Error', err.response?.data?.detail || 'Failed to create role', 'error');
//     }
//   };

//   // ─── Import Committee (CSV) ──────────────────────────────
//   const handleImport = async () => {
//     if (!importFile) {
//       Swal.fire('No file selected', 'Please select a CSV file', 'warning');
//       return;
//     }

//     setImporting(true);
//     const formData = new FormData();
//     formData.append('file', importFile);
//     formData.append('year', importYear);
//     formData.append('archive_old', archiveOld);

//     try {
//       await importTeamMembers(formData);
//       Swal.fire('Success', 'Committee imported successfully', 'success');
//       loadData();
//     } catch (err) {
//       Swal.fire('Error', err.response?.data?.error || 'Import failed', 'error');
//     } finally {
//       setImporting(false);
//     }
//   };

//   // ─── Handover ────────────────────────────────────────────
//   const handleHandover = async () => {
//     if (!handoverForm.new_year || !handoverForm.new_president_id) {
//       Swal.fire('Missing fields', 'Please select year and new president', 'warning');
//       return;
//     }

//     try {
//       await performHandover(handoverForm);
//       Swal.fire('Success', 'Handover completed successfully', 'success');
//       setShowHandoverModal(false);
//       loadData();
//     } catch (err) {
//       Swal.fire('Error', err.response?.data?.error || 'Handover failed', 'error');
//     }
//   };

//   const handleViewUser = (userId) => {
//     if (userId) navigate(`/dashboard/users/${userId}`);
//   };

//   // ─── Filter users not in current committee ───────────────
//   const currentYear = new Date().getFullYear();
//   const usersNotInCommittee = users.filter(
//     (u) => !u.current_membership || u.current_membership.year !== currentYear
//   );

//   const filteredUsers = users.filter(
//     (u) =>
//       (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
//       (u.email || '').toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
//         <h1 className="text-3xl font-bold text-white">Welcome to Cluster : Users & Members </h1>
//         <div className="flex gap-3 flex-wrap">
//           <button
//             onClick={() => setShowAddChoiceModal(true)}
//             className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
//           >
//             <UserPlus size={18} /> Add to Committee
//           </button>
//           <button
//             onClick={() => setShowRoleModal(true)}
//             className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm"
//           >
//             <Plus size={18} /> Add Role
//           </button>
//           <button
//             onClick={() => setShowHandoverModal(true)}
//             className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-sm"
//           >
//             <UserPlus size={18} /> Perform Handover
//           </button>
//         </div>
//       </div>

//       {/* Search & Import */}
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white" size={18} />
//           <input
//             type="text"
//             placeholder="Search by name or email..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600"
//           />
//         </div>

//         {/* CSV Import */}
//         <div className="flex flex-wrap gap-3">
//           <div>
//             <label className="block text-sm mb-1">Year</label>
//             <input
//               type="number"
//               value={importYear}
//               onChange={(e) => setImportYear(Number(e.target.value))}
//               className="w-24 px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600"
//             />
//           </div>
//           <div>
//             <label className="block text-sm mb-1">CSV File</label>
//             <input
//               type="file"
//               accept=".csv"
//               onChange={(e) => setImportFile(e.target.files?.[0] || null)}
//               className="text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//             />
//           </div>
//           <label className="flex items-center gap-2 text-sm pt-6">
//             <input type="checkbox" checked={archiveOld} onChange={(e) => setArchiveOld(e.target.checked)} />
//             Archive old
//           </label>
//           <button
//             onClick={handleImport}
//             disabled={importing || !importFile}
//             className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 mt-6"
//           >
//             {importing ? 'Importing...' : 'Import'}
//           </button>
//         </div>
//       </div>

//       {/* Main Table */}
//       {loading ? (
//         <div className="flex justify-center py-20">
//           <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
//         </div>
//       ) : (
//         <div className="overflow-x-auto rounded-lg border dark:border-slate-700">
//           <table className="w-full min-w-max">
//             <thead className="bg-gray-100 dark:bg-slate-800">
//               <tr>
//                 <th className="p-4 text-left">Name</th>
//                 <th className="p-4 text-left">Email</th>
//                 <th className="p-4 text-left">Current Role</th>
//                 <th className="p-4 text-left">Year</th>
//                 <th className="p-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUsers.length === 0 ? (
//                 <tr>
//                   <td colSpan={5} className="p-12 text-center text-white">
//                     No committee members found
//                   </td>
//                 </tr>
//               ) : (
//                 filteredUsers.map((u) => (
//                   <tr key={u.id} className="border-t dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/60">
//                     <td className="p-4 text-yellow-500">{u.name || '—'}</td>
//                     <td className="p-4 text-emerald-400">{u.email}</td>
//                     <td className="p-4 text-red-500">
//                       {u.current_membership?.role?.name || '—'}
//                       {u.current_membership?.role?.is_president && ' (President)'}
//                     </td>
//                     <td className="p-4 text-lime-400">{u.current_membership?.year || '—'}</td>
//                     <td className="p-4 text-yellow-600 text-right">
//                       <button
//                         onClick={() => handleViewUser(u.id)}
//                         className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300"
//                       >
//                         View
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* ──────────────────────────────────────────────
//            1. CHOICE MODAL: Add to Committee
//       ────────────────────────────────────────────── */}
//       {showAddChoiceModal && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
//             <h2 className="text-2xl font-bold mb-8 text-center">Add Member to Committee</h2>

//             <div className="space-y-5">
//               <button
//                 onClick={() => {
//                   setShowAddChoiceModal(false);
//                   setShowAddExistingModal(true);
//                 }}
//                 className="w-full p-6 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-700 rounded-xl text-left transition"
//               >
//                 <div className="font-semibold text-xl mb-1">Add from existing users</div>
//                 <div className="text-white dark:text-white">
//                   Select someone already registered in the system
//                 </div>
//               </button>

//               <button
//                 onClick={() => {
//                   setShowAddChoiceModal(false);
//                   setShowAddNewUserModal(true);
//                 }}
//                 className="w-full p-6 bg-green-50 hover:bg-green-100 dark:bg-green-950/40 dark:hover:bg-green-900/60 border border-green-200 dark:border-green-700 rounded-xl text-left transition"
//               >
//                 <div className="font-semibold text-xl mb-1">Create and add new user</div>
//                 <div className="text-white dark:text-white">
//                   Register a new person and assign to committee
//                 </div>
//               </button>
//             </div>

//             <div className="mt-8 flex justify-end">
//               <button
//                 onClick={() => setShowAddChoiceModal(false)}
//                 className="px-8 py-3 bg-gray-200 dark:bg-slate-700 rounded-xl hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ──────────────────────────────────────────────
//            2. MODAL: Add EXISTING user
//       ────────────────────────────────────────────── */}
//       {showAddExistingModal && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 w-full max-w-lg shadow-2xl">
//             <h2 className="text-2xl font-bold mb-6">Add Existing User to Committee</h2>

//             <div className="space-y-6">
//               {/* User selection */}
//               <div>
//                 <label className="block mb-2 text-sm font-medium text-white dark:text-white">
//                   Select User
//                 </label>
//                 <select
//                   value={existingForm.user_id}
//                   onChange={(e) => setExistingForm({ ...existingForm, user_id: e.target.value })}
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">— Choose user —</option>
//                   {usersNotInCommittee.length === 0 ? (
//                     <option disabled>No available users</option>
//                   ) : (
//                     usersNotInCommittee.map((u) => (
//                       <option key={u.id} value={u.id}>
//                         {u.name} — {u.email}
//                       </option>
//                     ))
//                   )}
//                 </select>
//                 {usersNotInCommittee.length === 0 && (
//                   <p className="text-sm text-amber-600 mt-2">
//                     All current users are already in this year&apos;s committee
//                   </p>
//                 )}
//               </div>

//               {/* Role */}
//               <div>
//                 <label className="block mb-2 text-sm font-medium text-white dark:text-white">
//                   Committee Role
//                 </label>
//                 <select
//                   value={existingForm.role_id}
//                   onChange={(e) => setExistingForm({ ...existingForm, role_id: e.target.value })}
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select Role</option>
//                   {roles.map((r) => (
//                     <option key={r.id} value={r.id}>
//                       {r.name} {r.is_president ? '(President)' : ''}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Year */}
//               <div>
//                 <label className="block mb-2 text-sm font-medium text-white dark:text-white">
//                   Committee Year
//                 </label>
//                 <input
//                   type="number"
//                   value={existingForm.year}
//                   onChange={(e) => setExistingForm({ ...existingForm, year: Number(e.target.value) })}
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   min="2000"
//                   max="2100"
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-4 mt-10">
//               <button
//                 onClick={() => setShowAddExistingModal(false)}
//                 className="flex-1 py-3 bg-gray-200 dark:bg-slate-700 rounded-xl hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddExistingUser}
//                 disabled={!existingForm.user_id || !existingForm.role_id}
//                 className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Assign to Committee
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ──────────────────────────────────────────────
//            3. MODAL: Create NEW user
//       ────────────────────────────────────────────── */}
//       {showAddNewUserModal && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 w-full max-w-lg shadow-2xl">
//             <h2 className="text-2xl font-bold mb-6">Create New Committee Member</h2>

//             <div className="space-y-5">
//               <div>
//                 <label className="block mb-1 text-sm font-medium">Full Name *</label>
//                 <input
//                   type="text"
//                   value={newUserForm.name}
//                   onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
//                   className="w-full px-4 py-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
//                   placeholder="e.g. Md. Farid Hossen"
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1 text-sm font-medium">Email *</label>
//                 <input
//                   type="email"
//                   value={newUserForm.email}
//                   onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
//                   className="w-full px-4 py-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
//                   placeholder="example@cseku.ac.bd"
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1 text-sm font-medium">Password *</label>
//                 <input
//                   type="password"
//                   value={newUserForm.password}
//                   onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
//                   className="w-full px-4 py-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
//                   placeholder="••••••••••"
//                 />
//               </div>

//               <div>
//                 <label className="block mb-1 text-sm font-medium">Role *</label>
//                 <select
//                   value={newUserForm.role_id}
//                   onChange={(e) => setNewUserForm({ ...newUserForm, role_id: e.target.value })}
//                   className="w-full px-4 py-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
//                 >
//                   <option value="">Select Role</option>
//                   {roles.map((r) => (
//                     <option key={r.id} value={r.id}>
//                       {r.name} {r.is_president ? '(President)' : ''}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block mb-1 text-sm font-medium">Year</label>
//                 <input
//                   type="number"
//                   value={newUserForm.year}
//                   onChange={(e) => setNewUserForm({ ...newUserForm, year: Number(e.target.value) })}
//                   className="w-full px-4 py-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-4 mt-10">
//               <button
//                 onClick={() => setShowAddNewUserModal(false)}
//                 className="flex-1 py-3 bg-gray-200 dark:bg-slate-700 rounded-xl hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddNewUser}
//                 disabled={
//                   !newUserForm.name ||
//                   !newUserForm.email ||
//                   !newUserForm.password ||
//                   !newUserForm.role_id
//                 }
//                 className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Create & Add to Committee
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Role Creation Modal */}
//       {showRoleModal && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 w-full max-w-md">
//             <h2 className="text-2xl font-bold mb-6">Create New Role</h2>

//             <div className="space-y-5">
//               <div>
//                 <label className="block mb-2 text-sm font-medium">Role Name *</label>
//                 <input
//                   type="text"
//                   value={roleForm.name}
//                   onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
//                   className="w-full px-4 py-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
//                   placeholder="e.g. Vice President"
//                 />
//               </div>

//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={roleForm.is_president}
//                   onChange={(e) => setRoleForm({ ...roleForm, is_president: e.target.checked })}
//                 />
//                 <span className="text-sm font-medium">Is President (Super Admin)</span>
//               </label>

//               <div>
//                 <label className="block mb-2 text-sm font-medium">Permissions</label>
//                 <select
//                   multiple
//                   value={roleForm.permissions_ids}
//                   onChange={(e) =>
//                     setRoleForm({
//                       ...roleForm,
//                       permissions_ids: Array.from(e.target.selectedOptions, (opt) => opt.value),
//                     })
//                   }
//                   className="w-full h-40 px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
//                 >
//                   {pages.map((p) => (
//                     <option key={p.id} value={p.id}>
//                       {p.name}
//                     </option>
//                   ))}
//                 </select>
//                 <p className="text-xs text-white mt-1">Hold Ctrl / Cmd to select multiple</p>
//               </div>
//             </div>

//             <div className="flex gap-4 mt-8">
//               <button
//                 onClick={() => setShowRoleModal(false)}
//                 className="flex-1 py-3 bg-gray-200 dark:bg-slate-700 rounded-xl"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleCreateRole}
//                 className="flex-1 py-3 bg-green-600 text-white rounded-xl"
//               >
//                 Create Role
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Handover Modal – add your existing code here if needed */}
//                   {showHandoverModal && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 w-full max-w-md">
//             <h2 className="text-2xl font-bold mb-6">Perform Committee Handover</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block mb-1 text-sm font-medium">New Committee Year</label>
//                 <input
//                   type="number"
//                   value={handoverForm.new_year}
//                   onChange={e => setHandoverForm({ ...handoverForm, new_year: Number(e.target.value) })}
//                   className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
//                 />
//               </div>
//               <div>
//                 <label className="block mb-1 text-sm font-medium">New President</label>
//                 <select
//                   value={handoverForm.new_president_id}
//                   onChange={e => setHandoverForm({ ...handoverForm, new_president_id: e.target.value })}
//                   className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
//                 >
//                   <option value="">Select new President</option>
//                   {users.map(u => (
//                     <option key={u.id} value={u.id}>
//                       {u.name} ({u.email})
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={handoverForm.archive_old}
//                   onChange={e => setHandoverForm({ ...handoverForm, archive_old: e.target.checked })}
//                 />
//                 <span>Archive previous committee to Alumni</span>
//               </label>
//             </div>
//             <div className="flex gap-4 mt-8">
//               <button onClick={() => setShowHandoverModal(false)} className="flex-1 py-3 bg-gray-200 dark:bg-slate-700 rounded-xl">
//                 Cancel
//               </button>
//               <button onClick={handleHandover} className="flex-1 py-3 bg-purple-600 text-white rounded-xl">
//                 Confirm Handover
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { Search, Plus, Loader2, UserPlus, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

import {
  getUsers,
  getRoles,
  createUser,
  createMembership,
  updateMembership,
  deleteMembership,
  importTeamMembers,
  createRole,
  getPages,
  performHandover,
} from '../../../api';
import { useNavigate } from 'react-router-dom';
import UserDetailModal from './UserDetailModal';

export default function HandleAdmin() {
  const navigate = useNavigate();
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  // Data states
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pages, setPages] = useState([]);

  // Import states
  const [importFile, setImportFile] = useState(null);
  const [importYear, setImportYear] = useState(new Date().getFullYear());
  const [archiveOld, setArchiveOld] = useState(false);
  const [importing, setImporting] = useState(false);

  // Modal states
  const [showAddChoiceModal, setShowAddChoiceModal] = useState(false);
  const [showAddExistingModal, setShowAddExistingModal] = useState(false);
  const [showAddNewUserModal, setShowAddNewUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showHandoverModal, setShowHandoverModal] = useState(false);
  const [showEditMembershipModal, setShowEditMembershipModal] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState(null);

  // Form states
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role_id: '',
    year: new Date().getFullYear(),
  });

  const [existingForm, setExistingForm] = useState({
    user_id: '',
    role_id: '',
    year: new Date().getFullYear(),
  });

  const [editForm, setEditForm] = useState({
    role_id: '',
    year: new Date().getFullYear(),
  });

  const [roleForm, setRoleForm] = useState({
    name: '',
    is_president: false,
    permissions_ids: [],
  });

  const [handoverForm, setHandoverForm] = useState({
    new_year: new Date().getFullYear() + 1,
    new_president_id: '',
    archive_old: false,
  });

  useEffect(() => {
    loadData();
    getPages()
      .then((res) => setPages(res.data || []))
      .catch((err) => console.error('Failed to load pages', err));
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([getUsers(), getRoles()]);
      setUsers(usersRes.data || []);
      setRoles(rolesRes.data || []);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ─── Add NEW user ────────────────────────────────────────
  const handleAddNewUser = async () => {
    const { name, email, password, role_id, year } = newUserForm;
    if (!name || !email || !password || !role_id) {
      Swal.fire('Missing fields', 'Please fill Name, Email, Password and Role', 'warning');
      return;
    }

    try {
      const userRes = await createUser({ name, email, password });
      await createMembership({ user: userRes.data.id, role_id, year });
      Swal.fire('Success', 'New user created and added to committee', 'success');
      setShowAddNewUserModal(false);
      setNewUserForm({
        name: '',
        email: '',
        password: '',
        role_id: '',
        year: new Date().getFullYear(),
      });
      loadData();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.detail || 'Failed to create user', 'error');
    }
  };

  // ─── Add EXISTING user to committee ──────────────────────
  const handleAddExistingUser = async () => {
    const { user_id, role_id, year } = existingForm;
    if (!user_id || !role_id) {
      Swal.fire('Missing fields', 'Please select a user and a role', 'warning');
      return;
    }

    try {
      await createMembership({ user: user_id, role_id, year });
      Swal.fire('Success', 'User successfully added to committee', 'success');
      setShowAddExistingModal(false);
      setExistingForm({
        user_id: '',
        role_id: '',
        year: new Date().getFullYear(),
      });
      loadData();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.detail || 'Failed to assign user', 'error');
    }
  };

  // ─── Edit existing membership (change role/year) ─────────
  const openEditModal = (membership) => {
    setSelectedMembership(membership);
    setEditForm({
      role_id: membership.role?.id || '',
      year: membership.year,
    });
    setShowEditMembershipModal(true);
  };

  const handleUpdateMembership = async () => {
    if (!editForm.role_id) {
      Swal.fire('Required', 'Please select a role', 'warning');
      return;
    }

    try {
      await updateMembership(selectedMembership.id, editForm);
      Swal.fire('Success', 'Membership updated successfully', 'success');
      setShowEditMembershipModal(false);
      setSelectedMembership(null);
      loadData();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.detail || 'Failed to update membership', 'error');
    }
  };

  // ─── Delete membership ───────────────────────────────────
  const handleDeleteMembership = async (membershipId) => {
    const result = await Swal.fire({
      title: 'Delete Membership?',
      text: 'This will remove the user from the committee for this year. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete',
    });

    if (result.isConfirmed) {
      try {
        await deleteMembership(membershipId);
        Swal.fire('Deleted', 'Membership removed successfully', 'success');
        loadData();
      } catch (err) {
        Swal.fire('Error', err.response?.data?.detail || 'Failed to delete membership', 'error');
      }
    }
  };

  // ─── Create new Role ─────────────────────────────────────
  const handleCreateRole = async () => {
    if (!roleForm.name) {
      Swal.fire('Missing name', 'Role name is required', 'warning');
      return;
    }

    try {
      await createRole(roleForm);
      Swal.fire('Success', 'Role created successfully', 'success');
      setShowRoleModal(false);
      setRoleForm({ name: '', is_president: false, permissions_ids: [] });
      loadData();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.detail || 'Failed to create role', 'error');
    }
  };

  // ─── Import Committee (CSV) ──────────────────────────────
  const handleImport = async () => {
    if (!importFile) {
      Swal.fire('No file selected', 'Please select a CSV file', 'warning');
      return;
    }

    setImporting(true);
    const formData = new FormData();
    formData.append('file', importFile);
    formData.append('year', importYear);
    formData.append('archive_old', archiveOld);

    try {
      await importTeamMembers(formData);
      Swal.fire('Success', 'Committee imported successfully', 'success');
      loadData();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.error || 'Import failed', 'error');
    } finally {
      setImporting(false);
    }
  };

  // ─── Handover ────────────────────────────────────────────
  const handleHandover = async () => {
    if (!handoverForm.new_year || !handoverForm.new_president_id) {
      Swal.fire('Missing fields', 'Please select year and new president', 'warning');
      return;
    }

    try {
      await performHandover(handoverForm);
      Swal.fire('Success', 'Handover completed successfully', 'success');
      setShowHandoverModal(false);
      loadData();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.error || 'Handover failed', 'error');
    }
  };

const handleViewUser = (userId) => {
  if (userId) {
    setSelectedUserId(userId);
    setShowUserModal(true);
  }
};

  // ─── Filter users not in current committee ───────────────
  const currentYear = new Date().getFullYear();
  const usersNotInCommittee = users.filter(
    (u) => !u.current_membership || u.current_membership.year !== currentYear
  );

  const filteredUsers = users.filter(
    (u) =>
      (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-white">Welcome to Cluster : Users & Members</h1>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setShowAddChoiceModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
          >
            <UserPlus size={18} /> Add to Committee
          </button>
          <button
            onClick={() => setShowRoleModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm"
          >
            <Plus size={18} /> Add Role
          </button>
          <button
            onClick={() => setShowHandoverModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-sm"
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
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600"
          />
        </div>

        {/* CSV Import */}
        <div className="flex flex-wrap gap-3">
          <div>
            <label className="block text-sm mb-1">Year</label>
            <input
              type="number"
              value={importYear}
              onChange={(e) => setImportYear(Number(e.target.value))}
              className="w-24 px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">CSV File</label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              className="text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <label className="flex items-center gap-2 text-sm pt-6">
            <input type="checkbox" checked={archiveOld} onChange={(e) => setArchiveOld(e.target.checked)} />
            Archive old
          </label>
          <button
            onClick={handleImport}
            disabled={importing || !importFile}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 mt-6"
          >
            {importing ? 'Importing...' : 'Import'}
          </button>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border dark:border-slate-700">
          <table className="w-full min-w-max">
            <thead className="bg-gray-100 dark:bg-slate-800">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Current Role</th>
                <th className="p-4 text-left">Year</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-white">
                    No committee members found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="border-t dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/60">
                    <td className="p-4 text-yellow-500">{u.name || '—'}</td>
                    <td className="p-4 text-emerald-400">{u.email}</td>
                    <td className="p-4 text-red-500">
                      {u.current_membership?.role?.name || '—'}
                      {u.current_membership?.role?.is_president && ' (President)'}
                    </td>
                    <td className="p-4 text-lime-400">{u.current_membership?.year || '—'}</td>
                    <td className="p-4 text-right flex gap-2 justify-end">
                      <button
                        onClick={() => handleViewUser(u.id)}
                        className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300"
                      >
                        View
                      </button>
                      {u.current_membership && (
                        <>
                          <button
                            onClick={() => openEditModal(u.current_membership)}
                            className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteMembership(u.current_membership.id)}
                            className="px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ──────────────────────────────────────────────
           1. CHOICE MODAL: Add to Committee
      ────────────────────────────────────────────── */}
      {showAddChoiceModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-8 text-center">Add Member to Committee</h2>

            <div className="space-y-5">
              <button
                onClick={() => {
                  setShowAddChoiceModal(false);
                  setShowAddExistingModal(true);
                }}
                className="w-full p-6 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-700 rounded-xl text-left transition"
              >
                <div className="font-semibold text-xl mb-1">Add from existing users</div>
                <div className="text-gray-700 dark:text-gray-300">
                  Select someone already registered in the system
                </div>
              </button>

              <button
                onClick={() => {
                  setShowAddChoiceModal(false);
                  setShowAddNewUserModal(true);
                }}
                className="w-full p-6 bg-green-50 hover:bg-green-100 dark:bg-green-950/40 dark:hover:bg-green-900/60 border border-green-200 dark:border-green-700 rounded-xl text-left transition"
              >
                <div className="font-semibold text-xl mb-1">Create and add new user</div>
                <div className="text-gray-700 dark:text-gray-300">
                  Register a new person and assign to committee
                </div>
              </button>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowAddChoiceModal(false)}
                className="px-8 py-3 bg-gray-200 dark:bg-slate-700 rounded-xl hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────
           2. MODAL: Add EXISTING user
      ────────────────────────────────────────────── */}
      {showAddExistingModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Add Existing User to Committee</h2>

            <div className="space-y-6">
              {/* User selection */}
              <div>
                <label className="block mb-2 text-sm font-medium">Select User</label>
                <select
                  value={existingForm.user_id}
                  onChange={(e) => setExistingForm({ ...existingForm, user_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">— Choose user —</option>
                  {usersNotInCommittee.length === 0 ? (
                    <option disabled>No available users</option>
                  ) : (
                    usersNotInCommittee.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} — {u.email}
                      </option>
                    ))
                  )}
                </select>
                {usersNotInCommittee.length === 0 && (
                  <p className="text-sm text-amber-600 mt-2">
                    All current users are already in this year's committee
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block mb-2 text-sm font-medium">Committee Role</label>
                <select
                  value={existingForm.role_id}
                  onChange={(e) => setExistingForm({ ...existingForm, role_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} {r.is_president ? '(President)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block mb-2 text-sm font-medium">Committee Year</label>
                <input
                  type="number"
                  value={existingForm.year}
                  onChange={(e) => setExistingForm({ ...existingForm, year: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="2000"
                  max="2100"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <button
                onClick={() => setShowAddExistingModal(false)}
                className="flex-1 py-3 bg-gray-200 dark:bg-slate-700 rounded-xl hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExistingUser}
                disabled={!existingForm.user_id || !existingForm.role_id}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign to Committee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────
           3. MODAL: Create NEW user
      ────────────────────────────────────────────── */}
      {showAddNewUserModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Create New Committee Member</h2>

            <div className="space-y-5">
              <div>
                <label className="block mb-1 text-sm font-medium">Full Name *</label>
                <input
                  type="text"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                  placeholder="e.g. Md. Farid Hossen"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Email *</label>
                <input
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                  placeholder="example@cseku.ac.bd"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Password *</label>
                <input
                  type="password"
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                  placeholder="••••••••••"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Role *</label>
                <select
                  value={newUserForm.role_id}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role_id: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                >
                  <option value="">Select Role</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} {r.is_president ? '(President)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Year</label>
                <input
                  type="number"
                  value={newUserForm.year}
                  onChange={(e) => setNewUserForm({ ...newUserForm, year: Number(e.target.value) })}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <button
                onClick={() => setShowAddNewUserModal(false)}
                className="flex-1 py-3 bg-gray-200 dark:bg-slate-700 rounded-xl hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewUser}
                disabled={
                  !newUserForm.name ||
                  !newUserForm.email ||
                  !newUserForm.password ||
                  !newUserForm.role_id
                }
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create & Add to Committee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────
           4. MODAL: Edit Membership (Change Role / Year)
      ────────────────────────────────────────────── */}
      {showEditMembershipModal && selectedMembership && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Edit Committee Membership</h2>

            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium">Member</label>
                <input
                  type="text"
                  value={selectedMembership.user_name || selectedMembership.user_email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-100 dark:bg-slate-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">New Role *</label>
                <select
                  value={editForm.role_id}
                  onChange={(e) => setEditForm({ ...editForm, role_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} {r.is_president ? '(President)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Committee Year</label>
                <input
                  type="number"
                  value={editForm.year}
                  onChange={(e) => setEditForm({ ...editForm, year: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="2000"
                  max="2100"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <button
                onClick={() => setShowEditMembershipModal(false)}
                className="flex-1 py-3 bg-gray-200 dark:bg-slate-700 rounded-xl hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateMembership}
                disabled={!editForm.role_id}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Membership
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Creation Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Create New Role</h2>

            <div className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium">Role Name *</label>
                <input
                  type="text"
                  value={roleForm.name}
                  onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                  placeholder="e.g. Vice President"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={roleForm.is_president}
                  onChange={(e) => setRoleForm({ ...roleForm, is_president: e.target.checked })}
                />
                <span className="text-sm font-medium">Is President (Super Admin)</span>
              </label>

              <div>
                <label className="block mb-2 text-sm font-medium">Permissions</label>
                <select
                  multiple
                  value={roleForm.permissions_ids}
                  onChange={(e) =>
                    setRoleForm({
                      ...roleForm,
                      permissions_ids: Array.from(e.target.selectedOptions, (opt) => opt.value),
                    })
                  }
                  className="w-full h-40 px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                >
                  {pages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Hold Ctrl / Cmd to select multiple</p>
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Perform Committee Handover</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">New Committee Year</label>
                <input
                  type="number"
                  value={handoverForm.new_year}
                  onChange={(e) => setHandoverForm({ ...handoverForm, new_year: Number(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">New President</label>
                <select
                  value={handoverForm.new_president_id}
                  onChange={(e) => setHandoverForm({ ...handoverForm, new_president_id: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                >
                  <option value="">Select new President</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={handoverForm.archive_old}
                  onChange={(e) => setHandoverForm({ ...handoverForm, archive_old: e.target.checked })}
                />
                <span>Archive previous committee to Alumni</span>
              </label>
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
      <UserDetailModal
        userId={selectedUserId}
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setSelectedUserId(null);
        }}
      />
    </div>
  );
}