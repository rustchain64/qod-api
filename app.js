const express = require('express');
const mysql = require('mysql');
const mysql2 = require('mysql2');

var app = express();
app.set('port',process.env.PORT || 8080)


function logMsg( msg ) {
    console.log(msg);
}

function logErr( err) {
    console.error(err);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.enable('trust proxy');

// for parsing the body in POST request
var bodyParser = require('body-parser');

var users =[{
    id: 1,
    name: "John Doe",
    age : 23,
    email: "john@doe.com"
}];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

const pool  = mysql.createPool({
	host     : process.env.DB_HOST,
	user     : process.env.DB_USER,
	password : process.env.DB_PASS,
    database : 'qod',
    insecureAuth : true
});
console.log("HOST:: ",process.env.DB_HOST);
console.log("DB_USER:: ",process.env.DB_USER);
console.log("DB_PASS:: ",process.env.DB_PASS);



var getConnection = function(res,callback) {
    logMsg('getting connection from pool');
    pool.getConnection(function(err, connection) {
        if( err ) {
            logErr('error getting connection: ' + err);
            res.status(500).json({"error": err });
            return;
        }
        callback(connection);
    });
};

// api routes
//app.use('/users', require('./users/users.controller'));

// function between(min, max) {  
//     return Math.floor(
//       Math.random() * (max - min) + min
//     )
// }



function dailyQuoteId(){
    // assumes the order of the database is random, and day of year is same as quote id.
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return day;
}

app.get('/daily', 	
	function(req, res) {
        logMsg('request: /daily');
		getConnection(res, function(connection){
            var quote_id = dailyQuoteId();
            var sql = "SELECT quotes.quote_id, quotes.quote, authors.author, genres.genre FROM quotes, authors, genres WHERE quote_id=? and quotes.author_id=authors.author_id and quotes.genre_id=genres.genre_id ;";
            connection.query(sql, [quote_id], function (err, rows, fields) {
                if( err ) {
                    res.status(500).json({"error": err });
                } else {
                    if( rows.length > 0 ) {
                        res.json( { "quote": rows[0].quote, "id": rows[0].quote_id, "author": rows[0].author, "genre": rows[0].genre } );	
                    } else {
                        res.status(500).json({"error": "quote id " + quote_id + " doesn't exist." });
                    }
                    connection.release();
                }
            });
		});
	}
);

app.get('/users', 	
	function(req, res) {
        logMsg('request: /pie_users');
		getConnection(res, function(connection){
            var id = dailyQuoteId();
            var sql = "SELECT * FROM pie_users;"
            //var sql = "SELECT quotes.quote_id, quotes.quote, authors.author, genres.genre FROM quotes, authors, genres WHERE quote_id=? and quotes.author_id=authors.author_id and quotes.genre_id=genres.genre_id ;";
            //connection.query(sql, [quote_id], function (err, rows, fields) {
            connection.query(sql, [id], function (err, rows, fields) {
                if( err ) {
                    res.status(500).json({"error": err });
                } else {
                    if( rows.length > 0 ) {
                        res.json( { "user": rows[0].user, "id": rows[0].id, "firstName": rows[0].firstName, "firstName": rows[0].firstName } );	
                    } else {
                        res.status(500).json({"error": "user id " + id + " doesn't exist." });
                    }
                    connection.release();
                }
            });
		});
	}
);

app.get('/',  
	function(req, res) {
        logMsg('root requested, redirecting to version');
		res.redirect('/version');
	}
);

app.get('/version',  
	function(req, res) {
        logMsg('/version');
		res.send(appVersion);
	}
);


// use package to derive meta data
const package = require('./package.json');
const appName = package.name;
const appVersion = package.version;

console.log(`Starting ${appName} v${appVersion}.`);

app.listen(app.get('port'), '0.0.0.0', function() {
	  console.log("Now serving referrals on port " + app.get('port'));
});





	
