import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'

import Sidebar from './Sidebar'
import DashboardNavbar from './DashboardNavbar'


const DashboardLayout = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false)


  const openSidebar = () => {
    setSidebarOpen(true)
  }


  const closeSidebar = () => {
    setSidebarOpen(false)
  }


  return (

    <div className="dashboard-layout">

      {/* =========================
          SIDEBAR
      ========================= */}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="dashboard-content">

        {/* DASHBOARD NAVBAR */}

        <DashboardNavbar
          onMenuClick={openSidebar}
        />


        {/* PAGE CONTENT */}

        <Outlet />

      </main>

    </div>

  )
}


export default DashboardLayout