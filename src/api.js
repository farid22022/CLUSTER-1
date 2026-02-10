
// import axios from 'axios';

// const API_BASE = 'http://127.0.0.1:8000/api/';

// const api = axios.create({
//   baseURL: API_BASE,
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('access_token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => Promise.reject(error));

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       const refreshToken = localStorage.getItem('refresh_token');
//       if (refreshToken) {
//         try {
//           const { data } = await axios.post(`${API_BASE}auth/refresh/`, { refresh: refreshToken });
//           localStorage.setItem('access_token', data.access);
//           error.config.headers.Authorization = `Bearer ${data.access}`;
//           return api(error.config);
//         } catch (refreshError) {
//           console.error('Refresh token failed', refreshError);
//           localStorage.clear();
//           window.location.href = '/login';
//         }
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// // ────────────────────────────────────────────────
// // Auth
// // ────────────────────────────────────────────────
// export const register       = (data) => api.post('auth/register/', data);
// export const verifyOTP      = (data) => api.post('auth/verify-otp/', data);
// export const login          = (email, password) => api.post('auth/login/', { email, password });
// export const logout         = () => api.post('auth/logout/');

// // ────────────────────────────────────────────────
// // Users & Profile
// // ────────────────────────────────────────────────
// export const getUsers       = () => api.get('users/');
// export const getUserById    = (id) => api.get(`users/${id}/`);
// export const createUser     = (data) => api.post('users/', data);
// export const updateUser     = (id, data) => api.patch(`users/${id}/`, data);
// export const deleteUser     = (id) => api.delete(`users/${id}/`);

// export const getProfile     = () => api.get('users/me/');
// export const updateProfile  = (data) => api.patch('users/me/', data);

// // ────────────────────────────────────────────────
// // Roles & Committee Memberships
// // ────────────────────────────────────────────────
// export const getRoles           = () => api.get('roles/');
// export const createRole         = (data) => api.post('roles/', data);
// export const updateRole         = (id, data) => api.patch(`roles/${id}/`, data);
// export const deleteRole         = (id) => api.delete(`roles/${id}/`);

// export const getMemberships     = (year = '') => api.get(`memberships/${year ? `?year=${year}` : ''}`); // FIX THIS LINE
// export const createMembership   = (data) => api.post('memberships/', data);
// export const updateMembership   = (id, data) => api.patch(`memberships/${id}/`, data);
// export const deleteMembership   = (id) => api.delete(`memberships/${id}/`);

// // Handover (only current president)
// // export const performHandover    = () => api.post('handover/');

// // ────────────────────────────────────────────────
// // Bulk Committee Import
// // ────────────────────────────────────────────────
// export const importTeamMembers = (formData) => api.post('team-members/import/', formData, {
//   headers: { 'Content-Type': 'multipart/form-data' },
// });

// // ────────────────────────────────────────────────
// // Pages (used for role permissions)
// // ────────────────────────────────────────────────
// export const getPages = () => api.get('pages/');

// // ────────────────────────────────────────────────
// // Content endpoints (with optional year filter)
// // ────────────────────────────────────────────────
// const withYear = (endpoint, year = '') => year ? `${endpoint}?year=${year}` : endpoint;

// export const getProjects       = (year = '') => api.get(withYear('projects/', year));
// export const createProject     = (data) => api.post('projects/', data);
// export const updateProject     = (id, data) => api.patch(`projects/${id}/`, data);
// export const deleteProject     = (id) => api.delete(`projects/${id}/`);
// export const approveProject    = (id) => api.post(`projects/${id}/approve/`);
// export const rejectProject     = (id) => api.post(`projects/${id}/reject/`);

// export const getBlogs          = (year = '') => api.get(withYear('blogs/', year));
// export const createBlog        = (data) => api.post('blogs/', data);
// export const updateBlog        = (id, data) => api.patch(`blogs/${id}/`, data);
// export const deleteBlog        = (id) => api.delete(`blogs/${id}/`);
// export const approveBlog       = (id) => api.post(`blogs/${id}/approve/`);
// export const rejectBlog        = (id) => api.post(`blogs/${id}/reject/`);

// export const getResources      = (year = '') => api.get(withYear('resources/', year));
// export const createResource    = (data) => api.post('resources/', data);
// export const updateResource    = (id, data) => api.patch(`resources/${id}/`, data);
// export const deleteResource    = (id) => api.delete(`resources/${id}/`);
// export const approveResource   = (id) => api.post(`resources/${id}/approve/`);
// export const rejectResource    = (id) => api.post(`resources/${id}/reject/`);


// export const getEvents         = (year = '') => api.get(withYear('events/', year));
// export const createEvent       = (data) => api.post('events/', data);
// export const updateEvent       = (id, data) => api.patch(`events/${id}/`, data);
// export const deleteEvent       = (id) => api.delete(`events/${id}/`);

// export const getSuccessStories = (year = '') => api.get(withYear('success-stories/', year));
// export const createSuccessStory = (data) => api.post('success-stories/', data);
// export const updateSuccessStory = (id, data) => api.patch(`success-stories/${id}/`, data);
// export const deleteSuccessStory = (id) => api.delete(`success-stories/${id}/`);

// export const getFAQs           = (year = '') => api.get(withYear('faqs/', year));
// export const createFAQ         = (data) => api.post('faqs/', data);
// export const updateFAQ         = (id, data) => api.patch(`faqs/${id}/`, data);
// export const deleteFAQ         = (id) => api.delete(`faqs/${id}/`);

// export const getPosts          = (year = '') => api.get(withYear('posts/', year));
// export const getPostById       = (id) => api.get(`posts/${id}/`);
// export const createPost        = (data) => api.post('posts/', data);
// export const updatePost        = (id, data) => api.patch(`posts/${id}/`, data);
// export const deletePost        = (id) => api.delete(`posts/${id}/`);


// export const getAlumni         = (year = '') => api.get(withYear('alumni/', year));
// export const createAlumni      = (data) => api.post('alumni/', data);
// export const updateAlumni      = (id, data) => api.patch(`alumni/${id}/`, data);
// export const deleteAlumni      = (id) => api.delete(`alumni/${id}/`);

// export const getTeamMembers    = (year = '') => api.get(withYear('team-members/', year));
// export const createTeamMember  = (data) => api.post('team-members/', data);
// export const updateTeamMember  = (id, data) => api.patch(`team-members/${id}/`, data);
// export const deleteTeamMember  = (id) => api.delete(`team-members/${id}/`);



// // Handover (pass data)
// export const performHandover = (data) => api.post('handover/', data);  // { new_year, new_president_id, archive_old }

// api.js
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api/';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE}auth/refresh/`, { refresh: refreshToken });
          localStorage.setItem('access_token', data.access);
          error.config.headers.Authorization = `Bearer ${data.access}`;
          return api(error.config);
        } catch (refreshError) {
          console.error('Refresh token failed', refreshError);
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const register       = (data) => api.post('auth/register/', data);
export const verifyOTP      = (data) => api.post('auth/verify-otp/', data);
export const login          = (email, password) => api.post('auth/login/', { email, password });
export const logout         = () => api.post('auth/logout/');

// Users & Profile
export const getUsers       = () => api.get('users/');
export const getUserById    = (id) => api.get(`users/${id}/`);
export const createUser     = (data) => api.post('users/', data);
export const updateUser     = (id, data) => api.patch(`users/${id}/`, data);
export const deleteUser     = (id) => api.delete(`users/${id}/`);

export const getProfile     = () => api.get('users/me/');
export const updateProfile  = (data) => api.patch('users/me/', data);

// Roles & Committee Memberships
export const getRoles           = () => api.get('roles/');
export const createRole         = (data) => api.post('roles/', data);
export const updateRole         = (id, data) => api.patch(`roles/${id}/`, data);
export const deleteRole         = (id) => api.delete(`roles/${id}/`);

export const getMemberships     = (year = '') => api.get(`memberships/?year=${year}`);
export const createMembership   = (data) => api.post('memberships/', data);
export const updateMembership   = (id, data) => api.patch(`memberships/${id}/`, data);
export const deleteMembership   = (id) => api.delete(`memberships/${id}/`);

// Handover
export const performHandover    = (data) => api.post('handover/', data);

// Bulk Committee Import
export const importTeamMembers = (formData) => api.post('team-members/import/', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

// Pages (for role permissions)
export const getPages = () => api.get('pages/');

// Content endpoints (with optional year filter)
const withYear = (endpoint, year = '') => year ? `${endpoint}?year=${year}` : endpoint;

export const getProjects       = (year = '') => api.get(withYear('projects/', year));
export const createProject     = (data) => api.post('projects/', data);
export const updateProject     = (id, data) => api.patch(`projects/${id}/`, data);
export const deleteProject     = (id) => api.delete(`projects/${id}/`);

export const getBlogs          = (year = '') => api.get(withYear('blogs/', year));
export const createBlog        = (data) => api.post('blogs/', data);
export const updateBlog        = (id, data) => api.patch(`blogs/${id}/`, data);
export const deleteBlog        = (id) => api.delete(`blogs/${id}/`);

export const getResources      = (year = '') => api.get(withYear('resources/', year));
export const createResource    = (data) => api.post('resources/', data);
export const updateResource    = (id, data) => api.patch(`resources/${id}/`, data);
export const deleteResource    = (id) => api.delete(`resources/${id}/`);

export const getEvents         = () => api.get('events/');
export const createEvent       = (data) => api.post('events/', data);
export const updateEvent       = (id, data) => api.patch(`events/${id}/`, data);
export const deleteEvent       = (id) => api.delete(`events/${id}/`);

export const getSuccessStories = (year = '') => api.get(withYear('success-stories/', year));
export const createSuccessStory = (data) => api.post('success-stories/', data);
export const updateSuccessStory = (id, data) => api.patch(`success-stories/${id}/`, data);
export const deleteSuccessStory = (id) => api.delete(`success-stories/${id}/`);

export const getFAQs           = (year = '') => api.get(withYear('faqs/', year));
export const createFAQ         = (data) => api.post('faqs/', data);
export const updateFAQ         = (id, data) => api.patch(`faqs/${id}/`, data);
export const deleteFAQ         = (id) => api.delete(`faqs/${id}/`);

export const getPosts          = (year = '') => api.get(withYear('posts/', year));
export const getPostById       = (id) => api.get(`posts/${id}/`);
export const createPost        = (data) => api.post('posts/', data);
export const updatePost        = (id, data) => api.patch(`posts/${id}/`, data);
export const deletePost        = (id) => api.delete(`posts/${id}/`);

export const getAlumni         = (year = '') => api.get(withYear('alumni/', year));
export const createAlumni      = (data) => api.post('alumni/', data);
export const updateAlumni      = (id, data) => api.patch(`alumni/${id}/`, data);
export const deleteAlumni      = (id) => api.delete(`alumni/${id}/`);

export const getTeamMembers    = (year = '') => api.get(withYear('team-members/', year));
export const createTeamMember  = (data) => api.post('team-members/', data);
export const updateTeamMember  = (id, data) => api.patch(`team-members/${id}/`, data);
export const deleteTeamMember  = (id) => api.delete(`team-members/${id}/`);

// Near the content endpoints section
export const approveProject    = (id) => api.post(`projects/${id}/approve/`);
export const rejectProject     = (id) => api.post(`projects/${id}/reject/`);
export const approveBlog       = (id) => api.post(`blogs/${id}/approve/`);
export const rejectBlog        = (id) => api.post(`blogs/${id}/reject/`);
export const approveResource   = (id) => api.post(`resources/${id}/approve/`);
export const rejectResource    = (id) => api.post(`resources/${id}/reject/`);