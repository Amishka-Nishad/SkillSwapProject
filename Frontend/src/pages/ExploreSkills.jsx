import React, { useEffect, useState } from 'react'

import {
  FiSearch,
  FiCode,
  FiPenTool,
  FiGlobe,
  FiBriefcase,
  FiMusic,
  FiArrowRight
} from 'react-icons/fi'

import {
  useNavigate,
  useSearchParams
} from 'react-router-dom'

import Swal from 'sweetalert2'

import SkillCard from '../components/explore/SkillCard'


const ExploreSkills = () => {

  const navigate = useNavigate()

  const [searchParams] = useSearchParams()

  const urlSearch = searchParams.get('search') || ''

  const [search, setSearch] = useState(urlSearch)

  const [activeCategory, setActiveCategory] =
    useState('All Skills')

  const [skills, setSkills] = useState([])

  const [loading, setLoading] = useState(true)


  /* =========================
      FETCH ALL SKILLS
  ========================= */

  useEffect(() => {

    const fetchSkills = async () => {

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
            data.message || 'Failed to fetch skills'
          )

        }


        /* =========================
            CONVERT BACKEND DATA
        ========================= */

        const formattedSkills = data.skills.map((item) => ({

          id: item._id,

          skill: item.name,

          category: item.category,

          description:
            item.description ||
            'Learn this skill and connect with a skill partner.',

          name:
            item.user?.name ||
            'Skill Partner',

          rating: '0',

          learners: '0',

          initial:
            item.user?.name
              ? item.user.name.charAt(0).toUpperCase()
              : 'S'

        }))


        setSkills(formattedSkills)

      } catch (error) {

        console.error(
          'Fetch skills error:',
          error
        )

        Swal.fire({
          icon: 'error',
          title: 'Unable to Load Skills',
          text: error.message || 'Something went wrong.',
          confirmButtonColor: '#7553db'
        })

      } finally {

        setLoading(false)

      }

    }


    fetchSkills()

  }, [navigate])


  /* =========================
      SEARCH
  ========================= */

  const handleSearch = () => {

    const trimmedSearch = search.trim()

    if (trimmedSearch) {

      navigate(
        `/dashboard/explore-skills?search=${encodeURIComponent(
          trimmedSearch
        )}`
      )

    } else {

      navigate(
        '/dashboard/explore-skills'
      )

    }

  }


  /* =========================
      ENTER KEY SEARCH
  ========================= */

  const handleSearchKeyDown = (e) => {

    if (e.key === 'Enter') {
      handleSearch()
    }

  }


  /* =========================
      URL SEARCH SYNC
  ========================= */

  useEffect(() => {

    setSearch(urlSearch)

  }, [urlSearch])


  /* =========================
      CATEGORY FILTER
  ========================= */

  const handleCategory = (category) => {

    setActiveCategory(category)

  }


  /* =========================
      FILTER SKILLS
  ========================= */

  const filteredSkills = skills.filter((item) => {

    const matchesCategory =
      activeCategory === 'All Skills' ||
      item.category === activeCategory


    const searchText =
      search.toLowerCase().trim()


    const matchesSearch =
      searchText === '' ||
      item.skill.toLowerCase().includes(searchText) ||
      item.name.toLowerCase().includes(searchText) ||
      item.category.toLowerCase().includes(searchText)


    return matchesCategory && matchesSearch

  })


  /* =========================
      VIEW ALL
  ========================= */

  const handleViewAll = () => {

    setSearch('')

    setActiveCategory('All Skills')

    navigate(
      '/dashboard/explore-skills'
    )

  }


  /* =========================
      VIEW SKILL
  ========================= */

  const handleViewSkill = (skillName) => {

    navigate(
      `/dashboard/skill-details?skill=${encodeURIComponent(
        skillName
      )}`
    )

  }


  return (
    <>

      <div className="explore-page">

        <div className="container">


          {/* =========================
              HEADER
          ========================= */}

          <div className="explore-header">

            <span className="explore-badge">
              DISCOVER & LEARN
            </span>

            <h1>
              Explore Skills
            </h1>

            <p>
              Discover new skills and connect with people
              who can teach you something valuable.
            </p>

          </div>


          {/* =========================
              SEARCH
          ========================= */}

          <div className="explore-search-box">

            <FiSearch className="search-icon" />

            <input
              type="text"
              placeholder="Search for skills, people..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              onKeyDown={handleSearchKeyDown}
            />

            <button
              onClick={handleSearch}
            >
              Search
            </button>

          </div>


          {/* =========================
              CATEGORIES
          ========================= */}

          <div className="category-section">

            <h3>
              Browse by category
            </h3>


            <div className="category-list">


              {/* ALL SKILLS */}

              <button
                className={`category-card ${
                  activeCategory === 'All Skills'
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  handleCategory('All Skills')
                }
              >

                <div className="category-icon">
                  <FiGlobe />
                </div>

                <span>
                  All Skills
                </span>

              </button>


              {/* TECHNOLOGY */}

              <button
                className={`category-card ${
                  activeCategory === 'Technology'
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  handleCategory('Technology')
                }
              >

                <div className="category-icon">
                  <FiCode />
                </div>

                <span>
                  Technology
                </span>

              </button>


              {/* DESIGN */}

              <button
                className={`category-card ${
                  activeCategory === 'Design'
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  handleCategory('Design')
                }
              >

                <div className="category-icon">
                  <FiPenTool />
                </div>

                <span>
                  Design
                </span>

              </button>


              {/* LANGUAGES */}

              <button
                className={`category-card ${
                  activeCategory === 'Languages'
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  handleCategory('Languages')
                }
              >

                <div className="category-icon">
                  <FiGlobe />
                </div>

                <span>
                  Languages
                </span>

              </button>


              {/* BUSINESS */}

              <button
                className={`category-card ${
                  activeCategory === 'Business'
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  handleCategory('Business')
                }
              >

                <div className="category-icon">
                  <FiBriefcase />
                </div>

                <span>
                  Business
                </span>

              </button>


              {/* MUSIC */}

              <button
                className={`category-card ${
                  activeCategory === 'Music'
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  handleCategory('Music')
                }
              >

                <div className="category-icon">
                  <FiMusic />
                </div>

                <span>
                  Music
                </span>

              </button>


            </div>

          </div>


          {/* =========================
              POPULAR SKILLS HEADER
          ========================= */}

          <div className="skills-top">

            <div>

              <h2>

                {activeCategory === 'All Skills'
                  ? 'Popular Skills'
                  : activeCategory}

              </h2>

              <p>
                Find the right skill partner for you
              </p>

            </div>


            <button
              className="view-all-skills"
              onClick={handleViewAll}
            >

              View All

              <FiArrowRight />

            </button>

          </div>


          {/* =========================
              LOADING
          ========================= */}

          {loading && (

            <div className="col-12 text-center py-5">

              <h4>
                Loading skills...
              </h4>

            </div>

          )}


          {/* =========================
              SKILL CARDS
          ========================= */}

          {!loading && (

            <div className="row g-4">

              {filteredSkills.map((item) => (

                <div
                  className="col-12 col-md-6 col-xl-4"
                  key={item.id}
                >

                  <SkillCard
                    skill={item.skill}
                    category={item.category}
                    description={item.description}
                    name={item.name}
                    rating={item.rating}
                    learners={item.learners}
                    initial={item.initial}
                    onViewSkill={handleViewSkill}
                  />

                </div>

              ))}


              {/* =========================
                  NO RESULT
              ========================= */}

              {filteredSkills.length === 0 && (

                <div className="col-12">

                  <div className="no-skills-found">

                    <FiSearch />

                    <h3>
                      No skills found
                    </h3>

                    <p>
                      Try searching for another skill,
                      person or category.
                    </p>

                    <button
                      onClick={handleViewAll}
                    >
                      View All Skills
                    </button>

                  </div>

                </div>

              )}

            </div>

          )}


        </div>

      </div>

    </>
  )
}


export default ExploreSkills