import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'


// =================================
// REGISTER USER
// =================================

export const registerUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      confirmPassword
    } = req.body


    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {

      return res.status(400).json({
        message: 'All fields are required'
      })

    }


    if (password !== confirmPassword) {

      return res.status(400).json({
        message: 'Passwords do not match'
      })

    }


    const existingUser =
      await User.findOne({ email })


    if (existingUser) {

      return res.status(400).json({
        message: 'User already exists'
      })

    }


    const hashedPassword =
      await bcrypt.hash(password, 10)


    const user =
      await User.create({

        name,

        email,

        password: hashedPassword

      })


    res.status(201).json({

      message:
        'User registered successfully',

      user: {

        id: user._id,

        name: user.name,

        email: user.email

      }

    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: 'Server error'
    })

  }

}


// =================================
// LOGIN USER
// =================================

export const loginUser = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body


    if (!email || !password) {

      return res.status(400).json({
        message:
          'Email and password are required'
      })

    }


    const user =
      await User.findOne({ email })


    if (!user) {

      return res.status(401).json({
        message:
          'Invalid email or password'
      })

    }


    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      )


    if (!isPasswordCorrect) {

      return res.status(401).json({
        message:
          'Invalid email or password'
      })

    }


    const token =
      jwt.sign(

        {
          id: user._id,
          email: user.email
        },

        process.env.JWT_SECRET,

        {
          expiresIn: '7d'
        }

      )


    res.status(200).json({

      message:
        'Login successful',

      token,

      user: {

        id: user._id,

        name: user.name,

        email: user.email

      }

    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: 'Server error'
    })

  }

}


// =================================
// GET PROFILE
// =================================

export const getProfile = async (req, res) => {

  try {

    const userId = req.user.id


    const user =
      await User
        .findById(userId)
        .select('-password')


    if (!user) {

      return res.status(404).json({
        message: 'User not found'
      })

    }


    res.status(200).json({

      message:
        'Profile fetched successfully',

      user: {

        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

        location: user.location,

        about: user.about,

        github: user.github,

        linkedin: user.linkedin,

        teachSkills:
          user.teachSkills,

        learnSkills:
          user.learnSkills,

        notificationPreferences:
          user.notificationPreferences,

        privacySettings:
          user.privacySettings

      }

    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: 'Server error'
    })

  }

}


// =================================
// UPDATE PROFILE
// =================================

export const updateProfile = async (req, res) => {

  try {

    const userId = req.user.id


    const {
      name,
      email,
      role,
      location,
      about,
      github,
      linkedin,
      teachSkills,
      learnSkills
    } = req.body


    if (!name || !email) {

      return res.status(400).json({
        message:
          'Name and email are required'
      })

    }


    const existingUser =
      await User.findOne({

        email,

        _id: {
          $ne: userId
        }

      })


    if (existingUser) {

      return res.status(400).json({
        message:
          'Email already in use'
      })

    }


    const updatedUser =
      await User.findByIdAndUpdate(

        userId,

        {
          name,
          email,
          role,
          location,
          about,
          github,
          linkedin,
          teachSkills,
          learnSkills
        },

        {
          new: true,
          runValidators: true
        }

      )


    if (!updatedUser) {

      return res.status(404).json({
        message: 'User not found'
      })

    }


    res.status(200).json({

      message:
        'Profile updated successfully',

      user: {

        id: updatedUser._id,

        name: updatedUser.name,

        email: updatedUser.email,

        role: updatedUser.role,

        location: updatedUser.location,

        about: updatedUser.about,

        github: updatedUser.github,

        linkedin: updatedUser.linkedin,

        teachSkills:
          updatedUser.teachSkills,

        learnSkills:
          updatedUser.learnSkills,

        notificationPreferences:
          updatedUser.notificationPreferences,

        privacySettings:
          updatedUser.privacySettings

      }

    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: 'Server error'
    })

  }

}


// =================================
// CHANGE PASSWORD
// =================================

