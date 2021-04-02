const express = require('express')
const morgan = require('morgan')

const app = express()
const PORT = process.env.PORT || 3000

app.use(morgan('tiny'))

// app.use('/', function (res, req) {
//   // const client_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
//   console.log(req.connection)
//   console.log(req.headers)
// });

app.use('/', express.static(__dirname + '/dist'));

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})
