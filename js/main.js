/*

- cuando la máquina está jugando no permitir que los botones se puedan presionar por el jugador (ya está con start)
-revisar el css (espacios, etc)
//manejo de errores
- hacer una secuencia especial cuando gane

*/
//-----------variables-----------//
var url = window.location.href;
var gameMachine = [];
//store the pushed button from player
var pushedBtn;
var number;
var start = document.getElementById("start");
var strict = document.getElementById("strict");
var reset = document.getElementById("reset");
//buttons
var green = document.getElementById("green");
var red = document.getElementById("red");
var yellow = document.getElementById("yellow");
var blue = document.getElementById("blue");
var allButtons = document.getElementsByClassName("square");
//button container
var boardInt = document.getElementById("boardInt");
//audios
var audio1 = document.getElementById("s1");
var audio2 = document.getElementById("s2");
var audio3 = document.getElementById("s3");
var audio4 = document.getElementById("s4");
var audioErr = document.getElementById("sErr");
//timer
var timer = 500;
var pause = 500;
// counter on the board
var counterBoard = document.getElementById("counter");
//variable to control the steps of the game
var counterMachine = 1;
var counter = 0;
//variable to control the internal steps of each loop
var loop = 0;
//variable to control the strict mode
var strictValue = false;
//variables to control human and machine
var machine = "machine";
var human = "human";
//var to store a timeout
//var timePause = window.setTimeout(function(){readGameMachine(counter);},pause);;
//------------------------------//

//create the random number and add it to an array
function createGMachine(){
  // generate the sequence of the game of the machine
  for(var i= 0; i<20; i++){
    //execute the random number creator
    getRandom(1,4);
    //push the number in an array
    gameMachine.push(number);
    console.log(gameMachine);
  }
  readGameMachine(counter);
  steps();
}
//get a random number
function getRandom(min, max) {
  number = Math.floor(Math.random() * (max - min + 1)) + min;
  return number;
}
//function to play a sound
function playSound(audio){
  audio.play();
}
//---------add sounds to the buttons--------//

function playSoundErr(){
  playSound(audioErr);
}
green.addEventListener("click", function(){playSound(audio1);});
red.addEventListener("click", function(){playSound(audio2);});
yellow.addEventListener("click", function(){playSound(audio3);});
blue.addEventListener("click", function(){playSound(audio4);});


//activate/deactivate the buttons
///NOT WORKING////
function toggleButtons(buttons, state, color){
  for(var i = 0; i<buttons.length; i++){
      buttons[i].disabled = state;
  }
  if(color ==! undefined){
    color.disabled = false;
  }
}
//toggleButtons(allButtons, true, "en compareLength");
// en playByNumber identificar si el numero es de la maquina
//---- reproduce automatically the array -------//
timer = 1000;
//associate each number with a button and a sound
function playByNumber(number, player){
  increaseSpeed(timer);
  switch (number) {
    case 1:
      playSound(audio1);
      changeClasses(green, "greenGlow", timer);
      if(player === "machine"){
        toggleButtons(allButtons, true, green);
      }else{
        toggleButtons(allButtons, false);
      }

      break;
    case 2:
      playSound(audio2);
      changeClasses(red, "redGlow", timer);
      if(player === "machine"){
        toggleButtons(allButtons, true, red);
      }else{
        toggleButtons(allButtons, false)
      }

      break;
    case 3:
      playSound(audio3);
      changeClasses(yellow, "yellowGlow", timer);
      if(player === "machine"){
        toggleButtons(allButtons, true, yellow);
      }else{
        toggleButtons(allButtons, false)
      }

      break;
    case 4:
      playSound(audio4);
      changeClasses(blue, "blueGlow", timer);
      if(player === "machine"){
        toggleButtons(allButtons, true, blue);
      }else{
        toggleButtons(allButtons, false);
      }

      break;
  }
}
//a generic function to add and remove the glow by the machine
function changeClasses(nameId, nameClass, time){
  nameId.classList.add(nameClass);
  delayRemove();
  //set the timer
  var timeoutId;
  //function to start the timer and a function to remove the class
  function delayRemove(){
    timeoutId = window.setTimeout(removeC, time/2);
  }
  //the function to remove the class
  function removeC(){
    nameId.classList.remove(nameClass);
  }
}
//a function to modify the counter on the board
function boardCounter(counter){
  counterBoard.innerHTML = counter;
}
//a function to do the steps of the game

