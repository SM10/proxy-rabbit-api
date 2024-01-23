const router = require('express').Router();
const {registerUser} = require('../controller/register-controller');

router.route('/').post(registerUser)

module.exports = router;