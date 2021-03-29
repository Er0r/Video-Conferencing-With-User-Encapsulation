import helpers from './helpers.js';

window.addEventListener( 'load', () => {
    //When the chat icon is clicked
    


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

            //show message with link to room
            document.querySelector( '#room-created' ).innerHTML = `Room successfully created. Click <a href='${ sessionLink }'>here</a> to enter room. 
                Share the room link with your partners.`;
                
            var random = Math.random().toString(36).substring(2,7);  
            firebase.database().ref('/room/'+random).set({
                sessionLink: sessionLink,
                roomName: roomName,
                sessiontime: sessiontime
            })

            document.querySelector('#room-name').value = '';
            document.getElementById('sessiontime').value = '';
        }

        else {
            document.querySelector( '#err-msg' ).innerHTML = "All fields are required";
        }
    } );


   

} );
