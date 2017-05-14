var phoneregion = require('./lib/phoneregion');

var Russian = require('russian-codes');
var codes = new Russian();


var fs = require('fs');
var fileloaderHelper = require('numcap/tools/helpers/fileloader.js');

var JsonMaker = function (config) {

    var loadData = function () {
        var filenames = fileloaderHelper.getFilelistByExtension(config.dataDirectory, 'json');
        var capacity = [];
        for (var i = 0; i < filenames.length; i++) {
            var fileName = config.dataDirectory + filenames[i];
            var fileContentAsJson = JSON.parse(fs.readFileSync(fileName, 'utf8'));
            for (var j = 0; j < (fileContentAsJson.length - 1); j++) {
                capacity.push(fileContentAsJson[j]);
            }
        }
        return capacity;
    };

    var normalise = function (data) {
        return data.toLowerCase().replace('—','-').replace(' - ','-').replace('- ','-').replace(' -','-');
    };

    var saveJson = function (obj, file) {
        var string = JSON.stringify(obj, null, 2);
        fs.writeFile(file, string, function (err) {
            if (!err) console.log("JSON saved to " + file);
        });
    };

    var modificate = function (elementNumcap, buffer) {
        
        if (buffer.shortName.indexOf('российская федерация') > -1 || buffer.shortName.indexOf('байконур') > -1) {
            elementNumcap.region = {
                "title": buffer.baseName,
                "code": null,
                "county": null,
            };
        } else {
            codes.getRegionsByType(buffer.type, function (err, array) {
                
                for (var i = 0; i < array.length; i++) {
                    if (buffer.shortName.indexOf(normalise(array[i].title)) > -1) {
                        elementNumcap.region = {
                            "title": array[i].title,
                            "code": array[i].code, 
                            "county": array[i].county,
                        };
                        break;
                    }
                }
            });
        }
        return elementNumcap;
    }

    var makeExtendedCapacityJsonFile = function () {
        var fullCapacity = loadData();
        console.log('loaded data')
        var resultArr = [];

        codes.loadData(() => {
            resultArr = fullCapacity.map((elementNumcap, i) => { 
                var buffer;
                var f;
                if (elementNumcap.region) {
                    if (elementNumcap.region.indexOf('Республика Удмуртская') > -1) {
                        console.log(elementNumcap);
                        f = true;
                    }
                    buffer = new phoneregion(elementNumcap.region);
                    elementNumcap = modificate(elementNumcap, buffer);
                    if (f) {
                        console.log(buffer);
                        console.log(elementNumcap);
                    }
                } else {
                    console.log(' ________________________ ! ________________________ ! ________________________')
                    console.log(elementNumcap);
                    elementNumcap = null;
                }

                return elementNumcap;
            });

            resultArr = resultArr.filter((element) => {
                return element != null;
            });

            saveJson(resultArr, config.datafile);
        });
    };



    return {
        makeExtendedCapacityJsonFile: makeExtendedCapacityJsonFile
    };
};

module.exports = JsonMaker;