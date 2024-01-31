const router = require('express').Router();
const morgan = require('morgan');
const jwt = require('jsonwebtoken')

router.post('/', function(req, res, next) {
  res.status(200).send()
  });

module.exports = router;