var express = require('express')
  , createReadStream = require('fs').createReadStream
  , app = express()

app.use(express.static(__dirname))

app.get('/', function (req, res) {
  createReadStream(__dirname + '/index.html')
    .on('error', function () {
      res.send(404)
    })
    .pipe(res)
})

app.listen(8765, function () {
  console.log('http://localhost:8765')
})