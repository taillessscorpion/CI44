const view = {};

view.setActiveScreen = (screenName) => {
    // add screen and an alert element
    document.getElementById("app").innerHTML = components[screenName] + components.alertMessage;

    switch (screenName) {
        case 'registerScreen':
            //register
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
                /// CALL CONTROLLER HERE
                controller.register(registerInfo);
            })
            break;
        case 'loginScreen':
            // login
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
                // CALL CONTROLLER HERE
                controller.login(loginInfo);
            })
            break;
        case 'chatScreen':
            // LOG-OUT BUTTON JOIN THE GAME
            document.getElementById("app").innerHTML = components.chatScreen + components.alertMessage + components.logOut
            // LOG OUT EVENT
            logout.addEventListener("click", () => { model.logout() });
            const sendMessageForm = document.getElementById("send-message-form");
            const inputMessage = sendMessageForm.getElementsByTagName("textarea")[0];
            // GET FOCUS FOR TEXTAREA
            document.addEventListener('keypress', (e) => {
                if (e.keyCode != 13 && document.activeElement.tagName != 'TEXTAREA') {
                    if(document.activeElement.tagName != 'INPUT') {
                        inputMessage.focus();
                    }
                } else if (e.keyCode === 13 && e.shiftKey && document.activeElement.tagName != 'TEXTAREA') {
                    inputMessage.focus();
                }
            })
            const imageInput = sendMessageForm.images;
            const imageInputLabel = sendMessageForm.getElementsByTagName('label')[0];
            const imageMessageContainer = document.getElementsByClassName('image-message-container')[0];
            // TRIGGER FOR CHOOSE FILE AND INPUT EVENT
            $(imageInputLabel).on('click', () => {
                $(imageInput).focus();
                $(imageInput).trigger('click');
            });
            imageInput.addEventListener('input', () => {
                let imageFiles = imageInput.files;
                for (one of imageInput.files) {
                }
                if (imageFiles.length === 0) {
                    view.setAlert('No files choosen');
                } else if (imageFiles.length > 9-imageMessageContainer.children.length) {
                    view.setAlert("Can't send more than nine pictures at once");
                    imageFiles = utils.getArrayFromPostionToPosion(imageFiles, 0, 9-imageMessageContainer.children.length);
                    ///CALL CONTROLLER HERE
                    controller.checkBeforeUploadImageFiles(imageFiles);
                } else {
                    ///OR HERE
                    controller.checkBeforeUploadImageFiles(imageFiles);
                }
                inputMessage.focus();
            })
            // ADD ONE MORE LINE IN TEXT AREA IF USER HOLD SHIFT KEY WHEN PRESS ENTER KEY
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
            // MESSAGE FORM SUBMIT
            sendMessageForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const imageMessageContainer = document.getElementsByClassName('image-message-container')[0];
                if(imageMessageContainer.children.length > 0) {
                    controller.sendImage(imageMessageContainer.children);
                }
                controller.sendMessage(inputMessage.value); 
                inputMessage.value = "";
            })
            // SEND CONVERSATION REQUEST EVENT
            const sendRequestForm = document.getElementsByClassName('add-conversation-form')[0];
            sendRequestForm.addEventListener('submit', (e) => {
                // view.sendConversationRequest(e)
                e.preventDefault();
            });
            
            /// THIS IS AN OLDER COMMENT
            /// CALL MODEL HERE //// DOWNLOAD COVERSATIONS TO SYNCHRONIZE DATA
            // I AM NOT DOING THIS AGAIN, JUST CALL MODEL LISTEN AND IT WILL HANDLE EVERYTHING
            model.listenConversationChange();
            break;
    }
}







