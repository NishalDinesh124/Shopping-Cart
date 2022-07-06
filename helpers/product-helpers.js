var db = require('../config/connection')
var collection = require('../config/collections')
const { reject } = require('promise')
var objectId = require('mongodb').ObjectId
module.exports = {

    addProducts: (products, callback) => {
        parseInt(products.price)
        db.get().collection('products').insertOne(products).then((data) => {
            console.log(data.insertedId);

            callback(data.insertedId)
        })
    },
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    deleteProduct: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: objectId(proId) }).then((response) => {
                resolve(response)
            })
        })
    },
    getProductDetails: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: objectId(proId) }).then((product) => {
                resolve(product)
            })
        })
    },
    updateProduct: (proId, proDetails) => {

        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION)
                .updateOne({ _id: objectId(proId) }, {
                    $set: {
                        name: proDetails.name,
                        description: proDetails.description,
                        category: proDetails.category,
                        price: proDetails.price
                    }
                }).then((response) => {
                    resolve()
                })
        })
    }
}