import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [scrollPos, setScrollPos] = useState(0);
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    const navMenuDiv = document.getElementById("nav-content");
    const navMenu = document.getElementById("nav-toggle");

    const check = (e) => {
      const target = e.target;

      if (!checkParent(target, navMenuDiv)) {
        if (checkParent(target, navMenu)) {
          if (navMenuDiv.classList.contains("hidden")) {
            navMenuDiv.classList.remove("hidden");
            setScrollPos(11); // Simulate scroll
          } else {
            navMenuDiv.classList.add("hidden");
            setScrollPos(0); // Reset scroll position
          }
        } else {
          navMenuDiv.classList.add("hidden");
          setScrollPos(0); // Reset scroll position
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
  const navContentClass = scrollPos > 10 ? "bg-white" : "bg-transparent";
  const toggleColourClass = scrollPos > 10 ? "text-gray-800" : "text-white";
  const logoTitleClass = scrollPos > 10 ? "text-gray-800" : "text-white";

  return (
    <nav
      id="header"
      className={`fixed w-full z-30 top-0 text-white ${headerClass}`}
    >
      <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-2">
        <div className="pl-4 flex items-center">
          <div className="logo mr-3 h-10 w-10"></div>
          <a
            className={`toggleColour text-white no-underline hover:no-underline font-bold text-2xl lg:text-4xl ${logoTitleClass}`}
            href="#"
          >
            Vitruve Cloud
          </a>
        </div>

        {/* Mobile */}
        <div className="block lg:hidden pr-4">
          <button
            id="nav-toggle"
            className="flex items-center p-1 text-pink-800 hover:text-gray-900 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
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

        <div
          id="nav-content"
          className={`w-full flex-grow lg:flex lg:items-center lg:w-auto ${
            isHidden ? "hidden" : ""
          } mt-2 lg:mt-0 ${navContentClass} text-black p-4 lg:p-0 z-20`}
        >
          <ul className="list-reset lg:flex justify-end flex-1 items-center">
            <li className="mr-3">
              <a
                className={`inline-block py-2 px-4 text-black font-bold no-underline ${toggleColourClass}`}
                href="#"
              >
                Active
              </a>
            </li>
            <li className="mr-3">
              <a
                className="inline-block text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4"
                href="#"
              >
                link
              </a>
            </li>
            <li className="mr-3">
              <a
                className="inline-block text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4"
                href="#"
              >
                link
              </a>
            </li>
          </ul>
          <button
            id="navAction"
            className={`mx-auto lg:mx-0 hover:underline ${navActionClass} font-bold rounded-full mt-4 lg:mt-0 py-4 px-8 shadow opacity-75 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out`}
          >
            Action
          </button>
        </div>
      </div>
      <hr className="border-b border-gray-100 opacity-25 my-0 py-0" />
    </nav>
  );
}
