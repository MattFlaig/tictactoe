var fields = ["2","9","4","7","5","3","6","1","8"];
var gameRound = 0;
var computerChoices = [], computerResults = [];
var userChoices = []; userResults = [];
var possibleChoices = [];
var playerTurn = " ";
var endOfGame = 8;
var winner = false;
var choicesWithoutZero = [];




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
    //var choiceIndex = egocentricStrategy();
    //alert("Index: " + choiceIndex);
    if(gameRound<4){
      if(gameRound<=1){
        var choiceIndex = Math.floor(Math.random() * (fields.length));
        var computerChoice = fields[choiceIndex];
        var choiceString = 'field' + computerChoice;
        //deletePossibleChoices(fieldNumber); 
        setTimeout(function(){loadImage(choiceString, 'computer', 'blue')}, 1000);
      }
      else {
        var computerChoice = egocentricStrategy(fieldNumber);
        var choiceString = 'field' + computerChoice; 
        setTimeout(function(){loadImage(choiceString, 'computer', 'blue')}, 1000);
      }
         
    }
    else {egocentricStrategy(fieldNumber);}

    //alert("Possible: " + possibleChoices);
    //alert("Computerchoice:" + computerChoice);
    //alert("Fields: " + fields);
    
}

function pushValue(player, fieldNumber){
    var playerChoice = eval(player + 'Choices');
    playerChoice.push(fieldNumber);
}

function deletePushedValue(fieldNumber){
    var toDeleteField = fields.indexOf(fieldNumber);
      if(toDeleteField){
        fields.splice(toDeleteField,1, "0"); 
      }
      // if(playerTurn=='computer'){
      //   deletePossibleChoices(fieldNumber);
      // }
}

function deletePossibleChoices(fieldNumber){
    //var toDeletePossible = possibleChoices.indexOf(fieldNumber);
    //alert("Delete:" + possibleChoices[toDeletePossible]);
    for(i=0;i<possibleChoices.length; ++i){
    var checkDelete = possibleChoices[i];
      //alert("Delete: " + fieldNumber);
      //alert("Possible: " + possibleChoices);
      if(checkDelete == fieldNumber){
        possibleChoices.splice(i, 1,"0");
      //alert("Possible after delete: " + possibleChoices);
      }
    }
}


function egocentricStrategy(fieldNumber){
    alert("Round:" + gameRound);
    
    if (gameRound == 2 || gameRound == 3){
      withoutZero();
      computeEgocentricChoices();
      possibleChoices = makeUnique(possibleChoices);
      deletePossibleChoices(fieldNumber);
      //deleteComputerChoices();

      

      //alert("User: " + userChoices);
      //alert("Possible for PC: " + possibleChoices);
      //counter += 1;
      //alert("possible: " + possibleChoices);
      alert(possibleChoices.length);
      if(possibleChoices.length == 0) {var nextChoice = randomChoice();}
      else{
        var possibleIndex = Math.floor(Math.random() * (choicesWithoutZero.length));
        var nextChoice = choicesWithoutZero[possibleIndex];
      }
      //var choiceIndex = fields.indexOf(nextChoice);
      //alert("Next choice:" + nextChoice);
      return nextChoice;
    }

    else if(gameRound == 4 || gameRound == 5){
      //alert("Hoho");
      withoutZero();
      computeEgocentricChoices();
      possibleChoices = makeUnique(possibleChoices);
      deletePossibleChoices(fieldNumber);
      //alert("Possible: " + possibleChoices);
      //deleteComputerChoices();
      recursiveChoice(k=0);
      
      //alert("Möööp!");
      //computeEgocentricChoices();
      //possibleChoices = makeUnique(possibleChoices);
      randomChoice();
      //alert("Next choice:" + nextChoice);
      //return nextChoice;

      //var choiceIndex = fields.indexOf(nex
      
      
      //
    }
      
    else{
      withoutZero();
      computeEgocentricChoices();
      possibleChoices = makeUnique(possibleChoices);
      deletePossibleChoices(fieldNumber);
      //deleteComputerChoices();
      recursiveChoice(k=0);

      randomChoice();
      //alert("Next choice:" + nextChoice);
      //return nextChoice;
    }
}




function withoutZero(){

  for(i=0;i<fields.length;++i){
    var nextChoice = fields[i];
      if(parseInt(nextChoice) > 0){
        choicesWithoutZero.push(nextChoice);
      }
  }
}
    
function randomChoice(){  
  var possibleIndex = Math.floor(Math.random() * (choicesWithoutZero.length));
  var nextChoice = choicesWithoutZero[possibleIndex];
  var choiceString = 'field' + nextChoice;
  setTimeout(function(){loadImage(choiceString, 'computer', 'blue')}, 1000);
  alert("next: " + nextChoice);
}

function recursiveChoice(k){
  for(i=k;i<possibleChoices.length;++i){
    var checker = parseInt(possibleChoices[i]);
    if(checker > 0){var possibleWin = checker;} 
    if(gameRound>5){
      for(j=0;j<computerResults.length;++j){
        var addedChoices = parseInt(computerResults[j]);
        if(determineWin(k,possibleWin,addedChoices)==true){break;}
      }
    }
    else{var addedChoices = parseInt(computerChoices[0]) + parseInt(computerChoices[1]);}
    //alert("possible next:" + possibleChoices);
        if(determineWin(k, possibleWin,addedChoices)==true){break;}
  }
}

function determineWin(k, possibleWin, addedChoices){
  if(possibleWin + addedChoices == 15){
      //alert("Booom!");
      var nextChoice = possibleWin;
      var choiceString = 'field' + nextChoice;
      //alert("recursiveChoice :"+  choiceString);
      setTimeout(function(){loadImage(choiceString, 'computer', 'blue')}, 1000);
      
      //var choiceIndex = fields.indexOf(nextChoice);
  }
  else {
    if (k == (possibleChoices.length-1)){return true;}
    else {recursiveChoice(i+1);}
  }
}


function computeEgocentricChoices(){
  for(i=0;i<fields.length;++i){
      if (gameRound<=3){var adderIndex=0;}
      else {var adderIndex = Math.floor(gameRound/3);}
      //alert("adderindex: " + adderIndex);
      var firstPossible = fields[i];//alert("First: " + firstPossible);
      //alert("adder: " + adder);
        for(j=0;j<fields.length;++j){
  
          var secondPossible = fields[j];
          var possibleAddedFields = parseInt(firstPossible) + parseInt(secondPossible);
        
          if(secondPossible>0 && firstPossible> 0){
            if(secondPossible != firstPossible){
              var adder = 15-parseInt(computerChoices[adderIndex]);
              //alert("Second: "+ secondPossible);
              
              if(adder > 0){
                if(possibleAddedFields == adder){
                  possibleChoices = makeUnique(possibleChoices);
                  //alert("Fields: "+ fields);
                  //alert("possibleChoices: " + possibleChoices);
                  possibleChoices.push(firstPossible, secondPossible);
                }
              }
            }
          }
        } 
  }
  
    
}

function checkIfEmpty(){
  //if(possibleChoices.len == [ ]){
    //var possibleIndex = Math.floor(Math.random() * (fields.length));
    //alert("Index: " + possibleIndex);

    for(i=0;i<fields.length;++i){
    var nextChoice = fields[i];
      if(parseInt(nextChoice) > 0){
        
        alert("next: " + nextChoice);return nextChoice;
      }
    }
    //return nextChoice;
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