view.setActiveMessage = (message, sender, createdAt) => {
    const messageElement = document.createElement("div");
    messageElement.className = "message";
    messageElement.title = utils.converseTimeFromISOString(createdAt);
    messageElement.innerText = message;
    view.addMessageToListMessage(messageElement, sender);
}
view.setActiveImagesMessage = (images, sender, createdAt) => {
    const newImageContainer = document.createElement('div');
    newImageContainer.className = 'message-of-image';
    newImageContainer.title = utils.converseTimeFromISOString(createdAt);
    if(images.length <= 2) {
        for(i=0; i<images.length;i++) {
            var newImageElement = document.createElement('img');
            newImageElement.className = 'few-image-message';
            newImageElement.src = images[i]
            newImageContainer.appendChild(newImageElement);
        }
    } else {
        for(i=0; i<images.length;i++) {
            var newImageElement = document.createElement('div');
            newImageElement.className = 'much-image-message';
            newImageElement.style.background = `url(${images[i]})`;
            utils.styleForImageBackgroundDiv(newImageElement);
            newImageContainer.appendChild(newImageElement);
        }
    }
    view.addMessageToListMessage(newImageContainer, sender);
}
view.addMessageToListMessage = (messageElement, sender) => {
    const messagesParentsElement = document.createElement("div");
    if (sender === model.currentUser.email) {
        messagesParentsElement.className = "your-message";
    }
    else {
        messagesParentsElement.className = "their-message";
    }
    messagesParentsElement.appendChild(messageElement);
    const listMessage = document.getElementsByClassName("list-message");
    if(listMessage[0].children.length === 0) {
        const messagesGrandParentsElement = document.createElement('div');
        messagesGrandParentsElement.appendChild(messagesParentsElement);
        messagesGrandParentsElement.className = 'message-block';
        listMessage[0].appendChild(messagesGrandParentsElement);
    } else if(messagesParentsElement.className === listMessage[0].lastChild.lastChild.className) {
        listMessage[0].lastChild.appendChild(messagesParentsElement);
        view.setMessagesBorderRadius(messagesParentsElement.className, listMessage[0].lastChild.children);
    } else {
        const messagesGrandParentsElement = document.createElement('div');
        messagesGrandParentsElement.appendChild(messagesParentsElement);
        messagesGrandParentsElement.className = 'message-block';
        listMessage[0].appendChild(messagesGrandParentsElement);
    }
    listMessage[0].scrollTo(0, listMessage[0].scrollHeight);
}
view.setMessagesBorderRadius = (condition, list) => {
    if(list.length === 1) {
        if(condition === 'your-message') {
            list[0].firstChild.style.borderTopRightRadius = '5px';
            list[0].firstChild.style.borderBottomRightRadius = '5px';
        } else {
            list[0].firstChild.style.borderTopLeftRadius = '5px';
            list[0].firstChild.style.borderBottomLeftRadius = '5px';
        }
    } else if (list.length === 2) {
        if(condition === 'your-message') {
            list[0].firstChild.style.borderBottomRightRadius = '5px';
            list[1].firstChild.style.borderTopRightRadius = '5px';
        } else {
            list[0].firstChild.style.borderBottomLeftRadius = '5px';
            list[1].firstChild.style.borderTopLeftRadius = '5px';
        }
    } else {
        if(condition === 'your-message') {
            list[0].firstChild.style.borderBottomRightRadius = '5px';
            list[list.length-1].firstChild.style.borderTopRightRadius = '5px';
            for (i=1;i<list.length-1;i++) {
                list[i].firstChild.style.borderTopRightRadius = '5px';
                list[i].firstChild.style.borderBottomRightRadius = '5px';
            }
        } else {
            list[0].firstChild.style.borderBottomLeftRadius = '5px';
            list[list.length-1].firstChild.style.borderTopLeftRadius = '5px';
            for (i=1;i<list.length-1;i++) {
                list[i].firstChild.style.borderTopLeftRadius = '5px';
                list[i].firstChild.style.borderBottomLeftRadius = '5px';
            }
        }
    }
}


