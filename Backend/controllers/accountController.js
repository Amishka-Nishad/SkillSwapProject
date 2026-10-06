import User from '../models/User.js'
import Skill from '../models/Skill.js'
import ExchangeRequest from '../models/ExchangeRequest.js'
import Message from '../models/Message.js'
import Notification from '../models/Notification.js'
import Review from '../models/Review.js'


// =================================
// DELETE ACCOUNT
// =================================

export const deleteAccount = async (req, res) => {

  try {

    const userId = req.user.id


    // =========================
    // CHECK USER
    // =========================

    const user = await User.findById(userId)


    if (!user) {

      return res.status(404).json({
        message: 'User not found'
      })

    }


    // =========================
    // DELETE USER SKILLS
    // =========================

    await Skill.deleteMany({
      user: userId
    })


    // =========================
    // DELETE EXCHANGE REQUESTS
    // =========================

    await ExchangeRequest.deleteMany({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })


    // =========================
    // DELETE MESSAGES
    // =========================

    await Message.deleteMany({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })


    // =========================
    // DELETE NOTIFICATIONS
    // =========================

    await Notification.deleteMany({
      $or: [
        { user: userId },
        { relatedUser: userId }
      ]
    })


    // =========================
    // DELETE REVIEWS
    // =========================

    await Review.deleteMany({
      $or: [
        { reviewer: userId },
        { reviewee: userId }
      ]
    })


    // =========================
    // DELETE USER
    // =========================

    await User.findByIdAndDelete(userId)


    // =========================
    // RESPONSE
    // =========================

    res.status(200).json({

      message:
        'Account and all associated data deleted successfully'

    })


  } catch (error) {

    console.error(
      'Delete account error:',
      error
    )


    res.status(500).json({

      message:
        'Unable to delete account'

    })

  }

}