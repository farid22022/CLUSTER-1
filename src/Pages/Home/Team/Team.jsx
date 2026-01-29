import { useState } from 'react';

const Team = () => {
  const [hoveredMember, setHoveredMember] = useState(null);

  const teamMembers = [
    {
      designation: "Director",
      name: "Professor Dr. Kazi Masudul Alam",
      student_id: "",
      image_url: "https://i.ibb.co/bXynWfb/Money.png",
      facebook_url: "https://facebook.com/username0",
      linkedin_url: "https://linkedin.com/in/username0",
      email: "username0@email.com"
    },
    {
      designation: "President",
      name: "Tahmid Hasan Tasfi",
      student_id: "210218",
      image_url: "https://i.ibb.co/TqxvVFb3/tasfi.jpg",
      facebook_url: "https://facebook.com/username1",
      linkedin_url: "https://linkedin.com/in/username1",
      email: "username1@email.com"
    },
    {
      designation: "Vice President-1",
      name: "Md Tasbi Hassan",
      student_id: "210216",
      image_url: "https://i.ibb.co/4RhPX7Ks/tasbi.jpg",
      facebook_url: "https://facebook.com/username2",
      linkedin_url: "https://linkedin.com/in/username2",
      email: "username2@email.com"
    },
    {
      designation: "Vice President-2",
      name: "Razu Sarder",
      student_id: "220220",
      image_url: "https://i.ibb.co/tpDz54TM/razu.jpg",
      facebook_url: "https://facebook.com/username3",
      linkedin_url: "https://linkedin.com/in/username3",
      email: "username3@email.com"
    },
    {
      designation: "General Secretary",
      name: "Md Anjir Hossain",
      student_id: "210230",
      image_url: "https://i.ibb.co/1thHGwzw/anjir.jpg",
      facebook_url: "https://facebook.com/username4",
      linkedin_url: "https://linkedin.com/in/username4",
      email: "username4@email.com"
    },
  ];

  const FacebookIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );

  const LinkedinIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );

  const EmailIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.727L12 13.091l9.637-9.27h.727c.904 0 1.636.732 1.636 1.636z"/>
    </svg>
  );

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-white to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-block p-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <div className="bg-white rounded-full px-6 py-2">
              <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Leadership Team</span>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Meet Our Team
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Dedicated professionals committed to driving innovation and excellence in everything we do
          </p>
        </div>

        {/* Team Grid */}
      <div className="grid grid-cols-1 gap-6 md:gap-8">
      {/* First Row: First person centered */}
      <div className="flex justify-center w-1/4 mx-auto">
        {teamMembers.slice(0, 1).map((member, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 w-full max-w-md"
            onMouseEnter={() => setHoveredMember(index)}
            onMouseLeave={() => setHoveredMember(null)}
          >
            {/* Image Container */}
            <div className="relative h-64 sm:h-72 overflow-hidden">
              <img
                src={member.image_url}
                alt={member.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

              {/* Social Links Overlay */}
              <div className={`absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300 ${
                hoveredMember === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}>
                <div className="flex space-x-4">
                  <a
                    href={member.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 hover:text-blue-700 hover:scale-110 transition-all duration-200 shadow-lg"
                  >
                    <FacebookIcon />
                  </a>
                  <a
                    href={member.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-700 hover:text-blue-800 hover:scale-110 transition-all duration-200 shadow-lg"
                  >
                    <LinkedinIcon />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-gray-800 hover:scale-110 transition-all duration-200 shadow-lg"
                  >
                    <EmailIcon />
                  </a>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                  {member.name}
                </h3>
                <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
                  {member.designation}
                </div>
              </div>

              {/* Mobile Social Links */}
              <div className="flex justify-center space-x-4 md:hidden">
                <a
                  href={member.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                >
                  <FacebookIcon />
                </a>
                <a
                  href={member.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-blue-700 hover:bg-blue-50 transition-colors duration-200"
                >
                  <LinkedinIcon />
                </a>
                <a
                  href={`mailto:${member.email}`}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                >
                  <EmailIcon />
                </a>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </div>
        ))}
      </div>

      {/* Second Row: Remaining four members in a 4-column grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {teamMembers.slice(1).map((member, index) => (
          <div
            key={index + 1}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
            onMouseEnter={() => setHoveredMember(index + 1)}
            onMouseLeave={() => setHoveredMember(null)}
          >
            {/* Image Container */}
            <div className="relative h-64 sm:h-72 overflow-hidden">
              <img
                src={member.image_url}
                alt={member.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
              
              {/* Floating Badge */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                <span className="text-xs font-semibold text-gray-700">ID: {member.student_id}</span>
              </div>

              {/* Social Links Overlay */}
              <div className={`absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300 ${
                hoveredMember === index + 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}>
                <div className="flex space-x-4">
                  <a
                    href={member.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 hover:text-blue-700 hover:scale-110 transition-all duration-200 shadow-lg"
                  >
                    <FacebookIcon />
                  </a>
                  <a
                    href={member.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-700 hover:text-blue-800 hover:scale-110 transition-all duration-200 shadow-lg"
                  >
                    <LinkedinIcon />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-gray-800 hover:scale-110 transition-all duration-200 shadow-lg"
                  >
                    <EmailIcon />
                  </a>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                  {member.name}
                </h3>
                <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
                  {member.designation}
                </div>
              </div>

              {/* Mobile Social Links */}
              <div className="flex justify-center space-x-4 md:hidden">
                <a
                  href={member.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                >
                  <FacebookIcon />
                </a>
                <a
                  href={member.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-blue-700 hover:bg-blue-50 transition-colors duration-200"
                >
                  <LinkedinIcon />
                </a>
                <a
                  href={`mailto:${member.email}`}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                >
                  <EmailIcon />
                </a>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </div>
        ))}
      </div>
    </div>

        {/* Bottom CTA */}
        {/* <div className="text-center mt-16 md:mt-20">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Connect?</h3>
            <p className="text-gray-600 mb-8">
              Have questions or want to collaborate? Our team is here to help you succeed.
            </p>
            <button className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Get In Touch
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Team;