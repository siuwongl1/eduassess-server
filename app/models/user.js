/**
 * Created by SiuWongLi on 17/3/11.
 */
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
var ObjectID = require('mongodb').ObjectID;
// Connection URL
var url = 'mongodb://localhost:27017/ets';
var co = require('co');
// Use connect method to connect to the server
var UserManage = {
    find: function (query) {
        var promise = new Promise((resolve,reject)=>{
            co(function *() {
                var db = yield MongoClient.connect(url);
                var collection = db.collection('users');
                var result = yield collection.find(query).project({password:0}).toArray(); //不返回password 敏感字段
                yield db.close();
                resolve(result);
            }).catch((err)=>{
                reject(err);
            })
        });
        return promise;
    }, update: function (query, data) {
        var promise = new Promise((resolve,reject)=>{
            co(function *() {
                var db = yield MongoClient.connect(url);
                var collection = db.collection('users');
                var result = yield collection.updateOne(query,{$set:data});
                resolve(result);
                yield db.close();
            }).catch((err)=>{
                reject(err);
            })
        });
        return promise;
    }, delete: function (uid) {
        var promise = new Promise((resolve,reject)=>{
            co(function *() {
                var db = yield MongoClient.connect(url);
                var collection = db.collection('users');
                var result = yield collection.findOneAndDelete({_id:uid})
                if(result){
                    resolve(result);
                }
                yield db.close();
            }).catch((err)=>{
                reject(err);
            })
        })
        return promise;
    }, add: function (user) {
        var promise = new Promise((resolve,reject)=>{
            co(function *() {
                var db = yield MongoClient.connect(url);
                var collection = db.collection('users');
                try{
                    var result = yield collection.insertOne(user);
                    var insertedId = result.insertedId;
                    resolve({id:insertedId});
                }catch(err){
                    reject("该用户已被注册");
                    console.log("err:"+err);
                }
                db.close();
            }).catch((err)=>{
                reject(err);
            });
        });
        return promise;
    }, login: function (query) {
        var promise = new Promise((resolve,reject)=>{
            co(function *() {
                var db = yield MongoClient.connect(url);
                var collection = db.collection('users');
                var result = yield collection.findOne(query);
                resolve(result);
                yield db.close();
            }).catch((err)=>{
                reject(err);
            });
        });
        return promise;
    }
}
module.exports = UserManage;
