const view = {};
// view.setShowPassword = () => {
//     var showPassword = document.getElementById("show-password");
// }
view.setActiveScreen = (screenName) => {
    // document.getElementById("app").innerHTML = components[screenName] + components['languageChoice'];
    document.getElementById("app").innerHTML = components[screenName];
    // languages.checkActiveLanguage();
    // view.activeScreen = screenName;
    switch (screenName) {
        case 'registerScreen':
            const registerForm = document.getElementById('form-register');
            const redirectToLogin = document.getElementById("redirect-to-login");
            view.setShowPassword();
            redirectToLogin.addEventListener('click', () => { view.setActiveScreen('loginScreen')});
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const registerInfo = {
                    firstName: registerForm.firstName.value,
                    lastName: registerForm.lastName.value,
                    email: registerForm.email.value,
                    password: registerForm.password.value,
                    confirmPassword: registerForm.confirmPassword.value,
                };
                controller.register(registerInfo);
            })
            break;
        case 'loginScreen':
            const loginForm = document.getElementById('form-login');
            const redirectToRegister = document.getElementById('redirect-to-register');
            view.setShowPassword();
            redirectToRegister.addEventListener('click', () => { view.setActiveScreen('registerScreen') });
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const loginInfo = {
                    email: loginForm.email.value,
                    password: loginForm.password.value,
                };
                controller.login(loginInfo);
            })
            break;
        case 'chatScreen':
            const logout = document.getElementById("logout");
            logout.addEventListener("click", () => {model.logout()});
    }
}
view.setError = (errorName, errorShow) => {
    if (document.getElementById(errorName) != null) {
        document.getElementById(errorName).innerHTML = errorShow;
    }
}
view.setShowPassword = () => {
    const showPassword = document.getElementsByClassName("show-password");
    for(a=0;a<showPassword.length;a++) {
        showPassword[a].addEventListener("click", (e) => {controller.showPassword(e)});
    }
}
view.setAlert = (message) => {
    const showAlert = document.getElementById('alertTitle');
    for(a=0;a<showAlert.parentElement.children.length;a++) {
        showAlert.parentElement.children[a].addEventListener("click", (e) => {e.target.parentElement.style.transform = '';})
    }
    showAlert.parentElement.style.transform = 'translateY(-100vh)';
    showAlert.innerHTML = message;
}
