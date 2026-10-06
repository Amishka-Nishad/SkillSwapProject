import Review from '../models/Review.js'
import ExchangeRequest from '../models/ExchangeRequest.js'


// =================================
// GET REVIEWS RECEIVED BY USER
// =================================

export const getMyReviews = async (req, res) => {

  try {

    const reviews = await Review.find({
      reviewee: req.user.id
    })
      .populate(
        'reviewer',
        'name email'
      )
      .populate(
        'exchangeRequest',
        'status'
      )
      .sort({
        createdAt: -1
      })

    res.status(200).json({
      reviews
    })

  } catch (error) {

    console.error(
      'Get reviews error:',
      error
    )

    res.status(500).json({
      message: 'Failed to fetch reviews'
    })

  }

}


// =================================
// GET PARTNERS AVAILABLE FOR REVIEW
// =================================

export const getReviewPartners = async (req, res) => {

  try {

    const userId = req.user.id

    const received =
      await ExchangeRequest.find({
        receiver: userId,
        status: 'Accepted'
      })
        .populate(
          'sender',
          'name email'
        )
        .populate(
          'skill',
          'name'
        )

    const sent =
      await ExchangeRequest.find({
        sender: userId,
        status: 'Accepted'
      })
        .populate(
          'receiver',
          'name email'
        )
        .populate(
          'skill',
          'name'
        )


    const partners = []


    // =================================
    // RECEIVED EXCHANGES
    // =================================

    for (const request of received) {

      const existingReview =
        await Review.findOne({
          reviewer: userId,
          exchangeRequest: request._id
        })

      if (!existingReview) {

        partners.push({

          requestId:
            request._id,

          userId:
            request.sender?._id,

          name:
            request.sender?.name ||
            'User',

          skill:
            request.skill?.name ||
            'Skill Exchange'

        })

      }

    }


    // =================================
    // SENT EXCHANGES
    // =================================

    for (const request of sent) {

      const existingReview =
        await Review.findOne({
          reviewer: userId,
          exchangeRequest: request._id
        })

      if (!existingReview) {

        partners.push({

          requestId:
            request._id,

          userId:
            request.receiver?._id,

          name:
            request.receiver?.name ||
            'User',

          skill:
            request.skill?.name ||
            'Skill Exchange'

        })

      }

    }


    res.status(200).json({
      partners
    })

  } catch (error) {

    console.error(
      'Review partners error:',
      error
    )

    res.status(500).json({
      message:
        'Failed to fetch review partners'
    })

  }

}


// =================================
// CREATE REVIEW
// =================================

export const createReview = async (req, res) => {

  try {

    const {
      exchangeRequestId,
      rating,
      text
    } = req.body


    // =================================
    // VALIDATION
    // =================================

    if (!exchangeRequestId) {

      return res.status(400).json({
        message:
          'Exchange request is required'
      })

    }


    if (
      !rating ||
      rating < 1 ||
      rating > 5
    ) {

      return res.status(400).json({
        message:
          'Rating must be between 1 and 5'
      })

    }


    if (!text || !text.trim()) {

      return res.status(400).json({
        message:
          'Review text is required'
      })

    }


    // =================================
    // FIND ACCEPTED EXCHANGE
    // =================================

    const request =
      await ExchangeRequest.findOne({
        _id: exchangeRequestId,
        status: 'Accepted',
        $or: [
          {
            sender: req.user.id
          },
          {
            receiver: req.user.id
          }
        ]
      })


    if (!request) {

      return res.status(404).json({
        message:
          'Accepted exchange not found'
      })

    }


    // =================================
    // FIND REVIEWEE
    // =================================

    const reviewee =
      request.sender.toString() ===
      req.user.id.toString()
        ? request.receiver
        : request.sender


    // =================================
    // CHECK DUPLICATE REVIEW
    // =================================

    const existingReview =
      await Review.findOne({
        reviewer: req.user.id,
        exchangeRequest: exchangeRequestId
      })


    if (existingReview) {

      return res.status(400).json({
        message:
          'You have already reviewed this exchange'
      })

    }


    // =================================
    // CREATE REVIEW
    // =================================

    const review =
      await Review.create({

        reviewer:
          req.user.id,

        reviewee,

        exchangeRequest:
          exchangeRequestId,

        rating,

        text:
          text.trim()

      })


    const populatedReview =
      await Review.findById(
        review._id
      )
        .populate(
          'reviewer',
          'name email'
        )
        .populate(
          'exchangeRequest',
          'status'
        )


    res.status(201).json({

      message:
        'Review submitted successfully',

      review:
        populatedReview

    })

  } catch (error) {

    console.error(
      'Create review error:',
      error
    )

    res.status(500).json({
      message:
        'Failed to submit review'
    })

  }

}


// =================================
// GET REVIEW STATS
// =================================

export const getReviewStats = async (req, res) => {

  try {

    const reviews =
      await Review.find({
        reviewee: req.user.id
      })


    const total =
      reviews.length


    if (total === 0) {

      return res.status(200).json({

        total: 0,

        average: 0,

        breakdown: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0
        }

      })

    }


    const totalRating =
      reviews.reduce(
        (sum, review) =>
          sum + review.rating,
        0
      )


    const average =
      Number(
        (
          totalRating / total
        ).toFixed(1)
      )


    const breakdown = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    }


    reviews.forEach(
      (review) => {

        breakdown[
          review.rating
        ]++

      }
    )


    res.status(200).json({

      total,

      average,

      breakdown

    })

  } catch (error) {

    console.error(
      'Review stats error:',
      error
    )

    res.status(500).json({
      message:
        'Failed to fetch review stats'
    })

  }

}