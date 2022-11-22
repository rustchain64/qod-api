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
// var bodyParser = require('body-parser');

// var users =[{
//     id: 1,
//     name: "John Doe",
//     age : 23,
//     email: "john@doe.com"
// }];

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// function getRandomInt(max) {
// 	return Math.floor(Math.random() * Math.floor(max));
// }

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
// GETS ALL USERS
app.get('/users', 	
	function(req, res) {
        logMsg('request: /pie_users');
		getConnection(res, function(connection){
            var sql = "SELECT * FROM pie_users;"
            connection.query(sql, [id], function (err, rows, fields) {
                if( err ) {
                    res.status(500).json({"error": err });
                } else {
                    if( rows.length > 0 ) {
                        res.json( rows );
                    } else {
                        res.status(500).json({"error": "user id " + id + " doesn't exist." });
                    }
                    connection.release();
                }
            });
		});
	}
);

// GET A USER BY ID IN ORDER TO LOGIN
app.get('/users/:id', function(req,res) {
	var user_id=req.params.id;
    logMsg('request: /users/'+user_id);
	getConnection(res, function(connection){
        var sql = "SELECT users.user_id, users.firstName, users.lastName, users.username FROM pie_users";
        logMsg('query sql: '+sql);
		connection.query(sql, [user_id], function (error, rows, fields) {
            logMsg('sql query completed');
            console.log('sql query completed',fields);
			if( error ) {
                logErr(error);
				res.status(500).json({"error": err });
			} else {
				if( rows.length > 0 ) {
                    logMsg('sql query completed, rows: '+rows.length);
					res.json( { "referral": rows[0].referral, "id": rows[0].user_id, "id": rows[0].firstName, "id": rows[0].lastName } );	
				} else {
                    logErr('user_id ['+user_id+'] not found');
					res.status(404).json({"error": "quote id '"+ user_id + "' doesn't exist." });
                }
                logMsg('connection releasing');
				connection.release();
			}
		});
	});
});

// CREATE a pie_user
// app.post('/users/', function(req,res) {
// 	var referral_id=req.params.id;
//     logMsg('request: /pie_users/'+referral_id);
// 	getConnection(res, function(connection){
//         var sql = "SELECT quotes.quote_id, quotes.quote, authors.author, genres.genre FROM quotes, authors, genres WHERE quote_id=? and quotes.author_id=authors.author_id and quotes.genre_id=genres.genre_id ;";
//         logMsg('query sql: '+sql);
// 		connection.query(sql, [quote_id], function (error, rows, fields) {
//             logMsg('sql query completed');
// 			if( error ) {
//                 logErr(error);
// 				res.status(500).json({"error": err });
// 			} else {
// 				if( rows.length > 0 ) {
//                     logMsg('sql query completed, rows: '+rows.length);
// 					res.json( { "quote": rows[0].quote, "id": rows[0].quote_id, "author": rows[0].author, "genre": rows[0].genre } );	
// 				} else {
//                     logErr('quote id ['+quote_id+'] not found');
// 					res.status(404).json({"error": "quote id '"+ quote_id + "' doesn't exist." });
//                 }
//                 logMsg('connection releasing');
// 				connection.release();
// 			}
// 		});
// 	});
// });

// UPDATE a user
app.put('/user_id/:id', function(req,res) {
	var user_id=req.params.id;
    logMsg('request: /pie_users/'+user_id);
	getConnection(res, function(connection){
        var sql = "UPDATE table_name SET column1 = value1, column2 = value2 WHERE id=100"
        var sql = "SELECT quotes.quote_id, quotes.quote, authors.author, genres.genre FROM quotes, authors, genres WHERE quote_id=? and quotes.author_id=authors.author_id and quotes.genre_id=genres.genre_id ;";
       // logMsg('query sql: '+sql);
		connection.query(sql, [quote_id], function (error, rows, fields) {
            logMsg('sql query completed');
			if( error ) {
                logErr(error);
				res.status(500).json({"error": err });
			} else {
				if( rows.length > 0 ) {
                    logMsg('sql query completed, rows: '+rows.length);
					res.json( { "quote": rows[0].quote, "id": rows[0].quote_id, "author": rows[0].author, "genre": rows[0].genre } );	
				} else {
                    logErr('quote id ['+quote_id+'] not found');
					res.status(404).json({"error": "quote id '"+ quote_id + "' doesn't exist." });
                }
                logMsg('connection releasing');
				connection.release();
			}
		});
	});
});

//##############################################################3

