
if(document.getElementById('faqbtn')){
    var faqbtn = document.getElementById('faqbtn');

    faqbtn.addEventListener('click', () => {
        const faqques = document.getElementById('faqques').value;
        const faqans = document.getElementById('faqans').value;
        var random = Math.random().toString(36).substring(2,7);
        try{
            firebase.database().ref('/login/admin/faq/'+random).set({
                question: faqques,
                answer: faqans, 
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
    firebase.database().ref('/login/admin/faq').on('value', function(snapshot){
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
                ${childSnapshot.val().question}
            `
            newtabledataemail.id = `email-${count}`;
           
            var newtabledataexpiredate = document.createElement('td');
            
            newtabledataexpiredate.innerHTML = `
                ${childSnapshot.val().answer}
            `
            newtabledataexpiredate.id = `expire-${count}`;

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
            newtablerow.appendChild(newtabledataexpiredate); 
            newtablerow.appendChild(newtabledataend);
            tablebody.appendChild(newtablerow);
            count++;
        })

    })
    
}

function deletehandler(count){
    const tablerow = document.getElementById(`delete-${count}`).parentElement.parentElement.parentElement.id;
    const currentnode = document.getElementById(tablerow).querySelectorAll('td')[1].id;
    const faq = document.getElementById(currentnode).innerText;
    sessionStorage.setItem('deletefaq', faq);
}

 function deleteentry( ){
    firebase.database().ref('/login/admin/faq').on('value', function(snapshot){
        snapshot.forEach((childSnapshot)=>{
            if(childSnapshot.val().question.includes(sessionStorage.getItem('deletefaq'))) {
                var random = childSnapshot.val().random;
                var ref =  firebase.database().ref(`/login/admin/faq/${random}`);
                ref.remove();  
            }
        })
    
    })
    location.reload();
}


function edithandler(count){
    const tablerow = document.getElementById(`delete-${count}`).parentElement.parentElement.parentElement.id;
    const currentnode = document.getElementById(tablerow).querySelectorAll('td')[1].id;
    const faq = document.getElementById(currentnode).innerText;
    sessionStorage.setItem('editfaq', faq);
}

function editNotice(){
    var editfaqquestion = document.getElementById('editfaqquestion').value;
    var editfaqanswer = document.getElementById('editfaqanswer').value;
    
    firebase.database().ref('/login/admin/faq').on('value', function(snapshot){
        snapshot.forEach((childSnapshot)=>{
            if(childSnapshot.val().question.includes(sessionStorage.getItem('editfaq'))) {
                firebase.database().ref('/login/admin/faq/'+childSnapshot.val().random).set({
                    question: editfaqquestion,
                    answer: editfaqanswer,
                    random: childSnapshot.val().random
                });
            }
        })
    })
    location.reload();
    showData();
}

document.getElementById('editfaqsave').addEventListener('click', editNotice);

document.getElementById('deletebtn').addEventListener('click', deleteentry);


showData();