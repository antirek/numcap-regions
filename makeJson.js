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
        } else if (buffer.shortName.indexOf('регион') > -1) {
            codes.getCounties(function (err, array) {
                var counties = array.filter(function(element){
                    return buffer.shortName.indexOf(normalise(element.title)) > -1;
                });
                if (counties.length > 0) {
                    elementNumcap.region = {
                        "title": counties[0].title,
                        "code": "",
                        "county": counties[0].code
                    }
                }
            });
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

    var prepare = function (elementNumcap) {
        if (elementNumcap.region.indexOf('Республика Удмуртская') > -1) {
            elementNumcap.region = 'Удмуртская Республика';
        }                    

        if (elementNumcap.region.indexOf('Ханты - Мансийский - Югра АО') > -1) {
            elementNumcap.region = 'Ханты-Мансийский автономный округ - Югра';
        }

        if (elementNumcap.region.indexOf('Ямало-Ненецкий АО') > -1) {
            elementNumcap.region = 'Ямало-Ненецкий автономный округ';
        }

        if (elementNumcap.region.indexOf('Республика Саха /Якутия/') > -1) {
            elementNumcap.region = 'Республика Саха (Якутия)';
        }

        if (elementNumcap.region.indexOf('Чукотский АО') > -1) {
            elementNumcap.region = 'Чукотский автономный округ';
        }
        
        if (elementNumcap.region.indexOf('Ненецкий АО') > -1) {
            elementNumcap.region = 'Ненецкий автономный округ';
        }

        if (elementNumcap.region.indexOf('Республика Кабардино-Балкарская') > -1) {
            elementNumcap.region = 'Кабардино-Балкарская республика';
        }

        if (elementNumcap.region.indexOf('Республика Чеченская') > -1) {
            elementNumcap.region = 'Чеченская республика';
        }

        if (elementNumcap.region.indexOf('Республика Карачаево-Черкесская') > -1) {
            elementNumcap.region = 'Карачаево-Черкесская республика';
        }

        if (elementNumcap.region.indexOf('р-ны Абзелиловский и Белорецкий') > -1) {
            elementNumcap.region = 'Республика Башкортостан';
        }

        if (elementNumcap.region.indexOf('Сургутский район и г. Сургут') > -1) {
            elementNumcap.region = 'Ханты-Мансийский автономный округ - Югра';
        }

        if (elementNumcap.region.indexOf('г. Симферополь, Симферопольский р-он') > -1) {
            elementNumcap.region = 'Республика Крым';
        }

        

        return elementNumcap;
    };

    var makeExtendedCapacityJsonFile = function () {
        var fullCapacity = loadData();
        console.log('loaded data')
        var resultArr = [];

        codes.loadData(() => {
            resultArr = fullCapacity.map((elementNumcap, i) => { 
                var buffer;
                if (elementNumcap.region) {

                    elementNumcap = prepare(elementNumcap);

                    buffer = new phoneregion(elementNumcap.region);
                    elementNumcap = modificate(elementNumcap, buffer);
                    

                    if (typeof elementNumcap.region == 'string') {
                        console.log('region:', elementNumcap.region);
                        elementNumcap = null;
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