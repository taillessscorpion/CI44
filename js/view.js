const view = {};
view.setActiveScreen = (screenName) => {
    document.getElementById("app").innerHTML = components[screenName];
    switch (screenName) {
        case 'registerScreen' :
            const registerForm = document.getElementById('form-register');
            const redirectToLogin = document.getElementById("redirect-to-login");
            redirectToLogin.addEventListener('click', () => {view.setActiveScreen('loginScreen')});
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const registerInfo = {
                    firstName: registerForm.firstName.value,
                    lastName: registerForm.lastName.value,
                    email: registerForm.email.value,
                    passwork: registerForm.passwork.value,
                    confirmPasswork: registerForm.confirmPasswork.value,
                };
                controller.register(registerInfo);
            })
            break;
        case 'loginScreen' :
            const loginForm = document.getElementById('form-login');
            const redirectToRegister = document.getElementById('redirect-to-register');
            redirectToRegister.addEventListener('click', () => {view.setActiveScreen('registerScreen')});
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const loginInfo = {
                    email: loginForm.email.value,
                    passwork: loginForm.passwork.value,
                };
                controller.login(loginInfo);
            })
            break;
    }
}
view.setError = (errorName, errorShow) => {
    document.getElementById(errorName).innerHTML = 'Please ' + errorShow;
}