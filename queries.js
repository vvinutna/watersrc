const connectionString = 'postgres://zsullibbcjradi:31f72543073d43fb185647654c64ce799395244eb1adc99dec75598472a603a8@ec2-174-129-37-15.compute-1.amazonaws.com:5432/d3thlija746umv?ssl=true';
var pg = require('pg');

module.exports = function(app) {

  app.post('/api/users', (req, res, next) => {
    const results = [];
    // Grab data from http request
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const password = req.body.password;
    const privilege = req.body.privilege;
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
      // Handle connection errors
      if(err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
      }

      const query = client.query('UPDATE users SET first_name=($1), last_name=($2), password=($3), privilege=($4) WHERE email=($5);', [first_name, last_name, password, privilege, email]);

      query.on('end', () => {
        done();
        return res.json(results);
      });
    });
    
  });

  app.post('/api/sourcereports', (req, res, next) => {
    const results = [];
    // Grab data from http request
    const data = {
      latitude: req.body.latitude, 
      longitude: req.body.longitude, 
      water_source_type: req.body.water_source_type, 
      water_condition: req.body.water_condition,
      email: req.body.email
    };

    const date = new Date();

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
      // Handle connection errors
      if(err) {
        done();
        return res.status(500).json({success: false, data: err});
      }
      // SQL Query > Insert Data
      const query = client.query('INSERT INTO sourcereports(latitude, longitude, water_source_type, water_condition, timestamp, email) values($1, $2, $3, $4, $5, $6) RETURNING *;',
      [data.latitude, data.longitude, data.water_source_type, data.water_condition, date, data.email]);

      query.on('error', function(jqXHR, textStatus, errorThrown) {
        done();
        return res.status(500).json({success: false, data: err});
      });

      query.on('end', () => {
        done();
        return res.json(results);
      });
    });
    
  });

  app.post('/api/qualityreports', (req, res, next) => {
    const results = [];
    // Grab data from http request
    const data = {
      latitude: req.body.latitude, 
      longitude: req.body.longitude, 
      water_source_type: req.body.water_source_type, 
      virus_ppm: req.body.virus_ppm,
      contaminant_ppm: req.body.contaminant_ppm,
      email: req.body.email
    };

    const date = new Date();

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
      // Handle connection errors
      if(err) {
        done();
        return res.status(500).json({success: false, data: err});
      }
      // SQL Query > Insert Data
      const query = client.query('INSERT INTO qualityreports(latitude, longitude, water_source_type, virus_ppm, contaminant_ppm, timestamp, email) values($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
      [data.latitude, data.longitude, data.water_source_type, data.virus_ppm, data.contaminant_ppm, date, data.email]);

      query.on('error', function(jqXHR, textStatus, errorThrown) {
        done();
        return res.status(500).json({success: false, data: err});
      });

      query.on('end', () => {
        done();
        return res.json(results);
      });
    });
    
  });

  app.post('/api/historicalGraph', (req, res, next) => {

    const results = [];
    const data = {latitude: req.body.latitude, longitude: req.body.longitude, year: req.body.year, ppm_type: req.body.ppm_type};
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    console.log("data latitude: " + data.latitude);

    
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
        res.render('pages/historicalReportGraph', { 
          results: results, 
          email: req.user.email,
          privilege: req.user.privilege
        });
      });
    });


    // console.log("at api historical graph");
    
    // const results = [];

    // const data = {latitude: req.body.latitude, longitude: req.body.longitude, year: req.body.year, ppm_type: req.body.ppm_type};
    
    // // Get a Postgres client from the connection pool
    // pg.connect(connectionString, (err, client, done) => {
    //   // Handle connection errors
    //   if(err) {
    //     done();
    //     console.log(err);
    //     return res.status(500).json({success: false, data: err});
    //   }

    //   console.log("latitude: " + data.latitude);
      
    //   // SQL Query > Select Data
    //   // const query = client.query('SELECT * FROM qualityreports WHERE latitude=($1) and longitude=($2) and extract(year from timestamp)=($3);', [data.latitude, data.longitude, data.year]);
    //   //const query = client.query('SELECT * FROM qualityreports WHERE latitude=($1)', [data.latitude]);
    //   const query = client.query('SELECT * FROM qualityreports');
    //   // Stream results back one row at a time


    //   query.on('row', (row) => {
    //     console.log("how many");
    //     console.log("this row: " + row);
    //     results.push(row);
    //   });

    //   console.log("results: " + results);

    //   query.on('end', () => {
    //     done();
    //     res.writeHead(200, {'Content-Type': 'text/plain'});
    //     res.write(JSON.stringify(results.rows, null, " ") + "\n");
    //     res.end();
    //     console.log("is it sent");
    //   });

    // });



});

  app.post('/viewHistoricalGraph', (req, res, next) => {

    const results = [];
    const data = {latitude: req.body.latitude, longitude: req.body.longitude, year: req.body.year, ppm_type: req.body.ppm_type};
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    console.log("data latitude: " + data.latitude);

    
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
        res.render('pages/historicalReportGraph', { 
          results: results, 
          email: req.user.email,
          privilege: req.user.privilege
        });
      });
    });

  });



}