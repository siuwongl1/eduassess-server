/**
 * Created by SiuWongLi on 17/5/10.
 * 统计分析相关router
 */

var express = require('express');
var router = express.Router();
var co = require('co');
var userManage = require('./../models/user');
var courseManage = require('./../models/course');
var lessonManage = require('./../models/lesson');
var commentManage = require('./../models/comment');
var ObjectID = require('mongodb').ObjectID;
var ResponseEntity = require('./../models/resp');
var verifyTokenUtil = require('./../utils/VerifyTokenUtil');

router.get('/teacher/:uid/period/:period',function (req,res) {
    //教师可以看到自己的课堂点赞信息
    var resp = new ResponseEntity();
    co(function *() {
        var payload = yield verifyTokenUtil.verifyToken(req.cookies.token);
        var {uid} = payload;
        if(ObjectID.isValid(uid)){

        }else{

        }
        res.json(resp);
    }).catch(err=>{
        resp.setMessage(err);
        resp.setStatusCode(1);
        res.json(resp);
    })
})
router.get('/student/:uid/period/:period',function (req,res) {
    //学生可看到自己获赞信息
    var resp = new ResponseEntity();
    co(function *() {
        var payload = yield verifyTokenUtil.verifyToken(req.cookies.token);
        var {uid} = payload;
        var {period} = req.params;
        if(ObjectID.isValid(uid)){
            var query ={period:period,students:{$elemMatch:{uid:uid}}};
            var courses = yield courseManage.find(query);  //查询该用户指定学期的所有课程
            var result = [];
            for(var i=0;i<courses.length;i++){
                var course = courses[i];   //获取用户的课程信息
                result.push({name:course.name,cid:course._id});
            }
            for(var i =0;i<result.length;i++){
                var cid = result[i].cid;
                query ={cid:cid.toString(),uid:uid};  //获取该课程的点赞信息
                var comments = yield commentManage.find(query);
                result[i].like = 0;
                for(var k =0;k<comments.length;k++){
                    result[i].like+= comments[k].like.length || 0;
                }
            }
            resp.setData(result);
        }else{
            resp.setMessage('uid格式不正确');
            resp.setStatusCode(1);
        }
        res.json(resp);
    }).catch(err=>{
        resp.setError(err);
        res.json(resp);
    })
})
router.get('/admin/:uid/period/:period',function (req,res) {
    var resp = new ResponseEntity();
    co(function *() {
        
    }).catch(err=>{
        resp.setError(err);
        res.json(resp);
    })
})
module.exports =router;