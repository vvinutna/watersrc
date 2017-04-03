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
      console.log(privilege);
      // const query1 = client.query('SELECT * FROM users WHERE email=($1);', [email]);

      // // Stream results back one row at a time
      // query1.on('row', (row) => {
      //   client.query('INSERT INTO users(first_name, last_name, email, password, privilege) values($1, $2, $3, $4, $5);',
      //   [first_name, last_name, email, password, privilege
      //   ]);
      // });

      // query1.on('error', function(err) {
      //   done();
      //   return res.status(500).json({success: false, data: err});
      // });

      query.on('end', () => {
        done();
        return res.json(results);
      });
    });
    
  });

}