// src/utils/resourceUtils.js

/**
 * Check if a resource is publicly visible (approved)
 * Primary check uses approval_status field.
 * @param {Object} resource - The resource object
 * @returns {boolean} - true if visible to public
 */
export const isResourceVisible = (resource) => {
  // Main check — backend-controlled approval status
  if (resource?.approval_status !== undefined) {
    return resource.approval_status === 'approved';
  }

  // Fallback for legacy data (if any)
  if (resource?.is_visible !== undefined) {
    return !!resource.is_visible;
  }

  // Default: not visible if status is missing/unknown
  return false;
};

/**
 * Get only visible (approved) resources — use this on public pages
 * Sorted by most recent first (newest updated or created)
 * @param {Array} resources - Array of resource objects
 * @returns {Array} - Filtered and sorted visible resources
 */
export const getVisibleResources = (resources = []) => {
  return resources
    .filter(isResourceVisible)
    .sort((a, b) => {
      const dateA = new Date(b.updated_at || b.created_at || 0);
      const dateB = new Date(a.updated_at || a.created_at || 0);
      return dateA - dateB; // newest first
    });
};

/**
 * Get only pending resources — useful for admin review
 * @param {Array} resources - Array of resource objects
 * @returns {Array} - Resources with approval_status = 'pending'
 */
export const getPendingResources = (resources = []) => {
  return resources.filter(r => r.approval_status === 'pending');
};

/**
 * Get only rejected resources — useful for admin history/audit
 * @param {Array} resources - Array of resource objects
 * @returns {Array} - Resources with approval_status = 'rejected'
 */
export const getRejectedResources = (resources = []) => {
  return resources.filter(r => r.approval_status === 'rejected');
};

/**
 * Get resources filtered by approval status
 * @param {Array} resources - Array of resource objects
 * @param {'approved'|'pending'|'rejected'} status - Desired status
 * @returns {Array} - Filtered resources
 */
export const getResourcesByStatus = (resources = [], status) => {
  if (!['approved', 'pending', 'rejected'].includes(status)) {
    return [];
  }
  return resources.filter(r => r.approval_status === status);
};

/**
 * Get visible (approved) resources from a specific category
 * @param {Array} resources - Array of resource objects
 * @param {string} category - Category name (case-insensitive)
 * @returns {Array} - Matching visible resources
 */
export const getVisibleResourcesByCategory = (resources = [], category) => {
  if (!category) return getVisibleResources(resources);

  const lowerCategory = category.toLowerCase();
  return getVisibleResources(resources).filter(
    r => r.category?.toLowerCase() === lowerCategory
  );
};

/**
 * Get the most recent N visible resources (e.g. for homepage showcase)
 * @param {Array} resources - Array of resource objects
 * @param {number} limit - Maximum number to return (default 6)
 * @returns {Array} - Latest visible resources
 */
export const getLatestVisibleResources = (resources = [], limit = 6) => {
  return getVisibleResources(resources).slice(0, limit);
};