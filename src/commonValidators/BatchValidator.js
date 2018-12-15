var AbstractValidator = require('../AbstractValidator');

function BatchValidator(options) {
    if (!(options && options.validators && options.validators.length > 0))
        throw new Error('Cant instantiate class without at least one validator !');
    AbstractValidator.apply(this, arguments);
}
BatchValidator.prototype = Object.create(AbstractValidator.prototype);
BatchValidator.prototype.constructor = BatchValidator;

BatchValidator.prototype._rule = function(options){
    var validatorsPromises = options.validators.map(function (validator) {
        return validator.validate(options.value);
    });
    return Promise.all(validatorsPromises)
        .then(function (validationResults) {
           options.isValid = true;
           options.validatorErrors = [];
           validationResults.forEach(function (result) {
               options.isValid = options.isValid && result.isValid;
               options.validatorErrors = options.validatorErrors.concat(result.errMsgs);
           });
           return options;
        });
};
BatchValidator.prototype._getValidationResults = function (options) {
    var result = AbstractValidator.prototype._getValidationResults(options);
    result.errMsgs = result.errMsgs.concat(options.validatorErrors);
    return result;
};

module.exports = BatchValidator;