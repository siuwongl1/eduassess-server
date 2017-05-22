/**
 * Created by SiuWongLi on 17/3/22.
 * http返回的实体对象
 */

function ResponseEntity(data, message, code) {
    this.data = data| '';
    this.message = message| '';
    this.statusCode = code | 0;
}
ResponseEntity.prototype = {
    constructor:ResponseEntity,
    setMessage: function (msg) {
        this.message = msg;
    }, setStatusCode: function (code) {
        this.statusCode = code;
    }, setData: function (data) {
        this.data = data;
    }, getMessage: function () {
        return this.message;
    }, getData: function () {
        return this.data;
    }, getStatusCode: function () {
        return this.statusCode;
    },
    setError:function (err) {
        if(err && typeof err ==='object' && err.statusCode){
            this.statusCode = err.statusCode;
            this.message = err.message;
        }else{
            this.statusCode= 1;
            this.message  = err.toString();
        }
    }
}
module.exports = ResponseEntity;