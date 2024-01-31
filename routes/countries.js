const router = require('express').Router();
const controller = require('../controller/country-controller');

router.route('/').get(controller.getCountries);
router.route('/:countryId/products').get(controller.getCountriesProducts);
router.route('/:countryId/users').get(controller.getCountriesUsers);
router.route("/change-country").patch(controller.changeCountries)

module.exports = router;