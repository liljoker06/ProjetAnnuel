/////////////////////////////////////////////
//Dépendances
import React from "react";
import { Routes, Route } from "react-router-dom";

/////////////////////////////////////////////
//CSS

import "./fonts.css";
import "./tailwind.css";

/////////////////////////////////////////////
//Components
import Navbar from "./Components/Navbar/Navbar";

import Home from "./Pages/Home/Home";

import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";

import Page404 from "./Pages/Page404/Page404";

import Footer from "./Components/Footer/Footer";

//////////////////////////////////////////////////////////////////////////////////////////


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="*" element={<Page404 />} />
      </Routes>

      <Footer />

    </div>
  );
}

export default App;
