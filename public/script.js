// heading animation

document.addEventListener("DOMContentLoaded",function(){
    var theLetters = "#*&^+=-"; //You can customize what letters it will cycle through
    var ctnt = "char canvas"; // Your text goes here
    var speed = 10; // ms per frame
    var increment = 4; // frames per step. Must be >2
    
        
    var clen = ctnt.length;       
    var si = 0;
    var stri = 0;
    var block = "";
    var fixed = "";
    //Call self x times, whole function wrapped in setTimeout
    (function rustle (i) {          
    setTimeout(function () {
      if (--i){rustle(i);}
      nextFrame(i);
      si = si + 1;        
    }, speed);
    })(clen*increment+1); 
    function nextFrame(pos){
      for (var i=0; i<clen-stri; i++) {
        //Random number
        var num = Math.floor(theLetters.length * Math.random());
        //Get random letter
        var letter = theLetters.charAt(num);
        block = block + letter;
      }
      if (si == (increment-1)){
        stri++;
      }
      if (si == increment){
      // Add a letter; 
      // every speed*10 ms
      fixed = fixed +  ctnt.charAt(stri - 1);
      si = 0;
      }
      document.getElementById("heading").innerHTML = (fixed + block);
      block = "";
    }
    });

// append char set span tags
const charsets = document.querySelectorAll('.charset')
charsets.forEach(charset => {
    let spanContent = ""
    charset.innerText.split("").forEach(c => spanContent += `<span class="char">${c}</span>`)
    charset.innerHTML = spanContent
})

// create draggable windows
for (const el of document.querySelectorAll('.draggable'))
  dragElement(el);

function dragElement(el) {
    // We'll only need x- and y-positions; may/will change, hence `let`
    let xPos = 0;
    let yPos = 0;
    if (el.querySelector('header')) // Use Element.querySelector() to avoid using unnecessary IDs
      el.querySelector('header').addEventListener('mousedown', dragMouseDown);
    else
      el.addEventListener('mousedown', dragMouseDown);
    
    function dragMouseDown(event) {
      // The event-object will always be passed; no need to refer to window.event
      event.preventDefault();
      
      // No need to save initial mouse-position
      
      document.addEventListener('mouseup', closeDragElement);
      document.addEventListener('mousemove', elementDrag);
    }
    function elementDrag(event) {
      event.preventDefault();
      
      // New positions calculated using MouseEvent.(movementX|movementY)
      xPos += event.movementX;
      yPos += event.movementY;
      
      // Set position as translate() of .style.transform
      el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    }
    function closeDragElement() {
      document.removeEventListener('mouseup', closeDragElement);
      document.removeEventListener('mousemove', elementDrag);
    }
  }