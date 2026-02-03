import Main from "../Layout/Main/Main";
// import AboutUs from "../Pages/AboutUs/AboutUs";
import Events from "../Pages/Events/Events";
import Home from "../Pages/Home/Home";
import { createBrowserRouter } from "react-router-dom";
import Projects from "../Pages/Projects/Projects";
import Resources from "../Pages/Resources/Resources";
import Blog from "../Pages/Blog/Blog";
import Alumni from "../Pages/Alumni/Alumni";
import Contact from "../Pages/Contact/Contact";
import Profile from "../Shared/Profile/Profile";
import DashboardEvents from "../Pages/Dashboard/Events/DashboardEvents";
import Dashboard from "../Layout/Dashboard/DashBoard";
import DashboardProjects from "../Pages/Dashboard/Projects/DashboardProjects";
import DashboardResources from "../Pages/Dashboard/Resources/DashboardResources";
import DashboardAlumni from "../Pages/Dashboard/Alumni/DashboardAlumni";
import DashboardContact from "../Pages/Dashboard/Contacts/DashboardContact";
import DashboardBlogs from "../Pages/Dashboard/Blogs/DashboardBlogs";
import EmailMembers from "../Pages/Dashboard/Message/EmailMembers";
import HandleAdmin from "../Pages/Dashboard/Home/HandleAdmin";
import SuperAdminRoute from "./SuperAdminRoute";
import Login from "../Shared/Login/LoginPage";
import Logout from "../Shared/Login/LogoutPage";
import AdminDetail from "../Pages/Dashboard/Home/AdminDetail";
import CreateMeeting from "../Pages/Dashboard/Message/CreateMeeting";
import ErrorPage from "../Shared/ErrorPage/ErrorPage";
import Signup from "../Shared/Login/Signup";
import DashboardPosts from "../Pages/Dashboard/Posts/DashboardPosts";
import Posts from "../Pages/Posts/Posts";
// import { Logout } from "../Shared/Login/LogoutPage";
// import EmailMembers from "../Pages/Dashboard/Home/DashboardHome";

export const router = createBrowserRouter([
    {
        path:"/",
        element: <Main></Main>,
        errorElement: <ErrorPage/>,
        children:[
            {
                path: '/',
                element: <Home></Home>
            },
            {
                path: '/posts',
                element:<Posts></Posts>
            },
            {
                path: '/events',
                element: <Events></Events>
            },
            {
                path: '/projects',
                element: <Projects></Projects>
            },
            {
                path: '/resources',
                element: <Resources></Resources>
            },
            {
                path: '/blog',
                element: <Blog />
            },
            {
                path: '/alumni',
                element: <Alumni />
            },
            {
                path: '/contact',
                element:<Contact />
            },
            {
                path: '/profile',
                element: <Profile />
            },
            {
                path: '/login',
                element: <Login/>
            },
            {
              path:'/logout',
              element:<Logout />
            },
            {
              path:'/register',
              element:<Signup />
            }
        ]
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
        errorElement: <ErrorPage/>,
        children: [
          {
            path: "/dashboard",
            element: (
              <SuperAdminRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']} allowedPages={['home']}>
                <HandleAdmin />
              </SuperAdminRoute>
            )
          },
          {
            path: "/dashboard/meeting",
            element: (
              <SuperAdminRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']} allowedPages={['invite_admin']}>
                <CreateMeeting />
              </SuperAdminRoute>
            )
          },
          {
            path: "/dashboard/admins/:id",
            element: (
              <SuperAdminRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']} allowedPages={['home']}>
                <AdminDetail />
              </SuperAdminRoute>
            )
          },
          {
            path: "/dashboard/posts",
            element: (
              <SuperAdminRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']} allowedPages={['posts']}>
                <DashboardPosts />
              </SuperAdminRoute>
            )
          },
          {
            path: "/dashboard/emails",
            element: (
              <SuperAdminRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']} allowedPages={['emails']}>
                <EmailMembers />
              </SuperAdminRoute>
            )
          },
          {
            path: "/dashboard/events",
            element: (
              <SuperAdminRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']} allowedPages={['events']}>
                <DashboardEvents />
              </SuperAdminRoute>
            )
          },
          {
            path: "/dashboard/projects",
            element: (
              <SuperAdminRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']} allowedPages={['projects']}>
                <DashboardProjects />
              </SuperAdminRoute>
            )
          },
          {
            path: "/dashboard/resources",
            element: (
              <SuperAdminRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']} allowedPages={['resources']}>
                <DashboardResources />
              </SuperAdminRoute>
            )
          },
          {
            path: "/dashboard/alumni",
            element: (
              <SuperAdminRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']} allowedPages={['alumni']}>
                <DashboardAlumni />
              </SuperAdminRoute>
            )
          },
          {
            path: "/dashboard/contacts",
            element: (
              <SuperAdminRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']} allowedPages={['contact']}>
                <DashboardContact />
              </SuperAdminRoute>
            )
          },
          {
            path: "/dashboard/blogs",
            element: (
              <SuperAdminRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']} allowedPages={['blogs']}>
                <DashboardBlogs />
              </SuperAdminRoute>
            )
          }
        ]
    }
])