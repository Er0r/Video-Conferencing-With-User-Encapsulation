function initialize() {
    // e.preventDefault();
    var mentorship = document.getElementById('mentorship');
    firebase.database().ref('/mentorship').on('value', function(snapshot){ 
        snapshot.forEach((childSnapshot) => { 
           var mentorshipstatus =  document.createElement('option');
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
    var mentorname = document.getElementById('mentorname').value;
    signupmentor(mentormail,mentorpass, mentorname);
})


function signupmentor(mentormail,mentorpass, mentorname) {
    if( !mentormail) {
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
                    random: random,
                    status: 'mentor',
                    uid: user.uid
                })
                alertify.set('notifier','position', 'top-center');
                alertify.success('Mentor Added!');
                document.getElementById('mentormail').value='';
                document.getElementById('mentorname').value='';
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