// import { useState, useEffect } from 'react';
// import {
//   getMyProjects,
//   getMyBlogs,
//   getMyResources,
//   getMyEvents,
//   getMyPosts,
//   getMyAlumni,
// } from '../../api';

// const MyActivity = () => {
//   const [data, setData] = useState({
//     projects: [],
//     blogs: [],
//     resources: [],
//     events: [],
//     posts: [],
//     alumni: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const [activeFilter, setActiveFilter] = useState('all');

//   useEffect(() => {
//     const loadMyContent = async () => {
//       try {
//         const [proj, blog, res, evt, post, alum] = await Promise.all([
//           getMyProjects(),
//           getMyBlogs(),
//           getMyResources(),
//           getMyEvents(),
//           getMyPosts(),
//           getMyAlumni(),
//         ]);

//         setData({
//           projects: proj,
//           blogs: blog,
//           resources: res,
//           events: evt,
//           posts: post,
//           alumni: alum,
//         });
//       } catch (err) {
//         console.error('Failed to load your activity:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadMyContent();
//   }, []);

//   // Calculate total contributions
//   const totalContributions = Object.values(data).reduce(
//     (acc, arr) => acc + arr.length,
//     0
//   );

//   // Calculate counts by status
//   const statusCounts = {
//     approved: Object.values(data).flat().filter(item => item.approval_status === 'APPROVED').length,
//     pending: Object.values(data).flat().filter(item => item.approval_status === 'PENDING').length,
//     rejected: Object.values(data).flat().filter(item => item.approval_status === 'REJECTED').length,
//   };

//   if (loading)
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
//         <div className="text-center">
//           <div className="relative w-20 h-20 mx-auto mb-6">
//             <div className="absolute inset-0 border-4 border-indigo-200 rounded-full animate-ping opacity-75"></div>
//             <div className="absolute inset-0 border-4 border-t-indigo-600 border-r-indigo-600 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
//           </div>
//           <p className="text-gray-600 text-lg font-medium animate-pulse">
//             Loading your contributions...
//           </p>
//         </div>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
//       <div className="max-w-7xl pt-28 mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         {/* Header with enhanced summary cards */}
//         <div className="mb-12 animate-fadeIn">
//           <div className="mb-8">
//             <h1 className="text-5xl font-bold text-gray-900 tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-indigo-600">
//               My Activity
//             </h1>
//             <p className="text-lg text-gray-600">
//               Track and manage all your contributions in one place
//             </p>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//             <StatCard
//               label="Total Contributions"
//               value={totalContributions}
//               icon="📊"
//               gradient="from-indigo-500 to-blue-600"
//               delay="0"
//             />
//             <StatCard
//               label="Approved"
//               value={statusCounts.approved}
//               icon="✓"
//               gradient="from-emerald-500 to-teal-600"
//               delay="100"
//             />
//             <StatCard
//               label="Pending"
//               value={statusCounts.pending}
//               icon="⏱"
//               gradient="from-amber-500 to-orange-600"
//               delay="200"
//             />
//             <StatCard
//               label="Rejected"
//               value={statusCounts.rejected}
//               icon="✕"
//               gradient="from-rose-500 to-pink-600"
//               delay="300"
//             />
//           </div>

//           {/* Filter Tabs */}
//           <div className="flex flex-wrap gap-2 p-1 bg-white rounded-xl shadow-sm border border-gray-200">
//             {['all', 'approved', 'pending', 'rejected'].map((filter) => (
//               <button
//                 key={filter}
//                 onClick={() => setActiveFilter(filter)}
//                 className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
//                   activeFilter === filter
//                     ? 'bg-indigo-600 text-white shadow-md scale-105'
//                     : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                 }`}
//               >
//                 {filter.charAt(0).toUpperCase() + filter.slice(1)}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="space-y-16">
//           <Section
//             title="Projects"
//             items={data.projects}
//             empty="You haven't created any projects yet."
//             icon="📁"
//             activeFilter={activeFilter}
//             delay="0"
//           />
//           <Section
//             title="Blogs"
//             items={data.blogs}
//             empty="No blogs written yet."
//             icon="✍️"
//             activeFilter={activeFilter}
//             delay="100"
//           />
//           <Section
//             title="Resources"
//             items={data.resources}
//             empty="No resources submitted yet."
//             icon="📚"
//             activeFilter={activeFilter}
//             delay="200"
//           />
//           <Section
//             title="Events"
//             items={data.events}
//             empty="No events organized yet."
//             icon="📅"
//             activeFilter={activeFilter}
//             delay="300"
//           />
//           <Section
//             title="Posts"
//             items={data.posts}
//             empty="No posts authored yet."
//             icon="💬"
//             activeFilter={activeFilter}
//             delay="400"
//           />
//           <Section
//             title="Alumni Entries"
//             items={data.alumni}
//             empty="No alumni profile found."
//             icon="🎓"
//             activeFilter={activeFilter}
//             delay="500"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// const StatCard = ({ label, value, icon, gradient, delay }) => (
//   <div
//     className="relative overflow-hidden bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 animate-slideUp"
//     style={{ animationDelay: `${delay}ms` }}
//   >
//     <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full`}></div>
//     <div className="relative">
//       <div className="flex items-center justify-between mb-2">
//         <span className="text-3xl">{icon}</span>
//         <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
//           {value}
//         </div>
//       </div>
//       <p className="text-gray-600 font-medium text-sm">{label}</p>
//     </div>
//   </div>
// );

