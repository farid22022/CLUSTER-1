// src/pages/cluster/EmailMembers.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Mail, Phone, Facebook, Linkedin, 
  Send, Search, Filter, UserCircle, MessageSquare,
  AtSign, Paperclip, Eye, EyeOff
} from 'lucide-react';

// Your team members data (same as provided)
const initialTeamMembers = [
  {
    id: 1,
    designation: "Director",
    name: "Professor Dr. Kazi Masudul Alam",
    student_id: "210123",
    image_url: "https://i.ibb.co.com/bXynWfb/Money.png",
    facebook_url: "https://facebook.com/username1",
    linkedin_url: "https://linkedin.com/in/username1",
    email: "username1@email.com",
    quote: "Leading with vision and empowering excellence."
  },
  {
    id: 2,
    designation: "President",
    name: "Tahmid Hasan Tasfi",
    student_id: "210218",
    image_url: "https://i.ibb.co/TqxvVFb3/tasfi.jpg",
    facebook_url: "https://facebook.com/username1",
    linkedin_url: "https://linkedin.com/in/username1",
    email: "username1@email.com",
    quote: ""
  },
  {
    id: 3,
    designation: "Vice President-1",
    name: "Md Tasbi Hassan",
    student_id: "210216",
    image_url: "https://i.ibb.co/4RhPX7Ks/tasbi.jpg",
    facebook_url: "https://facebook.com/username2",
    linkedin_url: "https://linkedin.com/in/username2",
    email: "username2@email.com",
    quote: ""
  },
  {
    id: 4,
    designation: "Vice President-2",
    name: "Razu Sarder",
    student_id: "220220",
    image_url: "https://i.ibb.co/tpDz54TM/razu.jpg",
    facebook_url: "https://facebook.com/username3",
    linkedin_url: "https://linkedin.com/in/username3",
    email: "username3@email.com",
    quote: ""
  },
  {
    id: 5,
    designation: "General Secretary",
    name: "Md Anjir Hossain",
    student_id: "210230",
    image_url: "https://i.ibb.co/1thHGwzw/anjir.jpg",
    facebook_url: "https://facebook.com/username4",
    linkedin_url: "https://linkedin.com/in/username4",
    email: "username4@email.com",
    quote: ""
  },
  {
    id: 6,
    designation: "Joint Secretary",
    name: "Sohag Chandra",
    student_id: "220238",
    image_url: "https://i.ibb.co/jZ5W0PJJ/sohag.jpg",
    facebook_url: "https://facebook.com/username5",
    linkedin_url: "https://linkedin.com/in/username5",
    email: "username5@email.com",
    quote: ""
  },
  {
    id: 7,
    designation: "Treasurer",
    name: "Md Ashiquzzaman Rahad",
    student_id: "210201",
    image_url: "https://i.ibb.co/yB7kHjfZ/rahad.jpg",
    facebook_url: "https://facebook.com/username6",
    linkedin_url: "https://linkedin.com/in/username6",
    email: "username6@email.com",
    quote: ""
  },
  {
    id: 8,
    designation: "Programming Campaign Secretary",
    name: "Nahid Hassan",
    student_id: "220229",
    image_url: "https://i.ibb.co/cKHbZNg6/nahid.jpg",
    facebook_url: "https://facebook.com/username7",
    linkedin_url: "https://linkedin.com/in/username7",
    email: "username7@email.com",
    quote: ""
  },
  {
    id: 9,
    designation: "Workshop Secretary",
    name: "Muhammad Fahim",
    student_id: "210210",
    image_url: "https://i.ibb.co/nq871XvD/Fahim.png",
    facebook_url: "https://facebook.com/username8",
    linkedin_url: "https://linkedin.com/in/username8",
    email: "username8@email.com",
    quote: ""
  },
  {
    id: 10,
    designation: "Assistant Workshop Secretary",
    name: "Sardar Muhammad Sakib Hossain",
    student_id: "230222",
    image_url: "https://i.ibb.co.com/gDLBssv/230222-Sardar-Muhammad-Sakib-Hossain.jpg",
    facebook_url: "https://facebook.com/username9",
    linkedin_url: "https://linkedin.com/in/username9",
    email: "username9@email.com",
    quote: ""
  },
  {
    id: 11,
    designation: "WISE Secretary",
    name: "Sharmika Das Banhi",
    student_id: "210204",
    image_url: "https://example.com/image10.jpg",
    facebook_url: "https://facebook.com/username10",
    linkedin_url: "https://linkedin.com/in/username10",
    email: "username10@email.com",
    quote: ""
  },
  {
    id: 12,
    designation: "Public Relations Secretary",
    name: "Radhika Chowdhury",
    student_id: "220239",
    image_url: "https://example.com/image11.jpg",
    facebook_url: "https://facebook.com/username11",
    linkedin_url: "https://linkedin.com/in/username11",
    email: "username11@email.com",
    quote: ""
  },
  {
    id: 13,
    designation: "IT Secretary",
    name: "Mohaiminul Islam Saad",
    student_id: "220201",
    image_url: "https://i.ibb.co/HTLfg95m/shaad.jpg",
    facebook_url: "https://facebook.com/username12",
    linkedin_url: "https://linkedin.com/in/username12",
    email: "username12@email.com",
    quote: ""
  },
  {
    id: 14,
    designation: "Assistant IT Secretary",
    name: "Kazi Rifat Morshed",
    student_id: "230220",
    image_url: "https://i.ibb.co/V0RKRzgt/rifat.jpg",
    facebook_url: "https://facebook.com/username13",
    linkedin_url: "https://linkedin.com/in/username13",
    email: "username13@email.com",
    quote: ""
  },
  {
    id: 15,
    designation: "Campaign Secretary",
    name: "Md Abdullah Al Mahin",
    student_id: "230210",
    image_url: "https://i.ibb.co.com/nCW3Pj2/Mahin.png",
    facebook_url: "https://facebook.com/username14",
    linkedin_url: "https://linkedin.com/in/username14",
    email: "username14@email.com",
    quote: ""
  },
  {
    id: 16,
    designation: "Cultural Secretary",
    name: "SM Shibly Noman",
    student_id: "230206",
    image_url: "https://i.ibb.co.com/64dCbMy/230206-shibly.jpg",
    facebook_url: "https://facebook.com/username15",
    linkedin_url: "https://linkedin.com/in/username15",
    email: "username15@email.com",
    quote: ""
  },
  {
    id: 17,
    designation: "Member-1 (MSc.)",
    name: "Istyaque Ahammed",
    student_id: "M.Sc. 250235",
    image_url: "https://i.ibb.co/wFzXp8KJ/istyake.jpg",
    facebook_url: "https://facebook.com/username16",
    linkedin_url: "https://linkedin.com/in/username16",
    email: "username16@email.com",
    quote: ""
  },
  {
    id: 18,
    designation: "Member-2 (BSc.)",
    name: "Sneha Shah",
    student_id: "240242",
    image_url: "https://i.ibb.co/tpDz54TM/razu.jpg",
    facebook_url: "https://facebook.com/username17",
    linkedin_url: "https://linkedin.com/in/username17",
    email: "username17@email.com",
    quote: ""
  },
  {
    id: 19,
    designation: "Member-3 (BSc.)",
    name: "Towhid Al Mahmud",
    student_id: "240239",
    image_url: "https://example.com/image18.jpg",
    facebook_url: "https://facebook.com/username18",
    linkedin_url: "https://linkedin.com/in/username18",
    email: "username18@email.com",
    quote: ""
  },
  {
    id: 20,
    designation: "Member-4 (BSc.)",
    name: "Abir Khan Siam",
    student_id: "240228",
    image_url: "https://example.com/image19.jpg",
    facebook_url: "https://facebook.com/username19",
    linkedin_url: "https://linkedin.com/in/username19",
    email: "username19@email.com",
    quote: ""
  }
];
 
 


