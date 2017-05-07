/**
 * Created by SiuWongLi on 17/5/1.
 */
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
var url = 'mongodb://localhost:27017/ets';
var co = require('co');
var remarkManage= {
    find:function (query,selection) {
        var promise =new Promise((resolve,reject)=>{
            co(function *() {
                var db = yield MongoClient.connect(url);
                var collection = db.collection('remarks');
                var result;
                var count = yield collection.find(query).count();
                if(selection){
                    result = yield collection.find(query).skip(selection.skip).limit(selection.limit).toArray();
                }else{
                    result = yield collection.find(query).toArray();
                }
                var remarks = {data:result,count:count};
                yield db.close();
                resolve(remarks);
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
                var collection = db.collection('remarks');
                var result = yield collection.insertOne(data);
                yield db.close();
                resolve({id: result.insertedId});
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
                var collection = db.collection('remarks');
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
module.exports = remarkManage;