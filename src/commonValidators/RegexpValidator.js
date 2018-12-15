var AbstractValidator = require('../AbstractValidator');

function RegexpValidator(options) {
    if (!(options && options.regExp))
        throw new Error('Cant instantiate class without regExp !');
    AbstractValidator.apply(this,arguments);
}
RegexpValidator.prototype = Object.create(AbstractValidator.prototype);
RegexpValidator.prototype.constructor = RegexpValidator;

RegexpValidator.prototype._rule = function(options){
    options.isValid = options.regExp.test(options.value.toString().toLowerCase());
    return options;
};

//Factory methods for common use cases
RegexpValidator.forEmail = function (options) {
    return new this({
        regExp: /^[a-zA-Zёа-яЁА-Я0-9_\.\-\+]{1,64}@[a-zA-Zёа-яЁА-ЯЁёäöüÄÖÜßèéû0-9][a-zA-Zёа-яЁА-ЯЁёäöüÄÖÜßèéû0-9\.\-]{0,253}\.[a-zA-Zёа-яЁА-Я]{2,10}$/,
        getErrMsg: options.getErrMsg
    })
};

module.exports = RegexpValidator;