import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { gapi } from "gapi-script";
import {
  Calendar, Users, Send, RefreshCw, XCircle, CheckCircle,
  Clock, MapPin, FileText, UserCheck, UserX, AlertCircle,
  Building, ExternalLink, CalendarDays, Mail
} from "lucide-react";

/* ---------------- GOOGLE CONFIG ---------------- */
const GOOGLE_CLIENT_ID = "YOUR_CLIENT_ID.apps.googleusercontent.com";
const GOOGLE_API_KEY = "YOUR_API_KEY";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

/* ---------------- MEMBERS ---------------- */
const initialTeamMembers = [
  {
    id: 1,
    designation: "Director",
    name: "Professor Dr. Kazi Masudul Alam",
    student_id: "210123",
    image_url: "https://i.ibb.co.com/bXynWfb/Money.png",
    email: "username1@email.com",
  },
  {
    id: 2,
    designation: "President",
    name: "Tahmid Hasan Tasfi",
    student_id: "210218",
    image_url: "https://i.ibb.co/TqxvVFb3/tasfi.jpg",
    email: "username1@email.com",
  },
  {
    id: 3,
    designation: "Vice President-1",
    name: "Md Tasbi Hassan",
    student_id: "210216",
    image_url: "https://i.ibb.co/4RhPX7Ks/tasbi.jpg",
    email: "username2@email.com",
  },
  {
    id: 4,
    designation: "Vice President-2",
    name: "Razu Sarder",
    student_id: "220220",
    image_url: "https://i.ibb.co/tpDz54TM/razu.jpg",
    email: "username3@email.com",
  },
  {
    id: 5,
    designation: "General Secretary",
    name: "Md Anjir Hossain",
    student_id: "210230",
    image_url: "https://i.ibb.co/1thHGwzw/anjir.jpg",
    email: "username4@email.com",
  },
  {
    id: 6,
    designation: "Joint Secretary",
    name: "Sohag Chandra",
    student_id: "220238",
    image_url: "https://i.ibb.co/jZ5W0PJJ/sohag.jpg",
    email: "username5@email.com",
  },
  {
    id: 7,
    designation: "Treasurer",
    name: "Md Ashiquzzaman Rahad",
    student_id: "210201",
    image_url: "https://i.ibb.co/yB7kHjfZ/rahad.jpg",
    email: "username6@email.com",
  },
  {
    id: 8,
    designation: "Programming Campaign Secretary",
    name: "Nahid Hassan",
    student_id: "220229",
    image_url: "https://i.ibb.co/cKHbZNg6/nahid.jpg",
    email: "username7@email.com",
  },
  {
    id: 9,
    designation: "Workshop Secretary",
    name: "Muhammad Fahim",
    student_id: "210210",
    image_url: "https://i.ibb.co/nq871XvD/Fahim.png",
    email: "username8@email.com",
  },
  {
    id: 10,
    designation: "Assistant Workshop Secretary",
    name: "Sardar Muhammad Sakib Hossain",
    student_id: "230222",
    image_url: "https://i.ibb.co.com/gDLBssv/230222-Sardar-Muhammad-Sakib-Hossain.jpg",
    email: "username9@email.com",
  },
];

const EXECUTIVE_ROLES = [
  "director",
  "president",
  "vice president",
  "secretary",
  "treasurer"
];

const executiveMembers = initialTeamMembers.filter(m =>
  EXECUTIVE_ROLES.some(r => m.designation.toLowerCase().includes(r))
);

