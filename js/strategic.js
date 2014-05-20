var globals = { 
  fields : ["2","9","4","7","5","3","6","1","8"],
  gameRound : 0,
  computerChoices : [], computerResults : [], computerPossibleChoices : [],
  userChoices : [], userResults : [], userPossibleChoices : []
}


function AskUser() {
    var askTurn = confirm("If you want to begin, please press ok");
    if (!askTurn) {
        computerNextRound();
    }
}

function loadImage(id, player, colour) {
    document.getElementById(id).style.background = colour;
    var fieldNumber = id[5];
    pushValue(fieldNumber,player);
    deletePushedValue(fieldNumber);
    if(globals.gameRound>=4){computeResult(player);}
    globals.gameRound += 1;
    managePlayerTurn(fieldNumber,player);
}

function managePlayerTurn(fieldNumber, player){
    if (player == 'user'){
        deletePossibleChoices(fieldNumber, player);
        player = 'computer';
        computerNextRound(fieldNumber, player);
        
    }
    else {
      deletePossibleChoices(fieldNumber, player);
      player = 'user';
    }
}

function computerNextRound(fieldNumber, player) {
  if (globals.gameRound==0){
    var computerChoice = '5';
    globals.computerPossibleChoices = globals.fields;
    globals.userPossibleChoices = globals.fields;
  }
  else if(globals.gameRound==1){
    var computerChoice = randomChoice('globals.fields');
  }
  else if(globals.gameRound==2){
    if(parseInt(fieldNumber)%2==0){
      var computerChoice = 15 - (parseInt(fieldNumber) + parseInt(globals.computerChoices[0]));
    }
    else{
      var computerChoice = findPossibleEdgeField();
    }
  }
  else {
    var computerChoice = egocentricStrategy(fieldNumber,player);
  }
  var choiceString = 'field' + computerChoice; 
  setTimeout(function(){loadImage(choiceString, 'computer', 'blue')}, 1000);
}

function findPossibleEdgeField(){
    var fieldOkay=false;
    while (fieldOkay==false){
      var possibleField = Math.floor(Math.random() * 8)+1;
      if (possibleField%2==0){fieldOkay = true; return possibleField};
    }
}

function pushValue(fieldNumber, player){
    var playerChoice = 'globals.' + player + 'Choices';
    eval(playerChoice).push(fieldNumber);
}

function deletePushedValue(fieldNumber){
    var toDeleteField = globals.fields.indexOf(fieldNumber);
    globals.fields.splice(toDeleteField,1);
}

function deletePossibleChoices(fieldNumber, player){
    var choicesString = 'globals.' + player + 'PossibleChoices';
    var possibleChoices = eval(choicesString);
    for(i=0;i<possibleChoices.length; ++i){
    var checkDelete = possibleChoices[i];
      if(checkDelete == fieldNumber){
        possibleChoices.splice(i, 1);
      }
    }
}

function egocentricStrategy(fieldNumber,player){
    var possibleDilemmaMoves = [];
    var dilemmaMoves = [];
    var choicesString = 'globals.' + player + 'PossibleChoices';
    var possibleChoices = eval(choicesString);
    prepareChoices(fieldNumber,player);
    //alert ("player: " + player);
    if(globals.gameRound > 4){
      var nextChoice = searchForWin(player);
      if (nextChoice=="noSuccess"){
        nextChoice = findAlternativeChoices(player);
      }
    }
    else if (globals.gameRound == 4){
     
      var nextChoice = searchForWin('user');
      if (nextChoice=="noSuccess"){
        for(i=0;i<possibleChoices.length;++i){
          var possibleFirstMove = possibleChoices[i];
          for(j=i+1;j<possibleChoices.length;++j){
          var possibleSecondMove = possibleChoices[j];
          var addedMoves = parseInt(possibleFirstMove) + parseInt(possibleSecondMove);
            if((addedMoves + parseInt(globals.computerChoices[0])) == 15 || (addedMoves + parseInt(globals.computerChoices[1])) == 15){
              possibleDilemmaMoves.push(possibleFirstMove,possibleSecondMove);
            }
            possibleDilemmaMoves = makeUnique(possibleDilemmaMoves);
          }
        }
        

        for(k=0;k<possibleDilemmaMoves.length;++k){
        var possibleFirstDilemma = possibleDilemmaMoves[k];
          for(l=0;l<possibleDilemmaMoves.length;++l){
          var possibleSecondDilemma = possibleDilemmaMoves[l];
            if (possibleFirstDilemma == possibleSecondDilemma){
              dilemmaMoves.push(possibleFirstDilemma, possibleSecondDilemma);
            }
          }
        }
        alert("Dilemma moves: " + dilemmaMoves);
        var dilemmaIndex = Math.floor(Math.random() * (dilemmaMoves.length));
        nextChoice = dilemmaMoves[dilemmaIndex];
      }
    }
    else if(globals.gameRound < 4) {
      if(parseInt(fieldNumber)%2==0){
        var nextChoice = searchForWin('user');
      }
    }
    //alert(nextChoice);
    return nextChoice;
}

