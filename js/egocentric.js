var fields = ["2","9","4","7","5","3","6","1","8"];
var gameRound = 0;
var computerChoices = [], computerResults = [];
var userChoices = []; userResults = [];
var possibleChoices = [];
var playerTurn = " ";
var endOfGame = 8;
var winner = false;
var choicesWithoutZero = [ ];


function AskUser() {
    var askTurn = confirm("If you want to begin, please press ok");
    if (!askTurn) {
        computerNextRound();
    }
}

function loadImage(id, player, colour) {
    document.getElementById(id).style.background = colour;
    var fieldNumber = id[5];
    pushValue(player, fieldNumber);
    deletePushedValue(fieldNumber);
    if(gameRound>=4){computeResult(player);}
    gameRound += 1;
    managePlayerTurn(player, fieldNumber);
}

function managePlayerTurn(player, fieldNumber){
    if (player == 'user'){
      if(gameRound==endOfGame || winner==true){
         playerTurn == 'user';
      }
      else{
        computerNextRound(fieldNumber);
        playerTurn = 'computer';
      }
    }
    else {
      deletePossibleChoices(fieldNumber);
      playerTurn = 'user';
    }
}

function computerNextRound(fieldNumber) {
    if(gameRound<4){
      if(gameRound<=1){
        withoutZero(fields);
        randomChoice();//alert("fields by random");
        alert("possible first " + choicesWithoutZero);
      }
      else {
        var computerChoice = egocentricStrategy(fieldNumber);
        var choiceString = 'field' + computerChoice; 
        alert("possible second " + possibleChoices);
        setTimeout(function(){loadImage(choiceString, 'computer', 'blue')}, 1000);
      }
    }
    else {egocentricStrategy(fieldNumber);}
}

function pushValue(player, fieldNumber){
    var playerChoice = eval(player + 'Choices');
    playerChoice.push(fieldNumber);
}

function deletePushedValue(fieldNumber){
    var toDeleteField = fields.indexOf(fieldNumber);
      if(toDeleteField){
        alert("delete field: " + fields[toDeleteField]);
        fields.splice(toDeleteField,1, "0");
      }
}

function deletePossibleChoices(fieldNumber){
    for(i=0;i<possibleChoices.length; ++i){
    var checkDelete = possibleChoices[i];
      if(checkDelete == fieldNumber){
        alert("Delete: " + fieldNumber);
        possibleChoices.splice(i, 1,"0");
      }
    }
}

function egocentricStrategy(fieldNumber){
    //alert("Round:" + gameRound);
    
    if (gameRound == 2 || gameRound == 3){
      computeEgocentricChoices();
      possibleChoices = makeUnique(possibleChoices);
      deletePossibleChoices(fieldNumber);
      if(possibleChoices.length > 0) {
        withoutZero(possibleChoices);
        var possibleIndex = Math.floor(Math.random() * (choicesWithoutZero.length));
        var nextChoice = choicesWithoutZero[possibleIndex];
        return nextChoice;
      }
      else{withoutZero(fields);randomChoice();alert("Nix drin!");}
      alert("Next choice:" + nextChoice);
    }
      
    else{
      computeEgocentricChoices();
      possibleChoices = makeUnique(possibleChoices);
      deletePossibleChoices(fieldNumber);
      alert("possible higher: " + possibleChoices);
      //deleteComputerChoices();
      withoutZero(possibleChoices);
      recursiveChoice(k=0);
      
      if(possibleChoices.length > 0){
        randomChoice();alert("possible choices by random");}
      else{
        withoutZero(fields);
        randomChoice();alert("fields by random");
      }
    }
}

function withoutZero(array){
  choicesWithoutZero = [ ];
  for(i=0;i<array.length;++i){
    var nextChoice = array[i];
      if(parseInt(nextChoice) > 0){
        choicesWithoutZero.push(nextChoice);
      }
  }
}
    
function randomChoice(){  
  var possibleIndex = Math.floor(Math.random() * (choicesWithoutZero.length));
  var nextChoice = choicesWithoutZero[possibleIndex];
  var choiceString = 'field' + nextChoice;
  alert("This is random choice");
  setTimeout(function(){loadImage(choiceString, 'computer', 'blue')}, 1000);
}

