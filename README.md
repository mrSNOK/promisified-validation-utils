# Webpack validation utils

UMD library for asynchronous validation. Based on [webpack-lib-starter](https://github.com/mrSNOK/webpack-lib-starter)

## Features

* Regex validation.
* E-mail validation.
* Length validation.
* Region constarined phone validation.
* Provides ability to combine multiple validatiors.
* Provides API for implementing custom validators.

## Usage

You can import, require or just include it in script tag.
Built in validators are available like this:

```javascript
new promisifiedValidationUtils.common.PhoneValidator({
        constraintRegions: ['UA','US'],
        getErrMsg: function () {
            return `Phone number is invalid! Please enter valid phone number for regions: ${this.constraintRegions.join(', ')}`;
        }
    }).validate('+79225551234')
    .then(validationResults => {
        if(!validationResults.isValid) alert(validationResults.errMsgs.join(', '));
    });
```
Custom validators should extend AbstarctValidator. For example, in ES5 manner, validator that checks username before registration can be implemented like this:

```javascript
function GithubUsernameIsAvailableValidator(options){
        promisifiedValidationUtils.AbstractValidator.apply(this,arguments);
    }
    GithubUsernameIsAvailableValidator.prototype = Object.create(promisifiedValidationUtils.AbstractValidator.prototype);
    GithubUsernameIsAvailableValidator.prototype.constructor = GithubUsernameIsAvailableValidator;
    GithubUsernameIsAvailableValidator.prototype._rule = function (options) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open('GET','https://api.github.com/users/'+options.value,true);
            xhr.onload = function (){
                if (this.status == 200){
                    options.isValid = false;
                    resolve(options);//user is found
                }else if(this.status == 404){
                    options.isValid = true;
                    resolve(options);//user is not found
                }else{
                    let error = new Error(this.statusText);
                    error.code = this.status;
                    reject(error);
                }
            };
            xhr.onerror = function() {
                reject(new Error("Network Error"));
            };
            xhr.send();
        });
    };
    /*==================Validators instantiation==================*/
    new GithubUsernameIsAvailableValidator({
        getErrMsg: function () {
            return `Username '${this.value}' has been already registered on github!`;
        }
    }).validate('octocat')
    .then(validationResults => {
        if(!validationResults.isValid) alert(validationResults.errMsgs.join(', '));
    });
```
More examples can be found in examples/build.
Commands to build examples are listed in [webpack-lib-starter](https://github.com/mrSNOK/webpack-lib-starter)
