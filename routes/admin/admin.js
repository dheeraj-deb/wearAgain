const express = require('express');
const router = express.Router()
const controller = require('../../controller/admin/admin-controller');
const isAuth = require('../../middleware/admin/is-auth');
const upload = require('../../middleware/fileUpload');

router.get('/', isAuth, controller.getAdmin);

router.get('/add-product', isAuth, controller.getaddProduct);

router.post('/add-product', upload.array("image", 3), controller.addProduct);

router.get('/product', isAuth, controller.getProduct);

router.get('/product/delete/:id', isAuth, controller.deleteProduct);

router.get('/product/edit/:id', isAuth, controller.getEditProduct);

router.post('/product/edit/:id', isAuth, upload.fields([{name:"image", maxCount:3}]), controller.updateProduct);

router.get('/manage-user', isAuth, controller.getUser)

router.get('/user/block/:id', isAuth, controller.blockUser)

router.get('/user/unblock/:id', isAuth, controller.unblockUser)

router.get('/product/delete/:id', isAuth, controller.deleteUser)


module.exports = router;