export const changePassword = async (req, res) => {

  try {

    const userId = req.user.id


    const {
      currentPassword,
      newPassword,
      confirmPassword
    } = req.body


    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {

      return res.status(400).json({

        message:
          'All password fields are required'

      })

    }


    if (
      newPassword !== confirmPassword
    ) {

      return res.status(400).json({

        message:
          'New passwords do not match'

      })

    }


    if (newPassword.length < 6) {

      return res.status(400).json({

        message:
          'New password must be at least 6 characters long'

      })

    }


    const user =
      await User.findById(userId)


    if (!user) {

      return res.status(404).json({

        message:
          'User not found'

      })

    }


    const isPasswordCorrect =
      await bcrypt.compare(
        currentPassword,
        user.password
      )


    if (!isPasswordCorrect) {

      return res.status(400).json({

        message:
          'Current password is incorrect'

      })

    }


    const isSamePassword =
      await bcrypt.compare(
        newPassword,
        user.password
      )


    if (isSamePassword) {

      return res.status(400).json({

        message:
          'New password must be different from current password'

      })

    }


    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      )


    user.password =
      hashedPassword


    await user.save()


    res.status(200).json({

      message:
        'Password changed successfully'

    })

  } catch (error) {

    console.error(
      'Change password error:',
      error
    )

    res.status(500).json({

      message:
        'Server error'

    })

  }

}


// =================================
// GET NOTIFICATION PREFERENCES
// =================================

export const getNotificationPreferences =
  async (req, res) => {

    try {

      const userId = req.user.id


      const user =
        await User
          .findById(userId)
          .select('notificationPreferences')


      if (!user) {

        return res.status(404).json({

          message:
            'User not found'

        })

      }


      res.status(200).json({

        message:
          'Notification preferences fetched successfully',

        notificationPreferences:
          user.notificationPreferences

      })

    } catch (error) {

      console.error(
        'Notification preferences error:',
        error
      )

      res.status(500).json({

        message:
          'Server error'

      })

    }

  }


// =================================
// UPDATE NOTIFICATION PREFERENCES
// =================================

export const updateNotificationPreferences =
  async (req, res) => {

    try {

      const userId = req.user.id


      const {
        exchangeRequests,
        messages,
        reviews,
        emailNotifications
      } = req.body


      const updatedUser =
        await User.findByIdAndUpdate(

          userId,

          {

            notificationPreferences: {

              exchangeRequests:
                Boolean(exchangeRequests),

              messages:
                Boolean(messages),

              reviews:
                Boolean(reviews),

              emailNotifications:
                Boolean(emailNotifications)

            }

          },

          {
            new: true,
            runValidators: true
          }

        )


      if (!updatedUser) {

        return res.status(404).json({

          message:
            'User not found'

        })

      }


      res.status(200).json({

        message:
          'Notification preferences updated successfully',

        notificationPreferences:
          updatedUser.notificationPreferences

      })

    } catch (error) {

      console.error(
        'Update notification preferences error:',
        error
      )

      res.status(500).json({

        message:
          'Server error'

      })

    }

  }


// =================================
// GET PRIVACY SETTINGS
// =================================

export const getPrivacySettings =
  async (req, res) => {

    try {

      const userId = req.user.id


      const user =
        await User
          .findById(userId)
          .select('privacySettings')


      if (!user) {

        return res.status(404).json({

          message:
            'User not found'

        })

      }


      res.status(200).json({

        message:
          'Privacy settings fetched successfully',

        privacySettings:
          user.privacySettings

      })

    } catch (error) {

      console.error(
        'Privacy settings error:',
        error
      )

      res.status(500).json({

        message:
          'Server error'

      })

    }

  }


// =================================
// UPDATE PRIVACY SETTINGS
// =================================

export const updatePrivacySettings =
  async (req, res) => {

    try {

      const userId = req.user.id


      const {
        profileVisibility,
        showOnlineStatus,
        loginAlerts
      } = req.body


      const updatedUser =
        await User.findByIdAndUpdate(

          userId,

          {

            privacySettings: {

              profileVisibility:
                Boolean(profileVisibility),

              showOnlineStatus:
                Boolean(showOnlineStatus),

              loginAlerts:
                Boolean(loginAlerts)

            }

          },

          {
            new: true,
            runValidators: true
          }

        )


      if (!updatedUser) {

        return res.status(404).json({

          message:
            'User not found'

        })

      }


      res.status(200).json({

        message:
          'Privacy settings updated successfully',

        privacySettings:
          updatedUser.privacySettings

      })

    } catch (error) {

      console.error(
        'Update privacy settings error:',
        error
      )

      res.status(500).json({

        message:
          'Server error'

      })

    }

  }