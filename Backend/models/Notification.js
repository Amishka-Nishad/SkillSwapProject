import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    type: {
      type: String,
      enum: [
        'Exchange Request',
        'Request Accepted',
        'Request Rejected',
        'New Message'
      ],
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    message: {
      type: String,
      required: true,
      trim: true
    },

    relatedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    relatedRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExchangeRequest',
      default: null
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const Notification = mongoose.model(
  'Notification',
  notificationSchema
)

export default Notification