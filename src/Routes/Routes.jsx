import { createBrowserRouter, Navigate } from "react-router-dom";
import Main from "../Layout/Main/Main";
import Home from "../Pages/Home/Home";
import Events from "../Pages/Events/Events";
import Projects from "../Pages/Projects/Projects";
import Resources from "../Pages/Resources/Resources";
import Blog from "../Pages/Blog/BlogsPage";
import Alumni from "../Pages/Alumni/Alumni";
import Contact from "../Pages/Contact/Contact";
import Profile from "../Shared/Profile/Profile";
import Posts from "../Pages/Posts/Posts";
import Login from "../Shared/Login/LoginPage";
import Signup from "../Shared/Login/Signup";
import Logout from "../Shared/Login/LogoutPage";
import ErrorPage from "../Shared/ErrorPage/ErrorPage";


import Dashboard from "../Layout/Dashboard/DashBoard";
import HandleAdmin from "../Pages/Dashboard/Home/HandleAdmin";
import AdminDetail from "../Pages/Dashboard/Home/AdminDetail";
import DashboardEvents from "../Pages/Dashboard/Events/DashboardEvents";
import DashboardProjects from "../Pages/Dashboard/Projects/DashboardProjects";
import DashboardResources from "../Pages/Dashboard/Resources/DashboardResources";
import DashboardAlumni from "../Pages/Dashboard/Alumni/DashboardAlumni";
import DashboardContact from "../Pages/Dashboard/Contacts/DashboardContact";
import DashboardBlogs from "../Pages/Dashboard/Blogs/DashboardBlogs";
import EmailMembers from "../Pages/Dashboard/Message/EmailMembers";
import CreateMeeting from "../Pages/Dashboard/Message/CreateMeeting";
import DashboardPosts from "../Pages/Dashboard/Posts/DashboardPosts";


import ProtectedRoute from "./ProtectedRoute";
import PresidentRoute from "./PresidentRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/posts", element: <Posts /> },
      { path: "/events", element: <Events /> },
      { path: "/projects", element: <Projects /> },
      { path: "/resources", element: <Resources /> },
      { path: "/blog", element: <Blog /> },
      { path: "/alumni", element: <Alumni /> },
      { path: "/contact", element: <Contact /> },
      { path: "/profile", element: <Profile /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Signup /> },
      { path: "/logout", element: <Logout /> },
    ],
  },

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute requireAuth={true}>
        <Dashboard />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      // Home / Users management – only current president
      {
        path: "/dashboard",
        element: (
          <PresidentRoute>
            <HandleAdmin />
          </PresidentRoute>
        ),
      },

      // Admin/user detail – president only
      {
        path: "/dashboard/admins/:id",
        element: (
          <PresidentRoute>
            <AdminDetail />
          </PresidentRoute>
        ),
      },

      // Meeting creation – president only
      {
        path: "/dashboard/meeting",
        element: (
          <PresidentRoute>
            <CreateMeeting />
          </PresidentRoute>
        ),
      },

      // Email / communication – president or roles with 'email' permission
      {
        path: "/dashboard/emails",
        element: (
          <ProtectedRoute requiredPage="email">
            <EmailMembers />
          </ProtectedRoute>
        ),
      },

      // Posts – roles with 'posts' permission
      {
        path: "/dashboard/posts",
        element: (
          <ProtectedRoute requiredPage="posts">
            <DashboardPosts />
          </ProtectedRoute>
        ),
      },

      // Events – roles with 'events' permission
      {
        path: "/dashboard/events",
        element: (
          <ProtectedRoute requiredPage="events">
            <DashboardEvents />
          </ProtectedRoute>
        ),
      },

      // Projects
      {
        path: "/dashboard/projects",
        element: (
          <ProtectedRoute requiredPage="projects">
            <DashboardProjects />
          </ProtectedRoute>
        ),
      },

      // Resources
      {
        path: "/dashboard/resources",
        element: (
          <ProtectedRoute requiredPage="resources">
            <DashboardResources />
          </ProtectedRoute>
        ),
      },

      // Alumni
      {
        path: "/dashboard/alumni",
        element: (
          <ProtectedRoute requiredPage="alumni">
            <DashboardAlumni />
          </ProtectedRoute>
        ),
      },

      // Contacts
      {
        path: "/dashboard/contacts",
        element: (
          <ProtectedRoute requiredPage="contact">
            <DashboardContact />
          </ProtectedRoute>
        ),
      },

      // Blogs
      {
        path: "/dashboard/blogs",
        element: (
          <ProtectedRoute requiredPage="blogs">
            <DashboardBlogs />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Fallback
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);