import "../style/common-styles.scss";
import "bootstrap";
import validationUtils from "../../../../../promisified-validation-utils";

console.log('examples scripts are loaded!');

try{
    /*==================Validators inheritance==================*/
    function GithubUsernameIsAvailableValidator(options){
        validationUtils.AbstractValidator.apply(this,arguments);
    }
    GithubUsernameIsAvailableValidator.prototype = Object.create(validationUtils.AbstractValidator.prototype);
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
    let githubUsernameIsAvailableValidator = new GithubUsernameIsAvailableValidator({
        getErrMsg: function () { // underscore means protected not private visibility
            return `Username '${this.value}' has been already registered on github!`;
        }
    });

    let lengthValidator = new validationUtils.common.LengthValidator({
        minLength : 10,
        maxLength : 20,
        getErrMsg : function () {
            return `'${this.value}' length is: ${this.value.toString().length}. Should be between ${this.minLength} and ${this.maxLength}!`;
        }
    });

    let phoneValidator = new validationUtils.common.PhoneValidator({
        constraintRegions: ['UA','US'],
        getErrMsg: function () {
            return `Phone number is invalid! Please enter valid phone number for regions: ${this.constraintRegions.join(', ')}`;
        }
    });

    let emailValidator = validationUtils.common.RegexpValidator.forEmail({
        getErrMsg: function () {
            return 'Email is invalid !';
        }
    });//uses factory of common regexps
    /*==================Multiple validators combination==================*/
    let githubUserRegistrationValidator = new validationUtils.common.BatchValidator({
        validators:[
            lengthValidator,
            githubUsernameIsAvailableValidator
        ],
        getErrMsg: function () {
            return `Cant use username '${this.value}' for registration on github!`;
        }
    });
    /*==================Validators usage==================*/
    let validatorRunnerData = [
        {
            instance: lengthValidator,
            data: [
                {
                    value: '',
                    isValid: false //invalid. length is 0
                },
                {
                    value: 'a',
                    isValid: false //invalid. length is 1
                },
                {
                    value: 'aaaaaaaaaa',
                    isValid: true //valid. length is 10
                },
                {
                    value: 'aaaaaaaaaaa',
                    isValid: true //valid. length is 11
                },
                {
                    value: 'aaaaaaaaaaaaaaaaaaaa',
                    isValid: true //valid. length is 20
                },
                {
                    value: 'aaaaaaaaaaaaaaaaaaaaa',
                    isValid: false //invalid. length is 21
                },
            ]
        },
        {
            instance: phoneValidator,
            data: [
                {
                    value: '+380674753812',//valid UA phone
                    isValid: true
                },
                {
                    value: '+15417543010',//valid US phone
                    isValid: true
                },
                {
                    value: '+79225551234',//phone itself is valid, but region is RU
                    isValid: false
                },
                {
                    value: '123',//not a phone number at all
                    isValid: false
                }
            ]
        },
        {
            instance: emailValidator,
            data: [
                {
                    value: 'o.chesnok89@gmail.com', //valid email
                    isValid: true
                },
                {
                    value: 'o.chesnok89gmail.com', // invalid email
                    isValid: false
                }
            ]
        },{
            instance: githubUsernameIsAvailableValidator,
            data: [
                {
                    value:'octocat',
                    isValid:false //registered username
                },
                {
                    value:'usrrr',
                    isValid:true //unregistered username
                }
            ]
        },
        {
            instance: githubUserRegistrationValidator,
            data: [
                {
                    value: 'octocat',// already registered and to short. length is 7
                    isValid: false

                },
                {
                    value: 'registereduser',//already registered, but valid length (14)
                    isValid: false
                },
                {
                    value: 'usrrr',//unregistered, but to short ()
                    isValid: false
                },
                {
                    value: 'unregistereduserr',//completely valid in length (17) and unregistered.
                    isValid: true
                },
            ]
        }
    ];
    function runValidators(data) {
        let allValidatorsPromises = [];
        data.forEach(function (validator) {
            let validatorPromises = validator.data.map(function (data) {
                return validator.instance.validate(data.value)// getting validation promise
                    .then(function(result){
                        return {
                            validatorName: validator.instance.constructor.name,
                            result: result,
                            status: result.isValid === data.isValid ? 'Passed' : 'Failed'
                        };
                    });
            });
            allValidatorsPromises = allValidatorsPromises.concat(validatorPromises);
        });
        Promise
            .all(allValidatorsPromises)
            .then(results => {
                results.forEach(function (result) {
                    result.status === 'Passed' ? console.log(result) : console.error(result);
                })
            })
            .catch(err => {
                console.error(err);
            })
    };
    runValidators(validatorRunnerData);
}catch(err){
    console.error(err);
}
