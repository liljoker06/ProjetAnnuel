import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { NavLink, useLocation } from "react-router-dom";

export default function Navbar() {
  const [scrollPos, setScrollPos] = useState(0);
  const [isHidden, setIsHidden] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const navMenuDiv = document.getElementById("nav-content");
    const navMenu = document.getElementById("nav-toggle");

    const check = (e) => {
      const target = e.target;

      if (navMenuDiv && navMenu) {
        if (!checkParent(target, navMenuDiv)) {
          if (checkParent(target, navMenu)) {
            if (navMenuDiv.classList.contains("hidden")) {
              navMenuDiv.classList.remove("hidden");
              setScrollPos(11);
            } else {
              navMenuDiv.classList.add("hidden");
              setScrollPos(11);
            }
          } else {
            navMenuDiv.classList.add("hidden");
            setScrollPos(0);
          }
        }
      }
    };

    const checkParent = (t, elm) => {
      while (t.parentNode) {
        if (t === elm) {
          return true;
        }
        t = t.parentNode;
      }
      return false;
    };

    document.addEventListener("click", check);

    return () => {
      document.removeEventListener("click", check);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const newScrollPos = window.scrollY;
      setScrollPos(newScrollPos);
    };

    const onClick = (e) => {
      if (e.target.id !== "nav-toggle" && e.target.id !== "nav-content") {
        setIsHidden(true);
      } else if (e.target.id === "nav-toggle") {
        setIsHidden(!isHidden);
      }
    };

    window.addEventListener("scroll", onScroll);
    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onClick);
    };
  }, [isHidden]);

  const headerClass = scrollPos > 10 ? "bg-white shadow" : "";
  const navActionClass = scrollPos > 10 ? "gradient text-white" : "bg-white text-gray-800";
  const activeColourClass = scrollPos > 10 ? "text-gray-800" : "text-white";
  const logoTitleClass = scrollPos > 10 ? "text-blue-500" : "text-white";

  if (location.pathname === '/dashboard') {
    return null; 
  }
  
  return (
    <nav id="header" className={`fixed w-full z-50 top-0 text-white ${headerClass} transition-main`}>
      <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-2">
        <div className="pl-4 flex items-center">
          <div className="logo mr-3 h-10 w-10"></div>
          <NavLink className={`toggleColour no-underline hover:no-underline font-bold text-2xl lg:text-4xl ${logoTitleClass} transition-main`} to="/">
            Vitruve Cloud
          </NavLink>
        </div>

        {/* Mobile */}
        <div className="block lg:hidden pr-4">
          <button id="nav-toggle" className="flex items-center p-1 text-pink-800 hover:text-blue-900 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
            <svg
              className="fill-current h-6 w-6"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>

        <div id="nav-content" className={`w-full flex-grow lg:flex lg:items-center lg:w-auto ${isHidden ? "hidden" : ""} mt-2 lg:mt-0 text-black p-4 lg:p-0 z-20`}>
          <ul className="list-reset lg:flex justify-end flex-1 items-center">
            <li className="mr-3">
              <NavLink className={`inline-block text-black no-underline hover:text-blue-800 hover:text-underline py-2 px-4`} to="/prices">
                Tarifs
              </NavLink>
            </li>
            <li className="mr-3">
              <NavLink className="inline-block text-black no-underline hover:text-blue-800 hover:text-underline py-2 px-4" to="/fonctionnalité">
                Fonctionnalitées
              </NavLink>
            </li>
            <li className="mr-3">
              <NavLink className="inline-block text-black no-underline hover:text-blue-800 hover:text-underline py-2 px-4" to="/contact">
                Contact
              </NavLink>
            </li>
          </ul>
          <NavLink to="/login" id="navAction" className={`mx-auto lg:mx-0 hover:underline ${navActionClass} transition-main font-bold rounded-full mt-4 lg:mt-0 py-4 px-8 shadow opacity-75 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out`}>
            Connexion
          </NavLink>
        </div>
      </div>
      <hr className="border-b border-blue-100 opacity-25 my-0 py-0" />
    </nav>
  );
}