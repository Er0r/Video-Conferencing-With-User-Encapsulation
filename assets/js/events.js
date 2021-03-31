import helpers from './helpers.js';
var mentorref = firebase.database().ref('/login/mentor');

window.addEventListener( 'load', () => {
    //When the chat icon is clicked
    

    sessionStorage.removeItem('sessionLink');
    sessionStorage.removeItem('roomName');
    sessionStorage.removeItem('sessiontime');
    //When the 'Create room" is button is clicked
    document.getElementById( 'create-room' ).addEventListener( 'click', ( e ) => {
        e.preventDefault();

        let roomName  = document.querySelector( '#room-name' ).value;
        let sessiontime = document.getElementById('sessiontime').value;
        if (sessiontime && roomName) {
            //remove error message, if any
            document.querySelector( '#err-msg' ).innerHTML = "";

            //save the user's name in sessionStorage
            sessionStorage.setItem( 'roomName', roomName );

            //create room link
            let sessionLink = `${ location.origin }/room=${ roomName.trim().replace( ' ', '_' ) }_${ helpers.generateRandomString() }`;

            
            document.querySelector( '#room-created' ).innerHTML = `Room successfully created. Click <a href='${ sessionLink }'>here</a> to enter room. 
                Share the room link with your partners.`;

          
            sessionStorage.setItem('sessionLink', sessionLink);
            sessionStorage.setItem('roomName', roomName);
            sessionStorage.setItem('sessiontime', sessiontime);
            
            if(sessionStorage.getItem('sessionLink')){
                addvalue();
            }
        }
        
        else {
            document.querySelector( '#err-msg' ).innerHTML = "All fields are required";
        }
    } );

    if(sessionStorage.getItem('sessionLink')){
        addvalue();
    }

   function addvalue() {
        console.log('OK');
        var random = Math.random().toString(36).substring(2,7);  
        firebase.database().ref('/room/'+random).set({
            sessionLink: sessionStorage.getItem('sessionLink'),
            roomName: sessionStorage.getItem('roomName'),
            sessiontime: sessionStorage.getItem('sessiontime'),
            random: random,
            count: 0
        })

   }
   document.getElementById('logoutbtn').addEventListener('click', ( e ) => {
        e.preventDefault();
        if(!sessionStorage.getItem('email') && !sessionStorage.getItem('status')){
            location.replace(`${window.origin}`);
        } else {
            logout();
        }
   })
} );


function logout() {
    
    firebase.auth().signOut().then(() => {
        
        window.indexedDB.databases().then((r) => {
            for (var i = 0; i < r.length; i++) 
                window.indexedDB.deleteDatabase(r[i].name);
            
        }).then(() => {
            mentorref.on('value', function(snapshot){
                snapshot.forEach((childSnapshot)=>{
                    if(childSnapshot.val().email === sessionStorage.getItem('email')) {
                        firebase.database().ref('/login/mentor/'+childSnapshot.val().random).update({
                            count: 0
                        });
                        sessionStorage.clear('email');
                        sessionStorage.clear('status');
                        alert('Signout Successfully');
                        location.replace(`${location.origin}`);
                    }
                })
            })
            
        }).catch((error) => {
            alert('Please Try Again Later');
        });
        
      }).catch((error) => {
        alert('Please Try Again Later');
    });
}
