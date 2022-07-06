var db = require("../config/connection");
var collection = require("../config/collections");
const bcrypt = require('bcrypt');
const { response } = require("express");
const collections = require("../config/collections");
var objectId = require("mongodb").ObjectId;
const { ObjectId } = require("mongodb");
const { resolve, reject } = require("promise");

module.exports = {
    doLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: adminData.email })
            if (admin) {
                bcrypt.compare(adminData.password, admin.password).then((status) => {
                    if (status) {
                        console.log("login success");
                        response.admin = admin
                        response.status = true
                        resolve(response)
                    } else {
                        console.log('login failed');
                        resolve({ status: false })
                    }
                })
            } else {
                console.log('login failed');
                resolve({ status: false })
            }
        })
    },
    getUserOrders: (admin) => {
        return new Promise(async (resolve, reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find({}).toArray()
            resolve(orders)
        })
    },
    getAllUsers: (admin) => {
        return new Promise(async (resolve, reject) => {
            let users = await db.get().collection(collection.USER_COLLECTION).find({}).toArray()
            console.log
            resolve(users)
        })
    },
    removeUserAccount: (userId) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).deleteOne({ _id: objectId(userId) }).then((response) => {
                resolve(response)
            })
        })
    },
    getOrderedUser:(admin,userId)=>{
        return new Promise(async(resolve,reject)=>{
            let user=await db.get().collection(collection.USER_COLLECTION).find({_id:objectId(userId)}).toArray()
                resolve(user)
        })
    }
}