
function addMentor(){

    let useremail = document.getElementById('useremail').value;
    let username = document.getElementById('username').value;
    let userpassword = Math.random().toString(36).substring(2,11); 

    signup(useremail,username,userpassword);

}

function signup(email,username,password) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        var user = userCredential.user;
        var templateParams = {
            to_name: 'fahimmaria155@gmail.com', // will be changed here
            from_name: 'Fahim',
            message_html: `Email: ${email}  Password: ${password}`,
            reply_to: 'fahimmaria155@gmail.com'
        };
        const serviceID = 'default_service';
        const templateID = 'template_ix0QvcP6';
        emailjs.send(serviceID, templateID, templateParams).then(() => {
            var random = Math.random().toString(36).substring(2,7);  
            firebase.database().ref('/login/mentor/'+random).set({
                count: 0 ,
                email: email,
                name: username,
                random: random,
                status: 'mentor',
                uid: user.uid
            })
            alertify.set('notifier', 'position', 'top-center');
            alertify.success('Mentor Added!').then(() => {
                location.reload();
            });
            
        }, (err) => {
            alertify.set('notifier', 'position', 'top-center');
            alertify.error('Something Error Happened!');
        })
    })
    .catch((error) => {
        var errorMessage = error.message;
        alertify.error(errorMessage);
    });

}

function readAll() {
    var token = sessionStorage.getItem('email');
    if(!token) 
        location.replace(`${window.origin}`);
    else 
        loginname.innerHTML = `Welcome <strong> ${sessionStorage.getItem('email')} </strong> <span class="pl-2">|</span> `
   
}

function showData() {
    count = 2;
    var tablebody  = document.getElementById('tablebody');
    tablebody.innerHTML =``;
    firebase.database().ref('/login/mentor').on('value', function(snapshot){
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
    // showData();
}

function deleteentry(){
    firebase.database().ref('/login/mentor').on('value', function(snapshot){
        snapshot.forEach((childSnapshot)=>{
            if(childSnapshot.val().email === sessionStorage.getItem('deleteuser')) {
                var ref = firebase.database().ref(`/login/mentor/${childSnapshot.val().random}`);
                ref.remove().then(() => {
                    alertify.set('notifier', 'position', 'top-center');
                    alertify.success('Record Deleted!');
                    location.reload();
                    // showData();
                });
                
            }
        })
    })
    
}


document.getElementById('deletebtn').addEventListener('click', deleteentry);

document.getElementById('adduser').addEventListener('click',addMentor);
showData();
readAll();