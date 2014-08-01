var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient, format = require('util').format;

var url = "127.0.0.1";
var duration = 30000;//30 seconds until messages are removed

function u(v){//tests if v is undefined or null; returns true if so
	return v === undefined || v === null;
}

MongoClient.connect('mongodb://' + url + '/fbotrc', function(err, db) {

	if(err) throw err;

	var chat = db.collection('chat');

	chat.remove({},function(){
		chat.insert({message:"Permanent message test thing",from:42,"to":[54],duration:86}, function(){})
	})

	app.get('/', function(req, res){
		chat.findOne({}, {}, function(err,r){
			res.end(JSON.stringify(r));
		})
	});

	app.post('/message/', function(req, res){//syntax, /message/?message=message&from=userfbid&convId=conversationId
		var q = req.query;
		if(u(q.message) || u(q.from) || u(q.convId))//something is missing
			res.status(404).end('You dun goofed.');

		chat.insert({//puts message in db
			message:q.message,
			from:q.from,
			convId:q.convId,
			time:duration,
			sent:new Date()
		}, function(err, doc){
			doc = doc[0];//only one query
			console.log("Submitted a message:")
			console.log(doc);
			var postId = doc._id;

			setTimeout(function(){
				chat.remove(postId,function(){
					console.log("Removed post " + postId);
				})
			}, doc.time);


		});


		// console.log(req.params.t);
		// console.log(req.params.a);
		// console.log('---');
		// res.end("Yay")
		console.log(req.query);
		res.end(JSON.stringify(req.query));
		
	});

	app.get('/test/', function(req,res){

		chat.insert({nothing:"much"}, function(err, docs){
			console.log(docs._id);
			chat.remove(docs._id, function(){});
		})

	})


	app.listen(3000);

});
