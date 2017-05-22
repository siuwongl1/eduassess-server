/**
 * Created by SiuWongLi on 17/5/8.
 */
var express = require('express');
var router = express.Router();
var co = require('co');
var noticeManage = require('./../models/notice');
var ObjectID = require('mongodb').ObjectID;
var ResponseEntity = require('./../models/resp');
var verifyTokenUtil = require('./../utils/VerifyTokenUtil');

router.get('/:originId',function (req,res) {
    //根据用户uid和查看状态来查询消息（已查看的不返回）
    var resp = new ResponseEntity();
    co(function *() {
        var payload = yield verifyTokenUtil.verifyToken(req.cookies.token);
        var uid =  payload.uid;
        var query = {origin:uid,checked:false}; //未查看的消息通知
        var result = yield noticeManage.find(query);
        resp.setData(result);
        res.json(resp);
    }).catch(err=>{
        resp.setError(err);
        res.json(resp);
    })
})
router.put('/:id',function (req,res) {
    //修改查看状态
    var resp =new ResponseEntity();
    co(function *() {
        var {id} = req.params;
        var payload=  yield verifyTokenUtil.verifyToken(req.cookies.token);
        if(ObjectID.isValid(id)){
            var query = {_id:new ObjectID(id)};
            var update ={$set:{checked:true}};
            var result = yield noticeManage.update(query,update);
            resp.setData(result);
        }else{
            resp.setMessage('消息uid格式不正确');
            resp.setStatusCode(1);
            res.json(resp);
        }
    }).catch(err=>{
        resp.setError(err);
        res.json(resp);
    })
})
module.exports = router;