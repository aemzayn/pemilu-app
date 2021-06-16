const router = require('express').Router()
const admin = require('./admin')
const users = require('./users')
const candidate = require('./candidate')
const election = require('./election')
const confirmation = require('./confirmation')

router.use('/admin', admin)
router.use('/users/', users)
router.use('/candidates', candidate)
router.use('/elections', election)
router.use('/confirmation', confirmation)

module.exports = router
