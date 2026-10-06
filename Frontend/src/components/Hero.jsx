import React from 'react'
import {
  FiArrowRight,
  FiSearch,
  FiCheckCircle
} from 'react-icons/fi'

import { useNavigate } from 'react-router-dom'

const Hero = () => {

  const navigate = useNavigate()

  return (
    <section className="hero-section">

      <div className="hero-decoration hero-decoration-one"></div>
      <div className="hero-decoration hero-decoration-two"></div>

      <div className="container">

        <div className="row align-items-center g-5">

          {/* =========================
              Left Content
          ========================= */}

          <div className="col-lg-6 col-12">

            <div className="hero-content">

              <div className="hero-badge">
                <span></span>
                LEARN • SHARE • GROW
              </div>

              <h1>
                Learn what you love.
                <span>Share what you know.</span>
              </h1>

              <p className="hero-description">
                Exchange your skills with people who want to learn
                what you already know and discover something new.
              </p>

              <div className="hero-buttons">

                {/* Find My Match */}

                <button
                  className="primary-btn"
                  onClick={() => navigate('/dashboard/matches')}
                >
                  Find My Match
                  <FiArrowRight />
                </button>


                {/* Share My Skill */}

                <button
                  className="secondary-btn"
                  onClick={() => navigate('/dashboard/add-skill')}
                >
                  <FiSearch />
                  Share My Skill
                </button>

              </div>


              <div className="hero-trust">

                <div className="trust-icon">
                  <FiCheckCircle />
                </div>

                <span>
                  Learn from people. Share your knowledge.
                </span>

              </div>

            </div>

          </div>


          {/* =========================
              Right Visual
          ========================= */}

          <div className="col-lg-6 col-12">

            <div className="hero-visual">

              <div className="visual-circle"></div>

              <div className="match-card">

                <div className="match-card-header">

                  <p className="match-label">
                    YOUR SKILL MATCH
                  </p>

                  <span className="match-status">
                    <span></span>
                    Matched
                  </span>

                </div>


                <div className="match-users">

                  <div className="skill-person">

                    <div className="avatar purple-avatar">
                      A
                    </div>

                    <p>You</p>

                    <span>HTML</span>

                  </div>


                  <div className="match-connection">

                    <div className="connection-line"></div>

                    <div className="match-icon">
                      <FiArrowRight />
                    </div>

                    <div className="connection-line"></div>

                  </div>


                  <div className="skill-person">

                    <div className="avatar pink-avatar">
                      R
                    </div>

                    <p>Rahul</p>

                    <span>React</span>

                  </div>

                </div>


                <div className="match-score">

                  <div className="score-content">

                    <strong>92%</strong>

                    <div>
                      <span>Perfect Match</span>
                      <small>
                        Great skill compatibility
                      </small>
                    </div>

                  </div>

                </div>


                <div className="match-footer">

                  <span>
                    Skill Exchange
                  </span>

                  <FiCheckCircle />

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  )
}

export default Hero