'use strict';

var Q = require('q');
require('q-foreach')(Q);

var MongoInserter = function (mongoclient, config) {
    var dbConn = null;
    
    var makeUrl = function () {
        return ['mongodb://', config.host, ':', config.port, '/', config.database].join('');
    };

    this.connect = function () {
        var defer = Q.defer();
        mongoclient.connect(makeUrl(), function (err, db) {
            if (err) {            
                defer.reject(err);
            } else {
                dbConn = db;          
                defer.resolve();
            }
        });
        return defer.promise;
    };

    this.insert = function (data) {
        return Q.forEach(data, function (element) {
            var defer = Q.defer();
            dbConn.collection(config.collection).insert(element, function (err, result) {        
                if (err) {
                    defer.reject(err);
                } else {
                    defer.resolve(result);
                }
            });
            return defer.promise;
        });
    };  

    this.close = function () {
        var defer = Q.defer();
        dbConn.close(function (err) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve();
            }
        });
        return defer.promise;
    };
};

module.exports = MongoInserter;