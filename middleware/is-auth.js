const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    req.isAuth = false
    return next()
  }
  
  const token = authHeader.split(' ')[1]
  if (!token) {
    req.isAuth = false
    return next()
  }
  try {
    const decodedToken = jwt.verify(token, 'some-super-secret-key')
    if (!decodedToken) {
      req.isAuth = false
      return next()
    }
    req.isAuth = true
    req.userId = decodedToken.userId
    req.email = decodedToken.email
    next()
  } catch (err) {
    req.isAuth = false
    return next()
  }
}