var express = require('express');
var cors = require('cors');
var app = express();
var MongoClient = require('mongodb').MongoClient,
	format = require('util').format;

var url = "127.0.0.1";
var duration = 30000; //30 seconds until messages are removed
var refreshRate = 10000;//removes finished messages every 10 seconds

function u(v) { //tests if v is undefined or null; returns true if so
	return v === undefined || v === null;
}

app.use(cors());

MongoClient.connect('mongodb://' + url + '/fbotrc', function(err, db) {

	if (err) throw err;

	var chat = db.collection('chat');

	chat.remove({}, function() {
		chat.insert({
			message: "First",
			from: 42,
			"to": [54],
			convId: "test",
			sent: new Date().getTime()
		}, function() {});
		setTimeout(function(){
			chat.insert({
				message: "Third",
				from: 42,
				"to": [54],
				convId: "test",
				sent: new Date().getTime()
			}, function() {});	
		}, 3000);

		setTimeout(function(){
			chat.insert({
				message: "Second",
				from: 42,
				"to": [54],
				convId: "test",
				sent: new Date().getTime()
			}, function() {});
		}, 2000);

		chat.insert({
			message: "Number 1",
			from: 42,
			"to": [54],
			convId: "test2",
			sent: new Date().getTime() + 60000 * 60 * 24
		}, function() {});
		setTimeout(function(){
			chat.insert({
				message: "Number 3",
				from: 42,
				"to": [54],
				convId: "test2",
				sent: new Date().getTime() + 60000 * 60 * 24
			}, function() {});	
		}, 3000);

		setTimeout(function(){
			chat.insert({
				message: "Number 2",
				from: 42,
				"to": [54],
				convId: "test2",
				sent: new Date().getTime() + 60000 * 60 * 24//a day's head start
			}, function() {});
		}, 2000);


	});

	app.get('/', function(req, res) {
		chat.findOne({}, {}, function(err, r) {
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(r));
		})
	});

	app.post('/submit/', function(req, res) { //syntax, ?message=message&from=userfbid&convId=conversationId
		var q = req.query;
		if (u(q.message) || u(q.from) || u(q.convId)) //something is missing
			res.status(404).end('You dun goofed.');

		chat.insert({ //puts message in db
			message: q.message,
			from: q.from,
			convId: q.convId,
			/*time: duration,*/
			sent: new Date().getTime()
		}, function(err, doc) {
			doc = doc[0]; //only one query
			console.log("Submitted a message:")
			console.log(doc);
			var postId = doc._id;

			// setTimeout(function() {
			// 	chat.remove(postId, function() {
			// 		console.log("Removed post " + postId);
			// 	})
			// }, doc.time);//implementing a more efficient way

		});

		console.log(req.query);
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(req.query));

	});

	app.get('/messages/', function(req, res) { //?convId=conversationId
		var q = req.query;
		if (u(q.convId))
			res.status(404).end('You dun goofed.');
		var d = new Date().getTime();
		d-= duration;

		chat.find({
			convId: q.convId,
			sent:{$gte:d}//all dates sent after that time, 'duration' seconds ago
		}, function(err, doc) {
			doc = doc.sort({
				time: 1
			}).toArray(function(err, arr) {
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(arr));
			});
		})
	})

	setInterval(function(){
		var d = new Date().getTime();
		d-= duration;
		chat.remove({
			sent:{$lt:d}//all dates sent before that time
		}, function(){});
	}, refreshRate);

	app.listen(3000);

});
