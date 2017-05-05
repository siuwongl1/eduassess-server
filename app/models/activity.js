/**
 * Created by SiuWongLi on 17/5/4.
 */
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
var ObjectID = require('mongodb').ObjectID;
// Connection URL
var url = 'mongodb://localhost:27017/ets';
var co = require('co');

var activityManage= {
    find(query,selection){
        var promise = new Promise((resolve,reject)=>{
            co(function *() {
                var db = yield MongoClient.connect(url);
                var collection = db.collection('activities');
                var result;
                var count = yield collection.find(query).count();
                if(selection&&selection.skip&&selection.limit&&selection.sort){
                    result = yield collection.find(query).skip(selection.skip).limit(selection.limit).sort(selection.sort).toArray();
                }else{
                    result = yield collection.find(query).toArray();
                }
                var activities = {data:result,count:count};
                yield db.close();
                resolve(activities);
            }).catch((err)=>{
                reject(err);
            })
        })
        return promise;
    },
    add(data){
        var promise= new Promise((resolve,reject)=>{
            co(function *() {
                var db = yield MongoClient.connect(url);
                var collection = db.collection('activities');
                var result = yield collection.insertOne(data);
                resolve(result);
            }).catch(err=>{
                reject(err);
            })
        })
        return promise;
    },
    update(query,data){
        var promise = new Promise((resovle,reject)=>{
            co(function *() {
                var db = yield MongoClient.connect(url);
                var collection = db.collection('activities');
                var result = yield collection.updateOne(query,data);
                resovle(result);
            }).catch(err=>{
                reject(err);
            })
        })
        return promise;
    }
}
module.exports = activityManage;
