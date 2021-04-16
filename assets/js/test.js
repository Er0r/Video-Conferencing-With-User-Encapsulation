window.onload = function() {
  var email = sessionStorage.getItem('adminemail');
  var password = sessionStorage.getItem('adminpassword');

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;
      let logginattempt = 0;
      firebase.database().ref('/login/admin').orderByKey().once("value").then(function(snapshot){
          snapshot.forEach((childSnapshot)=>{
              if(childSnapshot.val().email === user.email && childSnapshot.val().status === 'admin' && childSnapshot.val().count === 0) {
                sessionStorage.setItem('email', user.email);
                sessionStorage.setItem('status', 'admin');
                document.cookie = 'admin=adminisactive;'
                firebase.database().ref('/login/admin/'+childSnapshot.val().random).update({
                  count: firebase.database.ServerValue.increment(1)
                });
                logginattempt=1; 
                location.replace(`${location.origin}/admindashboard`); 
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



  
