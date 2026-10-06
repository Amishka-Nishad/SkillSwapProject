import React, { useEffect, useState } from 'react'

import {
  FiUser,
  FiSend,
  FiCheck,
  FiX,
  FiClock,
  FiArrowRight
} from 'react-icons/fi'

import { useNavigate } from 'react-router-dom'

import Swal from 'sweetalert2'


const ExchangeRequests = () => {

  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('incoming')

  const [incomingRequests, setIncomingRequests] = useState([])

  const [sentRequests, setSentRequests] = useState([])

  const [loading, setLoading] = useState(true)

  const [actionLoading, setActionLoading] = useState(null)


  /* =========================
      GET INCOMING REQUESTS
  ========================= */

  const fetchIncomingRequests = async () => {

    try {

      const token = localStorage.getItem('token')

      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch(
        'http://localhost:5000/api/exchange-requests/received',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (response.status === 401) {

        localStorage.removeItem('token')
        localStorage.removeItem('user')

        navigate('/login')

        return
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch requests')
      }

      setIncomingRequests(data.requests || [])

    } catch (error) {

      console.error('Incoming requests error:', error)

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Unable to load incoming requests'
      })

    }

  }


  /* =========================
      GET SENT REQUESTS
  ========================= */

  const fetchSentRequests = async () => {

    try {

      const token = localStorage.getItem('token')

      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch(
        'http://localhost:5000/api/exchange-requests/sent',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (response.status === 401) {

        localStorage.removeItem('token')
        localStorage.removeItem('user')

        navigate('/login')

        return
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch sent requests')
      }

      setSentRequests(data.requests || [])

    } catch (error) {

      console.error('Sent requests error:', error)

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Unable to load sent requests'
      })

    }

  }


  /* =========================
      FETCH REQUESTS
  ========================= */

  useEffect(() => {

    const loadRequests = async () => {

      setLoading(true)

      await Promise.all([
        fetchIncomingRequests(),
        fetchSentRequests()
      ])

      setLoading(false)

    }

    loadRequests()

  }, [])


  /* =========================
      ACCEPT REQUEST
  ========================= */

  const handleAccept = async (id) => {

    try {

      const token = localStorage.getItem('token')

      setActionLoading(id)

      const response = await fetch(
        `http://localhost:5000/api/exchange-requests/${id}/status`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            status: 'Accepted'
          })
        }
      )

      const data = await response.json()

      if (response.status === 401) {

        localStorage.removeItem('token')
        localStorage.removeItem('user')

        navigate('/login')

        return
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to accept request')
      }

      setIncomingRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === id
            ? {
                ...request,
                status: 'Accepted'
              }
            : request
        )
      )

      Swal.fire({
        icon: 'success',
        title: 'Request Accepted',
        text: 'Exchange request accepted successfully.',
        timer: 1800,
        showConfirmButton: false
      })

    } catch (error) {

      console.error('Accept request error:', error)

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Unable to accept request'
      })

    } finally {

      setActionLoading(null)

    }

  }


  /* =========================
      REJECT REQUEST
  ========================= */

  const handleReject = async (id) => {

    try {

      const token = localStorage.getItem('token')

      setActionLoading(id)

      const response = await fetch(
        `http://localhost:5000/api/exchange-requests/${id}/status`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            status: 'Rejected'
          })
        }
      )

      const data = await response.json()

      if (response.status === 401) {

        localStorage.removeItem('token')
        localStorage.removeItem('user')

        navigate('/login')

        return
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reject request')
      }

      setIncomingRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === id
            ? {
                ...request,
                status: 'Rejected'
              }
            : request
        )
      )

      Swal.fire({
        icon: 'success',
        title: 'Request Rejected',
        text: 'Exchange request rejected successfully.',
        timer: 1800,
        showConfirmButton: false
      })

    } catch (error) {

      console.error('Reject request error:', error)

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Unable to reject request'
      })

    } finally {

      setActionLoading(null)

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
      <div className="exchange-page">

        <div className="container">

          <div className="exchange-header">

            <div>

              <span>
                SKILL EXCHANGE
              </span>

              <h1>
                Exchange Requests
              </h1>

              <p>
                Loading your exchange requests...
              </p>

            </div>

          </div>

        </div>

      </div>
    )

  }


  return (
    <>
      <div className="exchange-page">

        <div className="container">


          {/* =========================
              Header
          ========================= */}

          <div className="exchange-header">

            <div>

              <span>
                SKILL EXCHANGE
              </span>

              <h1>
                Exchange Requests
              </h1>

              <p>
                Manage your skill exchange requests and
                connect with other learners.
              </p>

            </div>

          </div>


          {/* =========================
              Tabs
          ========================= */}

          <div className="exchange-tabs">


            <button
              className={`exchange-tab ${
                activeTab === 'incoming'
                  ? 'active'
                  : ''
              }`}
              onClick={() => setActiveTab('incoming')}
            >

              <FiUser />

              Incoming

              <span>
                {incomingRequests.length}
              </span>

            </button>


            <button
              className={`exchange-tab ${
                activeTab === 'sent'
                  ? 'active'
                  : ''
              }`}
              onClick={() => setActiveTab('sent')}
            >

              <FiSend />

              Sent

              <span>
                {sentRequests.length}
              </span>

            </button>


          </div>


          {/* =========================
              INCOMING REQUESTS
          ========================= */}

          {activeTab === 'incoming' && (

            <div className="exchange-section">

              <div className="section-heading">

                <div>

                  <h2>
                    Incoming Requests
                  </h2>

                  <p>
                    People who want to exchange skills
                    with you.
                  </p>

                </div>

                <span className="request-count">
                  {incomingRequests.length} Requests
                </span>

              </div>


              {incomingRequests.length === 0 ? (

                <div className="no-requests">

                  <FiSend />

                  <h3>
                    No incoming requests
                  </h3>

                  <p>
                    You don't have any incoming
                    exchange requests right now.
                  </p>

                </div>

              ) : (

                incomingRequests.map((request) => {

                  const senderName =
                    request.sender?.name || 'Unknown User'

                  const skillName =
                    request.skill?.name || 'Unknown Skill'

                  const initial =
                    senderName.charAt(0).toUpperCase()

                  const status =
                    request.status?.toLowerCase()

                  return (

                    <div
                      className="request-card"
                      key={request._id}
                    >


                      {/* USER */}

                      <div className="request-user">

                        <div className="request-avatar">
                          {initial}
                        </div>

                        <div>

                          <h3>
                            {senderName}
                          </h3>

                          <p>
                            Wants to learn {skillName} from you
                          </p>

                        </div>

                      </div>


                      {/* EXCHANGE */}

                      <div className="request-exchange">

                        <div>

                          <span>
                            They offer
                          </span>

                          <strong>
                            Skill Exchange
                          </strong>

                        </div>


                        <FiArrowRight />


                        <div>

                          <span>
                            They want
                          </span>

                          <strong>
                            {skillName}
                          </strong>

                        </div>

                      </div>


                      {/* STATUS */}

                      {status === 'pending' ? (

                        <div className="request-status pending">

                          <FiClock />

                          Pending

                        </div>

                      ) : status === 'accepted' ? (

                        <div className="request-status accepted">

                          <FiCheck />

                          Accepted

                        </div>

                      ) : (

                        <div className="request-status rejected">

                          <FiX />

                          Rejected

                        </div>

                      )}


                      {/* ACTIONS */}

                      {status === 'pending' ? (

                        <div className="request-actions">

                          <button
                            className="accept-btn"
                            onClick={() =>
                              handleAccept(request._id)
                            }
                            disabled={actionLoading === request._id}
                          >

                            <FiCheck />

                            {actionLoading === request._id
                              ? 'Processing...'
                              : 'Accept'}

                          </button>


                          <button
                            className="reject-btn"
                            onClick={() =>
                              handleReject(request._id)
                            }
                            disabled={actionLoading === request._id}
                          >

                            <FiX />

                            Reject

                          </button>

                        </div>

                      ) : status === 'accepted' ? (

                        <div className="request-actions">

                          <button
                            className="message-request-btn"
                            onClick={handleMessage}
                          >

                            Message

                            <FiArrowRight />

                          </button>

                        </div>

                      ) : null}

                    </div>

                  )

                })

              )}

            </div>

          )}


          {/* =========================
              SENT REQUESTS
          ========================= */}

          {activeTab === 'sent' && (

            <div className="exchange-section sent-section">

              <div className="section-heading">

                <div>

                  <h2>
                    Recent Sent Requests
                  </h2>

                  <p>
                    Requests you have sent to
                    other users.
                  </p>

                </div>

              </div>


              {sentRequests.length === 0 ? (

                <div className="no-requests">

                  <FiSend />

                  <h3>
                    No sent requests
                  </h3>

                  <p>
                    You haven't sent any exchange
                    requests yet.
                  </p>

                </div>

              ) : (

                sentRequests.map((request) => {

                  const receiverName =
                    request.receiver?.name || 'Unknown User'

                  const skillName =
                    request.skill?.name || 'Unknown Skill'

                  const initial =
                    receiverName.charAt(0).toUpperCase()

                  const status =
                    request.status?.toLowerCase()

                  return (

                    <div
                      className="sent-request-card"
                      key={request._id}
                    >

                      <div className="request-avatar">
                        {initial}
                      </div>


                      <div className="sent-user-info">

                        <h3>
                          {receiverName}
                        </h3>

                        <p>
                          {skillName}
                        </p>

                      </div>


                      <div className="sent-skill">

                        <span>
                          You want to learn
                        </span>

                        <strong>
                          {skillName}
                        </strong>

                      </div>


                      {status === 'pending' ? (

                        <div className="request-status pending">

                          <FiClock />

                          Pending

                        </div>

                      ) : status === 'accepted' ? (

                        <div className="request-status accepted">

                          <FiCheck />

                          Accepted

                        </div>

                      ) : (

                        <div className="request-status rejected">

                          <FiX />

                          Rejected

                        </div>

                      )}

                    </div>

                  )

                })

              )}

            </div>

          )}


        </div>

      </div>
    </>
  )
}


export default ExchangeRequests