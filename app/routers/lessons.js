/**
 * Created by SiuWongLi on 17/4/8.
 * 课堂相关的restful api
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

router.get('/:cid',multipartMiddleware,function (req,res) {
    //根据 course  uid 来查询详细信息
    var resp = new ResponseEntity();
    co(function *() {
        var {cid} = req.params;
        if(ObjectID.isValid(cid)){
            var query = {_id:new ObjectID(cid)};
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
module.exports = router;