/**
 * Created by SiuWongLi on 17/3/11.
 */
// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

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
    res.json({ message: 'Hooray! welcome to our ets api!' });
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /ets
app.use('/ets/api', router);
var user = require('./app/routers/user');
app.use('/ets/api/user',user);
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('listening port: ' + port);