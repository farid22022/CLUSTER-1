// src/utils/projectUtils.js

/**
 * Check if a project is approved (publicly visible on frontend)
 * 
 * Primary logic uses the `approval_status` field.
 * Fallbacks are included in case the field is missing in older data.
 */
export const isProjectApproved = (project) => {
  // Most reliable check — the approval_status field from backend
  if (project.approval_status !== undefined) {
    return project.approval_status === 'approved';
  }

  // Very old fallback — if you ever used is_visible or similar
  if (project.is_visible !== undefined) {
    return project.is_visible === true;
  }

  // Default: hide project if status is missing/unknown
  return false;
};

/**
 * Filter and sort only approved projects
 * → used on public pages (project list, gallery, homepage showcase, etc.)
 */
export const getApprovedProjects = (projects = []) => {
  return projects
    .filter(isProjectApproved)
    .sort((a, b) => {
      // Most common sort: newest first (by created_at or updated_at)
      const dateA = new Date(b.updated_at || b.created_at || 0);
      const dateB = new Date(a.updated_at || a.created_at || 0);
      return dateA - dateB;
    });
};

/**
 * Get only pending projects
 * → typically used in admin dashboard
 */
export const getPendingProjects = (projects = []) => {
  return projects.filter(p => p.approval_status === 'pending');
};

/**
 * Get only rejected projects
 * → useful in admin interface (history, statistics)
 */
export const getRejectedProjects = (projects = []) => {
  return projects.filter(p => p.approval_status === 'rejected');
};

/**
 * Get projects by approval status
 * @param {Array} projects
 * @param {'approved' | 'pending' | 'rejected'} status
 */
export const getProjectsByStatus = (projects = [], status) => {
  if (!['approved', 'pending', 'rejected'].includes(status)) {
    return [];
  }
  return projects.filter(p => p.approval_status === status);
};

/**
 * Optional: Get approved projects from a specific domain
 */
export const getApprovedProjectsByDomain = (projects = [], domain) => {
  return getApprovedProjects(projects).filter(p => 
    p.domain && p.domain.toLowerCase() === domain.toLowerCase()
  );
};

/**
 * Optional: Get latest N approved projects
 */
export const getLatestApprovedProjects = (projects = [], limit = 6) => {
  return getApprovedProjects(projects).slice(0, limit);
};