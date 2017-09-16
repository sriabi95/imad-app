var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser'); // for obtaining body of post method
var session = require('express-session');

var config = {
   user : 'sriabi95',
   database : 'sriabi95',
   host : 'db.imad.hasura-app.io',
   port : '5432',
   password : process.env.DB_PASSWORD  //environment variable
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: {maxAge : 1000 * 60 * 60 * 24 * 30}
}));

/*var articles = {
    'article-one' : {
        title : 'article-one',
        heading : 'article-one',
        date : 'Aug 25th 2017',
        content : `<p>
                    This is the content of my first article.
                </p>
                <p>
                    This is the content of my first article.
                </p>
                <p>
                    This is the content of my first article.
                </p>`
    },
    'article-two' : {
        title : 'article-two',
        heading : 'article-two',
        date : 'Aug 26th 2017',
        content : `<p>
                    This is the content of my second article.
                    </p>`                    
    },
    'article-three' : {
        title : 'article-three',
        heading : 'article-three',
        date : 'Aug 27th 2017',
        content : `<p>
                    This is the content of my third article.
                </p>`
                
    }
};*/
    
function createTemplate(data){
    var title = data.title;
    var heading = data.heading;
    var date = data.date;
    var content = data.content;
    var htmlTemplate = 
        `<html>
        
            <head>
                <title>
                    ${title}
                </title>
                <meta name="viewport" content="width=device-width , initial-scale=1" />
                <link href="/ui/style.css" rel="stylesheet" />
            </head>
            
            <body>
                <div class="container">
                    <div>
                        <a href = "/">home</a>
                    </div>    
                    <hr/>
                    <h3>
                        ${heading}
                    </h3>
                    
                    <div>
                        ${date.toDateString()}
                    </div>
                    
                    <div>
                        ${content}
                    </div>
                </div>
            
            </body>    
            
        </html>`;
    return htmlTemplate;
}

var pool = new Pool(config);
app.get('/test-db',function(req,res){                                           //week3
pool.query('SELECT * FROM test1',function(err,result){
   if(err){
       res.status(500).send(err.toString());
   }
   else{
       res.send(JSON.stringify(result.rows));
   }
});
});


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input,salt){                                                      //week4
  var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512'); //synchronous Password-Based Key Derivation Function 2 (PBKDF2) 
  return ['pbkdf2', '10000', salt, hashed.toString('hex')].join('$');
}

app.get('/hash/:input',function(req,res){                                       //week4
    var hashedString = hash(req.params.input, 'this-is-some-random-string');
    res.send(hashedString);
});

app.post('/create-user',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString = hash(password, salt);
    pool.query('INSERT INTO "users" (username, password) VALUES ($1, $2)',[username, dbString], function(err,result){
    if(err){
       res.status(500).send(err.toString());
    }
    else{
       res.send('user successfully created :'+ username);
    }
    });
});

app.post('/login',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    
    pool.query('SELECT * FROM "users" WHERE username = $1',[username], function(err,result){
    if(err){
       res.status(500).send(err.toString());
    }
    else{
        if(result.rows.length === 0){
            res.status(403).send('username/password is invalid');
        }
        else{
            var dbString = result.rows[0].password;
            var salt = dbString.split('$')[2];
            var hashedPassword = hash(password, salt);
            if(hashedPassword === dbString){
//                res.send('credentials are correct..');
            
                //set the session
                req.session.auth = {userId : result.rows[0].id};
                res.send('credentials are correct');
            }
            else{
                res.status(403).send('username/password is invalid');
            }
    
        }
      }
    });
});

app.get('/check-login',function(req,res){
    if(req.session && req.session.auth && req.session.auth.userId){
        res.send('you are logged in : ' + req.session.auth.userId.toString());
    }else{
        res.send('you are not logged in ');
    }
});

var counter = 0;
app.get('/counter',function(req,res){
  counter = counter + 1;  
  res.send(counter.toString());
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

/*var names = [];
app.get('/submit-name/:name',function (req, res){
    var name = req.params.name;
    names.push(name);
    //JSON java script object notation
    res.send(JSON.stringify(names));
});
*/

//query parameter

var names = [];
app.get('/submit-name',function (req, res){  //url : /submit-name?name=xxxx
    var name = req.query.name;
    names.push(name);
    //JSON java script object notation
    res.send(JSON.stringify(names));
});

app.get('/articles/:articleName', function (req, res) {                         //week3
    //articleName == article-one
    //articles[articleName] == content object for article-one
    
// pool.query("SELECT * FROM articles WHERE title = '"+ req.params.articleName + "'", function(err,result){ 
    //unsafe as user can use delete statement to delete the content also
    //'; DELETE FROM articles WHERE a='asdf'

//it is safe to use parameterization by /
     pool.query("SELECT * FROM articles WHERE title = $1", [req.params.articleName], function(err,result){
     if(err){
         res.status(500).send(err.toString());
     }
     else{
         if(result.rows.length === 0){
             res.status(404).send("Article not found");
         }
         else{
             var articleData = result.rows[0];
             res.send(createTemplate(articleData));
         }
     }
 });
 
});


/*app.get('/article-two', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));
});

app.get('/article-three', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article-three.html'));
});*/


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
