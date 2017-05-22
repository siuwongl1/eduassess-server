/**
 * Created by SiuWongLi on 17/5/22.
 */
function ETSError(message, code) {
    this.message = message| '';
    this.statusCode = code | 0;
}
ETSError.prototype = {
    constructor:ETSError,
    setMessage: function (msg) {
        this.message = msg;
    }, setStatusCode: function (code) {
        this.statusCode = code;
    }, getMessage: function () {
        return this.message;
    }, getStatusCode: function () {
        return this.statusCode;
    }
}
module.exports = ETSError;