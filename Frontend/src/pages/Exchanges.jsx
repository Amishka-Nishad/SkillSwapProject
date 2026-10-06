import React, { useEffect, useState } from 'react'

import {
  FiRefreshCw,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiMessageCircle,
  FiArrowRight
} from 'react-icons/fi'

import { useNavigate } from 'react-router-dom'

import Swal from 'sweetalert2'


const Exchanges = () => {

  const navigate = useNavigate()

  const [activeFilter, setActiveFilter] =
    useState('all')

  const [exchanges, setExchanges] =
    useState([])

  const [loading, setLoading] =
    useState(true)


  // =========================================
  // FETCH EXCHANGES
  // =========================================

  const fetchExchanges = async () => {

    const token =
      localStorage.getItem('token')

    if (!token) {

      navigate('/login')

      return

    }


    try {

      setLoading(true)


      // =================================
      // GET RECEIVED REQUESTS
      // =================================

      const receivedResponse =
        await fetch(
          'http://localhost:5000/api/exchange-requests/received',
          {
            method: 'GET',

            headers: {
              'Authorization':
                `Bearer ${token}`
            }
          }
        )


      const receivedData =
        await receivedResponse.json()


      // =================================
      // GET SENT REQUESTS
      // =================================

      const sentResponse =
        await fetch(
          'http://localhost:5000/api/exchange-requests/sent',
          {
            method: 'GET',

            headers: {
              'Authorization':
                `Bearer ${token}`
            }
          }
        )


      const sentData =
        await sentResponse.json()


      // =================================
      // SESSION ERROR
      // =================================

      if (
        receivedResponse.status === 401 ||
        sentResponse.status === 401
      ) {

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


      // =================================
      // CHECK RESPONSE
      // =================================

      if (
        !receivedResponse.ok ||
        !sentResponse.ok
      ) {

        throw new Error(
          'Failed to fetch exchanges'
        )

      }


      // =================================
      // RECEIVED EXCHANGES
      // =================================

      const receivedExchanges =
        (receivedData.requests || [])
          .filter(
            (request) =>
              [
                'Accepted',
                'Completed',
                'Cancelled'
              ].includes(request.status)
          )
          .map((request) => {

            const skill =
              request.skill

            const sender =
              request.sender


            return {

              id:
                request._id,

              name:
                sender?.name ||
                'User',

              avatar:
                sender?.name
                  ?.charAt(0)
                  ?.toUpperCase() ||
                '?',

              skills:
                `${skill?.name || 'Skill'} ↔ Skill Exchange`,

              teach:
                skill?.name ||
                'Skill',

              learn:
                'Skill Exchange',

              date:
                request.updatedAt
                  ? new Date(
                      request.updatedAt
                    ).toLocaleDateString(
                      'en-US',
                      {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric'
                      }
                    )
                  : '--',

              status:
                request.status === 'Accepted'
                  ? 'progress'
                  : request.status === 'Completed'
                  ? 'completed'
                  : 'cancelled',

              originalStatus:
                request.status,

              partnerId:
                sender?._id

            }

          })


      // =================================
      // SENT EXCHANGES
      // =================================

      const sentExchanges =
        (sentData.requests || [])
          .filter(
            (request) =>
              [
                'Accepted',
                'Completed',
                'Cancelled'
              ].includes(request.status)
          )
          .map((request) => {

            const skill =
              request.skill

            const receiver =
              request.receiver


            return {

              id:
                request._id,

              name:
                receiver?.name ||
                'User',

              avatar:
                receiver?.name
                  ?.charAt(0)
                  ?.toUpperCase() ||
                '?',

              skills:
                `Skill Exchange ↔ ${skill?.name || 'Skill'}`,

              teach:
                'Skill Exchange',

              learn:
                skill?.name ||
                'Skill',

              date:
                request.updatedAt
                  ? new Date(
                      request.updatedAt
                    ).toLocaleDateString(
                      'en-US',
                      {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric'
                      }
                    )
                  : '--',

              status:
                request.status === 'Accepted'
                  ? 'progress'
                  : request.status === 'Completed'
                  ? 'completed'
                  : 'cancelled',

              originalStatus:
                request.status,

              partnerId:
                receiver?._id

            }

          })


      // =================================
      // COMBINE
      // =================================

      const allExchanges = [
        ...receivedExchanges,
        ...sentExchanges
      ]


      setExchanges(
        allExchanges
      )


    } catch (error) {

      console.error(
        'Fetch exchanges error:',
        error
      )


      Swal.fire({

        icon: 'error',

        title: 'Error',

        text:
          'Failed to fetch exchanges.'

      })


    } finally {

      setLoading(false)

    }

  }


  // =========================================
  // INITIAL LOAD
  // =========================================

  useEffect(() => {

    fetchExchanges()

  }, [navigate])


  // =========================================
  // COMPLETE EXCHANGE
  // =========================================

  const handleCompleteExchange = async (
    exchange
  ) => {

    const result =
      await Swal.fire({

        icon: 'question',

        title:
          'Complete Exchange?',

        text:
          `Are you sure you want to mark your exchange with ${exchange.name} as completed?`,

        showCancelButton: true,

        confirmButtonText:
          'Yes, Complete',

        cancelButtonText:
          'Cancel'

      })


    if (!result.isConfirmed) {

      return

    }


    const token =
      localStorage.getItem('token')


    try {

      const response =
        await fetch(
          `http://localhost:5000/api/exchange-requests/${exchange.id}/complete`,
          {
            method: 'PUT',

            headers: {
              'Authorization':
                `Bearer ${token}`,

              'Content-Type':
                'application/json'
            }
          }
        )


      const data =
        await response.json()


      if (response.status === 401) {

        localStorage.removeItem('token')
        localStorage.removeItem('user')

        navigate('/login')

        return

      }


      if (!response.ok) {

        throw new Error(
          data.message ||
          'Failed to complete exchange'
        )

      }


      await Swal.fire({

        icon: 'success',

        title:
          'Exchange Completed',

        text:
          'Your exchange has been marked as completed.',

        confirmButtonText:
          'Done'

      })


      fetchExchanges()


    } catch (error) {

      console.error(
        'Complete exchange error:',
        error
      )


      Swal.fire({

        icon: 'error',

        title:
          'Failed',

        text:
          error.message ||
          'Could not complete exchange.'

      })

    }

  }


  // =========================================
  // CANCEL EXCHANGE
  // =========================================

  const handleCancelExchange = async (
    exchange
  ) => {

    const result =
      await Swal.fire({

        icon: 'warning',

        title:
          'Cancel Exchange?',

        text:
          `Are you sure you want to cancel your exchange with ${exchange.name}?`,

        showCancelButton: true,

        confirmButtonText:
          'Yes, Cancel',

        cancelButtonText:
          'Keep Exchange',

        confirmButtonColor:
          '#d33'

      })


    if (!result.isConfirmed) {

      return

    }


    const token =
      localStorage.getItem('token')


    try {

      const response =
        await fetch(
          `http://localhost:5000/api/exchange-requests/${exchange.id}/cancel`,
          {
            method: 'PUT',

            headers: {
              'Authorization':
                `Bearer ${token}`,

              'Content-Type':
                'application/json'
            }
          }
        )


      const data =
        await response.json()


      if (response.status === 401) {

        localStorage.removeItem('token')
        localStorage.removeItem('user')

        navigate('/login')

        return

      }


      if (!response.ok) {

        throw new Error(
          data.message ||
          'Failed to cancel exchange'
        )

      }


      await Swal.fire({

        icon: 'success',

        title:
          'Exchange Cancelled',

        text:
          'Your exchange has been cancelled.',

        confirmButtonText:
          'Done'

      })


      fetchExchanges()


    } catch (error) {

      console.error(
        'Cancel exchange error:',
        error
      )


      Swal.fire({

        icon: 'error',

        title:
          'Failed',

        text:
          error.message ||
          'Could not cancel exchange.'

      })

    }

  }


  // =========================================
  // FILTER
  // =========================================

  const filteredExchanges =
    activeFilter === 'all'
      ? exchanges
      : exchanges.filter(
          (exchange) =>
            exchange.status === activeFilter
        )


  // =========================================
  // STATS
  // =========================================

  const totalExchanges =
    exchanges.length


  const inProgress =
    exchanges.filter(
      (exchange) =>
        exchange.status === 'progress'
    ).length


  const completed =
    exchanges.filter(
      (exchange) =>
        exchange.status === 'completed'
    ).length


  const cancelled =
    exchanges.filter(
      (exchange) =>
        exchange.status === 'cancelled'
    ).length


  // =========================================
  // VIEW DETAILS
  // =========================================

  const handleViewDetails = (
    exchange
  ) => {

    let statusText =
      'In Progress'


    if (
      exchange.status ===
      'completed'
    ) {

      statusText =
        'Completed'

    }


    if (
      exchange.status ===
      'cancelled'
    ) {

      statusText =
        'Cancelled'

    }


    Swal.fire({

      icon: 'info',

      title:
        `Exchange with ${exchange.name}`,

      html: `
        <div style="text-align:left">
          <p>
            <strong>You teach:</strong>
            ${exchange.teach}
          </p>

          <p>
            <strong>You learn:</strong>
            ${exchange.learn}
          </p>

          <p>
            <strong>Date:</strong>
            ${exchange.date}
          </p>

          <p>
            <strong>Status:</strong>
            ${statusText}
          </p>
        </div>
      `,

      confirmButtonText:
        'Close'

    })

  }


  // =========================================
  // MESSAGE PARTNER
  // =========================================

  const handleMessage = (
    exchange
  ) => {

    navigate(
      `/dashboard/messages?user=${exchange.partnerId}`
    )

  }


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="exchanges-page">

        <div className="container">

          <div className="exchange-empty">

            <div>
              <FiRefreshCw />
            </div>

            <h3>
              Loading exchanges...
            </h3>

            <p>
              Please wait while we fetch your exchanges.
            </p>

          </div>

        </div>

      </div>

    )

  }


  // =========================================
  // UI
  // =========================================

  return (

    <div className="exchanges-page">

      <div className="container">


        {/* =========================
            HEADER
        ========================== */}

        <div className="exchanges-header">

          <span>
            SKILL EXCHANGE
          </span>

          <h1>
            My Exchanges
          </h1>

          <p>
            Track and manage your ongoing skill exchanges.
          </p>

        </div>


        {/* =========================
            STATS
        ========================== */}

        <div className="exchange-stats">


          {/* Total */}

          <div className="exchange-stat">

            <div className="exchange-stat-icon">
              <FiRefreshCw />
            </div>

            <div>

              <strong>
                {totalExchanges}
              </strong>

              <span>
                Total Exchanges
              </span>

            </div>

          </div>


          {/* In Progress */}

          <div className="exchange-stat">

            <div className="exchange-stat-icon">
              <FiClock />
            </div>

            <div>

              <strong>
                {inProgress}
              </strong>

              <span>
                In Progress
              </span>

            </div>

          </div>


          {/* Completed */}

          <div className="exchange-stat">

            <div className="exchange-stat-icon">
              <FiCheckCircle />
            </div>

            <div>

              <strong>
                {completed}
              </strong>

              <span>
                Completed
              </span>

            </div>

          </div>


          {/* Cancelled */}

          <div className="exchange-stat">

            <div className="exchange-stat-icon">
              <FiXCircle />
            </div>

            <div>

              <strong>
                {cancelled}
              </strong>

              <span>
                Cancelled
              </span>

            </div>

          </div>

        </div>


        {/* =========================
            FILTER TABS
        ========================== */}

        <div className="exchange-filters">


          <button
            className={
              activeFilter === 'all'
                ? 'active'
                : ''
            }

            onClick={() =>
              setActiveFilter('all')
            }
          >
            All
          </button>


          <button
            className={
              activeFilter === 'progress'
                ? 'active'
                : ''
            }

            onClick={() =>
              setActiveFilter('progress')
            }
          >
            In Progress
          </button>


          <button
            className={
              activeFilter === 'completed'
                ? 'active'
                : ''
            }

            onClick={() =>
              setActiveFilter('completed')
            }
          >
            Completed
          </button>


          <button
            className={
              activeFilter === 'cancelled'
                ? 'active'
                : ''
            }

            onClick={() =>
              setActiveFilter('cancelled')
            }
          >
            Cancelled
          </button>

        </div>


        {/* =========================
            EXCHANGE LIST
        ========================== */}

        {filteredExchanges.length > 0 ? (

          <div className="exchange-list">

            {filteredExchanges.map(
              (exchange) => (

                <div
                  className="exchange-card"
                  key={exchange.id}
                >


                  {/* PERSON */}

                  <div className="exchange-person">

                    <div className="exchange-avatar">

                      {exchange.avatar}

                    </div>

                    <div>

                      <h2>
                        {exchange.name}
                      </h2>

                      <p>
                        {exchange.skills}
                      </p>

                    </div>

                  </div>


                  {/* STATUS */}

                  <div
                    className={`exchange-status ${
                      exchange.status
                    }`}
                  >

                    {exchange.status ===
                      'progress' && (
                      <>
                        <FiClock />
                        In Progress
                      </>
                    )}


                    {exchange.status ===
                      'completed' && (
                      <>
                        <FiCheckCircle />
                        Completed
                      </>
                    )}


                    {exchange.status ===
                      'cancelled' && (
                      <>
                        <FiXCircle />
                        Cancelled
                      </>
                    )}

                  </div>


                  {/* DETAILS */}

                  <div className="exchange-details">


                    <div>

                      <span>
                        You teach
                      </span>

                      <strong>
                        {exchange.teach}
                      </strong>

                    </div>


                    <FiArrowRight
                      className="exchange-detail-arrow"
                    />


                    <div>

                      <span>
                        You learn
                      </span>

                      <strong>
                        {exchange.learn}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Date
                      </span>

                      <strong>
                        {exchange.date}
                      </strong>

                    </div>

                  </div>


                  {/* ACTIONS */}

                  <div className="exchange-actions">


                    {/* MESSAGE */}

                    <button
                      className="exchange-message"
                      onClick={() =>
                        handleMessage(
                          exchange
                        )
                      }
                    >

                      <FiMessageCircle />

                      Message

                    </button>


                    {/* COMPLETE */}

                    {exchange.status ===
                      'progress' && (

                      <button
                        className="exchange-view"
                        onClick={() =>
                          handleCompleteExchange(
                            exchange
                          )
                        }
                      >

                        <FiCheckCircle />

                        Complete

                      </button>

                    )}


                    {/* CANCEL */}

                    {exchange.status ===
                      'progress' && (

                      <button
                        className="exchange-view"
                        onClick={() =>
                          handleCancelExchange(
                            exchange
                          )
                        }
                      >

                        <FiXCircle />

                        Cancel

                      </button>

                    )}


                    {/* VIEW DETAILS */}

                    <button
                      className="exchange-view"
                      onClick={() =>
                        handleViewDetails(
                          exchange
                        )
                      }
                    >

                      View Details

                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="exchange-empty">

            <div>
              <FiRefreshCw />
            </div>

            <h3>
              No exchanges found
            </h3>

            <p>
              There are no exchanges in this category.
            </p>

          </div>

        )}

      </div>

    </div>

  )

}


export default Exchanges