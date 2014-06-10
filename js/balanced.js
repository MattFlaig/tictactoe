//namespace for global variables
var globals = { 
  fields : ["2","9","4","7","5","3","6","1","8"],
  gameRound : 0, ending: false,
  computerChoices : [], computerResults : [], possibleChoices : [],
  userChoices : [], userResults : [], 
  playerTurn : " "
}


function whoBegins(player) {
  if(globals.gameRound==0){
    if (player == "computer") {
        globals.playerTurn = "computer";
        prepareFields();
        computerNextRound();
    }
    else{
        globals.playerTurn = "user";
        prepareFields();
    }
  }
  else{
    disableFields();
  }
}


//function for game engine
function manageGame(id, player, colour){
    var fieldNumber = id[5];
    loadImage(id, colour);
    pushValue(fieldNumber,player);
    manageDeletion(fieldNumber);
    if(globals.gameRound>=4){computeResult(player);}
    globals.gameRound += 1;
    managePlayerTurn(player);
}

function loadImage(id, colour) {
    document.getElementById(id).style.background = colour;
}

function pushValue(fieldNumber, player){
    var playerChoice = 'globals.' + player + 'Choices';
    eval(playerChoice).push(fieldNumber);
}


//functions to delete chosen moves from total fields and possible choices
//fields are all remaining empty fields
//possible choices are all fields where there is still a possibility to win

function manageDeletion(fieldNumber){
  clearPossibleChoices(globals.computerChoices);
  clearPossibleChoices(globals.userChoices);
  deleteFields(fieldNumber);
}

function deleteFields(fieldNumber){
    var toDeleteField = globals.fields.indexOf(fieldNumber);
    globals.fields.splice(toDeleteField,1);
}



function clearPossibleChoices(choices){
    globals.possibleChoices = makeUnique(globals.possibleChoices);
    for(var i=0; i<choices.length;++i){
      var choice = choices[i];
      for (var j=0;j<globals.possibleChoices.length;++j){
        var possible = globals.possibleChoices[j];
        if(possible == choice){
          //alert("possible for " + player + "before delete: " + globals.possibleChoices);
          globals.possibleChoices.splice(j,1);
          //alert("possible for " + player + "after delete: " + globals.possibleChoices);
          
        }
      }
    }
}


//to manage who's turn it is
function managePlayerTurn(player){
    if (player == 'user'){
      if(globals.ending == false){
        globals.playerTurn = 'computer';
        player = 'computer';
        disableFields();
        computerNextRound(player);
      }
      else{
        disableFields();
      }
    }
    else {
      player = 'user';
      globals.playerTurn = 'user';
      prepareFields();
    }
}

function disableFields(){
  for(var i=0;i<9; ++i){
    var fieldString = 'field' + (i+1);
    document.getElementById(fieldString).onclick = "event.cancelBubble = true;";
  }
}

function prepareFields(){
  for(var i=0;i<globals.fields.length;++i){
    var field = globals.fields[i];
    var stringHandler = 'handler' + field, stringField = 'field' + field;
    if(globals.playerTurn == 'computer'){
      document.getElementById(stringHandler).innerHTML = "<div id= " + "'" + stringField + "'" + "></div>";
    } 
    else{
      document.getElementById(stringHandler).innerHTML = "<div id= '" + stringField + "' onclick =\"manageGame(" +
                                                         "'field" + field + "','user', 'black');\"></div>";
    }
  }
}

//different strategies for computer, depending on game round
function computerNextRound(player) {
  if(globals.gameRound<=1){
    var computerChoice = randomChoice('globals.fields');
  }
  else {
    var computerChoice = balancedStrategy(player);
  }
  var choiceString = 'field' + computerChoice; 
  setTimeout(function(){manageGame(choiceString, 'computer', 'orange')}, 1000);
}


function balancedStrategy(player){
    prepareChoices(player);
    var nextChoice = searchForWin(player);
    if (nextChoice=="noSuccess"){
      nextChoice = findBestMove(player);
    }
    return nextChoice;
}

function findBestMove(player){
  var nextChoice = searchForWin('user');
  if (nextChoice=="noSuccess"){
    nextChoice = findAlternativeChoices(player);
  }
  return nextChoice;
}

function findAlternativeChoices(player){
  var possibleChoices = globals.possibleChoices;
  if(possibleChoices.length > 0 && possibleChoices != "0"){
    var nextChoice = getNextChoice("globals.possibleChoices");
    if(nextChoice == "stillNoAlternative"){nextChoice = getNextChoice("globals.fields");}
  }
  else{nextChoice = getNextChoice("globals.fields");}
  return nextChoice;
}

function getNextChoice(array){
  
  var stringArray = eval(array);
  var nextChoice = randomChoice(stringArray);
  if(parseInt(nextChoice)>0){
    return nextChoice;
  }
  else{
    var stillNoAlternative = "stillNoAlternative";
    return stillNoAlternative;
  }
}

function prepareChoices(player){
  globals.possibleChoices = makeUnique(globals.possibleChoices);
  computeEgocentricChoices(player);
}
    
