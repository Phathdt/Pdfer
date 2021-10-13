import morgan from 'morgan'

morgan.token('id', function getId(req) {
  return req.id
})

var loggerFormat = ':id [:date[web]] ":method :url" :status :response-time'

export const morganSuccess = morgan(loggerFormat, {
  skip: function (req, res) {
    return res.statusCode < 400
  },
  stream: process.stderr,
})

export const morganError = morgan(loggerFormat, {
  skip: function (req, res) {
    return res.statusCode >= 400
  },
  stream: process.stdout,
})
