const jwt = require('jsonwebtoken')
const User = require('./models/User')
const tokenSecret = process.env.TOKEN_SECRET

function auth(req, res, next) {
  const token = req.header('auth-token')
  if (!token)
    return res.status(401).json({
      message: 'No token, authorization denied',
    })

  try {
    jwt.verify(token, tokenSecret, async (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: 'Auth token is not valid' })
      } else {
        req.user = decoded.user

        const user = await User.findById(decoded.user.id)
        req.isAdmin = user.isAdmin
        next()
      }
    })
  } catch (error) {
    console.error('something wrong with auth middleware')
    res.status(500).json({
      msg: 'Server error',
    })
  }
}

// isAdmin middleware should be used
// after auth middleware
function isAdmin(req, res, next) {
  const isAdmin = req.isAdmin

  if (!isAdmin) {
    console.log('Not admin, authorization denied')
    return res.status(401).json({
      message: 'Not admin, authorization denied',
    })
  }

  if (isAdmin) {
    next()
  }
}

module.exports = { auth, isAdmin }
