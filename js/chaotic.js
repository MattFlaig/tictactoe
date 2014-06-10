//namespace which contains all global variables, to not pollute the global namespace
var globals = { 
  fields : ["2","9","4","7","5","3","6","1","8"],
  gameRound : 0, ending: false,
  computerChoices : [], computerResults : [],
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

//loading image
function loadImage(id, colour) {
    document.getElementById(id).style.background = colour;
}

function pushValue(fieldNumber, player){
    var playerChoice = 'globals.' + player + 'Choices';
    eval(playerChoice).push(fieldNumber);
}

//functions to delete chosen move from total fields 
//fields are all remaining empty fields
function manageDeletion(fieldNumber){
  deleteFields(fieldNumber);
}

function deleteFields(fieldNumber){
    var toDeleteField = globals.fields.indexOf(fieldNumber);
    globals.fields.splice(toDeleteField,1);
}


//to manage who's turn it is
function managePlayerTurn(player){
    if (player == 'user'){
      if(globals.ending == false){
        globals.playerTurn = 'computer';
        player = 'computer';
        disableFields();
        computerNextRound();
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

function computerNextRound() {
    //alert("computing...");
    var fields = globals.fields;
    var choiceIndex = Math.floor(Math.random() * (fields.length));
    var computerChoice = fields[choiceIndex];
    var choiceString = 'field' + computerChoice; 
    setTimeout(function(){manageGame(choiceString, 'computer', 'maroon')}, 1000); 
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

// function hideButtons(){
//  document.getElementById('dynamicButtons').style.visibility = 'hidden';
// }

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
      alert(newResult);
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
    location.href = "tictactoe_chaotic.html";
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
