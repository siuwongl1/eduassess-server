/**
 * Created by SiuWongLi on 17/4/7.
 */
var express = require('express');
var router = express.Router();
var co = require('co');
var courseManage = require('./../models/course');
var ObjectID = require('mongodb').ObjectID;
var ResponseEntity = require('./../models/resp');
var Valid = require("./../utils/valid");
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

router.get('/:id', multipartMiddleware, (req, res) => {
    //根据课程id查询详细信息
    var resp = new ResponseEntity();
    co(function *() {
        var query = {};
        var uid = req.params.id;
        if (ObjectID.isValid(uid)) {
            query = {_id: new ObjectID(uid)};
            var result = yield courseManage.find(query);
            resp.setStatusCode(0);
            resp.setData(result);
        } else {
            resp.setMessage('uid格式不正确');
            resp.setStatusCode(1);
        }
        res.json(resp);
    }).catch((err) => {
        resp.setMessage(err);
        resp.setStatusCode(1);
        res.json(resp);
    })
})
router.get('/user/:uid',multipartMiddleware,(req,res)=>{
    // 根据用户id和学期来查询相关课程
    var resp = new ResponseEntity();
    co(function *() {
        var {uid} = req.params;
        var query = {uid:uid};
        var result = yield courseManage.find(query);
        resp.setData(result);
        resp.setStatusCode(0);
        res.json(resp);
    }).catch((err)=>{
        resp.setStatusCode(1);
        resp.setMessage(err);
        res.json(resp);
    })
})
router.get('/user/:uid/period/:period',multipartMiddleware,(req,res)=>{
    // 根据用户id和学期来查询相关课程
    var resp = new ResponseEntity();
    co(function *() {
        var {uid,period} = req.params;
        var query = {uid:uid,period:period};
        var result = yield courseManage.find(query);
        resp.setData(result);
        resp.setStatusCode(0);
        res.json(resp);
    }).catch((err)=>{
        resp.setStatusCode(1);
        resp.setMessage(err);
        res.json(resp);
    })
})
router.get('/pro/:pro/cls/:cls/period/:period', multipartMiddleware, (req, res) => {
    //根据专业,班级模糊查询相关课程
    var resp = new ResponseEntity();
    co(function *() {
        var {pro, cls, period} = req.params;
        var query = {pro: `/^${pro}/`, cls: `/^${cls}`, period: period};
        var result = yield courseManage.find(query);
        resp.setStatusCode(0);
        resp.setData(result);
        res.json(resp);
    }).catch((err) => {
        resp.setMessage(err);
        resp.setStatusCode(1);
        res.json(resp);
    })
})
router.post('', multipartMiddleware, (req, res) => {
    //添加课程
    var resp = new ResponseEntity();
    co(function *() {
        var {pro, cls, period, name, uid} = req.body;
        resp.setStatusCode(1);
        if (!pro) {
            resp.setMessage("专业名称不能为空");
        } else if (!cls) {
            resp.setMessage("班级名称不能为空");
        }else if(!period){
            resp.setMessage("学期不能为空");
        }else if(!name){
            resp.setMessage("课程名称不能为空");
        }else if(!uid||!ObjectID.isValid(uid)){
            resp.setMessage("教师uid格式不正确");
        }else {
            var data = {pro:pro,cls:cls,period:period,name:name,uid:new ObjectID(uid),date:new Date().toLocaleDateString()};
            var result =yield courseManage.add(data);
            resp.setStatusCode(0);
            resp.setData(result.id);
        }
        res.json(resp);
    }).catch((err) => {
        resp.setStatusCode(1);
        resp.setMessage(err);
        res.json(resp);
    })
})
router.put('/:id', multipartMiddleware, (req, res) => {
    //课程信息修改
    var resp = new ResponseEntity();
    co(function *() {
        var id = req.params.id;
        var {pro, cls, period, name} = req.body;
        resp.setStatusCode(1);
        if (!pro) {
            resp.setMessage("专业名称不能为空");
        } else if (!cls) {
            resp.setMessage("班级名称不能为空");
        }else if(!period){
            resp.setMessage("学期不能为空");
        }else if(!name){
            resp.setMessage("课程名称不能为空");
        }else if(!ObjectID.isValid(id)){
            resp.setMessage("uid格式不正确");
        }else{
            var query = {_id:new ObjectID(id)};
            var data ={pro:pro,cls:cls,period:period,name:name};
            yield courseManage.update(query,data);
            resp.setStatusCode(0);
        }
    }).catch((err)=>{
        resp.setStatusCode(1);
        resp.setMessage(err);
        res.json(resp);
    })
})
router.delete('/:id', multipartMiddleware, (req, res) => {
    //课程信息删除
    var resp =new ResponseEntity();
    co(function *() {
        var id = req.params.id;
        if(ObjectID.isValid(id)){
            var query = {_id:new ObjectID(id)};
            yield courseManage.delete(query);
            resp.setStatusCode(0);
        }else{
            resp.setMessage("uid格式不正确");
            resp.setStatusCode(1);
        }
    }).catch((err)=>{
        resp.setStatusCode(1);
        resp.setMessage(err);
    })
})
module.exports = router;