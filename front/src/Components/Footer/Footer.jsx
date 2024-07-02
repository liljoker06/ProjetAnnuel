import React from "react";
import { FaYoutube, FaFacebook, FaTwitter } from 'react-icons/fa';

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <footer className="footer p-10 bg-base-200 text-base-content">
        <nav>
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
          <a className="link link-hover">Advertisement</a>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
      </footer>
      <footer className="footer px-10 py-4 border-t bg-base-200 text-base-content border-base-300">
        <aside className="items-center grid-flow-col">
            <div className="logo h-14 w-36 mr-5"> {/* logo pris du css Navbar.Css*/}
            </div>
          <p>
            VitruveCloud Industries Ltd. <br />
            Meilleur Cloud Ever depuis le 31 Fev 2024
          </p>
        </aside>
        <nav className="md:place-self-center md:justify-self-end">
          <div className="grid grid-flow-col gap-4">

            <Link target="_blank" to='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>
                <FaYoutube size={24} className="fill-current" />
            </Link>

            <Link to=''>
                <FaTwitter size={24} className="fill-current" />
            </Link>
                
            <Link to=''>
                <FaFacebook size={24} className="fill-current" />
            </Link>

          </div>
        </nav>
      </footer>
    </>
  );
}