function findAlternativeChoices(player){
  var choicesString = 'globals.' + player + 'PossibleChoices';
  var possibleChoices = eval(choicesString);
  if(possibleChoices.length > 0 && possibleChoices != "0"){
    var nextChoice = getNextChoice(choicesString);
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

function prepareChoices(fieldNumber,player){
  var choicesString = 'globals.' + player + 'PossibleChoices';
  var possibleChoices = eval(choicesString);
  possibleChoices = makeUnique(possibleChoices);
  computeEgocentricChoices(player, possibleChoices);

  //deletePossibleChoices(fieldNumber,player);
}
    
function randomChoice(array){ 
  var stringArray = eval(array); 
  var possibleIndex = Math.floor(Math.random() * (stringArray.length));
  var nextChoice = stringArray[possibleIndex];
  return nextChoice;
 }

function searchForWin(player){
  var choicesString = 'globals.' + player + 'PossibleChoices';
  var possibleChoices = eval(choicesString);
  var playerString = 'globals.' + player + 'Choices';
  var playerChoices = eval(playerString);
  var noSuccess = "noSuccess";

  if(possibleChoices.length>0){
    for(i=0;i<possibleChoices.length;++i){
      var possibleWin = parseInt(possibleChoices[i]);
      if(globals.gameRound>5){
        var nextChoice = winInLastRounds(possibleWin,player);
        if (nextChoice == possibleWin){break;}
      }
      else{
        var addedChoices = parseInt(playerChoices[0]) + parseInt(playerChoices[1]);
        //alert("Added: " + addedChoices);
          if(possibleWin + addedChoices == 15){
            var nextChoice = possibleWin;break;
          }
          else{var nextChoice = noSuccess;}
      }
    }
    alert("next: " + nextChoice);
    if(nextChoice==possibleWin){return nextChoice;}
    else{return noSuccess;}
  }
  else{return noSuccess;}
}

function winInLastRounds(possibleWin,player) {
  var playerResults = eval('globals.' + player + 'Results');
  //alert("results: " + playerResults);
  for(j=0;j<playerResults.length;++j){
    var addedChoices = parseInt(playerResults[j]); 
    if(possibleWin + addedChoices == 15){
      var nextChoice = possibleWin;break;
    }
  }
  var stillNoSuccess = "stillNoSuccess";
  if(nextChoice==possibleWin){alert("Yippieh!");return nextChoice;} 
  else {alert("Boing");return stillNoSuccess;}
}

function computeEgocentricChoices(player){
  for(i=0;i<globals.fields.length;++i){
    var firstPossible = globals.fields[i];
    for(j=0;j<globals.fields.length;++j){
      var secondPossible = globals.fields[j];
      manageChoices(firstPossible,secondPossible,player);
    } 
  }
}

function manageChoices(firstPossible,secondPossible,player){
  var choicesString = 'globals.' + player + 'PossibleChoices';
  var possibleChoices = eval(choicesString);
  //alert(choicesString);
  //alert(possibleChoices);
  if(secondPossible>0 && firstPossible> 0){
    if(secondPossible != firstPossible){
      var possibleAddedFields = parseInt(firstPossible) + parseInt(secondPossible);
      var adder = parseInt(computeAdder());
      if(adder > 0 && possibleAddedFields == adder){
        possibleChoices = makeUnique(possibleChoices);
        possibleChoices.push(firstPossible, secondPossible);
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
    for ( var i = 0; i < possibleChoices.length; ++i ) {
        if ( !hash.hasOwnProperty(possibleChoices[i]) ) { 
            hash[ possibleChoices[i] ] = true;
            uniqueChoices.push(possibleChoices[i]);
        }
    }
    return uniqueChoices;
}

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
