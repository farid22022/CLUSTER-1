// // // src/pages/dashboard/AdminDetail.jsx
// // import { useState, useEffect } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { motion } from 'framer-motion';
// // import {
// //   ArrowLeft, Shield, Users, UserCheck, Mail, Calendar, Globe,
// //   Lock, CheckCircle, XCircle, Edit3
// // } from 'lucide-react';
// // import Swal from 'sweetalert2';
// // import { getAdmins } from '../../../api';  

// // const roleDisplayMap = {
// //   SUPER_ADMIN:   'Super Admin',
// //   ADMIN:         'Admin',
// //   LAYERED_ADMIN: 'Layered Admin',
// // };

// // const getRoleColor = (role) => ({
// //   SUPER_ADMIN:   'from-blue-600 to-indigo-700',
// //   ADMIN:         'from-blue-600 to-cyan-700',
// //   LAYERED_ADMIN: 'from-green-600 to-teal-700',
// // }[role] || 'from-gray-600 to-gray-700');

// // const getRoleIcon = (role) => ({
// //   SUPER_ADMIN:   <Shield className="w-7 h-7" />,
// //   ADMIN:         <Users className="w-7 h-7" />,
// //   LAYERED_ADMIN: <UserCheck className="w-7 h-7" />,
// // }[role] || null);

// // export default function AdminDetail() {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const [admin, setAdmin] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const fetchAdmin = async () => {
// //       try {
// //         setLoading(true);
// //         const res = await getAdmins(); // temporary – get all & filter
// //         const found = res.data.find(u => u.id === Number(id));
        
// //         if (!found) {
// //           setError('Administrator not found');
// //           return;
// //         }

// //         setAdmin({
// //           ...found,
// //           displayRole: roleDisplayMap[found.role] || found.role,
// //           date_joined_formatted: found.date_joined 
// //             ? new Date(found.date_joined).toLocaleDateString('en-US', {
// //                 year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
// //               })
// //             : '—'
// //         });
// //       } catch (err) {
// //         console.error(err);
// //         setError('Failed to load administrator details');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchAdmin();
// //   }, [id]);

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen">
// //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
// //       </div>
// //     );
// //   }

// //   if (error || !admin) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center p-6">
// //         <div className="text-center">
// //           <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
// //           <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Administrator not found'}</p>
// //           <button
// //             onClick={() => navigate('/dashboard/admins')}
// //             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
// //           >
// //             Back to Admins List
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <motion.div
// //       initial={{ opacity: 0, y: 20 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 md:p-10"
// //     >
// //       <div className="max-w-5xl mx-auto">
// //         {/* Header */}
// //         <div className="flex items-center justify-between mb-8">
// //           <button
// //             onClick={() => navigate(-1)}
// //             className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
// //           >
// //             <ArrowLeft size={20} />
// //             Back to list
// //           </button>
          
// //           <button
// //             onClick={() => {/* open edit modal or navigate to edit */}}
// //             className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition"
// //           >
// //             <Edit3 size={18} />
// //             Edit Admin
// //           </button>
// //         </div>

// //         {/* Main Card */}
// //         <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-slate-700">
// //           {/* Gradient top bar */}
// //           <div className={`h-3 bg-gradient-to-r ${getRoleColor(admin.role)}`} />

// //           <div className="p-8 md:p-10">
// //             {/* Avatar & basic info */}
// //             <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
// //               <div className="relative">
// //                 <img
// //                   src={admin.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name)}&background=0D8ABC&color=fff&size=256`}
// //                   alt={admin.name}
// //                   className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-2xl"
// //                 />
// //                 <div className={`absolute -bottom-2 -right-2 p-2 rounded-full bg-gradient-to-br ${getRoleColor(admin.role)} text-white shadow-lg`}>
// //                   {getRoleIcon(admin.role)}
// //                 </div>
// //               </div>

// //               <div className="text-center md:text-left">
// //                 <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
// //                   {admin.name}
// //                 </h1>
// //                 <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
// //                   <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-sm font-medium bg-gradient-to-r ${getRoleColor(admin.role)}`}>
// //                     {getRoleIcon(admin.role)}
// //                     {admin.displayRole}
// //                   </span>
// //                 </div>
// //                 <p className="text-lg text-gray-600 dark:text-slate-300 flex items-center gap-2 justify-center md:justify-start">
// //                   <Mail size={18} />
// //                   {admin.email}
// //                 </p>
// //               </div>
// //             </div>

