const controller = {};
controller.register = (registerInfo) => {
    if(registerInfo.firstName === '') {
        view.setError('error-first-name', 'input first name');
    };
    if(registerInfo.lastName === '') {
        view.setError('error-last-name', 'input last name');
    };
    if(registerInfo.email === '') {
        view.setError('error-email', 'input email');
    };
    if(registerInfo.passwork === '') {
        view.setError('error-passwork', 'input passwork');
    };
    if(registerInfo.confirmPasswork === '') {
        view.setError('error-confirm-passwork', 'confirm passwork');
    };
}
controller.login = (loginInfo) => {
    if(loginInfo.email === "") {
        view.setError('error-email', 'input email');
    }
    if(loginInfo.passwork === "") {
        view.setError('error-passwork', 'input passwork');
    }
}