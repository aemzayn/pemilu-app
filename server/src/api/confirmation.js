const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { auth } = require('../middlewares')
const User = require('../models/User')
const transporter = require('../transporter')
const emailSecret = process.env.EMAIL_SECRET

router.post('/confirm/:token', (req, res) => {
  try {
    jwt.verify(req.params.token, emailSecret, async (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(400).json({ msg: 'Link sudah kadaluwarsa' })
        }

        return res.status(400).json({ msg: 'Link tidak valid' })
      }

      const { id } = decoded.user
      const user = await User.findById(id)
      if (!user) {
        return res.status(404).json({ msg: 'Link tidak valid' })
      }

      user.confirmed = true
      user.save()

      res.json({ msg: 'Berhasil mengkonfirmasi user' })
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'Server error' })
  }
})

router.post('/resend-token', auth, async (req, res) => {
  const { id } = req.user

  try {
    const user = await User.findById(id)

    if (!user) {
      res.status(404).json({ msg: 'User tidak ditemukan' })
    }

    if (user.confirmed) {
      return res.json({ msg: 'User sudah dikonfirmasi' })
    }

    const payload = {
      user: {
        id: user.id,
      },
    }

    jwt.sign(payload, emailSecret, { expiresIn: '1d' }, (err, emailToken) => {
      if (err) throw err

      const url = `https://pemilu-ppiturki.herokuapp.com/confirm-user?token=${emailToken}`
      transporter.sendMail(
        {
          to: user.email,
          subject: 'Konfirmasi email Pemilu PPI Turki 2020',
          html: `<div style='width: 100%; height: 450px; display: flex; align-items: center; justify-content: center; background-color: #f6f6f6; box-sizing: border-box;'>
          <div style='width: 400px; min-width: 90%; height: 400px; padding: 20px 50px; background-color: white; border-radius: 2px; box-sizing: border-box;'>
            <p>Hai ${user.name},</p>
            <p>Konfirmasi emailmu untuk dapat berpartisipasi dalam Pemilu PPI Turki 2020 dengan meng-klik tombol dibawah ini.</p>
            <a href="${url}" style='dispay: block; width: 100%; text-align: center; padding: 10px; color: white; border-radius: 2px; text-decoration: none; background-color: #17a2b8; box-sizing: border-box; margin-top: 20px; margin-bottom: 20px;'>Konfirmasi email</a>
            <p>Terima kasih!</p>
          </div>
        </div>`,
        },
        err => err && console.log(err)
      )

      res.json({ msg: 'Email konfirmasi sudah dikirm' })
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'Server error' })
  }
})

module.exports = router
