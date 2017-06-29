/**
 * Created by SiuWongLi on 17/4/12.
 */

var dbUtil = require('./../utils/DBUtil');
var co = require('co');

var lessonManage= {
    find:function (query) {
        var promise =new Promise((resolve,reject)=>{
            co(function *() {
                var db = yield dbUtil.getDb();
                var collection = db.collection('lessons');
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
                var db = yield dbUtil.getDb();
                var collection = db.collection('lessons');
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
                var db = yield dbUtil.getDb();
                var collection = db.collection('lessons');
                var result = yield collection.updateOne(query,data);
                yield db.close();
                resolve(result);
            }).catch((err)=>{
                reject(err);
            })
        })
        return promise;
    },
    delete:function (query) {
        var promise = new Promise((resolve,reject)=>{
            co(function *() {
                var db = yield dbUtil.getDb();
                var collection = db.collection('lessons');
                var result = yield collection.deleteMany(query);
                yield db.close();
                resolve(result);
            }).catch((err)=>{
                reject(err);
            })
        })
        return promise;
    }
}
module.exports = lessonManage;