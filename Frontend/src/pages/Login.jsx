import React, { useState } from 'react'
import { FiMail, FiLock, FiEye, FiArrowRight } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const Login = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify(formData)
        }
      )

      const data = await response.json()

      if (!response.ok) {

        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: data.message || 'Invalid email or password.',
          confirmButtonText: 'Try Again'
        })

        return
      }

      console.log('Login Successful:', data)

      // Save login information
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Welcome back to SkillSwap!',
        confirmButtonText: 'Continue'
      }).then(() => {
        navigate('/dashboard')
      })

    } catch (error) {

      console.error('Login Error:', error)

      Swal.fire({
        icon: 'error',
        title: 'Something went wrong',
        text: 'Please check your server and try again.',
        confirmButtonText: 'OK'
      })

    }
  }

  return (
    <>
      <section className="auth-section">

        <div className="container">

          <div className="auth-wrapper">

            <div className="auth-card">

              {/* Logo */}

              <div className="auth-logo">

                <div className="logo-icon">
                  S
                </div>

                <span>
                  SkillSwap
                </span>

              </div>


              {/* Heading */}

              <div className="auth-heading">

                <h1>
                  Welcome back
                </h1>

                <p>
                  Continue your skill journey with SkillSwap.
                </p>

              </div>


              {/* Login Form */}

              <form onSubmit={handleSubmit}>

                {/* Email */}

                <div className="form-group">

                  <label>
                    Email Address
                  </label>

                  <div className="input-wrapper">

                    <FiMail />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />

                  </div>

                </div>


                {/* Password */}

                <div className="form-group">

                  <div className="password-label">

                    <label>
                      Password
                    </label>

                    <Link to="/forgot-password">
                      Forgot Password?
                    </Link>

                  </div>


                  <div className="input-wrapper">

                    <FiLock />

                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />

                    <FiEye
                      className="password-eye"
                      onClick={() => setShowPassword(!showPassword)}
                    />

                  </div>

                </div>


                {/* Login Button */}

                <button
                  type="submit"
                  className="auth-btn"
                >
                  Login
                  <FiArrowRight />
                </button>

              </form>


              {/* Register */}

              <div className="auth-footer">

                <p>
                  Don't have an account?
                </p>

                <Link to="/register">
                  Create an account
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>
    </>
  )
}

export default Login