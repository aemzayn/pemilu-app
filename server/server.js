const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const scheduler = require('./src/schedule')

const app = express()
const mongoUri = process.env.MONGO_URI

app.use(morgan('dev'))
app.use(helmet())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
if ((process.env.NODE_ENV = 'development')) {
  app.use(cors({ origin: `http://localhost:3000` }))
}

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Connected to db')
  })
  .catch(err => {
    console.log('DB CONNECTION ERROR', err)
  })

scheduler()

// middlewares
const api = require('./src/api')
app.use('/api', api)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Listening: ${port}`)
})
