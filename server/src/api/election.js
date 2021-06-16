const router = require('express').Router()
const { check, validationResult } = require('express-validator')
const { auth, isAdmin } = require('../middlewares')
const Election = require('../models/Election')
const User = require('../models/User')
const Candidate = require('../models/Candidate')
const regions = require('../regions')
const scheduler = require('../schedule')

// @DESC    Get all election
// @Route   GET /api/elections
// @Access  Admin
router.get('/', auth, async (req, res) => {
  try {
    await Election.find({})
      .populate('candidates.candidateId')
      .exec(function (err, elections) {
        if (err) console.log(err)
        res.send({ elections, msg: 'Sukses' })
      })
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'Server error' })
  }
})

// @DESC    Get user elections
// @Route   GET /api/elections
// @Access  Admin
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (user.hasVoted) {
      return res.json({ msg: 'Kamu sudah menggunakan hak pilih mu' })
    }

    await Election.find()
      .populate('candidates.candidateId')
      .exec(function (err, elections) {
        const filterElections = elections
          .filter(
            ({ _id: id1 }) =>
              !user.selection.some(
                ({ electionId: id2 }) => id2.toString() === id1.toString()
              )
          )
          .filter(election => election.hasEnded !== true)
        res.json({ elections: filterElections, msg: 'Sukses' })
      })
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'Server error' })
  }
})

// @DESC    Create election
// @Route   POST /api/election/create
// @Access  Admin
router.post(
  '/',
  [
    auth,
    isAdmin,
    [
      check('name', 'Election name is required').exists(),
      check('startDate', 'Election start date is required').exists(),
      check('endDate', 'Election end date is required').exists(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log(errors.array())
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, description, startDate, endDate } = req.body

    try {
      const newElection = new Election({
        name,
        description,
        startDate,
        endDate,
        totalVotes: 0,
      })

      await newElection.save()
      scheduler()

      res.json({ election: newElection })
    } catch (error) {
      console.log(error)
      res.status(500).json({ msg: 'Server error' })
    }
  }
)

// @DESC    Update/edit an election
// @Route   PUT /api/election/e/:id
// @Access  Admin
router.put(
  '/:electionId',
  [
    auth,
    isAdmin,
    [
      check('name', 'Election name is required').not().isEmpty(),
      check('startDate', 'Start Date is required').exists(),
      check('endDate', 'End Date is required').exists(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log(errors.array())
      return res.status(400).json({ errors: errors.array() })
    }

    const { electionId } = req.params

    const { name, description, startDate, endDate } = req.body
    try {
      const query = { _id: electionId }
      const updatedElection = await Election.findOneAndUpdate(
        query,
        {
          name,
          description,
          startDate,
          endDate,
        },
        {
          new: true,
        }
      )
      scheduler()

      res.json({
        election: updatedElection,
        msg: 'Berhasil menyunting pemilu',
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ msg: 'Server error' })
    }
  }
)

// @DESC    Get election by id
// @Route   GET /api/election/:id
// @Access  Admin
router.get('/:electionId', auth, async (req, res) => {
  const { electionId } = req.params
  try {
    await Election.findById(electionId)
      .populate('candidates.candidateId')
      .exec(function (err, election) {
        if (err) console.log(err)
        if (!election) {
          return res.status(404).json({ msg: 'Pemilu tidak ditemukan' })
        }
        res.json({ election, msg: 'Sukses' })
      })
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'Server error' })
  }
})

// @DESC    Delete an election
// @Route   Delete /api/election/e/:id
// @Access  Admin
router.delete('/:electionId', [auth, isAdmin], async (req, res) => {
  const { electionId } = req.params
  try {
    const election = await Election.findById(electionId)
    if (!election) {
      console.log('Election not found')
      return res.status(404).json({ msg: 'Pemilu tidak ditemukan' })
    }

    await User.updateMany({ hasVoted: true }, { hasVoted: false })
    await election.remove()
    res.json({ msg: 'Berhasil menghapus pemilu' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'Server error' })
  }
})

