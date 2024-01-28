const router = require('express').Router();
const controller = require('../controller/login-controller');
const passport = require('passport');
const morgan = require('morgan');

router.route("/").post(controller.login)
router.route("/relogin").get(controller.relogin)

module.exports = router;