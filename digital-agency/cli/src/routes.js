import {
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  FORM_ROUTE,
} from "./utils/consts";
import Auth from "./pages/landing/Auth";
import FormPage from "./pages/landing/FormPage";

import {
  Calendar,
  Customers,
  Ecommerce,
  Employees,
  Kanban,
  Orders,
} from "./pages/dasboard";
import React from "react";
import ProjectPage from "./components/Projects/ProjectPage";
import Projects from "./pages/dasboard/Projects";
import Clients from "./pages/dasboard/Clients";
import Chat from "./pages/Chat/Chat";
import MyProfile from "./pages/MyProfile";
import Requests from "./pages/dasboard/Requests";
import AddRequest from "./components/Requests/AddRequest";
import ViewRequest from "./components/Requests/ViewRequest";
import EditRequest from "./components/Requests/EditRequest";
import Landing from "./pages/landing/Landing";
import AddProject from "./components/Projects/AddProject";
import EditProject from "./components/Projects/EditProject";
import EmployeesProject from "./components/Projects/EmployeesProject";
import ProfilePage from "./components/Projects/ProfilePage";
import ItsmDashboard from "./components/admin/itsm-dashboard";
import MonitoringDashboard from "./components/admin/monitoring-dashboard";
import ProcessMetricsPage from "./components/admin/process-metrics/ProcessMetricsPage";
import IncidentPage from "./components/admin/incidents/IncidentPage";
import FeedbackDashboard from "./components/Dashboard/FeedbackDashboard.jsx";

export const clientRoutes = [
  // dashboard
  { path: "/", element: <Ecommerce /> },

  { path: "/ecommerce", element: <Ecommerce /> },

  // pages
  { path: "/projects", element: <Projects /> },
  { path: "/projects/:id", element: <ProjectPage /> },

  { path: "/clients", element: <Clients /> },

  { path: "/requests", element: <Requests /> },
  { path: "/requests/add", element: <AddRequest /> },
  { path: "/requests/view/:id", element: <ViewRequest /> },

  { path: "/chats", element: <Chat /> },
  { path: "/myProfile", element: <MyProfile /> },
  { path: "/orders", element: <Orders /> },
  {
    path: "/employees",
    element: <Employees />,
  },
  { path: "/customers", element: <Customers /> },

  // apps
  { path: "/kanban", element: <Kanban /> },
  { path: "/calendar", element: <Calendar /> },

  {
    path: "/profile/:id",
    element: <ProfilePage />,
  },
  
  // Feedback Dashboard
  { path: "/feedback-dashboard", element: <FeedbackDashboard /> },
];

export const employeeRoutes = [
  // dashboard
  { path: "/", element: <Ecommerce /> },

  { path: "/ecommerce", element: <Ecommerce /> },

  // pages
  { path: "/projects", element: <Projects /> },
  { path: "/projects/:id", element: <ProjectPage /> },
  { path: "/projects/add", element: <AddProject /> },
  { path: "/projects/edit/:id", element: <EditProject /> },

  { path: "/clients", element: <Clients /> },

  { path: "/requests", element: <Requests /> },
  { path: "/test", element: <EmployeesProject /> },
  { path: "/requests/add", element: <AddRequest /> },
  { path: "/requests/view/:id", element: <ViewRequest /> },
  { path: "/requests/edit/:id", element: <EditRequest /> },

  { path: "/chats", element: <Chat /> },
  { path: "/myProfile", element: <MyProfile /> },
  { path: "/orders", element: <Orders /> },
  {
    path: "/employees",
    element: <Employees />,
  },
  { path: "/customers", element: <Customers /> },

  // apps
  { path: "/kanban", element: <Kanban /> },
  { path: "/calendar", element: <Calendar /> },

  {
    path: "/profile/:id",
    element: <ProfilePage />,
  },

  // ITSM Dashboard
  { path: "/itsm", element: <ItsmDashboard /> },
  
  // Monitoring Dashboard
  { path: "/monitoring", element: <MonitoringDashboard /> },

  // Process Metrics Dashboard
  { path: "/process-metrics", element: <ProcessMetricsPage /> },

  // Incidents Management
  { path: "/incidents", element: <IncidentPage /> },
  
  // Feedback Dashboard
  { path: "/feedback-dashboard", element: <FeedbackDashboard /> },
];

export const publicRoutes = [
  { path: "/", element: <Landing /> },
  {
    path: FORM_ROUTE,
    element: <FormPage />,
  },
  {
    path: LOGIN_ROUTE,
    element: <Auth />,
  },
  {
    path: REGISTRATION_ROUTE,
    element: <Auth />,
  },
];
