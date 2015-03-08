#!/usr/bin/env node

var cli = require('cli').enable('status');

cli.parse({
    make:  ['m', 'make json db'],
    json2mongo:  ['j', 'move data from json file to mongodb'],
    host: ['h', 'mongodb host', 'ip', 'localhost'],
    port: ['p', 'mongodb port', 'number', 27017],
    database: ['d', 'mongodb database', 'string', 'regions'],
    collection: ['c', 'mongodb collection', 'string', 'regions'],
    datafile: [false, 'datafile path', 'path', './data/capacityregions1.json']
});

cli.main(function(args, options) {
      
    if (options.make) {
        this.debug('Enabling logging'); 
    }

    if (options.json2mongo) {
        var MongoInserter = require('./data2mongo');
        var MongoClient = require('mongodb').MongoClient;

        var mi = new MongoInserter(MongoClient, options);
        mi.connect()
          .then(function () {
            var data = require(options.datafile);
            console.log(data);
            mi.insert(data);
          })          
          .fail(function (err) {
              console.log('mi fail', err);
            })
          .fin(mi.close);        
    }

});