/// add or change details to BOX, THE CONVERSATION ELEMENT AT RIGHT SIDE
view.addMessageToBox = (conversationInfo, id) => {
    const boxElement = document.getElementById(id);
    const messageElement = boxElement.getElementsByClassName('last-message');
    const conversationMessages = conversationInfo.messages;
    var lastmessage, lastmessageContent, lastmessageSender;
    if(conversationMessages === undefined || conversationMessages.length === 0) {
        lastmessageContent = '';
        lastmessageSender ='';
        lastmessage = '';
    } else {
        lastmessage = conversationMessages[conversationMessages.length-1]
        if(!lastmessage.content) {
            lastmessageContent = `sent ${utils.converseNumberToWord(lastmessage.images.length)} photo${utils.checkSingularOrPlurar(lastmessage.images.length, 's')}`
            if(lastmessage.sender === model.currentUser.email) {
                lastmessageSender = 'You';
            } else {
                for(one of conversation.active) {
                    if(one.email === lastmessage.sender) {
                        if(one.nickName != undefined || one.nickName != null) {
                            lastmessageSender = one.nickName
                        } else {
                            lastmessageSender = one.displayName
                        }
                    }
                }
            }
        } else {
            lastmessageContent = lastmessage.content
            if(lastmessage.sender === model.currentUser.email) {
                lastmessageSender = 'You:';
            } else {
                for(one of conversation.active) {
                    if(one.email === lastmessage.sender) {
                        if(one.nickName != undefined || one.nickName != null) {
                            lastmessageSender = one.nickName + ":"
                        } else {
                            lastmessageSender = one.displayName+ ":"
                        }
                    }
                }
            }
        }
    }
    messageElement.innerText = `${lastmessageSender} ${lastmessageContent}`;
}
view.addTitleToBox = (title, id) => {
    const boxElement = document.getElementById(id);
    const titleElement = boxElement.getElementsByClassName('profile-title');
    titleElement[0].innerText = title;
}
view.addPictureToBox = (picture, id) => {
    const boxElement = document.getElementById(id);
    const pictureElement = boxElement.getElementsByClassName("profile-picture-small");
    pictureElement.background = `url(${picture})`
}
view.addActivePrivateToBox = (timepoint, id) => {
    const offlineLong = utils.countFromTpointToNowReturnSeconds(timepoint);
    const boxElement = document.getElementById(id);
    const offlineElement = boxElement.getElementsByClassName('active-light')[0];
    if (offlineLong <= 10) {
        if(offlineElement.style.backgroundColor != model.activeLightColor.onMessage) {
            offlineElement.style.backgroundColor = model.activeLightColor.onActive;
        }
    } else if (offlineLong <= 300) {
        if(offlineElement.style.backgroundColor != model.activeLightColor.onMessage) {
            offlineElement.style.backgroundColor = model.activeLightColor.onSlowRespone;
        }
    } else {
        if(offlineElement.style.backgroundColor != model.activeLightColor.onMessage) {
            offlineElement.style.backgroundColor = model.activeLightColor.onOffline;
        }
    }

}
view.addActiveGroupToBox = (number, id) => {
    const boxElement = document.getElementById(id);
    const activeElement = boxElement.getElementsByClassName('profile-actives');
    activeElement.innerText = `${number} actives`

}
view.addUsersGroupToBox = (number, id) => {
    const boxElement = document.getElementById(id);
    const userElement = boxElement.getElementsByClassName('profile-users');
    userElement.innerText = `${number} users`

}

/// add or change details to MAIN CHAT, THE CURRENT CONVERSATION
view.addMessageToScreen = (message) => {
    if(message.content === undefined) {view.setActiveImagesMessage(message.images, message.sender, message.createdAt);}
    else {view.setActiveMessage(message.content, message.sender, message.createdAt)}
}
view.addTitleToScreen = (title) => {
    const titleElement = document.getElementsByClassName('conversation-title')[0];
    titleElement.textContent = title;
}

