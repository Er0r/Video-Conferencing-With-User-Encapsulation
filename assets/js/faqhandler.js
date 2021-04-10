

if(document.getElementById('faqbtn')){
    
    var faqbtn = document.getElementById('faqbtn');

    faqbtn.addEventListener('click', () => {
        var question = document.getElementById('question');
        var answer = document.getElementById('answer');
        var ques = question.value;
        var ans = answer.value; 
        var random = Math.random().toString(36).substring(2,7);
        try{
            firebase.database().ref('/login/admin/faq/'+random).set({
                question: ques,
                answer: ans
            }) 
            alertify.success('FAQ Successfully Added');
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
