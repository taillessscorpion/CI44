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
    if (registerInfo.firstName != '' && registerInfo.lastName != '' && registerInfo.email != '' && registerInfo.password != '') {
        model.register(registerInfo.firstName, registerInfo.lastName, registerInfo.email, registerInfo.password);
    }
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
    if (loginInfo.email != '' && loginInfo.password != '') {
        model.login(loginInfo.email, loginInfo.password);
    }
}
controller.showPassword = (e) => {
    if (e.target.parentElement.getElementsByTagName("input")[0].type === "password") {
        e.target.parentElement.getElementsByTagName("input")[0].type = "text";
    }
    else if (e.target.parentElement.getElementsByTagName("input")[0].type === "text") {
        e.target.parentElement.getElementsByTagName("input")[0].type = "password";
    }
}
controller.sendMessage = (message) => {
    if(message != '') {
        const trimedMessage = message.toString().trim();
        if(trimedMessage != '') {
            model.updateDocToFirebase('messages', trimedMessage, "message");
        }
        model.currentUser.unsent.message = '';
    }
}
controller.sendImage = (containerInfo) => {
    var imageLinkList = [];
    for(a=0;a<containerInfo.length;a++) {
        const imageLink = utils.getUrlFromBackground(containerInfo[a].style.background);
        imageLinkList.push(imageLink);
    }
    model.updateDocToFirebase('messages', imageLinkList, "image");
    model.updateDocToFirebase('imagesShared', model.currentUser.stored)
    model.currentUser.unsent.images = [];
    model.currentUser.stored = [];
    containerInfo[0].parentElement.innerHTML = '';
}
controller.checkBeforeUploadImageFiles = async function(imageFiles) {
    try {
        for(i=0;i<imageFiles.length;i++) {
            if(model.currentConversation.imagesShared.length === 0) {
                await model.uploadImageFilesToStorage(imageFiles[i]);
            } else {
                for(y=0;y<model.currentConversation.imagesShared.length;y++) {
                    if(imageFiles[i].name === model.currentConversation.imagesShared[y].name) {
                        model.getImageFilesFromStorage(model.currentConversation.imagesShared[y]);
                    } else {
                        if(y === model.currentConversation.imagesShared.length-1) {
                            if (model.currentUser.stored.length === 0) {
                                await model.uploadImageFilesToStorage(imageFiles[i]);
                            } else {
                                for(z=0;z<model.currentUser.stored.length;z++) {
                                    if(imageFiles[i].name === model.currentUser.stored[z].name) {
                                        model.getImageFilesFromStorage(model.currentUser.stored[z])
                                    }
                                    else {
                                        if(z === model.currentUser.stored.length-1) {
                                            await model.uploadImageFilesToStorage(imageFiles[i]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        document.getElementById("send-message-form").images.value = null;
    } catch (err) {
        view.setAlert(err.message);
    }
    
}