// const Section = ({ title, items, empty, icon = '📌', activeFilter, delay }) => {
//   // Filter items based on active filter
//   const filteredItems = activeFilter === 'all' 
//     ? items 
//     : items.filter(item => item.approval_status?.toLowerCase() === activeFilter);
  
//   const count = filteredItems.length;

//   return (
//     <section className="relative animate-fadeIn" style={{ animationDelay: `${delay}ms` }}>
//       {/* Section header with sticky title and count badge */}
//       <div className="flex items-baseline justify-between border-b-2 border-gray-200 pb-4 mb-8">
//         <div className="flex items-center gap-3">
//           <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl shadow-lg transform hover:rotate-12 transition-transform duration-300">
//             {icon}
//           </div>
//           <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
//         </div>
//         <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
//           {count} {count === 1 ? 'item' : 'items'}
//         </div>
//       </div>

//       {count === 0 ? (
//         <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-3xl p-16 text-center transform hover:scale-105 transition-transform duration-300">
//           <div className="text-6xl mb-4 opacity-30 animate-bounce">📭</div>
//           <p className="text-gray-700 text-xl font-medium mb-2">{empty}</p>
//           <p className="text-sm text-gray-500 mt-2">
//             Your contributions will appear here once created.
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredItems.map((item, index) => (
//             <ItemCard key={item.id} item={item} index={index} />
//           ))}
//         </div>
//       )}
//     </section>
//   );
// };

// const ItemCard = ({ item, index }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   // Determine status styles with dot indicator
//   const statusConfig = {
//     APPROVED: { 
//       bg: 'bg-emerald-50', 
//       text: 'text-emerald-700', 
//       dot: 'bg-emerald-500',
//       border: 'border-emerald-200',
//       glow: 'shadow-emerald-100'
//     },
//     PENDING: { 
//       bg: 'bg-amber-50', 
//       text: 'text-amber-700', 
//       dot: 'bg-amber-500',
//       border: 'border-amber-200',
//       glow: 'shadow-amber-100'
//     },
//     REJECTED: { 
//       bg: 'bg-rose-50', 
//       text: 'text-rose-700', 
//       dot: 'bg-rose-500',
//       border: 'border-rose-200',
//       glow: 'shadow-rose-100'
//     },
//   };
  
//   const status = item.approval_status;
//   const config = statusConfig[status] || null;

//   return (
//     <article
//       className={`group bg-white border-2 ${config?.border || 'border-gray-200'} rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col transform hover:-translate-y-2 cursor-pointer animate-slideUp ${config?.glow || ''}`}
//       style={{ animationDelay: `${index * 50}ms` }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Decorative corner accent */}
//       <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${
//         status === 'APPROVED' ? 'from-emerald-400' : 
//         status === 'PENDING' ? 'from-amber-400' : 
//         status === 'REJECTED' ? 'from-rose-400' : 'from-indigo-400'
//       } to-transparent opacity-20 rounded-tr-2xl rounded-bl-full transition-opacity duration-300 ${isHovered ? 'opacity-40' : ''}`}></div>

//       {/* Title with line clamp */}
//       <h3 className={`font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${
//         status === 'APPROVED' ? 'group-hover:from-emerald-600 group-hover:to-teal-600' : 
//         status === 'PENDING' ? 'group-hover:from-amber-600 group-hover:to-orange-600' : 
//         status === 'REJECTED' ? 'group-hover:from-rose-600 group-hover:to-pink-600' : 
//         'group-hover:from-indigo-600 group-hover:to-blue-600'
//       } transition-all duration-300`}>
//         {item.title}
//       </h3>

//       {/* Description / excerpt */}
//       <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow leading-relaxed">
//         {item.description || item.excerpt || 'No description provided.'}
//       </p>

//       {/* Metadata footer */}
//       <div className="mt-auto pt-4 border-t-2 border-gray-100">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2 text-xs text-gray-500">
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//             </svg>
//             <time>
//               {new Date(item.created_at).toLocaleDateString('en-US', {
//                 year: 'numeric',
//                 month: 'short',
//                 day: 'numeric',
//               })}
//             </time>
//           </div>

//           {/* Status badge with dot indicator and animation */}
//           {status && config && (
//             <span
//               className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} border ${config.border} transform transition-transform duration-200 ${isHovered ? 'scale-110' : ''}`}
//             >
//               <span className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
//               {status}
//             </span>
//           )}
//         </div>
//       </div>
//     </article>
//   );
// };

// // Add custom CSS animations
// const style = document.createElement('style');
// style.textContent = `
//   @keyframes fadeIn {
//     from {
//       opacity: 0;
//       transform: translateY(10px);
//     }
//     to {
//       opacity: 1;
//       transform: translateY(0);
//     }
//   }

//   @keyframes slideUp {
//     from {
//       opacity: 0;
//       transform: translateY(30px);
//     }
//     to {
//       opacity: 1;
//       transform: translateY(0);
//     }
//   }

//   .animate-fadeIn {
//     animation: fadeIn 0.6s ease-out forwards;
//   }

//   .animate-slideUp {
//     animation: slideUp 0.5s ease-out forwards;
//     opacity: 0;
//   }
// `;
// document.head.appendChild(style);

// export default MyActivity;
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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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
          projects: proj || [],
          blogs: blog || [],
          resources: res || [],
          events: evt || [],
          posts: post || [],
          alumni: alum || [],
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
    approved: Object.values(data).flat().filter(item => item?.approval_status === 'APPROVED').length,
    pending: Object.values(data).flat().filter(item => item?.approval_status === 'PENDING').length,
    rejected: Object.values(data).flat().filter(item => item?.approval_status === 'REJECTED').length,
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

        {/* GitHub-style Contribution Graph - Pass totalContributions as prop */}
        <ContributionGraph 
          data={data} 
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          totalContributions={totalContributions}
        />

        {/* Activity Timeline */}
        <ActivityTimeline 
          data={data} 
          activeFilter={activeFilter}
          selectedYear={selectedYear}
        />
      </div>
    </div>
  );
};

