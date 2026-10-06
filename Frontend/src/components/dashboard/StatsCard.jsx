import React from 'react'
import {
  FiBookOpen,
  FiUsers,
  FiSend,
  FiRefreshCw
} from 'react-icons/fi'

const StatsCard = ({
  icon,
  title,
  value,
  description
}) => {
  return (
    <>
      <div className="col-12 col-sm-6 col-xl-3">

        <div className="stats-card">

          {/* Icon */}

          <div className="stats-icon">
            {icon}
          </div>


          {/* Content */}

          <div className="stats-content">

            <p>
              {title}
            </p>

            <h3>
              {value}
            </h3>

            <span>
              {description}
            </span>

          </div>

        </div>

      </div>
    </>
  )
}

export default StatsCard