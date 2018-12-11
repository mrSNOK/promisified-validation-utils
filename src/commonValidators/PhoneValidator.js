var AbstractValidator = require('../AbstractValidator');
var libphonenumber = require('libphonenumber-js');

function PhoneValidator(options) {
    this.constraintRegions = options.regions || [];
}
PhoneValidator.prototype = Object.create(AbstractValidator.prototype);
PhoneValidator.prototype.constructor = PhoneValidator;

PhoneValidator.prototype._rule = function(val){
    try{
        var phoneNumber = libphonenumber.parseNumber(val); //throws error if cant parse
        if (phoneNumber.isValid()){
            if (this.constraintRegions.length === 0){
                return true; //if there are no constraints
            }else {
                return this.constraintRegions.indexOf(libphonenumber.country) > -1 //phone number is in list of constraints
            }
        }else return false;
    }catch (err){
        return false; // Not a phone number, non-existent country, etc.
    }
};
module.exports = PhoneValidator;