// //             {/* Details Grid */}
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// //               {/* Left column */}
// //               <div className="space-y-6">
// //                 <div className="bg-gray-50 dark:bg-slate-900/50 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
// //                   <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-slate-200 flex items-center gap-2">
// //                     <Calendar size={20} />
// //                     Account Information
// //                   </h3>
// //                   <dl className="space-y-4 text-sm">
// //                     <div>
// //                       <dt className="text-gray-500 dark:text-slate-400">Joined</dt>
// //                       <dd className="font-medium text-gray-900 dark:text-white mt-1">
// //                         {admin.date_joined_formatted}
// //                       </dd>
// //                     </div>
// //                     <div>
// //                       <dt className="text-gray-500 dark:text-slate-400">Status</dt>
// //                       <dd className="mt-1">
// //                         {admin.is_active ? (
// //                           <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium">
// //                             <CheckCircle size={16} /> Active
// //                           </span>
// //                         ) : (
// //                           <span className="inline-flex items-center gap-1.5 text-red-600 dark:text-red-400 font-medium">
// //                             <XCircle size={16} /> Inactive
// //                           </span>
// //                         )}
// //                       </dd>
// //                     </div>
// //                   </dl>
// //                 </div>
// //               </div>

// //               {/* Right column */}
// //               <div className="space-y-6">
// //                 {admin.role === 'LAYERED_ADMIN' && admin.assigned_pages_details?.length > 0 && (
// //                   <div className="bg-gray-50 dark:bg-slate-900/50 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
// //                     <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-slate-200 flex items-center gap-2">
// //                       <Globe size={20} />
// //                       Assigned Pages
// //                     </h3>
// //                     <ul className="space-y-2">
// //                       {admin.assigned_pages_details.map(page => (
// //                         <li key={page.id} className="flex items-center gap-3 text-gray-700 dark:text-slate-300">
// //                           <CheckCircle size={16} className="text-green-500" />
// //                           {page.name}
// //                         </li>
// //                       ))}
// //                     </ul>
// //                   </div>
// //                 )}
// //                 {admin.role.toUpperCase().replace(/ /g, '_') === 'LAYERED_ADMIN' && 
// //                     admin.assigned_pages_details?.length > 0 && (
// //                     <div className="flex items-start gap-3 text-gray-700 dark:text-slate-300">
// //                         <CheckCircle size={18} className="mt-0.5 text-green-500" />
// //                         <div>
// //                         <span className="font-medium">Assigned Pages:</span>
// //                         <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
// //                             {admin.assigned_pages_details.map(page => (
// //                             <li key={page.id}>{page.name}</li>
// //                             ))} 
// //                         </ul>
// //                         </div>
// //                     </div>
// //                     )}
                

// //                 <div className="bg-gray-50 dark:bg-slate-900/50 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
// //                   <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-slate-200 flex items-center gap-2">
// //                     <Lock size={20} />
// //                     Permissions
// //                   </h3>
// //                   <div className="grid grid-cols-2 gap-4 text-sm">
// //                     <div>
// //                       <span className="text-gray-500 dark:text-slate-400 block">Staff</span>
// //                       <span className={admin.is_staff ? "text-green-600 dark:text-green-400 font-medium" : "text-red-600 dark:text-red-400"}>
// //                         {admin.is_staff ? 'Yes' : 'No'}
// //                       </span>
// //                     </div>
// //                     <div>
// //                       <span className="text-gray-500 dark:text-slate-400 block">Superuser</span>
// //                       <span className={admin.is_superuser ? "text-green-600 dark:text-green-400 font-medium" : "text-red-600 dark:text-red-400"}>
// //                         {admin.is_superuser ? 'Yes' : 'No'}
// //                       </span>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </motion.div>
// //   );
// // }
// // src/pages/dashboard/AdminDetail.jsx
// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import {
//   ArrowLeft, Shield, Users, UserCheck, Mail, Calendar, Globe,
//   Lock, CheckCircle, XCircle, Edit, UserPlus
// } from 'lucide-react';
// import Swal from 'sweetalert2';
// import { getAdmins, transferSuperAdmin } from '../../../api';

// const roleDisplayMap = {
//   SUPER_ADMIN:   'Super Admin',
//   ADMIN:         'Admin',
//   LAYERED_ADMIN: 'Layered Admin',
//   STUDENT:       'Student',
// };

// const getRoleColor = (role) => ({
//   SUPER_ADMIN:   'from-blue-600 to-indigo-700',
//   ADMIN:         'from-blue-600 to-cyan-700',
//   LAYERED_ADMIN: 'from-green-600 to-teal-700',
//   STUDENT:       'from-gray-500 to-gray-700',
// }[role] || 'from-gray-600 to-gray-700');

// const getRoleIcon = (role) => ({
//   SUPER_ADMIN:   <Shield className="w-7 h-7" />,
//   ADMIN:         <Users className="w-7 h-7" />,
//   LAYERED_ADMIN: <UserCheck className="w-7 h-7" />,
//   STUDENT:       <Users className="w-7 h-7 opacity-60" />,
// }[role] || null);

