const router = require('express').Router();
const controller = require('../controller/login-controller');

router.route("/:email/:password").get(controller.login)

module.exports = router;