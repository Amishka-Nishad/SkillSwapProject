import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    exchangeRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExchangeRequest',
      required: true
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    text: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
)

const Review = mongoose.model('Review', reviewSchema)

export default Review