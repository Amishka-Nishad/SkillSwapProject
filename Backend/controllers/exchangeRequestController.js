import ExchangeRequest from '../models/ExchangeRequest.js'
import Skill from '../models/Skill.js'
import User from '../models/User.js'
import Notification from '../models/Notification.js'


/* =========================
    CREATE NOTIFICATION
    WITH USER PREFERENCE CHECK
========================= */

const createNotification = async ({
  userId,
  type,
  title,
  message,
  relatedUser = null,
  relatedRequest = null
}) => {

  try {

    const user = await User.findById(userId)

    if (!user) {
      return
    }


    /* =========================
        CHECK NOTIFICATION TYPE
    ========================= */

    let isAllowed = true


    if (
      type === 'Exchange Request' ||
      type === 'Request Accepted' ||
      type === 'Request Rejected'
    ) {

      isAllowed =
        user.notificationPreferences
          ?.exchangeRequests !== false

    }


    if (type === 'New Message') {

      isAllowed =
        user.notificationPreferences
          ?.messages !== false

    }


    /* =========================
        IF NOTIFICATION IS OFF
    ========================= */

    if (!isAllowed) {

      console.log(
        `Notification skipped for ${user.email}`
      )

      return

    }


    /* =========================
        CREATE NOTIFICATION
    ========================= */

    await Notification.create({

      user: userId,

      type,

      title,

      message,

      relatedUser,

      relatedRequest

    })

  } catch (error) {

    console.error(
      'Create notification error:',
      error
    )

  }

}


/* =========================
    SEND EXCHANGE REQUEST
========================= */

export const sendExchangeRequest = async (req, res) => {

  try {

    const senderId = req.user.id

    const { skillId } = req.body


    if (!skillId) {

      return res.status(400).json({
        message: 'Skill ID is required'
      })

    }


    const skill =
      await Skill.findById(skillId)


    if (!skill) {

      return res.status(404).json({
        message: 'Skill not found'
      })

    }


    /* =========================
        PREVENT OWN SKILL
    ========================= */

    if (
      skill.user.toString() ===
      senderId.toString()
    ) {

      return res.status(400).json({
        message:
          'You cannot send a request for your own skill'
      })

    }


    /* =========================
        CHECK DUPLICATE
    ========================= */

    const existingRequest =
      await ExchangeRequest.findOne({

        sender: senderId,

        receiver: skill.user,

        skill: skillId,

        status: {
          $in: [
            'Pending',
            'Accepted'
          ]
        }

      })


    if (existingRequest) {

      return res.status(400).json({
        message:
          'Exchange request already exists'
      })

    }


    /* =========================
        CREATE REQUEST
    ========================= */

    const request =
      await ExchangeRequest.create({

        sender: senderId,

        receiver: skill.user,

        skill: skillId,

        status: 'Pending'

      })


    /* =========================
        GET SENDER
    ========================= */

    const sender =
      await User.findById(senderId)


    /* =========================
        NOTIFICATION
    ========================= */

    await createNotification({

      userId: skill.user,

      type: 'Exchange Request',

      title: 'New Skill Exchange Request',

      message:
        `${sender?.name || 'Someone'} wants to learn ${skill.name} from you.`,

      relatedUser: senderId,

      relatedRequest: request._id

    })


    res.status(201).json({

      message:
        'Exchange request sent successfully',

      request

    })

  } catch (error) {

    console.error(
      'Send exchange request error:',
      error
    )

    res.status(500).json({

      message:
        'Failed to send exchange request'

    })

  }

}


/* =========================
    RECEIVED REQUESTS
========================= */

export const getReceivedRequests = async (req, res) => {

  try {

    const requests =
      await ExchangeRequest.find({

        receiver: req.user.id

      })

        .populate(
          'sender',
          'name email'
        )

        .populate(
          'skill',
          'name category type'
        )

        .sort({
          createdAt: -1
        })


    res.status(200).json({
      requests
    })

  } catch (error) {

    console.error(
      'Get received requests error:',
      error
    )

    res.status(500).json({

      message:
        'Failed to fetch received requests'

    })

  }

}


/* =========================
    SENT REQUESTS
========================= */

export const getSentRequests = async (req, res) => {

  try {

    const requests =
      await ExchangeRequest.find({

        sender: req.user.id

      })

        .populate(
          'receiver',
          'name email'
        )

        .populate(
          'skill',
          'name category type'
        )

        .sort({
          createdAt: -1
        })


    res.status(200).json({
      requests
    })

  } catch (error) {

    console.error(
      'Get sent requests error:',
      error
    )

    res.status(500).json({

      message:
        'Failed to fetch sent requests'

    })

  }

}


