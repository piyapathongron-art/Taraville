export default function notfoundMiddleware (req, res, next) {
  res.status(404).json({
    message : 'Path not found'
  })
}
