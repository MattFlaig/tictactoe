//var globals:
//purpose: namespace which contains all global variables, to not pollute the global namespace
//fields are all the fields which are empty in the beginning, 
//the numbers are corresponding to the fields of a magical square (3x3), where all rows/columns/diagonals add to 15
//gameRound is set to 0, arrays for choices and results of user and computer are set to empty
//possibleChoices (the choices with which it is still possible to get 3 in a row/column/diagonal) 
//are identical with fields in the begginning, but will differ from fields when playing

var globals = { 
  fields : ["2","9","4","7","5","3","6","1","8"],
  gameRound : 0, ending: false,
  computerChoices : [], computerResults : [], computerPossibleChoices : ["2","9","4","7","5","3","6","1","8"],
  userChoices : [], userResults : [], userPossibleChoices : ["2","9","4","7","5","3","6","1","8"],
  playerTurn : " "
}

//function WhoBegins():
//depending on which button was pressed, fields are prepared and if 'computer' is sent as parameter, computerNextRound() is called
//when buttons are pushed during the game, the fields are disabled to prevent messing around
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

//function manageGame(id, player, colour):
//purpose:game engine, managing the game actions, taking input from onclick-function in template 
//(for user moves) and from computerNextRound-function (for computer moves)
//first: the computer's or user's chosen image is loaded
//second: the value(fieldNumber) of the chosen image is pushed to the respective choices array
//third: the chosen value is deleted from fields array and possible choices arrays of user and computer
//fourth: if gameRound is 4 or higher, results are computed
//fifth: 1 is added to gameRound
//sixth: function to manage playerturn is called 
function manageGame(id, player, colour){
    var fieldNumber = id[5];
    loadImage(id, colour);
    pushValue(fieldNumber,player);
    manageDeletion(fieldNumber,player);
    if(globals.gameRound>=4){computeResult(player);}
    globals.gameRound += 1;
    managePlayerTurn(fieldNumber, player);
}

//function loadImage(id, colour):
//load the image for the chosen field via changing the css background colour property of the field's id
//(the div is already a white circle on white background, to make it visible we only change the colour)
function loadImage(id, colour) {
    document.getElementById(id).style.background = colour;
}

//function pushValue(fieldNumber, player):
//chosen fieldNumber is pushed to respective Choices array
function pushValue(fieldNumber, player){
    var playerChoice = 'globals.' + player + 'Choices';
    eval(playerChoice).push(fieldNumber);
}


//function manageDeletion(fieldNumber,player):
//calls functions to delete chosen moves from total fields and possible choices
function manageDeletion(fieldNumber,player){
  deletePossibleChoices(fieldNumber, player);
  deleteFields(fieldNumber);
}

//function deleteFields(fieldNumber):
//to delete chosen field from fields array, to be sure that it is not available any more
function deleteFields(fieldNumber){
    var toDeleteField = globals.fields.indexOf(fieldNumber);
    globals.fields.splice(toDeleteField,1);
}

//function deletePossibleChoices(fieldNumber):
//prepare delete of chosen field from possibleChoices arrays, then calling
//actualDelete to delete field from possibleChoices for both computer and user
function deletePossibleChoices(fieldNumber){
    var possibleForUser = globals.userPossibleChoices;
    var possibleForComputer = globals.computerPossibleChoices;
    actualDelete(possibleForUser, fieldNumber);
    actualDelete(possibleForComputer, fieldNumber);
}

//function actualDelete(possibleChoices, fieldNumber):
//loop through respective possibleChoices array of either user or computer
//if element(checkDelete) is equal to chosen field, delete element from array
function actualDelete(possibleChoices, fieldNumber){
    for(i=0;i<possibleChoices.length; ++i){
    var checkDelete = possibleChoices[i];
      if(checkDelete == fieldNumber){
        possibleChoices.splice(i, 1);
      }
    }
}

