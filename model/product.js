const db = require('../util/database');
const collection = require('../util/collection').collection;
const objectId = require('mongodb').ObjectId;


exports.addProduct = (product) => {
    product.tags = product.tags.split(',')
    console.log(product.files)
    return new Promise((resolve, reject) => {
        db.get().collection(collection.PRODUCT_COLLECTIION).insertOne(product).then((response) => {
            resolve(response)
        }).catch((err) => {

        })
    })
}


exports.getAllProduct = (callback) => {
    return new Promise(async (resolve, reject) => {
        const products = await db.get().collection(collection.PRODUCT_COLLECTIION).find().toArray()
        if (products) {
            return resolve(products)
        }
        resolve()
    }).catch((err) => {

    })
}


exports.deleteProduct = (id) => {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.PRODUCT_COLLECTIION).deleteMany({ _id: objectId(id) }).then((response) => {
            if (response) {
                return resolve(response)
            }
            resolve()
        }).catch((err) => {

        })
    })
}



exports.getProduct = (id) => {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.PRODUCT_COLLECTIION).findOne({ _id: objectId(id) }).then((product) => {
            if (product) {
                return resolve(product)
            }
            resolve()
        }).catch((err) => {

        })
    })
}


exports.editProduct = (productDtls, id) => {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.PRODUCT_COLLECTIION).updateOne({ _id: objectId(id) }, {
            $set: {
                product_name: productDtls.product_name,
                brand_name: productDtls.brand_name,
                price: productDtls.price,
                category: productDtls.category,
                stock_s: productDtls.stock_s,
                stock_m: productDtls.stock_m,
                stock_l: productDtls.stock_l,
                stock_xl: productDtls.stock_xl,
                c_color: productDtls.c_color,
                discription: productDtls.discription,
                color: productDtls.color,
                tags: productDtls.tags,
                img_id: productDtls.img_id
            }
        }).then((response) => {
            if (response) {
                return resolve(response)
            }
            resolve()
        }).catch((err) => {
            reject(err)
        })
    })
}


exports.filterWomen = () => {
    return new Promise(async (resolve, reject) => {
        try {
            products = await db.get().collection(collection.PRODUCT_COLLECTIION).find({ category: "women's" }).toArray()
            if (products) {
                return resolve(products)
            }
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}