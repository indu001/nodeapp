const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const session = require('express-session');
const router = require('./routes/router');
const { sequelize } = require('./sequelize');
const Store = require('connect-session-sequelize')(session.Store);


app.use(session({
  secret: 'agatha christie',
  resave: true,
  saveUninitialized: false,
  store: new Store({
    db: sequelize
  })
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', router);


// app.use(express.static(__dirname + '/src'));



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