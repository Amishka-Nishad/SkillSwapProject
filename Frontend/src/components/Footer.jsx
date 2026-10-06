import React from 'react'
import {
  FiGithub,
  FiLinkedin,
  FiInstagram
} from 'react-icons/fi'

import { Link } from 'react-router-dom'

const Footer = () => {

  return (
    <footer className="footer">

      <div className="container">

        <div className="row g-4">

          {/* =========================
              Brand
          ========================= */}

          <div className="col-lg-5 col-md-6 col-12">

            <Link
              to="/"
              className="footer-logo"
            >
              <span className="logo-icon">
                S
              </span>

              <span>
                SkillSwap
              </span>
            </Link>

            <p className="footer-description">
              Learn what you love, share what you know
              and grow together with SkillSwap.
            </p>


            {/* Social Links */}

            <div className="social-links">

              {/* External link → <a> is correct */}

              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <FiGithub />
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <FiLinkedin />
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <FiInstagram />
              </a>

            </div>

          </div>


          {/* =========================
              Platform
          ========================= */}

          <div className="col-lg-2 col-md-6 col-6">

            <h4>
              Platform
            </h4>

            <Link to="/explore-skills">
              Explore Skills
            </Link>

            <Link to="/how-it-works">
              How It Works
            </Link>

            <Link to="/dashboard/matches">
              Find Matches
            </Link>

          </div>


          {/* =========================
              Company
          ========================= */}

          <div className="col-lg-2 col-md-6 col-6">

            <h4>
              Company
            </h4>

            <Link to="/about">
              About Us
            </Link>

            <a href="mailto:nishadamishka@gmail.com">
              Contact
            </a>

            {/* Temporary route until Privacy page is created */}

            <Link to="/">
              Privacy
            </Link>

          </div>


          {/* =========================
              Support
          ========================= */}

          <div className="col-lg-3 col-md-6 col-12">

            <h4>
              Support
            </h4>

            <Link to="/">
              Help Center
            </Link>

            <Link to="/">
              Terms & Conditions
            </Link>

            <Link to="/">
              FAQ
            </Link>

          </div>

        </div>


        {/* =========================
            Footer Bottom
        ========================= */}

        <div className="footer-bottom">

          <p>
            © {new Date().getFullYear()} SkillSwap.
            All rights reserved.
          </p>

          <p>
            Learn • Share • Grow
          </p>

        </div>

      </div>

    </footer>
  )
}

export default Footer