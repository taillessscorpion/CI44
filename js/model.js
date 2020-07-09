const model = {};
model.conversationsCollection = 'conversations';
model.usersCollection = 'users';
model.currentUser = undefined;
model.currentConversation = undefined;
model.conversations = undefined;
model.currentPartners = undefined;
model.activeLightColor = {
    onActive: 'rgb(0, 204, 71)',
    onSlowRespone: 'rgb(255, 89, 0)',
    onOffline: 'rgb(199, 199, 199)',
    onMessage: 'rgb(0, 89, 255)',
    onNothing: 'transparent',
}


model.register = (firstName, lastName, email, password) => {
    // register here
    firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
        // created user to ward database
        userToCreate = {
            displayName: firstName + " " + lastName,
            email: email,
            joinedConversations: [''],
            registeredAt: utils.getISOStringDate(),
            profilePictures: [`../images/unverifiedProfile.jpg`],
            lastSeen: utils.getISOStringDate(),
        }
         // verify here
        firebase.auth().currentUser.sendEmailVerification();
        firebase.firestore().collection(model.usersCollection).add(userToCreate).then().catch(err => {console.log(err.message)});
        // delay 0.5 before show an alert
        setTimeout(() => { view.setAlert("Register successed, please check your email"); }, 500);
    }).catch((error) => {
        view.setAlert(error.message);
    })
}
model.login = (email, password) => {
    ///SIGN IN
    firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
        if (user.user.emailVerified) {
            /// FIND USERS
            firebase.firestore().collection(model.usersCollection).where("email", "==", user.user.email).get().then((res) => {
                ///GET CURRENT USER
                model.getCurrentUser(res);
            })
        }
        else {
            view.setAlert('Please verify your email!');
        }
    }).catch((error) => {
        view.setAlert(error.message);
    })
}



model.getCurrentUser = (info) => {
    model.currentUser = utils.getDataFromDoc(info.docs[0])
    model.currentUser.lastSeen = utils.getISOStringDate(),
    model.currentUser.unsent = {message: '', images: [],}
    model.currentUser.stored = [];
}
model.getConversation = (conversationsIdList) => {
    model.conversations = [];
    for(one of conversationsIdList) {
        if(one === conversationsIdList[conversationsIdList.length-1]) {
            firebase.firestore().collection(model.conversationsCollection).where('id', '==', one).get().then(res => {
                const newConversation = utils.getDataFromDocs(res.docs)[0];
                model.conversations[model.conversations.length] = newConversation;
                //// DECLARED CURRENTCONVERSATION
                model.currentConversation = model.conversations[0];
                view.addAllConversations(model.conversations);

            });
        } else {
            firebase.firestore().collection(model.conversationsCollection).where('id', '==', one).get().then(res => {
                const newConversation = utils.getDataFromDocs(res.docs)[0];
                model.conversations[model.conversations.length] = newConversation;
            });
        }
    }
}

