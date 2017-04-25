/**
 * Created by SiuWongLi on 17/4/25.
 */
var express = require('express');
var router = express.Router();
var co = require('co');
var lessonManage = require('./../models/lesson');
var ObjectID = require('mongodb').ObjectID;
var ResponseEntity = require('./../models/resp');
var Valid = require("./../utils/valid");
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
router.get('/:lid',multipartMiddleware,function (req,res) {
    //根据课堂id查询课堂信息
    var resp = new ResponseEntity();
    co(function *() {
        var lid = req.params.lid;

    }).catch((err)=>{
        resp.setMessage(err);
        resp.setStatusCode(1);
        res.json(resp);
    })
})
router.post('/:cid',multipartMiddleware,function (req,res) {
    //发布新课堂
    var resp= new ResponseEntity();
    co(function *() {
        var {cid,name,content}  =req.body;
        var data = {name:name,content:content,date:new Date().toLocaleDateString()};
        var result = yield lessonManage.add(cid,data);
        resp.setData(result.id);
        resp.setStatusCode(0);
        res.json(resp);
    }).catch((err)=>{
        resp.setMessage(err);
        resp.setStatusCode(1);
        res.json(resp);
    })
})
module.exports = router;