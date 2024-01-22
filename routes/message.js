const router = require('express').Router();
const controller = require('../controller/message-controller');

router.route('/').get(controller.getConvoList);

module.exports = router;