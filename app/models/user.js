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
            })
        });
        return promise;
    }, update: function (query, data, cb) {
        co(function *() {
            var db = yield MongoClient.connect(url);
            var collection = yield db.collection('users');
            var result = yield collection.updateOne(query,{$set:data});
            yield db.close();
            if(cb&&typeof cb=='function'){
                cb(result);
            }
        })
    }, delete: function (uid,cb) {
        co(function *() {
            var db = yield MongoClient.connect(url);
            var collection = yield db.collection('users');
            var result = yield collection.findOneAndDelete({_id:uid})
            if(cb&&typeof cb=='function'){
                cb(result);
            }
        })
    }, add: function (user, cb) {
        co(function *() {
            var db = yield MongoClient.connect(url);
            var collection = yield db.collection('users');
            var result = yield collection.insertOne(user);
            yield db.close();
            if(cb&&typeof cb=='function'){
                var insertedCount = result.insertedCount();
                var insertedId = result.insertedId();
                if(insertedCount==0){
                    cb({err:"已存在该用户"});
                }else{
                    cb({id:insertedId});
                }
            }
        })
    }, login: function (uid, pw,cb) {
        co(function *() {
            var db = yield MongoClient.connect(url);
            var collection = db.collection('users');
            var result = yield collection.findOne({username: uid, password: pw});
            if(cb&&typeof cb=='function'){
                cb(result);
            }
        })
    }
}
module.exports = UserManage;
