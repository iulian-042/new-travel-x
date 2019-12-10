const bcrypt = require('bcryptjs')
const User = require('../../models/user')
const jwt = require('jsonwebtoken')
const { transformUser } = require('./utils')

module.exports = {
  createUser: async args => {
    const previousUser = await User.findOne({ email: args.userInput.email })
    if (previousUser) {
      
      throw new Error('User Exists Alredy')
    } else {
      try {
        const hash = await bcrypt.hash(args.userInput.password, 12)
        const user = new User({
          email: args.userInput.email,
          password: hash
        })
        const savedUser = await user.save()
        return transformUser(savedUser)
      } catch (error) {
        console.error(error)
        throw error
      }
    }
  },
  login: async ({email, password }) => {
    const user = await User.findOne({ email })
    if (!user) {
      throw new Error('User does not exist!')
    }
    const isEqual = await bcrypt.compare(password, user.password)
    if (!isEqual) {
      throw new Error('Password is incorrect!')
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, 'some-super-secret-key', {
      expiresIn: '1h'
    })
    return { userId: user.id, token, tokenExpiration: 1 }
  },
}