// GitHub-style Contribution Graph Component
const ContributionGraph = ({ data, selectedYear, onYearChange, totalContributions }) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Color mapping for different content types
  const typeColors = {
    projects: { bg: 'bg-indigo-500', hover: 'hover:bg-indigo-600', label: 'Projects' },
    blogs: { bg: 'bg-emerald-500', hover: 'hover:bg-emerald-600', label: 'Blogs' },
    resources: { bg: 'bg-amber-500', hover: 'hover:bg-amber-600', label: 'Resources' },
    events: { bg: 'bg-rose-500', hover: 'hover:bg-rose-600', label: 'Events' },
    posts: { bg: 'bg-purple-500', hover: 'hover:bg-purple-600', label: 'Posts' },
    alumni: { bg: 'bg-cyan-500', hover: 'hover:bg-cyan-600', label: 'Alumni' },
  };

  // Generate last 52 weeks of data
  const generateWeeksData = () => {
    const weeks = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364); // 52 weeks * 7 days

    for (let week = 0; week < 52; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (week * 7) + day);
        
        // Find contributions for this date
        const dateStr = currentDate.toISOString().split('T')[0];
        const dayContributions = {};
        
        Object.entries(data).forEach(([type, items]) => {
          dayContributions[type] = (items || []).filter(item => {
            if (!item?.created_at) return false;
            const itemDate = new Date(item.created_at).toISOString().split('T')[0];
            return itemDate === dateStr;
          });
        });

        const totalCount = Object.values(dayContributions).reduce(
          (sum, arr) => sum + (arr?.length || 0), 0
        );

        weekDays.push({
          date: currentDate,
          dateStr,
          contributions: dayContributions,
          totalCount,
          items: Object.entries(dayContributions).flatMap(([type, items]) => 
            (items || []).map(item => ({ ...item, type }))
          ),
        });
      }
      weeks.push(weekDays);
    }
    return weeks;
  };

  const weeksData = generateWeeksData();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Mon', 'Wed', 'Fri']; // For day labels

  // Get color based on contribution types
  const getCellColor = (dayData) => {
    if (dayData.totalCount === 0) return 'bg-gray-100';
    
    // If multiple types, show a pattern
    const types = Object.keys(dayData.contributions).filter(
      type => dayData.contributions[type]?.length > 0
    );

    if (types.length > 1) {
      return 'bg-gradient-to-br from-indigo-400 via-purple-400 to-rose-400';
    }

    // Single type color
    const type = types[0];
    switch(type) {
      case 'projects': return 'bg-indigo-500';
      case 'blogs': return 'bg-emerald-500';
      case 'resources': return 'bg-amber-500';
      case 'events': return 'bg-rose-500';
      case 'posts': return 'bg-purple-500';
      case 'alumni': return 'bg-cyan-500';
      default: return getIntensityClass(dayData.totalCount);
    }
  };

  // Get intensity class based on count
  const getIntensityClass = (count) => {
    if (count === 0) return 'bg-gray-100';
    if (count <= 1) return 'bg-indigo-200';
    if (count <= 3) return 'bg-indigo-300';
    if (count <= 5) return 'bg-indigo-400';
    return 'bg-indigo-500';
  };

  const handleCellClick = (dayData, event) => {
    setSelectedCell(dayData);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  // Available years for filter
  const years = [2023, 2024, 2025, 2026];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Contribution Activity</h2>
          <p className="text-gray-600">{totalContributions || 0} contributions in the last year</p>
        </div>
        
        {/* Year selector */}
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Contribution graph */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[800px]">
          {/* Month labels */}
          <div className="flex ml-8 mb-2 text-xs text-gray-500">
            {months.map((month, i) => (
              <div key={month} className="flex-1 text-left">{month}</div>
            ))}
          </div>

          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col mr-2 text-xs text-gray-500">
              {days.map(day => (
                <div key={day} className="h-[22px] flex items-center">{day}</div>
              ))}
            </div>

            {/* Contribution grid */}
            <div className="flex gap-1">
              {weeksData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={day.dateStr}
                      className={`w-[22px] h-[22px] rounded-sm ${getCellColor(day)} hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400 transition-all cursor-pointer relative group`}
                      onClick={(e) => handleCellClick(day, e)}
                      onMouseEnter={() => setSelectedCell(day)}
                      onMouseLeave={() => setSelectedCell(null)}
                    >
                      {/* Tooltip */}
                      {selectedCell?.dateStr === day.dateStr && (
                        <div
                          className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap pointer-events-none"
                        >
                          <div className="font-semibold">
                            {day.date.toLocaleDateString('en-US', { 
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="mt-1 space-y-1">
                            {day.totalCount > 0 ? (
                              Object.entries(day.contributions).map(([type, items]) => 
                                items?.length > 0 && (
                                  <div key={type} className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${typeColors[type]?.bg}`}></span>
                                    <span>{typeColors[type]?.label}: {items.length}</span>
                                  </div>
                                )
                              )
                            ) : (
                              <div>No contributions</div>
                            )}
                          </div>
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 mt-6 pt-4 border-t border-gray-100">
        <div className="text-sm font-medium text-gray-700">Activity types:</div>
        {Object.entries(typeColors).map(([type, config]) => (
          <div key={type} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-sm ${config.bg}`}></div>
            <span className="text-xs text-gray-600">{config.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-gray-500">Less</span>
          <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
          <div className="w-3 h-3 bg-indigo-200 rounded-sm"></div>
          <div className="w-3 h-3 bg-indigo-300 rounded-sm"></div>
          <div className="w-3 h-3 bg-indigo-400 rounded-sm"></div>
          <div className="w-3 h-3 bg-indigo-500 rounded-sm"></div>
          <span className="text-xs text-gray-500">More</span>
        </div>
      </div>
    </div>
  );
};

// Activity Timeline Component
const ActivityTimeline = ({ data, activeFilter, selectedYear }) => {
  // Combine and sort all items by date
  const allItems = Object.entries(data).flatMap(([type, items]) =>
    (items || []).map(item => ({
      ...item,
      type,
      typeLabel: getTypeLabel(type),
      typeColor: getTypeColor(type),
      typeIcon: getTypeIcon(type),
      date: new Date(item.created_at),
    }))
  ).filter(item => !isNaN(item.date) && item.date.getFullYear() === selectedYear)
   .sort((a, b) => b.date - a.date);

  // Filter by status
  const filteredItems = activeFilter === 'all'
    ? allItems
    : allItems.filter(item => item.approval_status?.toLowerCase() === activeFilter);

  // Group by month
  const groupedByMonth = filteredItems.reduce((groups, item) => {
    const monthYear = item.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(item);
    return groups;
  }, {});

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Activity Timeline</h2>
      
      {Object.keys(groupedByMonth).length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-30">📅</div>
          <p className="text-gray-600 text-lg">No activity found for {selectedYear}</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 via-purple-200 to-rose-200"></div>
          
          {Object.entries(groupedByMonth).map(([monthYear, items]) => (
            <div key={monthYear} className="mb-8 relative">
              {/* Month header */}
              <div className="sticky top-24 z-10 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg mb-4 ml-16 inline-block shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800">{monthYear}</h3>
              </div>

              {/* Timeline items */}
              {items.map((item, index) => (
                <div key={item.id || index} className="relative mb-6 group">
                  <div className="flex items-start gap-4">
                    {/* Timeline dot with icon */}
                    <div className="relative z-10">
                      <div className={`w-16 h-16 rounded-2xl ${item.typeColor} bg-opacity-10 border-2 border-white shadow-lg flex items-center justify-center text-2xl transform group-hover:scale-110 transition-transform duration-300`}>
                        {item.typeIcon}
                      </div>
                      {/* Pulse effect */}
                      <div className={`absolute inset-0 rounded-2xl ${item.typeColor} animate-ping opacity-20 group-hover:opacity-30`}></div>
                    </div>

                    {/* Content card */}
                    <div className="flex-1 bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.approval_status)}`}>
                              {item.approval_status || 'DRAFT'}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.typeColor} text-white`}>
                              {item.typeLabel}
                            </span>
                          </div>
                          <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title || 'Untitled'}</h4>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {item.description || item.excerpt || 'No description provided.'}
                          </p>
                        </div>
                        
                        {/* Time badge */}
                        <div className="flex flex-col items-end gap-1">
                          <div className="bg-gray-100 px-3 py-1.5 rounded-xl text-sm font-medium text-gray-700 whitespace-nowrap">
                            {!isNaN(item.date) ? item.date.toLocaleDateString('en-US', { 
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }) : 'Invalid date'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {!isNaN(item.date) ? item.date.toLocaleTimeString('en-US', { 
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : ''}
                          </div>
                        </div>
                      </div>

                      {/* Additional metadata */}
                      {(item.location || item.author || item.tags) && (
                        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
                          {item.location && (
                            <div className="flex items-center gap-1">
                              <span>📍</span>
                              <span>{item.location}</span>
                            </div>
                          )}
                          {item.author && (
                            <div className="flex items-center gap-1">
                              <span>👤</span>
                              <span>{item.author}</span>
                            </div>
                          )}
                          {item.tags && Array.isArray(item.tags) && (
                            <div className="flex items-center gap-1">
                              <span>🏷️</span>
                              <span>{item.tags.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper functions for timeline
const getTypeLabel = (type) => {
  const labels = {
    projects: 'Project',
    blogs: 'Blog',
    resources: 'Resource',
    events: 'Event',
    posts: 'Post',
    alumni: 'Alumni',
  };
  return labels[type] || type;
};

const getTypeColor = (type) => {
  const colors = {
    projects: 'bg-indigo-500',
    blogs: 'bg-emerald-500',
    resources: 'bg-amber-500',
    events: 'bg-rose-500',
    posts: 'bg-purple-500',
    alumni: 'bg-cyan-500',
  };
  return colors[type] || 'bg-gray-500';
};

const getTypeIcon = (type) => {
  const icons = {
    projects: '📁',
    blogs: '✍️',
    resources: '📚',
    events: '📅',
    posts: '💬',
    alumni: '🎓',
  };
  return icons[type] || '📌';
};

const getStatusColor = (status) => {
  const colors = {
    APPROVED: 'bg-emerald-100 text-emerald-700',
    PENDING: 'bg-amber-100 text-amber-700',
    REJECTED: 'bg-rose-100 text-rose-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
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