model.getImageFilesFromStorage = (imageFile) => {
    model.currentUser.unsent.images.push(imageFile.link);
    view.revealImagesAfterLoad(imageFile.link);
}
model.uploadImageFilesToStorage = async function (imageFile) {
    let imageRef = firebase.storage().ref().child(`images/messages/${imageFile.name}`);
    await imageRef.put(imageFile).then().catch((err) => {
        view.setAlert(err.message);
    });
    await imageRef.getDownloadURL().then((url) => {
        let newImageToStored = {
            name: imageFile.name,
            link: url
        }
        model.currentUser.unsent.images.push(url);
        model.currentUser.stored.push(newImageToStored);
        view.revealImagesAfterLoad(url);
    }).catch((err) => {
        view.setAlert(err.message);
    });
}
model.unstoreImageFiles = async function (url) {
    // let imageRef = firebase.storage().refFromURL(url)
    // await imageRef.delete().then(() => {}).catch(function (err) {
    //     view.setAlert(err.message);
    // });
    let indexOfUrlInUnsent = model.currentUser.unsent.images.indexOf(url);
    model.currentUser.unsent.images.splice(indexOfUrlInUnsent, 1);
    for (i = 0; i < model.currentUser.stored.length; i++) {
        if (url === model.currentUser.stored[i].link) {
            model.currentUser.stored.splice(i, 1);
            break;
        }
    }
}
model.updateDocToFirebase = (parentsKey, value, childsKey) => {
    if (parentsKey === 'messages') {
        if (childsKey === 'message') {
            let messageToUpdate = {
                content: value,
                sender: model.currentUser.email,
                createdAt: utils.getISOStringDate(),
            }
            let docToUpdate = {
                messages: firebase.firestore.FieldValue.arrayUnion(messageToUpdate)
            }
            firebase.firestore().collection(model.conversationsCollection).doc(model.currentConversation.id).update(docToUpdate).then();
        }
        else if (childsKey === 'image') {
            let messageToUpdate = {
                images: value,
                sender: model.currentUser.email,
                createdAt: utils.getISOStringDate(),
            }
            let docToUpdate = {
                messages: firebase.firestore.FieldValue.arrayUnion(messageToUpdate)
            }
            firebase.firestore().collection(model.conversationsCollection).doc(model.currentConversation.id).update(docToUpdate).then();
        }
    } else if (parentsKey === 'imagesShared') {
        for (c = 0; c < value.length; c++) {
            let imagesToUpdate = value[c];
            let docToUpdate = {
                imagesShared: firebase.firestore.FieldValue.arrayUnion(imagesToUpdate)
            }
            firebase.firestore().collection(model.conversationsCollection).doc(model.currentConversation.id).update(docToUpdate).then();
        }
    }

}

