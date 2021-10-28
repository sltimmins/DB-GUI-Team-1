const pool = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

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
  {"username":"yes", "password":"pass","firstName":"cyborg","lastName":"theThird","email":"bSavage@hotmail.com","candidate":false, "party":"Republican"} passed in Body
  */
  //TODO figure out how to actually await and not just sleep for 250 ms
  //TODO reroute the user to a login page after a successful account creation
  app.post('/users/create_account', async(req, res) => {
    candidateId = -1;
    
      pool.getConnection(async function(err, connection) {
        if(err) {
          console.log(err)
          console.log("\nConnection Unsuccessful\n")
        } else {
          console.log("\nConnection successful\n")
        }
        
        if(req.body.candidate) {
    
           console.log("VALUES: ",req.body.firstName, req.body.lastName, req.body.party);
            connection.query("insert into candidates(firstName, lastName, party) values (?, ?,?)", [req.body.firstName, req.body.lastName, req.body.party], function(err,result,fields) {
              if (err) {
                logger.error("Error creating the candidate in candidate table (If you see this uhhhhhh good luck)\n", err);
                res.status(400).send("Error Creating candidate in candidate table");
              }
            })
            connection.query("select candidateId FROM candidates where firstName = ? && lastName = ?", [req.body.firstName, req.body.lastName], function(err,result,fields) {
              if(err) {
                logger.error("Error finding the candidate in candidate table", err);
                res.status(400).send("Error finding candidate")
              } else {
                candidateId = Number(result[0].candidateId)
                console.log("CandidateId: ", candidateId)
              }
            })
          
        } else {
        console.log("User is not a candidate, handling accordingly");
        }
        await sleep(250);
        console.log("Now generatying the user with that candidate Id: ", candidateId)
        try {
          const salt = await bcrypt.genSalt()
          const hashedPassword = await bcrypt.hash(req.body.password, salt)
          const user = {username:req.body.username, password:hashedPassword, firstName:req.body.firstName, lastName:req.body.lastName, email:req.body.email, candidate:req.body.candidate};
          
          if(candidateId == -1) {
            candidateId = null;
          }
          connection.query("insert into users (firstName, lastName, email, candidateId, username, password) VALUES (?, ?, ?, ?, ?, ?)", [user.firstName,user.lastName,user.email,candidateId,user.username,user.password], function(err,result,fields) {
            if(err) {
              logger.error("Error creating user\n",err)
            }
          })
          res.status(200).send({
            success: true,
            msg: 'Please go to 0.0.0.0:8000/users/login to login!'
          })
        } catch {
          res.status(500).send('something went wrong...', );
        }
        connection.release();
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
      connection.release()
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
      console.log("user: ", userToFind)
      connection.query("select username, password, accountNumber, candidateId, firstName, lastName FROM users WHERE username = ?",userToFind.username , async function(err,result,fields){
        if(!result) {
          logger.error("Invalid username or Password")
          res.status(400).send("Invalid username or password")
        }
        var usersJSON = JSON.parse(JSON.stringify(result));
        console.log(usersJSON);
        if(usersJSON.length === 0) {
          return res.status(400).send({
            success: false,
            message: 'Invalid Username or Password'
          })
        }
        else {
          console.log(usersJSON);
          try {
            if ( await bcrypt.compare(userToFind.password, usersJSON[0].password)) {
              //res.send("Logged in!")
              const accessToken = jwt.sign(userToFind, process.env.ACCESS_TOKEN_SECRET)
              res.status(200).send({
                success: true,
                data: {
                  jwt: accessToken,
                  firstName: usersJSON[0].firstName,
                  lastName: usersJSON[0].lastName,
                  username: usersJSON[0].username,
                  user_id: usersJSON[0].accountNumber,
                  candidate: usersJSON[0].candidate
                }
              })
            } else {
              res.status(400).send("You really thought I would let u in without the right password buddy?")
            }
          } catch {
            res.status(500).send('Something went wrong...');
          }
        }
      })
      connection.release()
    })
  })

  app.get('/users/webtoken', authenticateToken, (req,res) => {
    pool.getConnection(function (err,connection) {
      connection.query("select * from users where username = ?", [req.user.username], function(err,result,fields) {
        if(err) {
          res.status(400).send("Error querying database")
        } else{
          res.send(JSON.stringify(result))
        }
      })
      connection.release()
    })

  })

  //Route to search and get information for a user
  app.get('/users/search_user', async(req,res) => {
    pool.getConnection(function(err,connection) {
      const bool = req.body.bool
      if(bool == null){
        connection.query("Select username, firstName, lastName FROM users", function(err,result,fields) {
          res.send(result);
        })
      }
      else {
        connection.query("Select username, firstName, lastName FROM users WHERE candidateID IS NOT NULL", function(err,result,fields){
          res.send(result);
        })
      }
      connection.release();
    })
  })

  app.get('/users/get_user', async(req,res) => {
    pool.getConnection(function(err,connection) {
      const userName = req.body.userName
    
      connection.query("Select username, firstName, lastName, candidateId, bio FROM users WHERE userName = ?", userName, function(err,result,fields) {
        res.send(result);
      })
      connection.release();
    })
  })
  // app.get('/showMyEmail', authenticateToken, (req,res) => {
  //   pool.getConnection(function(err,connection) {
  //     connection.query("Select email FROM users WHERE username = ?", req.user.username, function(err,result,fields) {
  //       res.send(result);
  //     })
  //     connection.release()
  //   })
  // })

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
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

}