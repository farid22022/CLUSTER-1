import  { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProfile, updateProfile } from '../../api';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  GraduationCap,
  Shield,
  CheckCircle,
  Edit2,
  Save,
  X,
  Camera,
  Briefcase,
  Globe,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await getProfile();
      setProfile(data);
      setEditedProfile(data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Unable to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedProfile(profile); // Reset changes
      setNewPassword('');
      setConfirmPassword('');
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Prepare update data
      const updateData = { ...editedProfile };
      
      // Only include password if both fields are filled and match
      if (newPassword && confirmPassword && newPassword === confirmPassword) {
        updateData.password = newPassword;
      } else if (newPassword || confirmPassword) {
        showNotification('error', 'Passwords do not match');
        setSaving(false);
        return;
      }
      
      await updateProfile(updateData);
      setProfile(editedProfile);
      setIsEditing(false);
      setNewPassword('');
      setConfirmPassword('');
      showNotification('success', 'Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      showNotification('error', 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'STUDENT': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ADMIN': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-800">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
            <X className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Profile</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchProfile}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white mt-8">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg border ${
              notification.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center gap-3">
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <X className="w-5 h-5" />
              )}
              <span className="font-medium">{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-6"
              >
                <div className="relative">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    {profile.photo ? (
                      <img
                        src={profile.photo}
                        alt={profile.name}
                        className="w-full h-full rounded-2xl object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-white">
                        {getInitials(profile.name)}
                      </span>
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors">
                      <Camera className="w-5 h-5 text-white" />
                    </button>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.name || ''}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="bg-transparent border-b border-white/50 focus:border-white outline-none text-3xl font-bold w-full md:w-auto"
                          placeholder="Enter your name"
                        />
                      ) : (
                        profile.name
                      )}
                    </h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(profile?.role)}`}>
                      {profile?.role_display}
                    </span>
                  </div>
                  <p className="text-blue-200 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Student ID: {profile.student_id}
                  </p>
                </div>
              </motion.div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedProfile.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="bg-transparent border-b border-white/50 focus:border-white outline-none text-sm w-48"
                        placeholder="Enter email"
                      />
                    ) : (
                      profile.email
                    )}
                  </span>
                </div>
                
                {profile.phone_number && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedProfile.phone_number || ''}
                          onChange={(e) => handleInputChange('phone_number', e.target.value)}
                          className="bg-transparent border-b border-white/50 focus:border-white outline-none text-sm w-36"
                          placeholder="Enter phone"
                        />
                      ) : (
                        profile.phone_number
                      )}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Joined {formatDate(profile.date_joined)}</span>
                </div>
                
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Status: {profile.is_active ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEditToggle}
                className={`px-5 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 ${
                  isEditing
                    ? 'bg-white/20 text-white hover:bg-white/30'
                    : 'bg-white text-blue-700 hover:bg-gray-100'
                } transition-colors`}
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4" />
                    Cancel Edit
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </>
                )}
              </motion.button>
              
              {isEditing && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-shadow disabled:opacity-70"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Account Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Account Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">User ID</span>
                  <span className="font-mono font-medium text-gray-900">{profile.id}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Account Status</span>
                  <span className={`flex items-center gap-2 font-medium ${
                    profile.is_active ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {profile.is_active ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Active
                      </>
                    ) : 'Inactive'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">{formatDate(profile.date_joined)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Role</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(profile.role)}`}>
                    {profile?.current_membership?.role?.name || 'User'}
                  </span>
                </div>
                  <div>
                  <button 
                    onClick={() => navigate('/activity')}
                    className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    My Activity
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Assigned Pages */}
            {profile.assigned_pages && profile.assigned_pages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Assigned Pages
                </h3>
                <div className="space-y-2">
                  {profile.assigned_pages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">{page}</span>
                      <Globe className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Profile Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Details</h3>
                
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedProfile.name || ''}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Enter your full name"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-xl">
                            <p className="text-gray-900">{profile.name}</p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Student ID
                        </label>
                        <div className="px-4 py-3 bg-gray-50 rounded-xl">
                          <p className="text-gray-900 font-mono">{profile.student_id}</p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={editedProfile.email || ''}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Enter email address"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-xl">
                            <p className="text-gray-900">{profile.email}</p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editedProfile.phone_number || ''}
                            onChange={(e) => handleInputChange('phone_number', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Enter phone number"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-xl">
                            <p className="text-gray-900">{profile.phone_number || 'Not provided'}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Password Change Section (Only when editing) */}
                  {isEditing && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Change Password
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-12"
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showPassword ? (
                                <Users className="w-5 h-5" />
                              ) : (
                                <Users className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                          </label>
                          <input
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-3">
                        Leave blank if you don&apos;t want to change your password
                      </p>
                    </div>
                  )}

                  {/* Account Status */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Account Status
                    </h4>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-700">Your account is currently</p>
                          <p className={`text-lg font-bold ${
                            profile.is_active ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {profile.is_active ? 'Active' : 'Inactive'}
                          </p>
                        </div>
                        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                          profile.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {profile.is_active ? '✓ Verified' : '✗ Not Active'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Member Since */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Membership Details
                    </h4>
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <p className="text-gray-700 mb-2">You joined CLUSTER on</p>
                      <p className="text-xl font-bold text-blue-700">
                        {formatDate(profile.date_joined)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-end gap-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleEditToggle}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow disabled:opacity-70 flex items-center gap-2"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            Save All Changes
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEditToggle}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow flex items-center gap-2"
                    >
                      <Edit2 className="w-5 h-5" />
                      Edit Profile Information
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;