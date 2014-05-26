//namespace for global variables
var globals = { 
  fields : ["2","9","4","7","5","3","6","1","8"],
  gameRound : 0,
  computerChoices : [], computerResults : [], computerPossibleChoices : ["2","9","4","7","5","3","6","1","8"],
  userChoices : [], userResults : [], userPossibleChoices : ["2","9","4","7","5","3","6","1","8"]
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
  deletePossibleChoices(fieldNumber, player);
  deleteFields(fieldNumber);
}

function deleteFields(fieldNumber){
    var toDeleteField = globals.fields.indexOf(fieldNumber);
    globals.fields.splice(toDeleteField,1);
}

function deletePossibleChoices(fieldNumber){
    var possibleForUser = globals.userPossibleChoices;
    var possibleForComputer = globals.computerPossibleChoices;
    actualDelete(possibleForUser, fieldNumber);
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
    if (player == 'user'){
      player = 'computer';
      computerNextRound(fieldNumber, player);
    }
    else {
      player = 'user';
    }
}



//different strategies for computer, depending on game round
function computerNextRound(fieldNumber, player) {
  
  if(globals.gameRound<=1){var computerChoice = findFirstComputerMove(fieldNumber);}
  else if(globals.gameRound==2 || globals.gameRound==3){var computerChoice = findSecondComputerMove();}
  else {var computerChoice = balancedStrategy(fieldNumber,player);}
  var choiceString = 'field' + computerChoice; 
  setTimeout(function(){manageGame(choiceString, 'computer', 'blue')}, 1000);
}

//strategy for computer's first two moves
function findFirstComputerMove(fieldNumber){
  if(fieldNumber && fieldNumber == 5){var computerChoice = findPossibleEdgeField(globals.fields);}
  else{var computerChoice = '5';}
  return computerChoice;
}

function findSecondComputerMove(){
  var firstUserMove = parseInt(globals.userChoices[0]), secondUserMove = parseInt(globals.userChoices[1]);
  var computerChoice = searchForWin('user');
  if (computerChoice=="noSuccess"){
    computerChoice = findNonReactiveChoice(firstUserMove, secondUserMove);      
  }
  return computerChoice;
}

//find computer move depending on first two user choices
function findNonReactiveChoice(firstUserMove, secondUserMove){
  if(globals.computerChoices[0] == 5 && firstUserMove%2==0 && secondUserMove%2==0){
    var computerChoice = findPossibleOddField(globals.fields);
  }
  else if (globals.computerChoices[0] == 5 && firstUserMove%2==0){
    var computerChoice = 10 - firstUserMove;
  }
  else{
    var computerChoice=computeDilemma(globals.userPossibleChoices, 'user');
    if (typeof computerChoice == "undefined"){
      computerChoice = consultChoiceTree(firstUserMove, secondUserMove);
    }
  }
  return computerChoice;
}

function consultChoiceTree(firstUserMove, secondUserMove){
  if(firstUserMove%2!=0 && secondUserMove%2!=0){
    if (firstUserMove != 5){var computerChoice = findPossibleEdgeField(globals.fields);}
    else {var computerChoice = findPossibleOddField(globals.fields);}
  }
  else{
    if(firstUserMove+secondUserMove%2 != 0){var computerChoice = findPossibleEdgeField(globals.fields);}
    else {var computerChoice = findPossibleOddField(globals.fields);} //evtl statt fields possible choices
  }
  return computerChoice;
}

function findPossibleOddField(fields){
  var fieldOkay=false;
  while (fieldOkay==false){
    var possibleIndex = Math.floor(Math.random() * fields.length);
    var possibleField = fields[possibleIndex];
    if (possibleField%2!=0){fieldOkay = true; return possibleField};
  }
}

function findPossibleEdgeField(fields){
  var fieldOkay=false;
  while (fieldOkay==false){
    var possibleIndex = Math.floor(Math.random() * fields.length);
    var possibleField = fields[possibleIndex];
    if (possibleField%2==0){fieldOkay = true; return possibleField};
  }
}




//strategy for last two computer moves
function balancedStrategy(fieldNumber,player){
    var choicesString = 'globals.' + player + 'PossibleChoices';
    var possibleChoices = eval(choicesString);
    prepareChoices(fieldNumber,player);
    var nextChoice = searchForWin(player);
    if (nextChoice=="noSuccess"){
      nextChoice = findBestMove(possibleChoices,player);
    }
    return nextChoice;
}




//computing fields who are still possible winning fields for the respective player
function prepareChoices(fieldNumber,player){
  var choicesString = 'globals.' + player + 'PossibleChoices';
  var possibleChoices = eval(choicesString);
  possibleChoices = getUniqueOrDouble(possibleChoices);
  computeEgocentricChoices(player, possibleChoices);
}

function computeEgocentricChoices(player, possibleChoices){
  for(i=0;i<possibleChoices.length;++i){
    var firstPossible = globals.fields[i];
    for(j=0;j<possibleChoices.length;++j){
      var secondPossible = possibleChoices[j];
      manageChoices(firstPossible,secondPossible,player);
    } 
  }
}

function manageChoices(firstPossible,secondPossible,player){
  var choicesString = 'globals.' + player + 'PossibleChoices';
  var possibleChoices = eval(choicesString);
    if(secondPossible != firstPossible){
      manageActualChoices(firstPossible,secondPossible,possibleChoices);
    }
}