function randomChoice(array){ 
  var stringArray = eval(array); 
  var possibleIndex = Math.floor(Math.random() * (stringArray.length));
  var nextChoice = stringArray[possibleIndex];
  return nextChoice;
 }

function searchForWin(player){
  var playerString = 'globals.' + player + 'Choices', playerChoices = eval(playerString);
  var noSuccess = "noSuccess", fields = globals.fields;
  var nextChoice = getWinningMove(globals.fields, player, noSuccess, playerChoices);
  if(nextChoice){return nextChoice;}
  else{return noSuccess;}
}


function getWinningMove(fields, player, noSuccess, playerChoices){
  for(var i=0;i<fields.length;++i){
    var possibleWin = parseInt(fields[i]);
    if(globals.gameRound>=5){var nextChoice = winInLastRounds(possibleWin,player);if (nextChoice == possibleWin){break;}}
    else{
      var addedChoices = parseInt(playerChoices[0]) + parseInt(playerChoices[1]);
      if(possibleWin + addedChoices == 15){var nextChoice = possibleWin;break;}
      else{var nextChoice = noSuccess;}
    }
  }
  return nextChoice;
}


function winInLastRounds(possibleWin,player) {
  var playerResults = eval('globals.' + player + 'Results');
  for(var j=0;j<playerResults.length;++j){
    var addedChoices = parseInt(playerResults[j]); 
    if(possibleWin + addedChoices == 15){
      var nextChoice = possibleWin;break;
    }
  }
  var stillNoSuccess = "noSuccess";
  if(nextChoice==possibleWin){return nextChoice;} 
  else {return stillNoSuccess;}
}

function computeEgocentricChoices(player){
  for(var i=0;i<globals.fields.length;++i){
    var firstPossible = globals.fields[i];
    for(var j=0;j<globals.fields.length;++j){
      var secondPossible = globals.fields[j];
      manageChoices(firstPossible,secondPossible,player);
    } 
  }
}


function manageChoices(firstPossible,secondPossible,player){
  var possibleChoices = globals.possibleChoices;
    if(secondPossible != firstPossible){
      manageActualChoices(firstPossible,secondPossible,possibleChoices, player);
    }
}

function manageActualChoices(firstPossible,secondPossible,possibleChoices, player){
  var possibleAddedFields = parseInt(firstPossible) + parseInt(secondPossible);
  var adder = parseInt(computeAdder(player));
  if(adder > 0 && possibleAddedFields == adder){
    
    possibleChoices.push(firstPossible, secondPossible);
    globals.possibleChoices = makeUnique(possibleChoices);
    
  }
}

function computeAdder(player){
  var playerChoice = eval('globals.' + player + 'Choices');
  if (globals.gameRound<=3){var adderIndex=0;}
  else {var adderIndex = Math.floor(globals.gameRound/3);}
  var adder = 15-parseInt(playerChoice[adderIndex]);
  return adder;
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


//computing the results, checking if there is a winner
function computeResult(player){
    var playerChoice = eval('globals.' + player + 'Choices');
    var playerResults = eval('globals.' + player + 'Results');
    if(globals.gameRound==4 || globals.gameRound==5){
      var result = parseInt(playerChoice[0])+parseInt(playerChoice[1])+parseInt(playerChoice[2]);
      if(result == 15){wins(player);}
      else{ addFirstResults(playerChoice, playerResults);}
    } 
    else {
      var endResult = computeEndResult(playerChoice, playerResults, player);
    }
}

function addFirstResults(playerChoice,playerResults) {
    for(var i=0;i<playerChoice.length;++i){
      var first = playerChoice[i];
        for(var j=i+1;j<playerChoice.length;++j){
          var second = playerChoice[j];
          var addChoices = parseInt(first) + parseInt(second);
          playerResults.push(addChoices);
        }
    }
}

function computeEndResult(playerChoice, playerResults, player) {
    for(var i=0;i<playerResults.length;++i){
      var oldResult = playerResults[i];
      var newResult = parseInt(oldResult) + parseInt(playerChoice[3]);
      if (newResult == 15){wins(player); break;}
    }
    if(globals.gameRound == 7){
      checkForTie(newResult);
    }
}

function checkForTie(newResult){
    if(newResult != 15){
      globals.ending = true;
      document.getElementById("message").innerHTML ="<div class=" + "'alert alert-info'" +  "id='ending'></div>";
      document.getElementById("ending").innerHTML = "No Winner!" ;
    }
}

function wins(player){
  globals.ending = true;
  if(player=='user'){
     document.getElementById("message").innerHTML ="<div class=" + "'alert alert-success'" +  "id='ending'></div>";
  }
  else{
      document.getElementById("message").innerHTML ="<div class=" + "'alert alert-error'" +  "id='ending'></div>";
  }
     document.getElementById("ending").innerHTML = "The " + player + " wins!";
}

function backToMenu() {
    location.href = "start.html";
}

function restartGame(){
    location.href = "tictactoe_balanced.html";
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
