const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken') //npm install jsonwebtoken --save     // token duzeltmek ucundur

const bcrypt = require('bcryptjs');     //paswordu sifrelemek    //npm install bcryptjs

const User = require('../models/User');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.post('/register', (req, res, next) => {
  const { username, password } = req.body

  bcrypt.hash(password, 10).then((hash) => {              //sifreleme edib passwordu databazaya gondermek funksiyasi
    const user = new User({
      username,
      password: hash
    });
    const promise = user.save();
    promise.then((data) => {
      res.json(data);
    }).catch((err) => {
      res.json(err);
    })
  });
});

router.post('/authenticate', (req, res) => {
  const { username, password } = req.body

  User.findOne({
    username,
  }, (err, user) => {

    if (err) {
      throw err
    };

    if (!user) {
      res.json({
        status: false,
        message: 'Authenticate failed, user not found'
      });
    } else {
      bcrypt.compare(password, user.password).then((result) => {       //passwordlari uygunlasdirir
        if (!result) {
          res.json({
            status: false,
            message: 'Authenticate failed, wrong password'
          });
        }
        else {                                       //passwordlar uygundusa token yaradir
          const payload = {                          // payload-da adi melumatlari vermeliyem passwordu yox
            username
          };
          const token = jwt.sign(payload, req.app.get('api_secret_key'), {   //jwt.io saytinda melumat var bu haqda
            expiresIn: 720 //12 saat
          });
          res.json({
            status: true,
            token
          })
        }
      })
    }

  })

});



module.exports = router;
