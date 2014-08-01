var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient, format = require('util').format;

var url = "127.0.0.1"

MongoClient.connect('mongodb://' + url + '/fbotrc', function(err, db) {

	if(err) throw err;

	var chat = db.collection('chat');
	chat.remove({},function(){})

	chat.insert({message:"Permanent message test thing",from:42,"to":[54],duration:86}, function(){})

	app.get('/', function(req, res){
		chat.findOne({}, {}, function(err,r){
			res.end(JSON.stringify(r));
		})
	});

	app.post('/message/', function(req, res){
		// console.log(req.params.t);
		// console.log(req.params.a);
		// console.log('---');
		// res.end("Yay")
		console.log(req.query);
		res.end(JSON.stringify(req.query));
		
	})

	app.listen(3000);

});



    



