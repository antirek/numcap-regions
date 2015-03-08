var phoneregion = require('./lib/phoneregion');
var Russian = require('russian-codes');
var codes = new Russian();
var fs = require('fs');
var fileloaderHelper = require('numcap/tools/helpers/fileloader.js');
var dataDirectory = './node_modules/numcap/data/';

function makeExtendedCapacityJsonFile() {
    var filenames = fileloaderHelper.getFilelistByExtension(dataDirectory, 'json');
    var fullCapacity = [];
    var resultFile = [];
    for (var i = 0; i < filenames.length; i++) {
        var fileName = dataDirectory + filenames[i];
        var fileContentAsJson = JSON.parse(fs.readFileSync(fileName, 'utf8'));
        for (var j = 0; j < (fileContentAsJson.length - 1); j++) {
            fullCapacity.push(fileContentAsJson[j]);
        }
    }
    codes.loadData(function () {
        for (var i = 1; i < fullCapacity.length; i++) {
            elementNumcap = fullCapacity[i];
            var buffer = new phoneregion(elementNumcap.region);
            buffer.fillShortName();
            buffer.detectType();
            if (buffer.shortName.indexOf('российская федерация') > -1 || buffer.shortName.indexOf('Байконур') > -1) {
                elementNumcap.region = {
                    "title": buffer.baseName,
                    "code": null
                    //"prev": buffer.shortName
                }
            }
            else {
                codes.getRegionsByType(buffer.type, function (err, array) {
                    for (var i = 0; i < array.length; i++) {
                        if (buffer.shortName.indexOf(buffer.normalise(array[i].title)) > -1) {
                            elementNumcap.region = {
                                "title": array[i].title,
                                "code": array[i].code
                                //"prev": buffer.shortName
                            }
                            break;
                        }

                    }
                });
            }
            resultFile.push(elementNumcap);
        }
        saveJson(resultFile, './data/capacityregions.json')
    });
}

function saveJson(jsonContent, file) {
    var json = JSON.stringify(jsonContent, null, 2);
    fs.writeFile(file, json, function (err) {
        if (!err) console.log("JSON saved to " + file);
    });
}

module.exports = makeExtendedCapacityJsonFile;