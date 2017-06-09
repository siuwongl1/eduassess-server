/**
 * Created by SiuWongLi on 17/5/22.
 */
var jwt = require('./JwtUtil')
var client = require('./../utils/CacheUtil');
var co = require('co');
var ETSError = require('./../models/Error');

var verifyToken = (token) => {
    var promise = new Promise((resolve, reject) => {
        var err = new ETSError();
        co(function *() {
            if (token) {
                var userPayload = yield jwt.verify(token);
                var loginToken = yield client.get(userPayload.uid);
                if (loginToken) {
                    if (token === loginToken) {
                        client.expire(userPayload.uid,600);// refresh access token
                        resolve(userPayload);
                    } else {
                        err.setMessage('用户登录信息已失效');
                        err.setStatusCode(401);
                        reject(err); //用户的token信息与redis缓存的数据不一致时，提示登录失效
                    }
                } else {
                    err.setMessage('用户登录信息已失效');
                    err.setStatusCode(401);
                    reject(err);  //用户登录信息已过期 TTL to expire
                }
            } else {
                err.setMessage('用户未登录');
                err.setStatusCode(401);
                reject(err);
            }
        })
    })
    return promise;
}
module.exports = {
    verifyToken: verifyToken
}