/// show element
view.showCurrentConversation = () => {
    /// add title of chat area
    if(model.currentConversation.chatType === 'private') {
        for (user of model.currentConversation.active) {
            if(user.email != model.currentUser.email) {
                if(user.nickName != undefined || user.nickName != '') {
                    view.addTitleToScreen(user.nickName);
                }  else {
                    view.addTitleToScreen(user.displayName);
                }
            }
        }
    } else if (model.currentConversation.chatType === 'group') {
        view.addTitleToScreen(model.currentConversation.title);
    }
    /// show all messages to messages list
    /// and clear its first
    const listMessage = document.getElementsByClassName('list-message')[0];
    listMessage.innerHTML = '';
    for (let oneMessage of model.currentConversation.messages) {
        view.addMessageToScreen(oneMessage);
    }
}
view.chooseBoxOfConversation = (boxInfo) => {
    const currentConversation = document.getElementById(model.currentConversation.id);
    currentConversation.classList.remove('current');
    for(one of model.conversations) {
        if(one.id === boxInfo.id) {
            model.currentConversation = one;
        }
    }
    const newConversation = document.getElementById(model.currentConversation.id);
    newConversation.className = 'current conversation';
    view.showCurrentConversation();
}
view.addAllConversations = (conversationsInfo) => {
    for (one of conversationsInfo) {
        view.addConversationToBox(one);

    }
}
view.addConversationToBox = (conversation) => {
    const conversationElement = document.createElement('div');
    conversationElement.className = 'conversation';
    conversationElement.id = conversation.id;
    const activeLight = document.createElement('div');
    activeLight.className = 'active-light';
    if(conversation.users.length <= 1) {
        /// waitting for acppected or people in there were gone
        console.log('lonely box')
    } else {
        if(conversation.chatType === 'private') {
            //private message
            for (user of conversation.users) {
                /// get email of other user
                if(user != model.currentUser.email) {
                    /// then use the email to get user info from data base
                    firebase.firestore().collection(model.usersCollection).where('email', '==', user).get().then(res => {
                        const userInfo = utils.getDataFromDocs(res.docs)[0];
                        var profileTitle, lastmessage, lastmessageSender, lastmessageContent;
                        /// get conversetion messages
                        const conversationMessages = conversation.messages;
                        /// set conversation title, it would be nickName if user has a nickName, if not it would be display name
                        for(one of conversation.active) {
                            if(one.email != model.currentUser.email) {
                                if(one.nickName != undefined || one.nickName != '') {
                                    profileTitle = one.nickName;
                                } else {
                                    profileTitle = one.display;
                                }
                            }
                        }
                        if(conversationMessages === undefined || conversationMessages.length === 0) {
                            lastmessage = '';
                            lastmessageContent = '';
                            lastmessageSender = '';
                        } else {
                            lastmessage = conversationMessages[conversationMessages.length-1]
                            if(!lastmessage.content) {
                                lastmessageContent = `sent ${utils.converseNumberToWord(lastmessage.images.length)} photo${utils.checkSingularOrPlurar(lastmessage.images.length, 's')}`
                                if(lastmessage.sender === model.currentUser.email) {
                                    lastmessageSender = 'You';
                                } else {
                                    lastmessageSender = profileTitle;
                                }
                            } else {
                                lastmessageContent = lastmessage.content
                                if(lastmessage.sender === model.currentUser.email) {
                                    lastmessageSender = 'You: ';
                                } else {
                                    lastmessageSender = ''
                                }
                            }
                        }
                        conversationElement.innerHTML = `
                            <div class="profile-picture-small" style="background: url(${userInfo.profilePictures[userInfo.profilePictures.length-1]}); background-size: cover;"></div>
                            <div class="profile-info">
                                <div class="profile-name">
                                    <div class="profile-title">${profileTitle}</div>
                                    <div class="profile-actives"></div>
                                    <div class="profile-users"></div>
                                </div>
                                <div class="profile-message">
                                    <div class="last-message">${lastmessageSender} ${lastmessageContent}</div>
                                    <div class="last-time">${utils.countFromTpointToNowReturnHandledString(lastmessage.createdAt)}</div>
                                </div>
                            </div>
                        `
                        activeLight.style.backgroundColor = model.activeLightColor.onMessage;
                        conversationElement.appendChild(activeLight);
                    })
                }
            }
        } else if (conversation.chatType === 'group') {
            //group communication
            var lastmessage, lastmessageSender, lastmessageContent;
            /// get conversetion messages
            const conversationMessages = conversation.messages;
            // count how many users are active at the time
            const activeUsersInBox = controller.countActivesInConversation(conversation.active);

            /// set last message
            if(conversationMessages === undefined || conversationMessages.length === 0) {
                lastmessageContent = '';
                lastmessageSender ='';
                lastmessage = '';
            } else {
                lastmessage = conversationMessages[conversationMessages.length-1]
                if(!lastmessage.content) {
                    lastmessageContent = `sent ${utils.converseNumberToWord(lastmessage.images.length)} photo${utils.checkSingularOrPlurar(lastmessage.images.length, 's')}`
                    if(lastmessage.sender === model.currentUser.email) {
                        lastmessageSender = 'You';
                    } else {
                        for(one of conversation.active) {
                            if(one.email === lastmessage.sender) {
                                if(one.nickName != undefined || one.nickName != null) {
                                    lastmessageSender = one.nickName
                                } else {
                                    lastmessageSender = one.displayName
                                }
                            }
                        }
                    }
                } else {
                    lastmessageContent = lastmessage.content
                    if(lastmessage.sender === model.currentUser.email) {
                        lastmessageSender = 'You:';
                    } else {
                        for(one of conversation.active) {
                            if(one.email === lastmessage.sender) {
                                if(one.nickName != undefined || one.nickName != null) {
                                    lastmessageSender = one.nickName + ":"
                                } else {
                                    lastmessageSender = one.displayName+ ":"
                                }
                            }
                        }
                    }
                }
            }
            conversationElement.innerHTML = `
                            <div class="profile-picture-small" style="background: url(${conversation.picture}); background-size: cover;"></div>
                            <div class="profile-info">
                                <div class="profile-name">
                                    <div class="profile-title">${conversation.title}</div>
                                    <div class="profile-actives">${activeUsersInBox} actives</div>
                                    <div class="profile-users">${conversation.users.length} users</div>
                                </div>
                                <div class="profile-message">
                                    <div class="last-message">${lastmessageSender} ${lastmessageContent}</div>
                                    <div class="last-time">${utils.countFromTpointToNowReturnHandledString(lastmessage.createdAt)}</div>
                                </div>
                            </div>
                            `
                            ///set color of acctive-light and add to conversation element
                            activeLight.style.backgroundColor = model.activeLightColor.onMessage;
                            conversationElement.appendChild(activeLight);
        }
        /// set more class for conversation element
        if(conversation.id === model.currentConversation.id) {
            conversationElement.classList.add('current');
            ///render messages
            view.showCurrentConversation();
        } else {
            conversationElement.classList.add('new-message');
        }
    }
    /// when they're on click they're on choose
    conversationElement.addEventListener('click', e => {view.chooseBoxOfConversation(e.target); console.log(e)})
    //// add to the created conversation to list conversation located on a right side hmtl web
    const listConversation = document.getElementsByClassName('list-conversations');
    listConversation[0].insertAdjacentElement('afterbegin', conversationElement);
}



view.revealImagesAfterLoad = (imageLink) => {
    const imageMessageContainer = document.getElementsByClassName('image-message-container')[0];
    const imageToReveal = document.createElement('div');
    imageToReveal.className = 'block-of-image';
    imageToReveal.innerHTML = components.unchooseImageButton;
    imageToReveal.style.background = `url(${imageLink})`;
    utils.styleForImageBackgroundDiv(imageToReveal);
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



// view.sendConversationRequest = (e) => {
//     const emailToRequest = e.target.email;
// }




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
    showAlert.innerText = '';
    showAlert.parentElement.style.transform = 'translateY(-100vh)';
    showAlert.parentElement.className = 'alertAttention'
    for (a = 0; a < showAlert.parentElement.children.length; a++) {
        showAlert.parentElement.children[a].addEventListener("click", (e) => {e.target.parentElement.style.transform = ''; showAlert.parentElement.className = '';})
    }
    showAlertDelay = setTimeout(() => {showAlert.innerText = message; }, 200);
    autoClearAlert = setTimeout(() => {showAlert.parentElement.style.transform = ''; showAlert.parentElement.className = ''}, 5000);
}