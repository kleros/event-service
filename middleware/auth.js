// Basic auth
const authenticateRequest = (req, res, next) => {
  const password = req.get('Authorization')
  if (password === process.env.API_PASSWORD)
    return next()
  else
    return res.status(403).send('invalid password')
}

module.exports = authenticateRequest
