const router = require('express').Router()
const { auth, isAdmin } = require('../middlewares')
const User = require('../models/User')
const Election = require('../models/Election')

// @desc    Get All users
// @route   GET /api/admin/users
// @access  Admin
router.get('/users', [auth, isAdmin], async (req, res) => {
  try {
    await User.find()
      .select('-password')
      .populate('selection.electionId', ['name'])
      .populate('selection.selectedCandidate', ['name'])
      .sort({ ppi: 'asc' })
      .exec(function (err, users) {
        if (err) console.log(err)
        res.json({ msg: 'Berhasil mendapatkan list pengguna', users })
      })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ msg: 'Server error' })
  }
})

// @desc    Delete a user
// @route   DELETE /api/admin/users/:user_id
// @access  Admin
router.delete('/users/:user_email', [auth, isAdmin], async (req, res) => {
  const { user_email: email } = req.params
  try {
    await User.findOneAndDelete({ email })
    res.json({ msg: 'Berhasil menghapus pengguna' })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ msg: 'Server error' })
  }
})

module.exports = router
