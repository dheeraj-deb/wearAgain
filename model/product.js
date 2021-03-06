const db = require('../util/database');
const collection = require('../util/collection').collection;
const objectId = require('mongodb').ObjectId;

exports.findProductById = (productId) => {
    return new Promise(async (resolve, reject) => {
        const product = await db.get().collection(collection.PRODUCT_COLLECTIION).findOne({ _id: objectId(productId) })
        if (product) {
            return resolve(product)
        }
        resolve()
    })
}

exports.addProduct = (product) => {
    product.tags = product.tags.split(',')
    product.category = objectId(product.category)
    console.log(product);
    return new Promise((resolve, reject) => {
        db.get().collection(collection.PRODUCT_COLLECTIION).insertOne(product).then((response) => {
            resolve(response)
        }).catch((err) => {

        })
    })
}


exports.getAllProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const products = await db.get().collection(collection.PRODUCT_COLLECTIION).aggregate(
                [
                    {
                        $lookup: {
                            from: "category",
                            localField: "category",
                            foreignField: "_id",
                            as: "lookup_category"
                        }
                    }
                ]
            ).toArray();
            if (products) {
                return resolve(products)
            }
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}

// const products = await db.get().collection(collection.PRODUCT_COLLECTIION).find().toArray()
//         if (products) {
//             return resolve(products)
//         }
//         resolve()

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
    productDtls.category = objectId(productDtls.category)
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


exports.filterCategory = (filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const products = await db.get().collection(collection.PRODUCT_COLLECTIION).aggregate(
                [
                    {
                        $lookup: {
                            from: collection.CART_COLLECTION,
                            localField: "category",
                            foreignField: "_id",
                            as: "lookup_category"
                        }
                    }
                ]
            ).toArray()
            const filterProducts = products.filter((prods) => {
                return prods.lookup_category[0].category === filter
            })
            // products = await db.get().collection(collection.PRODUCT_COLLECTIION).find({ category: filter }).toArray()
            if (products) {
                // console.log("filter", filterProducts);
                return resolve(filterProducts)
            }
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}


exports.getCategory = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const category = await db.get().collection(collection.CATEGORY).find().toArray();
            if (category) {
                return resolve(category)
            }
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}


exports.addtoCart = (productId, userId) => {
    const productObj = {
        item:objectId(productId),
        qty:1
    }
    return new Promise(async (resolve, reject) => {
        const userCart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectId(userId) })
        if (userCart) {
            const productExist = userCart.products.findIndex(product => product.item = productId)
            if (productExist !=-1) {
                return db.get().collection(collection.CART_COLLECTION).updateOne({'products.item':objectId(productId)},
                {
                    $inc:{'products.$.qty':1}
                }
                ).then((response)=>{
                    resolve(response)
                })
            }
            db.get().collection(collection.CART_COLLECTION).updateOne({ user: objectId(userId) }, {
                $push: { products: productObj }
            }).then((response) => {
                if (response) {
                    return resolve(response)
                }
                resolve()
            })
        } else {
            const cartObj = {
                user: objectId(userId),
                products: [productObj],
                total:0
            }
            db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response) => {
                if (response) {
                    return resolve(response)
                }
                resolve()
            })
        }
    })
}

exports.getCartItems = (userId) => {
    return new Promise(async(resolve, reject) => {
        const cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate(
            [
                {
                    $match: {
                        user: objectId(userId)
                    }
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        qty:'$products.qty'
                    }
                },{
                    $lookup:{
                        from:collection.PRODUCT_COLLECTIION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                }
                
            ]
        ).toArray()
        console.log(cartItems[0].product);
        if(cartItems){
            return resolve(cartItems)
        }
        resolve()
    })
}