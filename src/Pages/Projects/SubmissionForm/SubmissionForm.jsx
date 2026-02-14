
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX, FiSend, FiBookOpen, FiImage, FiVideo, FiChevronDown
} from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { createProject } from '../../../api';


import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "@fontsource/noto-sans-bengali";

const SubmissionForm = ({ onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    team: '',
    github: '',
    demoLink: '',
    domain: '',
    status: 'Ongoing',
    year: new Date().getFullYear().toString(),
    studentId: '',
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  const imageWidgetRef = useRef(null);
  const videoWidgetRef = useRef(null);

  const cloudName = "dvpbeekmy";
  const uploadPreset = "project_submit";

  const domains = [
    'AI/ML', 'Web Development', 'Mobile Apps',
    'IoT', 'Blockchain', 'Data Science',
    'Cybersecurity', 'Cloud Computing'
  ];

  useEffect(() => {
    if (!window.cloudinary) {
      console.error("Cloudinary widget script not loaded. Add <script src='https://upload-widget.cloudinary.com/global/all.js' type='text/javascript'></script> to index.html");
      return;
    }

    // Shared widget config (works for both image & video with one preset)
    const widgetConfig = {
      cloudName,
      uploadPreset,
      sources: ["local", "url", "camera", "dropbox", "google_drive"],
      folder: "projects", // optional
      styles: {
        palette: {
          window: "#FFFFFF",
          sourceBg: "#f4f4f5",
          windowBorder: "#90a0b3",
          tabIcon: "#000000",
          inactiveTabIcon: "#555a5f",
          menuIcons: "#555a5f",
          link: "#37474F",
          action: "#339933",
          inProgress: "#0433ff",
          complete: "#339933",
          error: "#cc0000",
          textDark: "#000000",
          textLight: "#fcfffd"
        }
      }
    };

    // Image widget - multiple
    imageWidgetRef.current = window.cloudinary.createUploadWidget(
      {
        ...widgetConfig,
        multiple: true,
        maxFiles: 8,
        resourceType: "image",
        clientAllowedFormats: ["png", "jpg", "jpeg", "webp", "gif"],
      },
      (error, result) => {
        if (!error && result?.event === "success") {
          setImages(prev => [
            ...prev,
            {
              url: result.info.secure_url,
              thumbnail: result.info.thumbnail_url || result.info.secure_url,
            }
          ]);
        }
      }
    );

    // Video widget - single
    videoWidgetRef.current = window.cloudinary.createUploadWidget(
      {
        ...widgetConfig,
        multiple: true,
        resourceType: "video",
        maxFiles: 3,
        clientAllowedFormats: ["mp4", "mov", "webm"],
        maxFileSize: 150 * 1024 * 1024, // 150MB example
      },
      (error, result) => {
        if (!error && result?.event === "success") {
          setVideos(prev => [...prev, result.info.secure_url]);
        }
      }
    );

    

    return () => {
      imageWidgetRef.current?.destroy();
      videoWidgetRef.current?.destroy();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (value) => {
    setFormData(prev => ({ ...prev, description: value }));
  };

  const openImageUpload = () => imageWidgetRef.current?.open();
  const openVideoUpload = () => videoWidgetRef.current?.open();

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  const removeVideo = (index) => {
      setVideos(prev => prev.filter((_, i) => i !== index));
    };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (images.length === 0) {
      setError("Please upload at least one project image.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        tech_stack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean),
        team: formData.team.split(',').map(s => s.trim()).filter(Boolean),
        github: formData.github?.trim() || null,

        // Changed / added fields
        demo_link: formData.demoLink?.trim() || null,           // renamed + kept as fallback
        videos: videos,                                         // ← array of video URLs
        images: images.map(img => img.url),                     // ← array of full image URLs

        domain: formData.domain || null,
        status: formData.status,
        year: formData.year,
        student_id: formData.studentId.trim(),
      };

      await createProject(payload);

      Swal.fire({
        icon: 'success',
        title: 'Submitted!',
        text: 'Your project has been submitted and is pending review.',
        timer: 4000,
        showConfirmButton: false
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to submit project.';
      setError(msg);
      Swal.fire('Error', msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div className="absolute inset-0 bg-black bg-opacity-60" onClick={onClose} />

        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-10 overflow-hidden"
          initial={{ scale: 0.9, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-white">
              <FiX size={24} />
            </button>
            <h3 className="text-2xl font-bold text-white">Submit Your Project</h3>
            <p className="text-blue-100 mt-1">CLUSTER Project Submission</p>
          </div>

          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Title */}
              <div>
                <label className="flex items-center font-medium text-gray-700 mb-1">
                  <FiBookOpen className="mr-2 text-blue-600" />
                  Project Title <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Smart Farming IoT System"
                />
              </div>

              {/* Description */}
              <div>
                <label className="font-medium text-gray-700 mb-1 block">
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    modules={quillModules}
                    className="min-h-[180px]"
                    placeholder="Describe your project in detail (Bangla supported)..."
                  />
                </div>
              </div>

              {/* Tech Stack + Team */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="font-medium text-gray-700 mb-1 block">Tech Stack</label>
                  <input
                    name="techStack"
                    placeholder="Python, Django, React, Arduino"
                    value={formData.techStack}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-medium text-gray-700 mb-1 block">Team Members</label>
                  <input
                    name="team"
                    placeholder="Azmain Enqauid, Rifat, Sumaiya"
                    value={formData.team}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Student ID + Domain */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="font-medium text-gray-700 mb-1 block">
                    Student ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 220222"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="relative">
                  <label className="font-medium text-gray-700 mb-1 block">
                    Domain <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="domain"
                    value={formData.domain}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white"
                  >
                    <option value="">Select Domain</option>
                    {domains.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-4 top-11 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* GitHub + Manual Demo Link */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="font-medium text-gray-700 mb-1 block">GitHub Link</label>
                  <input
                    name="github"
                    placeholder="https://github.com/username/repo"
                    value={formData.github}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-medium text-gray-700 mb-1 block">
                    Manual Demo / Video Link (optional)
                  </label>
                  <input
                    name="demoLink"
                    placeholder="https://youtube.com/... or external link"
                    value={formData.demoLink}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Video uploaded below will override this field
                  </p>
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="font-medium text-gray-700 mb-2 block flex items-center">
                  <FiImage className="mr-2 text-blue-600" />
                  Project Images (first one will be used) <span className="text-red-500 ml-1">*</span>
                </label>

                <button
                  type="button"
                  onClick={openImageUpload}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Upload Images
                </button>

                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img.thumbnail}
                          alt={`preview ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Videos – multiple */}
              <div>
                <label className="font-medium text-gray-700 mb-2 block flex items-center">
                  <FiVideo className="mr-2 text-purple-600" />
                  Project Demo Videos (optional – multiple allowed)
                </label>

                <button
                  type="button"
                  onClick={openVideoUpload}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                >
                  Upload Videos
                </button>

                {videos.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {videos.map((videoUrl, idx) => (
                      <div key={idx} className="relative group">
                        <video
                          src={videoUrl}
                          controls
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeVideo(idx)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-medium flex justify-center items-center disabled:opacity-60"
              >
                <FiSend className="mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit Project'}
              </motion.button>

              {error && <p className="text-red-600 text-center font-medium mt-2">{error}</p>}
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

SubmissionForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

export default SubmissionForm;