// export default function AdminDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [admin, setAdmin] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // TODO: Replace with real auth context
//   const currentUserRole = 'SUPER_ADMIN'; // temporary
//   const isSuperAdmin = currentUserRole === 'SUPER_ADMIN';

//   useEffect(() => {
//     const fetchAdmin = async () => {
//       try {
//         setLoading(true);
//         const res = await getAdmins();
//         const found = res.data.find(u => u.id === Number(id));

//         if (!found) {
//           setError('Administrator not found');
//           return;
//         }

//         setAdmin({
//           ...found,
//           displayRole: roleDisplayMap[found.role] || found.role,
//           date_joined_formatted: found.date_joined
//             ? new Date(found.date_joined).toLocaleString('en-US', {
//                 year: 'numeric', month: 'long', day: 'numeric',
//                 hour: '2-digit', minute: '2-digit'
//               })
//             : '—'
//         });
//       } catch (err) {
//         console.error(err);
//         setError('Failed to load administrator details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAdmin();
//   }, [id]);

//   const handleTransferSuperAdmin = () => {
//     if (!admin || admin.role === 'SUPER_ADMIN') return;

//     Swal.fire({
//       title: 'Transfer Super Admin Role?',
//       html: `Are you sure you want to transfer <b>Super Admin</b> privileges to <b>${admin.name}</b>?<br/><br/>
//              <small>You will be downgraded to Admin role.</small>`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#10b981',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, Transfer',
//       cancelButtonText: 'Cancel'
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await transferSuperAdmin(admin.id);
//           Swal.fire({
//             icon: 'success',
//             title: 'Role Transferred',
//             text: 'You are now an Admin. Logging out...',
//             timer: 2500,
//             showConfirmButton: false
//           });
//           // Force logout
//           localStorage.clear();
//           navigate('/login');
//         } catch (err) {
//           Swal.fire({
//             icon: 'error',
//             title: 'Transfer Failed',
//             text: err.response?.data?.error || 'Something went wrong'
//           });
//         }
//       }
//     });
//   };

//   if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div></div>;

//   if (error || !admin) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-6">
//         <div className="text-center max-w-md">
//           <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
//           <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Administrator not found'}</p>
//           <button
//             onClick={() => navigate('/dashboard/admins')}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//           >
//             Back to Admins List
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 md:p-10"
//     >
//       <div className="max-w-6xl mx-auto">
//         <div className="flex items-center justify-between mb-8">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 transition"
//           >
//             <ArrowLeft size={20} /> Back
//           </button>

//           <div className="flex gap-4">
//             <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
//               <Edit size={18} /> Edit
//             </button>

//             {isSuperAdmin && admin.role !== 'SUPER_ADMIN' && (
//               <button
//                 onClick={handleTransferSuperAdmin}
//                 className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
//               >
//                 <UserPlus size={18} /> Transfer Super Admin
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Profile Card */}
//           <div className="lg:col-span-1">
//             <div className={`bg-gradient-to-br ${getRoleColor(admin.role)} rounded-2xl p-8 text-white shadow-2xl`}>
//               <div className="flex flex-col items-center text-center">
//                 {getRoleIcon(admin.role)}
//                 <h1 className="text-3xl font-bold mt-5">{admin.name}</h1>
//                 <p className="text-xl opacity-90 mt-1">{admin.displayRole}</p>

