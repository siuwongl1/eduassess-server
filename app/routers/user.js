/**
 * Created by SiuWongLi on 17/3/17.
 */
// more routes for our users will happen here
var express = require('express');
var router = express.Router();
var userManage = require("./../models/user");
var co = require('co');
var ObjectID = require('mongodb').ObjectID;
var ResponseEntity = require('./../models/resp');
var Valid = require("./../utils/valid");
var CaptchaUtil = require('./../utils/CaptchaUtil');
var md5 = require('md5');
var client = require('./../utils/CacheUtil');
var verifyTokenUtil = require('./../utils/VerifyTokenUtil');
var jwtUtil = require('./../utils/JwtUtil');

router.get('/:id', function (req, res) {
    var resp = new ResponseEntity();
    //查询相关的用户信息，参数为空时，默认查询全部
    var token = req.cookies.token;
    co(function*() {
        var payload = verifyTokenUtil.verifyToken(token);
        if (payload) {
            var id = req.params.id;
            //default to get all users
            if (ObjectID.isValid(id)) {
                var query = {_id: new ObjectID(id)};
                var result = yield userManage.find(query);
                resp.setData(result);
            } else {
                resp.setStatusCode(1);
                resp.setMessage("uid格式不正确");
            }
        } else {
            resp.setStatusCode(401); //Unauthorized
            resp.setMessage('用户未登录');
        }
        res.json(resp);
    }).catch((err) => {
        resp.setError(err);
        res.json(resp);
    });
});
router.get('/:username/:email', function (req, res) {
    //找回密码，验证注册邮箱，并发送验证码至注册邮箱
    var resp = new ResponseEntity();
    co(function *() {
        var {username, email} = req.params;
        if (Valid.validEmail(email)) {
            var query = {username: username, email: email};
            var result = yield userManage.find(query);
            if (result && result.length > 0) {
                var captchaCode = CaptchaUtil.generateCaptchaCode();
                CaptchaUtil.sendEmail(email, captchaCode, (err, info) => {
                    if (err) {
                        resp.setStatusCode(1);
                        resp.setMessage(err);
                    } else {
                        client.setExpireKey(username, captchaCode, 600);//600s
                    }
                });
            } else {
                resp.setMessage('不存在该用户或邮箱');
                resp.setStatusCode(1);
            }
        } else {
            resp.setStatusCode(1);
            resp.setMessage("您的邮箱格式不正确");
        }
        res.json(resp);
    }).catch(err => {
        resp.setError(err);
        res.json(resp);
    })
})
router.put('/:id', function (req, res) {
    //修改个人信息
    var resp = new ResponseEntity();
    co(function *() {
        var token = req.cookies.token;
        var payload = yield verifyTokenUtil.verifyToken(token);
        if (payload) {
            var uid = req.params.id;
            var type = payload.type;
            if (ObjectID.isValid(uid) && type) {
                if (type === '1') {
                    //学生信息修改
                    var {cls, name, sex, schoolId, pro} = req.body;
                    var user = {cls: cls, name: name, sex: sex, schoolId: schoolId, pro: pro};
                    yield userManage.update({_id: new ObjectID(uid)}, user);
                } else if (type === '2') {
                    //教师信息修改
                    var {pro, name, sex, schoolId} = req.body;
                    var user = {name: name, sex: sex, schoolId: schoolId, pro: pro};
                    yield userManage.update({_id: new ObjectID(uid)}, user);
                } else if (type === '3') {
                    //教学管理者修改
                    var {pro, name, sex, schoolId} = req.body;
                    var user = {name: name, sex: sex, schoolId: schoolId, pro: pro};
                    yield userManage.update({_id: new ObjectID(uid)}, user);
                }
            } else {
                resp.setStatusCode(1);
                resp.setMessage("uid格式不正确或没有提供用户类型");
            }
        } else {
            resp.setStatusCode(401);
            resp.setMessage('用户未登录');
        }
        res.json(resp);
    }).catch((err) => {
        resp.setError(err);
        res.json(resp);
    });
});
router.post('', function (req, res) {
    //用户注册
    var resp = new ResponseEntity();
    co(function *() {
        var {uid, pw, type, email} = req.body;
        if (Valid.validEmail(email)) {
            var person = {username: uid, password: md5(pw), type: type, email: email};
            var user = yield userManage.add(person);
            var token = jwtUtil.sign({uid: user.id, type: type});
            var user = {id: user.id.toString(), token: token, type: type};
            resp.setData(user);
            client.setExpireKey(user.id, token, 600);//TTL 600s
            resp.setMessage('注册成功');
        } else {
            resp.setStatusCode(1);
            resp.setMessage("邮箱格式不正确");
        }
        res.json(resp);
    }).catch((err) => {
        resp.setMessage(err);
        resp.setStatusCode(1);
        res.json(resp);
    });
});
router.delete('', function (req, res) {
    //delete user
})
router.post('/login', function (req, res) {
    //用户登录
    var resp = new ResponseEntity();
    co(function *() {
        var {uid, pw, type} = req.body;
        if (uid && pw && type) {
            var query = {username: uid, password: md5(pw), type: type};
            var result = yield userManage.find(query);
            if (result.length > 0) { // 登录成功
                var user = result[0];
                var token = jwtUtil.sign({uid: user._id.toString(), type: type});
                user.token = token;
                client.setExpireKey(user._id.toString(), token, 600);//TTL 600s
                resp.setData(user);
                resp.setMessage('登录成功');
            } else {
                resp.setMessage('用户名或密码错误');
                resp.setStatusCode(1);
            }
        } else {
            resp.setMessage("用户名,密码,用户类型不能为空");
            resp.setStatusCode(1);
        }
        res.json(resp);
    }).catch((err) => {
        resp.setMessage(err);
        resp.setStatusCode(1);
        res.json(resp);
    });

})
router.put('/pw/:id', function (req, res) {
    //修改密码
    var resp = new ResponseEntity();
    co(function *() {
        var token = req.cookie.token;
        var payload = yield verifyTokenUtil.verifyToken(token);
        if (payload) {
            var uid = payload.uid;
            var {pw, origin} = req.body;
            if (ObjectID.isValid(uid)) {
                if (uid && pw && origin) {
                    var query = {_id: new ObjectID(uid), password: origin};
                    var data = {password: md5(pw)};
                    var affected = yield userManage.update(query, data);
                    if (affected.modifiedCount > 0) { //修改成功
                        resp.setStatusCode(0);
                        resp.setMessage('修改成功');
                    } else {
                        resp.setMessage('用户id或密码错误');
                        resp.setStatusCode(1);
                    }
                } else {
                    resp.setMessage("用户id,新密码,原始密码不能为空");
                    resp.setStatusCode(1);
                }
            } else {
                resp.setMessage("uid格式不正确");
                resp.setStatusCode(1);
            }
        } else {
            resp.setStatusCode(401);
            resp.setMessage('用户登录已失效');
        }
        res.json(resp);
    }).catch((err) => {
        resp.setError(err);
        res.json(resp);
    });
})
router.post('/pw/:username', function (req, res) {
    //找回密码---修改密码
    var resp = new ResponseEntity();
    var {username} = req.params;
    var {code, password} = req.body;
    co(function *() {
        var captchaCode = yield client.get(username);
        if (captchaCode === code) {
            var query = {username: username};
            var update = {password: md5(password)};
            console.log(username);
            var affected = yield userManage.update(query, update);
            var commandResult =  affected.result;
            if (commandResult.n !== 1) {
                resp.setMessage('该用户不存在');
                resp.setStatusCode(1);
            }
            client.del(username); //验证成功后删除redis中的captchaCode
        } else {
            resp.setStatusCode(1);
            resp.setMessage('验证码不正确');
        }
        res.json(resp);
    }).catch(err => {
        resp.setError(err);
        res.json(resp);
    })
})

module.exports = router;
