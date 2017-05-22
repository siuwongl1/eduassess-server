/**
 * Created by SiuWongLi on 17/5/22.
 */
var redisOps = {host:'127.0.0.1',port:6379,password:'123456'};
var redis = require("redis"),
    client = redis.createClient(redisOps);



module.exports= {
    setExpireKey:function (key,value,seconds) {
        return client.set(key,value,'EX',seconds);
    },
    expire:function (key,seconds) {
        return client.expire(key,seconds);
    },
    get:function (key) {
        var promise = new Promise((resolve,reject)=>{
            client.get(key,function (err,reply) {
                if(err){
                    reject(err);
                }else{
                    resolve(reply);
                }
            })
        })
        return promise;
    },
    del:function (key) {
        return client.del(key);
    }
};