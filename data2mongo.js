
var MongoClient = require('mongodb').MongoClient,
    fs = require('fs');

var datafile = './data/capacityregions.json';
var data = JSON.parse(fs.readFileSync(datafile));
console.log(data[0], data.length);

MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {

    if(err) throw err;

    var collection = db.collection('test_insert');

    data.forEach(function (element, index) {
        collection.insert(element, function(err, docs) {
            //console.log('hello', index);
        });
    });
});