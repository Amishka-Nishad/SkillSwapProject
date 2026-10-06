import express from 'express'

import {
  sendExchangeRequest,
  getReceivedRequests,
  getSentRequests,
  updateRequestStatus,
  completeExchange,
  cancelExchange
} from '../controllers/exchangeRequestController.js'

import authMiddleware from '../middleware/authMiddleware.js'


const router = express.Router()


// =========================================
// SEND REQUEST
// =========================================

router.post(
  '/',
  authMiddleware,
  sendExchangeRequest
)


// =========================================
// RECEIVED REQUESTS
// =========================================

router.get(
  '/received',
  authMiddleware,
  getReceivedRequests
)


// =========================================
// SENT REQUESTS
// =========================================

router.get(
  '/sent',
  authMiddleware,
  getSentRequests
)


// =========================================
// ACCEPT / REJECT
// =========================================

router.put(
  '/:id/status',
  authMiddleware,
  updateRequestStatus
)


// =========================================
// COMPLETE EXCHANGE
// =========================================

router.put(
  '/:id/complete',
  authMiddleware,
  completeExchange
)


// =========================================
// CANCEL EXCHANGE
// =========================================

router.put(
  '/:id/cancel',
  authMiddleware,
  cancelExchange
)


export default router