function steps(){
  //add event listener to identify clicked button
  boardInt.addEventListener("click", function(e){
    pushedBtn = e.target.id;
    switch(pushedBtn){
      case "green":
      pushedBtn = 1;
      break;
      case "red":
      pushedBtn = 2;
      break;
      case "yellow":
      pushedBtn = 3;
      break;
      case "blue":
      pushedBtn = 4;
      break;
    }
    //compare the button pressed to the array of the machine
    comparePlays(pushedBtn);
  });
}

//function to compare play of the player and array of the machine
function comparePlays(pushedBtn){
  //execute the sound and color of the button
  playByNumber(pushedBtn, human);
  //if the button equals the machine advance one position
  if(pushedBtn === gameMachine[loop]){
    loop++;
    //see if the cycle is finished
    compareLength();
  } else if(strictValue){
    //if strict is activated play error
    playSoundErr();
    //add parameter to url
    if (url.indexOf('param=1') === -1){
       url += '?param=1';
    }else{
       url += '?param=1';
    }
    //reload the page with a pause
    window.setTimeout(function(){window.location.href = url;},1000);
  }else{
    //if not the same repeat the cycle and throw an error
    playSoundErr();
    loop = 0;
    window.setTimeout(function(){readGameMachine(counter);},pause);
  }
}
function compareLength(){
  //if loop less, continue comparing otherwise advance one step and play machine
  if(loop === counterMachine){
    counterMachine++;
    loop = 0;
    window.setTimeout(function(){readGameMachine(counter,toggleButtons(allButtons, false, "en compareLength set timeout"));},pause);
  }
}

//read the array from the machine and reproduce the buttons according to it
function readGameMachine(counter){
  //iterate the function to traverse all the array
  increaseSpeed(timer);
  if(counter<counterMachine){
    //establish a timeout
    window.setTimeout(function(){
      //store the number from the array of the machine
      var numberMachine = gameMachine[counter];
      //play a button
      playByNumber(numberMachine, machine);
      //modify the counter according to the laps
      boardCounter(counter + 1);
      //add to the counter
      counter++;
      //execute the same function with a new number
      readGameMachine(counter);
    }, timerSpeed);
  } else if(counter === counterMachine){
    toggleButtons(allButtons, false);
  }
}

//increase the speed when the counter increases
function increaseSpeed(time){
  //until step 7 goes slow, then increases
  if(counterMachine<7){
    return timerSpeed = timer;
  }
  if(counterMachine>=7 && counterMachine<12){
    return timerSpeed = time/1.3;
  } else if(counterMachine>=12){
    return timerSpeed = time/1.6;
  }
}

//start the game creating the array of the machine
start.addEventListener("click", function(){
  start.disabled = true;
  start.classList.add("startDisabled");
  createGMachine();
});

//activate strict mode
strict.addEventListener("click", function(){
  //toggle the strict value on and off
  if(strictValue){
    strictValue = false;
    strict.classList.remove("strictOn");
  }else if(strictValue === false){
    strictValue = true;
    strict.classList.add("strictOn");
  }
});
//restart the game
reset.addEventListener("click", function(){
  window.location.href =  window.location.href.split("?")[0];

});

window.onload = function(){
  toggleButtons(allButtons, true, "en onloadWindow");
  if (url.indexOf('param=1') !== -1){
     createGMachine();
     strictValue = true;
     start.disabled = true;
     start.classList.add("startDisabled");
     console.log(url);
  }
  //check if strict is active to color the button accordingly
  if(strictValue){
    strict.classList.add("strictOn");
  }else if(strictValue === false){
    strict.classList.remove("strictOn");
  }
};

//bug con strict la página se recarga pero reproduce dos vece el primer numero
//desctivado por defecto, solo se activa cuando está jugando el jugador
