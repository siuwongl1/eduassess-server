/**
 * Created by SiuWongLi on 17/3/11.
 */
// 基础设置
// =============================================================================

// 调用相关中间件
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//
var http = require('http');
var sockjs = require('sockjs');

var echo = sockjs.createServer({ sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js' });
echo.on('connection', function(conn) {
    conn.on('data', function(message) {
        conn.write(message);
    });
    conn.on('close', function() {});
});

var server = require('http').createServer(app);
echo.installHandlers(server, {prefix:'/echo'});

server.listen(8080);
//multipart
app.use(multipart());

var port = process.env.PORT || 8080;        // 设置端口
// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
// test route to make sure everything is working (accessed at GET http://localhost:8080/ets)
router.get('/', function (req, res) {
    res.json({message: 'Hooray! welcome to our ets api!'});
});
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /ets
app.use('/ets/api', router);        //基础router
var user = require('./app/routers/user');
app.use('/ets/api/user', user);      //用户router
var course = require('./app/routers/course');
app.use('/ets/api/course', course); //课程router
var lesson = require('./app/routers/lesson') //课堂router
app.use('/ets/api/lesson', lesson);
var comment = require('./app/routers/comment');// 评价信息router
app.use('/ets/api/comment', comment);
var remark = require('./app/routers/remark');//评论信息router
app.use('/ets/api/remark', remark);
var activity =  require('./app/routers/activity');//我的动态信息
app.use('/ets/api/activity',activity);

// START THE SERVER
// =============================================================================
// app.listen(port);
console.log('listening port: ' + port);