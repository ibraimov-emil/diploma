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

export const clientRoutes = [
  // dashboard
  { path: "/", Component: <Ecommerce /> },

  { path: "/ecommerce", Component: <Ecommerce /> },

  // pages
  { path: "/projects", Component: <Projects /> },
  { path: "/projects/:id", Component: <ProjectPage /> },

  { path: "/clients", Component: <Clients /> },

  { path: "/requests", Component: <Requests /> },
  { path: "/requests/add", Component: <AddRequest /> },
  { path: "/requests/view/:id", Component: <ViewRequest /> },

  { path: "/chats", Component: <Chat /> },
  { path: "/myProfile", Component: <MyProfile /> },
  { path: "/orders", Component: <Orders /> },
  {
    path: "/employees",
    Component: <Employees />,
  },
  { path: "/customers", Component: <Customers /> },

  // apps
  { path: "/kanban", Component: <Kanban /> },
  { path: "/calendar", Component: <Calendar /> },

  {
    path: "/profile/:id",
    Component: <ProfilePage />,
  },
];

export const employeeRoutes = [
  // dashboard
  { path: "/", Component: <Ecommerce /> },

  { path: "/ecommerce", Component: <Ecommerce /> },

  // pages
  { path: "/projects", Component: <Projects /> },
  { path: "/projects/:id", Component: <ProjectPage /> },
  { path: "/projects/add", Component: <AddProject /> },
  { path: "/projects/edit/:id", Component: <EditProject /> },

  { path: "/clients", Component: <Clients /> },

  { path: "/requests", Component: <Requests /> },
  { path: "/test", Component: <EmployeesProject /> },
  { path: "/requests/add", Component: <AddRequest /> },
  { path: "/requests/view/:id", Component: <ViewRequest /> },
  { path: "/requests/edit/:id", Component: <EditRequest /> },

  { path: "/chats", Component: <Chat /> },
  { path: "/myProfile", Component: <MyProfile /> },
  { path: "/orders", Component: <Orders /> },
  {
    path: "/employees",
    Component: <Employees />,
  },
  { path: "/customers", Component: <Customers /> },

  // apps
  { path: "/kanban", Component: <Kanban /> },
  { path: "/calendar", Component: <Calendar /> },

  {
    path: "/profile/:id",
    Component: <ProfilePage />,
  },

  // ITSM Dashboard
  { path: "/itsm", Component: <ItsmDashboard /> },
  
  // Monitoring Dashboard
  { path: "/monitoring", Component: <MonitoringDashboard /> },

  // Process Metrics Dashboard
  { path: "/process-metrics", Component: <ProcessMetricsPage /> },

  // Incidents Management
  { path: "/incidents", Component: <IncidentPage /> },
];

export const publicRoutes = [
  { path: "/", Component: <Landing /> },
  {
    path: FORM_ROUTE,
    Component: <FormPage />,
  },
  {
    path: LOGIN_ROUTE,
    Component: <Auth />,
  },
  {
    path: REGISTRATION_ROUTE,
    Component: <Auth />,
  },
];
