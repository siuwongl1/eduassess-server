/**
 * Created by SiuWongLi on 17/5/1.
 * 评论router
 */
var express = require('express');
var router = express.Router();
var co = require('co');
var remarkManage = require('./../models/remark');
var commentManage = require('./../models/comment')
var ObjectID = require('mongodb').ObjectID;
var ResponseEntity = require('./../models/resp');

router.get('/:cid/skip/:skip/limit/:limit',function (req,res) {
    //根据评价uid查找相关评论
    var resp = new ResponseEntity();
    co(function *() {
        var {cid,skip,limit} = req.params;
        if(ObjectID.isValid(cid)){
            var query = {cid:cid};
            var result = yield remarkManage.find(query,{skip:parseInt(skip),limit:parseInt(limit)});
            resp.setData(result);
        }else{
            resp.setMessage('评价uid格式不正确');
            resp.setStatusCode(1);
        }
        res.json(resp);
    }).catch(err=>{
        resp.setMessage(err);
        resp.setStatusCode(1);
        res.json(resp);
    })
})
router.post('/:cid',function (req,res) {
    //根据评价uid添加评论
    var resp = new ResponseEntity();
    co(function *() {
        var {cid} = req.params;
        var {uid,name,content} = req.body;
        if(ObjectID.isValid(cid)&&ObjectID.isValid(uid)){
            var data = {cid:cid,uid:uid,name:name,content:content,lastRemarked:new Date().toLocaleDateString()};
            var result = yield remarkManage.add(data);
            var commentAffected = yield commentManage.pushRemark({_id:new ObjectID(cid)},{rid:result.insertedId});
            resp.setData(result);
        }else{
            resp.setMessage('评价uid或评价者uid格式不正确');
            resp.setStatusCode(1);
        }
        res.json(resp);
    }).catch(err=>{
        resp.setMessage(err);
        resp.setStatusCode(1);
        res.json(resp);
    })
})
module.exports = router;