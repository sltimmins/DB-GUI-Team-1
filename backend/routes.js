const pool = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = function routes(app, logger) {
  // GET /
  app.get('/', (req, res) => {
    res.status(200).send('Go to 0.0.0.0:3000.');
  });

  // POST /reset
  app.post('/reset', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if (err){
        console.log(connection);
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query
        connection.query('drop table if exists test_table', function (err, rows, fields) {
          if (err) { 
            // if there is an error with the query, release the connection instance and log the error
            connection.release()
            logger.error("Problem dropping the table test_table: ", err); 
            res.status(400).send('Problem dropping the table'); 
          } else {
            // if there is no error with the query, execute the next query and do not release the connection yet
            connection.query('CREATE TABLE `db`.`test_table` (`id` INT NOT NULL AUTO_INCREMENT, `value` VARCHAR(45), PRIMARY KEY (`id`), UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);', function (err, rows, fields) {
              if (err) { 
                // if there is an error with the query, release the connection instance and log the error
                connection.release()
                logger.error("Problem creating the table test_table: ", err);
                res.status(400).send('Problem creating the table'); 
              } else { 
                // if there is no error with the query, release the connection instance
                connection.release()
                res.status(200).send('created the table'); 
              }
            });
          }
        });
      }
    });
  });

  // POST /multplynumber
  app.post('/multplynumber', (req, res) => {
    console.log(req.body.product);
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('INSERT INTO `db`.`test_table` (`value`) VALUES(\'' + req.body.product + '\')', function (err, rows, fields) {
          connection.release();
          if (err) {
            // if there is an error with the query, log the error
            logger.error("Problem inserting into test table: \n", err);
            res.status(400).send('Problem inserting into table'); 
          } else {
            res.status(200).send(`added ${req.body.product} to the table!`);
          }
        });
      }
    });
  });

  // GET /checkdb
  app.get('/values',  (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('SELECT value FROM `db`.`test_table`', function (err, rows, fields) {
          connection.release();
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else {
            res.status(200).json({
              "data": rows
            });
          }
        });
      }
    });
  });
  /*
  route to create a new user account and add it to the database
  Uses bcrypt to encrypt the user's password
  accepts formatting:
  {"name":"ashockley66", "password":"alex66","firstName":"alex","lastName":"shockley","email":"exampleEmail@email.com"} passed in Body
  */

  //TODO reroute the user to a login page after a successful account creation
  app.post('/users/create_account', async(req, res) => {
      pool.getConnection(async function(err, connection) {

        
        try {
          const salt = await bcrypt.genSalt()
          const hashedPassword = await bcrypt.hash(req.body.password, salt)
          const user = {username:req.body.name, password:hashedPassword, firstName:req.body.firstName, lastName:req.body.lastName, email:req.body.email, candidate:req.body.candidate};
          res.json({
            user:user.username,
            password:user.password,
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            candidate:user.candidate
          })
          connection.query("insert into users (firstName, lastName, email, candidate, username, password) VALUES (?, ?, ?, ?, ?, ?)", [user.firstName,user.lastName,user.email,user.candidate,user.username,user.password])
        } catch {
          req.status(500);
        }
        
    })
  });

  /*
    Route that tests the JWT functionality, For future just use middleware authenticateToken
    and it will work for any route.
  */
  app.get('/showMyEmail', authenticateToken, (req,res) => {
    pool.getConnection(function(err,connection) {
      connection.query("Select email FROM users WHERE username = ?", req.user.username, function(err,result,fields) {
        res.send(result);
      })
    })
  })
  /*Route to login, accepts formatting:
     {"username":"ashockley66","password":"alex66"} passed in Body

    Querys server to select the users where the username = username,
    verifies that the password is correct, If so it return a JSON 
    that contains the users JWT value which allows them to access certain other routes
    (as of now the test route is /showMyEmail). If the user enters an incorrect password,
    program will return a screen that just says that the password is incorrect.
    If there is an error, the route will display a status 500 
     */

    //TODO figure out how to pass the JWT to frontend without displaying it to the user
    //TODO handle the case where the user enters the incorrect password better
    //TODO if the username is correct, move them back to homepage using the JWT
  app.post('/users/login', async(req,res) => {
    
    pool.getConnection(async function(err,connection) {
      const userToFind = {username:req.body.username, password:req.body.password}
      connection.query("select username,password FROM users WHERE username = ?", userToFind.username , async function(err,result,fields){
        var usersJSON = JSON.parse(JSON.stringify(result));
        if(usersJSON == null) {
          return res.status(400).send("Could not find user")
        }

        try {
          
          if ( await bcrypt.compare(userToFind.password, usersJSON[0].password)) {
            //res.send("Logged in!")
            const accessToken = jwt.sign(userToFind, process.env.ACCESS_TOKEN_SECRET)
            res.json({accesstoken: accessToken})
          } else {
            res.send("You really thought I would let u in without the right password buddy?")
          }
        } catch {
          req.status(500).send();
        }
      })
      
    })
  })

  /*
    Format of token to pass in headers is as follows:
      Authorization: Bearer <token_value>
  */

  //Middleware to authenticate the user's token
  //Sends a 401 status if the user token does not match
  function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
      if(err) return res.sendStatus(403)
      req.user = user
      next()
    })
  }

}