function initialize() {
    // e.preventDefault();
    var mentorship = document.getElementById('mentorship');
    firebase.database().ref('/mentorship').on('value', function(snapshot){ 
        snapshot.forEach((childSnapshot) => { 
           var mentorshipstatus =  document.createElement('option');
        //    console.log(childSnapshot.val().mentorshipname);
           mentorshipstatus.innerHTML = childSnapshot.val().mentorshipname;
           mentorship.appendChild(mentorshipstatus);
        })
    })
}

initialize();

const addmentorbtn = document.getElementById('addmentorbtn');

addmentorbtn.addEventListener('click', ( e ) => {
    e.preventDefault();
    var mentormail = document.getElementById('mentormail').value;
    var mentorpass = Math.random().toString(36).substring(2,11); 
    var mentorship = document.getElementById('mentorship').value;
    var mentorname = document.getElementById('mentorname').value;
    console.log(mentormail + ' ' +  mentorpass + ' ' + mentorship);
    signupmentor(mentormail,mentorpass, mentorship, mentorname);
})


function signupmentor(mentormail,mentorpass, mentorship, mentorname) {
    if( !mentormail || mentorship === 'Select Program') {
        alert('Please Fill Up the Information with Correct Credentials');
    } else {
        firebase.auth().createUserWithEmailAndPassword(mentormail, mentorpass)
      .then((userCredential) => {
            var user = userCredential.user;
            var templateParams = {
                to_name: 'fahimmaria155@gmail.com',
                from_name: 'Fahim',
                message_html: `Email: ${mentormail}  Password: ${mentorpass}`,
                reply_to: 'fahimmaria155@gmail.com'
            };
            const serviceID = 'default_service';
            const templateID = 'template_ix0QvcP6';
            emailjs.send(serviceID, templateID, templateParams).then(() => {
                var random = Math.random().toString(36).substring(2,7);  
                firebase.database().ref('/login/mentor/'+random).set({
                    count: 0,
                    name: mentorname,
                    email: mentormail,
                    mentorship: mentorship,
                    random: random,
                    status: 'mentor',
                    uid: user.uid
                })
                alertify.success('Mentor Added!');
            }, (err) => {
                alertify.error('Something Error Happened!');
            })
        })
        .catch((error) => {
            var errorMessage = error.message;
            alertify.error(errorMessage);
        });
    }
}