//function managePlayerTurn(fieldNumber, player)
//purpose: to manage who's turn it is and prepare/disable fields during the game
function managePlayerTurn(fieldNumber, player){
    if (player == 'user'){
      if(globals.ending == false){
        globals.playerTurn = 'computer';
        player = 'computer';
        disableFields();
        computerNextRound(fieldNumber, player);
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
  //hideButtons();
  for(i=0;i<globals.fields.length;++i){
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


//function computerNextRound(fieldNumber, player):
//purpose: different strategies for computer, depending on game round
//each is setting a variable called computerChoice whose value differs,
//depending on the function called
//first: findFirstComputerMove is called if gameRound is 0 or 1
//second: findSecondComputerMove is called if gameRound is 2 or 3
//third: balancedStrategy is called if gameRound is 4 or higher
//the respective computerChoice is then used in a setTimeout function,
//in order to let the computer appear more "human" and not too fast
//this timeout function calls the manageGame function and passes in
//the stringified computerChoice, the computer's playername and the colour

function computerNextRound(fieldNumber, player) {
  if(globals.gameRound<=1){var computerChoice = findFirstComputerMove(fieldNumber);}
  else if(globals.gameRound==2 || globals.gameRound==3){var computerChoice = findSecondComputerMove();}
  else {var computerChoice = balancedStrategy(fieldNumber, player);}
  var choiceString = 'field' + computerChoice; 
  setTimeout(function(){manageGame(choiceString, 'computer', 'teal')}, 1000);
}

//function findFirstComputerMove(fieldNumber):
//purpose:strategy for computer's first move
//if he does not begin (means there already is a fieldNumber as argument) and field 5 is not free, he will 
//choose an edgefield (by calling findPossibleEdgeField) else, he will choose the field in the middle(5)
function findFirstComputerMove(fieldNumber){
  if(fieldNumber && fieldNumber == 5){var computerChoice = findPossibleEdgeField(globals.fields);}
  else{var computerChoice = '5';}
  return computerChoice;
}

//function findSecondComputerMove():
//purpose:strategy for computers second move
//if user has already two in a row/column, computer tries to prevent him from winning
//else findNonReactiveChoice is called to find the best possible move
function findSecondComputerMove(){
  var firstUserMove = parseInt(globals.userChoices[0]), secondUserMove = parseInt(globals.userChoices[1]);
  var computerChoice = searchForWin('user');
  if (computerChoice=="noSuccess"){
    computerChoice = findNonReactiveChoice(firstUserMove, secondUserMove);      
  }
  return computerChoice;
}

//function findNonReactiveChoice(firstUserMove, secondUserMove):
//purpose:find computer move depending on first two user choices
//this function uses the fact that in the 3x3-magical square used
//2--9--4
//7--5--3
//6--1--8
//the edgefields are all divisable by 2, the others are not
//the first two cases below are looking on the possible moves
//if the computer's first move was 5 and the user either has
//made already two moves on diagonal edgefields (in which case he will choose a random odd field
//to prevent a dilemma) or just one (in which case he will go for the last free field of the diagonal,
//which is preparing a dilemma for the user) 
//Remember:the case of two edgefields in a row or column is already taken care of
//in the findSecondComputerMove function
//In all other cases the computer looks first, if there is a possiblity for the user to
//lure the computer into a dilemma (by calling the computeDilemma function), or, if
//there is none, find the next computer move by calling consultChoiceTree  
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

//function consultChoiceTree(firstUserMove, secondUserMove):
//purpose: helping to find a decision for computer's second move, depending on user choices where odd fields are involved
function consultChoiceTree(firstUserMove, secondUserMove){
  if(firstUserMove%2!=0 && secondUserMove%2!=0){
    if (firstUserMove != 5){var computerChoice = findPossibleEdgeField(globals.fields);}
    else {var computerChoice = findPossibleOddField(globals.fields);}
  }
  else{
    if(firstUserMove+secondUserMove%2 != 0){var computerChoice = findPossibleEdgeField(globals.fields);}
    else {var computerChoice = findPossibleOddField(globals.fields);} //evtl possible choices instead of fields
  }
  return computerChoice;
}

//function findPossibleOddField(fields):
//purpose: determining a free odd field by random
function findPossibleOddField(fields){
  var fieldOkay=false;
  while (fieldOkay==false){
    var possibleIndex = Math.floor(Math.random() * fields.length);
    var possibleField = fields[possibleIndex];
    if (possibleField%2!=0){fieldOkay = true; return possibleField};
  }
}

//function findPossibleEdgeField(fields):
//purpose: determining a free edge field by random
function findPossibleEdgeField(fields){
  var fieldOkay=false;
  while (fieldOkay==false){
    var possibleIndex = Math.floor(Math.random() * fields.length);
    var possibleField = fields[possibleIndex];
    if (possibleField%2==0){fieldOkay = true; return possibleField};
  }
}



//function balancedStrategy(fieldNumber,player):
//purpose: strategy for last two computer moves
//after preparing the possible choices for respective player
//it is searched for a possible win of the player
//if there is none, findBestMove is called
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



//function prepareChoices(fieldNumber,player):
//purpose: computing fields who are still possible winning fields for the respective player
//this is done by calling computeEgocentricChoices
function prepareChoices(fieldNumber,player){
  var choicesString = 'globals.' + player + 'PossibleChoices';
  var possibleChoices = eval(choicesString);
  //possibleChoices = getUniqueOrDouble(possibleChoices);
  computeEgocentricChoices(player, possibleChoices);
}

//function computeEgocentricChoices(player, possibleChoices):
//contains nested for loop to prepare parameters for manageChoices function which is called from the inner loop
function computeEgocentricChoices(player, possibleChoices){
  for(i=0;i<possibleChoices.length;++i){
    var firstPossible = globals.fields[i];
    for(j=0;j<possibleChoices.length;++j){
      var secondPossible = possibleChoices[j];
      manageChoices(firstPossible,secondPossible,player);
    } 
  }
}

//function manageChoices(firstPossible,secondPossible,player):
//contains an if statement to check if the two first parameters are equal, if not,
//it calls the manageActualChoices function
function manageChoices(firstPossible,secondPossible,player){
  var choicesString = 'globals.' + player + 'PossibleChoices';
  var possibleChoices = eval(choicesString);
    if(secondPossible != firstPossible){
      manageActualChoices(firstPossible,secondPossible,possibleChoices);
    }
}

//function manageActualChoices(firstPossible,secondPossible,possibleChoices):
//purpose: decide if firstPossible/secondPossible can be pushed to possible choices
//first, a variable possibleAddedFields is set. second, the adder is computed. What is the adder?
//the adder is a sum of two numbers, corresponding to fields which are still possible winning fields
//(based on the choices already made, see computeAdder function)
//If the computed adder and the possibleAddedFields-variable are equal, the two parameters 
//firstPossible and secondPossible are pushed into the respective possibleChoices array (of either computer or user) 
function manageActualChoices(firstPossible,secondPossible,possibleChoices){
  var possibleAddedFields = parseInt(firstPossible) + parseInt(secondPossible);
  var adder = parseInt(computeAdder());
  if(adder > 0 && possibleAddedFields == adder){
    possibleChoices = getUniqueOrDouble(possibleChoices);
    possibleChoices.push(firstPossible, secondPossible);
  }
}

//function computeAdder():
//purpose: to compute adder depending on gameRound
//in first rounds, adderIndex is 0, so the first element from computerChoices is taken to compute Adder
//in subsequent rounds, adderIndex increases, so the next elements in computerChoices are used
//because the possibleChoices which were computed based on the first element are still in the respective
//possibleChoices-array (if not already chosen as next move), there is no problem in computing the adder anew in each round 
function computeAdder(){
  if (globals.gameRound<=3){var adderIndex=0;}
  else {var adderIndex = Math.floor(globals.gameRound/3);}
  var adder = 15-parseInt(globals.computerChoices[adderIndex]);
  return adder;
}



//function getUniqueOrDouble(possibleChoices, doubled):
//purpose: function to take an array with doubled elements and return an unique array 
//if parameter 'doubled' is given, only the doubled elements are returned
//which is needed in dilemma computation
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



//function findBestMove(possibleChoices,player)
//purpose: contains the continued main algorithm for rounds 4 and higher
//after check if computer wins in function balanced strategy is negative, it is called
//it first checks if user can win, then checks for dilemmata for computer and user, and then finds alternative move
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



//function searchForWin(player):
//purpose: search for winning combinations by calling getWinningMove, but only if possibleChoices are more than 0
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

//function getWinningMove(possibleChoices, player, noSuccess, playerChoices):
//purpose: find winning move, if gameRound is 5 or higher, call winInLastRounds
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

//function winInLastRounds(possibleWin,player):
//loops through array playerResults which contains all possible sums by adding two elements of the first three moves
//if possibleWin-move and the respective elements of playerResults add to 15, the winning combination is returned
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


//function computeDilemma(possibleChoices, player):
//purpose: find dilemma to force win
//first call findPossibleDilemma, get an array in return which contains doubled elements
//(these doubled elements are the possible dilemma moves)
//then call getUniqueOrDoubled with parameter doubled to get only the doubled elements returned
//then choose by random one of the dilemmaMoves and return it
function computeDilemma(possibleChoices, player){
    var possibleDilemmaMoves = findPossibleDilemma(possibleChoices, player);
    var dilemmaMoves = getUniqueOrDouble(possibleDilemmaMoves, doubled=1);
    var dilemmaIndex = Math.floor(Math.random() * (dilemmaMoves.length));
    var nextChoice = dilemmaMoves[dilemmaIndex];
    if (dilemmaMoves.length<=3){return nextChoice;}//maybe check if this is necessary
    else {return undefined};
}

//function findPossibleDilemma(possibleChoices, player):
//purpose: computes possibleDilemmaMoves
//nested loop to go two times through possible choices, with variables first and second representing respective elements
//variables firstPossible/secondPossible are sums of the variables from the nested loop and the first and second
//choice of the respective player (because dilemmata can only be established in gameRound 4 or 5, it is not sensible
//to compute them in later rounds based on third or fourth choice)
//if either firstPossible or secondPossible (or both) add up to 15, push them to possibleDilemmaMoves-array
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



//function findAlternativeChoices(player):
//purpose: find alternative choices if there is no possible win and no dilemma
//first, try to find alternative choice by a random field from possibleChoices
//if this does not work, try to find alternative choice by a random field from all remaining fields

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

//function getNextChoice(array):
//purpose: call random choice on array-parameter 
function getNextChoice(array){
  var stringArray = eval(array);
  var nextChoice = randomChoice(array);
  if(parseInt(nextChoice)>0){return nextChoice;}
  else{var stillNoAlternative = "stillNoAlternative";return stillNoAlternative;}
}

//function randomChoice(array)
//purpose: determine nextChoice by random operation on array-parameter    
function randomChoice(array){ 
  var stringArray = eval(array); 
  var possibleIndex = Math.floor(Math.random() * (stringArray.length));
  var nextChoice = stringArray[possibleIndex];
  return nextChoice;
 }



//function computeResult(player):
//purpose: computing the results, checking if there is a winner
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

//function addFirstResults(playerChoice,playerResults):
//interim function to add the first choices and push them into respective results array
//the results array is also used by winInLastRounds function
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

//function computeEndResult(playerChoice, playerResults, player):
//purpose: function to get result in last two rounds
function computeEndResult(playerChoice, playerResults, player) {
    for(i=0;i<playerResults.length;++i){
      var oldResult = playerResults[i];
      var newResult = parseInt(oldResult) + parseInt(playerChoice[3]);
      if (newResult == 15){wins(player); break;}
    }
    if(globals.gameRound == 7){
      checkForTie(newResult);
    }
}

//function checkForTie(newResult):
//purpose: check if there is no winner, give a respective message
function checkForTie(newResult){
    if(newResult != 15){
      globals.ending = true;
      document.getElementById("message").innerHTML ="<div class=" + "'alert alert-info'" +  "id='ending'></div>";
      document.getElementById("ending").innerHTML = "No Winner!" ;
    }
}

//function wins(player):
//purpose: give a winning message
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

//function restartGame()
//purpose: to start a new game in the same mode
function restartGame(){
    location.href = "tictactoe_strategic.html";
}

//function backToMenu()
//purpose: relocate to startsite 
function backToMenu() {
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
