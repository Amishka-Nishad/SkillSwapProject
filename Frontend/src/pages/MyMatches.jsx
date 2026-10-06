import React, { useEffect, useState } from 'react'

import {
  FiSearch,
  FiMessageCircle,
  FiArrowRight,
  FiUser,
  FiStar
} from 'react-icons/fi'

import { useNavigate } from 'react-router-dom'

import Swal from 'sweetalert2'


const MyMatches = () => {

  const navigate = useNavigate()

  const [search, setSearch] = useState('')

  const [matches, setMatches] = useState([])

  const [loading, setLoading] = useState(true)


  /* =========================
      FETCH MATCHES
  ========================= */

  useEffect(() => {

    const fetchMatches = async () => {

      try {

        const token = localStorage.getItem('token')

        if (!token) {
          navigate('/login')
          return
        }


        /* =========================
            GET RECEIVED REQUESTS
        ========================= */

        const receivedResponse = await fetch(
          'http://localhost:5000/api/exchange-requests/received',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const receivedData =
          await receivedResponse.json()


        if (receivedResponse.status === 401) {

          localStorage.removeItem('token')
          localStorage.removeItem('user')

          navigate('/login')

          return
        }


        if (!receivedResponse.ok) {

          throw new Error(
            receivedData.message ||
            'Failed to fetch received requests'
          )

        }


        /* =========================
            GET SENT REQUESTS
        ========================= */

        const sentResponse = await fetch(
          'http://localhost:5000/api/exchange-requests/sent',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const sentData =
          await sentResponse.json()


        if (sentResponse.status === 401) {

          localStorage.removeItem('token')
          localStorage.removeItem('user')

          navigate('/login')

          return
        }


        if (!sentResponse.ok) {

          throw new Error(
            sentData.message ||
            'Failed to fetch sent requests'
          )

        }


        /* =========================
            ONLY ACCEPTED REQUESTS
        ========================= */

        const acceptedReceived =
          (receivedData.requests || [])
            .filter(
              (request) =>
                request.status === 'Accepted'
            )


        const acceptedSent =
          (sentData.requests || [])
            .filter(
              (request) =>
                request.status === 'Accepted'
            )


        /* =========================
            CONVERT RECEIVED MATCHES
        ========================= */

        const receivedMatches =
          acceptedReceived.map((request) => {

            const userName =
              request.sender?.name ||
              'Unknown User'

            const skillName =
              request.skill?.name ||
              'Unknown Skill'

            return {

              id: request._id,

              name: userName,

              avatar:
                userName
                  .charAt(0)
                  .toUpperCase(),

              role: 'SkillSwap Member',

              percent: 100,

              rating: 'New',

              skills: [
                skillName
              ],

              teaches: 'Your Skill',

              wants: skillName

            }

          })


        /* =========================
            CONVERT SENT MATCHES
        ========================= */

        const sentMatches =
          acceptedSent.map((request) => {

            const userName =
              request.receiver?.name ||
              'Unknown User'

            const skillName =
              request.skill?.name ||
              'Unknown Skill'

            return {

              id: request._id,

              name: userName,

              avatar:
                userName
                  .charAt(0)
                  .toUpperCase(),

              role: 'SkillSwap Member',

              percent: 100,

              rating: 'New',

              skills: [
                skillName
              ],

              teaches: skillName,

              wants: 'Your Skill'

            }

          })


        /* =========================
            COMBINE MATCHES
        ========================= */

        const allMatches = [
          ...receivedMatches,
          ...sentMatches
        ]


        /* =========================
            REMOVE DUPLICATE USERS
        ========================= */

        const uniqueMatches =
          allMatches.filter(
            (match, index, array) =>
              index ===
              array.findIndex(
                (item) =>
                  item.name === match.name
              )
          )


        setMatches(uniqueMatches)

      } catch (error) {

        console.error(
          'Fetch matches error:',
          error
        )

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            error.message ||
            'Unable to load your matches'
        })

      } finally {

        setLoading(false)

      }

    }


    fetchMatches()

  }, [navigate])


  /* =========================
      SEARCH FILTER
  ========================= */

  const filteredMatches =
    matches.filter((match) => {

      const searchText =
        search
          .toLowerCase()
          .trim()


      return (

        match.name
          .toLowerCase()
          .includes(searchText)

        ||

        match.role
          .toLowerCase()
          .includes(searchText)

        ||

        match.teaches
          .toLowerCase()
          .includes(searchText)

        ||

        match.wants
          .toLowerCase()
          .includes(searchText)

        ||

        match.skills.some((skill) =>
          skill
            .toLowerCase()
            .includes(searchText)
        )

      )

    })


  /* =========================
      LOADING
  ========================= */

  if (loading) {

    return (

      <div className="matches-page">

        <div className="container">

          <div className="matches-header">

            <span>
              YOUR COMMUNITY
            </span>

            <h1>
              My Matches
            </h1>

            <p>
              Loading your matches...
            </p>

          </div>

        </div>

      </div>

    )

  }


  return (

    <div className="matches-page">

      <div className="container">


        {/* =========================
            HEADER
        ========================= */}

        <div className="matches-header">

          <span>
            YOUR COMMUNITY
          </span>

          <h1>
            My Matches
          </h1>

          <p>
            People matched with you based on your
            skills and interests.
          </p>

        </div>


        {/* =========================
            SEARCH
        ========================= */}

        <div className="matches-search">

          <FiSearch />

          <input
            type="text"
            placeholder="Search your matches..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        {/* =========================
            RESULT INFO
        ========================= */}

        <div className="matches-result-info">

          <div>

            <h2>
              Your Matches
            </h2>

            <p>
              Find people who match your learning goals.
            </p>

          </div>

          <span>
            {filteredMatches.length} matches found
          </span>

        </div>


        {/* =========================
            MATCHES
        ========================= */}

        {filteredMatches.length > 0 ? (

          <div className="matches-grid">

            {filteredMatches.map((match) => (

              <div
                className="match-card"
                key={match.id}
              >


                {/* =========================
                    CARD TOP
                ========================= */}

                <div className="match-top">

                  <div className="match-avatar">

                    {match.avatar}

                  </div>

                  <span className="match-percent">

                    {match.percent}% Match

                  </span>

                </div>


                {/* =========================
                    USER INFO
                ========================= */}

                <h2>
                  {match.name}
                </h2>

                <p className="match-role">
                  {match.role}
                </p>


                {/* =========================
                    RATING
                ========================= */}

                <div className="match-rating">

                  <FiStar />

                  <strong>
                    {match.rating}
                  </strong>

                  <span>
                    Exchange partner
                  </span>

                </div>


                {/* =========================
                    SKILLS
                ========================= */}

                <div className="match-skills">

                  {match.skills.map((skill) => (

                    <span key={skill}>
                      {skill}
                    </span>

                  ))}

                </div>


                {/* =========================
                    EXCHANGE
                ========================= */}

                <div className="match-exchange">

                  <div className="exchange-item">

                    <span>
                      Can teach
                    </span>

                    <strong>
                      {match.teaches}
                    </strong>

                  </div>


                  <FiArrowRight
                    className="exchange-arrow"
                  />


                  <div className="exchange-item">

                    <span>
                      Wants
                    </span>

                    <strong>
                      {match.wants}
                    </strong>

                  </div>

                </div>


                {/* =========================
                    ACTIONS
                ========================= */}

                <div className="match-actions">

                  <button
                    className="message-btn"
                    onClick={() =>
                      navigate(
                        '/dashboard/messages'
                      )
                    }
                  >

                    <FiMessageCircle />

                    Message

                  </button>


                  <button
                    className="view-btn"
                    onClick={() =>
                      navigate(
                        '/dashboard/profile'
                      )
                    }
                  >

                    <FiUser />

                    View Profile

                  </button>

                </div>


              </div>

            ))}

          </div>

        ) : (


          /* =========================
              NO RESULTS
          ========================= */

          <div className="matches-empty">

            <div className="empty-search-icon">

              <FiSearch />

            </div>

            <h3>
              No matches found
            </h3>

            <p>
              {search
                ? 'Try searching with another name, skill or role.'
                : 'Accept an exchange request to start building your matches.'
              }
            </p>

            <button
              onClick={() => {

                if (search) {

                  setSearch('')

                } else {

                  navigate(
                    '/dashboard/exchange-requests'
                  )

                }

              }}
            >

              {search
                ? 'View All Matches'
                : 'View Exchange Requests'
              }

            </button>

          </div>

        )}


      </div>

    </div>

  )

}


export default MyMatches