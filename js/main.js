/*


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
var pause = 0;
// counter on the board
var counterBoard = document.getElementById("counter");
//variable to control the steps of the game
var counterMachine = 1;
var counter = 0;
//variable to control the internal steps of each loop
var loop = 0;
//control the end of the game
var finalNumber = 20;
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
function toggleButtons(buttons, state){
  //deactivate or activate all the buttons
  for(var i = 0; i<buttons.length; i++){
      buttons[i].disabled = state;
  }
}

//---- reproduce automatically the array -------//
timer = 1000;
//associate each number with a button and a sound
function playByNumber(number, player){
  increaseSpeed(timer);
  //if the machine is playing deactivate the buttons if the human is playing, activate the buttons
  if(player === "machine"){
    toggleButtons(allButtons, true);
  }else{
    toggleButtons(allButtons, false);
  }
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
  return counter;
}

//group varios boardCounters for the error
function boardError(){
  boardCounter(" ");
  window.setTimeout(function(){boardCounter("E");},100);
  window.setTimeout(function(){boardCounter(" ");},50);
  window.setTimeout(function(){boardCounter("!!");},500);
}

//when the human wins
var numRestart = 0;
function triumph(number){
  //do a sequence with the buttons
      window.setTimeout(function(){
           playByNumber(number, machine);
           number++;
           numRestart++;
           triumph(number);
         },200);
    if(number === 4){
      number = 1;
      playByNumber(number, machine);
      number++;
      numRestart++;
      triumph(number);
    }
  //reload the page after some cycles
    if(numRestart === 4){
      urlReload('param=2', 1500)
    }
}
/*
function reload(time){
  window.setTimeout(function(){window.location.href =  window.location.href.split("?")[0];},time);
}
*/
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
    if(loop === finalNumber){
      /*gameMachine.length*/
      //play a sequence of triumph
        return triumph(1);

    }
    //see if the cycle is finished
    compareLength();
  } else if(strictValue){
    //if strict is activated play error
    boardError();
    playSoundErr();
    //add parameter to url and reload
    urlReload('param=1', 1000);
  }else{
    //if not the same repeat the cycle and throw an error
    playSoundErr();
    //show error in the Board Counter
    boardError();
    loop = 0;
    window.setTimeout(function(){readGameMachine(counter);},pause);
  }
}
function compareLength(){
  //if loop less, continue comparing otherwise advance one step and play machine
  if(loop === counterMachine){
    //advance one step in the game of the machine
    counterMachine++;
    loop = 0;
    window.setTimeout(function(){readGameMachine(counter,toggleButtons(allButtons, false));},pause);
  }
}
var counterLaps = counterMachine;
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
    return timerSpeed = time/1.4;
  } else if(counterMachine>=12){
    return timerSpeed = time/1.7;
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

//function to add parameter to url and reload page
function urlReload(parameter, time){
  url = window.location.href.split("?")[0];
  url += '?'+parameter;
  //reload the page with a pause
  window.setTimeout(function(){window.location.href = url;},time);
}
//restart the game
reset.addEventListener("click", function(){
  window.location.href =  window.location.href.split("?")[0];

});
//when the page is loaded
window.onload = function(){
  //buttons deactivated
  toggleButtons(allButtons, true);
  //if reload because of strict mode
  if (url.indexOf('param=1') !== -1){
     createGMachine();
     strictValue = true;
     start.disabled = true;
     start.classList.add("startDisabled");
  } else if(url.indexOf('param=2') !== -1){ //if reload because of winning
    createGMachine();
    strictValue = false;
    start.disabled = true;
    start.classList.add("startDisabled");
  }
  //check if strict is active to color the button accordingly
  if(strictValue){
    strict.classList.add("strictOn");
  }else if(strictValue === false){
    strict.classList.remove("strictOn");
  }
};


//que el contador del tablero no vuelva a empezar cada vez
