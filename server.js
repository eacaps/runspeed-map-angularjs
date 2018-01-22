var path = require('path');
var express = require('express');

var app = express();

var staticPath = path.join(__dirname, '/html');
app.use(express.static(staticPath));
app.use('/dist', express.static('dist'))
app.use('/data', express.static('data'))

app.listen(process.env.PORT || 3000, function() {
  console.log('runspeed map started');
});
