import Message from '../models/Message.js'
import ExchangeRequest from '../models/ExchangeRequest.js'

const checkAllowedExchange = async (currentUserId, partnerId) => {
  const exchange = await ExchangeRequest.findOne({
    status: { $in: ['Accepted', 'Completed'] },
    $or: [
      {
        sender: currentUserId,
        receiver: partnerId
      },
      {
        sender: partnerId,
        receiver: currentUserId
      }
    ]
  })

  return exchange
}

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id
    const { receiverId, text } = req.body

    if (!receiverId || !text?.trim()) {
      return res.status(400).json({
        message: 'Receiver and message are required'
      })
    }

    const exchange = await checkAllowedExchange(
      senderId,
      receiverId
    )

    if (!exchange) {
      return res.status(403).json({
        message: 'You can only message an accepted or completed exchange partner'
      })
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      text: text.trim()
    })

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email')
      .populate('receiver', 'name email')

    res.status(201).json({
      message: 'Message sent successfully',
      data: populatedMessage
    })
  } catch (error) {
    console.error('Send message error:', error)

    res.status(500).json({
      message: 'Failed to send message'
    })
  }
}

export const getConversation = async (req, res) => {
  try {
    const currentUserId = req.user.id
    const { userId } = req.params

    const exchange = await checkAllowedExchange(
      currentUserId,
      userId
    )

    if (!exchange) {
      return res.status(403).json({
        message:
          'You can only view conversations with an accepted or completed exchange partner'
      })
    }

    const messages = await Message.find({
      $or: [
        {
          sender: currentUserId,
          receiver: userId
        },
        {
          sender: userId,
          receiver: currentUserId
        }
      ]
    })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: 1 })

    res.status(200).json(messages)
  } catch (error) {
    console.error('Get conversation error:', error)

    res.status(500).json({
      message: 'Failed to fetch conversation'
    })
  }
}

export const getMyMessages = async (req, res) => {
  try {
    const userId = req.user.id

    const messages = await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: -1 })

    res.status(200).json(messages)
  } catch (error) {
    console.error('Get messages error:', error)

    res.status(500).json({
      message: 'Failed to fetch messages'
    })
  }
}