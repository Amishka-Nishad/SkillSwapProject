import React from 'react'
import {
  FaCode,
  FaReact,
  FaPython
} from 'react-icons/fa'
import {
  FiPenTool,
  FiEdit3,
  FiSmartphone,
  FiArrowRight,
  FiUsers
} from 'react-icons/fi'

const PopularSkills = () => {

  return (
    <section className="popular-skills-section">

      <div className="container">

        {/* Section Heading */}

        <div className="section-heading">

          <div className="section-tag-wrapper">
            <span className="section-tag-dot"></span>

            <p className="section-tag">
              EXPLORE YOUR INTERESTS
            </p>
          </div>

          <h2>
            Find a skill.
            <span> Share a skill.</span>
          </h2>

          <p className="section-description">
            Discover skills you want to learn or share
            something you already know.
          </p>

        </div>


        {/* Skills */}

        <div className="row g-4">

          {/* Web Development */}

          <div className="col-lg-4 col-md-6 col-12">
            <div className="skill-card">

              <div className="skill-card-top">
                <div className="skill-icon">
                  <FaCode />
                </div>

                <span className="skill-arrow">
                  <FiArrowRight />
                </span>
              </div>

              <h3>
                Web Development
              </h3>

              <div className="skill-learners">
                <FiUsers />
                <span>120+ learners</span>
              </div>

            </div>
          </div>


          {/* React */}

          <div className="col-lg-4 col-md-6 col-12">
            <div className="skill-card">

              <div className="skill-card-top">
                <div className="skill-icon">
                  <FaReact />
                </div>

                <span className="skill-arrow">
                  <FiArrowRight />
                </span>
              </div>

              <h3>
                React
              </h3>

              <div className="skill-learners">
                <FiUsers />
                <span>95+ learners</span>
              </div>

            </div>
          </div>


          {/* Python */}

          <div className="col-lg-4 col-md-6 col-12">
            <div className="skill-card">

              <div className="skill-card-top">
                <div className="skill-icon">
                  <FaPython />
                </div>

                <span className="skill-arrow">
                  <FiArrowRight />
                </span>
              </div>

              <h3>
                Python
              </h3>

              <div className="skill-learners">
                <FiUsers />
                <span>80+ learners</span>
              </div>

            </div>
          </div>


          {/* UI/UX */}

          <div className="col-lg-4 col-md-6 col-12">
            <div className="skill-card">

              <div className="skill-card-top">
                <div className="skill-icon">
                  <FiPenTool />
                </div>

                <span className="skill-arrow">
                  <FiArrowRight />
                </span>
              </div>

              <h3>
                UI/UX Design
              </h3>

              <div className="skill-learners">
                <FiUsers />
                <span>70+ learners</span>
              </div>

            </div>
          </div>


          {/* Graphic Design */}

          <div className="col-lg-4 col-md-6 col-12">
            <div className="skill-card">

              <div className="skill-card-top">
                <div className="skill-icon">
                  <FiEdit3 />
                </div>

                <span className="skill-arrow">
                  <FiArrowRight />
                </span>
              </div>

              <h3>
                Graphic Design
              </h3>

              <div className="skill-learners">
                <FiUsers />
                <span>65+ learners</span>
              </div>

            </div>
          </div>


          {/* Digital Marketing */}

          <div className="col-lg-4 col-md-6 col-12">
            <div className="skill-card">

              <div className="skill-card-top">
                <div className="skill-icon">
                  <FiSmartphone />
                </div>

                <span className="skill-arrow">
                  <FiArrowRight />
                </span>
              </div>

              <h3>
                Digital Marketing
              </h3>

              <div className="skill-learners">
                <FiUsers />
                <span>55+ learners</span>
              </div>

            </div>
          </div>

        </div>


        {/* Action */}

        <div className="skills-action">

          <button className="view-skills-btn">
            View All Skills
            <FiArrowRight />
          </button>

        </div>

      </div>

    </section>
  )
}

export default PopularSkills