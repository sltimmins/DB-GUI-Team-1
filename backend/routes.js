const pool = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const fastcsv = require("fast-csv");
const path = require("path");
const fs = require("fs");
const { waitForDebugger } = require('inspector');    

module.exports = function routes(app, logger) {
  // GET /
  app.get('/', (req, res) => {
    res.status(200).send('Go to 0.0.0.0:3000.');
  });

/*
accepts formatting candidateID in params and returns all the years that the candidate was in an election
*/
  app.get('/candidate/years', (req,res)=>{
    ID = req.param('candidateID');

    pool.getConnection(function(err,connection) {
      try {
        connection.query('select year from elections where name = \"official\" and (democraticCandidate = ? or republicanCandidate = ? or libertarianCandidate = ? or greenCandidate = ?);', [ID,ID,ID,ID], function(err,result,fields) {
          if(err) {
            throw 'Error in SQL syntax';
          }
          res.send(JSON.parse(JSON.stringify(result)));
        })
      } catch (e) {
        logger.error('Error querying database for year given candidate ID: ', ID);
        res.status(400).send('Something went Wrong!')
      }

      connection.release();
    })
  })

  /*
  route to create a new user account and add it to the database
  Uses bcrypt to encrypt the user's password
  accepts formatting:
  {"username":"yes", "password":"pass","firstName":"cyborg","lastName":"theThird","email":"bSavage@hotmail.com","candidate":false, "party":"Republican"} passed in Body
  */
  //TODO figure out how to actually await and not just sleep for 250 ms
  //TODO reroute the user to a login page after a successful account creation
  app.post('/users/create_account', async(req, res) => {
    let candidateId = -1;
    
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
          const user = {username:req.body.username, password:hashedPassword, firstName:req.body.firstName, lastName:req.body.lastName, email:req.body.email, candidate:req.body.candidate, party: req.body.party};
          
          if(candidateId == -1) {
            candidateId = null;
          }
          connection.query("insert into users (firstName, lastName, email, candidateId, username, password, party) VALUES (?, ?, ?, ?, ?, ?, ?)", [user.firstName,user.lastName,user.email,candidateId,user.username,user.password, user.party], function(err,result,fields) {
            if(err) {
              logger.error("Error creating user\n",err)
            }
            res.status(200).send({
              success: true,
              id: result.insertId,
              candidateId: candidateId,
              msg: 'Please go to 0.0.0.0:8000/users/login to login!'
            })
          })
        } catch(e) {
          res.status(500).send('something went wrong...', );
        }
        connection.release();
    })
  });
  
  // route to get customElections
  app.get('/customElections', authenticateToken, async (req,res) => {
    pool.getConnection(function(err,connection) {
      try {
      connection.query("Select accountNumber FROM users WHERE username = ?", req.user.username, function(err,result,fields) {
        accountNums = JSON.parse(JSON.stringify(result))
          connection.query('select name,year from elections where createdBy = ?', accountNums[0]['accountNumber'], function(err,result,fields) {
            res.send(JSON.parse(JSON.stringify(result)))
          })
        
      })
    } catch(e) {
      logger.error("Error getting custom election for username: " + req.user.username)
    }
      connection.release()
    })
  })

  // route to get customElectionYears
  app.get('/customElectionYears', (req,res) => {
    pool.getConnection(function(err,connection) {
      
        try {
        connection.query("select electionId,year from elections where name = \"official\"",function(err,result,fields) {
          try {
          if(err) {
            logger.error(err)
            res.status(400).send('Oopsies')
          } else {
            res.send(JSON.parse(JSON.stringify(result)))
          }
        } catch(e) {
          logger.error('Error getting valid years')
        }
        })
      } catch(e) {
        logger.error('No elections associated with that username')
        res.send("No elections associated with the username: " + req.param('username'))
      }
      
      connection.release()
    })
  })

  /*
    accepts formatting year,[electionName] in params. SHOULD send a file to frontend
  */
  app.get('/saveCSV', async(req,res) => {
    electionName = req.param('electionName')
    if(!electionName) {
      electionName = "official"
    }
    const ws = fs.createWriteStream("Election.csv");
    console.log(req.param('year'), req.param('electionName'))
    pool.getConnection( function(err,connection) {
      connection.query('select s.name, ed.republicanVotes, ed.democraticVotes, ed.greenVotes, ed.libertarianVotes, ed.otherVotes from electionData ed join elections e on e.electionId = ed.electionId join states s on s.stateId = ed.stateId join users u on u.accountNumber = e.createdBy where e.year = ? and e.name = ?; ', [req.param('year'), electionName],function(err,result,fields) {

        const jsonData = JSON.parse(JSON.stringify(result))
        console.log(jsonData)
        fastcsv
        .write(jsonData, { headers: true })
        .on("finish", function() {
        console.log("Write to Temp.csv successfully!");
        }).pipe(ws)
        res.sendFile(path.join(__dirname, '/Election.csv'))
          // try {
          //   fs.unlinkSync(path.join(__dirname,'/Temp.csv'))
          //   console.log('file Deleted')
          //   //file removed
          // } catch(err) {
          //   console.log('ERROR DELETING FILE')
          //   console.log(err)
          // }
        
        
        
      })
      connection.release()
    })

  })

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

  // route to get candidate's firstName, lastName, party
  app.get("/elections/candidates", (req,res) =>{
    pool.getConnection(function(err,connection) {
      connection.query("select firstName,lastName,party from candidates c join elections e on (e.democraticCandidate = c.candidateId or e.republicanCandidate = c.candidateId or e.greenCandidate = c.candidateId or e.libertarianCandidate = c.candidateId) where year = ? and name = \'official\'", req.param('year'),function(err,result,fields) {
       if(err) {
         logger.error("Something went wrong!",err);
         res.status(400).send("Something went wrong!");
       } else {
         res.send(JSON.parse(JSON.stringify(result)))
       }
       connection.release();
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
      console.log("user: ", userToFind)
      
      connection.query("select username, password, accountNumber, candidateId, firstName, lastName, uuid FROM users WHERE username = ?",userToFind.username , async function(err,result,fields){
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
                  candidate: usersJSON[0].candidate,
                  uuid: usersJSON[0].uuid
                }
              })
            } else {
              res.status(400).send("You really thought I would let u in without the right password buddy?")
            }
          } catch(e) {
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
  app.post('/users/search_user', async(req,res) => {
    pool.getConnection(function(err,connection) {
      const getWho = req.body.allUsers;
      if(getWho === 1) {
        connection.query("Select accountNumber, username, firstName, candidateId, lastName, uuid, party FROM users", function(err,result,fields) {
          res.send(result);
        })
      } else if(getWho === 2) {
        connection.query("Select candidateId, firstName, lastName, party, uuid FROM candidates", function(err,result,fields){
          res.send(result);
        })
      } else {
        connection.query("Select accountNumber, username, firstName, lastName, uuid, party FROM users WHERE candidateId is NULL", function(err,result,fields){
          res.send(result);
        })
      }
      connection.release();
    })
  })

  // route to get user's info
  app.get('/users/get_user', async(req,res) => {  
    pool.getConnection(function(err,connection) {
      const userName = req.body.userName
    
      connection.query("Select username, firstName, lastName, candidateId, bio FROM users WHERE userName = ?", userName, function(err,result,fields) {
        res.send(result);
      })
      connection.release();
    })
  })

// user can update their bio 
// ex: update users set bio = 'testing' where username = 'mh';
app.put('/user/bio', async(req,res) => {
  const bio = req.body.bio
  const username = req.body.username
  pool.getConnection(function(err,connection) {
    connection.query("update users set bio = ? where username = ?", [bio,username], function(err,result,fields) {
      res.send(result);
    })
    connection.release();
  })
})

// user can update their firstName 
// ex: update users set firstName = 'hii' where username = 'mh';
app.put('/user/firstname', async(req,res) => {
  const firstName = req.body.firstName
  const username = req.body.username
  pool.getConnection(function(err,connection) {
    connection.query("update users set firstName = ? where username = ?", [firstName,username], function(err,result,fields) {
      res.send(result);
    })
    connection.release();
  })
})

// user can update their lastName 
// ex: update users set lastName = 'bye' where username = 'mh';
app.put('/user/lastname', async(req,res) => {
  const lastName = req.body.lastName
  const username = req.body.username
  pool.getConnection(function(err,connection) {
    connection.query("update users set lastName = ? where username = ?", [lastName,username], function(err,result,fields) {
      res.send(result);
    })
    connection.release();
  })
})

// user can update their email 
// ex: update users set email = 'hi@bye.come' where username = 'mh';
app.put('/user/email', async(req,res) => {
  const email = req.body.email
  const username = req.body.username
  pool.getConnection(function(err,connection) {
    connection.query("update users set email = ? where username = ?", [email,username], function(err,result,fields) {
      res.send(result);
    })
    connection.release();
  })
})

// user can update their password 
// ex: update users set password = 'newpassword' where username = 'mh';
app.put('/user/changePassword', async(req,res) => {
  const password = req.body.password
  const username = req.body.username
  pool.getConnection(function(err,connection) {
    connection.query("update users set password = ? where username = ?", [password,username], function(err,result,fields) {
      res.send(result);
    })
    connection.release();
  })
})


// CREATING NEW CUSTOM ELECTION
/*
  Returns an array of json objects that contain data in the following format:
  {
        "state": "Vermont",
        "shortName": "VT",
        "winner": "D",
        "EV": 3
    } 
    - where EV = electoral Votes, R = republican, D = democrat, G = green, L = libertarian, O = other
    - accepts formatting {"createdBy":<accountNumber>, [name: electionName]} in params
  */

/*
[
  { stateId: 1, republicanVotes: 0,  democraticVotes: 0, greenVotes: 0, libertarianVotes: 0, otherVotes: 0, electionId: 1, year: 2020, createdBy: 11, name: "official"}
]
*/
app.post('/addCustomElection',(req,res) => {

  pool.getConnection(async function(err,connection) {

    if(err) {
      res.status(300).send()
    }

    // variables
    const stateId = req.body.stateId;
    const republicanVotes = req.body.republicanVotes;
    const democraticVotes = req.body.democraticVotes;
    const greenVotes = req.body.greenVotes;
    const libertarianVotes = req.body.libertarianVotes;
    const otherVotes = req.body.otherVotes;
    const electionId = req.body.electionId;
    const year = req.body.year;
    const democraticCandidate = req.body.democraticCandidate;
    const republicanCandidate = req.body.republicanCandidate;
    const greenCandidate = req.body.greenCandidate;
    const libertarianCandidate = req.body.libertarianCandidate;
    const otherCandidate = req.body.otherCandidate;
    const createdBy = req.body.createdBy;
    const name = req.body.name;

    // list of object 
    var payload = [] 

    // populating the payload
    for(let i = 0; i < 50; i ++) {

      //getting the payload & formatting properly
      tempRow = {
        "stateId": stateId,
        "republicanVotes": republicanVotes,
        "democraticVotes": democraticVotes,
        "greenVotes": greenVotes,
        "libertarianVotes": libertarianVotes,
        "otherVotes": otherVotes,
        "electionId": electionId,
        "year": year,
        "democraticCandidate": democraticCandidate,
        "republicanCandidate": republicanCandidate,
        "greenCandidate": greenCandidate,
        "libertarianCandidate": libertarianCandidate,
        "otherCandidate": otherCandidate,
        "createdBy": createdBy,
        "name": name
      }

      payload.push(tempRow)
    }
    // printing what its getting from the frontend
    console.log(payload)

    // elections table query
    electionsQuery = "INSERT INTO elections (year, democraticCandidate, republicanCandidate, greenCandidate, libertarianCandidate, otherCandidate, createdBy, name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    
    // electionData table query
    electionDataQuery = "INSERT INTO electionData (stateId, republicanVotes , democraticVotes , greenVotes , libertarianVotes , otherVotes , electionId) VALUES (?, ?, ?, ?, ?, ?, ?)"

    for(let i = 0; i < 1; i ++) {

      // insert into electionsData table
      connection.query(electionsQuery, [payload[i].year, payload[i].democraticCandidate, payload[i].republicanCandidate, payload[i].greenCandidate, payload[i].libertarianCandidate, payload[i].otherCandidate, payload[i].createdBy, payload[i].name], function(err,result,fields) {
        if(err){
          res.status(400).send("Can't insert elections table")
        }
        res.send(result)
      }) 

      // insert into elections table
      connection.query(electionDataQuery, [payload[i].year, payload[i].democraticCandidate, payload[i].republicanCandidate, payload[i].greenCandidate, payload[i].libertarianCandidate, payload[i].otherCandidate, payload[i].createdBy, payload[i].name], function(err,result,fields) {
        if(err){
          res.status(400).send("Can't insert elections table")
        }
        res.send(result)
      }) 

    }    

    connection.release();

  })
})


app.put('/updatingCustomElection',(req,res) => {

  pool.getConnection(async function(err,connection) {

    if(err) {
      res.status(300).send()
    }

    // variables
    const stateId = req.body.stateId;
    const republicanVotes = req.body.republicanVotes;
    const democraticVotes = req.body.democraticVotes;
    const greenVotes = req.body.greenVotes;
    const libertarianVotes = req.body.libertarianVotes;
    const otherVotes = req.body.otherVotes;
    const electionId = req.body.electionId;
    const year = req.body.year;
    const democraticCandidate = req.body.democraticCandidate;
    const republicanCandidate = req.body.republicanCandidate;
    const greenCandidate = req.body.greenCandidate;
    const libertarianCandidate = req.body.libertarianCandidate;
    const otherCandidate = req.body.otherCandidate;
    const createdBy = req.body.createdBy;
    const name = req.body.name;

    // list of object 
    var payload = [] 

    // populating the payload
    for(let i = 0; i < 50; i ++) {

      //getting the payload & formatting properly
      tempRow = {
        "stateId": stateId,
        "republicanVotes": republicanVotes,
        "democraticVotes": democraticVotes,
        "greenVotes": greenVotes,
        "libertarianVotes": libertarianVotes,
        "otherVotes": otherVotes,
        "electionId": electionId,
        "year": year,
        "democraticCandidate": democraticCandidate,
        "republicanCandidate": republicanCandidate,
        "greenCandidate": greenCandidate,
        "libertarianCandidate": libertarianCandidate,
        "otherCandidate": otherCandidate,
        "createdBy": createdBy,
        "name": name
      }

      payload.push(tempRow)
    }
    // printing what its getting from the frontend
    console.log(payload)

    // elections table query
    electionsQuery = "UPDATE elections SET democraticCandidate = ? and republicanCandidate = ? and greenCandidate = ? and libertarianCandidate = ? and otherCandidate = ? WHERE createdBy = ? AND name = ?)"
    
    // electionData table query
    electionDataQuery = "UPDATE electionData set republicanVotes = ? and democraticVotes = ? and greenVotes = ? and libertarianVotes = ? and otherVotes = ? WHERE stateId = ? AND electionId = ?"

    for(let i = 0; i < 50; i ++) {

      // insert into electionsData table
      connection.query(electionsQuery, [payload[i].democraticCandidate, payload[i].republicanCandidate, payload[i].greenCandidate, payload[i].libertarianCandidate, payload[i].otherCandidate, payload[i].createdBy, payload[i].name], function(err,result,fields) {
        if(err){
          res.status(400).send("Can't insert elections table")
        }
        res.send(result)
      }) 

      // insert into elections table
      connection.query(electionDataQuery, [payload[i].republicanCandidate, payload[i].democraticCandidate, payload[i].greenCandidate, payload[i].libertarianCandidate, payload[i].otherCandidate, payload[i].stateId, payload[i].electionId], function(err,result,fields) {
        if(err){
          res.status(400).send("Can't insert elections table")
        }
        res.send(result)
      }) 

    }    

    connection.release();

  })
})










// adding custome election
// postman test: 0.0.0.0:8000/addCustomElection?year=2020&democraticCandidate=2&republicanCandidate=3&libertarianCandidate=1&greenCandidate=4&otherCandidate=5&createdBy=11&name=2020election
app.post('/addCE', async(req,res) => {
  pool.getConnection(function(err,connection) {
    if(err){
      res.status(300).send()
    }
    console.log(connection)
    const year = req.param('year')
    const democraticCandidate = req.param('democraticCandidate')
    const republicanCandidate = req.param('republicanCandidate')
    const greenCandidate = req.param('greenCandidate')
    const libertarianCandidate = req.param('libertarianCandidate')
    const otherCandidate = req.param('otherCandidate')
    const createdBy = req.param('createdBy')
    const name = req.param('name')

    console.log(year + '    ' + democraticCandidate + '    ' + republicanCandidate + '    ' + greenCandidate + '    ' + libertarianCandidate + '    ' + otherCandidate + '    ' + createdBy + '    ' + name)

    myquery = "INSERT INTO elections (year, democraticCandidate, republicanCandidate, greenCandidate, libertarianCandidate, otherCandidate, createdBy, name) VALUES (?, ?, ?, ?, ?, ?, ?, ?);"
    connection.query(myquery, [year, democraticCandidate, republicanCandidate, greenCandidate, libertarianCandidate, otherCandidate, createdBy, name], function(err,result,fields) {
      if(err){
        res.status(400).send("Can't insert custom election")
      }
      res.send(result)
    })     
    connection.release();
  })
})

// updating custome election
// postman route test: 0.0.0.0:8000/updateCustomElection
// postman body: {"democraticCandidate":2,"createdBy": 11,"name":"election2}
app.put('/updateCE', async(req,res) => {

  const republicanCandidate = req.body.republicanCandidate
  const democraticCandidate = req.body.democraticCandidate
  const greenCandidate = req.body.greenCandidate
  const libertarianCandidate = req.body.libertarianCandidate
  const otherCandidate = req.body.otherCandidate
  const createdBy = req.body.createdBy
  const name = req.body.name

  pool.getConnection(function(err,connection) {

    if(democraticCandidate)
    {
      connection.query("UPDATE elections SET democraticCandidate = ? where createdBy = ? and name = ?", [democraticCandidate,createdBy,name], function(err,result,fields) {
        if(err){
          res.status(400).send("Can't update democraticCandidate")
        }
        res.send(result);
      })
    }

    if(republicanCandidate)
    {
      connection.query("UPDATE elections SET republicanCandidate = ? where createdBy = ? and name = ?", [republicanCandidate,createdBy,name], function(err,result,fields) {
        if(err){
          res.status(400).send("Can't update republicanCandidate")
        }
        res.send(result);
      })
    }

    if(greenCandidate)
    {
      connection.query("UPDATE elections SET greenCandidate = ? where createdBy = ? and name = ?", [greenCandidate,createdBy,name], function(err,result,fields) {
        if(err){
          res.status(400).send("Can't update greenCandidate")
        }
        res.send(result);
      })
    }

    if(libertarianCandidate)
    {
      connection.query("UPDATE elections SET libertarianCandidate = ? where createdBy = ? and name = ?", [libertarianCandidate,createdBy,name], function(err,result,fields) {
        if(err){
          res.status(400).send("Can't update libertarianCandidate")
        }
        res.send(result);
      })
    }

    if(otherCandidate)
    {
      connection.query("UPDATE elections SET otherCandidate = ? where createdBy = ? and name = ?", [otherCandidate,createdBy,name], function(err,result,fields) {
        if(err){
          res.status(400).send("Can't update otherCandidate")
        }
        res.send(result);
      })
    }

    connection.release();
  })
})







// return a candidate's bio
// route link ex: 0.0.0.0:8000/candidate/bio?candidateID=2
app.get('/candidate/bio', async(req,res) => {
  pool.getConnection(function(err,connection) {
    if(err){
      res.status(300).send()
    }
    connection.query("select bio from candidates where candidateID = ?", [req.param('candidateID')], 
    function(err,result,fields) {
      res.send(result);
    })
          
    connection.release();
  })
})

// update a candidate's bio
// route link: 0.0.0.0:8000/candidate/updateBio
// route body: {"candidateID":2,"bio": "hello!"}
app.put('/candidate/updateBio', async(req,res) => {
  const bio = req.body.bio
  const candidateID = req.body.candidateID
  pool.getConnection(function(err,connection) {
    connection.query("update candidates set bio = ? where candidateID = ?", [bio,candidateID], function(err,result,fields) {
      res.send(result);
    })
    connection.release();
  })
})

  //Returns all a users favorite cadidateID's
  //Input is accountNumber as a param
  //return format:
  // [
  //   {
  //       "candidateId": "1"
  //   }
  // ]
  app.get('/favorites/candidates', async(req,res) => {
    pool.getConnection(function(err,connection) {
      if(err){
        res.status(300).send()
      }
      connection.query("SELECT candidateID FROM favorites WHERE accountNumber = ? AND candidateID IS NOT NULL;", [req.param('accountNumber')], 
      function(err,result,fields) {
        res.send(result);
      })
            
      connection.release();
    })
  })

  //Inserts a users favorite candidateId
  //Input is accountNumber and candidateId
  app.post('/favorites/candidates', async(req,res) => {
    pool.getConnection(function(err,connection) {
      if(err){
        res.status(300).send()
      }
      const accountNumber = req.body.accountNumber;
      const candidateId = req.body.candidateId;
      console.log(accountNumber + '    ' + candidateId)
      connection.query("INSERT INTO favorites (accountNumber, candidateID) VALUES (?, ?)", [accountNumber, candidateId], function(err,result,fields) {
        if(err){
          res.status(400).send("Can't insert into favorites!")
        }
        res.send(result)
      })     
      connection.release();
    })
  })

  /*
  Removes a users favorite candidate
  Input is accountNumber and candidateID passed as params
  Ex. {"candidateID":"12", "accountNumber":"125"}
  */
  app.delete('/favorites/candidates', async(req,res) => {
    pool.getConnection(function(err,connection) {
      if(err){
        res.status(300).send()
      }
      console.log(req.body.candidateID+ '     ' + req.body.accountNumber)
      connection.query("DELETE FROM favorites WHERE candidateID = ? AND accountNumber = ?", [req.body.candidateID, req.body.accountNumber], 
      function(err,result,fields) {
        res.send(result);
      })
            
      connection.release();
    })
  })

  app.get('/showMyEmail', authenticateToken, (req,res) => {
    pool.getConnection(function(err,connection) {
      connection.query("Select email FROM users WHERE username = ?", req.user.username, function(err,result,fields) {
        res.send(result);
      })
      connection.release()
    })
  })

  /*
  Returns an array of all a users favorite election years
  Input is account number passed by param
  output:
  {
    "year":"2020"
  }
  EX link: 0.0.0.0:8000/favorites/elections?accountNumber=119
  */
  app.get('/favorites/elections', (req,res) => {
    pool.getConnection(function(err,connection) {
      if(err){
        res.status(300).send()
      }
      connection.query("SELECT year FROM favorites INNER JOIN elections e on favorites.electionID = e.electionId WHERE favorites.accountNumber = ? ORDER BY year DESC", [req.param('accountNumber')], 
      function(err,result,fields) {
        res.send(result);
      })
            
      connection.release();
    })
  })

  /*
  Inserts users favorite election into database
  Input is accountNumber and electionId as body
  ex body: {"electionId":"1", "accountNumber":"119"}
  ex. link: 0.0.0.0:8000/favorites/elections
  */
  app.post('/favorites/elections', async(req,res) => {
    pool.getConnection(function(err,connection) {
      if(err){
        res.status(300).send()
      }
      const accountNumber = req.body.accountNumber
      const electionId = req.body.electionId
      console.log(accountNumber + '    ' + electionId)
      connection.query("INSERT INTO favorites (accountNumber, electionID) VALUES (?, ?)", [accountNumber, electionId], function(err,result,fields) {
        if(err){
          res.status(400).send("Can't insert into favorites!")
        }
        res.send(result)
      })     
      connection.release();
    })
  })

  /*
  Removes a users favorite elections
  Input is accountNumber and electionID as body
  EX body input: {"electionID":"1", "accountNumber":"119"}
  */
  app.delete('/favorites/elections', (req,res) => {
    pool.getConnection(function(err,connection) {
      if(err){
        res.status(300).send()
      }
      connection.query("DELETE FROM favorites WHERE electionID = ? AND accountNumber = ?", [req.body.electionID, req.body.accountNumber], 
      function(err,result,fields) {
        res.send(result);
      })
            
      connection.release();
    })
  })

  app.post('/userReturn', (req,res) => {
    pool.getConnection(function(err,connection) {
      if(err){
        res.status(300).send()
      }

      const isCand = req.body.isCandidate;
      const id = req.body.id;

      try {
        if (isCand) {
          connection.query("SELECT * FROM candidates WHERE candidateId = ?", [id], 
          function(err,result,fields) {
            if(result.length == 0){
              logger.error('Candidate does not exist, ID ' + id);
              res.status(400).send('Candidate does not exist, ID ' + id);
            }
            else {
              res.send(result)
            }
          })
        }
        else {
          connection.query("SELECT * FROM users WHERE accountNumber = ?", [id], 
          function(err,result2,fields) {
            if(result2.length == 0){
              logger.error('User does not exist, ID ' + id);
              res.status(400).send('User does not exist, ID ' + id);
            }
            else {
              res.send(result2)
            }
          })
        }

      } catch (error) {
        logger.error('Could not find ID: ');
        res.status(400).send('Something went Wrong!')
      }  
      connection.release();
    })
  })

  /*
  Returns an array of json objects that contain data in the following format:
  {
        "state": "Vermont",
        "shortName": "VT",
        "winner": "D",
        "EV": 3
    } 
    where EV = electoral Votes, R = republican, D = democrat, G = green, L = libertarian, O = other
  accepts formatting {"year":<yearToFind>, [name: elecitonName]} in params
  */
  app.get('/electionData',(req,res) => {
    electionName = req.param('name')
    if(!electionName) {
      electionName = "official";
    }
    pool.getConnection(async function(err,connection) {
      if(err){
        res.status(300).send()
      }
      let year = req.query.year;
      let electionId = -1
      connection.query("SELECT electionId FROM elections where year = ? and name = ?",[year,electionName], function(err,result,fields) {
        if(err) {
          logger.error("Error querying Database\n", err)
        } else {
           console.log("result", result)
          electionId = result.length > 0 ? result[0].electionId : -1
          console.log(result)
        }
      })
      await sleep(250)
      
      if(electionId != -1) {
        connection.query("SELECT * FROM electionData JOIN states on electionData.stateId = states.stateId WHERE electionId = ?", [electionId], function(err,result,fields) {

          if(err) {
            logger.error("Something went wrong...")
            res.send(err)
          } else {
            let vals = []
            for(let i = 0; i < 50; i ++) {
              RV = Number(result[i].republicanVotes)
              DV = Number(result[i].democraticVotes)
              GV = Number(result[i].greenVotes)
              LV = Number(result[i].libertarianVotes)
              OV = Number(result[i].otherVotes)

              max = Math.max(RV,DV,GV,LV,OV)
              winner = "ERROR"
              if(max == RV) winner = "Republican"
              else if(max == DV) winner = "Democrat"
              else if (max == GV) winner = "Green"
              else if (max == LV) winner = "Libertarian"
              else if (max == OV) winner = "Other"
              tempRow = {
                "state": result[i].name,
                "shortName":result[i].shortName,
                "winner":winner,
                "EV":result[i].electoralVotes,
                "status": winner
              }
              vals.push(tempRow)

            }
            res.send(vals)
          }
        })
      } else {
        logger.error("No elections found with that year...")
        res.status(400).send({
          "success":false,
          "reason":"No such election found"
        })
      }
      connection.release()
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
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  // Upload profile images to cloudinary and set UUID to image link
  app.post('/storage/upload', (req, res) => {
      const id = req.body.id;
      const candidateId = req.body.candidateId;
      const uuid = req.body.name;

      pool.getConnection(function(err, connection) {
          let sql = "UPDATE users SET uuid = ? where accountNumber = ?";
          connection.query(sql, [uuid, id], (err,result) => {
              if(err) {
                res.status(400);
              }
          })

          sql = "UPDATE candidates SET uuid = ? where candidateId = ?";
          connection.query(sql, [uuid, candidateId], (err, result) => {
            if(err) {
              res.status(400);
            } else {
              res.status(200).send({
                success: true
              })
            }
          })
          connection.release();
      })
  })
}