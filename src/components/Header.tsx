import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-indigo_dye text-white p-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold m-0 p-0 leading-tight">
          Yuva Load Service
        </Link>
        {/* Hamburger menu for mobile */}
        <button
          className="md:hidden flex flex-col justify-center items-center"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
        {/* Navigation */}
        <nav
          className={`${
            menuOpen ? "block" : "hidden"
          } absolute top-16 left-0 w-full bg-indigo_dye md:static md:block md:w-auto`}
        >
          <ul className="flex flex-col md:flex-row md:space-x-4 md:items-center">
            <li>
              <Link
                to="/"
                className="block px-4 py-2 hover:text-gamboge-300 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/admin-login"
                className="block px-4 py-2 hover:text-gamboge-300 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Admin
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
