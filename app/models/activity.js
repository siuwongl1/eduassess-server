/**
 * Created by SiuWongLi on 17/5/4.
 */
var dbUtil = require('./../utils/DBUtil')
var co = require('co');

var activityManage= {
    find(query,selection){
        var promise = new Promise((resolve,reject)=>{
            co(function *() {
                var db = yield dbUtil.getDb();
                var collection = db.collection('activities');
                selection.sort = selection.sort ||{date:-1};
                selection.skip = selection.skip || 0;
                selection.limit= selection.limit|| 10;
                var count = yield collection.find(query).count();
                var result = yield collection.find(query).skip(selection.skip).limit(selection.limit).sort(selection.sort).toArray();
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
                var db = yield dbUtil.getDb();
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
                var db = yield dbUtil.getDb();
                var collection = db.collection('activities');
                var result = yield collection.updateOne(query,data);
                resovle(result);
            }).catch(err=>{
                reject(err);
            })
        })
        return promise;
    },
    delete(query){
        var promise = new Promise((resovle,reject)=>{
            co(function *() {
                var db = yield dbUtil.getDb();
                var collection = db.collection('activities');
                var result = yield collection.deleteMany(query);
                resovle(result);
            }).catch(err=>{
                reject(err);
            })
        })
        return promise;
    }
}
module.exports = activityManage;
