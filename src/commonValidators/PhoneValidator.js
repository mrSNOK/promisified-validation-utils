var AbstractValidator = require('../AbstractValidator');
var libphonenumber = require('libphonenumber-js');

function PhoneValidator(options) {
    AbstractValidator.apply(this,arguments);
}
PhoneValidator.prototype = Object.create(AbstractValidator.prototype);
PhoneValidator.prototype.constructor = PhoneValidator;

PhoneValidator.prototype._rule = function(options){
    options.constraintRegions = options.constraintRegions || [] ;
    try{
        var phoneNumber = libphonenumber.parsePhoneNumber(options.value); //throws error if cant parse
        if (phoneNumber.isValid()){
            options.isValid = options.constraintRegions.length === 0 || options.constraintRegions.indexOf(phoneNumber.country) > -1 ;//phone number is in list of constraints
        }else options.isValid = false;
    }catch (err){
        options.isValid = false; // Not a phone number, non-existent country, etc.
    }
    return options;
};
module.exports = PhoneValidator;