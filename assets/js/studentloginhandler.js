var userref = firebase.database().ref('/login/user');

var userloginbtn = document.getElementById('userloginbtn');

function signInWithEmailPassword() {
    var email = document.getElementById('user_email').value;
    var password = document.getElementById('user_pass').value;
    if(!email || !password) { 
      alert('Please Enter Your Email And Password !');
    } else {
      firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        var user = userCredential.user;
        var logginattempt = 0;
        firebase.database().ref('/login/user').orderByKey().once("value").then(function(snapshot){
            snapshot.forEach((childSnapshot)=>{
                if(childSnapshot.val().email === user.email && childSnapshot.val().status === 'user' && childSnapshot.val().count === 0) {
                    sessionStorage.setItem('email', user.email);
                    sessionStorage.setItem('status', 'student')
                    sessionStorage.setItem('membership', childSnapshot.val().membership);
                    sessionStorage.setItem('username', childSnapshot.val().name);
                    firebase.database().ref('/login/user/'+childSnapshot.val().random).update({
                      count: firebase.database.ServerValue.increment(1)
                    });
                    logginattempt= 1;
                    location.replace(`${location.origin}/studentdashboard`);
                    return true;
                  } 
                else if(childSnapshot.val().email === user.email && childSnapshot.val().status === 'user' && childSnapshot.val().count > 0){
                  document.getElementById('errormsg').innerHTML = `You Are Logged In From Different Device. Please Logout to Continue with this Session`;
                  document.getElementById('errormsg').hidden = false;
                  document.getElementById('userlogoutbtn').hidden = false;
                  document.getElementById('test').style.display = 'none';
                  logginattempt = 1;
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
  }
  userloginbtn.addEventListener('click', signInWithEmailPassword);

  document.getElementById('userlogoutbtn').addEventListener('click', ( e ) => {
    firebase.auth().signOut().then(() => {
      firebase.database().ref('/login/user').on('value', function(snapshot){
          snapshot.forEach((childSnapshot)=>{
              if(childSnapshot.val().count > 0) {
                  firebase.database().ref('/login/user/'+childSnapshot.val().random).update({
                      count: 0
                  });
                  sessionStorage.clear();
                  alertify.success('Signout Successfully');
                  location.replace(`${location.origin}/studentlogin`);
              }
          })
      })
    }).catch((error) => {
      alertify.error('Please Try Again Later');
    });
} )

  userresetpass.addEventListener('click', ( e ) => {
    var auth = firebase.auth();
    var emailAddress = document.getElementById('user_email').value;
    if(!emailAddress) {
      alert('Please Provide your Email Address!');
    } else {
      auth.sendPasswordResetEmail(emailAddress).then(function() {
      
      }).catch(function(error) {
        
      });
    }
    
  })