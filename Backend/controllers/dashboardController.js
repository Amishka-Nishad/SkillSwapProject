import ExchangeRequest from '../models/ExchangeRequest.js'

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id

    const [pendingRequests, receivedAccepted, sentAccepted] =
      await Promise.all([
        ExchangeRequest.countDocuments({
          receiver: userId,
          status: 'Pending'
        }),

        ExchangeRequest.countDocuments({
          receiver: userId,
          status: 'Accepted'
        }),

        ExchangeRequest.countDocuments({
          sender: userId,
          status: 'Accepted'
        })
      ])

    const matches = receivedAccepted + sentAccepted

    const activeExchanges = matches

    res.status(200).json({
      requests: pendingRequests,
      matches,
      activeExchanges
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)

    res.status(500).json({
      message: 'Failed to fetch dashboard stats'
    })
  }
}