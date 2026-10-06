import mongoose from 'mongoose'

const exchangeRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true
    },

    status: {
      type: String,
      enum: [
        'Pending',
        'Accepted',
        'Rejected',
        'Completed',
        'Cancelled'
      ],
      default: 'Pending'
    }
  },

  {
    timestamps: true
  }
)

const ExchangeRequest = mongoose.model(
  'ExchangeRequest',
  exchangeRequestSchema
)

export default ExchangeRequest