// src/front/pages/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";   // <-- CORRECTO
import ScrollToTop from "../components/ScrollToTop";
import { Navbar }    from "../components/Navbar";
import { Footer }    from "../components/Footer";

export const Layout = () => (
  <ScrollToTop>
    <Navbar />
    {/* Aquí es donde React Router mete la página activa: Login, Register, Home... */}
    <main>
      <Outlet />
    </main>
    <Footer />
  </ScrollToTop>
);
