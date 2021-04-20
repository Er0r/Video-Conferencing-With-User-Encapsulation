function showData(){
    const mentorshiptablebody = document.getElementById('mentorshiptablebody');
    mentorshiptablebody.innerHTML =``;
    var session_count = 1;
    firebase.database().ref('/mentorship').on('value', function(snapshot){ 
        snapshot.forEach((childSnapshot)=> { 
            firebase.database().ref('/mentorship/'+`${childSnapshot.val().random}/`+`${childSnapshot.val().mentorshipname}`).on('value', function(snap){
                snap.forEach((child) => { 
                    console.log(child.val());
                })
            })
            var newtablerow = document.createElement('tr');
            newtablerow.id = `${childSnapshot.val().mentorshipname}`;
            
            var mentorshipnametabledata = document.createElement('td');
            mentorshipnametabledata.id = `mentor-${session_count}`;
            mentorshipnametabledata.innerHTML = `${childSnapshot.val().mentorshipname}`;

            var action = document.createElement('td');
            action.innerHTML = ` 
                <span
                class="btn btn-warning text-white rounded-pill py-1"
                data-toggle="modal" data-target="#exampleModalCenter"
                id="editbtn-${session_count}"
                onclick="editMentorShip('${childSnapshot.val().mentorshipname}')"
                >Edit</span> 

                <span
                class="btn btn-danger text-white rounded-pill py-1"
                id="deletebtn-${session_count}"
                onclick="deleteMentorShip('${childSnapshot.val().mentorshipname}')"
                >Delete</span>      
            `;
            
            newtablerow.appendChild(mentorshipnametabledata);
            newtablerow.appendChild(action);
            mentorshiptablebody.appendChild(newtablerow);
            session_count++;
        })
    })
}


function editMentorShip(id) {
    sessionStorage.setItem('editmembership', id);
    document.getElementById('editmembership').value = sessionStorage.getItem('editmembership');
    firebase.database().ref('/mentorship').on('value', function(snapshot){
        snapshot.forEach((childSnapshot)=>{ 
            if(childSnapshot.val().mentorshipname === id) {
                sessionStorage.setItem('randommentorship', childSnapshot.val().random);
            }
        }) 
    })
    
}

function deleteMentorShip(id){
    firebase.database().ref('/mentorship').on('value', function(snapshot){
        snapshot.forEach((childSnapshot)=>{ 
            if(childSnapshot.val().mentorshipname === id) {
                var ref = firebase.database().ref(`/mentorship/${childSnapshot.val().random}`);
                ref.remove().then(() => {
                    alertify.set('notifier', 'position', 'top-center');
                    alertify.success(`Mentorship is deleted`);
                    showData();
                    location.reload();
                })
            }   
        })
    })

}



document.getElementById('addmentorshipbtn').addEventListener('click', ( e ) => {
    var mentorshipname = document.getElementById('membership').value;
    var sessionlength = document.getElementsByTagName('input').length;
    var random = Math.random().toString(36).substring(2,7);
    
    firebase.database().ref('/mentorship/'+ random).set({
        count: 0,
        mentorshipname: mentorshipname,
        random: random
    }).then(() => {
        alert('Successfully Done!');
        location.reload();
    })
    document.getElementById('membership').value = '';
    document.getElementById('inputcontainer').value = '';

    for(var i = 1; i < sessionlength;i++) {
        var sessionName = document.getElementsByTagName('input')[i].value;
        firebase.database().ref('/mentorship/'+ `${random}/` + `${mentorshipname}/` + i).set({
            sessionName: sessionName
        })
    }

    document.getElementById('inputcontainer').innerHTML = ``;
    
})


document.getElementById('editaddmentorshipbtn').addEventListener('click', ( e ) => {
    var mentorshipname = document.getElementById('editmembership').value;
    var sessionlength = document.getElementsByTagName('input').length;
    var random = sessionStorage.getItem('randommentorship');
    
    firebase.database().ref('/mentorship/'+ random).set({
        count: 0,
        mentorshipname: mentorshipname,
        random: random
    }).then(() => {
        alert('Successfully Done!');
        location.reload();
    })
    document.getElementById('editmembership').value = ``;
    document.getElementById('editinputcontainer').value = '';

    for(var i = 1; i < sessionlength;i++) {
        var sessionName = document.getElementsByTagName('input')[i].value;
        firebase.database().ref('/mentorship/'+ `${random}/` + `${mentorshipname}/` + i).set({
            sessionName: sessionName
        })
    }

    document.getElementById('editinputcontainer').innerHTML = ``;
    
})

document.getElementById("editaddsession").onclick = function () {
    var ok = true;
     if (ok === true) {
        var div = document.createElement('div');
        div.innerHTML = `<div class="form-group"><input type="text" clas="form-control mb-1" placeholder="Enter Session Name"> </input></div>`
       document.getElementById('editinputcontainer').appendChild(div);
    }
};


document.getElementById("addsession").onclick = function () {
    var ok = true;
     if (ok === true) {
        var div = document.createElement('div');
        div.innerHTML = `<div class="form-group"><input type="text" clas="form-control mb-1" placeholder="Enter Session Name"> </input></div>`
       document.getElementById('inputcontainer').appendChild(div);
    }
};

showData();