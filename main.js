const usersDBMock = JSON.parse(localStorage.getItem('users')) || [];
const inputsArray = document.querySelectorAll('input');
const submitBtn = document.querySelector('[name="submitBtn"]');

const errors = [];
const USER = function(email,userName,password){
    this.userName = userName;
    this.email = email;
    this.password = password;
}
const ERROR = function(inputField , typeOfError){
    this.inputField = inputField;
    this.typeOfError = typeOfError;
}
const errorMessages = {
    empty : 'field is Empty',
    isNotFormmattedCorrectly : 'field is not Formatted Correctly',
    emailExists : 'already exists',
    emailNotExist : 'doesn\'t  exist',
    incorrectPassword : 'is incorrect'
};
const errorCheckers = {
    empty : function(inputField) { 
        return inputField.value.trim() === "";
    },
    emailExists : function(email) {
         return usersDBMock.filter(user => email === user.email );
    },
    isCorrectPassword : function(userPassword,inputPassword){
        return userPassword === inputPassword;
    },
    isNotFormmattedCorrectly  : function(inputField) {
       const  regexExps = {
            email :  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            userName : /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
            password : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
        }
        return !regexExps[inputField.name].test(inputField.value.trim());
    }
}
const validate = () =>{
    const currentpath = location.pathname;
    const checker = ["empty"];
    if (currentpath === "/signup.html"){
        checker.push("isNotFormmattedCorrectly");
    }
    

    for (let i = 0 ; i< inputsArray.length ; i++){
        for (let j = 0 ; j < checker.length ; j++){
            if(errorCheckers[checker[j]](inputsArray[i])){
                errors.push(new ERROR(inputsArray[i],checker[j]));
                break;
            }
        }
    }
     if  (errors.length === 0){
         const filteredUsers = errorCheckers['emailExists'](inputsArray[0].value);
         const user = filteredUsers[0];
        if (currentpath === "/"){
            if (!user){
                errors.push(new ERROR(inputsArray[0],"emailNotExist"));
                return false;
            }else{
                if (!errorCheckers['isCorrectPassword'](user.password,inputsArray[1].value)){
                    errors.push(new ERROR(inputsArray[1],"incorrectPassword"));
                    return false;
                }
            }
            return user;
         
        }else if (currentpath === "/signup.html" && user){
             errors.push(new ERROR(inputsArray[0],"emailExists"));
            return false;
         }
         return true;
     }
     
}
const errorComponent = (errorObj) =>{
    const error = document.createElement("p");
    error.classList.add('error');
    error.textContent = `${errorObj.inputField.name} ${errorMessages[errorObj.typeOfError]}`;
    return error;

}
const errorPrompter = (errorObj)=>{
   errorObj.inputField.insertAdjacentElement('afterend', errorComponent(errorObj));
}
const errorHandler = ()=>{
    while(errors.length){
        errorPrompter(errors.shift());
    }
}
const clearInputs = () =>{
    inputsArray.forEach(e=>e.value = '');
}
const clearErrors = () =>{
    const errorComponents = document.querySelectorAll('.error');
    if(errorComponents){
        errorComponents.forEach(e => e.remove());
    }
}
const clearHandler = (handle) =>{
    const handler = {
        'inputs' : clearInputs,
        'errors' : clearErrors,
    }
    handler[handle]();
}

const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (currentUser){
    if (location.pathname !== "/homepage.html"){
        location.assign(`${location.href}homepage.html`);
    }
    setTimeout(()=>{
        document.querySelector('#user').textContent=`Welcome ${currentUser.userName}`;
        document.querySelector('[name="logoutBtn"]').addEventListener("click",()=>{
        localStorage.removeItem('currentUser');
        location.assign('/')
})

    },50)
}


const submit = (e)=>{
    clearHandler('errors');
    const inputValues = Array.from(inputsArray).map(input=>input.value);
    const isUser = validate();
    if(isUser){
        if(location.pathname === "/"){                                                                                                                                                              
            location.assign(`${location.href}homepage.html`);
            localStorage.setItem('currentUser',JSON.stringify(isUser));
        }else if(location.pathname === "/signup.html"){
            usersDBMock.push(new USER(...inputValues));
            localStorage.setItem('users',JSON.stringify(usersDBMock));
        }
    }else{
        errorHandler();
    }
    clearHandler('inputs');
}

submitBtn.addEventListener("click",submit);








