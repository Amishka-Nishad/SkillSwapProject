import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'


import authRoutes from './routes/authRoutes.js'
import skillRoutes from './routes/skillRoutes.js'
import exchangeRequestRoutes from './routes/exchangeRequestRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import accountRoutes from './routes/accountRoutes.js'


dotenv.config()


const app = express()


app.use(cors())

app.use(express.json())


connectDB()


// =================================
// API ROUTES
// =================================

app.use(
  '/api/auth',
  authRoutes
)


app.use(
  '/api/skills',
  skillRoutes
)


app.use(
  '/api/exchange-requests',
  exchangeRequestRoutes
)


app.use(
  '/api/messages',
  messageRoutes
)


app.use(
  '/api/notifications',
  notificationRoutes
)


app.use(
  '/api/dashboard',
  dashboardRoutes
)


app.use(
  '/api/reviews',
  reviewRoutes
)


app.use(
  '/api/account',
  accountRoutes
)


// =================================
// HOME
// =================================

app.get('/', (req, res) => {

  res.send(
    'SkillSwap Backend is Running'
  )

})


// =================================
// SERVER
// =================================

const PORT = 5000


app.listen(
  PORT,
  () => {

    console.log(
      `Server running on port ${PORT}`
    )

  }
)