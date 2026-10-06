import React from 'react'
import {
  FiUserPlus,
  FiTag,
  FiTarget,
  FiUsers
} from 'react-icons/fi'

const HowItWorks = () => {

  return (
    <>
      <section className="how-it-works-section">

        <div className="container">

          <div className="section-heading">

            <p className="section-tag">
              HOW SKILLSWAP WORKS
            </p>

            <h2>
              Start your skill journey
              <span> in four steps.</span>
            </h2>

            <p className="section-description">
              Finding the right person to learn from or teach
              has never been this simple.
            </p>

          </div>


          <div className="row g-4">

            <div className="col-lg-3 col-md-6 col-12">

              <div className="step-card">

                <span className="step-number">
                  01
                </span>

                <div className="step-icon">
                  <FiUserPlus />
                </div>

                <h3>
                  Create Your Profile
                </h3>

                <p>
                  Tell the community about yourself,
                  interests and experience.
                </p>

              </div>

            </div>


            <div className="col-lg-3 col-md-6 col-12">

              <div className="step-card">

                <span className="step-number">
                  02
                </span>

                <div className="step-icon">
                  <FiTag />
                </div>

                <h3>
                  Add Your Skills
                </h3>

                <p>
                  Add skills you can teach and
                  skills you want to learn.
                </p>

              </div>

            </div>


            <div className="col-lg-3 col-md-6 col-12">

              <div className="step-card">

                <span className="step-number">
                  03
                </span>

                <div className="step-icon">
                  <FiTarget />
                </div>

                <h3>
                  Find Your Match
                </h3>

                <p>
                  Discover people whose skills
                  match what you want to learn.
                </p>

              </div>

            </div>


            <div className="col-lg-3 col-md-6 col-12">

              <div className="step-card">

                <span className="step-number">
                  04
                </span>

                <div className="step-icon">
                  <FiUsers />
                </div>

                <h3>
                  Start Exchanging
                </h3>

                <p>
                  Connect, learn together and
                  exchange your knowledge.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>
    </>
  )
}

export default HowItWorks