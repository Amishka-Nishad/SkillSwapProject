import mongoose from 'mongoose'


const userSchema = new mongoose.Schema(

  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      default: 'Skill Learner',
      trim: true
    },

    location: {
      type: String,
      default: '',
      trim: true
    },

    about: {
      type: String,
      default: '',
      trim: true
    },

    github: {
      type: String,
      default: '',
      trim: true
    },

    linkedin: {
      type: String,
      default: '',
      trim: true
    },

    teachSkills: {
      type: [String],
      default: []
    },

    learnSkills: {
      type: [String],
      default: []
    },


    // =========================
    // NOTIFICATION PREFERENCES
    // =========================

    notificationPreferences: {

      exchangeRequests: {
        type: Boolean,
        default: true
      },

      messages: {
        type: Boolean,
        default: true
      },

      reviews: {
        type: Boolean,
        default: true
      },

      emailNotifications: {
        type: Boolean,
        default: true
      }

    },


    // =========================
    // PRIVACY SETTINGS
    // =========================

    privacySettings: {

      profileVisibility: {
        type: Boolean,
        default: true
      },

      showOnlineStatus: {
        type: Boolean,
        default: true
      },

      loginAlerts: {
        type: Boolean,
        default: true
      }

    }

  },

  {
    timestamps: true
  }

)


const User =
  mongoose.model(
    'User',
    userSchema
  )


export default User