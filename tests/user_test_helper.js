const User = require('../models/user')

const initialUsers = [
  {
    username: 'testuser1',
    name: 'testname1',
    passwordHash: 'testhash1',
    blogs: []
    },
  {
    username: 'testuser2',
    name: 'testname2',
    passwordHash: 'testhash2',
    blogs: []
  },
]

const nonExistingId = async () => {
  const user = new User({ username: 'willremovethissoon', password: 'willremovethissoon' , name: 'willremovethissoon' })
  await user.save()
  await user.deleteOne()

  return user._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}


module.exports = {initialUsers, nonExistingId, usersInDb}