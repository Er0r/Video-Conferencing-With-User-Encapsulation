document.getElementById('addmentorshipbtn').addEventListener('click', ( e ) => {
    e.preventDefault();
    var mentorshipname = document.getElementById('membership').value;
    var random = Math.random().toString(36).substring(2,7);
    firebase.database().ref('/mentorship/'+ random).set({
        count: 0 ,
        mentorshipname: mentorshipname
    }).then(() => {
        alert('Successfully Done!');
    })
    
})