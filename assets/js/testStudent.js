window.onload = function() {
    var email = sessionStorage.getItem('loginemail');
    var password = sessionStorage.getItem('loginpassword');
  
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;
      let logginattempt = 0;
      firebase.database().ref('/login/user').orderByKey().once("value").then(function(snapshot){
        snapshot.forEach((childSnapshot)=>{
            if(childSnapshot.val().email === user.email && childSnapshot.val().status === 'user' && childSnapshot.val().count === 0) {
                sessionStorage.setItem('email', user.email);
                sessionStorage.setItem('status', 'student')
                sessionStorage.setItem('membership', childSnapshot.val().membership);
                sessionStorage.setItem('username', childSnapshot.val().name);
                document.cookie = 'student=studentisactive;'
                firebase.database().ref('/login/user/'+childSnapshot.val().random).update({
                  count: firebase.database.ServerValue.increment(1)
                });
                logginattempt= 1;
                location.replace(`${location.origin}/studentdashboard`);
                return true;
              } 
          })
          if(logginattempt === 0) {
              document.getElementById('errormsg').innerHTML = `Marhaba, tomar password vul`;
              document.getElementById('errormsg').hidden = false;
          }
      })
      
    }).catch((error) => {
      var errormsg  = error.message;
      document.getElementById('errormsg').innerHTML = `${errormsg}`;
      document.getElementById('errormsg').hidden = false;
    })
  }