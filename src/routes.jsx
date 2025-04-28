// src/routes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./authentication/login";
import Register from "./authentication/register";
import NotFound from "./Notfound";

const routeConfig = [
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },
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
