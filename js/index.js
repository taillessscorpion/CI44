window.onload = () => {
    var firebaseConfig = {
        apiKey: "AIzaSyDoa3k_KiUSLxBgKCi9IAQZJNEwm95i3fc",
        authDomain: "chat-ci-44-f113b.firebaseapp.com",
        databaseURL: "https://chat-ci-44-f113b.firebaseio.com",
        projectId: "chat-ci-44-f113b",
        storageBucket: "chat-ci-44-f113b.appspot.com",
        messagingSenderId: "487368875425",
        appId: "1:487368875425:web:b62704103b7d9d4230bfe0",
        measurementId: "G-BVY682JJNQ"
    };
    firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            view.setActiveScreen('chatScreen');
        } else {
            view.setActiveScreen('registerScreen');
        }
    });
}
