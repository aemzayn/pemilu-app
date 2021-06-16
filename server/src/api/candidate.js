const router = require('express').Router()
const Candidate = require('../models/Candidate')
const { auth, isAdmin } = require('../middlewares')
const { check, validationResult } = require('express-validator')

// @DESC    Get all candidates
// @Route   GET /api/candidates
// @Access  Admin
router.get('/', [auth, isAdmin], async (req, res) => {
  try {
    const candidates = await Candidate.find()
    res.json({ msg: 'Berhasil mendapatkan daftar kandidat', candidates })
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'Server error' })
  }
})

// @DESC    Create a candidate
// @Route   POST /api/candidates/
// @Access  Admin
router.post(
  '/',
  [auth, isAdmin, [check('name', 'Candidate name is required').exists()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log(errors.array())
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, description, cvUrl, image } = req.body
    try {
      let candidate = new Candidate({
        name,
        description,
        cvUrl,
        image,
      })

      await candidate.save()
      res.json({ msg: 'Berhasil menambah kandidat', candidate })
    } catch (error) {
      console.log(error)
      res.status(500).json({ msg: 'Server error' })
    }

    // res.json({ fileName: file.name, filePath: `/uploads/${file.name}` })
  }
)

// @DESC    Remove a candidate
// @Route   DELETE /api/candidates/remove/:id
// @Access  Admin
router.delete('/:candidateId', [auth, isAdmin], async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.candidateId)
    res.json({ msg: 'Berhasil menghapus kandidat' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'Server error' })
  }
})

module.exports = router
