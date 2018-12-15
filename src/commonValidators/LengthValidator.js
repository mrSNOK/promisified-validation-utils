var AbstractValidator = require('../AbstractValidator');

function LengthValidator(options) {
    AbstractValidator.apply(this, arguments);
}
LengthValidator.prototype = Object.create(AbstractValidator.prototype);
LengthValidator.prototype.constructor = LengthValidator;

LengthValidator.prototype._rule = function(options){
    options.minLength = options.minLength || 0;
    options.maxLength = options.maxLength || Infinity;
    var length = options.value.toString().length;
    options.isValid = length >= options.minLength && length <= options.maxLength;
    return options;
};
module.exports = LengthValidator;