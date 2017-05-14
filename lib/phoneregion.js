'use strict';

function PhoneRegion(baseName) {
    this.baseName = baseName;
};

PhoneRegion.prototype.fillShortName = function () {
    //console.log(this.baseName);
    if (this.baseName && typeof this.baseName == 'string') {
        this.shortName = this.normalise(this.baseName.split('|').pop());
        if (this.shortName.indexOf("читинская область") > -1){
            this.shortName = "забайкальский край";
        }
    }
};

PhoneRegion.prototype.normalise = function (data) {
    return data.toLowerCase().replace('—','-').replace(' - ','-').replace('- ','-').replace(' -','-');
};

PhoneRegion.prototype.detectType = function () {
    var typeTemplates = ['край', 'автономная область', 'область', 'автономный округ', 'республика'];
    for (var i = 0; i < typeTemplates.length; i++) {
        if (this.shortName && typeof this.shortName == 'string') {
            
            if (this.shortName.indexOf('обл.') > -1) {
                console.log(this.shortName);
                this.shortName = this.shortName.replace('обл.','область');
                console.log(this.shortName);
            }

            if (this.shortName.indexOf(typeTemplates[i]) > -1) {
                this.type = typeTemplates[i];
                break;
            }
            else if (i===typeTemplates.length-1){
                this.type = 'город федерального значения';
            }
        }
    }
};

module.exports = PhoneRegion;