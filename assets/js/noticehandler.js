const deletebtn = document.getElementById('deletebtn');
const editnoticesave = document.getElementById('editnoticesave');
if(document.getElementById('noticebtn')){
    var noticebtn = document.getElementById('noticebtn');

    noticebtn.addEventListener('click', () => {
        const notice = document.getElementById('notice').value;

        var random = Math.random().toString(36).substring(2,7);
        try{
            firebase.database().ref('/login/admin/notice/'+random).set({
                notice: notice,
                random: random
            }) 
            location.reload();
        }catch(err){
            alertify.error(err);
        
        }
    })
}

else {
    var count = 1 ;
    function initialize(){
        const card = document.getElementById('card-cd');
        //firebase snap
        firebase.database().ref('/login/admin/faq').on('value', function(snapshot){
            snapshot.forEach((childSnapshot) => {
                const questionDiv = document.createElement('div');
                questionDiv.className = 'card-header';
                questionDiv.id = `faqHeading-${count}`;
                questionDiv.innerHTML = `
                <div class="mb-0">
                    <h5 
                        class="faq-title" 
                        data-toggle="collapse" 
                        data-target="#faqCollapse-${count}" 
                        data-aria-expanded="true" 
                        data-aria-controls="faqCollapse-${count}"
                    >
                    <span class="badge">${count}</span>${childSnapshot.val().question}
                    </h5>
                </div>
                `
                const answerDiv = document.createElement('div');
                answerDiv.innerHTML = `
                    <div
                        id="faqCollapse-${count}"
                        class="collapse"
                        aria-labelledby="faqHeading-${count}"
                        data-parent="#accordion"
                    >
                        <div class="card-body">
                            <p>
                                ${childSnapshot.val().answer}
                            <p>
                        </div>
                    </div>
                `
                questionDiv.appendChild(answerDiv);
                card.appendChild(questionDiv);
                count++;
            });
        });
        
    }
    initialize();
}


function showData() {
    count = 2;
    var tablebody  = document.getElementById('tablebody');
    firebase.database().ref('/login/admin/notice').on('value', function(snapshot){
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
                ${childSnapshot.val().notice}
            `
            newtabledataemail.id = `email-${count}`;
           
            var newtabledataend = document.createElement('td');
            newtabledataend.innerHTML = `
                <a href="#editEmployeeModal" class="edit" data-toggle="modal"
                    ><i
                        class="material-icons"
                        data-toggle="tooltip"
                        title="Edit"
                        onclick="edithandler(${count})"
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
            newtablerow.appendChild(newtabledataend);
            tablebody.appendChild(newtablerow);
            count++;
        })

    })
    
}

function deletehandler(count){
    const tablerow = document.getElementById(`delete-${count}`).parentElement.parentElement.parentElement.id;
    const currentnode = document.getElementById(tablerow).querySelectorAll('td')[1].id;
    const notice = document.getElementById(currentnode).innerText;
    sessionStorage.setItem('deletenotice', notice);
    showData();
}

 function deleteentry( ){

    firebase.database().ref('/login/admin/notice').on('value', function(snapshot){
        snapshot.forEach((childSnapshot)=>{
            if(childSnapshot.val().notice === sessionStorage.getItem('deletenotice')) {
                var random = childSnapshot.val().random;
                var ref =  firebase.database().ref(`/login/admin/notice/${random}`);
                ref.remove();  
            }
        })
    
    })
    showData();
    location.reload();
}

function edithandler(count){
    const tablerow = document.getElementById(`delete-${count}`).parentElement.parentElement.parentElement.id;
    const currentnode = document.getElementById(tablerow).querySelectorAll('td')[1].id;
    const notice = document.getElementById(currentnode).innerText;
    sessionStorage.setItem('editnotice', notice);
    showData();
}

function editNotice(){
    var editnoticetxt = document.getElementById('editnoticetxt').value;
    firebase.database().ref('/login/admin/notice').on('value', function(snapshot){
        snapshot.forEach((childSnapshot)=>{
            if(childSnapshot.val().notice === sessionStorage.getItem('editnotice')) {
                firebase.database().ref('/login/admin/notice/'+childSnapshot.val().random).set({
                    notice: editnoticetxt,
                    random: childSnapshot.val().random
                });
            }
        })
    })
    location.reload();
    showData();
}

editnoticesave.addEventListener('click', editNotice);

deletebtn.addEventListener('click', deleteentry);


showData();