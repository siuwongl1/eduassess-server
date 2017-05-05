/**
 * Created by SiuWongLi on 17/4/7.
 */
var express = require('express');
var router = express.Router();
var co = require('co');
var courseManage = require('./../models/course');
var ObjectID = require('mongodb').ObjectID;
var ResponseEntity = require('./../models/resp');

router.get('/:id', (req, res) => {
    //根据课程id查询详细信息
    var resp = new ResponseEntity();
    co(function *() {
        var query = {};
        var uid = req.params.id;
        if (ObjectID.isValid(uid)) {
            query = {_id: new ObjectID(uid)};
            var result = yield courseManage.find(query);
            resp.setStatusCode(0);
            resp.setData(result);
        } else {
            resp.setMessage('uid格式不正确');
            resp.setStatusCode(1);
        }
        res.json(resp);
    }).catch((err) => {
        resp.setMessage(err);
        resp.setStatusCode(1);
        res.json(resp);
    })
})
router.get('/teacher/:uid',(req,res)=>{
    // 根据教师uid来查询该教师的课程
    var resp = new ResponseEntity();
    co(function *() {
        var {uid} = req.params;
        if(!ObjectID.isValid(uid)){
            resp.setMessage("uid格式不正确");
            resp.setStatusCode(1);
        }else{
            var query = {uid:new ObjectID(uid)};
            var result = yield courseManage.find(query);
            resp.setData(result);
            resp.setStatusCode(0);
        }
        res.json(resp);
    }).catch((err)=>{
        resp.setStatusCode(1);
        resp.setMessage(err);
        res.json(resp);
    })
})
router.get('/teacher/:uid/period/:period',(req,res)=>{
    // 根据用户id和学期来查询相关课程
    var resp = new ResponseEntity();
    co(function *() {
        var {uid,period} = req.params;
        if(ObjectID.isValid(uid)){
            var query = {uid:ObjectID(uid),period:period};
            var result = yield courseManage.find(query);
            resp.setData(result);
            resp.setStatusCode(0);
        }else{
            resp.setStatusCode(1);
            resp.setMessage("uid格式不正确");
        }
        res.json(resp);
    }).catch((err)=>{
        resp.setStatusCode(1);
        resp.setMessage(err);
        res.json(resp);
    })
})
router.get('/student/:sid/period/:period',(req,res)=>{
    //根据学生id来获取课程
    var resp = new ResponseEntity();
    co(function *() {
        var {sid,period} = req.params;
        if(ObjectID.isValid(sid)){
            var query  ={period:period,'students.uid':sid,'students.type':1};
            var result = yield courseManage.find(query);
            resp.setData(result);
        }else{
            resp.setMessage('uid格式不正确');
            resp.setStatusCode(1);
        }
        res.json(resp);
    }).catch((err)=>{
        resp.setMessage(err);
        resp.setStatusCode(1);
        res.json(resp);
    })
})
router.get('/pro/:pro/cls/:cls/period/:period', (req, res) => {
    //根据专业,班级查询相关课程
    var resp = new ResponseEntity();
    co(function *() {
        var {pro, cls, period} = req.params;
        var query = {pro:pro, cls:cls, period: period};
        var result = yield courseManage.find(query);
        resp.setData(result);
        res.json(resp);
    }).catch((err) => {
        resp.setMessage(err);
        resp.setStatusCode(1);
        res.json(resp);
    })
})
router.post('', (req, res) => {
    //添加课程
    var resp = new ResponseEntity();
    co(function *() {
        var {pro, cls, period, name, uid,tname} = req.body;
        resp.setStatusCode(1);
        if (!pro) {
            resp.setMessage("专业名称不能为空");
        } else if (!cls) {
            resp.setMessage("班级名称不能为空");
        }else if(!period){
            resp.setMessage("学期不能为空");
        }else if(!name){
            resp.setMessage("课程名称不能为空");
        }else if(!uid||!ObjectID.isValid(uid)){
            resp.setMessage("教师uid格式不正确");
        }else if(!tname){
            resp.setMessage("教师名称不能为空");
        }else {
            var data = {pro:pro,cls:cls,period:period,name:name,tname:tname,uid:new ObjectID(uid),date:new Date()};
            var result =yield courseManage.add(data);
            resp.setStatusCode(0);
            resp.setData(result.id);
        }
        res.json(resp);
    }).catch((err) => {
        resp.setStatusCode(1);
        resp.setMessage(err);
        res.json(resp);
    })
})
router.put('/:id', (req, res) => {
    //课程信息修改
    var resp = new ResponseEntity();
    co(function *() {
        var id = req.params.id;
        var {pro, cls, period, name} = req.body;
        resp.setStatusCode(1);
        if (!pro) {
            resp.setMessage("专业名称不能为空");
        } else if (!cls) {
            resp.setMessage("班级名称不能为空");
        }else if(!period){
            resp.setMessage("学期不能为空");
        }else if(!name){
            resp.setMessage("课程名称不能为空");
        }else if(!ObjectID.isValid(id)){
            resp.setMessage("uid格式不正确");
        }else{
            var query = {_id:new ObjectID(id)};
            var data ={pro:pro,cls:cls,period:period,name:name};
            yield courseManage.update(query,data);
            resp.setStatusCode(0);
        }
        res.json(resp);
    }).catch((err)=>{
        resp.setStatusCode(1);
        resp.setMessage(err);
        res.json(resp);
    })
})
router.get('/class/:cid',(req,res)=>{
    //查询相应课程未处理的申请列表 ，type为0时为未处理，type为1表示已通过申请
    var resp = new ResponseEntity();
    co(function *() {
        var {cid}  = req.params;
        if(ObjectID.isValid(cid)){
            var query = {_id:new ObjectID(cid),'students.type':0};  //根据课程uid查询未处理的加入班级申请
            var result= yield courseManage.find(query);
            if(result&&result[0]&&result[0].students){
                var students= result[0].students;
                resp.setData(students);
            }
        }else{
            resp.setStatusCode(1);
            resp.setMessage('课程uid格式不正确');
        }
        res.json(resp);
    }).catch(err=>{
        resp.setStatusCode(1);
        resp.setMessage(err);
        res.json(resp);
    })
})
router.post('/class/:cid',(req,res)=>{
    //申请加入班级
    var resp = new ResponseEntity();
    co(function *() {
        var cid = req.params.cid;
        var {uid,name,pro,cls,sex,schoolId} =req.body;
        if(ObjectID.isValid(cid)){
            if(ObjectID.isValid(uid)){
                var query  = {_id:new ObjectID(cid),'students.uid':{$ne:uid}};
                var data = {students:{uid:uid,name:name,type:0,pro:pro,cls:cls,sex:sex,schoolId:schoolId}};
                //加入课程的申请列表
                var result = yield courseManage.push(query,data);
                resp.setData(result.result);
                resp.setStatusCode(0);
            }else{
                resp.setStatusCode(1);
                resp.setMessage('uid格式不正确');
            }
            res.json(resp);
        }else{
            resp.setStatusCode(1);
            resp.setMessage('课程id格式不正确');
        }
        res.json(resp);
    }).catch((err)=>{
        resp.setStatusCode(1);
        resp.setMessage(err);
        res.json(resp);
    })
})
router.put('/class/:cid',(req,res)=>{
   //加入班级审核,可接受批量处理
    var resp = new ResponseEntity();
    co(function *() {
        var cid = req.params.cid;
        var {students} = req.body;
        if(ObjectID.isValid(cid)){
            try{
                students = JSON.parse(students);
                for(var i=0;i<students.length;i++){
                    var value = students[i];
                    if(ObjectID.isValid(value.uid)){
                        var query = {_id:new ObjectID(cid),'students.uid':value.uid};
                        var update = {'students.$.type':1};
                        var affected = yield courseManage.update(query,update);
                        resp.setData(affected.result);
                    }
                }
            }catch(err){
                resp.setStatusCode(1);
                resp.setMessage(err);
            }
        }else{
            resp.setStatusCode(1);
            resp.setMessage('课程id格式不正确');
        }
        res.json(resp);
    }).catch((err)=>{
        resp.setStatusCode(1);
        resp.setMessage(err);
        res.json(err);
    })
})
router.delete('/:id', (req, res) => {
    //课程信息删除
    var resp =new ResponseEntity();
    co(function *() {
        var id = req.params.id;
        if(ObjectID.isValid(id)){
            var query = {_id:new ObjectID(id)};
            yield courseManage.delete(query);
            resp.setStatusCode(0);
        }else{
            resp.setMessage("uid格式不正确");
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