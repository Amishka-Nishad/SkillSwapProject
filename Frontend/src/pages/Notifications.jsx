import React, { useEffect, useState } from 'react'

import {
  FiBell,
  FiCheck,
  FiMessageCircle,
  FiUserPlus,
  FiStar,
  FiCheckCircle
} from 'react-icons/fi'

import { useNavigate } from 'react-router-dom'

import Swal from 'sweetalert2'


const Notifications = () => {

  const navigate = useNavigate()

  const [activeFilter, setActiveFilter] = useState('All')

  const [notifications, setNotifications] = useState([])

  const [loading, setLoading] = useState(true)


  const token = localStorage.getItem('token')


  /* =========================
      FETCH NOTIFICATIONS
  ========================= */

  useEffect(() => {

    const fetchNotifications = async () => {

      if (!token) {

        navigate('/login')

        return

      }

      try {

        setLoading(true)

        const response = await fetch(
          'http://localhost:5000/api/notifications',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )


        if (response.status === 401) {

          localStorage.removeItem('token')

          navigate('/login')

          return

        }


        const data = await response.json()


        if (!response.ok) {

          throw new Error(
            data.message ||
            'Unable to fetch notifications'
          )

        }


        setNotifications(
          data.notifications || []
        )


      } catch (error) {

        console.error(
          'Fetch notifications error:',
          error
        )

        Swal.fire(
          'Error',
          'Unable to load notifications.',
          'error'
        )

      } finally {

        setLoading(false)

      }

    }


    fetchNotifications()

  }, [navigate, token])


  /* =========================
      FILTER
  ========================= */

  const filteredNotifications =
    notifications.filter((notification) => {

      if (activeFilter === 'All') {
        return true
      }


      if (activeFilter === 'Requests') {

        return (
          notification.type ===
            'Exchange Request' ||

          notification.type ===
            'Request Accepted' ||

          notification.type ===
            'Request Rejected'
        )

      }


      if (activeFilter === 'Messages') {

        return (
          notification.type ===
          'New Message'
        )

      }


      return true

    })


  /* =========================
      ICON
  ========================= */

  const getIcon = (type) => {

    if (
      type === 'Exchange Request'
    ) {

      return <FiUserPlus />

    }


    if (
      type === 'New Message'
    ) {

      return <FiMessageCircle />

    }


    if (
      type === 'Request Accepted'
    ) {

      return <FiCheck />

    }


    if (
      type === 'Request Rejected'
    ) {

      return <FiCheck />

    }


    if (
      type === 'New Rating Received'
    ) {

      return <FiStar />

    }


    return <FiBell />

  }


  /* =========================
      ICON CLASS
  ========================= */

  const getIconClass = (type) => {

    if (
      type === 'Exchange Request'
    ) {

      return 'request-icon'

    }


    if (
      type === 'New Message'
    ) {

      return 'message-icon'

    }


    if (
      type === 'New Rating Received'
    ) {

      return 'rating-icon'

    }


    return 'accepted-icon'

  }


  /* =========================
      TIME
  ========================= */

  const getTime = (date) => {

    if (!date) {
      return ''
    }


    const createdDate =
      new Date(date)

    const now =
      new Date()


    const difference =
      now - createdDate


    const minutes =
      Math.floor(
        difference / 60000
      )


    if (minutes < 1) {
      return 'Just now'
    }


    if (minutes < 60) {
      return `${minutes} minute${
        minutes > 1 ? 's' : ''
      } ago`
    }


    const hours =
      Math.floor(minutes / 60)


    if (hours < 24) {
      return `${hours} hour${
        hours > 1 ? 's' : ''
      } ago`
    }


    const days =
      Math.floor(hours / 24)


    if (days === 1) {
      return 'Yesterday'
    }


    if (days < 7) {
      return `${days} days ago`
    }


    return createdDate.toLocaleDateString()

  }


  /* =========================
      MARK ONE AS READ
  ========================= */

  const markAsRead = async (id) => {

    try {

      const response = await fetch(

        `http://localhost:5000/api/notifications/${id}/read`,

        {

          method: 'PUT',

          headers: {
            Authorization:
              `Bearer ${token}`
          }

        }

      )


      if (!response.ok) {

        throw new Error(
          'Unable to mark notification as read'
        )

      }


      setNotifications(prev =>

        prev.map(notification =>

          notification._id === id

            ? {
                ...notification,
                isRead: true
              }

            : notification

        )

      )

    } catch (error) {

      console.error(
        'Mark notification error:',
        error
      )

    }

  }


  /* =========================
      MARK ALL AS READ
  ========================= */

  const markAllAsRead = async () => {

    try {

      const response = await fetch(

        'http://localhost:5000/api/notifications/read-all',

        {

          method: 'PUT',

          headers: {
            Authorization:
              `Bearer ${token}`
          }

        }

      )


      if (!response.ok) {

        throw new Error(
          'Unable to mark notifications as read'
        )

      }


      setNotifications(prev =>

        prev.map(notification => ({

          ...notification,

          isRead: true

        }))

      )


      Swal.fire({
        icon: 'success',
        title: 'Done!',
        text: 'All notifications marked as read.',
        timer: 1500,
        showConfirmButton: false
      })


    } catch (error) {

      console.error(
        'Mark all notifications error:',
        error
      )

      Swal.fire(
        'Error',
        'Unable to mark notifications as read.',
        'error'
      )

    }

  }


  /* =========================
      ACTION
  ========================= */

  const handleNotificationAction =
    async (notification) => {

      if (!notification.isRead) {

        await markAsRead(
          notification._id
        )

      }


      if (
        notification.type ===
        'New Message'
      ) {

        navigate('/dashboard/messages')

        return

      }


      if (
        notification.type ===
        'Exchange Request'
      ) {

        navigate(
          '/dashboard/exchange-requests'
        )

      }

    }


  /* =========================
      COUNTS
  ========================= */

  const unreadCount =
    notifications.filter(
      notification =>
        !notification.isRead
    ).length


  const allCount =
    notifications.length


  const requestCount =
    notifications.filter(
      notification =>
        notification.type ===
          'Exchange Request' ||

        notification.type ===
          'Request Accepted' ||

        notification.type ===
          'Request Rejected'
    ).length


  const messageCount =
    notifications.filter(
      notification =>
        notification.type ===
        'New Message'
    ).length


  return (

    <div className="notifications-page">

      <div className="container">


        {/* =========================
            HEADER
        ========================= */}

        <div className="notifications-header">

          <div>

            <span>
              ACTIVITY
            </span>

            <h1>
              Notifications
            </h1>

            <p>
              Stay updated with your SkillSwap activity.
            </p>

          </div>


          <button
            type="button"
            className="mark-all-btn"
            onClick={markAllAsRead}
            disabled={
              unreadCount === 0
            }
          >

            <FiCheckCircle />

            Mark all as read

          </button>

        </div>


        {/* =========================
            SUMMARY
        ========================= */}

        <div className="notification-summary">


          {/* ALL */}

          <button
            type="button"
            className={`summary-item ${
              activeFilter === 'All'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setActiveFilter('All')
            }
          >

            <FiBell />

            <span>
              All
            </span>

            <strong>
              {allCount}
            </strong>

          </button>


          {/* REQUESTS */}

          <button
            type="button"
            className={`summary-item ${
              activeFilter === 'Requests'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setActiveFilter('Requests')
            }
          >

            <FiUserPlus />

            <span>
              Requests
            </span>

            <strong>
              {requestCount}
            </strong>

          </button>


          {/* MESSAGES */}

          <button
            type="button"
            className={`summary-item ${
              activeFilter === 'Messages'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setActiveFilter('Messages')
            }
          >

            <FiMessageCircle />

            <span>
              Messages
            </span>

            <strong>
              {messageCount}
            </strong>

          </button>

        </div>


        {/* =========================
            NOTIFICATIONS
        ========================= */}

        <div className="notification-section">

          <div className="notification-section-title">

            {activeFilter === 'All'
              ? 'All Notifications'
              : activeFilter}

          </div>


          {loading ? (

            <div className="no-notifications">

              <FiBell />

              <h3>
                Loading notifications...
              </h3>

            </div>

          ) : filteredNotifications.length > 0 ? (

            filteredNotifications.map(
              (notification) => (

                <div
                  key={notification._id}
                  className={`notification-card ${
                    !notification.isRead
                      ? 'unread'
                      : ''
                  }`}
                >


                  {/* ICON */}

                  <div
                    className={`notification-icon ${
                      getIconClass(
                        notification.type
                      )
                    }`}
                  >

                    {getIcon(
                      notification.type
                    )}

                  </div>


                  {/* CONTENT */}

                  <div className="notification-content">

                    <h3>
                      {notification.title}
                    </h3>

                    <p>
                      {notification.message}
                    </p>

                    <span>
                      {getTime(
                        notification.createdAt
                      )}
                    </span>

                  </div>


                  {/* ACTION */}

                  {!notification.isRead && (

                    <button
                      type="button"
                      className="notification-action"
                      onClick={() =>
                        handleNotificationAction(
                          notification
                        )
                      }
                    >

                      View

                    </button>

                  )}

                </div>

              )
            )

          ) : (

            <div className="no-notifications">

              <FiBell />

              <h3>
                No notifications
              </h3>

              <p>
                You're all caught up!
              </p>

            </div>

          )}

        </div>


        {/* =========================
            FOOTER
        ========================= */}

        <div className="notification-footer">

          <FiBell />

          <span>

            {unreadCount > 0

              ? `${unreadCount} unread notification${
                  unreadCount > 1
                    ? 's'
                    : ''
                }`

              : "You're all caught up!"}

          </span>

        </div>


      </div>

    </div>

  )

}


export default Notifications