app.get('/referrals', 	
	function(req, res) {
        logMsg('request: /referrals');
		getConnection(res, function(connection){
            var sql = "SELECT * FROM referrals;"
            //var sql = "SELECT quotes.quote_id, quotes.quote, authors.author, genres.genre FROM quotes, authors, genres WHERE quote_id=? and quotes.author_id=authors.author_id and quotes.genre_id=genres.genre_id ;";
            //connection.query(sql, [quote_id], function (err, rows, fields) {
            connection.query(sql, [id], function (err, rows, fields) {
                if( err ) {
                    res.status(500).json({"error": err });
                } else {
                    if( rows.length > 0 ) {
                      res.json ( rows );  
                      //res.json( { "referral": rows[0].user, "id": rows[0].id, "yourName": rows[0].yourName, "referralName": rows[0].referralName, "agentName": rows[0].agentName, "agentCode": rows[0].agentCode, "businessName": rows[0].businessName, "phone": rows[0].phone, "email": rows[0].email, "ss": rows[0].ss, "bankName": rows[0].bankName, "routingNumber": rows[0].routingNumber, "accountNumber": rows[0].accountNumber, "title": rows[0].title, "description": rows[0].description, "published": rows[0].published } );	
                    } else {
                        res.status(500).json({"error": "referral id " + id + " doesn't exist." });
                    }
                    connection.release();
                }
            });
		});
	}
);

// GET A REFERRAL BY ID
app.get('/referrals/:id', function(req,res) {
	var referral_id=req.params.id;
    logMsg('request: /referrals/'+referral_id);
    console.log("referral_id ", referral_id);
	getConnection(res, function(connection){
        var sql = "SELECT referrals.referral_id, referral_id.firstName FROM referrals WHERE referral_id=? and referral_id.author_id=authors.author_id and referral_id.genre_id=genres.genre_id ;";
        logMsg('query sql: '+sql);
		connection.query(sql, [quote_id], function (error, rows, fields) {
            logMsg('sql query completed');
			if( error ) {
                logErr(error);
				res.status(500).json({"error": err });
			} else {
				if( rows.length > 0 ) {
                    logMsg('sql query completed, rows: '+rows.length);
					res.json( { "quote": rows[0].quote, "id": rows[0].referral_id, "author": rows[0].author, "genre": rows[0].genre } );	
				} else {
                    logErr('referral_id ['+referral_id+'] not found');
					res.status(404).json({"error": "quote id '"+ referral_id + "' doesn't exist." });
                }
                logMsg('connection releasing');
				connection.release();
			}
		});
	});
});

// CREATE a referral
app.post('/referrals/', function(req,res) {
	var referral_id=req.params.id;
    logMsg('request: /referrals/'+referral_id);
	getConnection(res, function(connection){
        var sql = "SELECT quotes.quote_id, quotes.quote, authors.author, genres.genre FROM quotes, authors, genres WHERE quote_id=? and quotes.author_id=authors.author_id and quotes.genre_id=genres.genre_id ;";
        logMsg('query sql: '+sql);
		connection.query(sql, [quote_id], function (error, rows, fields) {
            logMsg('sql query completed');
			if( error ) {
                logErr(error);
				res.status(500).json({"error": err });
			} else {
				if( rows.length > 0 ) {
                    logMsg('sql query completed, rows: '+rows.length);
					res.json( { "quote": rows[0].quote, "id": rows[0].quote_id, "author": rows[0].author, "genre": rows[0].genre } );	
				} else {
                    logErr('quote id ['+quote_id+'] not found');
					res.status(404).json({"error": "quote id '"+ quote_id + "' doesn't exist." });
                }
                logMsg('connection releasing');
				connection.release();
			}
		});
	});
});

// UPDATE a referral
app.put('/referrals/:id', function(req,res) {
	var referral_id=req.params.id;
    logMsg('request: /referrals/'+referral_id);
	getConnection(res, function(connection){
        var sql = "SELECT quotes.quote_id, quotes.quote, authors.author, genres.genre FROM quotes, authors, genres WHERE quote_id=? and quotes.author_id=authors.author_id and quotes.genre_id=genres.genre_id ;";
        logMsg('query sql: '+sql);
		connection.query(sql, [quote_id], function (error, rows, fields) {
            logMsg('sql query completed');
			if( error ) {
                logErr(error);
				res.status(500).json({"error": err });
			} else {
				if( rows.length > 0 ) {
                    logMsg('sql query completed, rows: '+rows.length);
					res.json( { "quote": rows[0].quote, "id": rows[0].quote_id, "author": rows[0].author, "genre": rows[0].genre } );	
				} else {
                    logErr('quote id ['+quote_id+'] not found');
					res.status(404).json({"error": "quote id '"+ quote_id + "' doesn't exist." });
                }
                logMsg('connection releasing');
				connection.release();
			}
		});
	});
});

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