/* ---------------- COMPONENT ---------------- */
export default function CreateMeeting() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Cluster Conference Room");
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date(Date.now() + 60 * 60 * 1000)); // 1 hour later
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [eventId, setEventId] = useState(null);
  const [meetingLink, setMeetingLink] = useState("");
  const [isGoogleReady, setIsGoogleReady] = useState(false);

  /* ---------- GOOGLE INIT ---------- */
  useEffect(() => {
    const initGoogleApi = async () => {
      try {
        await gapi.load("client:auth2", async () => {
          await gapi.client.init({
            apiKey: 'AIzaSyBQk3H6Wm8PTaW13s3GoCkcqwSycYBP_Fs',
            clientId: '738427621613-9742nii87q6595mn9sqgbmvjsgdcjonh.apps.googleusercontent.com',
            discoveryDocs: [
              "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
            ],
            scope: SCOPES
          });
          setIsGoogleReady(true);
        });
      } catch (error) {
        console.error("Google API initialization failed:", error);
      }
    };
    initGoogleApi();
  }, []);

  const signIn = () => gapi.auth2.getAuthInstance().signIn();

  /* ---------- SELECT HELPERS ---------- */
  const selectAllExecutives = () =>
    setSelectedEmails(executiveMembers.map(m => m.email));

  const selectTopOnly = () =>
    setSelectedEmails(
      executiveMembers
        .filter(m =>
          ["director", "president"].some(r =>
            m.designation.toLowerCase().includes(r)
          )
        )
        .map(m => m.email)
    );

  const clearAll = () => setSelectedEmails([]);

  /* ---------- GOOGLE EVENT ---------- */
  const sendEvent = async (mode = "create") => {
    if (!title.trim()) {
      alert("Meeting title is required");
      return;
    }

    if (selectedEmails.length === 0) {
      alert("Please select at least one executive member");
      return;
    }

    if (!isGoogleReady) {
      alert("Google Calendar API is not ready yet. Please wait...");
      return;
    }

    try {
      await signIn();

      const event = {
        summary: title,
        description: description || "Cluster Executive Meeting",
        location,
        start: { 
          dateTime: start.toISOString(), 
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone 
        },
        end: { 
          dateTime: end.toISOString(), 
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone 
        },
        attendees: selectedEmails.map(email => ({ email })),
        conferenceData: {
          createRequest: {
            requestId: `cluster-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 30 }
          ]
        }
      };

      if (mode === "create") {
        const res = await gapi.client.calendar.events.insert({
          calendarId: "primary",
          resource: event,
          conferenceDataVersion: 1,
          sendUpdates: "all"
        });
        setEventId(res.result.id);
        setMeetingLink(res.result.hangoutLink || res.result.htmlLink);
        alert(`✅ Meeting created successfully! Invitations sent to ${selectedEmails.length} members.`);
      }

      if (mode === "update") {
        await gapi.client.calendar.events.patch({
          calendarId: "primary",
          eventId,
          resource: event,
          conferenceDataVersion: 1,
          sendUpdates: "all"
        });
        alert("✅ Meeting updated & notifications resent!");
      }

      if (mode === "cancel") {
        await gapi.client.calendar.events.delete({
          calendarId: "primary",
          eventId,
          sendUpdates: "all"
        });
        setEventId(null);
        setMeetingLink("");
        alert("❌ Meeting cancelled & notifications sent.");
      }
    } catch (error) {
      console.error("Google Calendar error:", error);
      alert("Failed to process calendar event. Check console for details.");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white mb-3 flex items-center gap-3">
          <Calendar className="text-blue-600 dark:text-blue-400" />
          Executive <span className="text-blue-600 dark:text-blue-400">Meeting Scheduler</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Schedule meetings, invite executives, and sync with Google Calendar.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Panel: Meeting Details */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 mb-8 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <CalendarDays className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Meeting Details
              </h2>
            </div>

            {/* Meeting Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meeting Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Monthly Executive Review"
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-xl border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Meeting agenda, discussion points, etc."
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-xl border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Start Time
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={start}
                      onChange={setStart}
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-xl border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    End Time
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={end}
                      onChange={setEnd}
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-xl border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Meeting room or virtual link"
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-xl border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Executive Selection */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Select Executives ({executiveMembers.length})
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={selectAllExecutives}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-medium hover:bg-blue-200 dark:hover:bg-blue-800/50 transition flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  Select All
                </button>
                <button
                  onClick={selectTopOnly}
                  className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl font-medium hover:bg-purple-200 dark:hover:bg-purple-800/50 transition flex items-center gap-2"
                >
                  <Building className="w-4 h-4" />
                  Top Leadership
                </button>
                <button
                  onClick={clearAll}
                  className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-200 dark:hover:bg-red-800/50 transition flex items-center gap-2"
                >
                  <UserX className="w-4 h-4" />
                  Clear All
                </button>
              </div>
            </div>

            {/* Selected Count */}
            {selectedEmails.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-6 h-6" />
                    <div>
                      <p className="font-bold">{selectedEmails.length} executive(s) selected</p>
                      <p className="text-sm opacity-90">Will receive meeting invitations</p>
                    </div>
                  </div>
                  <span className="text-2xl font-black">{selectedEmails.length}</span>
                </div>
              </motion.div>
            )}

            {/* Executive List */}
            <div className="grid md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
              {executiveMembers.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() =>
                    setSelectedEmails(prev =>
                      prev.includes(member.email)
                        ? prev.filter(e => e !== member.email)
                        : [...prev, member.email]
                    )
                  }
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedEmails.includes(member.email)
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      {member.image_url && member.image_url.startsWith('http') ? (
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 dark:border-slate-600"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {member.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                      )}
                      {selectedEmails.includes(member.email) && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
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
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
                          ID: {member.student_id}
                        </span>
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

        {/* Right Panel: Actions & Status */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-slate-700 sticky top-6">
            <div className="flex items-center gap-3 mb-6">
              <Send className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Schedule Actions
              </h2>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => sendEvent("create")}
                disabled={!title || selectedEmails.length === 0}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                  !title || selectedEmails.length === 0
                    ? 'bg-gray-300 dark:bg-slate-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                <Calendar className="w-6 h-6" />
                Create Meeting
              </motion.button>

              {eventId && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => sendEvent("update")}
                    className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <RefreshCw className="w-6 h-6" />
                    Update & Resend
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => sendEvent("cancel")}
                    className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <XCircle className="w-6 h-6" />
                    Cancel Meeting
                  </motion.button>
                </>
              )}

              {/* Meeting Link */}
              {meetingLink && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                  <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Meeting Link
                  </h3>
                  <a
                    href={meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate block"
                  >
                    {meetingLink}
                  </a>
                </div>
              )}

              {/* Status */}
              <div className="mt-6">
                <div className={`p-4 rounded-xl flex items-center gap-3 ${
                  isGoogleReady 
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                    : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                }`}>
                  {isGoogleReady ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <div>
                    <p className="font-medium">
                      {isGoogleReady ? 'Google Calendar Connected' : 'Connecting to Google...'}
                    </p>
                    <p className="text-sm opacity-80">
                      {isGoogleReady ? 'Ready to schedule meetings' : 'Please wait...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Meeting Summary
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Executives Selected</span>
                <span className="font-bold text-gray-800 dark:text-white">{selectedEmails.length}/{executiveMembers.length}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Meeting Duration</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {Math.round((end - start) / (1000 * 60 * 60))}h
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Scheduled Date</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Time Slot</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
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
                  {executiveMembers.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Executives</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-black text-gray-800 dark:text-white">
                  {selectedEmails.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Selected</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-black text-gray-800 dark:text-white">
                  {eventId ? 1 : 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Meetings</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-3xl font-black text-gray-800 dark:text-white">
                  {Math.round((end - start) / (1000 * 60))}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Minutes Duration</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}