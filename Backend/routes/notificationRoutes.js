import express from 'express'

import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} from '../controllers/notificationController.js'

import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()


router.get(
  '/',
  authMiddleware,
  getMyNotifications
)


router.put(
  '/read-all',
  authMiddleware,
  markAllNotificationsAsRead
)


router.put(
  '/:id/read',
  authMiddleware,
  markNotificationAsRead
)


router.delete(
  '/:id',
  authMiddleware,
  deleteNotification
)


export default router