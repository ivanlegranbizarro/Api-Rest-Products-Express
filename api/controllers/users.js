const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "User already exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                res.status(201).json({
                  message: "Your account has been created",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};

exports.users_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            { email: user[0].email, userId: user[0]._id },
            `${process.env.JWTKEY}`,
            { expiresIn: "1h" }
          );
          return res.status(200).json({
            message: "Auth successful",
            token,
          });
        }
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.users_delete_user = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Your account has been removed",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
