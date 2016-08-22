/*

- si son incorrectas, revisar si está el "strict mode" activado, si es así vuelve a empezar, si no es así, repite la secuencia.
- cuando la máquina está jugando no permitir que los botones se puedan presionar por el jugador (ya está con start)
-revisar el css (espacios, etc)
//manejo de errores
- hacer una secuencia especial cuando gane

*/
//-----------variables-----------//
var url = window.location.href;
var gameMachine = [];
//var gamePlayer = [];
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
var allButtons = [green,red,yellow,blue];
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
//length of array
var lengthArray;
// counter on the board
var counterBoard = document.getElementById("counter");
//variable to control the steps of the game
var counterMachine = 1;
var counter = 0;
//variable to control the internal steps of each loop
var loop = 0;
//variable to control the strict mode
var strictValue = false;
/*
var greenGlow = document.getElementsByClassName("greenGlow");
var redGlow = document.getElementsByClassName("redGlow");
var yellowGlow = document.getElementsByClassName("yellowGlow");
var blueGlow = document.getElementsByClassName("blueGlow");
*/
//------------------------------//

//create the random number and add it to an array
function createGMachine(){
  //gameMachine = [];
  //counterMachine = 1;
  //counter = 0;
  //loop = 0;
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
function toggleButtons(action){
  green.disabled = true;
  allButtons.forEach(function(e){
    e.disabled = action;
    console.log(e);
  })
}
//---- reproduce automatically the array -------//
timer = 1000;
//associate each number with a button and a sound
function playByNumber(number){
  increaseSpeed(timer);
  switch (number) {
    case 1:
      playSound(audio1);
      changeClasses(green, "greenGlow", timer);
      break;
    case 2:
      playSound(audio2);
      changeClasses(red, "redGlow", timer);
      break;
    case 3:
      playSound(audio3);
      changeClasses(yellow, "yellowGlow", timer);
      break;
    case 4:
      playSound(audio4);
      changeClasses(blue, "blueGlow", timer);
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
  playByNumber(pushedBtn);
  //if the button equals the machine advance one position
  if(pushedBtn === gameMachine[loop]){
    loop++;
    //see if the cycle is finished
    compareLength();
  } else if(strictValue){
    playSoundErr();
    console.log("strict activado");
    if (url.indexOf('?') !== -1){
       url += 'param=1'
       console.log(url);
    }else{
       url += '?param=1'
       console.log(url);
    }
    window.location.href = url;
    //window.setTimeout(function(){history.go(0)}, 1000);
    //history.go(0);
  }else{
    //if not the same repeat the cycle and throw an error
    playSoundErr();
    loop = 0;
    readGameMachine(counter);
  }
}
function compareLength(){
  //if loop less, continue comparing
  if(loop === counterMachine){
    counterMachine++;
    loop = 0;
    readGameMachine(counter);
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
      playByNumber(numberMachine);
      //modify the counter according to the laps
      boardCounter(counter + 1);
      //add to the counter
      counter++;
      //execute the same function with a new number
      readGameMachine(counter);
    }, timerSpeed);
  }
}

//increase the speed when the counter increases
function increaseSpeed(time){
  //until step 7 goes slow, then increases
  if(counterMachine<7){
    return timerSpeed = timer;
  }
  if(counterMachine>=7 && counterMachine<12){
    console.log("increase " + timerSpeed);
    return timerSpeed = time/1.3;
  } else if(counterMachine>=12){
    console.log("increase " + timerSpeed);
    return timerSpeed = time/1.6;
  }
}

//start the game creating the array of the machine
start.addEventListener("click", function(){
  start.disabled = true;
  start.classList.add("startDisabled");
  createGMachine();
});

//prueba
strict.addEventListener("click", function(){
  console.log("activado el strict "+ url);
  strictValue = true;
});
//restart the game
reset.addEventListener("click", function(){
  history.go(0);
});
/*
var url = window.location.href;
if (url.indexOf('?') !=== -1){
   url += '&param=1'
}else{
   url += '?param=1'
}
window.location.href = url;
*/
window.onload = function(){
  if (url.indexOf('param=1') !== -1){
     createGMachine();
     console.log(url);
  }
}
