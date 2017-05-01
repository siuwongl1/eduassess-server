/**
 * Created by SiuWongLi on 17/5/1.
 * 消息model
 */

var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
var url = 'mongodb://localhost:27017/ets';
var co = require('co');
var noticeManage= {
    find:function (query) {
        var promise =new Promise((resolve,reject)=>{
            co(function *() {
                var db = yield MongoClient.connect(url);
                var collection = db.collection('notices');
                var result = yield collection.find(query).toArray();
                yield db.close();
                resolve(result);
            }).catch((err)=>{
                reject(err);
            })
        })
        return promise;
    },
    add:function (data) {
        var promise = new Promise((resolve,reject)=>{
            co(function *() {
                var db = yield MongoClient.connect(url);
                var collection = db.collection('notices');
                var result = yield collection.insertOne(data);
                yield db.close();
                resolve(result);
            }).catch((err)=>{
                reject(err);
            })
        })
        return promise;
    },
    update:function (query,data) {
        var promise = new Promise((resolve,reject)=>{
            co(function *() {
                var db = yield MongoClient.connect(url);
                var collection = db.collection('notices');
                var result = yield collection.updateOne(query,data);
                yield db.close();
                resolve(result);
            }).catch((err)=>{
                reject(err);
            })
        })
        return promise;
    }
}
module.exports = noticeManage;