// @DESC    Make a vote
// @Route   POST /api/election/:electionId
// @Access  Admin
router.post('/:electionId', auth, async (req, res) => {
  const { candidateId } = req.body
  const { electionId } = req.params

  try {
    const election = await Election.findById(electionId)
    if (!election) {
      console.log('No election')
      return res.status(400).json({ msg: 'Pemilu tidak ditemukan' })
    }

    if (!election.hasStarted) {
      return res.status(400).json({ msg: 'Pemilu belum dimulai' })
    }

    if (election.hasEnded) {
      return res.status(400).json({ msg: 'Pemilu sudah berakhir' })
    }

    const user = await User.findById(req.user.id)

    if (user.hasVoted) {
      return res.status(400).json({ msg: 'Kamu sudah memilih' })
    }

    // Check if user already voted
    if (
      user.selection.filter(
        selection => selection.electionId.toString() === election._id
      ).length > 0
    ) {
      return res.json({ msg: 'Kamu sudah memilih' })
    }

    const userRegion = regions.filter(region => region.fullName === user.ppi)[0]
      .name

    user.hasVoted = true

    election.totalVotes++
    election.candidates[+candidateId - 1].totalVotes++
    election.candidates[+candidateId - 1].votesPerRegion[userRegion]++

    const voter = {
      name: user.name,
      ppi: user.ppi,
    }

    election.candidates[+candidateId - 1].voters.push(voter)

    const userSelection = {
      electionId: election._id,
      selectedCandidate: election.candidates[+candidateId - 1].candidateId._id,
    }

    user.selection.unshift(userSelection)

    const filteredElections = (await Election.find()).filter(
      election => election._id !== electionId
    )

    await election.save()
    await user.save()
    res.json({
      elections: filteredElections,
      msg: 'Berhasil memilih',
      election: election.name,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Server error' })
  }
})

// @DESC    Add candidate to election
// @Route   POST /api/elections/:electionId/candidates
// @Access  Admin
router.post(
  '/:electionId/candidates',
  [auth, isAdmin, [check('candidateId', 'Candidate Id is required').exists()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log(errors.array())
      return res.status(400).json({ errors: errors.array() })
    }

    const { electionId } = req.params
    try {
      const election = await Election.findById(electionId)
      if (!election) {
        return res.status(404).json({ msg: 'Pemilu tidak ditemukan' })
      }

      if (
        election.candidates.some(
          ({ candidateId: { _id: id } }) =>
            id.toString() === req.body.candidateId
        )
      ) {
        return res.status(400).json({ msg: 'Kandidat sudah ada di pemilu' })
      }

      const candidate = await Candidate.findById(req.body.candidateId)
      if (!candidate) {
        return res.status(404).json({ msg: 'Kandidat tidak ditemukan' })
      }

      const newCandidate = {
        totalVotes: 0,
        candidateId: candidate._id,
        votesPerRegion: {
          Ankara: 0,
          Bandirma: 0,
          Bursa: 0,
          Isparta: 0,
          Istanbul: 0,
          Izmir: 0,
          Kastamonu: 0,
          Kayseri: 0,
          Kirklareli: 0,
          Konya: 0,
          Sakarya: 0,
          Samsun: 0,
          Trabzon: 0,
        },
      }

      election.candidates.push(newCandidate)
      await election.save()

      await Election.find()
        .populate('candidates.candidateId')
        .exec(function (err, elections) {
          res.json({ elections, msg: 'Sukses menambah kandidat' })
        })
    } catch (error) {
      console.error(error)
      res.status(505).json({ msg: 'Server error' })
    }
  }
)

// @DESC    Remvove candidate from election
// @Route   DELETE /api/elections/:electionId/candidates/:candidateId
// @Access  Admin
router.delete(
  '/:electionId/candidates/:candidateId',
  [auth, isAdmin],
  async (req, res) => {
    const { electionId, candidateId } = req.params
    try {
      const election = await Election.findById(electionId)
      if (!election) {
        return res.status(404).json({ msg: 'Pemilu tidak ditemukan' })
      }

      const candidate = await Candidate.findById(candidateId)
      if (!candidate) {
        return res.status(400).json({ msg: 'Kandidat tidak ditemukan' })
      }

      election.candidates = election.candidates.filter(
        candidate => candidate.candidateId._id.toString() !== candidateId
      )
      election.save()

      await Election.find()
      res.json({ election, msg: 'Berhasil menghapus kandidat' })
    } catch (error) {
      console.error(error)
      res.status(505).json({ msg: 'Server error' })
    }
  }
)

// @DESC    End election
// @Route   POST /api/elections/:electionId/end
// @Access  Admin
router.post('/:electionId/end', [auth, isAdmin], async (req, res) => {
  const { electionId } = req.params
  try {
    await Election.findByIdAndUpdate(
      { _id: electionId },
      {
        hasEnded: true,
        hasStarted: true,
      }
    )

    const elections = await Election.find()

    res.json({ elections, msg: 'Berhasil menakhiri pemilu' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'Server error' })
  }
})

// @DESC    Delete a vote
// @Route   DELETE /api/elections/:electionId/vote
// @Access  Admin
router.put(
  '/:electionId/vote',
  [
    auth,
    isAdmin,
    [
      check('id', 'Voter id is required').exists(),
      check('name', 'Voter name is required').exists(),
      check('ppi', 'Voter ppi is required').exists(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log(errors.array())
      return res.status(400).json({ errors: errors.array() })
    }

    const { electionId } = req.params
    const { name, ppi, id: voterId } = req.body

    try {
      const election = await Election.findById(electionId).populate(
        'candidates.candidateId'
      )

      if (!election) {
        return res.status(400).json({ msg: 'Election not found' })
      }

      const user = await User.findOne({ name, ppi })
        .populate('selection.electionId', ['name'])
        .populate('selection.selectedCandidate', ['name'])

      if (!user) {
        return res.status(400).json({ msg: 'User not found' })
      }

      // check if user has voted
      const userHasVoted =
        user.selection.filter(
          s =>
            s.electionId &&
            s.electionId._id.toString() === election._id.toString()
        ).length !== 0

      if (!userHasVoted) {
        return res.status(400).json({ msg: 'User tidak/belum memilih' })
      }

      const candidate = user.selection
        .filter(s => s.electionId !== null && s.selectedCandidate !== null)
        .filter(s => s.electionId._id.toString() === election._id.toString())[0]
        .selectedCandidate.name

      // Dapatkan nomor urut kandidat
      let noUrut
      for (let i = 0; i < election.candidates.length; i++) {
        if (election.candidates[i].candidateId.name === candidate) {
          noUrut = i
          break
        }
      }

      const wilayah = user.ppi.split(' ')[1]

      // Kurangin vote
      election.totalVotes--
      election.candidates[noUrut].totalVotes--
      election.candidates[noUrut].votesPerRegion[wilayah]--

      // hapus selection dari user
      user.selection = user.selection.filter(
        s =>
          s.electionId !== null &&
          s.electionId._id.toString() !== election._id.toString()
      )

      // keluarkan user dari list voters
      election.candidates[noUrut].voters = election.candidates[
        noUrut
      ].voters.filter(voter => voter._id.toString() !== voterId.toString())

      await user.save()
      await election.save()

      res.json({
        msg: 'Berhasil menghapus suara',
        election: election,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ msg: 'Server error' })
    }
  }
)

module.exports = router
