/**
 * Created by SiuWongLi on 17/5/4.
 */
var express = require('express');
var router = express.Router();
var co = require('co');
var activityManage = require('./../models/activity');
var commentManage = require('./../models/comment');
var lessonManage =  require('./../models/lesson');
var ObjectID = require('mongodb').ObjectID;
var ResponseEntity = require('./../models/resp');

router.get('/:uid/skip/:skip/limit/:limit',function (req,res) {
    //查询我的动态信息，时间按由近到远排序
    var resp = new ResponseEntity();
    co(function *() {
        var {uid,skip,limit} =  req.params;// 用户id
        if(ObjectID.isValid(uid)){
            var selection = {skip:parseInt(skip),limit:parseInt(limit),sort:{date:-1}};  //按时间降序来排序
            var query = {uid:uid};
            var result = yield activityManage.find(query,selection);
            for(var i =0;i<result.data.length;i++){
                var cid = result.data[i].cid;//内容uid
                var type= result.data[i].type;
                var query ={_id:new ObjectID(cid)};
                var data;
                if(type==='comment'){  //查询评论动态
                    data = yield lessonManage.find(query);
                }else if(type==='like'){ //查询点赞某评价动态
                    data = yield commentManage.find(query);
                }
                if(data&&data.length>0){
                    result.data[i].data = data[0];
                }
            }
            resp.setData(result);
        }else{
            resp.setStatusCode(1);
            resp.setMessage('用户uid格式不正确');
        }
        res.json(resp);
    }).catch(err=>{
        resp.setMessage(err);
        resp.setStatusCode(1);
        res.json(resp);
    })
})
router.post('',function (req,res) {

})
router.put('',function (req,res) {
    //修改动态信息

})
module.exports =router;