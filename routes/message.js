const router = require('express').Router();
const controller = require('../controller/message-controller');

router.route('/').get(controller.getConvoList)
    .post(controller.postMessage);
router.route('/:roomId').get(controller.getConvo);

module.exports = router;