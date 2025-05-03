// src/routes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import NotFound from "./Notfound";
import Login from "./authentication/login.jsx";
import Register from "./authentication/register";

import UsersIndex from "./dashboard/users/index";
import UsersEdit from "./dashboard/users/edit";
import UsersNew from "./dashboard/users/new";

import LocationsIndex from "./dashboard/locations/index";
import LocationsEdit from "./dashboard/locations/edit";
import LocationsNew from "./dashboard/locations/new";

import InventoryIndex from "./dashboard/inventory/index";
import InventoryEdit from "./dashboard/inventory/edit";
import InventoryNew from "./dashboard/inventory/new";

import TransactionsIndex from "./dashboard/transactions/index";
import TransactionsEdit from "./dashboard/transactions/edit";
import TransactionsNew from "./dashboard/transactions/new";

const routeConfig = [
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/users", element: <UsersIndex /> },
  { path: "/users/:id", element: <UsersEdit /> },
  { path: "/users/new", element: <UsersNew /> },
  { path: "/locations", element: <LocationsIndex /> },
  { path: "/locations/:id", element: <LocationsEdit /> },
  { path: "/locations/new", element: <LocationsNew /> },
  { path: "/inventory", element: <InventoryIndex /> },
  { path: "/inventory/:id", element: <InventoryEdit /> },
  { path: "/inventory/new", element: <InventoryNew /> },
  { path: "/transactions", element: <TransactionsIndex /> },
  { path: "/transactions/:id", element: <TransactionsEdit /> },
  { path: "/transactions/new", element: <TransactionsNew /> },
];

const AppRoutes = () => {
  return (
    <Routes>
      {routeConfig.map(({ path, element }, idx) => (
        <Route key={idx} path={path} element={element} />
      ))}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
