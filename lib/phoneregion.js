'use strict';

var PhoneRegion = function (baseName) {
    //this.baseName = baseName;
    var shortName, type;

    var normalise = function (data) {
        return data.toLowerCase().replace('—','-').replace(' - ','-').replace('- ','-').replace(' -','-');
    };

    var fillShortName = function () {
        //console.log(this.baseName);
        var name;

        
        if (baseName && typeof baseName == 'string') {
            name = normalise(baseName.split('|').pop());
            if (name.indexOf("читинская область") > -1){
                name = "забайкальский край";
            }
        }

        if (name && name.indexOf('обл.') > -1) {
            //console.log('replace', name);
            name = name.replace('обл.', 'область');
        }

        return name;
    };

    var fillType = function (name) {
        var typeTemplates = ['край', 'автономная область', 'область', 'автономный округ', 'республика'];
        var result;

        for (var i = 0; i < typeTemplates.length; i++) {
            if (name && typeof name == 'string') {
                
                if (name.indexOf(typeTemplates[i]) > -1) {
                    result = typeTemplates[i];
                    break;
                }
                else if (i === typeTemplates.length - 1){
                    result = 'город федерального значения';
                }
            }
        }

        return result;
    };

    shortName = fillShortName();
    type = fillType(shortName);

    return {
        baseName: baseName,
        shortName: shortName,
        type: type,
        normalise: normalise
    }
};

module.exports = PhoneRegion;