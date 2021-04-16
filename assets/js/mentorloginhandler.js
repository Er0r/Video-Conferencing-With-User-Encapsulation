
var mentorref = firebase.database().ref('/login/mentor');


var mentorloginbtn = document.getElementById('mentorloginbtn');


function signInWithEmailPassword() {
    var email = document.getElementById('mentoremail').value;
    var password = document.getElementById('mentorpassword').value;
    if(!email || !password) {
      document.getElementById('errormsg').innerHTML = `Please Enter Your Email And Password`;
      document.getElementById('errormsg').hidden = false;
    }
    else {
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
                else if(childSnapshot.val().email === user.email && childSnapshot.val().status === 'mentor' && childSnapshot.val().count > 0){
                  document.getElementById('errormsg').innerHTML = `You Are Logged In From Different Device. Please Press Logout TO Continue with this Session`;
                  document.getElementById('errormsg').hidden = false;
                  sessionStorage.setItem('mentorloginemail',email);
                  sessionStorage.setItem('mentorloginpassword', password);
                  document.getElementById('mentorlogoutbtn').hidden = false;
                  document.getElementById('test').style.display = 'none';
                  logginattempt = 1;
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
}
mentorloginbtn.addEventListener('click', signInWithEmailPassword);

document.getElementById('mentorlogoutbtn').addEventListener('click', ( e ) => {
      firebase.auth().signOut().then(() => {
        firebase.database().ref('/login/mentor').on('value', function(snapshot){
            snapshot.forEach((childSnapshot)=>{
                if(childSnapshot.val().count > 0) {
                    firebase.database().ref('/login/mentor/'+childSnapshot.val().random).update({
                        count: 0
                    });
                    document.cookie = "mentor=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    // sessionStorage.clear();
                    alertify.success('Signout Successfully');
                    let em = sessionStorage.getItem('mentorloginemail');
                    let pass = sessionStorage.getItem('mentorloginpassword');
                    if(em && pass) {
                      location.replace(`${location.origin}/testMentor`);
                    } else {
                      location.replace(`${location.origin}/mentorlogin`);
                    }
                    
                }
            })
        })
      }).catch((error) => {
        alertify.error('Please Try Again Later');
      });
} )


document.getElementById('gobackbtn').addEventListener('click', ( e ) => {
  location.replace(`${location.origin}/mentorlogin`);
})

var mentorresetpass = document.getElementById('mentorresetpass');

mentorresetpass.addEventListener('click', ( e ) => {
  var auth = firebase.auth();
  var emailAddress = document.getElementById('mentoremail').value;
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