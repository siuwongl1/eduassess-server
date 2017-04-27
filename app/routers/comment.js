/**
 * Created by SiuWongLi on 17/4/27.
 */
var express = require('express');
var router = express.Router();
var co = require('co');
var commentManage = require('./../models/comment');
var ObjectID = require('mongodb').ObjectID;
var ResponseEntity = require('./../models/resp');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
router.get('/:uid',multipartMiddleware,function (req,res) {
    //根据comment uid查询评论的详细信息
    var resp = new ResponseEntity();
    co(function *() {
        var {uid} = req.params;
        if(ObjectID.isValid(uid)){
            var query = {_id:new ObjectID(uid)};
            var result = yield commentManage.find(query);
            resp.setData(result);
        }else{
            resp.setMessage("评论uid格式不正确");
            resp.setStatusCode(1);
        }
        res.json(resp);
    }).catch((err)=>{
        resp.setStatusCode(1);
        resp.setMessage(err);
        res.json(resp);
    })
})
router.post('/:lid',multipartMiddleware,function (req,res) {
    //添加评论
    var resp = new ResponseEntity();
    co(function *() {
        var {lid}  = req.params;  //课堂id
        if(ObjectID.isValid(lid)){
            var {content,uid,name} = req.body;  //用户id，评论内容，评论人名称
            if(ObjectID.isValid(uid)){
                var data = {content:content,lid:lid,uid:uid,name:name,date:new Date().toLocaleDateString()};
                var result = yield commentManage.add(data);
                resp.setData(result);
            }else{
                resp.setMessage("用户uid格式不正确");
                resp.setStatusCode(1);
            }
        }else{
            resp.setStatusCode(1);
            resp.setMessage("课堂uid格式不正确");
        }
        res.json(resp);
    }).catch((err)=>{
        resp.setMessage(err);
        resp.setStatusCode(1);
        res.json(resp);
    })
})

module.export = router;