function manageActualChoices(firstPossible,secondPossible,possibleChoices){
  var possibleAddedFields = parseInt(firstPossible) + parseInt(secondPossible);
  var adder = parseInt(computeAdder());
  if(adder > 0 && possibleAddedFields == adder){
    possibleChoices = getUniqueOrDouble(possibleChoices);
    possibleChoices.push(firstPossible, secondPossible);
  }
}

function computeAdder(){
  if (globals.gameRound<=3){var adderIndex=0;}
  else {var adderIndex = Math.floor(globals.gameRound/3);}
  var adder = 15-parseInt(globals.computerChoices[adderIndex]);
  return adder;
}




//function to take an array with doubled elements and return an unique array 
//if parameter 'doubled' is given, only the doubled elements are returned
function getUniqueOrDouble(possibleChoices, doubled) {
    var hash = {}, uniqueChoices = [], doubleChoices = [];
    for ( var i = 0; i < possibleChoices.length; ++i ) {
        if ( !hash.hasOwnProperty(possibleChoices[i]) ) { 
            hash[ possibleChoices[i] ] = true;
            uniqueChoices.push(possibleChoices[i]);
        }
        else {doubleChoices.push(possibleChoices[i]);}
    }
    if(doubled){return doubleChoices;}
    else{return uniqueChoices;}
}




//check if win first, then check for dilemma, else find alternative move
function findBestMove(possibleChoices,player){
  var nextChoice = searchForWin('user');
  if (nextChoice=="noSuccess"){
    nextChoice = computeDilemma(possibleChoices, player);
    if (typeof nextChoice == "undefined"){
      nextChoice = computeDilemma(possibleChoices, 'user');
      if (typeof nextChoice == "undefined"){
        nextChoice = findAlternativeChoices(player);
      }
    }
  }
  return nextChoice;
}




//search for winning combination
function searchForWin(player){
  var choicesString = 'globals.' + player + 'PossibleChoices', possibleChoices = eval(choicesString);
  var playerString = 'globals.' + player + 'Choices', playerChoices = eval(playerString);
  var noSuccess = "noSuccess";
  if(possibleChoices.length>0){
    nextChoice = getWinningMove(possibleChoices, player, noSuccess, playerChoices);
    if(nextChoice){return nextChoice;}
    else{return noSuccess;}
  }
  else{return noSuccess;}
}

function getWinningMove(possibleChoices, player, noSuccess, playerChoices){
  for(i=0;i<possibleChoices.length;++i){
    var possibleWin = parseInt(possibleChoices[i]);
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
  for(j=0;j<playerResults.length;++j){
    var addedChoices = parseInt(playerResults[j]); 
    if(possibleWin + addedChoices == 15){
      var nextChoice = possibleWin;break;
    }
  }
  var stillNoSuccess = "noSuccess";
  if(nextChoice==possibleWin){return nextChoice;} 
  else {return stillNoSuccess;}
}



//find dilemma to force win
function computeDilemma(possibleChoices, player){
    var possibleDilemmaMoves = findPossibleDilemma(possibleChoices, player);
    var dilemmaMoves = getUniqueOrDouble(possibleDilemmaMoves, doubled=1);//trying alternative getUniqueOrDouble
    var dilemmaIndex = Math.floor(Math.random() * (dilemmaMoves.length));
    var nextChoice = dilemmaMoves[dilemmaIndex];
    if (dilemmaMoves.length<=3){return nextChoice;}//maybe check if this is necessary
    else {return undefined};
}

function findPossibleDilemma(possibleChoices, player){
  var playerString = 'globals.' + player + 'Choices';
  var playerChoice = eval(playerString), possibleDilemmaMoves = [];
  for(i=0;i<possibleChoices.length;++i){
    var first = possibleChoices[i]; 
    for(j=i+1;j<possibleChoices.length;++j){
    var second = possibleChoices[j];
    var firstPossible = parseInt(first) + parseInt(second) + parseInt(playerChoice[0]);
    var secondPossible = parseInt(first) + parseInt(second) + parseInt(playerChoice[1]);
      if(firstPossible == 15 || secondPossible == 15){
        possibleDilemmaMoves.push(first, second);
      }
    }
  }
  return possibleDilemmaMoves;
}




//find alternative choices if there is no possible win and no dilemma
function findAlternativeChoices(player){
  var choicesString = 'globals.' + player + 'PossibleChoices';
  var possibleChoices = eval(choicesString);
  if(possibleChoices.length > 0 && possibleChoices != "0"){
    var nextChoice = getNextChoice(choicesString);
    if(nextChoice == "stillNoAlternative"){nextChoice = getNextChoice("globals.fields");}
  }
  else{nextChoice = getNextChoice("globals.fields");}
  return nextChoice;
}

function getNextChoice(array){
  var stringArray = eval(array);
  var nextChoice = randomChoice(array);
  if(parseInt(nextChoice)>0){return nextChoice;}
  else{var stillNoAlternative = "stillNoAlternative";return stillNoAlternative;}
}
    
function randomChoice(array){ 
  var stringArray = eval(array); 
  var possibleIndex = Math.floor(Math.random() * (stringArray.length));
  var nextChoice = stringArray[possibleIndex];
  return nextChoice;
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
