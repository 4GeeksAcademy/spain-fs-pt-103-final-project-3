// src/front/routes.jsx
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Home } from "./pages/Home";
import { UserView } from "./pages/UserView"
import { Recipe } from "./pages/Recipe"
import { Private } from "./pages/Private"

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      {/* Al entrar a “/” redirige automáticamente a “/login” */}
      {/* <Route index element={<Navigate to="/login" replace />} /> */}

      {/* rutas públicas */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
      <Route path="/" element={<Home />} />

      <Route path="/user/:theId" element={
        <Private>
          <UserView />
        </Private>

      }
      />
      <Route path="/recipe" element={
        <Private>
          <Recipe />
        </Private>
      } />
      <Route path="/recipe/:theId" element={
        <Private>
          <Recipe />
        </Private>
      } />
    </Route>
  )
);