export default function EmailMembers() {
  const [members, setMembers] = useState(initialTeamMembers);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [emailContent, setEmailContent] = useState({
    subject: "",
    body: "",
    attachment: null
  });
  const [showPreview, setShowPreview] = useState(false);

  // Filter members based on search
  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.student_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle member selection
  const toggleMemberSelection = (memberId) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  // Select all members
  const selectAllMembers = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map(member => member.id));
    }
  };

  // Send email function
  const handleSendEmail = async () => {
    if (selectedMembers.length === 0) {
      alert("Please select at least one member to send email to.");
      return;
    }

    if (!emailContent.subject.trim() || !emailContent.body.trim()) {
      alert("Please fill in both subject and body of the email.");
      return;
    }

    const selectedEmails = members
      .filter(member => selectedMembers.includes(member.id))
      .map(member => member.email);

    // Here you would integrate with your email API
    const emailData = {
      recipients: selectedEmails,
      subject: emailContent.subject,
      body: emailContent.body,
      attachment: emailContent.attachment
    };

    console.log("Sending email:", emailData);
    
    // Simulate API call
    try {
      // Replace with actual API call
      // await sendEmailAPI(emailData);
      alert(`Email sent successfully to ${selectedEmails.length} member(s)!`);
      setEmailContent({ subject: "", body: "", attachment: null });
      setSelectedMembers([]);
    } catch (error) {
      alert("Failed to send email. Please try again.");
    }
  };

  // Handle file attachment
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) { // 10MB limit
      alert("File size should be less than 10MB");
      return;
    }
    setEmailContent({ ...emailContent, attachment: file });
  };

  return (
    <div className="p-6 md:p-10 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white mb-3">
          Cluster <span className="text-blue-600">Email System</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Send emails to club members. Select members and compose your message.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Panel: Member List */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 mb-8 border border-gray-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Club Members ({members.length})
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={selectAllMembers}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-medium hover:bg-blue-200 dark:hover:bg-blue-800/50 transition"
                >
                  {selectedMembers.length === filteredMembers.length ? "Deselect All" : "Select All"}
                </button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-xl border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  />
                </div>
              </div>
            </div>

            {/* Selected Count */}
            {selectedMembers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl text-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AtSign className="w-6 h-6" />
                    <div>
                      <p className="font-bold">{selectedMembers.length} member(s) selected</p>
                      <p className="text-sm opacity-90">Will receive your email</p>
                    </div>
                  </div>
                  <span className="text-2xl font-black">{selectedMembers.length}</span>
                </div>
              </motion.div>
            )}

            {/* Member List */}
            <div className="grid md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
              {filteredMembers.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => toggleMemberSelection(member.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedMembers.includes(member.id)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar/Initials */}
                    <div className="relative">
                      {member.image_url && member.image_url.startsWith('http') ? (
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {member.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                      )}
                      {selectedMembers.includes(member.id) && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>

                    {/* Member Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 dark:text-white text-sm">
                        {member.name}
                      </h3>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        {member.designation}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
                          ID: {member.student_id}
                        </span>
                        <div className="flex gap-2">
                          <a
                            href={member.facebook_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-gray-500 hover:text-blue-600 transition"
                          >
                            <Facebook className="w-4 h-4" />
                          </a>
                          <a
                            href={member.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-gray-500 hover:text-blue-700 transition"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 truncate">
                        {member.email}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Email Composer */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-slate-700 sticky top-6">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Compose Email
              </h2>
            </div>

            {/* Email Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailContent.subject}
                  onChange={(e) => setEmailContent({ ...emailContent, subject: e.target.value })}
                  placeholder="Enter email subject..."
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-xl border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Message Body
                  </label>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </button>
                </div>
                {showPreview ? (
                  <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-300 dark:border-slate-600 min-h-[200px]">
                    <h3 className="font-bold mb-2">Preview:</h3>
                    <div dangerouslySetInnerHTML={{ __html: emailContent.body.replace(/\n/g, '<br>') }} />
                  </div>
                ) : (
                  <textarea
                    value={emailContent.body}
                    onChange={(e) => setEmailContent({ ...emailContent, body: e.target.value })}
                    placeholder="Write your email content here..."
                    rows="8"
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-xl border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Attachment (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="px-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 hover:border-blue-500 transition text-center">
                      <Paperclip className="w-5 h-5 inline mr-2" />
                      {emailContent.attachment ? emailContent.attachment.name : 'Choose file...'}
                    </div>
                  </label>
                  {emailContent.attachment && (
                    <button
                      onClick={() => setEmailContent({ ...emailContent, attachment: null })}
                      className="px-4 py-2 text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Recipient Count */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Recipients</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedMembers.length} member(s) selected
                    </p>
                  </div>
                  <span className="text-2xl font-black text-blue-600">
                    {selectedMembers.length}
                  </span>
                </div>
              </div>

              {/* Send Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendEmail}
                disabled={selectedMembers.length === 0}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                  selectedMembers.length === 0
                    ? 'bg-gray-300 dark:bg-slate-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                <Send className="w-6 h-6" />
                Send Email ({selectedMembers.length})
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-black text-gray-800 dark:text-white">
                  {members.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-black text-gray-800 dark:text-white">
                  {selectedMembers.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Selected</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <AtSign className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-black text-gray-800 dark:text-white">
                  {new Set(members.map(m => m.email)).size}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unique Emails</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Filter className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-3xl font-black text-gray-800 dark:text-white">
                  {members.filter(m => m.designation.toLowerCase().includes('secretary')).length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Secretaries</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}