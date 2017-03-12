/**
 * Created by SiuWongLi on 17/3/11.
 */
// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');


// Mongoose
var url = 'mongodb://localhost:27017/ets';
var connection = mongoose.connect(url);
var User =require("./app/models/user");
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/ets)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our ets!' });
});

// more routes for our API will happen here
router.get('/persons', function (req,res) {
    var selections ='username name type major className';
    User.find().select(selections).exec(function (err,docs) {
        if(err){
            res.json({err:err});
        }else{
            res.json(docs);
        }
    })
})
router.get('/modifyInfo', function (req,res) {
    var person  = {username:'asda'};
    User.update(person,{sex:'男'}, function (err) {
        if(err){
            res.json(err);
        }else{
            res.json({result:'ok'});
        }
    })
})

router.get('/register', function (req, res) {
    var person1 = {username:'asda',name:'wann1'};
    User.save(person1, function (err,docs) {
        if(err){
            if(err.code==11000){
                res.json({result:'该用户已被注册！'})
            }else{
                res.json(err);
            }
        }else{
            res.json({result:'ok'});
        }
    })
})

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /ets
app.use('/ets', router);
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('listening port: ' + port);