/* =========================
    ACCEPT / REJECT REQUEST
========================= */

export const updateRequestStatus = async (req, res) => {

  try {

    const userId = req.user.id

    const { status } = req.body


    if (
      !['Accepted', 'Rejected']
        .includes(status)
    ) {

      return res.status(400).json({

        message:
          'Status must be Accepted or Rejected'

      })

    }


    const request =
      await ExchangeRequest.findOne({

        _id: req.params.id,

        receiver: userId,

        status: 'Pending'

      })


    if (!request) {

      return res.status(404).json({

        message:
          'Pending exchange request not found'

      })

    }


    request.status = status

    await request.save()


    /* =========================
        GET RECEIVER
    ========================= */

    const receiver =
      await User.findById(userId)


    /* =========================
        NOTIFY SENDER
    ========================= */

    await createNotification({

      userId: request.sender,

      type:
        status === 'Accepted'
          ? 'Request Accepted'
          : 'Request Rejected',

      title:
        status === 'Accepted'
          ? 'Exchange Request Accepted'
          : 'Exchange Request Rejected',

      message:
        status === 'Accepted'
          ? `${receiver?.name || 'User'} accepted your skill exchange request.`
          : `${receiver?.name || 'User'} rejected your skill exchange request.`,

      relatedUser: userId,

      relatedRequest: request._id

    })


    const updatedRequest =
      await ExchangeRequest.findById(
        request._id
      )

        .populate(
          'sender',
          'name email'
        )

        .populate(
          'receiver',
          'name email'
        )

        .populate(
          'skill',
          'name category type'
        )


    res.status(200).json({

      message:
        `Exchange request ${status.toLowerCase()} successfully`,

      request: updatedRequest

    })

  } catch (error) {

    console.error(
      'Update request status error:',
      error
    )

    res.status(500).json({

      message:
        'Failed to update exchange request'

    })

  }

}


/* =========================
    COMPLETE EXCHANGE
========================= */

export const completeExchange = async (req, res) => {

  try {

    const userId = req.user.id


    const request =
      await ExchangeRequest.findOne({

        _id: req.params.id,

        status: 'Accepted',

        $or: [

          {
            sender: userId
          },

          {
            receiver: userId
          }

        ]

      })


    if (!request) {

      return res.status(404).json({

        message:
          'Accepted exchange not found'

      })

    }


    request.status = 'Completed'

    await request.save()


    const partnerId =
      request.sender.toString() ===
      userId.toString()
        ? request.receiver
        : request.sender


    const user =
      await User.findById(userId)


    await createNotification({

      userId: partnerId,

      type: 'New Message',

      title: 'Exchange Completed',

      message:
        `${user?.name || 'Your partner'} marked the exchange as completed.`,

      relatedUser: userId,

      relatedRequest: request._id

    })


    res.status(200).json({

      message:
        'Exchange completed successfully',

      request

    })

  } catch (error) {

    console.error(
      'Complete exchange error:',
      error
    )

    res.status(500).json({

      message:
        'Failed to complete exchange'

    })

  }

}


/* =========================
    CANCEL EXCHANGE
========================= */

export const cancelExchange = async (req, res) => {

  try {

    const userId = req.user.id


    const request =
      await ExchangeRequest.findOne({

        _id: req.params.id,

        status: 'Accepted',

        $or: [

          {
            sender: userId
          },

          {
            receiver: userId
          }

        ]

      })


    if (!request) {

      return res.status(404).json({

        message:
          'Accepted exchange not found'

      })

    }


    request.status = 'Cancelled'

    await request.save()


    const partnerId =
      request.sender.toString() ===
      userId.toString()
        ? request.receiver
        : request.sender


    const user =
      await User.findById(userId)


    await createNotification({

      userId: partnerId,

      type: 'New Message',

      title: 'Exchange Cancelled',

      message:
        `${user?.name || 'Your partner'} cancelled the exchange.`,

      relatedUser: userId,

      relatedRequest: request._id

    })


    res.status(200).json({

      message:
        'Exchange cancelled successfully',

      request

    })

  } catch (error) {

    console.error(
      'Cancel exchange error:',
      error
    )

    res.status(500).json({

      message:
        'Failed to cancel exchange'

    })

  }

}