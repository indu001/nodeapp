const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const session = require('express-session');
const Mongostore = require('connect-mongo')(session);
const router = require('./routes/router');


mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/nodelogin", { useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {
  console.log('connected');
});
app.use(session({
  secret: 'agatha christie',
  resave: true,
  saveUninitialized: false,
  store: new Mongostore({
    mongooseConnection: db
  })
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// app.use(express.static(__dirname + '/src'));

app.use('/', router);

// basic error handling
app.use((req, res, next) => {
  const error = new Error('File Not Found');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
})

app.listen(port, () => {
  console.log("Server listening on port " + port);
});