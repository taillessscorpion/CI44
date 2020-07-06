const view = {};

view.setActiveScreen = (screenName) => {
    document.getElementById("app").innerHTML = components[screenName] + components.alertMessage;
    switch (screenName) {
        case 'registerScreen':
            const registerForm = document.getElementById('form-register');
            const redirectToLogin = document.getElementById("redirect-to-login");
            view.setShowPassword();
            redirectToLogin.addEventListener('click', () => { view.setActiveScreen('loginScreen') });
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
            document.getElementById("app").innerHTML = components.chatScreen + components.alertMessage + components.logOut
            const logout = document.getElementById("logout");
            logout.addEventListener("click", () => { model.logout() });
            const sendMessageForm = document.getElementById("send-message-form");
            const inputMessage = sendMessageForm.getElementsByTagName("textarea")[0];
            document.addEventListener('keypress', (e) => {
                if (e.keyCode != 13 && document.activeElement.tagName != 'TEXTAREA') {
                    inputMessage.focus();
                } else if (e.keyCode === 13 && e.shiftKey && document.activeElement.tagName != 'TEXTAREA') {
                    inputMessage.focus();
                }
            })
            const imageInput = sendMessageForm.images;
            const imageInputLabel = sendMessageForm.getElementsByTagName('label')[0];
            const imageMessageContainer = document.getElementsByClassName('image-message-container')[0];
            
            $(imageInputLabel).on('click', () => {
                $(imageInput).focus();
                $(imageInput).trigger('click');
            });
            imageInput.addEventListener('input', () => {
                let imageFiles = imageInput.files;
                if (imageFiles.length === 0) {
                    view.setAlert('No files choosen');
                } else if (imageFiles.length > 9-imageMessageContainer.children.length) {
                    view.setAlert("Can't send more than nine pictures at once");
                    imageFiles = utils.getArrayFromPostionToPosion(imageFiles, 0, 9-imageMessageContainer.children.length);
                    controller.checkBeforeUploadImageFiles(imageFiles);
                } else {
                    controller.checkBeforeUploadImageFiles(imageFiles);
                }
            })
            inputMessage.addEventListener("keypress", (e) => {
                model.currentUser.unsent.message = inputMessage.value;
                if (e.keyCode === 13) {
                    if (e.shiftKey === false) {
                        const imageMessageContainer = document.getElementsByClassName('image-message-container')[0];
                        if(imageMessageContainer.children.length > 0) {
                            controller.sendImage(imageMessageContainer.children);
                            }
                        controller.sendMessage(inputMessage.value);
                        sendMessageForm.replaceChild(inputMessage, sendMessageForm.getElementsByTagName("textarea")[0]);
                        sendMessageForm.reset();
                    }
                }
            })
            sendMessageForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const imageMessageContainer = document.getElementsByClassName('image-message-container')[0];
                if(imageMessageContainer.children.length > 0) {
                    controller.sendImage(imageMessageContainer.children);
                }
                controller.sendMessage(inputMessage.value); 
                inputMessage.value = "";
            })
            model.downloadConversations();
            break;
    }
}
view.setError = (errorName, errorShow) => {
    if (document.getElementById(errorName) != null) {
        document.getElementById(errorName).innerHTML = errorShow;
    }
}
view.setShowPassword = () => {
    const showPassword = document.getElementsByClassName("show-password");
    for (a = 0; a < showPassword.length; a++) {
        showPassword[a].addEventListener("click", (e) => { controller.showPassword(e) });
    }
}
var autoClearAlert, showAlertDelay
view.setAlert = (message) => {
    clearTimeout(autoClearAlert);
    clearTimeout(showAlertDelay);
    const showAlert = document.getElementById('alertTitle');
    showAlert.parentElement.style.transform = '';
    for (a = 0; a < showAlert.parentElement.children.length; a++) {
        showAlert.parentElement.children[a].addEventListener("click", (e) => { e.target.parentElement.style.transform = ''; })
    }
    showAlert.innerText = message;
    showAlertDelay = setTimeout(() => { showAlert.parentElement.style.transform = 'translateY(-100vh)'; }, 0);
    autoClearAlert = setTimeout(() => { showAlert.parentElement.style.transform = '' }, 3000);
}
view.setActiveMessage = (message, sender) => {
    const messageElement = document.createElement("div");
    messageElement.className = "message";
    messageElement.innerText = message;
    const messagesParentsElement = document.createElement("div");
    if (sender === model.currentUser.email) {
        messagesParentsElement.className = "your-message";
    }
    else {
        messagesParentsElement.className = "their-message";
    }
    messagesParentsElement.appendChild(messageElement);
    const listMessage = document.getElementsByClassName("list-message");
    listMessage[0].appendChild(messagesParentsElement);
    listMessage[0].scrollTo(0, listMessage[0].scrollHeight);
}
view.setActiveImagesMessage = (images, sender) => {
    var newImageContainer = document.createElement('div');
    newImageContainer.className = 'message-of-image';
    if(images.length <= 2) {
        for(i=0; i<images.length;i++) {
            var newImageElement = document.createElement('div');
            newImageElement.className = 'few-image-message';
            newImageElement.style.background = `url(${images[i]})`;
            newImageElement.style.backgroundSize = 'cover';
            newImageContainer.appendChild(newImageElement);
        }
    } else {
        for(i=0; i<images.length;i++) {
            var newImageElement = document.createElement('div');
            newImageElement.className = 'much-image-message';
            newImageElement.style.background = `url(${images[i]})`;
            newImageElement.style.backgroundSize = 'cover';
            newImageContainer.appendChild(newImageElement);
        }
    }
    var messagesParentsElement = document.createElement('div');
    if (sender === model.currentUser.email) {
        messagesParentsElement.className = "your-message";
    }
    else {
        messagesParentsElement.className = "their-message";
    }
    messagesParentsElement.appendChild(newImageContainer);
    const listMessage = document.getElementsByClassName("list-message");
    listMessage[0].appendChild(messagesParentsElement);
    listMessage[0].scrollTo(0, listMessage[0].scrollHeight);
}
view.showCurrentConversation = () => {
    for (let oneMessage of model.currentConversation.messages) {
        if(oneMessage.content != null && oneMessage.content != undefined) {
            view.setActiveMessage(oneMessage.content, oneMessage.sender);
        }
        if(oneMessage.images != null && oneMessage.images != undefined) {
            view.setActiveImagesMessage(oneMessage.images, oneMessage.sender); 
        }
    }
}
view.revealImagesAfterLoad = (imageLink) => {
    const imageMessageContainer = document.getElementsByClassName('image-message-container')[0];
    const imageToReveal = document.createElement('div');
    imageToReveal.className = 'block-of-image';
    imageToReveal.innerHTML = components.unchooseImageButton;
    imageToReveal.style.background = `url(${imageLink})`;
    imageToReveal.style.backgroundSize = 'cover';
    const unchooseBtn = imageToReveal.getElementsByClassName('close-btn')[0];
    unchooseBtn.addEventListener('click', (e) => {view.unchooseImageAfterLoad(e)})
    imageMessageContainer.appendChild(imageToReveal);
}
view.unchooseImageAfterLoad = (e) => {
    const imageMessageContainer = document.getElementsByClassName('image-message-container')[0];
    const imageLink = utils.getUrlFromBackground(e.target.parentElement.parentElement.style.background);
    model.unstoreImageFiles(imageLink);
    imageMessageContainer.removeChild(e.target.parentElement.parentElement);
}