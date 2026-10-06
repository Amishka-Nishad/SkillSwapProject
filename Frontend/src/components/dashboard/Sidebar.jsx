import React from 'react'

import {
  FiHome,
  FiCompass,
  FiBookOpen,
  FiUsers,
  FiSend,
  FiMessageCircle,
  FiRefreshCw,
  FiStar,
  FiSettings,
  FiLogOut,
  FiX
} from 'react-icons/fi'

import { NavLink } from 'react-router-dom'


const Sidebar = ({ isOpen, onClose, isCollapsed }) => {

  // Active link ke liye common class
  const getLinkClass = ({ isActive }) => {
    return `sidebar-link ${isActive ? 'active' : ''}`
  }

  return (
    <>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        ></div>
      )}


      {/* SIDEBAR */}
      <aside
        className={`dashboard-sidebar
          ${isOpen ? 'sidebar-open' : ''}
          ${isCollapsed ? 'sidebar-collapsed' : ''}
        `}
      >

        {/* MOBILE CLOSE BUTTON */}
        <button
          className="sidebar-close"
          onClick={onClose}
        >
          <FiX />
        </button>


        {/* LOGO */}
        <div className="dashboard-logo">

          <div className="logo-icon">
            S
          </div>

          <span className="sidebar-logo-text">
            SkillSwap
          </span>

        </div>


        {/* MAIN MENU */}
        <div className="sidebar-menu">

          <p className="sidebar-title">
            MAIN MENU
          </p>


          <NavLink
            to="/dashboard"
            className={getLinkClass}
            onClick={onClose}
            title="Dashboard"
          >
            <FiHome />
            <span>Dashboard</span>
          </NavLink>


          <NavLink
            to="/dashboard/explore-skills"
            className={getLinkClass}
            onClick={onClose}
            title="Explore Skills"
          >
            <FiCompass />
            <span>Explore Skills</span>
          </NavLink>


          <NavLink
            to="/dashboard/my-skills"
            className={getLinkClass}
            onClick={onClose}
            title="My Skills"
          >
            <FiBookOpen />
            <span>My Skills</span>
          </NavLink>


          <NavLink
            to="/dashboard/matches"
            className={getLinkClass}
            onClick={onClose}
            title="My Matches"
          >
            <FiUsers />
            <span>My Matches</span>
          </NavLink>


          <NavLink
            to="/dashboard/exchange-requests"
            className={getLinkClass}
            onClick={onClose}
            title="Requests"
          >
            <FiSend />
            <span>Requests</span>
          </NavLink>


          <NavLink
            to="/dashboard/messages"
            className={getLinkClass}
            onClick={onClose}
            title="Messages"
          >
            <FiMessageCircle />
            <span>Messages</span>
          </NavLink>


          <NavLink
            to="/dashboard/exchanges"
            className={getLinkClass}
            onClick={onClose}
            title="Exchanges"
          >
            <FiRefreshCw />
            <span>Exchanges</span>
          </NavLink>


          <NavLink
            to="/dashboard/reviews"
            className={getLinkClass}
            onClick={onClose}
            title="Reviews"
          >
            <FiStar />
            <span>Reviews</span>
          </NavLink>

        </div>


        {/* BOTTOM MENU */}
        <div className="sidebar-bottom">

          <NavLink
            to="/dashboard/settings"
            className={getLinkClass}
            onClick={onClose}
            title="Settings"
          >
            <FiSettings />
            <span>Settings</span>
          </NavLink>


          <button
            className="sidebar-link logout-link"
            onClick={() => {
              console.log('Logout clicked')
            }}
            title="Logout"
          >
            <FiLogOut />
            <span>Logout</span>
          </button>

        </div>

      </aside>

    </>
  )
}


export default Sidebar