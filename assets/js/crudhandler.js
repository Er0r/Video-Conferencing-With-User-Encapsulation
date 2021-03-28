const addbtn = document.getElementById('adduser');
const deletebtn = document.getElementById('deletebtn');

function addUser(){

    var useremail = document.getElementById('useremail').value;
    var userpassword = document.getElementById('userpassword').value;
    var membership = document.getElementById('usermembership').value;
    signup(useremail,userpassword, membership);

}

function signup(email,password, membership) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        var user = userCredential.user;
        var templateParams = {
            to_name: 'fahimmaria155@gmail.com',
            from_name: 'Fahim',
            message_html: `Email: ${email}  Password: ${password}`,
            reply_to: 'fahimmaria155@gmail.com'
        };
        const serviceID = 'default_service';
        const templateID = 'template_ix0QvcP6';
        emailjs.send(serviceID, templateID, templateParams).then(() => {
            var random = Math.random().toString(36).substring(2,7);  
            firebase.database().ref('/login/user/'+random).set({
                count: 0 ,
                email: email,
                membership: membership,
                random: random,
                status: 'user',
                uid: user.uid
            })
            alertify.success('User Added!');
        }, (err) => {
            alertify.error('Something Error Happened!');
        })
    })
    .catch((error) => {
        var errorMessage = error.message;
        alertify.error(errorMessage);
    });
    
}
function showData() {
    count = 2;
    var tablebody  = document.getElementById('tablebody');
    firebase.database().ref('/login/user').on('value', function(snapshot){
        snapshot.forEach((childSnapshot)=>{
            var newtablerow = document.createElement('tr');
            newtablerow.id = `tablerow-${count}`;
            var newtabledata = document.createElement('td');
            newtabledata.id = `data-${count}`;
            newtabledata.innerHTML = `
                <span class="custom-checkbox">
                    <input
                        type="checkbox"
                        id="checkbox-${count}"
                        name="options[]"
                        value="${count}"
                    />
                    <label for="checkbox${count}"></label>
                </span>
            `
            var newtabledataemail = document.createElement('td');
            newtabledataemail.innerHTML = `
                ${childSnapshot.val().email}
            `
            newtabledataemail.id = `email-${count}`;
            var newtabledatapassword = document.createElement('td');
            newtabledatapassword.innerHTML = `
                ${childSnapshot.val().uid}
            `
            
            var newtabledatamembership = document.createElement('td');
            newtabledatamembership.innerHTML = `
                ${childSnapshot.val().membership}
            `
            var newtabledataend = document.createElement('td');
            newtabledataend.innerHTML = `
                <a href="#editEmployeeModal" class="edit" data-toggle="modal"
                    ><i
                        class="material-icons"
                        data-toggle="tooltip"
                        title="Edit"
                        id="edit-${count}"
                        >&#xE254;</i
                    ></a
                >
                <a
                    href="#deleteEmployeeModal"
                    class="delete"
                    data-toggle="modal"
                    ><i
                        class="material-icons"
                        data-toggle="tooltip"
                        title="Delete"
                        onclick="deletehandler(${count})"
                        id="delete-${count}"
                        >&#xE872;</i
                    ></a
                >
  
            `
            newtablerow.appendChild(newtabledata);
            newtablerow.appendChild(newtabledataemail); 
            newtablerow.appendChild(newtabledatapassword);
            newtablerow.appendChild(newtabledatamembership);
            newtablerow.appendChild(newtabledataend);
            tablebody.appendChild(newtablerow);
            count++;
        })

    })
    
}

function deletehandler(count){
    const tablerow = document.getElementById(`delete-${count}`).parentElement.parentElement.parentElement.id;
    const currentnode = document.getElementById(tablerow).querySelectorAll('td')[1].id;
    const nodeemail = document.getElementById(currentnode).innerText;
    sessionStorage.setItem('deleteuser', nodeemail);
    
}

function deleteentry(){
    firebase.database().ref('/login/user').on('value', function(snapshot){
        snapshot.forEach((childSnapshot)=>{
            if(childSnapshot.val().email === sessionStorage.getItem('deleteuser')) {
                var ref = firebase.database().ref(`/login/user/${childSnapshot.val().random}`);
                ref.remove();
                
            }
        })
    })

    showData();
}


deletebtn.addEventListener('click', deleteentry);

addbtn.addEventListener('click',addUser);
showData();