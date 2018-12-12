var AbstractValidator = require('../AbstractValidator');

function BatchValidator(options) {
    if (!(options && options.validators && options.validators.length > 0))
        throw new Error('Cant instantiate class without at least one validator !');
    this.validators = options.validators;
    this.validatorErrors = [];
}
BatchValidator.prototype = Object.create(AbstractValidator.prototype);
BatchValidator.prototype.constructor = BatchValidator;

BatchValidator.prototype._rule = function(val){
    var validatorsPromises = this.validators.map(function (validator) {
        return validator.validate(val);
    });
    return Promise.all(validatorsPromises)
        .then(function (validationResults) {
           var isAllValid = true;
           validationResults.forEach(function (result) {
               isAllValid = isAllValid && result.isValid;
               this.validatorErrors = this.validatorErrors.concat(result.errMsgs);
           });
           return isAllValid;
        });
};
BatchValidator.prototype._getValidationResults = function (isValid) {
    var result = AbstractValidator.prototype._getValidationResults.call(this, isValid);
    result.errMsgs = result.errMsgs.concat(this.validatorErrors);
    return result;
};

module.exports = BatchValidator;