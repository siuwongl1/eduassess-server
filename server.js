// 调用相关中间件
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var cors = require('cors');
var jwt = require('express-jwt');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//cookie parser
var cookieParser = require('cookie-parser')
app.use(cookieParser())
//multipart
app.use(multipart());
//cors
var corsOptions = {
    origin: 'http://localhost',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));
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
var activity = require('./app/routers/activity');//我的动态信息
app.use('/ets/api/activity', activity);
var notice = require('./app/routers/notices'); //我的消息
app.use('/ets/api/notice', notice);
var statistic = require('./app/routers/statistics');// 统计信息
app.use('/ets/api/statistics',statistic);


var encrypt = require('./app/routers/EncryptValid');  //加密测试
app.use('/ets/api/encrypt', encrypt);
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('listening port: ' + port);