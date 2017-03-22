/**
 * Created by SiuWongLi on 17/3/22.
 */

var validObj = {
    validEmail: function (email) {  //校验邮箱的正确性
        return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);
    }
}
module.exports = validObj;