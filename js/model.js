const model = {};
model.currentUser = undefined;
model.conversationsCollection = 'conversations';
model.currentConversation = undefined;
model.conversation = undefined;
model.register = (firstName, lastName, email, password) => {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
        firebase.auth().currentUser.sendEmailVerification();
        firebase.auth().currentUser.updateProfile({ displayName: firstName + " " + lastName });
        setTimeout(() => { view.setAlert("Register successed, please check your email"); }, 500);
    }).catch((error) => {
        view.setAlert(error.message);
    })
}
model.login = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
        if (user.user.emailVerified) {
            model.currentUser = {
                displayName: user.user.displayName,
                email: user.user.email,
                unsent: {
                    message: '',
                    images: [],
                },
                stored: [],
            }
            view.setActiveScreen("chatScreen");
        }
        else {
            view.setAlert('Please verify your email!');
        }
    }).catch((error) => {
        view.setAlert(error.message);
    })
}
model.downloadConversations = () => {
    firebase.firestore().collection(model.conversationsCollection).where('users', 'array-contains', model.currentUser.email).get().then(res => {
        const conversationsLoaded = utils.getDataFromDocs(res.docs);
        model.conversation = conversationsLoaded;
        if (conversationsLoaded.length > 0) {
            model.currentConversation = conversationsLoaded[0];
            view.showCurrentConversation();
        }
    });
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
model.listenConversationChange = () => {
    firebase.firestore().collection(model.conversationsCollection).where('users', 'array-contains', model.currentUser.email).onSnapshot(res => {
        const docChanges = res.docChanges();
        const docChangeType = docChanges[0].type;
        if (docChangeType == 'added') {
            // view.showCurrentConversation();
            console.log('added');
        } else if (docChangeType == 'modified') {
            for (oneChange of docChanges) {
                const oneChangeData = utils.getDataFromDoc(oneChange.doc);
                if (oneChangeData.id === model.currentConversation.id) {
                    if(oneChangeData.messages.length != model.currentConversation.messages.length) {
                        model.currentConversation = oneChangeData;
                        view.addMessageToScreen(oneChangeData.messages[oneChangeData.messages.length - 1]);
                    }
                }
                for(i=0;i<model.conversation.length;i++) {
                    if(model.conversation[i].id === oneChangeData.id) {
                        model.conversation[i] =  oneChangeData;
                    }
                }
            }
        }
    })
}
model.logout = () => {
    firebase.auth().signOut().then(() => { }).catch((error) => {
        view.setAlert(error.message);
    });
}
