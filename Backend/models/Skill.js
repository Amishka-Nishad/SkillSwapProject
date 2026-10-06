import mongoose from 'mongoose'

const skillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      enum: ['Teach', 'Learn'],
      required: true
    },

    description: {
      type: String,
      default: '',
      trim: true
    },

    level: {
      type: String,
      default: 'Beginner',
      trim: true
    }
  },
  {
    timestamps: true
  }
)

const Skill = mongoose.model('Skill', skillSchema)

export default Skill