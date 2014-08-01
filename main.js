var express = require('express');
var cors = require('cors');
var app = express();
var MongoClient = require('mongodb').MongoClient,
	format = require('util').format;

var url = "127.0.0.1";
var duration = 30000; //30 seconds until messages are removed

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
			duration: 86,
			convId: "test",
			time: new Date(2013, 2, 1, 1, 10)
		}, function() {});
		chat.insert({
			message: "Third",
			from: 42,
			"to": [54],
			duration: 86,
			convId: "test",
			time: new Date(2014, 2, 1, 1, 10)
		}, function() {});
		chat.insert({
			message: "Second",
			from: 42,
			"to": [54],
			duration: 86,
			convId: "test",
			time: new Date(2013, 8, 1, 1, 10)
		}, function() {});
	})

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
			time: duration,
			sent: new Date()
		}, function(err, doc) {
			doc = doc[0]; //only one query
			console.log("Submitted a message:")
			console.log(doc);
			var postId = doc._id;

			setTimeout(function() {
				chat.remove(postId, function() {
					console.log("Removed post " + postId);
				})
			}, doc.time);

		});

		console.log(req.query);
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(req.query));

	});

	app.get('/messages/', function(req, res) { //?convId=conversationId
		var q = req.query;
		if (u(q.convId))
			res.status(404).end('You dun goofed.');

		chat.find({
			convId: q.convId
		}, function(err, doc) {
			doc = doc.sort({
				time: 1
			}).toArray(function(err, arr) {
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(arr));
			});
		})
	})

	app.listen(3000);

});
