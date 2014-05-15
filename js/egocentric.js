var fields = ["2","9","4","7","5","3","6","1","8"];
var gameRound = 0;
var computerChoices = [], computerResults = [];
var userChoices = []; userResults = [];
var possibleChoices = [];
var playerTurn = " ";



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
    if(gameRound>=4){computeResult(player)};
    gameRound += 1;
    managePlayerTurn(player);
}

function managePlayerTurn(player){
    if (player == 'user'){
      computerNextRound();
      playerTurn = 'computer';
    }
    else {
      playerTurn = 'user';
    }
}

function computerNextRound() {
    //var choiceIndex = egocentricStrategy();
    //alert("Index: " + choiceIndex);
    var computerChoice = egocentricStrategy();
    var choiceString = 'field' + computerChoice; 
    setTimeout(function(){loadImage(choiceString, 'computer', 'blue')}, 1000); 
}

function pushValue(player, fieldNumber){
    var playerChoice = eval(player + 'Choices');
    playerChoice.push(fieldNumber);
}

function deletePushedValue(fieldNumber){
    var toDeleteField = fields.indexOf(fieldNumber);
    fields.splice(toDeleteField,1); 
    //var toDeletePossible = possibleChoices.indexOf(fieldNumber);
    //alert(possibleChoices[toDeletePossible]);
    //possibleChoices.splice(toDeletePossible, 1)
}

function egocentricStrategy(){

    if(gameRound<=1){
      var choiceIndex = Math.floor(Math.random() * (fields.length));
      var nextChoice = fields[choiceIndex];
    }
    else if (gameRound == 2 || gameRound == 3){
      computeEgocentricChoices();
      possibleChoices = makeUnique(possibleChoices);
      //counter += 1;
      //alert("possible: " + possibleChoices);
      var possibleIndex = Math.floor(Math.random() * (possibleChoices.length));
      var nextChoice = possibleChoices[possibleIndex];
      //var choiceIndex = fields.indexOf(nextChoice);
    }
    else if(gameRound == 4 || gameRound == 5){
      for(i=0;i<possibleChoices.length;++i){
      var possibleWin = parseInt(possibleChoices[i]);
      var addedChoices = parseInt(computerChoices[0]) + parseInt(computerChoices[1]);
        if(possibleWin + addedChoices == 15){
            var nextChoice = possibleWin;
            //var choiceIndex = fields.indexOf(nextChoice);
        }
        else {
            computeEgocentricChoices();
            possibleChoices = makeUnique(possibleChoices);
            var possibleIndex = Math.floor(Math.random() * (possibleChoices.length));
            var nextChoice = possibleChoices[possibleIndex];
            //var choiceIndex = fields.indexOf(nex
        }
      }
    }
    else{
      computeEgocentricChoices();
      possibleChoices = makeUnique(possibleChoices);
      
      for(j=0;j<computerResults.length;++j){
        var result=parseInt(computerResults[j]);
        //alert("result: " + result);
        if(result+possibleWin == 15){
          var nextChoice = possibleWin;
          //var choiceIndex = fields.indexOf(nextChoice);
        }
        else{
          var possibleIndex = Math.floor(Math.random() * (possibleChoices.length));
          var nextChoice = possibleChoices[possibleIndex];
          //var choiceIndex = fields.indexOf(nextChoice);
        }
      }
        
      
    }
  return nextChoice;
  alert("Next choice:" + nextChoice);
}

function computeEgocentricChoices(){
  for(i=0;i<fields.length;++i){
      if (gameRound<=3){var adderIndex=0;}
      else {var adderIndex = Math.floor(gameRound/3);}
      //alert("adderindex: " + adderIndex);
      var firstPossible = fields[i];//alert("First: " + firstPossible);
      var adder = 15-parseInt(computerChoices[adderIndex]);
      //alert("adder: " + adder);
        for(j=0;j<fields.length;++j){
  
          var secondPossible = fields[j];
          //alert("Second: "+ secondPossible);
          var possibleAddedFields = parseInt(firstPossible) + parseInt(secondPossible);
          
          if(possibleAddedFields == adder){
              possibleChoices.push(firstPossible, secondPossible);
          }
        } 
  }
    
}

function makeUnique(possibleChoices) {
    var hash = {}, uniqueChoices = [];
    for ( var i = 0; i < possibleChoices.length; ++i ) {
        if ( !hash.hasOwnProperty(possibleChoices[i]) ) { 
            hash[ possibleChoices[i] ] = true;
            uniqueChoices.push(possibleChoices[i]);
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
