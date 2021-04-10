

const loginPopup = document.querySelector(".login-popup");
const close = document.querySelector(".close");
const demo = document.querySelector(".demo");



  window.addEventListener("load",function(){
 
   showPopup();

  })

  function showPopup(){
        const timeLimit = 1// seconds;
        let i=0;
        const timer = setInterval(function(){
         i++;
         if(i == timeLimit){
          clearInterval(timer);
           loginPopup.classList.add("show");
         } 
         
        },1);
  }


  close.addEventListener("click",function(){
    loginPopup.classList.remove("show");
  })

