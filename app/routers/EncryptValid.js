/**
 * Created by SiuWongLi on 17/5/16.
 */
var express = require('express');
var router = express.Router();
var co = require('co');
var Common = require('./../utils/Common')
var userManage = require("./../models/user");
var ObjectID = require('mongodb').ObjectID;
var md5 =require('md5')

router.get('/decrypt',function (req,res) {
    co(function *() {
        var {password} = req.query;
        var result = yield Common.decrypt(password);
        res.send(result);
    }).catch(err=>{
        console.log(err)
    })
})
module.exports = router;