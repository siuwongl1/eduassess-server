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
var amqp = require('amqplib/callback_api');
var ResponseEntity = require('./../models/resp');
var noticeManage = require('./../models/notice');

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
        var {uid,name,content,originUid,lid} = req.body;
        if(ObjectID.isValid(cid)&&ObjectID.isValid(uid)){
            var data = {cid:cid,uid:uid,name:name,content:content,lastRemarked:new Date()};
            var result = yield remarkManage.add(data); //添加评论
            var commentAffected = yield commentManage.pushRemark({_id:new ObjectID(cid)},{rid:result.id,name:name,uid:uid});
            var message = {origin:originUid,content:content,lid:lid,name:name,type:'remark',date:new Date(),checked:false};
            var notice = yield noticeManage.add(message);
            message._id = notice.insertedId;
            if(originUid!==uid){
                //获赞动态推送至获赞人消息
                amqp.connect('amqp://localhost', function(err, conn) {
                    conn.createChannel(function (err, ch) {
                        var ex = 'amq.topic';
                        var key = message.origin;
                        var msg = JSON.stringify(message);
                        ch.assertExchange(ex, 'topic', {durable: true});
                        ch.publish(ex, key, new Buffer(msg));
                        setTimeout(function () {
                            conn.close();
                        },500);
                        console.log(err);
                        console.log(" [x] Sent %s:'%s'", key, msg);
                    });
                });
            }
            resp.setData(result);
        }else{
            resp.setMessage('评价uid或评价者uid格式不正确');
            resp.setStatusCode(1);
        }
        res.json(resp);
    }).catch(err=>{
        console.log(err);
        resp.setMessage(err);
        resp.setStatusCode(1);
        res.json(resp);
    })
})
module.exports = router;