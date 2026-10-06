import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import {
  FiMapPin,
  FiEdit3,
  FiMail,
  FiGithub,
  FiLinkedin,
  FiCode,
  FiStar,
  FiUsers,
  FiRepeat,
  FiSave,
  FiX,
  FiPlus,
  FiTrash2
} from 'react-icons/fi'


const Profile = () => {

  // =================================
  // GET LOGGED-IN USER
  // =================================

  const getStoredUser = () => {

    const storedUser = localStorage.getItem('user')

    if (storedUser) {

      try {

        return JSON.parse(storedUser)

      } catch (error) {

        console.error('User data error:', error)

      }

    }

    return null
  }


  const loggedInUser = getStoredUser()


  // =================================
  // PROFILE STATE
  // =================================

  const [isEditing, setIsEditing] = useState(false)

  const [profile, setProfile] = useState({

    name:
      loggedInUser?.name ||
      'User',

    role:
      loggedInUser?.role ||
      'MERN Stack Developer',

    location:
      loggedInUser?.location ||
      'Tikunia, Lakhimpur Kheri',

    about:
      loggedInUser?.about ||
      'I am a passionate developer who enjoys learning new technologies and building useful web applications. I am currently focusing on MERN Stack development and improving my problem-solving skills.',

    email:
      loggedInUser?.email ||
      '',

    github:
      loggedInUser?.github ||
      'https://github.com/Amishka-Nishad',

    linkedin:
      loggedInUser?.linkedin ||
      'https://www.linkedin.com/in/amishka-nishad-5853a9371'

  })


  // =================================
  // TEACH SKILLS
  // =================================

  const [teachSkills, setTeachSkills] = useState(

    loggedInUser?.teachSkills?.length
      ? loggedInUser.teachSkills
      : [
          'HTML',
          'CSS',
          'JavaScript',
          'React.js',
          'Node.js',
          'MongoDB'
        ]

  )


  // =================================
  // LEARN SKILLS
  // =================================

  const [learnSkills, setLearnSkills] = useState(

    loggedInUser?.learnSkills?.length
      ? loggedInUser.learnSkills
      : [
          'UI/UX Design',
          'TypeScript',
          'Next.js',
          'Python'
        ]

  )


  const [newTeachSkill, setNewTeachSkill] = useState('')

  const [newLearnSkill, setNewLearnSkill] = useState('')

  const [isSaving, setIsSaving] = useState(false)


  // =================================
  // GET PROFILE FROM DATABASE
  // =================================

  useEffect(() => {

    const fetchProfile = async () => {

      const token = localStorage.getItem('token')

      if (!token) {
        return
      }

      try {

        const response = await fetch(
          'http://localhost:5000/api/auth/profile',
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        const data = await response.json()


        // =================================
        // ERROR RESPONSE
        // =================================

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

            window.location.href = '/login'

            return
          }

          console.error(
            'Profile fetch error:',
            data.message
          )

          return
        }


        // =================================
        // USER DATA
        // =================================

        const user = data.user


        // =================================
        // SET PROFILE
        // =================================

        setProfile({

          name:
            user.name ||
            'User',

          role:
            user.role ||
            'MERN Stack Developer',

          location:
            user.location ||
            '',

          about:
            user.about ||
            '',

          email:
            user.email ||
            '',

          github:
            user.github ||
            '',

          linkedin:
            user.linkedin ||
            ''

        })


        // =================================
        // SET TEACH SKILLS
        // =================================

        setTeachSkills(

          Array.isArray(user.teachSkills)
            ? user.teachSkills
            : []

        )


        // =================================
        // SET LEARN SKILLS
        // =================================

        setLearnSkills(

          Array.isArray(user.learnSkills)
            ? user.learnSkills
            : []

        )


        // =================================
        // UPDATE LOCAL STORAGE
        // =================================

        localStorage.setItem(
          'user',
          JSON.stringify(user)
        )


        // =================================
        // UPDATE NAVBAR
        // =================================

        window.dispatchEvent(
          new Event('userUpdated')
        )


      } catch (error) {

        console.error(
          'Profile fetch error:',
          error
        )

      }

    }


    fetchProfile()

  }, [])


  // =================================
  // PROFILE INPUT CHANGE
  // =================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target

    setProfile(prev => ({
      ...prev,
      [name]: value
    }))

  }


  // =================================
  // ADD TEACH SKILL
  // =================================

  const addTeachSkill = () => {

    const skill =
      newTeachSkill.trim()

    if (!skill) return

    if (!teachSkills.includes(skill)) {

      setTeachSkills(prev => [
        ...prev,
        skill
      ])

    }

    setNewTeachSkill('')

  }


  // =================================
  // ADD LEARN SKILL
  // =================================

  const addLearnSkill = () => {

    const skill =
      newLearnSkill.trim()

    if (!skill) return

    if (!learnSkills.includes(skill)) {

      setLearnSkills(prev => [
        ...prev,
        skill
      ])

    }

    setNewLearnSkill('')

  }


  // =================================
  // REMOVE TEACH SKILL
  // =================================

  const removeTeachSkill = (
    skillToRemove
  ) => {

    setTeachSkills(prev =>
      prev.filter(
        skill =>
          skill !== skillToRemove
      )
    )

  }


  // =================================
  // REMOVE LEARN SKILL
  // =================================

  const removeLearnSkill = (
    skillToRemove
  ) => {

    setLearnSkills(prev =>
      prev.filter(
        skill =>
          skill !== skillToRemove
      )
    )

  }


  // =================================
  // SAVE PROFILE
  // =================================

  const handleSave = async () => {

    const token =
      localStorage.getItem('token')


    // =================================
    // CHECK LOGIN
    // =================================

    if (!token) {

      Swal.fire({

        icon: 'error',

        title: 'Session Expired',

        text: 'Please login again.',

        confirmButtonText:
          'Go to Login'

      })

      return

    }


    // =================================
    // CHECK REQUIRED FIELDS
    // =================================

    if (
      !profile.name.trim() ||
      !profile.email.trim()
    ) {

      Swal.fire({

        icon: 'warning',

        title: 'Required Fields',

        text:
          'Name and email are required.',

        confirmButtonText:
          'Okay'

      })

      return

    }


    try {

      setIsSaving(true)


      // =================================
      // UPDATE PROFILE API
      // =================================

      const response =
        await fetch(
          'http://localhost:5000/api/auth/profile',
          {
            method: 'PUT',

            headers: {

              'Content-Type':
                'application/json',

              'Authorization':
                `Bearer ${token}`

            },

            body: JSON.stringify({

              name:
                profile.name,

              email:
                profile.email,

              role:
                profile.role,

              location:
                profile.location,

              about:
                profile.about,

              github:
                profile.github,

              linkedin:
                profile.linkedin,

              teachSkills:
                teachSkills,

              learnSkills:
                learnSkills

            })

          }
        )


      const data =
        await response.json()


      // =================================
      // ERROR RESPONSE
      // =================================

      if (!response.ok) {

        Swal.fire({

          icon: 'error',

          title: 'Update Failed',

          text:
            data.message ||
            'Unable to update profile.',

          confirmButtonText:
            'Try Again'

        })

        return

      }


      // =================================
      // UPDATE PROFILE STATE
      // =================================

      if (data.user) {

        setProfile({

          name:
            data.user.name ||
            '',

          role:
            data.user.role ||
            '',

          location:
            data.user.location ||
            '',

          about:
            data.user.about ||
            '',

          email:
            data.user.email ||
            '',

          github:
            data.user.github ||
            '',

          linkedin:
            data.user.linkedin ||
            ''

        })


        setTeachSkills(

          Array.isArray(
            data.user.teachSkills
          )
            ? data.user.teachSkills
            : []

        )


        setLearnSkills(

          Array.isArray(
            data.user.learnSkills
          )
            ? data.user.learnSkills
            : []

        )

      }


      // =================================
      // UPDATE LOCAL STORAGE
      // =================================

      localStorage.setItem(
        'user',
        JSON.stringify(data.user)
      )


      // =================================
      // NOTIFY NAVBAR
      // =================================

      window.dispatchEvent(
        new Event('userUpdated')
      )


      // =================================
      // CLOSE EDIT MODE
      // =================================

      setIsEditing(false)


      // =================================
      // SUCCESS POPUP
      // =================================

      Swal.fire({

        icon: 'success',

        title: 'Profile Updated!',

        text:
          'Your profile has been saved successfully.',

        confirmButtonText:
          'Done',

        timer: 2500,

        timerProgressBar: true

      })


    } catch (error) {

      console.error(
        'Profile update error:',
        error
      )


      // =================================
      // SERVER ERROR POPUP
      // =================================

      Swal.fire({

        icon: 'error',

        title: 'Server Error',

        text:
          'Something went wrong. Please try again.',

        confirmButtonText:
          'Okay'

      })

    } finally {

      setIsSaving(false)

    }

  }


  // =================================
  // CANCEL EDIT
  // =================================

  const handleCancel = () => {

    setIsEditing(false)

    setNewTeachSkill('')

    setNewLearnSkill('')

  }


  // =================================
  // RENDER
  // =================================

  return (

    <div className="profile-page">

      <div className="container">


        {/* =========================
            PROFILE HEADER
        ========================= */}

        <div className="profile-header">

          <div className="profile-main">

            <div className="profile-avatar">

              {profile.name

                ? profile.name
                    .charAt(0)
                    .toUpperCase()

                : 'U'}

            </div>


            <div className="profile-info">

              {isEditing ? (

                <input

                  className="
                    profile-edit-input
                    profile-name-input
                  "

                  name="name"

                  value={profile.name}

                  onChange={handleChange}

                />

              ) : (

                <h1>

                  {profile.name}

                </h1>

              )}


              {isEditing ? (

                <input

                  className="
                    profile-edit-input
                  "

                  name="role"

                  value={profile.role}

                  onChange={handleChange}

                />

              ) : (

                <p className="profile-role">

                  {profile.role}

                </p>

              )}


              <p className="profile-location">

                <FiMapPin />


                {isEditing ? (

                  <input

                    className="
                      profile-location-input
                    "

                    name="location"

                    value={profile.location}

                    onChange={handleChange}

                  />

                ) : (

                  profile.location

                )}

              </p>

            </div>

          </div>


          {/* =========================
              EDIT / SAVE BUTTONS
          ========================= */}

          {!isEditing ? (

            <button

              className="edit-profile-btn"

              onClick={() =>
                setIsEditing(true)
              }

            >

              <FiEdit3 />

              Edit Profile

            </button>

          ) : (

            <div className="profile-edit-actions">

              <button

                className="
                  profile-cancel-btn
                "

                onClick={handleCancel}

                disabled={isSaving}

              >

                <FiX />

                Cancel

              </button>


              <button

                className="
                  profile-save-btn
                "

                onClick={handleSave}

                disabled={isSaving}

              >

                <FiSave />

                {isSaving
                  ? 'Saving...'
                  : 'Save Changes'}

              </button>

            </div>

          )}

        </div>


        {/* =========================
            PROFILE CONTENT
        ========================= */}

        <div className="row g-4">


          {/* =========================
              LEFT SECTION
          ========================= */}

          <div className="col-12 col-lg-8">


            {/* =========================
                ABOUT
            ========================= */}

            <div className="profile-card">

              <h2>

                About Me

              </h2>


              {isEditing ? (

                <textarea

                  className="
                    profile-about-input
                  "

                  name="about"

                  value={profile.about}

                  onChange={handleChange}

                  rows="5"

                />

              ) : (

                <p className="about-text">

                  {profile.about}

                </p>

              )}

            </div>


            {/* =========================
                SKILLS I CAN TEACH
            ========================= */}

            <div className="profile-card">

              <div className="profile-card-title">

                <div>

                  <h2>

                    Skills I Can Teach

                  </h2>

                  <p>

                    Skills you can share with others

                  </p>

                </div>

                <FiCode />

              </div>


              <div className="profile-skills">

                {teachSkills.map((skill) => (

                  <span key={skill}>

                    <FiCode />

                    {skill}


                    {isEditing && (

                      <button

                        type="button"

                        className="
                          skill-remove-btn
                        "

                        onClick={() =>
                          removeTeachSkill(skill)
                        }

                      >

                        <FiTrash2 />

                      </button>

                    )}

                  </span>

                ))}

              </div>


              {isEditing && (

                <div className="add-skill-box">

                  <input

                    type="text"

                    placeholder="Add a skill..."

                    value={newTeachSkill}

                    onChange={(e) =>
                      setNewTeachSkill(
                        e.target.value
                      )
                    }

                    onKeyDown={(e) => {

                      if (e.key === 'Enter') {

                        e.preventDefault()

                        addTeachSkill()

                      }

                    }}

                  />


                  <button

                    type="button"

                    onClick={addTeachSkill}

                  >

                    <FiPlus />

                    Add

                  </button>

                </div>

              )}

            </div>


            {/* =========================
                SKILLS I WANT TO LEARN
            ========================= */}

            <div className="profile-card">

              <div className="profile-card-title">

                <div>

                  <h2>

                    Skills I Want To Learn

                  </h2>

                  <p>

                    Skills you want to learn

                  </p>

                </div>

                <FiStar />

              </div>


              <div className="
                profile-skills
                learning-skills
              ">

                {learnSkills.map((skill) => (

                  <span key={skill}>

                    {skill}


                    {isEditing && (

                      <button

                        type="button"

                        className="
                          skill-remove-btn
                        "

                        onClick={() =>
                          removeLearnSkill(skill)
                        }

                      >

                        <FiTrash2 />

                      </button>

                    )}

                  </span>

                ))}

              </div>


              {isEditing && (

                <div className="add-skill-box">

                  <input

                    type="text"

                    placeholder="
                      Add a skill you want to learn...
                    "

                    value={newLearnSkill}

                    onChange={(e) =>
                      setNewLearnSkill(
                        e.target.value
                      )
                    }

                    onKeyDown={(e) => {

                      if (e.key === 'Enter') {

                        e.preventDefault()

                        addLearnSkill()

                      }

                    }}

                  />


                  <button

                    type="button"

                    onClick={addLearnSkill}

                  >

                    <FiPlus />

                    Add

                  </button>

                </div>

              )}

            </div>


            {/* =========================
                CONTACT
            ========================= */}

            <div className="profile-card">

              <h2>

                Contact Information

              </h2>


              <div className="contact-list">


                {/* EMAIL */}

                <div>

                  <FiMail />

                  <span>

                    Email

                  </span>


                  {isEditing ? (

                    <input

                      className="
                        contact-edit-input
                      "

                      name="email"

                      value={profile.email}

                      onChange={handleChange}

                    />

                  ) : (

                    <a

                      href={`mailto:${profile.email}`}

                    >

                      {profile.email}

                    </a>

                  )}

                </div>


                {/* GITHUB */}

                <div>

                  <FiGithub />

                  <span>

                    GitHub

                  </span>


                  {isEditing ? (

                    <input

                      className="
                        contact-edit-input
                      "

                      name="github"

                      value={profile.github}

                      onChange={handleChange}

                    />

                  ) : (

                    <a

                      href={profile.github}

                      target="_blank"

                      rel="noreferrer"

                    >

                      GitHub Profile

                    </a>

                  )}

                </div>


                {/* LINKEDIN */}

                <div>

                  <FiLinkedin />

                  <span>

                    LinkedIn

                  </span>


                  {isEditing ? (

                    <input

                      className="
                        contact-edit-input
                      "

                      name="linkedin"

                      value={profile.linkedin}

                      onChange={handleChange}

                    />

                  ) : (

                    <a

                      href={profile.linkedin}

                      target="_blank"

                      rel="noreferrer"

                    >

                      LinkedIn Profile

                    </a>

                  )}

                </div>

              </div>

            </div>

          </div>


          {/* =========================
              RIGHT SECTION
          ========================= */}

          <div className="col-12 col-lg-4">


            {/* =========================
                ACTIVITY
            ========================= */}

            <div className="profile-card">

              <h2>

                My Activity

              </h2>


              <div className="activity-list">


                {/* SKILLS */}

                <div className="activity-item">

                  <div className="activity-icon">

                    <FiCode />

                  </div>


                  <div>

                    <strong>

                      {
                        teachSkills.length +
                        learnSkills.length
                      }

                    </strong>

                    <span>

                      Skills

                    </span>

                  </div>

                </div>


                {/* EXCHANGES */}

                <div className="activity-item">

                  <div className="activity-icon">

                    <FiRepeat />

                  </div>


                  <div>

                    <strong>

                      8

                    </strong>

                    <span>

                      Exchanges

                    </span>

                  </div>

                </div>


                {/* RATING */}

                <div className="activity-item">

                  <div className="activity-icon">

                    <FiStar />

                  </div>


                  <div>

                    <strong>

                      4.9

                    </strong>

                    <span>

                      Rating

                    </span>

                  </div>

                </div>


                {/* CONNECTIONS */}

                <div className="activity-item">

                  <div className="activity-icon">

                    <FiUsers />

                  </div>


                  <div>

                    <strong>

                      24

                    </strong>

                    <span>

                      Connections

                    </span>

                  </div>

                </div>

              </div>

            </div>


            {/* =========================
                PROFILE COMPLETION
            ========================= */}

            <div className="profile-card">

              <div className="completion-header">

                <h2>

                  Profile Completion

                </h2>

                <strong>

                  80%

                </strong>

              </div>


              <div className="progress">

                <div

                  className="progress-bar"

                  style={{
                    width: '80%'
                  }}

                >

                </div>

              </div>


              <p className="completion-text">

                Complete your profile to get more
                skill exchange opportunities.

              </p>


              {!isEditing && (

                <button

                  className="
                    complete-profile-btn
                  "

                  onClick={() =>
                    setIsEditing(true)
                  }

                >

                  Complete Profile

                </button>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>

  )

}


export default Profile