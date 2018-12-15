function AbstractValidator(options) {
    if (this.constructor === AbstractValidator)
        throw new Error("Can't instantiate abstract class !");
    if (options.getErrMsg === 'undefined' || typeof options.getErrMsg !== 'function')
        throw new Error("options should contain getErrMsg method !");
    this.options = options;
}
AbstractValidator.prototype._rule = function (options) {
  throw new Error("Please implement abstract protected method! It should set isValid: boolean to received options object and return it !");
};
AbstractValidator.prototype._getValidationResults = function (options) {
    if (options.isValid === 'undefined')
        throw new Error("_rule method should return object, containing isValid: boolean !");
    var errMsgs = [];
    if (!options.isValid)
        errMsgs.push(options.getErrMsg());
    return {
        value: options.value,
        isValid:options.isValid,
        errMsgs: errMsgs
    };
};
AbstractValidator.prototype.validate = function(val){
    var optionsSnapshot = Object.assign({},this.options); // taking options snapshot as options can be changed, and multiple validations can be started synchronously. Each async validation has its own data safe in closure
    optionsSnapshot.value = val;
    return Promise.resolve(optionsSnapshot)
        .then(this._rule)
        .then(this._getValidationResults);
};

module.exports = AbstractValidator;