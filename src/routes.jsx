// src/routes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import NotFound from "./Notfound";
import Login from "./authentication/login";
import Register from "./authentication/register";

import UsersIndex from "./dashboard/users/index";
import UsersEdit from "./dashboard/users/edit";
import UsersNew from "./dashboard/users/new";

const routeConfig = [
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/users", element: <UsersIndex /> },
  { path: "/users/:id", element: <UsersEdit /> },
  { path: "/users/new", element: <UsersNew /> },
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
