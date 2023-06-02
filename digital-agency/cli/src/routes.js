import {
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  FORM_ROUTE,
  PROJECT_ROUTE,
  CLIENT_ROUTE,
} from "./utils/consts";
import Auth from "./pages/Auth";
import FormPage from "./pages/FormPage";

import {
  Area,
  Bar,
  Calendar,
  ColorMapping,
  Customers,
  Ecommerce,
  Editor,
  Employees,
  Financial,
  Kanban,
  Line,
  Orders,
  Pie,
  Pyramid,
  Stacked,
} from "./pages/dasboard";
import React from "react";
import ProjectPage from "./components/Projects/ProjectPage";
import Projects from "./pages/dasboard/Projects";
import Clients from "./pages/dasboard/Clients";
import Chat from "./pages/Chat/Chat";
import { Messages } from "./pages/Messages";
import MyProfile from "./pages/MyProfile";
import Requests from "./pages/dasboard/Requests";
import TestList from "./components/Dashboard/Requests/test";
import AddRequest from "./components/Dashboard/Requests/AddRequest";
import ViewRequest from "./components/Dashboard/Requests/ViewRequest";
import EditRequest from "./components/Dashboard/Requests/EditRequest";
import Landing from "./pages/landing/Landing";
import AddProject from "./components/Projects/AddProject";
import EditProject from "./components/Projects/EditProject";
import EmployeesProject from "./components/Projects/EmployeesProject";

export const clientRoutes = [
  // dashboard
  { path: "/", Component: <Ecommerce /> },

  { path: "/ecommerce", Component: <Ecommerce /> },

  // pages
  { path: "/projects", Component: <Projects /> },
  { path: "/projects/:id", Component: <ProjectPage /> },

  { path: "/clients", Component: <Clients /> },

  { path: "/requests", Component: <Requests /> },
  { path: "/requests/view/:id", Component: <ViewRequest /> },
  { path: "/test", Component: <TestList /> },

  { path: "/chats", Component: <Chat /> },
  { path: "/myProfile", Component: <MyProfile /> },
  { path: "/messages", Component: <Messages /> },
  { path: "/orders", Component: <Orders /> },
  {
    path: "/employees",
    Component: <Employees />,
  },
  { path: "/customers", Component: <Customers /> },

  // apps
  { path: "/kanban", Component: <Kanban /> },
  { path: "/editor", Component: <Editor /> },
  { path: "/calendar", Component: <Calendar /> },

  {
    path: "client/:id",
    Component: <ProjectPage />,
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
  { path: "/messages", Component: <Messages /> },
  { path: "/orders", Component: <Orders /> },
  {
    path: "/employees",
    Component: <Employees />,
  },
  { path: "/customers", Component: <Customers /> },

  // apps
  { path: "/kanban", Component: <Kanban /> },
  { path: "/editor", Component: <Editor /> },
  { path: "/calendar", Component: <Calendar /> },

  // charts
  { path: "/line", Component: <Line /> },
  { path: "/area", Component: <Area /> },
  { path: "/bar", Component: <Bar /> },
  { path: "/pie", Component: <Pie /> },
  { path: "/financial", Component: <Financial /> },
  { path: "/color-mapping", Component: <ColorMapping /> },
  { path: "/pyramid", Component: <Pyramid /> },
  { path: "/stacked", Component: <Stacked /> },
  {
    path: "/client/:id",
    Component: <ProjectPage />,
  },
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
