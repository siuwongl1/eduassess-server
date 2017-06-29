/**
 * Created by SiuWongLi on 17/4/7.
 */
var dbUtil = require('./../utils/DBUtil')
var co = require('co');

var courseManage = {
    find: (query) => {
        var promise = new Promise((resolve, reject) => {
            co(function *() {
                var db =yield dbUtil.getDb();
                var collection = db.collection('courses');
                var result = yield collection.find(query).toArray();
                yield db.close();
                resolve(result);
            }).catch((err) => {
                reject(err);
            })
        })
        return promise;
    },
    add: (course) => {
        var promise = new Promise((resolve, reject) => {
            co(function *() {
                var db =yield dbUtil.getDb();
                var collection = db.collection('courses');
                var result = yield collection.insertOne(course);
                var insertedId = result.insertedId;
                yield db.close();
                resolve({id: insertedId});
            }).catch((err) => {
                reject(err);
            })
        })
        return promise;
    },
    update: (query,data) => {
        var promise = new Promise((resolve,reject)=>{
            co(function *() {
                var db =yield dbUtil.getDb();
                var collection = db.collection('courses');
                var result = yield collection.updateOne(query,{$set:data});
                resolve(result);
                yield db.close();
            }).catch((err)=>{
                reject(err);
            })
        })
        return promise;
    },
    delete: (query) => {
        var promise = new Promise((resolve,reject)=>{
            co(function *() {
                var db =yield dbUtil.getDb();
                var collection = db.collection('courses');
                var result = yield collection.deleteOne(query);
                yield db.close();
                resolve(result);
            }).catch((err)=>{
                reject(err);
            })
        })
        return promise;
    },
    push:(query,data)=>{
        var promise = new Promise((resolve,reject)=>{
            co(function *() {
                var db =yield dbUtil.getDb();
                var collection = db.collection('courses');
                var result =yield  collection.update(query,{$push:data})
                yield db.close();
                resolve(result);
            }).catch((err)=>{
                reject(err);
            })
        })
        return promise;
    },
    pop:(query,data)=>{
        var promise = new Promise((resolve,reject)=>{
            co(function *() {
                var db =yield dbUtil.getDb();
                var collection = db.collection('courses');
                var result= yield collection.update(query,{$pop:data});
                yield db.close();
                resolve(result);
            }).catch((err)=>{
                reject(err);
            })
        })
        return promise;
    }
}
module.exports = courseManage;