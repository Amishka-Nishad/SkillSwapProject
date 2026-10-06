import express from 'express'

import {
  getMyReviews,
  getReviewPartners,
  createReview,
  getReviewStats
} from '../controllers/reviewController.js'

import authMiddleware from '../middleware/authMiddleware.js'


const router = express.Router()


// Get reviews received by current user
router.get(
  '/',
  authMiddleware,
  getMyReviews
)


// Get accepted exchange partners
router.get(
  '/partners',
  authMiddleware,
  getReviewPartners
)


// Get rating statistics
router.get(
  '/stats',
  authMiddleware,
  getReviewStats
)


// Create review
router.post(
  '/',
  authMiddleware,
  createReview
)


export default router