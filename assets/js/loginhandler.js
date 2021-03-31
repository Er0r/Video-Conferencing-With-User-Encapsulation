
var adminref = firebase.database().ref('/login/admin');
var mentorref = firebase.database().ref('/login/mentor');


var adminloginbtn = document.getElementById('adminloginbtn');


function signInWithEmailPassword() {
    var email = document.getElementById('adminemail').value;
    var password = document.getElementById('adminpassword').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        var user = userCredential.user;
        adminref.on('value', function(snapshot){
            var flag = 0;
            snapshot.forEach((childSnapshot)=>{
                if(childSnapshot.val().email === user.email && childSnapshot.val().status === 'admin' ) {
                  if(childSnapshot.val().count >= 1 && flag === 0){
                    // handle multiple login
                    // if (confirm("You Logged In From Another Device. Want To Logout From Everywhere? !")) {
                    //   // txt = "You pressed OK!";
                    //   sessionStorage.clear('email');
                    //   sessionStorage.clear('status');
                    //   firebase.database().ref('/login/admin/'+childSnapshot.val().random).update({
                    //     count: 0
                    //   });
                    // } 
                  } else if(childSnapshot.val().count === 0 && flag === 0) {
                    sessionStorage.setItem('email', user.email);
                    sessionStorage.setItem('status', 'admin');
                    alertify.success('Login Successfully');
                    firebase.database().ref('/login/admin/'+childSnapshot.val().random).update({
                      count: firebase.database.ServerValue.increment(1)
                    });
                    location.replace(`${location.origin}/admindashboard`);
                    flag= 1;
                  } 
                }  
            })
            if(flag === 0) {
                alertify.error('Please Enter Correct Email And Password');
            } 
        })
      
      mentorref.on('value',function(snapshot){
        var flag = 0;
        snapshot.forEach((childSnapshot) => {
          if(childSnapshot.val().email === user.email && childSnapshot.val().status === 'mentor') {
            if(childSnapshot.val().count === 0) {
              sessionStorage.setItem('email', user.email);
              sessionStorage.setItem('status', 'mentor');
              // alertify.success('Login Successfully');
              firebase.database().ref('/login/mentor/'+childSnapshot.val().random).update({
                count: firebase.database.ServerValue.increment(1)
              });
              location.replace(`${location.origin}/mentordashboard`);
              flag=1;
            } else if(childSnapshot.val().count > 0){
              alertify.error('Please Logout From Other Devices To Continue with this Device.');
            }
          }
        })
      })
    })   
  }

adminloginbtn.addEventListener('click', signInWithEmailPassword);