//                 {admin.photo ? (
//                   <img
//                     src={admin.photo}
//                     alt={admin.name}
//                     className="mt-8 w-40 h-40 rounded-full object-cover border-4 border-white/30 shadow-lg"
//                   />
//                 ) : (
//                   <div className="mt-8 w-40 h-40 rounded-full bg-white/20 flex items-center justify-center text-5xl font-bold">
//                     {admin.name.charAt(0)}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Details */}
//           <div className="lg:col-span-2 space-y-6">
//             <div className="bg-white dark:bg-slate-800 rounded-2xl p-7 shadow-xl border border-gray-200 dark:border-slate-700">
//               <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Basic Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-slate-400">Email</p>
//                   <p className="font-medium mt-1 flex items-center gap-2">
//                     <Mail size={16} className="text-gray-400" /> {admin.email}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-slate-400">Joined</p>
//                   <p className="font-medium mt-1 flex items-center gap-2">
//                     <Calendar size={16} className="text-gray-400" /> {admin.date_joined_formatted}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-slate-400">Student ID</p>
//                   <p className="font-medium mt-1">{admin.student_id || '—'}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-slate-400">Status</p>
//                   <p className="mt-1">
//                     {admin.is_active ? (
//                       <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium">
//                         <CheckCircle size={16} /> Active
//                       </span>
//                     ) : (
//                       <span className="inline-flex items-center gap-1.5 text-red-600 dark:text-red-400 font-medium">
//                         <XCircle size={16} /> Inactive
//                       </span>
//                     )}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Assigned Pages (Layered Admin only) */}
//             {admin.role === 'LAYERED_ADMIN' && admin.assigned_pages_details?.length > 0 && (
//               <div className="bg-white dark:bg-slate-800 rounded-2xl p-7 shadow-xl border border-gray-200 dark:border-slate-700">
//                 <h3 className="text-xl font-bold mb-5 text-gray-900 dark:text-white flex items-center gap-2">
//                   <Globe size={20} /> Assigned Pages
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {admin.assigned_pages_details.map(page => (
//                     <div key={page.id} className="p-4 bg-gray-50 dark:bg-slate-900/60 rounded-lg border border-gray-200 dark:border-slate-700">
//                       <div className="flex items-center gap-3">
//                         <CheckCircle size={18} className="text-green-500" />
//                         <span className="font-medium text-gray-800 dark:text-slate-200">{page.name}</span>
//                       </div>
//                       {page.description && (
//                         <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">{page.description}</p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Permissions Overview */}
//             <div className="bg-white dark:bg-slate-800 rounded-2xl p-7 shadow-xl border border-gray-200 dark:border-slate-700">
//               <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
//                 <Lock size={20} /> Permissions
//               </h3>
//               <div className="grid grid-cols-2 gap-8 text-center">
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">Staff Access</p>
//                   <p className={`text-2xl font-bold ${admin.is_staff ? 'text-green-600' : 'text-red-600'}`}>
//                     {admin.is_staff ? 'Yes' : 'No'}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">Superuser</p>
//                   <p className={`text-2xl font-bold ${admin.is_superuser ? 'text-green-600' : 'text-red-600'}`}>
//                     {admin.is_superuser ? 'Yes' : 'No'}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// src/pages/dashboard/AdminDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Shield, Mail, Calendar, Globe,
  Lock, CheckCircle, XCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import { getUserById } from '../../../api';

export default function AdminDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'User not found'}</p>
          <button
            onClick={() => navigate('/dashboard/users')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  const currentMembership = user.current_membership;
  const currentRole = currentMembership?.role;
  const isPresident = currentRole?.is_president;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6"
    >
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/dashboard/users')}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-8"
        >
          <ArrowLeft size={18} /> Back to Users
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl p-8 text-white shadow-xl ${
              isPresident
                ? 'bg-gradient-to-br from-blue-600 to-indigo-700'
                : 'bg-gradient-to-br from-indigo-600 to-purple-700'
            }`}>
              <div className="flex flex-col items-center text-center">
                <img
                  src={user.photo || 'https://via.placeholder.com/128?text=User'}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white/30 mb-6"
                />
                <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
                <p className="text-xl opacity-90 mb-4">
                  {currentRole?.name || 'No Role Assigned'}
                  {isPresident && <span className="ml-2 font-semibold">(President)</span>}
                </p>

                <div className="flex flex-col gap-3 text-sm opacity-90">
                  <p className="flex items-center justify-center gap-2">
                    <Mail size={16} /> {user.email}
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <Calendar size={16} /> Joined {new Date(user.date_joined).toLocaleDateString()}
                  </p>
                  {user.student_id && (
                    <p>Student ID: {user.student_id}</p>
                  )}
                </div>

                <div className="mt-6">
                  {user.is_active ? (
                    <span className="inline-flex items-center gap-2 bg-white/20 px-4 py-1 rounded-full">
                      <CheckCircle size={16} /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 bg-red-500/30 px-4 py-1 rounded-full">
                      <XCircle size={16} /> Inactive
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Role & Permissions */}
            {currentMembership && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-7 shadow border border-gray-200 dark:border-slate-700">
                <h3 className="text-xl font-bold mb-5 flex items-center gap-3">
                  <Shield size={20} /> Current Committee Role ({currentMembership.year})
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Role</p>
                    <p className="font-medium text-lg">{currentRole.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Permissions</p>
                    {currentRole.permissions?.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {currentRole.permissions.map(p => (
                          <span
                            key={p.id}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                          >
                            {p.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-slate-400 italic">No specific page permissions</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Membership History */}
            {user.memberships?.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-7 shadow border border-gray-200 dark:border-slate-700">
                <h3 className="text-xl font-bold mb-5 flex items-center gap-3">
                  <Calendar size={20} /> Committee History
                </h3>
                <div className="space-y-4">
                  {user.memberships.map((m, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{m.role.name}</p>
                          <p className="text-sm text-gray-500 dark:text-slate-400">Year: {m.year}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-slate-600 rounded">
                          {new Date(m.assigned_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}