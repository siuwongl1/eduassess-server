/**
 * Created by SiuWongLi on 17/3/17.
 */
// more routes for our users will happen here

var express = require('express'), assert = require('assert');
var router = express.Router();
var userManage = require("./../models/user");
var co = require('co');
//router.post('/infos', function (req, res) {
router.get('', function (req, res) {
//    var {uid,pw} = req.body;
    //get all users
    var query = {};
    userManage.find(query, function (result) {
        res.json(result);
    });
}).put('', function (req, res) {
    //update

}).post('', function (req, res) {
    //register
    var {username,password,type,email} = req.query;
    var person = {username:username,password:password,type:type,email:email};
    userManage.add(person, function (err) {
        if (err) {
            if (err.code == 11000) {
                res.json({result: '该用户已被注册！'})
            } else {
                res.json(err);
            }
        } else {
            res.json({result: 'ok'});
        }
    });
}).post('/login', function (req, res) {
    var {uid,pw} = req.bdoy;
    if (uid && pw) {
        var query = {username: uid, password: pw};
        userManage.find(query, function (result) {
            if (result) { // 登录成功
                res.json({login: true})
            } else {
                res.json({login: false, err: '用户名或密码错误'});
            }
        });
    }
})
module.exports = router;
