/**
 * Created by SiuWongLi on 17/3/22.
 */

function ResponseEntity(data, message, code) {
    this.data = data===undefined?"":data;
    this.message = message===undefined?"":message;
    this.statusCode = code===undefined?0:code;
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
    }
}
module.exports = ResponseEntity;