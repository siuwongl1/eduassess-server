/**
 * Created by SiuWongLi on 17/3/11.
 */
// 基础设置
// =============================================================================

// 调用相关中间件
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // 设置端口

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
// test route to make sure everything is working (accessed at GET http://localhost:8080/ets)
router.get('/', function(req, res) {
    res.json({ message: 'Hooray! welcome to our ets api!' });
});
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /ets
app.use('/ets/api', router);        //基础router
var user = require('./app/routers/user');
app.use('/ets/api/user',user);      //用户router
var course = require('./app/routers/course') ;
app.use('/ets/api/course',course); //课程router
var lessons  = require('./app/routers/lessons');
app.use('/ets/api/lessons',lessons);
var lesson = require('./app/routers/lesson') //单个课堂router
app.use('/ets/api/lesson',lesson);
var comment = require('./app/routers/comment');// 单个评论信息router
app.use('/ets/api/comment',comment);
var comments = require('./app/routers/comments')
app.use('/ets/api/comments',comments);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('listening port: ' + port);