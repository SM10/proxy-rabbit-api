const router = require('express').Router();
const passport = require('passport');
const morgan = require('morgan');

router.post('/', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.status(200).send("Logout Successful")
    });
  });

module.exports = router;