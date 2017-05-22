/**
 * Created by SiuWongLi on 17/5/22.
 */
var jwt = require('jsonwebtoken');
var privateKey ='37LvDSm4XvjYOh9Y';

var sign = (obj)=>{
    if(obj && typeof obj === 'object'){
        var token = jwt.sign(obj, privateKey);
    }
    return token;
}
var verify = (token)=>{
    var promise = new Promise((resolve,reject)=>{
        if(token){
            jwt.verify(token,privateKey,function (err,decoded) {
                if(err){
                    reject(err);
                }else{
                    resolve(decoded);
                }
            })
        }else{
            reject('票据信息不能为空');
        }
    });
    return promise;
}
module.exports = {sign:sign,verify:verify}
