
var MongoClient = require('mongodb').MongoClient,
    fs = require('fs');

var datafile = './data/capacityregions.json';
var data = require(datafile);
MongoClient.connect('mongodb://127.0.0.1:27017/regions', function(err, db) {

    if(err) throw err;

    var collection = db.collection('regions');
	collection.insert(data,function(err,asd){
		console.log('err',err);
		db.close();
	})
});

