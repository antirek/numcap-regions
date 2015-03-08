#!/usr/bin/env node

var cli = require('cli').enable('status', 'version');

cli.setApp('Number regions CLI tool', '0.0.2');

cli.parse({
    make:  ['m', 'make json db'],
    dataDirectory: [false, 'dataDirectory of source json data file for make', 
          'path', './node_modules/numcap/data/'],
    json2mongo:  ['j', 'move data from json file to mongodb'],
    host: ['h', 'mongodb host', 'ip', 'localhost'],
    port: ['p', 'mongodb port', 'number', 27017],
    database: ['d', 'mongodb database', 'string', 'regions'],
    collection: ['c', 'mongodb collection', 'string', 'regions'],
    datafile: [false, 'datafile path', 'path', './data/capacityregions.json']
});

cli.main(function(args, options) {
      
    if (options.make) {
        var q = require('./makeJson');
        q();
    }

    if (options.json2mongo) {
        var MongoInserter = require('./data2mongo');
        var MongoClient = require('mongodb').MongoClient;

        var mi = new MongoInserter(MongoClient, options);
        mi.connect()
            .then(function () {
                var data = require(options.datafile);
                console.log('data length:', data.length);
                return mi.insert(data);
            })
            .then(function (items) {
                console.log('mi items inserted', items.length);
            })          
            .fail(function (err) {
                console.log('fail', err);
            })
            .fin(mi.close);        
    }

});