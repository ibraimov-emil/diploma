import Admin from "./pages/Admin";
import {
    ADMIN_ROUTE,
    BASKET_ROUTE,
    DEVICE_ROUTE,
    LOGIN_ROUTE,
    REGISTRATION_ROUTE,
    SHOP_ROUTE,
    FORM_ROUTE,
    PROJECT_ROUTE, CLIENT_ROUTE,
} from "./utils/consts";
import Basket from "./pages/Basket";
import Shop from "./pages/Shop";
import Auth from "./pages/Auth";
import DevicePage from "./pages/DevicePage";
import { Form } from "react-bootstrap";
import FormPage from "./pages/FormPage";
import { Route } from "react-router-dom";
import {
  Area,
  Bar,
  Calendar,
  ColorMapping,
  ColorPicker,
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
import ProjectPage from "./pages/ProjectPage";
import { GrProjects } from "react-icons/gr";
import Projects from "./pages/dasboard/Projects";
import Clients from "./pages/dasboard/Clients";

export const authRoutes = [
  {
    path: ADMIN_ROUTE,
    Component: <Admin />,
  },
  {
    path: BASKET_ROUTE,
    Component: <Basket />,
  },
   // dashboard
   { path: "/", Component: <Ecommerce /> },

   { path: "/ecommerce", Component: <Ecommerce /> },
 
   // pages
   { path: "/projects", Component: <Projects /> },
   { path: "/clients", Component: <Clients /> },
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
   { path: "/color-picker", Component: <ColorPicker /> },
 
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
    path: PROJECT_ROUTE + "/:id",
    Component: <ProjectPage />,
  },
    {
    path: CLIENT_ROUTE + "/:id",
    Component: <ProjectPage />,
  },
  {
    path: SHOP_ROUTE,
    Component: <Shop />,
  },
];

export const publicRoutes = [
  {
    path: FORM_ROUTE,
    Component: <FormPage />,
  },
  {
    path: SHOP_ROUTE,
    Component: <Shop />,
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
