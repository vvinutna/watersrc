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

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
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

});

app.get('/newSourceReport', isLoggedIn, function(request, response, next) {
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    //return res.json(results);
    response.render('pages/newSourceReport', { 
      email: request.user.email,
      privilege: request.user.privilege,
    });
  });

});

app.get('/viewSourceReports', isLoggedIn, function(request, response, next) {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM sourcereports');
    // Stream results back one row at a time
    query.on('row', (row) => {
      console.log(row);
      results.push(row);
    });


    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      //return res.json(results);
      response.render('pages/viewSourceReports', { 
        results: results, 
        email: request.user.email,
        privilege: request.user.privilege
      });
    });
  });
});

app.get('/newQualityReport', isLoggedIn, function(request, response, next) {
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    //return res.json(results);
    response.render('pages/newQualityReport', { 
      email: request.user.email,
      privilege: request.user.privilege,
    });
  });

});


app.get('/viewQualityReports', isLoggedIn, function(request, response, next) {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM qualityreports');
    // Stream results back one row at a time
    query.on('row', (row) => {
      console.log(row);
      results.push(row);
    });


    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      //return res.json(results);
      response.render('pages/viewQualityReports', { 
        results: results, 
        email: request.user.email,
        privilege: request.user.privilege
      });
    });
  });
});

app.get('/viewMap', isLoggedIn, function(request, response, next) {
  const resultsQuality = [];
  const resultsSource = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM qualityreports');
    // Stream results back one row at a time
    query.on('row', (row) => {
      console.log(row);
      resultsQuality.push(row);
    });

    query.on('end', () => {
      done();
    });

    const query1 = client.query('SELECT * FROM sourcereports');

    query1.on('row', (row) => {
      console.log(row);
      resultsSource.push(row);
    });

    // After all data is returned, close connection and return results
    query1.on('end', () => {
      done();
      //return res.json(results);
      response.render('pages/map', { 
        resultsQuality: resultsQuality,
        resultsSource: resultsSource, 
        email: request.user.email,
        privilege: request.user.privilege
      });
    });
  });
});

app.get('/viewHistoricalReport', isLoggedIn, function(request, response, next) {
    response.render('pages/historicalReport', {
      email: request.user.email,
      privilege: request.user.privilege
    });
});

app.get('/viewHistoricalReportGraph', (req, res, next) => {
    res.render('pages/historicalReportGraph', {
      results: "null",
      email: req.user.email,
      privilege: req.user.privilege
    })
});


//for passport
require('./app/routes.js')(app, passport);

require('./queries.js')(app);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


