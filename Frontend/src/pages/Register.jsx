import React, { useState } from 'react'
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiArrowRight
} from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const Register = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Password validation
    if (formData.password !== formData.confirmPassword) {

      Swal.fire({
        icon: 'warning',
        title: 'Password Mismatch',
        text: 'Password and Confirm Password do not match.',
        confirmButtonText: 'OK'
      })

      return
    }

    try {

      const response = await fetch(
        'http://localhost:5000/api/auth/register',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {

        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: data.message || 'Unable to create account.',
          confirmButtonText: 'Try Again'
        })

        return
      }

      Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: 'Your SkillSwap account has been created successfully.',
        confirmButtonText: 'Go to Login'
      }).then(() => {

        navigate('/login')

      })

    } catch (error) {

      console.error('Register Error:', error)

      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Something went wrong. Please make sure the backend server is running.',
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
                  Create your account
                </h1>

                <p>
                  Start learning, sharing and growing with SkillSwap.
                </p>

              </div>


              {/* Register Form */}

              <form onSubmit={handleSubmit}>

                {/* Name */}

                <div className="form-group">

                  <label>
                    Full Name
                  </label>

                  <div className="input-wrapper">

                    <FiUser />

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />

                  </div>

                </div>


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

                  <label>
                    Password
                  </label>

                  <div className="input-wrapper">

                    <FiLock />

                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      required
                    />

                    <FiEye
                      className="password-eye"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    />

                  </div>

                </div>


                {/* Confirm Password */}

                <div className="form-group">

                  <label>
                    Confirm Password
                  </label>

                  <div className="input-wrapper">

                    <FiLock />

                    <input
                      type={
                        showConfirmPassword
                          ? 'text'
                          : 'password'
                      }
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                    />

                    <FiEye
                      className="password-eye"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                    />

                  </div>

                </div>


                {/* Button */}

                <button
                  type="submit"
                  className="auth-btn"
                >
                  Create Account
                  <FiArrowRight />
                </button>

              </form>


              {/* Login */}

              <div className="auth-footer">

                <p>
                  Already have an account?
                </p>

                <Link to="/login">
                  Login
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>
    </>
  )
}

export default Register