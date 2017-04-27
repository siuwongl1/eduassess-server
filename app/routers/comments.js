/**
 * Created by SiuWongLi on 17/4/27.
 * 评论集相关
 */
var express = require('express');
var router = express.Router();
var co = require('co');
var commentManage = require('./../models/comment');
var ObjectID = require('mongodb').ObjectID;
var ResponseEntity = require('./../models/resp');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

router.get('/:lid',multipartMiddleware,function (req,res) {
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
module.export = router;