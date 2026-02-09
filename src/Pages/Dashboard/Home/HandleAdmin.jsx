
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
} from '../../../api';
import { useNavigate } from 'react-router-dom';

export default function HandleAdmin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
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

  useEffect(() => {
    loadData();
  }, []);

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
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={archiveOld}
              onChange={e => setArchiveOld(e.target.checked)}
            />
            Archive previous year
          </label>
          <div>
            <input
              type="file"
              accept=".csv"
              onChange={e => setImportFile(e.target.files[0])}
              className="hidden"
              id="import-csv"
            />
            <label
              htmlFor="import-csv"
              className="px-4 py-2 bg-gray-200 dark:bg-slate-700 rounded-lg cursor-pointer hover:bg-gray-300"
            >
              Select CSV
            </label>
          </div>
          <button
            onClick={handleImport}
            disabled={importing || !importFile}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {importing ? <Loader2 className="animate-spin" /> : 'Import'}
          </button>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="animate-spin mx-auto h-10 w-10 text-blue-600" />
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl shadow border dark:border-slate-700">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-slate-700">
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
    </div>
  );
}