model.listenConversationChange = () => {
    // let isFirstRun = false;
    firebase.firestore().collection(model.conversationsCollection).where('id', 'in', model.currentUser.joinedConversations).onSnapshot(res => {
        // if(!isFirstRun) {
        //     isFirstRun = true
        //     return
        // }
        const docChanges = res.docChanges();
        const docChangeType = docChanges[0].type;
        if (docChangeType == 'added') {
            controller.loadConversationFromModel();
            console.log('added');
        } else if (docChangeType == 'modified') {
            console.log(docChanges)
            for (oneChange of docChanges) {
                const oneChangeData = utils.getDataFromDocWithinId(oneChange.doc);
                if (oneChangeData.id === model.currentConversation.id) {
                    if(oneChangeData.messages != model.currentConversation.messages) {
                        model.currentConversation.messages = oneChangeData.messages;
                        view.addMessageToScreen(oneChangeData.messages[oneChangeData.messages.length - 1]);
                        view.addMessageToBox(oneChangeData, model.currentConversation.id)
                    }
                    if(oneChangeData.imagesShared != model.currentConversation.imagesShared) {
                        model.currentConversation.imagesShared = oneChangeData.imagesShared;
                    }
                    if (oneChangeData.active != model.currentConversation.active) {
                        model.currentConversation.active = oneChangeData.active;
                        if(model.currentConversation.chatType === 'private') {
                            for(i=0;i<model.currentConversation.active.length;i++) {
                                if(model.currentConversation.active[i].email != model.currentUser.email) {
                                    if(model.currentConversation.active[i].nickName === undefined || model.currentConversation.active[i].nickName === '') {
                                        view.addTitleToScreen(model.currentConversation.active[i].displayName)
                                        view.addTitleToBox(model.currentConversation.active[i].displayName, model.currentConversation.id)
                                    } else {
                                        view.addTitleToScreen(model.currentConversation.active[i].nickName)
                                        view.addTitleToBox(model.currentConversation.active[i].nickName, model.currentConversation.id)
                                        
                                    }
                                    view.addActivePrivateToBox(model.currentConversation.active[i].lastSeen, model.currentConversation.id)
                                }
                            }
                        } else if(model.currentConversation.chatType === 'group') {
                            const activeUsersInBox = controller.countActivesInConversation(model.currentConversation.active);
                            view.addActiveGroupToBox(activeUsersInBox, model.currentConversation.id);
                            console.log('group change active');
                        }
                    }
                    if (oneChangeData.unreceived != model.currentConversation.unreceived) {
                        model.currentConversation.unreceived = oneChangeData.unreceived;
                        // view.addUnreceivedToScreen()
                    }
                    if (oneChangeData.unseen != model.currentConversation.unseen) {
                        model.currentConversation.unseen = oneChangeData.unseen
                        // view.addUnseenToScreen()
                    }
                    if (oneChangeData.users != model.currentConversation.users) {
                        model.currentConversation.users = oneChangeData.users
                        if(model.currentConversation.chatType === 'group') {
                            view.addUsersGroupToBox(model.currentConversation.users.length, model.currentConversation.id);
                        }
                    }
                    if(oneChangeData.chatType === 'group') {
                        if (oneChangeData.title != model.currentConversation.title) {
                            model.currentConversation.title = oneChangeData.title
                            view.addTitleToScreen(model.currentConversation.title)
                            view.addTitleToBox(model.currentConversation.title, model.currentConversation.id)
                        }
                        if (oneChangeData.picture != model.currentConversation.picture) {
                            model.currentConversation.picture = oneChangeData.picture;
                            view.addPictureToBox(model.currentConversation.picture[model.currentConversation.picture.length], model.currentConversation.id)
                        }
                    }
                } else {
                    for(m=0;m<model.conversations.length;m++) {
                        if(oneChangeData.id === model.conversations[m].id) {
                            if(oneChangeData.messages != model.conversations[m].messages) {
                                model.conversations[m].messages = oneChangeData.messages;
                                view.addMessageToBox(oneChangeData, oneChangeData.id)
                            }
                            if(oneChangeData.imagesShared != model.conversations[m].imagesShared) {
                                model.conversations[m] = oneChangeData;
                            }
                            if (oneChangeData.active != model.conversations[m].active) {
                                model.conversations[m].active = oneChangeData.active;
                                if(model.conversations[m].chatType === 'private') {
                                    for(i=0;i<model.conversations[m].active.length;i++) {
                                        if(model.conversations[m].active[i].email != model.currentUser.email) {
                                            if(model.conversations[m].active[i].nickName === undefined || model.conversations[m].active[i].nickName === '') {
                                                view.addTitleToBox(model.conversations[m].active[i].displayName, oneChangeData.id)
                                            } else {
                                                view.addTitleToBox(model.conversations[m].active[i].nickName, oneChangeData.id)
                                            }
                                            view.addActivePrivateToBox(model.conversations[m].active[i].lastSeen, oneChangeData.id)
                                        }
                                    }
                                } else if(model.conversations[m].chatType === 'group') {
                                    const activeUsersInBox = controller.countActivesInConversation(model.conversations[m].active);
                                    view.addActiveGroupToBox(activeUsersInBox);
                                    console.log('group change active');
                                }
                            }
                            if (oneChangeData.unreceived != model.conversations[m].unreceived) {
                                model.conversations[m].unreceived = oneChangeData.unreceived;
                            }
                            if (oneChangeData.unseen != model.conversations[m].unseen) {
                                model.conversations[m].unseen = oneChangeData.unseen;
                            }
                            if (oneChangeData.users != model.conversations[m].users) {
                                model.conversations[m].users = oneChangeData.users
                                if(model.conversations[m].chatType === 'group') {
                                    view.addUsersGroupToBox(model.conversations[m].users.length, oneChangeData.id);
                                }
                            }
                            if(oneChangeData.chatType === 'group') {
                                if (oneChangeData.title != model.conversations[m].title) {
                                    model.conversations[m].title = oneChangeData.title
                                    view.addTitleToBox(oneChangeData.title, oneChangeData.id)
                                }
                                if (oneChangeData.picture != model.conversations[m].picture) {
                                    model.conversations[m].picture = oneChangeData.picture;
                                    view.addPictureToBox(oneChangeData.picture, oneChangeData.id)
                                }
                            }
                        }
                    }
                }
            }
        } else if (docChangeType == 'removed') {
            console.log('remove');
        }
    })
}




model.logout = () => {
    firebase.auth().signOut().then(() => { }).catch((error) => {
        view.setAlert(error.message);
    });
}
