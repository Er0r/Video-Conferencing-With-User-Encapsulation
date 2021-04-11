var adminloginbtn = document.getElementById('adminloginbtn');


function signInWithEmailPassword() {
    var email = document.getElementById('adminemail').value;
    var password = document.getElementById('adminpassword').value;
    if(!email || !password) {
      document.getElementById('errormsg').innerHTML = `Please Enter Your Email And Password`;
      document.getElementById('errormsg').hidden = false;
    }
    else {
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
                  logginattempt = 1;
                  location.replace(`${location.origin}/admindashboard`); 
                  return true;
                }
                else if(childSnapshot.val().email === user.email && childSnapshot.val().status === 'admin' && childSnapshot.val().count > 0){
                  document.getElementById('errormsg').innerHTML = `You Are Logged In From Different Device. Please Press Logout TO Continue with this Session`;
                  document.getElementById('errormsg').hidden = false;
                  document.getElementById('adminlogoutbtn').hidden = false;
                  document.getElementById('gobackbtn').hidden = false;
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
adminloginbtn.addEventListener('click', signInWithEmailPassword);

document.getElementById('adminlogoutbtn').addEventListener('click', ( e ) => {
      firebase.auth().signOut().then(() => {
        firebase.database().ref('/login/admin').on('value', function(snapshot){
            snapshot.forEach((childSnapshot)=>{
                if(childSnapshot.val().count > 0) {
                    firebase.database().ref('/login/admin/'+childSnapshot.val().random).update({
                        count: 0
                    });
                    sessionStorage.clear();
                    alertify.success('Signout Successfully');
                    location.replace(`${location.origin}/adminlogin`);
                }
            })
        })
      }).catch((error) => {
        alertify.error('Please Try Again Later');
      });
} )

document.getElementById('gobackbtn').addEventListener('click', ( e ) => {
  location.replace(`${location.origin}/adminlogin`);
})

var adminresetpass = document.getElementById('adminresetpass');

adminresetpass.addEventListener('click', ( e ) => {
  var auth = firebase.auth();
  var emailAddress = document.getElementById('adminemail').value;
  if(!emailAddress) {
    alert('Please Provide your Email Address!');
  } else {
    auth.sendPasswordResetEmail(emailAddress).then(function() {
      alert('Please Check Your Mail. You Will Find A link There');
    }).catch(function(error) {
      alert('Try Again Later');
    });
  }
  
})