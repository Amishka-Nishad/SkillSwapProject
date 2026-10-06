import express from 'express'

import {
  deleteAccount
} from '../controllers/accountController.js'

import authMiddleware from '../middleware/authMiddleware.js'


const router = express.Router()


// =================================
// DELETE ACCOUNT
// =================================

router.delete(
  '/delete',
  authMiddleware,
  deleteAccount
)


export default router