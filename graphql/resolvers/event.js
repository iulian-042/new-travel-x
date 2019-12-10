const Event = require('../../models/event')
const User = require('../../models/user')
const { transformEvent } = require('./utils')

module.exports = {
  
  events: async () => {
    try {
      const dbEvents = await Event.find()
      return dbEvents.map(event => transformEvent(event))
    } catch(err) {
      console.log(err)
      throw err
    }
  },
 createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }
    const event = new Event({
      ...args.eventInput,
      date: new Date(args.eventInput.date),
      creator: req.userId 
    })
    try {
      const savedEvent = await event.save()
      const user = await User.findById(req.userId)
      if (!user) {
        throw new Error('User Doesnt exist')
      }
      user.createdEvents.push(savedEvent._id)
      user.save()
      return transformEvent(savedEvent)
    } catch(error) {
      console.log(error)
      throw error
    }
  },
}