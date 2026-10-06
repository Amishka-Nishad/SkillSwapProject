import React from 'react'
import {
  FiCalendar,
  FiClock,
  FiArrowRight
} from 'react-icons/fi'

const ExchangeCard = ({
  name,
  skillOne,
  skillTwo,
  date,
  time,
  initial
}) => {
  return (
    <>
      <div className="exchange-card">

        {/* Profile */}

        <div className="exchange-profile">

          <div className="exchange-avatar">
            {initial}
          </div>

          <div className="exchange-person">

            <h5>
              {name}
            </h5>

            <span>
              Skill Exchange Partner
            </span>

          </div>

        </div>


        {/* Skills */}

        <div className="exchange-skills">

          <span>
            {skillOne}
          </span>

          <FiArrowRight />

          <span>
            {skillTwo}
          </span>

        </div>


        {/* Date & Time */}

        <div className="exchange-details">

          <div>
            <FiCalendar />

            <span>
              {date}
            </span>
          </div>

          <div>
            <FiClock />

            <span>
              {time}
            </span>
          </div>

        </div>


        {/* Status */}

        <span className="exchange-status">
          Upcoming
        </span>

      </div>
    </>
  )
}

export default ExchangeCard