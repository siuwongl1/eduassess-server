/**
 * Created by SiuWongLi on 17/6/29.
 */
var MongoClient = require('mongodb').MongoClient
// Connection URL
var url = 'mongodb://localhost:27017/ets';
var co = require('co');
module.exports = {
    getDb(){
        var promise = new Promise((resolve,reject)=>{
            co(function *() {
                var db = yield MongoClient.connect(url);
                resolve(db);
            }).catch(err=>{
                reject(err);
            })
        })
        return promise;
    }
}