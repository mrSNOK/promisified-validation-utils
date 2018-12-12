import "../style/common-styles.scss";
import "bootstrap";
import validationUtils from "/../promisified-validation-utils";

console.log('examples scripts are loaded!');

try{
    /*==================Validators inheritance==================*/
    function GithubUsernameIsAvailableValidator(){}//super constructor does nothing. so no need to call it.
    GithubUsernameIsAvailableValidator.prototype = Object.create(validationUtils.AbstractValidator.prototype);
    GithubUsernameIsAvailableValidator.prototype.constructor = GithubUsernameIsAvailableValidator;
    GithubUsernameIsAvailableValidator.prototype._rule = function (val) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open('GET','https://api.github.com/users/'+val,true);
            xhr.onload = function (){
                if (this.status == 200){
                    resolve(false);//user is found
                }else if(this.status == 404){
                    resolve(true);//user is not found
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
    let githubUsernameIsAvailableValidator = new GithubUsernameIsAvailableValidator();
    githubUsernameIsAvailableValidator._getErrMsg = function () { // underscore means protected not private visibility
        return `Username "${this.val}" has been already registered on github!`;
    };

    let lengthValidator = new validationUtils.common.LengthValidator({
        minLength : 10,
        maxLength : 20
    });
    lengthValidator._getErrMsg = function () {
        return `"${this.val}" length is: ${this.val.toString().length}. 
                Should be between ${this.minLength} 
                and ${this.maxLength}!`;
    };

    let phoneValidator = new validationUtils.common.PhoneValidator({
        regions: ['UA','US']
    });
    phoneValidator._getErrMsg = function () {
        return `Phone number is invalid! Please enter valid phone number for region "${this.region}"`;
    };

    let emailValidator = validationUtils.common.RegexpValidator.forEmail();//uses factory of common regexps
    emailValidator._getErrMsg = function () {
        return 'Email is invalid !';
    };
    /*==================Multiple validators combination==================*/
    let githubUserRegistrationValidator = new validationUtils.common.BatchValidator({
        validators:[
            lengthValidator,
            githubUsernameIsAvailableValidator
        ]
    });
    githubUserRegistrationValidator._getErrMsg = function () {
        return `Cant use username "${this.val}" for registration on github!`;
    };
    /*==================Validators usage==================*/
    let validatorRunnerData = [
        {
            validator: phoneValidator,
            data: [
                '+380674753812',//valid UA phone
                '+15417543010',//valid US code
                '+79225551234',//phone itself is valid, but region is RU
                '123'//not a phone number at all
            ]
        },
        {
            validator: emailValidator,
            data: [
                'o.chesnok89@gmail.com',//valid email
                'o.chesnok89gmail.com'//not valid
            ]
        },
        {
            validator: githubUserRegistrationValidator,
            data: [
                'octocat',// already registered and to short. length is 7
                'registereduser',//already registered, but valid length (14)
                'usrrr',//unregistered, but to short ()
                'unregistereduserr', //completely valid in length (17) and unregistered.
            ]
        }
    ];
    function runValidators(data) {
        let allValidatorsPromises = [];
        data.forEach(function (item) {
            let validatorPromises = item.data.map(function (input) {
                return item.validator.validate(input);
            });
            allValidatorsPromises.push(validatorPromises);
        });
        Promise
            .all(allValidatorsPromises)
            .then(results => {
                console.log(JSON.stringify(results));
            })
            .catch(err => {
                console.error(err);
            })
    };
    runValidators(validatorRunnerData);
}catch(err){
    console.error(err);
}
