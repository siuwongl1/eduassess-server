/**
 * Created by SiuWongLi on 17/4/27.
 */
var express = require('express');
var router = express.Router();
var co = require('co');
var commentManage = require('./../models/comment');
var activityManage = require('./../models/activity');
var ObjectID = require('mongodb').ObjectID;
var ResponseEntity = require('./../models/resp');
router.get('/:uid',function (req,res) {
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
router.get('/lesson/:lid',function (req,res) {
    //根据课堂id查询评论
    var resp = new ResponseEntity();
    co(function *() {
        var {lid} = req.params;
        if(ObjectID.isValid(lid)){
            var query = {lid:lid};
            var result = yield commentManage.find(query);
            resp.setData(result);
        }else{
            resp.setMessage("课堂uid格式不正确");
            resp.setStatusCode(1);
        }
        res.json(resp);
    }).catch((err)=>{
        resp.setMessage(err);
        resp.setStatusCode(1);
        res.json(resp);
    })
})
router.post('/:lid',function (req,res) {
    //添加评论,添加评论的同时将评论动态添加到个人动态
    var resp = new ResponseEntity();
    co(function *() {
        var {lid}  = req.params;  //课堂id
        if(ObjectID.isValid(lid)){
            var {content,uid,name} = req.body;  //用户id，评论内容，评论人名称
            if(ObjectID.isValid(uid)){
                var data = {content:content,lid:lid,uid:uid,name:name,date:new Date()};
                //Two phase commit in a transaction, I will fix this later .
                var result = yield commentManage.add(data);  //添加评论内容
                var activity = {uid:data.uid,cid:data.lid,type:'comment',date:data.date}
                var activityResult= yield activityManage.add(activity); //添加我的动态信息
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
        console.log(err);
        resp.setMessage(err);
        resp.setStatusCode(1);
        res.json(resp);
    })
})
router.put('/like/:cid',function (req,res) {
    //用户点赞某个评价
    var resp = new ResponseEntity();
    co(function *() {
        var {cid} = req.params;
        var {uid,name} =  req.body;
        if(ObjectID.isValid(cid)&&ObjectID.isValid(uid)){
            var query = {_id:new ObjectID(cid),'like.uid':{$ne:uid}};
            var data = {$push:{like:{uid:uid,name:name}}};
            var result = yield commentManage.update(query,data);
            //Two phase commit in a transaction, I will fix this later .
            var activity  = {cid:cid,type:'like',uid:uid,date:new Date()};
            var activityResult= yield activityManage.add(activity);
            resp.setData(result);
        }else{
            resp.setMessage("用户uid或评价uid格式不正确");
            resp.setStatusCode(1);
        }
        res.json(resp);
    }).catch((err)=>{
        resp.setStatusCode(1);
        resp.setMessage(err);
        res.json(resp);
    })
})
module.exports = router;