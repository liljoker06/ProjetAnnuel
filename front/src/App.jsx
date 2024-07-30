/////////////////////////////////////////////
//Dépendances
import React from "react";
import { Routes, Route } from "react-router-dom";

/////////////////////////////////////////////
//CSS

import "./base.css"
import "./fonts.css";
import "./tailwind.css";

/////////////////////////////////////////////
//Components
import ScrollToTop from "./ScrollToTop";
import Navbar from "./Components/Navbar/Navbar";

import Home from "./Pages/Home/Home";
import Tarifs from "./Pages/Tarifs/Tarifs";

import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";

import Dashboard from "./Pages/Dashboard/Dashboard";

import Page404 from "./Pages/Page404/Page404";

import Footer from "./Components/Footer/Footer";

//////////////////////////////////////////////////////////////////////////////////////////


function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />

      <header>
        <Navbar />
      </header>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prices" element={<Tarifs />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="*" element={<Page404 />} />
      </Routes>

      <Footer />

    </div>
  );
}

export default App;
