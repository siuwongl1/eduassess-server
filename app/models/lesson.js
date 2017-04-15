/**
 * Created by SiuWongLi on 17/4/12.
 */

var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
var ObjectID = require('mongodb').ObjectID;
// Connection URL
var url = 'mongodb://localhost:27017/ets';
var co = require('co');

var lessonManage= {
    find:function (query) {
        var promise =new Promise((resolve,reject)=>{
            co(function *() {
                var db = yield MongoClient.connect(url);
                var collection = db.collection('courses');
                var result = yield collection.find(query).project({lessons:1}).toArray(); //仅仅返回lessons相关字段
                resolve(result);
            }).catch((err)=>{
                reject(err);
            })
        })
        return promise;
    },
    add:function (cid,data) {
        var promise = new Promise((resolve,reject)=>{
            co(function *() {
                var db = yield MongoClient.connect(url);
                var collection = db.collection('courses');
                var query  = {_id:new ObjectID(cid)};
                var update ={$push:{lessons:data}}
                var result = yield collection.update(query,update);
                resolve(result);
            }).catch((err)=>{
                reject(err);
            })
        })
        return promise;
    }
}
module.exports = lessonManage;