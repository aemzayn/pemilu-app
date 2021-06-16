const schedule = require('node-schedule')
const Election = require('./models/Election')

module.exports = async () => {
  try {
    const elections = await Election.find()

    elections.forEach(election => {
      console.log(`Scheduler set up for ${election.name}`)
      let startDate = new Date(election.startDate)
      let endDate = new Date(election.endDate)

      schedule.scheduleJob(startDate, function (a) {
        console.log(a)
        election.hasStarted = true
        election.save()
      })

      schedule.scheduleJob(endDate, function (b) {
        console.log(b)
        election.hasEnded = true
        election.save()
      })
    })
  } catch (error) {
    console.log(error)
  }
}
