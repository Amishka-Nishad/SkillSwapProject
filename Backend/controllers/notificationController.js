import Notification from '../models/Notification.js'


// GET MY NOTIFICATIONS
export const getMyNotifications = async (req, res) => {
  try {

    const notifications =
      await Notification.find({
        user: req.user.id
      })
        .populate('relatedUser', 'name email')
        .sort({ createdAt: -1 })

    res.status(200).json({
      message: 'Notifications fetched successfully',
      notifications
    })

  } catch (error) {

    console.error(
      'Get notifications error:',
      error
    )

    res.status(500).json({
      message: 'Server error'
    })
  }
}


// MARK ONE NOTIFICATION AS READ
export const markNotificationAsRead = async (
  req,
  res
) => {
  try {

    const notification =
      await Notification.findOne({
        _id: req.params.id,
        user: req.user.id
      })

    if (!notification) {

      return res.status(404).json({
        message: 'Notification not found'
      })
    }


    notification.isRead = true

    await notification.save()


    res.status(200).json({
      message: 'Notification marked as read',
      notification
    })

  } catch (error) {

    console.error(
      'Mark notification error:',
      error
    )

    res.status(500).json({
      message: 'Server error'
    })
  }
}


// MARK ALL NOTIFICATIONS AS READ
export const markAllNotificationsAsRead = async (
  req,
  res
) => {
  try {

    await Notification.updateMany(
      {
        user: req.user.id,
        isRead: false
      },
      {
        $set: {
          isRead: true
        }
      }
    )

    res.status(200).json({
      message: 'All notifications marked as read'
    })

  } catch (error) {

    console.error(
      'Mark all notifications error:',
      error
    )

    res.status(500).json({
      message: 'Server error'
    })
  }
}


// DELETE NOTIFICATION
export const deleteNotification = async (
  req,
  res
) => {
  try {

    const notification =
      await Notification.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id
      })

    if (!notification) {

      return res.status(404).json({
        message: 'Notification not found'
      })
    }


    res.status(200).json({
      message: 'Notification deleted successfully'
    })

  } catch (error) {

    console.error(
      'Delete notification error:',
      error
    )

    res.status(500).json({
      message: 'Server error'
    })
  }
}