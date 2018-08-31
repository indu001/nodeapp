const bcrypt = require('bcrypt');

//schema
const UserModel = (sequelize, type) => {
  return sequelize.define('users', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: type.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        isEmail: {
          msg: 'Entered email is not valid'
        }
      },
      unique: {
        name: 'email',
        msg: 'email is already registered'

      }
    },
    username: {
      type: type.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        len: [2, 100]
      }

    },
    password: {
      type: type.STRING,
      allowNull: false,
      notEmpty: true
    },
    createdAt: type.DATE
  },
    {
      hooks: {
        beforeCreate: (user, options) => {
          // Hash password before saving 
          return new Promise((resolve, reject) => {
            bcrypt.hash(user.password, 10).then((pswHash) => {
              user.password = pswHash;
              resolve(user, options);
            }).catch(err => {
              reject(err);
            });

          })


        }
      }
    })
};

module.exports = UserModel;

