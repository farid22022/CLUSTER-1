// src/api.js
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

api.interceptors.response.use((response) => response, async (error) => {
  if (error.response.status === 401) {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        const { data } = await axios.post(API_BASE + 'auth/refresh/', { refresh: refreshToken });
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
});


export const register = (data) => api.post('auth/register/', data);
export const verifyOTP = (data) => api.post('auth/verify-otp/', data);

export const login = (email, password) => api.post('auth/login/', { email, password });
export const logout = () => api.post('auth/logout/');
  
export const getProjects = () => api.get('projects/');
export const createProject = (data) => api.post('projects/', data);
export const updateProject = (id, data) => api.patch(`projects/${id}/`, data);
export const deleteProject = (id) => api.delete(`projects/${id}/`);
export const approveProject = id => api.post(`projects/${id}/approve/`);
export const rejectProject  = id => api.post(`projects/${id}/reject/`);


export const getAlumni = () => api.get('alumni/');
export const createAlumni = (data) => api.post('alumni/', data);
export const updateAlumni = (id, data) => api.patch(`alumni/${id}/`, data);
export const deleteAlumni = (id) => api.delete(`alumni/${id}/`);

export const getTeamMembers = () => api.get('team-members/');
export const createTeamMember = (data) => api.post('team-members/', data);
export const updateTeamMember = (id, data) => api.patch(`team-members/${id}/`, data);
export const deleteTeamMember = (id) => api.delete(`team-members/${id}/`);

// FAQs 
export const getFAQs    = () => api.get('faqs/')
export const createFAQ  = data => api.post('faqs/', data);
export const updateFAQ  = (id, data) => api.put(`faqs/${id}/`, data);
export const deleteFAQ  = id => api.delete(`faqs/${id}/`);

export const getBlogs = () => api.get('blogs/');
export const createBlog = (data) => api.post('blogs/', data);
export const updateBlog = (id, data) => api.patch(`blogs/${id}/`, data);
export const deleteBlog = (id) => api.delete(`blogs/${id}/`);
export const approveBlog = id => api.post(`blogs/${id}/approve/`);
export const rejectBlog  = id => api.post(`blogs/${id}/reject/`);

export const getResources = () => api.get('resources/');
export const createResource = (data) => api.post('resources/', data);
export const updateResource = (id, data) => api.patch(`resources/${id}/`, data);
export const deleteResource = (id) => api.delete(`resources/${id}/`);
export const approveResource = (id) => api.post(`resources/${id}/approve/`);
export const rejectResource = (id) => api.post(`resources/${id}/reject/`);


export const getEvents = () => api.get('events/');
export const createEvent = (data) => api.post('events/', data);
export const updateEvent = (id, data) => api.patch(`events/${id}/`, data);
export const deleteEvent = (id) => api.delete(`events/${id}/`);

export const getSuccessStories = () => api.get('success-stories/');
export const createSuccessStory = (data) => api.post('success-stories/', data);
export const updateSuccessStory = (id, data) => api.patch(`success-stories/${id}/`, data);
export const deleteSuccessStory = (id) => api.delete(`success-stories/${id}/`);

export const getAdmins = () => api.get('users/');
export const createAdmin = (data) => api.post('users/', data);
export const updateAdmin = (id, data) => api.patch(`users/${id}/`, data);
export const deleteAdmin = (id) => api.delete(`users/${id}/`);
export const getProfile = () => api.get('users/profile/');
export const updateProfile = (data) => api.patch('users/profile/', data);

// For assigning pages
export const assignPages = (userId, pageIds) => api.post('pages/assign/', { user_id: userId, page_ids: pageIds });
export const getPages = () => api.get('pages/');


export const getPosts       = () => api.get('posts/');
export const getPostById    = (id) => api.get(`posts/${id}/`);
export const createPost     = (data) => api.post('posts/', data);
export const updatePost     = (id, data) => api.patch(`posts/${id}/`, data);
export const deletePost     = (id) => api.delete(`posts/${id}/`);