import express from 'express'


import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  getNotificationPreferences,
  updateNotificationPreferences,
  getPrivacySettings,
  updatePrivacySettings
} from '../controllers/authController.js'


import authMiddleware from '../middleware/authMiddleware.js'


const router = express.Router()


// =================================
// REGISTER
// =================================

router.post(
  '/register',
  registerUser
)


// =================================
// LOGIN
// =================================

router.post(
  '/login',
  loginUser
)


// =================================
// PROTECTED
// =================================

router.get(
  '/protected',
  authMiddleware,
  (req, res) => {

    res.status(200).json({

      message:
        'You are authenticated',

      user:
        req.user

    })

  }
)


// =================================
// PROFILE
// =================================

router.get(
  '/profile',
  authMiddleware,
  getProfile
)


router.put(
  '/profile',
  authMiddleware,
  updateProfile
)


// =================================
// CHANGE PASSWORD
// =================================

router.put(
  '/change-password',
  authMiddleware,
  changePassword
)


// =================================
// NOTIFICATION PREFERENCES
// =================================

router.get(
  '/notification-preferences',
  authMiddleware,
  getNotificationPreferences
)


router.put(
  '/notification-preferences',
  authMiddleware,
  updateNotificationPreferences
)


// =================================
// PRIVACY SETTINGS
// =================================

router.get(
  '/privacy-settings',
  authMiddleware,
  getPrivacySettings
)


router.put(
  '/privacy-settings',
  authMiddleware,
  updatePrivacySettings
)


export default router