var userref = firebase.database().ref('/login/userlogin');
var adminref = firebase.database().ref('/login/admin');
var mentorref = firebase.database().ref('/login/mentorlogin');


var adminloginbtn = document.getElementById('adminloginbtn');
var userloginbtn = document.getElementById('userloginbtn');
var userloginbtn = document.getElementById('userloginbtn');


function signInWithEmailPassword() {
    var email = document.getElementById('adminemail').value;
    var password = document.getElementById('adminpassword').value;
    // [START auth_signin_password]
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        var flag = 0;
        adminref.on('value', function(snapshot){
            snapshot.forEach((childSnapshot)=>{
                
                if(childSnapshot.val().email === user.email && childSnapshot.val().status === 'admin' && childSnapshot.val().count === 0) {
                  alertify.success('Login Successfully');
                  firebase.database().ref('/login/admin/'+childSnapshot.val().random).update({
                    count: firebase.database.ServerValue.increment(1)
                  });
                  location.replace(`${location.origin}/admindashboard`);
                  flag= 1;
                } else if(childSnapshot.val().email === user.email && childSnapshot.val().status === 'user') {
                  alertify.success('Login Successfully');
                  flag= 1;
                } else if(childSnapshot.val().email === user.email && childSnapshot.val().status === 'mentor') {
                  alertify.success('Login Successfully');
                  flag= 1;
                }
                
            })
            if(flag === 0) {
                alertify.error('Please Enter Correct Email And Password');
            } 
        
        })

        
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alertify.error(errorMessage);
      });
}


adminloginbtn.addEventListener('click', signInWithEmailPassword);

