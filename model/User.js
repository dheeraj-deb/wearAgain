const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('../util/database');
const collection = require('../util/collection').collection;
const objectId = require('mongodb').ObjectId
const client = require('twilio')('AC19fa060e5047f5af9b81450edc56838b', 'e467d276e91f7c076dc84ebdfd89ac37')
const sericeSid  = 'MG2498a2ee28acf16fcb06163119935fc8';





let userFound = false;



function getUser(userData) {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email, isBlocked:false}).then((response) => {
            if (response) {
                return resolve(response)
            }
            resolve()
        })
    })
}

function getUserById(id) {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(id) }).then((response) => {
            if (response) {
                return resolve(response)
            }
            resolve()
        })
    })
}

exports.getAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            if (users) {
                return resolve(users)
            }
            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}



// otp verification

// exports.doSms = (data)=>{
//     return new Promise((resolve, reject) => {
//         client.verify.services(sericeSid).verifications.create({
//             to:`+91${data.mobile}`,
//             channel:"sms"
//         }).then((response)=>{
//             if(response){
//                 resolve(response)
//             }
//             resolve()
//         })
//     })
// }

// exports.verityOtp =(otp, data) => {
//     return new Promise((resolve, reject) => {
//         client.verify.services(sericeSid).verificationChecks.create({
//             to:`+91${data.phone}`,
//             code:otp.otp
//         }).then((response)=>{
//             console.log("response");
//             resolve(response)
//         })
//     })
// }

exports.userSignUp = (userData) => {
    return new Promise((resolve, reject) => {
        getUser(userData).then(async (res) => {
            if (res) {
                userFound = true;
                return resolve(userFound)
            }
            userData.password = await bcrypt.hash(userData.password, 10);
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((response) => {
                resolve()
            }).catch((err) => {
                console.log(err);
            });
        })
    })
}



exports.userSignin = (userData) => {
    return new Promise((resolve, reject) => {
        return getUser(userData).then((data) => {
            if (data) {
                return bcrypt.compare(userData.password, data.password).then((response) => {
                    // console.log("res", response);
                    if (response) {
                        return resolve({ response, data })
                    }
                    resolve()
                }).catch((err) => {
                    console.log(err);
                    reject()
                })
            }
            resolve()
        })
    })
}


exports.createToken = (userData) => {
    // console.log(userData.email);
    return new Promise((resolve, reject) => {
        getUser(userData).then((response) => {
            // console.log(response);
            if (response) {
                return crypto.randomBytes(30, async (err, buffer) => {
                    if (err) {
                        // add - error message
                        return resolve()
                    }
                    const token = await buffer.toString('hex');
                    db.get().collection(collection.USER_COLLECTION).updateOne({ email: response.email }, {
                        $set: {
                            resetToken: token,
                            resetTokenExpiration: Date.now() + 600000
                        }
                    }).then((data) => {
                        // console.log(data);
                        resolve({ response, token })
                    })
                })
            }
            resolve()
        })
    })
}




exports.getNewPass = (token) => {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.USER_COLLECTION).findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } }).then((userData) => {
            if (userData) {
                // console.log("userdata", userData);
                return resolve(userData)
            }
            resolve()
        })
    })
}


exports.resetPass = (data) => {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(data.uId), resetTokenExpiration: { $gt: Date.now() } }).then(async (user) => {
            if (user) {
                data.password = await bcrypt.hash(data.password, 10);
                return db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(data.uId) }, {
                    $set: {
                        password: data.password,
                        resetToken: undefined,
                        resetTokenExpiration: undefined
                    }
                }).then((response) => {
                    return resolve(response)
                })
            }
            // token expired 
            resolve()
        }).catch((err) => {
            console.log(err);
        })
    })
}



exports.blockUser = (id) => {
    return new Promise((resolve, reject) => {
        getUserById(id).then((user) => {
            if (user) {
                return db.get().collection(collection.USER_COLLECTION).updateOne({ _id: user._id }, {
                    $set: {
                        isBlocked: true
                    }
                }).then((response)=>{
                    if(response){
                        return resolve(response)
                    }
                    resolve()
                })
            }
            resolve()
        }).catch((err)=>{
            reject(err)
        })
    })
}


exports.unblockUser= (id) => {
    return new Promise((resolve, reject) => {
        getUserById(id).then((user) => {
            if (user) {
                return db.get().collection(collection.USER_COLLECTION).updateOne({ _id: user._id }, {
                    $set: {
                        isBlocked: false
                    }
                }).then((response)=>{
                    if(response){
                        return resolve(response)
                    }
                    resolve()
                })
            }
            resolve()
        }).catch((err)=>{
            reject(err)
        })
    })
}


exports.deleteUser = (id) => {
    return new Promise((resolve, reject)=>{
        getUserById(id).then((user)=>{
            db.get().collection(collection.USER_COLLECTION).deleteOne({_id:user._id}).then((response)=>{
                resolve()
            }).catch((err)=>{
                reject(err)
            })
        })
    })
}


module.exports.getUser = getUser;