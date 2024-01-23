const router = require('express').Router();
const controller = require('../controller/country-controller');

router.route('/').get(controller.getCountries);
router.route('/:countryId/products').get(controller.getCountriesProducts);

module.exports = router;