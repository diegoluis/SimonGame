/*
----- ir generando un array con números del uno al 4, uno cada vez, hasta llegar a 20
----- vincular cada sonido a cada botón
----- hacer que los botones se ejecuten con luz y sonido de acuerdo al array generado
----- hacer que los botones se apaguen antes de que se reproduzca el siguiente sonido
- reproducir el array una vez con una duración determinada y marcar la vuelta en el contador. A medida que aumenta el número de vueltas la velocidad de reproducción aumenta
- reproducir el primer numero y esperar input del jugador
- un programa que almacene las jugadas del jugador y las va comparando con el array, si son correctas vuelve a ejecutar el generador de arrays con un elemento más y una vuelta más.
- si son incorrectas, revisar si está el "strict mode" activado, si es así vuelve a empezar, si no es así, repite la secuencia.
- cuando la máquina está jugando no permitir que los botones se puedan presionar por el jugador
*/
//-----------variables-----------//
var gameMachine = [];
var gamePlayer = [];
//store the pushed button from player
var pushedBtn;
var number;
var start = document.getElementById("start");
var strict = document.getElementById("strict");
//buttons
var green = document.getElementById("green");
var red = document.getElementById("red");
var yellow = document.getElementById("yellow");
var blue = document.getElementById("blue");
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
var counterMachine = 2;
//variable to control the internal steps of each loop
var loop = 0;
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


//---- reproduce automatically the array -------//
timer = 1000;
//associate each number with a button and a sound
function playByNumber(number){
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
    timeoutId = window.setTimeout(removeC, time/1.5);
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
//-ejecutar el readgamemachine por primera vez
//esperar a que el jugador juegue
//ir comparando la jugada del jugador con el correspondiente paso en el array de la máquina
//si las jugadas son correctas aumentar el counter en uno y ejecutar readGameMachine
/* un comparador:
1. almacenar el botón apretado por el jugador en una variable
2. usar el contador como length maximo
document.addEventListener('click', function(e) {
    alert(e.target.id);
});
*/

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
    comparePlays();
  });
}
//---necesito dos counters: 1 que es el que lleva todo el juego
//--otro que indica hasta donde tengo que comparar el juego con la maquina, este counter siempre tiene que volver a 1
// --el counter de todo el juego solo aumenta una vez se haya ejecutado todo el counter del comparador
//tengo que volver a chequear desde el principio siempre
//function to compare play of the player and array of the machine
function comparePlays(){
  //if the button equals the machine advance one position
  if(pushedBtn === gameMachine[loop]){
    loop++;
    console.log("fue igual");
    //see if the cycle is finished
    compareLength();
  }
}
function compareLength(){
  //if loop less, continue comparing
  console.log("estoy en compareLenght " + counterMachine);
  if(loop === counterMachine){
    counterMachine++;
    loop = 0;
    console.log("se acabó este ciclo" + counterMachine + " loop vuelve a cero " + loop);

  }
}

/*
function comparePlays(playPlayer, arrMachine, lengthArr){
  var loop = 0;
  while(loop<=lengthArr){
    if(playPlayer === arrMachine[loop]){
      loop++;
      console.log("loop adentro " + loop + " length " + lengthArr);
    } else{
      console.log("el array " + arrMachine[loop]);
      break;
    }
  }

  if(loop === lengthArr){
    console.log("loop es " + loop);
    return true;
  }
}
*/
//read the array from the machine and reproduce the buttons according to it
function readGameMachine(counter){
  //iterate the function to traverse all the array
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
      console.log(numberMachine);
      //execute the same function with a new number
      readGameMachine(counter);
    }, timer);
  }
}


//start the game creating the array of the machine
start.addEventListener("click", createGMachine);

//prueba
strict.addEventListener("click", function(){
  readGameMachine(0);
});
//steps();
