var circleColour = " ";
var computerColour = "green";
var fieldsComputer = [2,7,6,9,5,1,4,3,8];
var fieldsUser = [2,7,6,9,5,1,4,3,8];
var userChoices = [];
var computerChoices = [];
var playerTurn = " ";
var gameRound = 0;


function AskUser() {
    var askColour = prompt("Welcome to TicTacToe! Which colour do you like - blue or red?");
    if (askColour == "red") {
        circleColour = "red";
    }
    else if (askColour == "blue") {
        circleColour = "blue";
    }
    else {
        alert("Because you did not specify a colour you will play with black!");
        circleColour = "black";
    }

    var askTurn = confirm("If you want to begin, please press ok");
    if (askTurn) {
        playerTurn = "user";
    }
    else {
        playerTurn = "computer";
        computerFirstRound();
    }
}

function loadImage(id) {

    if (playerTurn == "user"){
    document.getElementById(id).style.background= circleColour;
    var firstUserChoice = id[5];
    userChoices.push(firstUserChoice);
    playerTurn = "computer";
    computerFirstRound();
    }
    else {
    document.getElementById(id).style.background= computerColour;
    var firstComputerChoice = id[5];
    computerChoices.push(firstComputerChoice);
    playerTurn = "user";
    userFirstRound();
    }
}

function computerFirstRound() {

    
 }

function possibleChoices() {
    var fieldsComputer = [2,7,6,9,5,1,4,3,8];
    possibleChoicesComputer = [];
    for (i=0; i<fieldsComputer.length;++i){
    var firstField = parseInt(fieldsComputer[i]);
      for (j=0; j<fieldsComputer.length;++j){
      var secondField = parseInt(fieldsComputer[j]);
        for (k=0; k<fieldsComputer.length;++k){
        var thirdField = parseInt(fieldsComputer[k]);
        }
      }
      var addedFields = firstField + secondField + thirdField;
      if(addedFields == 15){
      possibleChoicesComputer.push(firstField, secondField, thirdField);
      }
    }
    return possibleChoicesComputer;
}

/*2,7,6
  9,5,1
  4,3,8

*/

/*

First Round: 
first choice: 5
second choice: 2 || 6 || 8 || 4

Second Round:
=> first aim: blocking user if he has already 2 in a row
=> second aim: simultaneously getting two in a row
=> third aim: trying to establish dilemma for user

*/