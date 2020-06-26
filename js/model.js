const model = {};
model.currentUser = undefined;
model.register = (firstName, lastName, email, password) => {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
        firebase.auth().currentUser.sendEmailVerification();
        firebase.auth().currentUser.updateProfile({
            displayName: firstName + " " + lastName
        });
        view.setAlert(error.message);
        view.setActiveScreen('Resgiter success, please check your email');
    }).catch((error) => {
        view.setAlert(error.message);
    })
}
model.login = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
        if (user.user.emailVerified) {
            model.currentUser = {
                displayName: user.user.displayName,
                email: user.user.email
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
model.logout = () => {
    firebase.auth().signOut().then(() => {}).catch((error) => {
        view.setAlert(error.message);
    });
}