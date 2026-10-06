import React, { useEffect, useState } from 'react'

import {
  FiCode,
  FiEdit3,
  FiTrash2,
  FiEye,
  FiPlus,
  FiUsers,
  FiStar
} from 'react-icons/fi'

import { useNavigate } from 'react-router-dom'

import Swal from 'sweetalert2'


const MySkills = () => {

  const navigate = useNavigate()


  const [skills, setSkills] = useState([])

  const [loading, setLoading] = useState(true)


  // =========================
  // FETCH MY SKILLS
  // =========================

  useEffect(() => {

    const fetchMySkills = async () => {

      const token =
        localStorage.getItem('token')


      if (!token) {

        navigate('/login')

        return

      }


      try {

        setLoading(true)


        const response =
          await fetch(
            'http://localhost:5000/api/skills/my-skills',
            {
              method: 'GET',

              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          )


        const data =
          await response.json()


        // =========================
        // ERROR
        // =========================

        if (!response.ok) {

          if (response.status === 401) {

            localStorage.removeItem('token')
            localStorage.removeItem('user')


            await Swal.fire({
              icon: 'error',
              title: 'Session Expired',
              text: 'Please login again.',
              confirmButtonText: 'Go to Login'
            })


            navigate('/login')

            return

          }


          Swal.fire({
            icon: 'error',
            title: 'Unable to Load Skills',
            text:
              data.message ||
              'Something went wrong.',
            confirmButtonText: 'Okay'
          })


          return

        }


        // =========================
        // DATABASE SKILLS
        // =========================

        const formattedSkills =
          (data.skills || []).map((item) => ({

            id: item._id,

            skill: item.name,

            category: item.category,

            description:
              item.description || '',

            learners: 0,

            rating: 0,

            initial:
              item.name
                ? item.name
                    .charAt(0)
                    .toUpperCase()
                : '?'

          }))


        setSkills(
          formattedSkills
        )


      } catch (error) {

        console.error(
          'Fetch my skills error:',
          error
        )


        Swal.fire({
          icon: 'error',
          title: 'Server Error',
          text:
            'Unable to connect to the server.',
          confirmButtonText: 'Okay'
        })


      } finally {

        setLoading(false)

      }

    }


    fetchMySkills()

  }, [navigate])


  // =========================
  // ADD NEW SKILL
  // =========================

  const handleAddSkill = () => {

    navigate(
      '/dashboard/add-skill'
    )

  }


  // =========================
  // VIEW SKILL
  // =========================

  const handleViewSkill = (skillName) => {

    navigate(
      `/dashboard/skill-details?skill=${encodeURIComponent(skillName)}`
    )

  }


  // =========================
  // EDIT SKILL
  // =========================

  const handleEditSkill = (skillId) => {

    navigate(
      `/dashboard/add-skill?edit=${skillId}`
    )

  }


  // =========================
  // DELETE SKILL
  // =========================

  const handleDeleteSkill = async (
    id,
    skillName
  ) => {

    const result =
      await Swal.fire({

        title: 'Delete Skill?',

        text:
          `Are you sure you want to delete ${skillName}?`,

        icon: 'warning',

        showCancelButton: true,

        confirmButtonText:
          'Yes, Delete',

        cancelButtonText:
          'Cancel',

        reverseButtons: true

      })


    if (!result.isConfirmed) {

      return

    }


    const token =
      localStorage.getItem('token')


    if (!token) {

      navigate('/login')

      return

    }


    try {

      const response =
        await fetch(
          `http://localhost:5000/api/skills/${id}`,
          {
            method: 'DELETE',

            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        )


      const data =
        await response.json()


      // =========================
      // DELETE ERROR
      // =========================

      if (!response.ok) {

        if (response.status === 401) {

          localStorage.removeItem('token')
          localStorage.removeItem('user')


          await Swal.fire({
            icon: 'error',
            title: 'Session Expired',
            text: 'Please login again.',
            confirmButtonText: 'Go to Login'
          })


          navigate('/login')

          return

        }


        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text:
            data.message ||
            'Unable to delete skill.',
          confirmButtonText: 'Okay'
        })


        return

      }


      // =========================
      // REMOVE FROM UI
      // =========================

      setSkills(
        (prevSkills) =>
          prevSkills.filter(
            (skill) =>
              skill.id !== id
          )
      )


      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text:
          `${skillName} has been removed successfully.`,
        confirmButtonText: 'Okay'
      })


    } catch (error) {

      console.error(
        'Delete skill error:',
        error
      )


      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text:
          'Unable to connect to the server.',
        confirmButtonText: 'Okay'
      })

    }

  }


  // =========================
  // STATS
  // =========================

  const totalLearners =
    skills.reduce(
      (total, skill) =>
        total + skill.learners,
      0
    )


  const averageRating =
    skills.length
      ? (
          skills.reduce(
            (total, skill) =>
              total + skill.rating,
            0
          ) / skills.length
        ).toFixed(1)
      : '0.0'


  return (

    <>

      <div className="my-skills-page">

        <div className="container">


          {/* =========================
              HEADER
          ========================= */}

          <div className="my-skills-header">

            <div>

              <span>
                YOUR SKILLS
              </span>

              <h1>
                My Skills
              </h1>

              <p>
                Manage the skills you offer to the SkillSwap
                community.
              </p>

            </div>


            <button
              className="add-new-skill-btn"
              onClick={handleAddSkill}
            >

              <FiPlus />

              Add New Skill

            </button>

          </div>


          {/* =========================
              STATS
          ========================= */}

          <div className="row g-3 mb-4">


            {/* Skills */}

            <div className="col-12 col-md-4">

              <div className="skill-stat-card">

                <div className="skill-stat-icon">

                  <FiCode />

                </div>

                <div>

                  <strong>
                    {skills.length}
                  </strong>

                  <span>
                    Skills Offered
                  </span>

                </div>

              </div>

            </div>


            {/* Learners */}

            <div className="col-12 col-md-4">

              <div className="skill-stat-card">

                <div className="skill-stat-icon">

                  <FiUsers />

                </div>

                <div>

                  <strong>
                    {totalLearners}
                  </strong>

                  <span>
                    Total Learners
                  </span>

                </div>

              </div>

            </div>


            {/* Rating */}

            <div className="col-12 col-md-4">

              <div className="skill-stat-card">

                <div className="skill-stat-icon">

                  <FiStar />

                </div>

                <div>

                  <strong>
                    {averageRating}
                  </strong>

                  <span>
                    Average Rating
                  </span>

                </div>

              </div>

            </div>

          </div>


          {/* =========================
              SKILLS
          ========================= */}

          <div className="my-skills-list">


            {/* LOADING */}

            {loading ? (

              <div className="no-skills-found">

                <FiCode />

                <h3>
                  Loading Skills...
                </h3>

                <p>
                  Please wait while we fetch your skills.
                </p>

              </div>

            ) : skills.length === 0 ? (

              /* EMPTY STATE */

              <div className="no-skills-found">

                <FiCode />

                <h3>
                  No Skills Added
                </h3>

                <p>
                  You haven't added any skills yet.
                  Start sharing your knowledge with the community.
                </p>

                <button
                  onClick={handleAddSkill}
                >

                  <FiPlus />

                  Add Your First Skill

                </button>

              </div>

            ) : (

              skills.map((item) => (

                <div
                  className="my-skill-card"
                  key={item.id}
                >


                  {/* SKILL MAIN */}

                  <div className="my-skill-main">

                    <div className="my-skill-icon">

                      {item.initial}

                    </div>

                    <div>

                      <div className="my-skill-title">

                        <h2>
                          {item.skill}
                        </h2>

                        <span className="skill-status">
                          Active
                        </span>

                      </div>

                      <p>
                        {item.category}
                      </p>

                      <small>
                        {item.description}
                      </small>

                    </div>

                  </div>


                  {/* META */}

                  <div className="my-skill-meta">

                    <span>

                      <FiUsers />

                      {item.learners} learners

                    </span>


                    <span>

                      <FiStar />

                      {item.rating}

                    </span>

                  </div>


                  {/* ACTIONS */}

                  <div className="my-skill-actions">


                    {/* View */}

                    <button
                      title="View"
                      onClick={() =>
                        handleViewSkill(
                          item.skill
                        )
                      }
                    >

                      <FiEye />

                    </button>


                    {/* Edit */}

                    <button
                      title="Edit"
                      onClick={() =>
                        handleEditSkill(
                          item.id
                        )
                      }
                    >

                      <FiEdit3 />

                    </button>


                    {/* Delete */}

                    <button
                      className="delete-skill-btn"
                      title="Delete"
                      onClick={() =>
                        handleDeleteSkill(
                          item.id,
                          item.skill
                        )
                      }
                    >

                      <FiTrash2 />

                    </button>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </div>

    </>

  )

}


export default MySkills