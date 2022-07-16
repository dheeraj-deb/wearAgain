const db = require('../util/database');
const collection = require('../util/collection').collection;
const bcrypt = require('bcrypt');


exports.doSignin = (adminData) => {
    return new Promise((resolve, reject) => {
        if (adminData.email && adminData.password) {
            return db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: adminData.email }).then((response) => {
                if (response) {
                    return bcrypt.compare(adminData.password, response.password).then((status) => {
                        if (status) {
                            return resolve(status)
                        }
                        resolve()
                    })
                }
                resolve()
            }).catch((err) => {
                reject(err)
            })
        }
        resolve();
    })
}