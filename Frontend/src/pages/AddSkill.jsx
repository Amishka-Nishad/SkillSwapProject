import React, {
  useEffect,
  useState
} from 'react'

import {
  FiCode,
  FiBookOpen,
  FiTarget,
  FiClock,
  FiArrowRight,
  FiCheckCircle
} from 'react-icons/fi'

import {
  useNavigate,
  useSearchParams
} from 'react-router-dom'

import Swal from 'sweetalert2'


const AddSkill = () => {

  const navigate = useNavigate()

  const [searchParams] =
    useSearchParams()


  // =========================
  // EDIT MODE
  // =========================

  const editSkillId =
    searchParams.get('edit')

  const isEditMode =
    Boolean(editSkillId)


  // =========================
  // FORM STATES
  // =========================

  const [skillName, setSkillName] =
    useState('')

  const [category, setCategory] =
    useState('')

  const [description, setDescription] =
    useState('')

  const [level, setLevel] =
    useState('')

  const [learningGoal, setLearningGoal] =
    useState('')

  const [availability, setAvailability] =
    useState('')


  const [success, setSuccess] =
    useState(false)

  const [loading, setLoading] =
    useState(false)

  const [loadingSkill, setLoadingSkill] =
    useState(false)


  // =========================
  // FETCH SKILL FOR EDIT
  // =========================

  useEffect(() => {

    if (!isEditMode) {
      return
    }


    const fetchSkill = async () => {

      const token =
        localStorage.getItem('token')


      if (!token) {

        navigate('/login')

        return

      }


      try {

        setLoadingSkill(true)


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
            title: 'Unable to Load Skill',
            text:
              data.message ||
              'Something went wrong.',
            confirmButtonText: 'Okay'
          })


          navigate(
            '/dashboard/my-skills'
          )

          return

        }


        const skill =
          (data.skills || []).find(
            item =>
              item._id === editSkillId
          )


        if (!skill) {

          Swal.fire({
            icon: 'error',
            title: 'Skill Not Found',
            text:
              'The selected skill could not be found.',
            confirmButtonText: 'Okay'
          })


          navigate(
            '/dashboard/my-skills'
          )

          return

        }


        // =========================
        // FILL FORM
        // =========================

        setSkillName(
          skill.name || ''
        )

        setCategory(
          skill.category || ''
        )

        setDescription(
          skill.description || ''
        )

        setLevel(
          skill.level || 'Beginner'
        )


      } catch (error) {

        console.error(
          'Fetch skill error:',
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

        setLoadingSkill(false)

      }

    }


    fetchSkill()

  }, [
    editSkillId,
    isEditMode,
    navigate
  ])


  // =========================
  // SUBMIT FORM
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault()


    // =========================
    // VALIDATION
    // =========================

    if (
      !skillName ||
      !category ||
      !description ||
      !level
    ) {

      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text:
          'Please fill all the required fields.',
        confirmButtonText: 'OK'
      })

      return

    }


    // Learning goal + availability
    // only required while adding

    if (
      !isEditMode &&
      (!learningGoal || !availability)
    ) {

      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text:
          'Please fill all the fields.',
        confirmButtonText: 'OK'
      })

      return

    }


    // =========================
    // TOKEN
    // =========================

    const token =
      localStorage.getItem('token')


    if (!token) {

      Swal.fire({
        icon: 'error',
        title: 'Login Required',
        text:
          'Please login to continue.',
        confirmButtonText:
          'Go to Login'
      })


      navigate('/login')

      return

    }


    try {

      setLoading(true)


      // =========================
      // ADD / UPDATE API
      // =========================

      const url = isEditMode

        ? `http://localhost:5000/api/skills/${editSkillId}`

        : 'http://localhost:5000/api/skills'


      const method =
        isEditMode
          ? 'PUT'
          : 'POST'


      const response =
        await fetch(
          url,
          {
            method,

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${token}`
            },

            body: JSON.stringify({

              name:
                skillName,

              category:
                category,

              type:
                'Teach',

              description:
                description,

              level:
                level

            })
          }
        )


      const data =
        await response.json()


      // =========================
      // API ERROR
      // =========================

      if (!response.ok) {

        if (response.status === 401) {

          localStorage.removeItem('token')
          localStorage.removeItem('user')


          await Swal.fire({
            icon: 'error',
            title: 'Session Expired',
            text:
              'Please login again.',
            confirmButtonText:
              'Go to Login'
          })


          navigate('/login')

          return

        }


        Swal.fire({
          icon: 'error',
          title:
            isEditMode
              ? 'Unable to Update Skill'
              : 'Unable to Add Skill',

          text:
            data.message ||
            'Something went wrong.',

          confirmButtonText:
            'OK'
        })


        return

      }


      // =========================
      // EDIT SUCCESS
      // =========================

      if (isEditMode) {

        Swal.fire({
          icon: 'success',
          title: 'Skill Updated!',
          text:
            'Your skill has been updated successfully.',
          confirmButtonText: 'Great!'
        })


        navigate(
          '/dashboard/my-skills'
        )


        return

      }


      // =========================
      // ADD SUCCESS
      // =========================

      setSuccess(true)


      Swal.fire({
        icon: 'success',
        title: 'Skill Added!',
        text:
          'Your skill has been added successfully.',
        confirmButtonText: 'Great!'
      })


      // =========================
      // CLEAR FORM
      // =========================

      setSkillName('')

      setCategory('')

      setDescription('')

      setLevel('')

      setLearningGoal('')

      setAvailability('')


    } catch (error) {

      console.error(
        'Add/Update skill error:',
        error
      )


      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text:
          'Unable to connect to the server.',
        confirmButtonText: 'OK'
      })


    } finally {

      setLoading(false)

    }

  }


  // =========================
  // LOADING EDIT SKILL
  // =========================

  if (loadingSkill) {

    return (

      <div className="add-skill-page">

        <div className="container">

          <div className="add-skill-header">

            <span>
              SKILL INFORMATION
            </span>

            <h1>
              Loading Skill...
            </h1>

            <p>
              Please wait while we load your skill.
            </p>

          </div>

        </div>

      </div>

    )

  }


  return (

    <div className="add-skill-page">

      <div className="container">


        {/* =========================
            HEADER
        ========================= */}

        <div className="add-skill-header">

          <span>
            {isEditMode
              ? 'UPDATE YOUR SKILL'
              : 'SHARE YOUR KNOWLEDGE'
            }
          </span>

          <h1>

            {isEditMode
              ? 'Edit Skill'
              : 'Offer a Skill'
            }

          </h1>

          <p>

            {isEditMode

              ? 'Update your skill information and keep your profile up to date.'

              : 'Share something you know and find someone who can teach you something new.'
            }

          </p>

        </div>


        <div className="row g-4">


          {/* =========================
              FORM
          ========================= */}

          <div className="col-12 col-lg-8">

            <div className="add-skill-card">


              <div className="form-heading">

                <div>

                  <h2>
                    Skill Information
                  </h2>

                  <p className="form-subtitle">

                    {isEditMode
                      ? 'Update the information about your skill.'
                      : 'Tell us about the skill you want to share.'
                    }

                  </p>

                </div>

                <div className="form-heading-icon">

                  <FiCode />

                </div>

              </div>


              <form
                onSubmit={handleSubmit}
              >


                {/* Skill Name */}

                <div className="form-group">

                  <label>
                    Skill Name
                  </label>

                  <div className="input-wrapper">

                    <FiCode />

                    <input
                      type="text"
                      placeholder="e.g. React.js"
                      value={skillName}
                      onChange={(e) =>
                        setSkillName(
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>


                {/* Category */}

                <div className="form-group">

                  <label>
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Select a category
                    </option>

                    <option value="Technology">
                      Technology
                    </option>

                    <option value="Design">
                      Design
                    </option>

                    <option value="Languages">
                      Languages
                    </option>

                    <option value="Business">
                      Business
                    </option>

                    <option value="Music">
                      Music
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>


                {/* Description */}

                <div className="form-group">

                  <label>
                    Description
                  </label>

                  <textarea
                    rows="5"
                    placeholder="Tell others what you can teach..."
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }
                  />

                  <span className="field-hint">
                    Give a short and clear description of your skill.
                  </span>

                </div>


                {/* Experience */}

                <div className="form-group">

                  <label>
                    Your Experience Level
                  </label>

                  <div className="level-options">


                    <label
                      className={`level-option ${
                        level === 'Beginner'
                          ? 'selected'
                          : ''
                      }`}
                    >

                      <input
                        type="radio"
                        name="level"
                        value="Beginner"
                        checked={
                          level === 'Beginner'
                        }
                        onChange={(e) =>
                          setLevel(
                            e.target.value
                          )
                        }
                      />

                      <span>
                        Beginner
                      </span>

                    </label>


                    <label
                      className={`level-option ${
                        level === 'Intermediate'
                          ? 'selected'
                          : ''
                      }`}
                    >

                      <input
                        type="radio"
                        name="level"
                        value="Intermediate"
                        checked={
                          level === 'Intermediate'
                        }
                        onChange={(e) =>
                          setLevel(
                            e.target.value
                          )
                        }
                      />

                      <span>
                        Intermediate
                      </span>

                    </label>


                    <label
                      className={`level-option ${
                        level === 'Advanced'
                          ? 'selected'
                          : ''
                      }`}
                    >

                      <input
                        type="radio"
                        name="level"
                        value="Advanced"
                        checked={
                          level === 'Advanced'
                        }
                        onChange={(e) =>
                          setLevel(
                            e.target.value
                          )
                        }
                      />

                      <span>
                        Advanced
                      </span>

                    </label>

                  </div>

                </div>


                {/* Learning Goal */}

                <div className="form-group">

                  <label>

                    What do you want to learn?

                    {!isEditMode && (
                      <span>
                        {' '}*
                      </span>
                    )}

                  </label>

                  <div className="input-wrapper">

                    <FiTarget />

                    <input
                      type="text"
                      placeholder="e.g. UI/UX Design"
                      value={learningGoal}
                      onChange={(e) =>
                        setLearningGoal(
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>


                {/* Availability */}

                <div className="form-group">

                  <label>

                    Availability

                    {!isEditMode && (
                      <span>
                        {' '}*
                      </span>
                    )}

                  </label>

                  <div className="input-wrapper">

                    <FiClock />

                    <input
                      type="text"
                      placeholder="e.g. Weekends, 2 hours"
                      value={availability}
                      onChange={(e) =>
                        setAvailability(
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>


                {/* Success */}

                {success && (

                  <div className="skill-success-message">

                    <FiCheckCircle />

                    <span>
                      Skill added successfully!
                    </span>

                  </div>

                )}


                {/* Submit */}

                <button
                  type="submit"
                  className="offer-skill-btn"
                  disabled={loading}
                >

                  {loading

                    ? isEditMode
                      ? 'Updating Skill...'
                      : 'Adding Skill...'

                    : isEditMode
                      ? 'Update Skill'
                      : success
                        ? 'Skill Added'
                        : 'Offer This Skill'

                  }


                  {!loading && (

                    isEditMode

                      ? <FiCheckCircle />

                      : success

                        ? <FiCheckCircle />

                        : <FiArrowRight />

                  )}

                </button>


                {success && !isEditMode && (

                  <button
                    type="button"
                    className="view-my-skills-btn"
                    onClick={() =>
                      navigate(
                        '/dashboard/my-skills'
                      )
                    }
                  >

                    View My Skills

                  </button>

                )}


                {isEditMode && (

                  <button
                    type="button"
                    className="view-my-skills-btn"
                    onClick={() =>
                      navigate(
                        '/dashboard/my-skills'
                      )
                    }
                  >

                    Cancel

                  </button>

                )}

              </form>

            </div>

          </div>


          {/* =========================
              SIDE INFORMATION
          ========================= */}

          <div className="col-12 col-lg-4">

            <div className="skill-tip-card">

              <div className="tip-icon">

                <FiBookOpen />

              </div>

              <h3>
                Make your skill stand out
              </h3>

              <p>
                A clear description helps people understand
                what they can learn from you.
              </p>


              <div className="tip-list">

                <div>
                  ✓ Add a clear skill name
                </div>

                <div>
                  ✓ Explain what you can teach
                </div>

                <div>
                  ✓ Mention your experience
                </div>

                <div>
                  ✓ Add your learning goal
                </div>

              </div>

            </div>


            {/* Small Info Card */}

            <div className="skill-tip-card skill-tip-secondary">

              <div className="tip-icon">

                <FiTarget />

              </div>

              <h3>
                Find the right match
              </h3>

              <p>
                Add a learning goal so SkillSwap can
                help you find better exchange partners.
              </p>

            </div>

          </div>


        </div>

      </div>

    </div>

  )

}


export default AddSkill