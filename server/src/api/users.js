const router = require('express').Router()
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const sendMail = require('../transporter')
const { auth } = require('../middlewares')
const emailSecret = process.env.EMAIL_SECRET
const tokenSecret = process.env.TOKEN_SECRET

// @Desc    Get user
// @Route   GET /api/users
// @Access  Private
router.get('/', auth, async (req, res) => {
  try {
    await User.findById(req.user.id)
      .select('-password')
      .populate('selection.selectedCandidate', ['name'])
      .populate('selection.electionId', ['name'])
      .exec((err, user) => {
        if (err) console.error(err)
        res.json({ msg: 'Sukses', user })
      })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ msg: 'Server Error' })
  }
})

// @Desc    Login
// @Route   POST /api/users/login
// @Access  Public
router.post(
  '/login',
  [check('email').isEmail(), check('password').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log(errors.array())
      return res.status(200).json({ msg: 'Email atau password salah' })
    }

    const { email, password } = req.body

    try {
      let user = await User.findOne({ email })
      if (!user) {
        return res.status(200).json({ msg: 'Email atau password salah' })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(200).json({ msg: 'Email atau password salah' })
      }

      const payload = {
        user: {
          id: user.id,
        },
      }

      jwt.sign(payload, tokenSecret, { expiresIn: '1d' }, (err, token) => {
        if (err) throw err
        res.json({ msg: 'Login sukses', token })
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ msg: 'Server error' })
    }
  }
)

// @Desc    Create a new user / register user
// @Route   POST /api/users
// @Access  Public
router.post(
  '/register',
  [
    check('email', 'Email is required').isEmail(),
    check('name', 'Name is required').not().isEmpty(),
    check('ppi', 'PPI Daerah is required').not().isEmpty(),
    check('password', 'Password should not be empty').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log(errors.array())
      return res.status(200).json({ msg: 'Data tidak valid' })
    }

    const { name, email, password, ppi, isAdmin } = req.body

    try {
      let user = await User.findOne({ email })

      if (user) {
        console.log('User already exist')
        return res.status(200).json({
          msg: 'Akun sudah terdaftar',
        })
      }

      const hashedPassword = await bcrypt.hash(password, 12)

      user = new User({
        name,
        ppi,
        email,
        password: hashedPassword,
        isAdmin,
        selection: [],
      })

      await user.save()

      const payload = {
        user: {
          id: user.id,
        },
      }

      // Sign token for confirmation email

      // jwt.sign(payload, emailSecret, { expiresIn: '1h' }, (err, emailToken) => {
      //   if (err) throw err

      //   const url = `/confirm-user?token=${emailToken}`
      //   sendMail(
      //     'Aktifasi Akun Pemilu PPI Turki 2020',
      //     'Silahkan klik tautan di bawah ini untuk mengaktifkan akunmu',
      //     'Submit',
      //     user.email,
      //     user.name,
      //     url
      //   )
      // })

      // Sign token for authentication
      jwt.sign(
        payload,
        tokenSecret,
        { expiresIn: '1d' },
        (error, userToken) => {
          if (error) throw error
          console.log(error)
          res.json({ msg: 'Register sukses', token: userToken })
        }
      )
    } catch (error) {
      console.error(error)
      res.status(500).json('Server error')
    }
  }
)

// @Desc    Send reset password email
// @Route   GET /api/users/reset-password/
// @Access  Public
router.post(
  '/reset-password',
  check('email', 'Email is required').isEmail(),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log(errors.array())
      return res.status(400).json({ errors: errors.array() })
    }

    const { email } = req.body
    try {
      const user = await User.findOne({ email })

      if (!user) {
        return res.status(200).json({ msg: 'No user with this email' })
      }

      const payload = {
        user: {
          id: user.id,
        },
      }

      jwt.sign(
        payload,
        emailSecret,
        { expiresIn: '15d' },
        (err, emailToken) => {
          if (err) throw err

          const url = `/reset-password/${emailToken}`

          sendMail(
            'Reset Password',
            'Klik link di bawah ini untuk mereset password',
            'Reset password',
            user.email,
            user.name,
            url
          )
        }
      )

      res.json({ msg: 'Reset password email terkirim' })
    } catch (error) {
      console.log(error)
      res.json({ msg: 'Server error' })
    }
  }
)

// @Desc    Change user password
// @Route   POST /api/users/
// @Access  Public
router.post(
  '/change-password',
  [
    check('password', 'New password is required').exists(),
    check('jwtToken', 'jwtToken is required').exists(),
  ],
  async (req, res) => {
    console.log(req.body)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log(errors.array())
      return res.status(400).json({ errors: errors.array() })
    }

    const { password, jwtToken } = req.body

    try {
      jwt.verify(jwtToken, emailSecret, async (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            console.log('JWT Token expired')
            return res.status(400).json({ msg: 'Link kadaluarsa' })
          }

          console.log('Invalid token')
          return res.status(400).json({ msg: 'Link tidak valid' })
        }

        const { id } = decoded.user

        const user = await User.findById(id)

        if (!user) {
          return res.status(404).json({
            msg: 'User tidak ditemukan',
          })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        user.password = hashedPassword

        await user.save()

        res.json({
          msg: 'Sukses mengganti password',
        })
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ msg: 'Server error' })
    }
  }
)

// @Desc    TEST set all users hasVoted to false
// @Route   POST /api/users/setHasVotedToValse
// @Access  Public
router.post('/setHasVotedToFalse', async (req, res) => {
  try {
    const users = User.updateMany({ hasVoted: true }, function (err, u) {
      if (err) {
        console.log(err)
      }
      u.hasVoted = false
      u.selection = {}
    })
    res.json({ users, msg: 'Sukses' })
  } catch (error) {
    console.log(error)
    res.json({ msg: 'Server error' })
  }
})

module.exports = router
