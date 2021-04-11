document.getElementById('addmentorshipbtn').addEventListener('click', ( e ) => {
    var mentorshipname = document.getElementById('membership').value;
    var sessionlength = document.getElementsByTagName('input').length;
    var random = Math.random().toString(36).substring(2,7);
    
    firebase.database().ref('/mentorship/'+ random).set({
        count: 0,
        mentorshipname: mentorshipname
    }).then(() => {
        alert('Successfully Done!');
    })

    for(var i = 1; i < sessionlength;i++) {
        var sessionName = document.getElementsByTagName('input')[i].value;
        firebase.database().ref('/mentorship/'+ `${random}/` + `${mentorshipname}/` + i).set({
            sessionName: sessionName
        })
    }

    
    
})

document.getElementById("addsession").onclick = function () {
    var ok = true;
     if (ok === true) {
        var div = document.createElement('div');
          
        div.innerHTML = `<input type="text" clas="form-control" placeholder="Enter Session Name"> </input>`
        div.className = '';
       document.getElementById('inputcontainer').appendChild(div);
    }
};