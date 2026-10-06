import React from 'react'
import {
  FiPlus,
  FiCompass,
  FiSend
} from 'react-icons/fi'

const QuickActions = () => {
  return (
    <>
      <section className="quick-actions-section">

        <div className="section-heading">

          <h2>
            Quick Actions
          </h2>

        </div>


        <div className="row g-3">

          {/* Add Skill */}

          <div className="col-12 col-md-4">

            <button className="quick-action-card">

              <div className="quick-action-icon">
                <FiPlus />
              </div>

              <div className="quick-action-content">

                <h5>
                  Add a New Skill
                </h5>

                <p>
                  Share something you can teach
                </p>

              </div>

            </button>

          </div>


          {/* Explore */}

          <div className="col-12 col-md-4">

            <button className="quick-action-card">

              <div className="quick-action-icon">
                <FiCompass />
              </div>

              <div className="quick-action-content">

                <h5>
                  Explore Skills
                </h5>

                <p>
                  Find skills you want to learn
                </p>

              </div>

            </button>

          </div>


          {/* Request */}

          <div className="col-12 col-md-4">

            <button className="quick-action-card">

              <div className="quick-action-icon">
                <FiSend />
              </div>

              <div className="quick-action-content">

                <h5>
                  Send a Request
                </h5>

                <p>
                  Start a new skill exchange
                </p>

              </div>

            </button>

          </div>

        </div>

      </section>
    </>
  )
}

export default QuickActions