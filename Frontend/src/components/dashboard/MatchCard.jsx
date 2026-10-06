import React from 'react'
import { FiUserPlus, FiArrowUpRight } from 'react-icons/fi'

const MatchCard = ({
  name,
  skill,
  match,
  initial
}) => {
  return (
    <>
      <div className="col-12 col-md-6 col-xl-4">

        <div className="match-card">

          {/* Profile */}

          <div className="match-profile">

            <div className="match-avatar">
              {initial}
            </div>

            <div>
              <h5>
                {name}
              </h5>

              <span>
                Skill Partner
              </span>
            </div>

          </div>


          {/* Skill */}

          <div className="match-skill">

            <span>
              Can teach
            </span>

            <strong>
              {skill}
            </strong>

          </div>


          {/* Match */}

          <div className="match-score">

            <div className="match-score-text">

              <span>
                Skill Match
              </span>

              <strong>
                {match}%
              </strong>

            </div>

            <div className="match-progress">

              <div
                className="match-progress-bar"
                style={{ width: `${match}%` }}
              ></div>

            </div>

          </div>


          {/* Button */}

          <button className="connect-btn">

            <FiUserPlus />

            Connect

            <FiArrowUpRight />

          </button>

        </div>

      </div>
    </>
  )
}

export default MatchCard