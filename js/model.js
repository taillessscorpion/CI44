const model = {};
model.currentUser = undefined;
model.register = (firstName, lastName, email, password) => {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
        firebase.auth().currentUser.sendEmailVerification();
        firebase.auth().currentUser.updateProfile({displayName: firstName + " " + lastName});
        alert("Register successed, please check your email");
    }).catch((error) => {
        // view.setAlert(error.message);
        alert(error.message);
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
            // view.setAlert('Please verify your email!');
            alert('Please verify your email!');
        }
    }).catch((error) => {
        // view.setAlert(error.message);
        alert(error.message);
    })
}
model.logout = () => {
    firebase.auth().signOut().then(() => {}).catch((error) => {
        // view.setAlert(error.message);
        alert(error.message);
    });
}