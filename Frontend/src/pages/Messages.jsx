import React, { useEffect, useState } from 'react'

import {
  FiSearch,
  FiMoreVertical,
  FiPaperclip,
  FiSmile,
  FiSend,
  FiArrowLeft
} from 'react-icons/fi'

import { useNavigate } from 'react-router-dom'

import Swal from 'sweetalert2'


const Messages = () => {

  const navigate = useNavigate()

  const [selectedChat, setSelectedChat] = useState(null)

  const [search, setSearch] = useState('')

  const [messageText, setMessageText] = useState('')

  const [chats, setChats] = useState([])

  const [messages, setMessages] = useState([])

  const [loadingChats, setLoadingChats] = useState(true)

  const [loadingMessages, setLoadingMessages] = useState(false)

  const [sending, setSending] = useState(false)


  /* =========================
      GET CURRENT USER
  ========================= */

  const getCurrentUser = () => {

    try {

      const user = JSON.parse(
        localStorage.getItem('user')
      )

      return user

    } catch (error) {

      return null

    }

  }


  /* =========================
      GET TOKEN
  ========================= */

  const token = localStorage.getItem('token')


  /* =========================
      FETCH ACCEPTED / COMPLETED CHATS
  ========================= */

  useEffect(() => {

    const fetchChats = async () => {

      if (!token) {

        navigate('/login')

        return

      }

      try {

        setLoadingChats(true)


        const [receivedResponse, sentResponse] =
          await Promise.all([

            fetch(
              'http://localhost:5000/api/exchange-requests/received',
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            ),

            fetch(
              'http://localhost:5000/api/exchange-requests/sent',
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            )

          ])


        if (
          receivedResponse.status === 401 ||
          sentResponse.status === 401
        ) {

          localStorage.removeItem('token')

          localStorage.removeItem('user')

          navigate('/login')

          return

        }


        const receivedData =
          await receivedResponse.json()

        const sentData =
          await sentResponse.json()


        const receivedRequests =
          receivedData.requests || []

        const sentRequests =
          sentData.requests || []


        const chatMap = new Map()


        /* =========================
            RECEIVED ACCEPTED /
            COMPLETED REQUESTS
        ========================= */

        receivedRequests
          .filter(
            request =>
              request.status === 'Accepted' ||
              request.status === 'Completed'
          )
          .forEach(request => {

            if (!request.sender) {
              return
            }


            const user = request.sender


            chatMap.set(
              user._id,

              {
                id: user._id,

                name:
                  user.name || 'User',

                avatar:
                  user.name
                    ? user.name
                        .charAt(0)
                        .toUpperCase()
                    : 'U',

                message:
                  request.status === 'Completed'
                    ? `Completed exchange with ${user.name || 'User'}`
                    : `Skill exchange with ${user.name || 'User'}`,

                time: 'Now',

                status:
                  request.status === 'Completed'
                    ? 'Exchange Completed'
                    : 'Online',

                skill:
                  request.skill?.name ||
                  'Skill Exchange'

              }

            )

          })


        /* =========================
            SENT ACCEPTED /
            COMPLETED REQUESTS
        ========================= */

        sentRequests
          .filter(
            request =>
              request.status === 'Accepted' ||
              request.status === 'Completed'
          )
          .forEach(request => {

            if (!request.receiver) {
              return
            }


            const user = request.receiver


            chatMap.set(
              user._id,

              {

                id: user._id,

                name:
                  user.name || 'User',

                avatar:
                  user.name
                    ? user.name
                        .charAt(0)
                        .toUpperCase()
                    : 'U',

                message:
                  request.status === 'Completed'
                    ? `Completed exchange with ${user.name || 'User'}`
                    : `Skill exchange with ${user.name || 'User'}`,

                time: 'Now',

                status:
                  request.status === 'Completed'
                    ? 'Exchange Completed'
                    : 'Online',

                skill:
                  request.skill?.name ||
                  'Skill Exchange'

              }

            )

          })


        const chatArray =
          Array.from(chatMap.values())


        setChats(chatArray)


        if (chatArray.length > 0) {

          setSelectedChat(
            chatArray[0].id
          )

        } else {

          setSelectedChat(null)

        }


      } catch (error) {

        console.error(
          'Fetch chats error:',
          error
        )

        Swal.fire(
          'Error',
          'Unable to load chats.',
          'error'
        )

      } finally {

        setLoadingChats(false)

      }

    }


    fetchChats()

  }, [navigate, token])


  /* =========================
      FETCH CONVERSATION
  ========================= */

  useEffect(() => {

    const fetchConversation = async () => {

      if (!selectedChat || !token) {
        return
      }


      try {

        setLoadingMessages(true)


        const response = await fetch(

          `http://localhost:5000/api/messages/conversation/${selectedChat}`,

          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }

        )


        if (response.status === 401) {

          localStorage.removeItem('token')

          localStorage.removeItem('user')

          navigate('/login')

          return

        }


        const data =
          await response.json()


        if (!response.ok) {

          throw new Error(
            data.message ||
            'Unable to load conversation'
          )

        }


        /*
          Backend directly returns an array
        */

        setMessages(
          Array.isArray(data)
            ? data
            : data.messages || []
        )


      } catch (error) {

        console.error(
          'Fetch conversation error:',
          error
        )

        setMessages([])

      } finally {

        setLoadingMessages(false)

      }

    }


    fetchConversation()

  }, [selectedChat, navigate, token])


  /* =========================
      FILTER CHATS
  ========================= */

  const filteredChats =
    chats.filter(chat =>

      chat.name
        .toLowerCase()
        .includes(
          search
            .toLowerCase()
            .trim()
        )

    )


  /* =========================
      ACTIVE CHAT
  ========================= */

  const activeChat =
    chats.find(
      chat => chat.id === selectedChat
    ) || chats[0]


  /* =========================
      SEND MESSAGE
  ========================= */

  const handleSendMessage = async () => {

    const trimmedMessage =
      messageText.trim()


    if (!trimmedMessage) {
      return
    }


    if (!activeChat) {

      Swal.fire(
        'No Chat Selected',
        'Please select a chat first.',
        'warning'
      )

      return

    }


    try {

      setSending(true)


      const response = await fetch(

        'http://localhost:5000/api/messages',

        {

          method: 'POST',

          headers: {

            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`

          },

          body: JSON.stringify({

            receiverId:
              activeChat.id,

            text:
              trimmedMessage

          })

        }

      )


      if (response.status === 401) {

        localStorage.removeItem('token')

        localStorage.removeItem('user')

        navigate('/login')

        return

      }


      const data =
        await response.json()


      if (!response.ok) {

        throw new Error(
          data.message ||
          'Message could not be sent'
        )

      }


      /* =========================
          ADD NEW MESSAGE
      ========================= */

      if (data.data) {

        setMessages(prev => [

          ...prev,

          data.data

        ])

      }


      setMessageText('')


    } catch (error) {

      console.error(
        'Send message error:',
        error
      )

      Swal.fire(
        'Error',
        error.message ||
        'Message could not be sent.',
        'error'
      )

    } finally {

      setSending(false)

    }

  }


  /* =========================
      ENTER KEY
  ========================= */

  const handleKeyDown = (e) => {

    if (
      e.key === 'Enter' &&
      !e.shiftKey
    ) {

      e.preventDefault()

      handleSendMessage()

    }

  }


  /* =========================
      FORMAT TIME
  ========================= */

  const formatTime = (date) => {

    if (!date) {
      return ''
    }


    return new Date(date)
      .toLocaleTimeString([], {

        hour: '2-digit',

        minute: '2-digit'

      })

  }


  /* =========================
      MESSAGE TYPE
  ========================= */

  const getMessageType = (message) => {

    const currentUser =
      getCurrentUser()


    if (
      currentUser &&
      (
        message.sender?._id === currentUser.id ||
        message.sender?._id === currentUser._id
      )
    ) {

      return 'sent'

    }


    return 'received'

  }


  /* =========================
      NO CHAT
  ========================= */

  if (
    !loadingChats &&
    chats.length === 0
  ) {

    return (

      <div className="messages-page">

        <div className="messages-container">

          <div className="chat-list-panel">

            <div className="chat-list-header">

              <span className="messages-label">
                MESSAGES
              </span>

              <h1>
                Your Chats
              </h1>

            </div>


            <div className="no-chat-found">

              <FiSearch />

              <p>
                No accepted or completed skill exchanges yet.
              </p>

            </div>

          </div>


          <div className="conversation-panel">

            <div className="conversation-header">

              <div className="conversation-user">

                <div className="conversation-avatar">
                  ?
                </div>

                <div>

                  <h2>
                    No Conversation
                  </h2>

                  <span>
                    Accept a skill exchange request to start chatting.
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    )

  }


  return (

    <div className="messages-page">

      <div className="messages-container">


        {/* =========================
            CHAT LIST
        ========================== */}

        <div
          className={`chat-list-panel ${
            selectedChat
              ? 'mobile-chat-hidden'
              : ''
          }`}
        >

          <div className="chat-list-header">

            <span className="messages-label">
              MESSAGES
            </span>

            <h1>
              Your Chats
            </h1>

          </div>


          {/* Search */}

          <div className="messages-search">

            <FiSearch />

            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          {/* Chat List */}

          <div className="chat-list">

            {loadingChats ? (

              <div className="no-chat-found">

                <p>
                  Loading chats...
                </p>

              </div>

            ) : filteredChats.length > 0 ? (

              filteredChats.map(chat => (

                <button
                  key={chat.id}
                  className={`chat-item ${
                    activeChat?.id === chat.id
                      ? 'chat-item-active'
                      : ''
                  }`}
                  onClick={() =>
                    setSelectedChat(chat.id)
                  }
                >

                  <div className="chat-avatar">
                    {chat.avatar}
                  </div>


                  <div className="chat-info">

                    <div className="chat-name-row">

                      <h3>
                        {chat.name}
                      </h3>

                      <span>
                        {chat.time}
                      </span>

                    </div>

                    <p>
                      {chat.message}
                    </p>

                  </div>

                </button>

              ))

            ) : (

              <div className="no-chat-found">

                <FiSearch />

                <p>
                  No conversations found
                </p>

              </div>

            )}

          </div>

        </div>


        {/* =========================
            CONVERSATION
        ========================== */}

        {activeChat && (

          <div
            className={`conversation-panel ${
              selectedChat
                ? 'mobile-chat-visible'
                : ''
            }`}
          >


            {/* Conversation Header */}

            <div className="conversation-header">

              <button
                className="back-chat-btn"
                onClick={() =>
                  setSelectedChat(null)
                }
              >
                <FiArrowLeft />
              </button>


              <div className="conversation-user">

                <div className="conversation-avatar">

                  {activeChat.avatar}

                </div>


                <div>

                  <h2>
                    {activeChat.name}
                  </h2>


                  <span className="online-status">

                    {activeChat.status}

                  </span>

                </div>

              </div>


              <button className="conversation-menu">

                <FiMoreVertical />

              </button>

            </div>


            {/* Exchange Info */}

            <div className="exchange-info">

              <span>
                Skill Exchange
              </span>

              <strong>
                You teach your skill
              </strong>

              <span className="exchange-arrow">
                ↔
              </span>

              <strong>
                {activeChat.name} teaches {activeChat.skill}
              </strong>

            </div>


            {/* Messages */}

            <div className="conversation-messages">

              <div className="today-label">
                Today
              </div>


              {loadingMessages ? (

                <div className="no-chat-found">

                  <p>
                    Loading messages...
                  </p>

                </div>

              ) : messages.length > 0 ? (

                messages.map(message => (

                  <div
                    className={`message ${
                      getMessageType(message)
                    }`}
                    key={message._id}
                  >

                    <p>
                      {message.text}
                    </p>

                    <span>
                      {formatTime(
                        message.createdAt
                      )}
                    </span>

                  </div>

                ))

              ) : (

                <div className="no-chat-found">

                  <p>
                    No messages yet. Start the conversation!
                  </p>

                </div>

              )}

            </div>


            {/* Message Input */}

            <div className="message-input-area">


              <button className="attachment-btn">

                <FiPaperclip />

              </button>


              <div className="message-input">

                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) =>
                    setMessageText(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  disabled={sending}
                />


                <button className="emoji-btn">

                  <FiSmile />

                </button>

              </div>


              <button
                className="send-message-btn"
                onClick={handleSendMessage}
                disabled={sending}
              >

                <FiSend />

              </button>

            </div>


          </div>

        )}

      </div>

    </div>

  )

}


export default Messages