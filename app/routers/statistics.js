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

var findCourses = function (query) {
    var promise  =new Promise((resolve,reject)=>{
        var result = [];
        co(function *() {
            var courses = yield courseManage.find(query);  //查询该用户指定学期的所有课程
            for(var i=0;i<courses.length;i++){
                var course = courses[i];   //获取用户的课程信息
                result.push({name:course.name,cid:course._id});
            }
            resolve(result);
        }).catch(err=>{
            reject(err);
        })
    })
    return promise;
}
router.get('/period/:period/pro/:pro',function (req,res) {
    //学生可看到自己获赞信息，教师看到自己课程的评价参与度，教学管理者可看到本专业所有课程的评价参与度
    var resp = new ResponseEntity();
    co(function *() {
        var payload = yield verifyTokenUtil.verifyToken(req.cookies.token);
        var {uid,type} = payload;
        var {period,pro} = req.params;
        if(ObjectID.isValid(uid)){
            var result = [];
            if(type==='1'){  //学生统计
                var query ={period:period,students:{$elemMatch:{uid:uid}}};
                result = yield findCourses(query);
                for(var i =0;i<result.length;i++){
                    var cid = result[i].cid;
                    query ={cid:cid.toString(),uid:uid};  //获取该课程的点赞信息
                    var comments = yield commentManage.find(query);
                    result[i].like = 0;
                    for(var k =0;k<comments.length;k++){
                        var like = comments[k].like;
                        if(like){
                            result[i].like+= like.length || 0;
                        }
                    }
                }
            }else if(type==='2'){  //教师统计
                var query = {period:period,uid:new ObjectID(uid)};
                result = yield findCourses(query);
                for(var i=0;i<result.length;i++){
                    var cid = result[i].cid;
                    query = {cid:cid.toString()};
                    var comments= yield commentManage.find(query);
                    result[i].comments = comments.length;
                }
            }else if(type==='3'){  //教学管理者统计
                var query = {period:period,pro:pro};
                result = yield findCourses(query);
                for(var i=0;i<result.length;i++){
                    var cid = result[i].cid;
                    query = {cid:cid.toString()};
                    var comments= yield commentManage.find(query);
                    result[i].comments = comments.length;
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