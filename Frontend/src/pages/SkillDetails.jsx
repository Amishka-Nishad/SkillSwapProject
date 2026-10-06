import React, { useEffect, useState } from 'react'

import {
  FiArrowLeft,
  FiStar,
  FiUsers,
  FiMessageCircle,
  FiSend,
  FiCheckCircle
} from 'react-icons/fi'

import {
  useNavigate,
  useSearchParams
} from 'react-router-dom'

import Swal from 'sweetalert2'


const SkillDetails = () => {

  const navigate = useNavigate()

  const [searchParams] = useSearchParams()

  const skillName = searchParams.get('skill') || ''

  const [skill, setSkill] = useState(null)

  const [loading, setLoading] = useState(true)

  const [requestLoading, setRequestLoading] = useState(false)


  /* =========================
      FETCH SKILL DETAILS
  ========================= */

  useEffect(() => {

    const fetchSkillDetails = async () => {

      try {

        const token = localStorage.getItem('token')

        if (!token) {
          navigate('/login')
          return
        }

        const response = await fetch(
          'http://localhost:5000/api/skills',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const data = await response.json()

        if (response.status === 401) {

          localStorage.removeItem('token')
          localStorage.removeItem('user')

          Swal.fire({
            icon: 'warning',
            title: 'Session Expired',
            text: 'Please login again.',
            confirmButtonColor: '#7553db'
          })

          navigate('/login')
          return

        }

        if (!response.ok) {

          throw new Error(
            data.message || 'Failed to fetch skill'
          )

        }

        const foundSkill = data.skills.find(
          (item) =>
            item.name.toLowerCase() ===
            skillName.toLowerCase()
        )

        if (!foundSkill) {

          setSkill(null)
          return

        }

        setSkill({

          id: foundSkill._id,

          skill: foundSkill.name,

          category: foundSkill.category,

          description:
            foundSkill.description ||
            'Learn this skill and connect with a skill partner.',

          about:
            foundSkill.description ||
            'Learn this skill from an experienced skill partner.',

          teacher:
            foundSkill.user?.name ||
            'Skill Partner',

          rating: '0',

          learners: '0',

          initial:
            foundSkill.user?.name
              ? foundSkill.user.name
                  .charAt(0)
                  .toUpperCase()
              : 'S',

          wantsToLearn: 'New Skills',

          learning: [
            'Learn the fundamentals',
            'Practice with real examples',
            'Improve your skills',
            'Build practical projects'
          ]

        })

      } catch (error) {

        console.error(
          'Fetch skill details error:',
          error
        )

        Swal.fire({
          icon: 'error',
          title: 'Unable to Load Skill',
          text:
            error.message ||
            'Something went wrong.',
          confirmButtonColor: '#7553db'
        })

      } finally {

        setLoading(false)

      }

    }

    if (skillName) {
      fetchSkillDetails()
    } else {
      setLoading(false)
    }

  }, [skillName, navigate])


  /* =========================
      BACK
  ========================= */

  const handleBack = () => {

    navigate('/dashboard/explore-skills')

  }


  /* =========================
      SEND EXCHANGE REQUEST
  ========================= */

  const handleRequest = async () => {

    try {

      const token = localStorage.getItem('token')

      if (!token) {

        navigate('/login')

        return

      }

      if (!skill?.id) {

        Swal.fire({
          icon: 'error',
          title: 'Skill Not Found',
          text: 'Unable to send request.',
          confirmButtonColor: '#7553db'
        })

        return

      }


      setRequestLoading(true)


      const response = await fetch(
        'http://localhost:5000/api/exchange-requests',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            skillId: skill.id
          })
        }
      )


      const data = await response.json()


      if (response.status === 401) {

        localStorage.removeItem('token')
        localStorage.removeItem('user')

        Swal.fire({
          icon: 'warning',
          title: 'Session Expired',
          text: 'Please login again.',
          confirmButtonColor: '#7553db'
        })

        navigate('/login')

        return

      }


      if (!response.ok) {

        Swal.fire({
          icon: 'error',
          title: 'Request Failed',
          text:
            data.message ||
            'Unable to send exchange request.',
          confirmButtonColor: '#7553db'
        })

        return

      }


      Swal.fire({
        icon: 'success',
        title: 'Request Sent!',
        text:
          `Exchange request sent to ${skill.teacher}.`,
        confirmButtonColor: '#7553db'
      })


    } catch (error) {

      console.error(
        'Send request error:',
        error
      )

      Swal.fire({
        icon: 'error',
        title: 'Something Went Wrong',
        text: 'Please try again.',
        confirmButtonColor: '#7553db'
      })

    } finally {

      setRequestLoading(false)

    }

  }


  /* =========================
      MESSAGE
  ========================= */

  const handleMessage = () => {

    navigate('/dashboard/messages')

  }


  /* =========================
      LOADING
  ========================= */

  if (loading) {

    return (

      <div className="skill-details-page">

        <div className="container">

          <div className="text-center py-5">

            <h3>
              Loading skill details...
            </h3>

          </div>

        </div>

      </div>

    )

  }


  /* =========================
      SKILL NOT FOUND
  ========================= */

  if (!skill) {

    return (

      <div className="skill-details-page">

        <div className="container">

          <button
            className="skill-back-btn"
            onClick={handleBack}
          >

            <FiArrowLeft />

            <span>
              Back to Explore
            </span>

          </button>

          <div className="text-center py-5">

            <h2>
              Skill Not Found
            </h2>

            <p>
              This skill is no longer available.
            </p>

          </div>

        </div>

      </div>

    )

  }


  return (

    <div className="skill-details-page">

      <div className="container">

        {/* BACK BUTTON */}

        <button
          className="skill-back-btn"
          onClick={handleBack}
        >

          <FiArrowLeft />

          <span>
            Back to Explore
          </span>

        </button>


        <div className="row g-4">


          {/* LEFT CONTENT */}

          <div className="col-12 col-lg-8">

            <div className="skill-details-card">


              {/* SKILL HEADER */}

              <div className="details-top">

                <div className="details-icon">
                  {skill.initial}
                </div>

                <div className="details-heading">

                  <span className="details-category">
                    {skill.category}
                  </span>

                  <h1>
                    {skill.skill}
                  </h1>

                  <p>
                    {skill.description}
                  </p>

                </div>

              </div>


              {/* STATS */}

              <div className="details-stats">

                <div className="details-stat">

                  <FiStar />

                  <strong>
                    {skill.rating}
                  </strong>

                  <span>
                    Rating
                  </span>

                </div>


                <div className="details-stat">

                  <FiUsers />

                  <strong>
                    {skill.learners}
                  </strong>

                  <span>
                    Learners
                  </span>

                </div>

              </div>


              {/* ABOUT */}

              <div className="details-section">

                <h2>
                  About this skill
                </h2>

                <p>
                  {skill.about}
                </p>

              </div>


              {/* WHAT YOU WILL LEARN */}

              <div className="details-section">

                <h2>
                  What you will learn
                </h2>

                <div className="learning-list">

                  {skill.learning.map(
                    (item, index) => (

                      <div key={index}>

                        <FiCheckCircle />

                        <span>
                          {item}
                        </span>

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          </div>


          {/* RIGHT TEACHER CARD */}

          <div className="col-12 col-lg-4">

            <div className="teacher-details-card">


              {/* TEACHER PROFILE */}

              <div className="teacher-details-profile">

                <div className="teacher-details-avatar">
                  {skill.initial}
                </div>

                <h3>
                  {skill.teacher}
                </h3>

                <span>
                  Skill Mentor
                </span>

              </div>


              {/* EXCHANGE INFO */}

              <div className="exchange-info">

                <div className="exchange-item">

                  <p>
                    Can teach
                  </p>

                  <strong>
                    {skill.skill}
                  </strong>

                </div>


                <div className="exchange-item">

                  <p>
                    Wants to learn
                  </p>

                  <strong>
                    {skill.wantsToLearn}
                  </strong>

                </div>

              </div>


              {/* REQUEST BUTTON */}

              <button
                className="request-btn"
                onClick={handleRequest}
                disabled={requestLoading}
              >

                <FiSend />

                <span>

                  {requestLoading
                    ? 'Sending...'
                    : 'Send Exchange Request'}

                </span>

              </button>


              {/* MESSAGE BUTTON */}

              <button
                className="message-btn"
                onClick={handleMessage}
              >

                <FiMessageCircle />

                <span>
                  Message
                </span>

              </button>


            </div>

          </div>

        </div>

      </div>

    </div>

  )

}


export default SkillDetails