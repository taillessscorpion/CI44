const controller = {};
controller.register = (registerInfo) => {
    if (registerInfo.firstName === '') {
        view.setError('error-first-name', 'Please input first name');
    }
    else {
        view.setError('error-first-name', '');
    }
    if (registerInfo.lastName === '') {
        view.setError('error-last-name', 'Please input last name');
    }
    else {
        view.setError('error-last-name', '');
    }
    if (registerInfo.email === '') {
        view.setError('error-email', 'Please input email');
    }
    else {
        view.setError('error-email', '');
    }
    if (registerInfo.password === '') {
        view.setError('error-password', 'Please input password');
    }
    else {
        view.setError('error-password', '');
    }
    if (registerInfo.confirmPassword === '') {
        view.setError('error-confirm-password', 'Please confirm password');
        return
    }
    else  {
        if (registerInfo.confirmPassword != registerInfo.password) {
            view.setError('error-confirm-password', 'Password not match');
            return
        }
        else if (registerInfo.confirmPassword === registerInfo.password) {
            view.setError('error-confirm-password', '');
        }
    }
    model.register(registerInfo.firstName, registerInfo.lastName, registerInfo.email, registerInfo.password);
}
controller.login = (loginInfo) => {
    if (loginInfo.email === '') {
        view.setError('error-email', 'Please input email');
    }
    else if (loginInfo.email != '') {
        view.setError('error-email', '');
    }
    if (loginInfo.password === '') {
        view.setError('error-password', 'Please input password');
        return
    }
    else if (loginInfo.password != '') {
        view.setError('error-password', '');
    }
    model.login(loginInfo.email, loginInfo.password);
}
controller.showPassword = (e) => {
    if (e.target.parentElement.getElementsByTagName("input")[0].type === "password") {
        e.target.parentElement.getElementsByTagName("input")[0].type = "text";
    }
    else if (e.target.parentElement.getElementsByTagName("input")[0].type === "text") {
        e.target.parentElement.getElementsByTagName("input")[0].type = "password";
    }
}
