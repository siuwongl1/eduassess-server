/**
 * Created by SiuWongLi on 17/4/25.
 */
var express = require('express');
var router = express.Router();
var co = require('co');
var lessonManage = require('./../models/lesson');
var ObjectID = require('mongodb').ObjectID;
var ResponseEntity = require('./../models/resp');
router.get('/:uid',function (req,res) {
    //根据课堂id查询课堂信息
    var resp = new ResponseEntity();
    co(function *() {
        var {uid} = req.params;
        if(ObjectID.isValid(uid)){
            var query ={_id:new ObjectID(uid)};
            var result = yield lessonManage.find(query);
            resp.setData(result);
        }else{
            resp.setMessage('课堂uid格式不正确');
            resp.setStatusCode(1);
        }
        res.json(resp);
    }).catch((err)=>{
        resp.setMessage(err);
        resp.setStatusCode(1);
        res.json(resp);
    })
})
router.get('/course/:cid',function (req,res) {
    //根据 course  uid 来查询课堂信息
    var resp = new ResponseEntity();
    co(function *() {
        var {cid} = req.params;
        if(ObjectID.isValid(cid)){
            var query = {cid:new ObjectID(cid)};
            var result =yield lessonManage.find(query);
            resp.setStatusCode(0);
            resp.setData(result);
        }else{
            resp.setStatusCode(1);
            resp.setMessage('uid格式不正确');
        }
        res.json(resp);
    }).catch((err)=>{
        resp.setStatusCode(1);
        resp.setMessage(err);
        res.json(resp);
    })
})
router.post('/:cid',function (req,res) {
    //发布新课堂
    var resp= new ResponseEntity();
    co(function *() {
        var {cid} = req.params;
        var {name,content}  =req.body;
        if(ObjectID.isValid(cid)){
            var data = {cid:new ObjectID(cid),name:name,content:content,date:new Date().toLocaleDateString()};
            var result = yield lessonManage.add(data);
            resp.setData(result.id);
        }else{
            resp.setStatusCode(1);
            resp.setMessage("课程uid格式不正确");
        }
        res.json(resp);
    }).catch((err)=>{
        resp.setMessage(err);
        resp.setStatusCode(1);
        res.json(resp);
    })
})
module.exports = router;