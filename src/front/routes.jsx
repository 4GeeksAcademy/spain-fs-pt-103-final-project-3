// src/front/routes.jsx
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate
} from "react-router-dom";

import { Layout }   from "./pages/Layout";
import { Login }    from "./pages/Login";
import { Register } from "./pages/Register";
// (tus otras páginas: Home, Demo, Single...)

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      {/* Al entrar a “/” redirige automáticamente a “/login” */}
      <Route index element={<Navigate to="/login" replace />} />

      {/* rutas públicas */}
      <Route path="login"    element={<Login />} />
      <Route path="register" element={<Register />} />

      {/* rutas privadas (si las necesitas) */}
    
    </Route>
  )
);
