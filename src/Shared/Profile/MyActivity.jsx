import { useState, useEffect } from 'react';
import {
  getMyProjects,
  getMyBlogs,
  getMyResources,
  getMyEvents,
  getMyPosts,
  getMyAlumni,
} from '../../api';

const MyActivity = () => {
  const [data, setData] = useState({
    projects: [],
    blogs: [],
    resources: [],
    events: [],
    posts: [],
    alumni: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const loadMyContent = async () => {
      try {
        const [proj, blog, res, evt, post, alum] = await Promise.all([
          getMyProjects(),
          getMyBlogs(),
          getMyResources(),
          getMyEvents(),
          getMyPosts(),
          getMyAlumni(),
        ]);

        setData({
          projects: proj,
          blogs: blog,
          resources: res,
          events: evt,
          posts: post,
          alumni: alum,
        });
      } catch (err) {
        console.error('Failed to load your activity:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMyContent();
  }, []);

  // Calculate total contributions
  const totalContributions = Object.values(data).reduce(
    (acc, arr) => acc + arr.length,
    0
  );

  // Calculate counts by status
  const statusCounts = {
    approved: Object.values(data).flat().filter(item => item.approval_status === 'APPROVED').length,
    pending: Object.values(data).flat().filter(item => item.approval_status === 'PENDING').length,
    rejected: Object.values(data).flat().filter(item => item.approval_status === 'REJECTED').length,
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-indigo-200 rounded-full animate-ping opacity-75"></div>
            <div className="absolute inset-0 border-4 border-t-indigo-600 border-r-indigo-600 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 text-lg font-medium animate-pulse">
            Loading your contributions...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <div className="max-w-7xl pt-28 mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with enhanced summary cards */}
        <div className="mb-12 animate-fadeIn">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900 tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-indigo-600">
              My Activity
            </h1>
            <p className="text-lg text-gray-600">
              Track and manage all your contributions in one place
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total Contributions"
              value={totalContributions}
              icon="📊"
              gradient="from-indigo-500 to-blue-600"
              delay="0"
            />
            <StatCard
              label="Approved"
              value={statusCounts.approved}
              icon="✓"
              gradient="from-emerald-500 to-teal-600"
              delay="100"
            />
            <StatCard
              label="Pending"
              value={statusCounts.pending}
              icon="⏱"
              gradient="from-amber-500 to-orange-600"
              delay="200"
            />
            <StatCard
              label="Rejected"
              value={statusCounts.rejected}
              icon="✕"
              gradient="from-rose-500 to-pink-600"
              delay="300"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 p-1 bg-white rounded-xl shadow-sm border border-gray-200">
            {['all', 'approved', 'pending', 'rejected'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeFilter === filter
                    ? 'bg-indigo-600 text-white shadow-md scale-105'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-16">
          <Section
            title="Projects"
            items={data.projects}
            empty="You haven't created any projects yet."
            icon="📁"
            activeFilter={activeFilter}
            delay="0"
          />
          <Section
            title="Blogs"
            items={data.blogs}
            empty="No blogs written yet."
            icon="✍️"
            activeFilter={activeFilter}
            delay="100"
          />
          <Section
            title="Resources"
            items={data.resources}
            empty="No resources submitted yet."
            icon="📚"
            activeFilter={activeFilter}
            delay="200"
          />
          <Section
            title="Events"
            items={data.events}
            empty="No events organized yet."
            icon="📅"
            activeFilter={activeFilter}
            delay="300"
          />
          <Section
            title="Posts"
            items={data.posts}
            empty="No posts authored yet."
            icon="💬"
            activeFilter={activeFilter}
            delay="400"
          />
          <Section
            title="Alumni Entries"
            items={data.alumni}
            empty="No alumni profile found."
            icon="🎓"
            activeFilter={activeFilter}
            delay="500"
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, gradient, delay }) => (
  <div
    className="relative overflow-hidden bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 animate-slideUp"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full`}></div>
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl">{icon}</span>
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
          {value}
        </div>
      </div>
      <p className="text-gray-600 font-medium text-sm">{label}</p>
    </div>
  </div>
);

const Section = ({ title, items, empty, icon = '📌', activeFilter, delay }) => {
  // Filter items based on active filter
  const filteredItems = activeFilter === 'all' 
    ? items 
    : items.filter(item => item.approval_status?.toLowerCase() === activeFilter);
  
  const count = filteredItems.length;

  return (
    <section className="relative animate-fadeIn" style={{ animationDelay: `${delay}ms` }}>
      {/* Section header with sticky title and count badge */}
      <div className="flex items-baseline justify-between border-b-2 border-gray-200 pb-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl shadow-lg transform hover:rotate-12 transition-transform duration-300">
            {icon}
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
          {count} {count === 1 ? 'item' : 'items'}
        </div>
      </div>

      {count === 0 ? (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-3xl p-16 text-center transform hover:scale-105 transition-transform duration-300">
          <div className="text-6xl mb-4 opacity-30 animate-bounce">📭</div>
          <p className="text-gray-700 text-xl font-medium mb-2">{empty}</p>
          <p className="text-sm text-gray-500 mt-2">
            Your contributions will appear here once created.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <ItemCard key={item.id} item={item} index={index} />
          ))}
        </div>
      )}
    </section>
  );
};

const ItemCard = ({ item, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Determine status styles with dot indicator
  const statusConfig = {
    APPROVED: { 
      bg: 'bg-emerald-50', 
      text: 'text-emerald-700', 
      dot: 'bg-emerald-500',
      border: 'border-emerald-200',
      glow: 'shadow-emerald-100'
    },
    PENDING: { 
      bg: 'bg-amber-50', 
      text: 'text-amber-700', 
      dot: 'bg-amber-500',
      border: 'border-amber-200',
      glow: 'shadow-amber-100'
    },
    REJECTED: { 
      bg: 'bg-rose-50', 
      text: 'text-rose-700', 
      dot: 'bg-rose-500',
      border: 'border-rose-200',
      glow: 'shadow-rose-100'
    },
  };
  
  const status = item.approval_status;
  const config = statusConfig[status] || null;

  return (
    <article
      className={`group bg-white border-2 ${config?.border || 'border-gray-200'} rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col transform hover:-translate-y-2 cursor-pointer animate-slideUp ${config?.glow || ''}`}
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative corner accent */}
      <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${
        status === 'APPROVED' ? 'from-emerald-400' : 
        status === 'PENDING' ? 'from-amber-400' : 
        status === 'REJECTED' ? 'from-rose-400' : 'from-indigo-400'
      } to-transparent opacity-20 rounded-tr-2xl rounded-bl-full transition-opacity duration-300 ${isHovered ? 'opacity-40' : ''}`}></div>

      {/* Title with line clamp */}
      <h3 className={`font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${
        status === 'APPROVED' ? 'group-hover:from-emerald-600 group-hover:to-teal-600' : 
        status === 'PENDING' ? 'group-hover:from-amber-600 group-hover:to-orange-600' : 
        status === 'REJECTED' ? 'group-hover:from-rose-600 group-hover:to-pink-600' : 
        'group-hover:from-indigo-600 group-hover:to-blue-600'
      } transition-all duration-300`}>
        {item.title}
      </h3>

      {/* Description / excerpt */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow leading-relaxed">
        {item.description || item.excerpt || 'No description provided.'}
      </p>

      {/* Metadata footer */}
      <div className="mt-auto pt-4 border-t-2 border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <time>
              {new Date(item.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          </div>

          {/* Status badge with dot indicator and animation */}
          {status && config && (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} border ${config.border} transform transition-transform duration-200 ${isHovered ? 'scale-110' : ''}`}
            >
              <span className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
              {status}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

// Add custom CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.6s ease-out forwards;
  }

  .animate-slideUp {
    animation: slideUp 0.5s ease-out forwards;
    opacity: 0;
  }
`;
document.head.appendChild(style);

export default MyActivity;