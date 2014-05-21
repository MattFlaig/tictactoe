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

function loadImage(id, player, colour) {
    document.getElementById(id).style.background = colour;
    var fieldNumber = id[5];
    deletePossibleChoices(fieldNumber, player);
    pushValue(fieldNumber,player);
    //alert("fieldNumber: " + fieldNumber);
    deletePushedValue(fieldNumber);
    if(globals.gameRound>=4){computeResult(player);}
    globals.gameRound += 1;
    managePlayerTurn(fieldNumber,player);
}

function managePlayerTurn(fieldNumber, player){
    if (player == 'user'){
        
        //deletePossibleChoices(fieldNumber, player);
        player = 'computer';
        computerNextRound(fieldNumber, player);  
    }
    else {
      //deletePossibleChoices(fieldNumber, player);
      player = 'user';
    }
}

function computerNextRound(fieldNumber, player) {
  if (globals.gameRound==0){
    var computerChoice = '5';
    //globals.computerPossibleChoices = globals.fields;
    //globals.userPossibleChoices = globals.fields;
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
    var computerChoice = balancedStrategy(fieldNumber,player);
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
    //alert("Field to delete: " + toDeleteField);
    //alert("fields before delete: " + globals.fields);
    globals.fields.splice(toDeleteField,1);
    //alert("fields after delete: " + globals.fields);
}

function deletePossibleChoices(fieldNumber){
    //alert("Delete now!")
    var possibleForUser = globals.userPossibleChoices;
    var possibleForComputer = globals.computerPossibleChoices;
    actualDelete(possibleForUser, fieldNumber);
    actualDelete(possibleForComputer, fieldNumber);
}


function actualDelete(possibleChoices, fieldNumber){
    //alert("Delete from: " + possibleChoices);
    for(i=0;i<possibleChoices.length; ++i){
    var checkDelete = possibleChoices[i];
      if(checkDelete == fieldNumber){
        //alert("Delete: " + checkDelete);
        possibleChoices.splice(i, 1);
      }
    }
}

function balancedStrategy(fieldNumber,player){
   
    var choicesString = 'globals.' + player + 'PossibleChoices';
    var possibleChoices = eval(choicesString);
    prepareChoices(fieldNumber,player);

    if(globals.gameRound > 4){
      var nextChoice = searchForWin(player);
      if (nextChoice=="noSuccess"){
        nextChoice = findAlternativeChoices(player);
      }
    }
    else if (globals.gameRound == 4){
      var nextChoice = searchForWin('user');
      //alert(nextChoice);
      if (nextChoice=="noSuccess"){
        nextChoice = computeDilemma(possibleChoices);
      }
    }
    else if(globals.gameRound < 4) {
      if(parseInt(fieldNumber)%2==0){
        var nextChoice = searchForWin('user');
      }
    }
    return nextChoice;
}

function computeDilemma(possibleChoices){
    //var possibleDilemmaMoves = [];
    alert("trying to compute dilemma");
    var dilemmaMoves = [];
    var possibleDilemmaMoves = findPossibleDilemma(possibleChoices);
    var dilemmaMoves = getUniqueOrDouble(possibleDilemmaMoves, doubled=1);//trying alternative getUniqueOrDouble
    alert("possibleDilemmaMoves: " + possibleDilemmaMoves);
    //var dilemmaArray = findDilemma(possibleDilemmaMoves);
    //alert("dilemmaArray: " + dilemmaArray);
    //var dilemmaMoves = makeUnique(dilemmaArray);
    var dilemmaIndex = Math.floor(Math.random() * (dilemmaMoves.length));
    nextChoice = dilemmaMoves[dilemmaIndex];
    return nextChoice;
}

function findPossibleDilemma(possibleChoices, possibleDilemmaMoves){
  var possibleDilemmaMoves = [];
  for(i=0;i<possibleChoices.length;++i){
    var first = possibleChoices[i]; 
    for(j=i+1;j<possibleChoices.length;++j){
    var second = possibleChoices[j];
    var firstPossible = parseInt(first) + parseInt(second) + parseInt(globals.computerChoices[0]);
    var secondPossible = parseInt(first) + parseInt(second) + parseInt(globals.computerChoices[1]);
      if(firstPossible == 15 || secondPossible == 15){
        possibleDilemmaMoves.push(first, second);
      }
    }
  }
  alert("possibleDilemma " + possibleDilemmaMoves);
  return possibleDilemmaMoves;
}

function findDilemma(possibleDilemmaMoves){
  var dilemmaArray = [];
  for(k=0;k<possibleDilemmaMoves.length;++k){
    var counter = 0;
    var possibleMove = possibleDilemmaMoves[k];
    for(m=0; m<possibleDilemmaMoves.length;++m){
      var dilemmaMove = possibleDilemmaMoves[m];
      if(dilemmaMove == possibleMove){
        counter += 1;
        if(counter==2){
          dilemmaArray.push(possibleMove);
        }
      }
    }
  }
  alert("Dilemmaarray: " + dilemmaArray);
  return dilemmaArray;
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
  alert("alternativeChoice: " + nextChoice);
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
  possibleChoices = getUniqueOrDouble(possibleChoices);
  computeEgocentricChoices(player, possibleChoices);
}
    
function randomChoice(array){ 
  var stringArray = eval(array); 
  var possibleIndex = Math.floor(Math.random() * (stringArray.length));
  var nextChoice = stringArray[possibleIndex];
  return nextChoice;
 }

function searchForWin(player){
  var choicesString = 'globals.' + player + 'PossibleChoices', possibleChoices = eval(choicesString);
  var playerString = 'globals.' + player + 'Choices', playerChoices = eval(playerString);
  var noSuccess = "noSuccess";

  if(possibleChoices.length>0){
    nextChoice = getWinningMove(possibleChoices, player, noSuccess, playerChoices);
    alert("next: " + nextChoice);
    if(nextChoice){return nextChoice;}
    else{return noSuccess;}
  }
  else{return noSuccess;}
}

function getWinningMove(possibleChoices, player, noSuccess, playerChoices){
  for(i=0;i<possibleChoices.length;++i){
    var possibleWin = parseInt(possibleChoices[i]);
    if(globals.gameRound>5){
      var nextChoice = winInLastRounds(possibleWin,player);
      if (nextChoice == possibleWin){break;}
    }
    else{
      var addedChoices = parseInt(playerChoices[0]) + parseInt(playerChoices[1]);
      if(possibleWin + addedChoices == 15){
        var nextChoice = possibleWin;break;
      }
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
  if(nextChoice==possibleWin){alert("Yippieh!");return nextChoice;} 
  else {alert("Boing");return stillNoSuccess;}
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
  if(secondPossible>0 && firstPossible> 0){
    if(secondPossible != firstPossible){
      var possibleAddedFields = parseInt(firstPossible) + parseInt(secondPossible);
      var adder = parseInt(computeAdder());
      if(adder > 0 && possibleAddedFields == adder){
        possibleChoices = getUniqueOrDouble(possibleChoices);
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

function getUniqueOrDouble(possibleChoices, doubled) {
    var hash = {}, uniqueChoices = [], doubleChoices = [];
    for ( var i = 0; i < possibleChoices.length; ++i ) {
        if ( !hash.hasOwnProperty(possibleChoices[i]) ) { 
            hash[ possibleChoices[i] ] = true;
            uniqueChoices.push(possibleChoices[i]);
        }
        else {doubleChoices.push(possibleChoices[i]);}
    }
    if(doubled){alert("Double: " + doubleChoices);return doubleChoices;}
    else{return uniqueChoices;}
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
