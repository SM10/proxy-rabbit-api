const router = require('express').Router();
const controller = require('../controller/product-controller');

router.route("/").get(controller.getProducts)
router.route("/discover").get(controller.discoverProducts);
router.route("/search/:search").get(controller.searchProducts);
router.route("/popular").get(controller.popularProducts);

module.exports = router;