function AbstractValidator() {
    if (this.constructor === AbstractValidator)
        throw new Error("Can't instantiate abstract class !");
}
AbstractValidator.prototype._rule = function (val) {
  throw new Error("Please implement abstract protected method! It should return boolean or Promise that resolves with boolean");
};
AbstractValidator.prototype._getErrMsg = function () {
  throw new Error("Please implement abstract protected method! It should return String");
};
AbstractValidator.prototype._getValidationResults = function (isValid) {
    var errMsgs = [];
    if (!isValid)
        errMsgs.push(this._getErrMsg());
    return {
        value: this._value,
        isValid:isValid,
        errMsgs: errMsgs
    };
};
AbstractValidator.prototype.validate = function(val){
    this._value = val;
    return Promise.resolve(val)
        .then(this._rule)
        .then(this._getValidationResults);
};

module.exports = AbstractValidator;