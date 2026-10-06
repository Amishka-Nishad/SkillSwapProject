import React from 'react'
import './App.css'

import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

import Dashboard from './pages/Dashboard'
import ExploreSkills from './pages/ExploreSkills'
import SkillDetails from './pages/SkillDetails'
import Profile from './pages/Profile'
import AddSkill from './pages/AddSkill'
import MySkills from './pages/MySkills'
import ExchangeRequests from './pages/ExchangeRequests'
import Messages from './pages/Messages'
import Notifications from './pages/Notifications'
import MyMatches from './pages/MyMatches'
import Exchanges from './pages/Exchanges'
import Reviews from './pages/Reviews'
import Settings from './pages/Settings'

import DashboardLayout from './components/dashboard/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'

import About from './components/About'
import HowItWorks from './components/HowItWorks'

const App = () => {

  const location = useLocation()

  const isDashboard =
    location.pathname.startsWith('/dashboard')

  return (
    <>

      {!isDashboard && <Navbar />}

      <Routes>

        {/* Public Routes */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/explore-skills"
          element={<ExploreSkills />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/how-it-works"
          element={<HowItWorks />}
        />


        {/* Protected Dashboard Routes */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<DashboardLayout />}
          >

            <Route
              index
              element={<Dashboard />}
            />

            <Route
              path="explore-skills"
              element={<ExploreSkills />}
            />

            <Route
              path="skill-details"
              element={<SkillDetails />}
            />

            <Route
              path="profile"
              element={<Profile />}
            />

            <Route
              path="add-skill"
              element={<AddSkill />}
            />

            <Route
              path="my-skills"
              element={<MySkills />}
            />

            <Route
              path="exchange-requests"
              element={<ExchangeRequests />}
            />

            <Route
              path="messages"
              element={<Messages />}
            />

            <Route
              path="notifications"
              element={<Notifications />}
            />

            <Route
              path="matches"
              element={<MyMatches />}
            />

            <Route
              path="exchanges"
              element={<Exchanges />}
            />

            <Route
              path="reviews"
              element={<Reviews />}
            />

            <Route
              path="settings"
              element={<Settings />}
            />

          </Route>

        </Route>

      </Routes>

      {!isDashboard && <Footer />}

    </>
  )
}

export default App