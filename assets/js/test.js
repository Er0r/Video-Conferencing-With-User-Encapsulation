var registrationdummybtn = document.getElementById('registrationdummybtn');
var registrationuserbtn = document.getElementById('registrationuserbtn');
var registrationmentorbtn = document.getElementById('registrationmentorbtn');
var readallbtn = document.getElementById('readallbtn');

function signUpWithEmailPassword() {
    var email = "fahimmaria@gmail.com";
    var password = "asdasd";
 
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        var user = userCredential.user;
        
        var random = Math.random().toString(36).substring(2,7);  
        firebase.database().ref('/login/admin/'+random).set({
            email: user.email,
            uid: user.uid,
            status: 'admin',
            count: 0,
            random: random
        })
        alertify.success('Data Inserted Successfully');
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alertify.error(errorMessage);
      });

}



function signUpWithEmailPasswordmentor() {
  var email = "mahbubulalamrifat1@gmail.com";
  var password = "asdasd";
   
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in 
      var user = userCredential.user;
      var random = Math.random().toString(36).substring(2,7);

      firebase.database().ref('/login/mentor/'+random).set({
          email: user.email,
          uid: user.uid,
          status: 'mentor',
          count: 0,
          random: random
      })
      alertify.success('Data Inserted Successfully');
    })
    .catch((error) => {
      alertify.error(errorMessage);
    });

}

function signUpWithEmailPassworduser() {
  var email = "fahimmaria155@gmail.com";
  var password = "asdasd";
   
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in 
      var user = userCredential.user;
      var random = Math.random().toString(36).substring(2,7);
      firebase.database().ref('/login/user/'+random).set({
          email: user.email,
          uid: user.uid,
          status: 'user',
          count: 0,
          random: random
      })
      alertify.success('Data Inserted Successfully');
    })
    .catch((error) => {
      alertify.error(errorMessage);
    });

}

function readAll() {
  const request = window.indexedDB.open("firebaseLocalStorageDb", 1);
  request.onerror = function (event) {
     
  };
  request.onsuccess = function (dbEvent) {
      const db = request.result;
      const transaction = db.transaction(["firebaseLocalStorage"]);
      const objectStore = transaction.objectStore("firebaseLocalStorage");
      if ('getAll' in objectStore) {
          objectStore.getAll().onsuccess = function (getAllEvent) {
         
          };
      }
  };
}

registrationdummybtn.addEventListener('click', signUpWithEmailPassword);
registrationuserbtn.addEventListener('click', signUpWithEmailPassworduser);
registrationmentorbtn.addEventListener('click', signUpWithEmailPasswordmentor);
readallbtn.addEventListener('click', readAll);