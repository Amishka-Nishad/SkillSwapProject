import React, { useEffect, useState } from 'react'

import {
  FiBell,
  FiChevronDown,
  FiMenu,
  FiUser,
  FiSettings,
  FiLogOut
} from 'react-icons/fi'

import { useNavigate } from 'react-router-dom'


const DashboardNavbar = ({ onMenuClick }) => {

  const navigate = useNavigate()

  const [profileOpen, setProfileOpen] = useState(false)

  const [user, setUser] = useState(() => {

    const storedUser = localStorage.getItem('user')

    if (storedUser) {

      try {
        return JSON.parse(storedUser)
      } catch (error) {
        console.error('User data error:', error)
      }

    }

    return null

  })


  // =================================
  // UPDATE USER WHEN PROFILE CHANGES
  // =================================

  useEffect(() => {

    const handleUserUpdate = () => {

      const storedUser = localStorage.getItem('user')

      if (storedUser) {

        try {

          const userData = JSON.parse(storedUser)

          setUser(userData)

        } catch (error) {

          console.error('User data error:', error)

        }

      } else {

        setUser(null)

      }

    }


    window.addEventListener(
      'userUpdated',
      handleUserUpdate
    )


    return () => {

      window.removeEventListener(
        'userUpdated',
        handleUserUpdate
      )

    }

  }, [])


  // =================================
  // USER INFORMATION
  // =================================

  const userName = user?.name || 'User'

  const userInitial = userName
    .charAt(0)
    .toUpperCase()


  // =================================
  // PROFILE DROPDOWN
  // =================================

  const handleProfileClick = () => {

    setProfileOpen(!profileOpen)

  }


  // =================================
  // PROFILE
  // =================================

  const handleProfile = () => {

    setProfileOpen(false)

    navigate('/dashboard/profile')

  }


  // =================================
  // SETTINGS
  // =================================

  const handleSettings = () => {

    setProfileOpen(false)

    navigate('/dashboard/settings')

  }


  // =================================
  // LOGOUT
  // =================================

  const handleLogout = () => {

    setProfileOpen(false)

    localStorage.removeItem('token')
    localStorage.removeItem('user')

    console.log('Logout successful')

    navigate('/login')

  }


  // =================================
  // FIND A MATCH
  // =================================

  const handleFindMatch = () => {

    navigate('/dashboard/matches')

  }


  return (

    <header className="dashboard-navbar">


      {/* =================================
          MOBILE MENU
      ================================= */}

      <button
        className="mobile-menu-btn"
        onClick={onMenuClick}
        aria-label="Open menu"
      >

        <FiMenu />

      </button>


      {/* =================================
          FIND A MATCH
      ================================= */}

      <button
        className="find-match-btn"
        onClick={handleFindMatch}
      >

        🤝 Find a Match

      </button>


      {/* =================================
          RIGHT SIDE
      ================================= */}

      <div className="navbar-right">


        {/* =================================
            NOTIFICATION
        ================================= */}

        <button
          className="notification-btn"
          onClick={() =>
            navigate('/dashboard/notifications')
          }
          aria-label="Notifications"
        >

          <FiBell />

          <span className="notification-dot"></span>

        </button>


        {/* =================================
            PROFILE
        ================================= */}

        <div className="profile-dropdown-wrapper">


          <button
            className="dashboard-profile"
            onClick={handleProfileClick}
          >

            <div className="profile-avatar">

              {userInitial}

            </div>


            <div className="profile-info">

              <h6>

                {userName}

              </h6>

              <span>
                Skill Learner
              </span>

            </div>


            <FiChevronDown
              className={`profile-arrow ${
                profileOpen ? 'rotate' : ''
              }`}
            />

          </button>


          {/* =================================
              PROFILE DROPDOWN
          ================================= */}

          {profileOpen && (

            <div className="profile-dropdown">


              {/* Profile */}

              <button
                onClick={handleProfile}
              >

                <FiUser />

                <span>
                  Profile
                </span>

              </button>


              {/* Settings */}

              <button
                onClick={handleSettings}
              >

                <FiSettings />

                <span>
                  Settings
                </span>

              </button>


              <div className="dropdown-divider"></div>


              {/* Logout */}

              <button
                className="dropdown-logout"
                onClick={handleLogout}
              >

                <FiLogOut />

                <span>
                  Logout
                </span>

              </button>


            </div>

          )}

        </div>

      </div>

    </header>

  )

}


export default DashboardNavbar