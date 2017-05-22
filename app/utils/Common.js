/**
 * Created by SiuWongLi on 17/5/16.
 */
var crypto = require('crypto-js');
const privateKey = '37LvDSm4XvjYOh9Y';


module.exports = {
    decrypt:function (password) {
        var promise = new Promise((resolve,reject)=>{
            try{
                var bytes  = crypto.AES.decrypt(password, privateKey);
                var plaintext = bytes.toString(crypto.enc.Utf8);
                console.log("decrypt %s:%s",password,plaintext);
                resolve(plaintext);
            }catch(err){
                reject(err);
            }
        })
        return promise;
    },
    encrypt:function (password) {
        var promise = new Promise((resolve,reject)=>{
            try{
                var cipher= crypto.AES.encrypt(password, privateKey);
                console.log("cipher password %s:%s",password,cipher);
                resolve(cipher);
            }catch(err){
                reject(err);
            }
        })
        return promise;

    }
}