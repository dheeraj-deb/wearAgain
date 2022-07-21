const product = require('../../model/product');
const user = require('../../model/User');
let prod;

exports.getHome = (req, res) => {
    // const { email } = req.session.user
    // console.log(email);
    // user.getUser(email).then((userdata) => {
        // console.log(userdata);
        // if (!userdata.isBlocked) {
            product.getAllProduct().then((result) => {
                console.log(req.session.user);
                // console.log(req.session.user.isBlocked);
                res.render('user/index', { title: 'Wear Again', user: true, product: result, session: req.session, layout: "user-layout" });
            })
        // } else {
            // req.flash("error", "you have been blocked!")
            // res.redirect('/')
        // }

    // })

}

exports.getShop = (req, res) => {
    product.getAllProduct().then((result) => {
        prod = result
        console.log(prod);
        res.redirect('/products')
    })
}

// reduce code index and shop

exports.filterCategory = (req, res) => {
    console.log(req);
    const filter = req.body.filter
    console.log(filter);
    product.filterCategory(filter).then((result) => {
        console.log("res", result);
        prod = result
        res.redirect('/products')
    })
}


exports.getallProducts = (req, res) => {
    product.getAllProduct().then((result) => {
        prod = result
        res.redirect('/products')
    })
}

exports.getProducts = (req, res) => {
    res.render('user/shop', { product: prod, layout: "user-layout", user: true })
}

// overview
exports.productDetails = (req, res) => {
    const productId = req.params.id;
    product.findProductById(productId).then((prod)=>{
        if(prod){
           return res.render()
        }
        
    })
}