var AbstractValidator = require('../AbstractValidator');

function RegexpValidator(options) {
    if (!(options && options.regExp))
        throw new Error('Cant instantiate class without regExp !');
    this.regExp = options.regExp;
}
RegexpValidator.prototype = Object.create(AbstractValidator.prototype);
RegexpValidator.prototype.constructor = RegexpValidator;

RegexpValidator.prototype._rule = function(val){
    return val.match(this.regExp);
};

//Factory methods for common use cases
RegexpValidator.forEmail = function () {
    return new this({
        regExp: /^[a-zA-Zёа-яЁА-Я0-9_\.\-\+]{1,64}@[a-zA-Zёа-яЁА-ЯЁёäöüÄÖÜßèéû0-9][a-zA-Zёа-яЁА-ЯЁёäöüÄÖÜßèéû0-9\.\-]{0,253}\.[a-zA-Zёа-яЁА-Я]{2,10}$/
    })
};

module.exports = RegexpValidator;