import React, { useEffect, useState } from 'react'

import {
  FiUser,
  FiLock,
  FiBell,
  FiShield,
  FiSave,
  FiMail,
  FiEye,
  FiEyeOff,
  FiTrash2
} from 'react-icons/fi'

import Swal from 'sweetalert2'


const Settings = () => {

  const [activeTab, setActiveTab] = useState('profile')


  // =========================
  // PASSWORD VISIBILITY
  // =========================

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)


  // =========================
  // PROFILE STATES
  // =========================

  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [about, setAbout] = useState('')
  const [skills, setSkills] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)


  // =========================
  // PASSWORD STATES
  // =========================

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [changingPassword, setChangingPassword] = useState(false)


  // =========================
  // NOTIFICATION STATES
  // =========================

  const [notificationSettings, setNotificationSettings] = useState({
    exchangeRequests: true,
    messages: true,
    reviews: true,
    emailNotifications: true
  })

  const [loadingNotifications, setLoadingNotifications] = useState(false)
  const [savingNotifications, setSavingNotifications] = useState(false)


  // =========================
  // PRIVACY STATES
  // =========================

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    showOnlineStatus: true,
    loginAlerts: true
  })

  const [loadingPrivacy, setLoadingPrivacy] = useState(false)
  const [savingPrivacy, setSavingPrivacy] = useState(false)


  // =========================
  // DELETE ACCOUNT STATE
  // =========================

  const [deletingAccount, setDeletingAccount] = useState(false)


  // =========================
  // FETCH PROFILE
  // =========================

  useEffect(() => {

    const fetchProfile = async () => {

      const token = localStorage.getItem('token')


      if (!token) {

        window.location.href = '/login'

        return

      }


      try {

        const response = await fetch(
          'http://localhost:5000/api/auth/profile',
          {
            method: 'GET',

            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )


        const data = await response.json()


        if (response.status === 401) {

          localStorage.removeItem('token')
          localStorage.removeItem('user')


          await Swal.fire({
            icon: 'error',
            title: 'Session Expired',
            text: 'Please login again.',
            confirmButtonText: 'Go to Login'
          })


          window.location.href = '/login'

          return

        }


        if (!response.ok) {

          console.error(
            'Settings profile error:',
            data.message
          )

          return

        }


        const user = data.user


        setFullName(user.name || '')

        setEmail(user.email || '')

        setAbout(user.about || '')


        setUsername(
          user.name
            ?.toLowerCase()
            ?.replace(/\s+/g, '') || ''
        )


        setSkills(
          user.teachSkills?.join(', ') || ''
        )


      } catch (error) {

        console.error(
          'Settings fetch error:',
          error
        )

      } finally {

        setLoading(false)

      }

    }


    fetchProfile()

  }, [])


  // =========================
  // FETCH NOTIFICATIONS
  // =========================

  useEffect(() => {

    if (activeTab !== 'notifications') {
      return
    }


    const fetchNotificationSettings = async () => {

      const token = localStorage.getItem('token')


      if (!token) {

        window.location.href = '/login'

        return

      }


      try {

        setLoadingNotifications(true)


        const response = await fetch(
          'http://localhost:5000/api/auth/notification-preferences',
          {
            method: 'GET',

            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )


        const data = await response.json()


        if (response.status === 401) {

          localStorage.removeItem('token')
          localStorage.removeItem('user')

          window.location.href = '/login'

          return

        }


        if (!response.ok) {

          Swal.fire({
            icon: 'error',
            title: 'Unable to Load Settings',
            text:
              data.message ||
              'Notification settings could not be loaded.'
          })

          return

        }


        if (data.notificationPreferences) {

          setNotificationSettings({

            exchangeRequests:
              data.notificationPreferences.exchangeRequests ?? true,

            messages:
              data.notificationPreferences.messages ?? true,

            reviews:
              data.notificationPreferences.reviews ?? true,

            emailNotifications:
              data.notificationPreferences.emailNotifications ?? true

          })

        }


      } catch (error) {

        console.error(
          'Notification settings error:',
          error
        )

      } finally {

        setLoadingNotifications(false)

      }

    }


    fetchNotificationSettings()

  }, [activeTab])


  // =========================
  // FETCH PRIVACY
  // =========================

  useEffect(() => {

    if (activeTab !== 'privacy') {
      return
    }


    const fetchPrivacySettings = async () => {

      const token = localStorage.getItem('token')


      if (!token) {

        window.location.href = '/login'

        return

      }


      try {

        setLoadingPrivacy(true)


        const response = await fetch(
          'http://localhost:5000/api/auth/privacy-settings',
          {
            method: 'GET',

            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )


        const data = await response.json()


        if (response.status === 401) {

          localStorage.removeItem('token')
          localStorage.removeItem('user')

          window.location.href = '/login'

          return

        }


        if (!response.ok) {

          Swal.fire({
            icon: 'error',
            title: 'Unable to Load Settings',
            text:
              data.message ||
              'Privacy settings could not be loaded.'
          })

          return

        }


        if (data.privacySettings) {

          setPrivacySettings({

            profileVisibility:
              data.privacySettings.profileVisibility ?? true,

            showOnlineStatus:
              data.privacySettings.showOnlineStatus ?? true,

            loginAlerts:
              data.privacySettings.loginAlerts ?? true

          })

        }


      } catch (error) {

        console.error(
          'Privacy settings error:',
          error
        )

      } finally {

        setLoadingPrivacy(false)

      }

    }


    fetchPrivacySettings()

  }, [activeTab])


  // =========================
  // SAVE PROFILE
  // =========================

  const handleSaveProfile = async () => {

    if (!fullName.trim()) {

      Swal.fire({
        icon: 'error',
        title: 'Full Name Required',
        text: 'Please enter your full name.'
      })

      return

    }


    if (!email.trim()) {

      Swal.fire({
        icon: 'error',
        title: 'Email Required',
        text: 'Please enter your email address.'
      })

      return

    }


    const token = localStorage.getItem('token')


    if (!token) {

      window.location.href = '/login'

      return

    }


    try {

      setSaving(true)


      const teachSkills = skills
        .split(',')
        .map(skill => skill.trim())
        .filter(Boolean)


      const response = await fetch(
        'http://localhost:5000/api/auth/profile',
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            name: fullName.trim(),
            email: email.trim(),
            about: about.trim(),
            teachSkills
          })
        }
      )


      const data = await response.json()


      if (!response.ok) {

        if (response.status === 401) {

          localStorage.removeItem('token')
          localStorage.removeItem('user')


          await Swal.fire({
            icon: 'error',
            title: 'Session Expired',
            text: 'Please login again.',
            confirmButtonText: 'Go to Login'
          })


          window.location.href = '/login'

          return

        }


        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text:
            data.message ||
            'Unable to update profile.'
        })

        return

      }


      const updatedUser = data.user


      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      )


      setFullName(updatedUser.name || '')

      setEmail(updatedUser.email || '')

      setAbout(updatedUser.about || '')

      setSkills(
        updatedUser.teachSkills?.join(', ') || ''
      )


      window.dispatchEvent(
        new Event('userUpdated')
      )


      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text:
          'Your profile changes have been saved successfully.',
        confirmButtonText: 'Okay'
      })


    } catch (error) {

      console.error(
        'Save profile error:',
        error
      )


      Swal.fire({
        icon: 'error',
        title: 'Error',
        text:
          'Something went wrong while updating your profile.'
      })

    } finally {

      setSaving(false)

    }

  }


  // =========================
  // CHANGE PASSWORD
  // =========================

  const handleChangePassword = async () => {

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {

      Swal.fire({
        icon: 'error',
        title: 'Required Fields',
        text:
          'Please fill all password fields.'
      })

      return

    }


    if (newPassword.length < 6) {

      Swal.fire({
        icon: 'error',
        title: 'Password Too Short',
        text:
          'New password must be at least 6 characters long.'
      })

      return

    }


    if (newPassword !== confirmPassword) {

      Swal.fire({
        icon: 'error',
        title: 'Passwords Do Not Match',
        text:
          'New password and confirm password must be the same.'
      })

      return

    }


    const token = localStorage.getItem('token')


    if (!token) {

      window.location.href = '/login'

      return

    }


    try {

      setChangingPassword(true)


      const response = await fetch(
        'http://localhost:5000/api/auth/change-password',
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword
          })
        }
      )


      const data = await response.json()


      if (!response.ok) {

        if (response.status === 401) {

          localStorage.removeItem('token')
          localStorage.removeItem('user')


          await Swal.fire({
            icon: 'error',
            title: 'Session Expired',
            text: 'Please login again.',
            confirmButtonText: 'Go to Login'
          })


          window.location.href = '/login'

          return

        }


        Swal.fire({
          icon: 'error',
          title: 'Password Change Failed',
          text:
            data.message ||
            'Unable to change password.'
        })

        return

      }


      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')


      Swal.fire({
        icon: 'success',
        title: 'Password Changed',
        text:
          'Your password has been changed successfully.',
        confirmButtonText: 'Okay'
      })


    } catch (error) {

      console.error(
        'Change password error:',
        error
      )


      Swal.fire({
        icon: 'error',
        title: 'Error',
        text:
          'Something went wrong while changing your password.'
      })

    } finally {

      setChangingPassword(false)

    }

  }


  // =========================
  // NOTIFICATION TOGGLE
  // =========================

  const handleNotificationChange = (setting) => {

    setNotificationSettings(previous => ({

      ...previous,

      [setting]: !previous[setting]

    }))

  }


  // =========================
  // SAVE NOTIFICATIONS
  // =========================

  const handleSaveNotifications = async () => {

    const token = localStorage.getItem('token')


    if (!token) {

      window.location.href = '/login'

      return

    }


    try {

      setSavingNotifications(true)


      const response = await fetch(
        'http://localhost:5000/api/auth/notification-preferences',
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify(
            notificationSettings
          )
        }
      )


      const data = await response.json()


      if (!response.ok) {

        if (response.status === 401) {

          localStorage.removeItem('token')
          localStorage.removeItem('user')

          window.location.href = '/login'

          return

        }


        Swal.fire({
          icon: 'error',
          title: 'Save Failed',
          text:
            data.message ||
            'Unable to save notification preferences.'
        })

        return

      }


      if (data.notificationPreferences) {

        setNotificationSettings({

          exchangeRequests:
            data.notificationPreferences.exchangeRequests,

          messages:
            data.notificationPreferences.messages,

          reviews:
            data.notificationPreferences.reviews,

          emailNotifications:
            data.notificationPreferences.emailNotifications

        })

      }


      Swal.fire({
        icon: 'success',
        title: 'Preferences Saved',
        text:
          'Your notification preferences have been updated.',
        confirmButtonText: 'Okay'
      })


    } catch (error) {

      console.error(
        'Save notification settings error:',
        error
      )


      Swal.fire({
        icon: 'error',
        title: 'Error',
        text:
          'Something went wrong while saving preferences.'
      })

    } finally {

      setSavingNotifications(false)

    }

  }


  // =========================
  // PRIVACY TOGGLE
  // =========================

  const handlePrivacyChange = (setting) => {

    setPrivacySettings(previous => ({

      ...previous,

      [setting]: !previous[setting]

    }))

  }


  // =========================
  // SAVE PRIVACY
  // =========================

  const handleSavePrivacy = async () => {

    const token = localStorage.getItem('token')


    if (!token) {

      window.location.href = '/login'

      return

    }


    try {

      setSavingPrivacy(true)


      const response = await fetch(
        'http://localhost:5000/api/auth/privacy-settings',
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify(
            privacySettings
          )
        }
      )


      const data = await response.json()


      if (!response.ok) {

        if (response.status === 401) {

          localStorage.removeItem('token')
          localStorage.removeItem('user')

          window.location.href = '/login'

          return

        }


        Swal.fire({
          icon: 'error',
          title: 'Save Failed',
          text:
            data.message ||
            'Unable to save privacy settings.'
        })

        return

      }


      if (data.privacySettings) {

        setPrivacySettings({

          profileVisibility:
            data.privacySettings.profileVisibility,

          showOnlineStatus:
            data.privacySettings.showOnlineStatus,

          loginAlerts:
            data.privacySettings.loginAlerts

        })

      }


      Swal.fire({
        icon: 'success',
        title: 'Privacy Settings Saved',
        text:
          'Your privacy settings have been updated.',
        confirmButtonText: 'Okay'
      })


    } catch (error) {

      console.error(
        'Save privacy settings error:',
        error
      )


      Swal.fire({
        icon: 'error',
        title: 'Error',
        text:
          'Something went wrong while saving privacy settings.'
      })

    } finally {

      setSavingPrivacy(false)

    }

  }


  // =========================
  // DELETE ACCOUNT
  // =========================

  const handleDeleteAccount = async () => {

    const firstConfirm = await Swal.fire({

      icon: 'warning',

      title: 'Delete Account?',

      text:
        'This will permanently delete your account and all associated data.',

      showCancelButton: true,

      confirmButtonText:
        'Yes, Delete My Account',

      cancelButtonText:
        'Cancel',

      confirmButtonColor:
        '#d33'

    })


    if (!firstConfirm.isConfirmed) {

      return

    }


    const secondConfirm = await Swal.fire({

      icon: 'warning',

      title: 'Are you absolutely sure?',

      text:
        'This action cannot be undone.',

      showCancelButton: true,

      confirmButtonText:
        'Delete Permanently',

      cancelButtonText:
        'Keep My Account',

      confirmButtonColor:
        '#d33'

    })


    if (!secondConfirm.isConfirmed) {

      return

    }


    const token = localStorage.getItem('token')


    if (!token) {

      window.location.href = '/login'

      return

    }


    try {

      setDeletingAccount(true)


      const response = await fetch(
        'http://localhost:5000/api/account/delete',
        {
          method: 'DELETE',

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )


      const data = await response.json()


      if (!response.ok) {

        if (response.status === 401) {

          localStorage.removeItem('token')
          localStorage.removeItem('user')

          window.location.href = '/login'

          return

        }


        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text:
            data.message ||
            'Unable to delete your account.'
        })

        return

      }


      // =========================
      // CLEAR SESSION
      // =========================

      localStorage.removeItem('token')
      localStorage.removeItem('user')


      // =========================
      // SUCCESS
      // =========================

      await Swal.fire({

        icon: 'success',

        title: 'Account Deleted',

        text:
          'Your SkillSwap account and associated data have been permanently deleted.',

        confirmButtonText:
          'Go to Login'

      })


      window.location.href = '/login'


    } catch (error) {

      console.error(
        'Delete account error:',
        error
      )


      Swal.fire({

        icon: 'error',

        title: 'Error',

        text:
          'Something went wrong while deleting your account.'

      })

    } finally {

      setDeletingAccount(false)

    }

  }


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <div className="settings-page">

        <div className="container">

          <div className="settings-section">

            <div className="settings-section-header">

              <h2>
                Loading Settings...
              </h2>

              <p>
                Please wait while we load your profile.
              </p>

            </div>

          </div>

        </div>

      </div>

    )

  }


  return (

    <div className="settings-page">

      <div className="container">


        {/* =========================
            HEADER
        ========================== */}

        <div className="settings-header">

          <span>
            ACCOUNT
          </span>

          <h1>
            Settings
          </h1>

          <p>
            Manage your profile, security and preferences.
          </p>

        </div>


        {/* =========================
            SETTINGS TABS
        ========================== */}

        <div className="settings-menu">

          <button
            className={`settings-menu-item ${
              activeTab === 'profile'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setActiveTab('profile')
            }
          >

            <FiUser />

            <span>
              Profile
            </span>

          </button>


          <button
            className={`settings-menu-item ${
              activeTab === 'password'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setActiveTab('password')
            }
          >

            <FiLock />

            <span>
              Password
            </span>

          </button>


          <button
            className={`settings-menu-item ${
              activeTab === 'notifications'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setActiveTab('notifications')
            }
          >

            <FiBell />

            <span>
              Notifications
            </span>

          </button>


          <button
            className={`settings-menu-item ${
              activeTab === 'privacy'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setActiveTab('privacy')
            }
          >

            <FiShield />

            <span>
              Privacy & Security
            </span>

          </button>

        </div>


        {/* =========================
            CONTENT
        ========================== */}

        <div className="settings-content">


          {/* =================================
              PROFILE
          ================================= */}

          {activeTab === 'profile' && (

            <div className="settings-section">

              <div className="settings-section-header">

                <h2>
                  Profile Information
                </h2>

                <p>
                  Update your personal information.
                </p>

              </div>


              <div className="settings-avatar-area">

                <div className="settings-avatar">

                  {fullName
                    ?.charAt(0)
                    ?.toUpperCase() || 'A'}

                </div>

                <div>

                  <h3>
                    Profile Photo
                  </h3>

                  <button
                    className="change-photo-btn"
                    type="button"
                    onClick={() =>
                      Swal.fire({
                        icon: 'info',
                        title: 'Coming Soon',
                        text:
                          'Profile photo upload will be added soon.'
                      })
                    }
                  >

                    Change Photo

                  </button>

                </div>

              </div>


              <div className="settings-form-grid">


                <div className="settings-form-group">

                  <label className="settings-label">
                    Full Name
                  </label>

                  <input
                    className="settings-input"
                    type="text"
                    placeholder="Your name"
                    value={fullName}
                    onChange={(e) =>
                      setFullName(e.target.value)
                    }
                  />

                </div>


                <div className="settings-form-group">

                  <label className="settings-label">
                    Username
                  </label>

                  <input
                    className="settings-input"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                  />

                  <small
                    style={{
                      display: 'block',
                      marginTop: '6px',
                      fontSize: '12px',
                      color: '#888'
                    }}
                  >

                    Username is currently for display only.

                  </small>

                </div>


                <div className="settings-form-group full-width">

                  <label className="settings-label">
                    Email Address
                  </label>

                  <div className="settings-input-wrapper">

                    <FiMail />

                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                    />

                  </div>

                </div>


                <div className="settings-form-group full-width">

                  <label className="settings-label">
                    About You
                  </label>

                  <textarea
                    className="settings-textarea"
                    rows="5"
                    placeholder="Tell the community something about yourself..."
                    value={about}
                    onChange={(e) =>
                      setAbout(e.target.value)
                    }
                  ></textarea>

                </div>


                <div className="settings-form-group full-width">

                  <label className="settings-label">
                    Skills
                  </label>

                  <input
                    className="settings-input"
                    type="text"
                    placeholder="React.js, JavaScript, HTML..."
                    value={skills}
                    onChange={(e) =>
                      setSkills(e.target.value)
                    }
                  />

                </div>


              </div>


              <button
                className="save-settings-btn"
                onClick={handleSaveProfile}
                disabled={saving}
              >

                <FiSave />

                {saving
                  ? 'Saving...'
                  : 'Save Changes'
                }

              </button>

            </div>

          )}


          {/* =================================
              PASSWORD
          ================================= */}

          {activeTab === 'password' && (

            <div className="settings-section">

              <div className="settings-section-header">

                <h2>
                  Password & Security
                </h2>

                <p>
                  Keep your account secure with a strong password.
                </p>

              </div>


              <div className="password-input-wrapper">

                <input
                  type={
                    showCurrentPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword(
                      !showCurrentPassword
                    )
                  }
                >

                  {showCurrentPassword
                    ? <FiEye />
                    : <FiEyeOff />
                  }

                </button>

              </div>


              <div className="password-input-wrapper">

                <input
                  type={
                    showNewPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(
                      !showNewPassword
                    )
                  }
                >

                  {showNewPassword
                    ? <FiEye />
                    : <FiEyeOff />
                  }

                </button>

              </div>


              <div className="password-input-wrapper">

                <input
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >

                  {showConfirmPassword
                    ? <FiEye />
                    : <FiEyeOff />
                  }

                </button>

              </div>


              <button
                className="save-settings-btn"
                onClick={handleChangePassword}
                disabled={changingPassword}
              >

                <FiLock />

                {changingPassword
                  ? 'Updating...'
                  : 'Update Password'
                }

              </button>

            </div>

          )}


          {/* =================================
              NOTIFICATIONS
          ================================= */}

          {activeTab === 'notifications' && (

            <div className="settings-section">

              <div className="settings-section-header">

                <h2>
                  Notification Preferences
                </h2>

                <p>
                  Choose what notifications you want to receive.
                </p>

              </div>


              {loadingNotifications ? (

                <p>
                  Loading notification preferences...
                </p>

              ) : (

                <>


                  <div className="preference-row">

                    <div>

                      <h3>
                        Exchange Requests
                      </h3>

                      <p>
                        Get notified when someone sends you a request.
                      </p>

                    </div>


                    <label className="toggle">

                      <input
                        type="checkbox"
                        checked={
                          notificationSettings.exchangeRequests
                        }
                        onChange={() =>
                          handleNotificationChange(
                            'exchangeRequests'
                          )
                        }
                      />

                      <span></span>

                    </label>

                  </div>


                  <div className="preference-row">

                    <div>

                      <h3>
                        Messages
                      </h3>

                      <p>
                        Get notified when someone sends you a message.
                      </p>

                    </div>


                    <label className="toggle">

                      <input
                        type="checkbox"
                        checked={
                          notificationSettings.messages
                        }
                        onChange={() =>
                          handleNotificationChange(
                            'messages'
                          )
                        }
                      />

                      <span></span>

                    </label>

                  </div>


                  <div className="preference-row">

                    <div>

                      <h3>
                        Ratings & Reviews
                      </h3>

                      <p>
                        Get notified about new ratings and reviews.
                      </p>

                    </div>


                    <label className="toggle">

                      <input
                        type="checkbox"
                        checked={
                          notificationSettings.reviews
                        }
                        onChange={() =>
                          handleNotificationChange(
                            'reviews'
                          )
                        }
                      />

                      <span></span>

                    </label>

                  </div>


                  <div className="preference-row">

                    <div>

                      <h3>
                        Email Notifications
                      </h3>

                      <p>
                        Receive important updates through email.
                      </p>

                    </div>


                    <label className="toggle">

                      <input
                        type="checkbox"
                        checked={
                          notificationSettings.emailNotifications
                        }
                        onChange={() =>
                          handleNotificationChange(
                            'emailNotifications'
                          )
                        }
                      />

                      <span></span>

                    </label>

                  </div>


                  <button
                    className="save-settings-btn"
                    onClick={handleSaveNotifications}
                    disabled={savingNotifications}
                  >

                    <FiSave />

                    {savingNotifications
                      ? 'Saving...'
                      : 'Save Preferences'
                    }

                  </button>


                </>

              )}

            </div>

          )}


          {/* =================================
              PRIVACY & SECURITY
          ================================= */}

          {activeTab === 'privacy' && (

            <div className="settings-section">

              <div className="settings-section-header">

                <h2>
                  Privacy & Security
                </h2>

                <p>
                  Control your privacy and account security settings.
                </p>

              </div>


              {loadingPrivacy ? (

                <p>
                  Loading privacy settings...
                </p>

              ) : (

                <>


                  <div className="preference-row">

                    <div>

                      <h3>
                        Profile Visibility
                      </h3>

                      <p>
                        Allow other users to discover your profile.
                      </p>

                    </div>


                    <label className="toggle">

                      <input
                        type="checkbox"
                        checked={
                          privacySettings.profileVisibility
                        }
                        onChange={() =>
                          handlePrivacyChange(
                            'profileVisibility'
                          )
                        }
                      />

                      <span></span>

                    </label>

                  </div>


                  <div className="preference-row">

                    <div>

                      <h3>
                        Show Online Status
                      </h3>

                      <p>
                        Let other users know when you are online.
                      </p>

                    </div>


                    <label className="toggle">

                      <input
                        type="checkbox"
                        checked={
                          privacySettings.showOnlineStatus
                        }
                        onChange={() =>
                          handlePrivacyChange(
                            'showOnlineStatus'
                          )
                        }
                      />

                      <span></span>

                    </label>

                  </div>


                  <div className="preference-row">

                    <div>

                      <h3>
                        Login Alerts
                      </h3>

                      <p>
                        Get notified about new login activity.
                      </p>

                    </div>


                    <label className="toggle">

                      <input
                        type="checkbox"
                        checked={
                          privacySettings.loginAlerts
                        }
                        onChange={() =>
                          handlePrivacyChange(
                            'loginAlerts'
                          )
                        }
                      />

                      <span></span>

                    </label>

                  </div>


                  <button
                    className="save-settings-btn"
                    onClick={handleSavePrivacy}
                    disabled={savingPrivacy}
                  >

                    <FiSave />

                    {savingPrivacy
                      ? 'Saving...'
                      : 'Save Privacy Settings'
                    }

                  </button>


                  {/* =========================
                      DANGER ZONE
                  ========================= */}

                  <div className="danger-zone">

                    <div>

                      <h2>
                        Delete Account
                      </h2>

                      <p>
                        Permanently delete your SkillSwap account
                        and all associated data.
                      </p>

                    </div>


                    <button
                      onClick={handleDeleteAccount}
                      disabled={deletingAccount}
                    >

                      <FiTrash2 />

                      {deletingAccount
                        ? 'Deleting...'
                        : 'Delete Account'
                      }

                    </button>

                  </div>


                </>

              )}

            </div>

          )}

        </div>

      </div>

    </div>

  )

}


export default Settings