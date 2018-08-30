const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  passwordConf: {
    type: String,
    required: true
  }

});

// Hash password before saving 
UserSchema.pre('save', function (next) {
  const user = this;
  console.log(user);
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {

    }
    user.password = hash;
    next();
  })
})

//authenticate  user credentials on login
UserSchema.statics.authenticate = (email, passw, callback) => {
  User.findOne({ email: email })
    .exec((err, user) => {
      if (err) {
        return callback(err)
      } else if (!user) {
        const err = new Error('User not found');
        err.status = 401;
        return callback(err);
      }

      bcrypt.compare(passw, user.password, (err, result) => {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })

    })
}

const User = mongoose.model("User", UserSchema);


module.exports = User;