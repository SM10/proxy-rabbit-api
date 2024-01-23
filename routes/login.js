const router = require('express').Router();
const controller = require('../controller/login-controller');
const passport = require('passport');
const morgan = require('morgan');

router.route("/").post(controller.login)

module.exports = router;