function recursiveChoice(k){
  for(i=k;i<choicesWithoutZero.length;++i){
    var possibleWin = parseInt(possibleChoices[i]);
    if(gameRound>5){
      for(j=0;j<computerResults.length;++j){
        var addedChoices = parseInt(computerResults[j]);
        if((determineWin(k,possibleWin,addedChoices))==true){alert("inner break");break;}
      }
    }
    else{var addedChoices = parseInt(computerChoices[0]) + parseInt(computerChoices[1]);
        if((determineWin(k, possibleWin,addedChoices))==true){alert("outer break");break;}
    }
    alert("hi");
  }
  alert("hallo");
}

function determineWin(k, possibleWin, addedChoices){
  if(possibleWin + addedChoices == 15){
      var nextChoice = possibleWin;
      var choiceString = 'field' + nextChoice;
      alert("we have a winner!");
      setTimeout(function(){loadImage(choiceString, 'computer', 'blue')}, 1000);
  }
  else {
    if (k == (choicesWithoutZero.length-1)){alert("End of loop!");return true;}
    else {recursiveChoice(k+1);}
  }
  return true;
}

function computeEgocentricChoices(){
  for(i=0;i<fields.length;++i){
    if (gameRound<=3){var adderIndex=0;}
    else {var adderIndex = Math.floor(gameRound/3);}
    var firstPossible = fields[i];
      for(j=0;j<fields.length;++j){
        var secondPossible = fields[j];
        var possibleAddedFields = parseInt(firstPossible) + parseInt(secondPossible);
        if(secondPossible>0 && firstPossible> 0){
          if(secondPossible != firstPossible){
            var adder = 15-parseInt(computerChoices[adderIndex]);
            if(adder > 0){
              if(possibleAddedFields == adder){
                possibleChoices = makeUnique(possibleChoices);
                possibleChoices.push(firstPossible, secondPossible);
              }
            }
          }
        }
      } 
  }
}

function makeUnique(possibleChoices) {
    var hash = {}, uniqueChoices = [];
    for ( var i = 0; i < possibleChoices.length; ++i ) {
        if ( !hash.hasOwnProperty(possibleChoices[i]) ) { 
            hash[ possibleChoices[i] ] = true;
            if(parseInt(possibleChoices[i]) > 0){
                uniqueChoices.push(possibleChoices[i]);
            }
        }
    }
    return uniqueChoices;
}

function computeResult(player){
    var playerChoice = eval(player + 'Choices');
    var playerResults = eval(player + 'Results');
    if(gameRound==4 || gameRound==5){
      var result = parseInt(playerChoice[0])+parseInt(playerChoice[1])+parseInt(playerChoice[2]);
      if(result == 15){won(player);}
      else{ addFirstResults(playerChoice, playerResults);}
    } 
    else {
      var endResult = computeEndResult(playerChoice, playerResults, player);
    }
}

function addFirstResults(playerChoice,playerResults) {
    for(i=0;i<playerChoice.length;++i){
      var first = playerChoice[i];
        for(j=i+1;j<playerChoice.length;++j){
          var second = playerChoice[j];
          var addChoices = parseInt(first) + parseInt(second);
          playerResults.push(addChoices);
        }
    }
}

function computeEndResult(playerChoice, playerResults, player) {
    for(i=0;i<playerResults.length;++i){
      var oldResult = playerResults[i];
      var newResult = parseInt(oldResult) + parseInt(playerChoice[3]);
      if (newResult == 15){won(player);}
    }
    if(gameRound == 7){
      checkForTie(newResult);
    }
}

function checkForTie(newResult){
    if(newResult != 15){
      alert("No winner!");
      backToStart();
    }
}

function won(player){
    alert("The " + player + " has won!");
    winner = true;
    backToStart(); 
}

function backToStart() {
    location.href = "start.html";
}


//var winningNumbers = ["1","5","9","1","6","8","2","4","9","2","5","8","2","6","7","3","4","8","3","5","7","4","5","6"];
/* wenn 1: 5,6,8,9
   wenn 2: 4,5,6,7,8,9
   wenn 3: 4,5,7,8

   wenn 4: 2,3,5,6,8,9
   wenn 5: 1,2,3,4,6,7,8,9
   wenn 6: 1,2,4,5,7,8

   wenn 7: 2,3,5,6
   wenn 8: 1,2,3,4,5,6
   wenn 9: 1,2,4,5
*/
