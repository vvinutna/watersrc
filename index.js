var pg = require('pg');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var bodyParser = require( 'body-parser' );
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//for passport
var passport = require('passport');
var flash    = require('connect-flash');
var session = require('express-session');

//for passport
require('./config/passport')(passport);
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); 

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const connectionString = 'postgres://zsullibbcjradi:31f72543073d43fb185647654c64ce799395244eb1adc99dec75598472a603a8@ec2-174-129-37-15.compute-1.amazonaws.com:5432/d3thlija746umv?ssl=true';

app.get('/', function(request, response) {
  response.render('home');
});


function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }
    // if they aren't redirect them to the home page
    res.redirect('/');
}

app.get('/dashboard', isLoggedIn, function(request, response, next) {
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    //return res.json(results);
    response.render('pages/dashboard', { 
      email: request.user.email,
      privilege: request.user.privilege
    });
  });
  // response.render('pages/dashboard');
  // Get a Postgres client from the connection pool

});

app.get('/editProfile', isLoggedIn, function(request, response, next) {
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    //return res.json(results);
    response.render('pages/editProfile', { 
      email: request.user.email,
      privilege: request.user.privilege,
      last_name: request.user.last_name,
      first_name: request.user.first_name,
      password: request.user.password
    });
  });
  // response.render('pages/dashboard');
  // Get a Postgres client from the connection pool

});

//for passport
require('./app/routes.js')(app, passport);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


