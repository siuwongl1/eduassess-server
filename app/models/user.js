/**
 * Created by SiuWongLi on 17/3/11.
 */
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
// Connection URL
var url = 'mongodb://localhost:27017/ets';
var co = require('co');
// Use connect method to connect to the server
var UserManage = {
    find: function (query,cb) {
        co(function *() {
            var db = yield MongoClient.connect(url);
            var collection = db.collection('users');
            var result = yield collection.findOne(query, {"_id": 1, "username": 1});
            yield db.close();
            if(cb&&typeof cb=='function'){
                cb(result);
            }
        })
    }, update: function (query, data, cb) {
        co(function *() {
            var db = yield MongoClient.connect(url);
            var collection = yield db.collection('users');
            var result = yield collection.updateOne(query, data, {upsert: true});
            yield db.close();
            if(cb&&typeof cb=='function'){
                cb(result);
            }
        })
    }, delete: function () {

    }, add: function (user, cb) {
        co(function *() {
            var db = yield MongoClient.connect(url);
            var collection = yield db.collection('users');
            var result = yield collection.insertOne(user);
            yield db.close();
            if(cb&&typeof cb=='function'){
                cb(result);
            }
        })
    }, login: function (uid, pw,cb) {
        co(function *() {
            var collection = db.collection('users');
            var result = yield collection.findOne({username: uid, password: pw});
            if(cb&&typeof cb=='function'){
                cb(result);
            }
        })
    }
}
module.exports = UserManage;
