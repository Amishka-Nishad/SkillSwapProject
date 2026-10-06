import React from 'react'
import {
  FiTarget,
  FiMessageCircle,
  FiRefreshCw,
  FiStar
} from 'react-icons/fi'

const WhySkillSwap = () => {

  return (
    <>
      <section className="why-skillswap-section">

        <div className="container">

          <div className="section-heading">

            <p className="section-tag">
              WHY SKILLSWAP?
            </p>

            <h2>
              More than learning.
              <span> It's skill exchange.</span>
            </h2>

            <p className="section-description">
              Learn from real people, share your knowledge
              and build meaningful connections.
            </p>

          </div>


          <div className="row g-4">

            <div className="col-lg-6 col-12">

              <div className="feature-card">

                <div className="feature-icon">
                  <FiTarget />
                </div>

                <h3>
                  Smart Matching
                </h3>

                <p>
                  Find people whose skills match
                  exactly what you want to learn.
                </p>

              </div>

            </div>


            <div className="col-lg-6 col-12">

              <div className="feature-card">

                <div className="feature-icon">
                  <FiMessageCircle />
                </div>

                <h3>
                  Real-time Connection
                </h3>

                <p>
                  Connect and communicate with
                  your skill partners easily.
                </p>

              </div>

            </div>


            <div className="col-lg-6 col-12">

              <div className="feature-card">

                <div className="feature-icon">
                  <FiRefreshCw />
                </div>

                <h3>
                  Skill Exchange
                </h3>

                <p>
                  Teach what you know and learn
                  something valuable in return.
                </p>

              </div>

            </div>


            <div className="col-lg-6 col-12">

              <div className="feature-card">

                <div className="feature-icon">
                  <FiStar />
                </div>

                <h3>
                  Trusted Reviews
                </h3>

                <p>
                  Build your reputation through
                  ratings and genuine feedback.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>
    </>
  )
}

export default WhySkillSwap