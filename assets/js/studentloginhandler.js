var userref = firebase.database().ref('/login/user');

var userloginbtn = document.getElementById('userloginbtn');

function signInWithEmailPassword() {
    var email = document.getElementById('user_email').value;
    var password = document.getElementById('user_pass').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        var user = userCredential.user;
        userref.on('value', function(snapshot){
            var flag = 0;
            snapshot.forEach((childSnapshot)=>{
                if(childSnapshot.val().email === user.email && childSnapshot.val().status === 'user' ) {
                  if(childSnapshot.val().count === 0) {
                    sessionStorage.setItem('email', user.email);
                    sessionStorage.setItem('status', 'student')
                    firebase.database().ref('/login/user/'+childSnapshot.val().random).update({
                      count: firebase.database.ServerValue.increment(1)
                    });
                    location.replace(`${location.origin}/studentdashboard`);
                    flag= 1;
                  } else if(childSnapshot.val().count > 0){
                    alertify.error('Please Logout From Other Devices To Continue with this Device.');
                  }
                }  
            })
            if(flag === 0) {
                alertify.error('Please Enter Correct Email And Password');
            } 
        })
      
     
    })   
}

  userloginbtn.addEventListener('click', signInWithEmailPassword);
  userresetpass.addEventListener('click', ( e ) => {
    var auth = firebase.auth();
    var emailAddress = document.getElementById('user_email').value;
    if(!emailAddress) {
      alert('Please Provide your Email Address!');
    } else {
      auth.sendPasswordResetEmail(emailAddress).then(function() {
        console.log('ok');
      }).catch(function(error) {
        console.log(error);
      });
    }
    
  })