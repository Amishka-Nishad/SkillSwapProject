import React, { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const Navbar = () => {

  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <nav className="navbar navbar-expand-lg skillswap-navbar ">

      <div className="container ">

        {/* Logo */}

        <Link
          to="/"
          className="navbar-brand skillswap-logo"
          onClick={closeMenu}
        >
          <span className="logo-icon">
            S
          </span>

          <span className="logo-text">
            SkillSwap
          </span>
        </Link>


        {/* Mobile Button */}

        <button
          className="navbar-toggler custom-toggler"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>


        {/* Navigation */}

        <div
          className={`collapse navbar-collapse ${
            menuOpen ? 'show' : ''
          }`}
        >

          <ul className="navbar-nav mx-auto">

            {/* Home */}

            <li className="nav-item">
              <Link
                className="nav-link active"
                to="/"
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>


            {/* Explore Skills */}

            <li className="nav-item">
              <Link
                className="nav-link"
                to="/explore-skills"
                onClick={closeMenu}
              >
                Explore Skills
              </Link>
            </li>


            {/* How It Works */}

            <li className="nav-item">
              <Link
                className="nav-link"
                to="/how-it-works"
                onClick={closeMenu}
              >
                How It Works
              </Link>
            </li>


            {/* About Us */}

            <li className="nav-item">
              <Link
                className="nav-link"
                to="/about"
                onClick={closeMenu}
              >
                About Us
              </Link>
            </li>

          </ul>


          {/* Buttons */}

          <div className="navbar-buttons">

            {/* Login */}

            <Link
              to="/login"
              className="login-btn"
              onClick={closeMenu}
            >
              Login
            </Link>


            {/* Register */}

            <Link
              to="/register"
              className="join-btn"
              onClick={closeMenu}
            >
              Join Now
            </Link>

          </div>

        </div>

      </div>

    </nav>
  )
}

export default Navbar