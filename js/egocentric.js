//namespace for global variables
var globals = { 
  fields : ["2","9","4","7","5","3","6","1","8"],
  gameRound : 0,
  computerChoices : [], computerResults : [], computerPossibleChoices : [],
  userChoices : [], userResults : []
}


function AskUser() {
    var askTurn = confirm("If you want to begin, please press ok");
    if (!askTurn) {
        computerNextRound();
    }
}

//function for game engine
function manageGame(id, player, colour){
    var fieldNumber = id[5];
    loadImage(id, colour);
    pushValue(fieldNumber,player);
    manageDeletion(fieldNumber,player);
    if(globals.gameRound>=4){computeResult(player);}
    globals.gameRound += 1;
    managePlayerTurn(fieldNumber, player);
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

function manageDeletion(fieldNumber,player){
  deletePossibleChoices(fieldNumber);
  deleteFields(fieldNumber);
}

function deleteFields(fieldNumber){
    var toDeleteField = globals.fields.indexOf(fieldNumber);
    globals.fields.splice(toDeleteField,1);
}

function deletePossibleChoices(fieldNumber){
    var possibleForComputer = globals.computerPossibleChoices;
    actualDelete(possibleForComputer, fieldNumber);
}

function actualDelete(possibleChoices, fieldNumber){
    for(i=0;i<possibleChoices.length; ++i){
    var checkDelete = possibleChoices[i];
      if(checkDelete == fieldNumber){
        possibleChoices.splice(i, 1);
      }
    }
}

//to manage who's turn it is
function managePlayerTurn(fieldNumber, player){
    if (player === 'user'){
      player = 'computer';
      computerNextRound(fieldNumber);
    }
    else {
      player = 'user';
    }
}

//different strategies for computer, depending on game round
function computerNextRound(fieldNumber) {
  if(globals.gameRound<=1){
    var computerChoice = randomChoice('globals.fields');
  }
  else {
    var computerChoice = egocentricStrategy(fieldNumber);
  }
  var choiceString = 'field' + computerChoice; 
  setTimeout(function(){manageGame(choiceString, 'computer', 'orange')}, 1000);
}


function egocentricStrategy(fieldNumber){
    prepareChoices(fieldNumber);
    if (globals.gameRound > 3){
      var nextChoice = searchForWin();
      if (nextChoice=="noSuccess"){
        nextChoice = findAlternativeChoices();
      }
    }
    else {
      var nextChoice = findAlternativeChoices();
    }
    return nextChoice;
}

function findAlternativeChoices(){
  if(globals.computerPossibleChoices.length > 0 && globals.computerPossibleChoices != "0"){
    var nextChoice = getNextChoice(globals.computerPossibleChoices);
    if(nextChoice == "stillNoAlternative"){
      nextChoice = getNextChoice("globals.fields");
    }
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

function prepareChoices(fieldNumber){
  computeEgocentricChoices();
  globals.computerPossibleChoices = makeUnique(globals.computerPossibleChoices);
}
    
function randomChoice(array){ 
  var stringArray = eval(array); 
  var possibleIndex = Math.floor(Math.random() * (stringArray.length));
  var nextChoice = stringArray[possibleIndex];
  return nextChoice;
 }

function searchForWin(){
  var noSuccess = "noSuccess";
  if(globals.computerPossibleChoices.length>0){
    for(i=0;i<globals.computerPossibleChoices.length;++i){
      var possibleWin = parseInt(globals.computerPossibleChoices[i]);
      if(globals.gameRound>5){
        var nextChoice = winInLastRounds(possibleWin);
      }
      else{
        var addedChoices = parseInt(globals.computerChoices[0]) + parseInt(globals.computerChoices[1]);
          if(possibleWin + addedChoices == 15){
            var nextChoice = possibleWin;break;
          }
          else{var nextChoice = "noWin";}
      }
    }
    if(nextChoice==possibleWin){return nextChoice;}
    else{return noSuccess;}
  }
  else{return noSuccess;}
}

function winInLastRounds(possibleWin) {
  for(j=0;j<globals.computerResults.length;++j){
    var addedChoices = parseInt(globals.computerResults[j]); 
    if(possibleWin + addedChoices == 15){
      var nextChoice = possibleWin;break;
    }
  }
  var stillNoSuccess = "stillNoSuccess";
  if(nextChoice){return nextChoice;} 
  else {return stillNoSuccess;}
}

function computeEgocentricChoices(){
//alert("before compute: " + globals.computerPossibleChoices);
  for(i=0;i<globals.fields.length;++i){
    var firstPossible = globals.fields[i];
    for(j=0;j<globals.fields.length;++j){
      var secondPossible = globals.fields[j];
      manageChoices(firstPossible,secondPossible);
    } 
  }
}

function manageChoices(firstPossible,secondPossible){
  if(secondPossible>0 && firstPossible> 0){
    if(secondPossible != firstPossible){
      var possibleAddedFields = parseInt(firstPossible) + parseInt(secondPossible);
      var adder = parseInt(computeAdder());
      if(adder > 0 && possibleAddedFields == adder){
        globals.computerPossibleChoices = makeUnique(globals.computerPossibleChoices);
        globals.computerPossibleChoices.push(firstPossible, secondPossible);
      }
    }
  }
}

function computeAdder(){
  if (globals.gameRound<=3){var adderIndex=0;}
  else {var adderIndex = Math.floor(globals.gameRound/3);}
  var adder = 15-parseInt(globals.computerChoices[adderIndex]);
  return adder;
}

function makeUnique(possibleChoices) {
    var hash = {}, uniqueChoices = [];
    for ( var i = 0; i < globals.computerPossibleChoices.length; ++i ) {
        if ( !hash.hasOwnProperty(globals.computerPossibleChoices[i]) ) { 
            hash[ globals.computerPossibleChoices[i] ] = true;
            uniqueChoices.push(globals.computerPossibleChoices[i]);
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
      if (newResult == 15){wins(player);}
    }
    if(globals.gameRound == 7){
      checkForTie(newResult);
    }
}

function checkForTie(newResult){
    if(newResult != 15){
      alert("No winner!");
      backToStart();
    }
}

function wins(player){
    alert("The " + player + " wins!");
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
