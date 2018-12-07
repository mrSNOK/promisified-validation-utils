var AbstractValidator = require('../AbstractValidator');

function LengthValidator(options) {
    this.minLength = options.minLength || -Infinity;
    this.maxLength = options.maxLength || Infinity;
}
LengthValidator.prototype = Object.create(AbstractValidator.prototype);
LengthValidator.prototype.constructor = LengthValidator;

LengthValidator.prototype._rule = function(val){
    var length = val.toString().length;
    return length >= this.minLength && length <= this.maxLength;
};
module.exports = LengthValidator;