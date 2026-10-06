import express from 'express'

import {
  sendMessage,
  getConversation,
  getMyMessages
} from '../controllers/messageController.js'

import authMiddleware from '../middleware/authMiddleware.js'


const router = express.Router()


/* SEND MESSAGE */

router.post(
  '/',
  authMiddleware,
  sendMessage
)


/* GET MY MESSAGES */

router.get(
  '/',
  authMiddleware,
  getMyMessages
)


/* GET CONVERSATION */

router.get(
  '/conversation/:userId',
  authMiddleware,
  getConversation
)


export default router