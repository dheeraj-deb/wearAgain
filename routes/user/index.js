var express = require('express');
const controller = require('../../controller/user/user-controller');
var router = express.Router();

/* GET home page. */

router.get('/',controller.getHome);

router.get('/shop', controller.getShop);

router.get('/products', controller.getProducts);

// filter
router.post('/all-products', controller.getallProducts);

router.post('/filter-category', controller.filterCategory);

// product overview

router.get('/product_details/:id', controller.productDetails);

// cart

router.get('/cart', controller.getCart)

router.post('/add-to-cart/:id', controller.addToCart)


module.exports = router;
