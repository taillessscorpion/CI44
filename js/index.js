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
        if (user && user.emailVerified) {
            model.currentUser = {
                displayName: user.displayName,
                email: user.email,
                unsent: {
                    message: '',
                    images: [],
                },
                stored: [],
            }
            view.setActiveScreen('chatScreen');
        } else {
            view.setActiveScreen('loginScreen');
        }
    });

}



// howToStorage = () => {
//     let sendMessageForm = document.getElementById('send-message-form')
//     sendMessageForm.images.addEventListener('change', async function() {
//         firebase.storage().ref().child(`messages/${sendMessageForm.images.files[0].name}`).put(sendMessageForm.images.files[0])
//         console.log(sendMessageForm.images.files[0])
//     })
// }






// templateQueryDatabase = () => {
    
    // get one
    
    // const docId = 'McqJevyNkWloEqiZVhck';
    // firebase.firestore().collection('users').doc(docId).get().then(res => {
    //     console.log(getDataFromDoc(res));
    // }).catch(err => {
    //     console.log(err);
    // })

    // get many

    // firebase.firestore().collection('users').where('name', '==', 'motherfucker').get().then(res => {
    //     // console.log(getDataFromDoc(res.docs[0]));
    //     console.log(getDataFromDocs(res.docs));
    // })

    // create

    // const dataToCreate = {
    //     name: 'adickhead',
    //     age: 95,
    //     gmail: 'unknown@gmail.com',
    //     phoneNumber: ['01949343']
    // }
    // firebase.firestore().collection('users').add(dataToCreate).then(res => {
    //     console.log(res)
    // })

//     update
//     const docIdUpdate = 'dRauorvMjvBIqjgqgQx7';
//     const dataToUpdate = {
//         age: 15,
//         address: 'eastbumbleFuck',
//         phone: firebase.firestore.FieldValue.arrayUnion('312321')
//     }
//     firebase.firestore().collection(model.conversationsCollection).doc(model.currentConversation.id).update(docToUpdate).then()
//     firebase.firestore().collection('users').doc(docIdUpdate).update(dataToUpdate).then(res => {
//         console.log(res);
//     })

//     delete
//     const docIdDelete = 'SxyLnMLBL84HJWKeQ1aS';
//     firebase.firestore().collection('users').doc(docIdDelete).delete().then(res => {
//         console.log(res);
//     })
// }
