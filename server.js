var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

var User = require('./models/userModel');
var bodyParser = require('body-parser');
var jsonwebtoken = require('jsonwebtoken');

const mongoose = require('mongoose');

const option = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30000
};

const mongoURI = process.env.MONGODB_URI;
mongoose.connect('mongodb://127.0.0.1:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Successfully connect to MongoDB.");
    // initial();
})
.catch(err => {
    console.error("Connection error", err);
    process.exit();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
  
app.use(function(req, res, next) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
      jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
        if (err) req.user = undefined;
        req.user = decode;
        next();
      });
    } else {
      req.user = undefined;
      next();
    }
});
var routes = require('./routes/userRoute');
routes(app);
  
app.use(function(req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' })
});
  
app.listen(port);
  
console.log(' RESTful API server started on: ' + port);
  
module.exports = app;