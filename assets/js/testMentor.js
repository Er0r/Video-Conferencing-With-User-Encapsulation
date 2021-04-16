window.onload = function() {
    var email = sessionStorage.getItem('mentorloginemail');
    var password = sessionStorage.getItem('mentorloginpassword');
  
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;
      let logginattempt = 0;
      firebase.database().ref('/login/mentor').orderByKey().once("value").then(function(snapshot){
        snapshot.forEach((childSnapshot)=>{
            if(childSnapshot.val().email === user.email && childSnapshot.val().status === 'mentor' && childSnapshot.val().count === 0) {
              sessionStorage.setItem('email', user.email);
              sessionStorage.setItem('status', 'mentor');
              sessionStorage.setItem('mentorname', childSnapshot.val().name);
              document.cookie = `mentor=mentorisactive`;
              firebase.database().ref('/login/mentor/'+childSnapshot.val().random).update({
                count: firebase.database.ServerValue.increment(1)
              });
              logginattempt = 1;
              location.replace(`${location.origin}/mentordashboard`); 
              return true;
            }
          })
      })
      
    }).catch((error) => {
      var errormsg  = error.message;
      document.getElementById('errormsg').innerHTML = `${errormsg}`;
      document.getElementById('errormsg').hidden = false;
    })
  }