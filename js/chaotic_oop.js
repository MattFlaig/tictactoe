window.onload = function(){

var fields = ["2","9","4","7","5","3","6","1","8"];
var gameRound = 0;
var computerChoices = [], computerResults = [],
    userChoices = [], userResults = [];

AskUser();
setKlickEvent();

function setKlickEvent(){
  for(i=0;i<fields.length;++i){
    var field = fields[i];
    var stringCell = "cell" + field;
    var stringField = "field" + field;
    alert(stringField);
    var player = 'user'; 
    var colour = 'red';
    var getCell = document.getElementById(stringCell);
    //alert(getCell);
    getCell.addEventListener("click", function(){
      manageGame(stringField, player, colour);
    },false);
  }
}

function AskUser() {
    var askTurn = confirm("If you want to begin, please press ok");
    if (!askTurn) {
         computerNextRound();
    }
}

function manageGame(id, player, colour){
    var fieldNumber = id[5];
    //alert(id);
    //alert(player);
    //alert(colour);
    loadImage(id, colour);
    pushValue(fieldNumber,player);
    manageDeletion(fieldNumber);
    if(gameRound>=4){computeResult(player);}
    gameRound += 1;
    managePlayerTurn(player);
}

//loading image
function loadImage(id, colour) {
    document.getElementById(id).style.background = colour;
}

function pushValue(fieldNumber, player){
    var playerChoice =  player + 'Choices';
    eval(playerChoice).push(fieldNumber);
}

//functions to delete chosen move from total fields 
//fields are all remaining empty fields
function manageDeletion(fieldNumber){
  deleteFields(fieldNumber);
}

function deleteFields(fieldNumber){
    var toDeleteField = fields.indexOf(fieldNumber);
    fields.splice(toDeleteField,1);
}


//to manage who's turn it is
function managePlayerTurn(player){
    if (player == 'user'){
      player = 'computer';
      computerNextRound();
    }
    else {
      setKlickEvent();
      //player = 'user';
    }
}

function computerNextRound() {
    //alert("computing...");
    var choiceIndex = Math.floor(Math.random() * (fields.length));
    var computerChoice = fields[choiceIndex];
    var choiceString = 'field' + computerChoice; 
    setTimeout(function(){manageGame(choiceString, 'computer', 'blue')}, 1000); 
}

//computing the results, checking if there is a winner
function computeResult(player){
    var playerChoice = eval(player + 'Choices');
    var playerResults = eval(player + 'Results');
    if(gameRound==4 || gameRound==5){
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
    if(gameRound == 7){
      checkForTie(newResult);
    }
}

function checkForTie(newResult){
    if(newResult != 15){
      alert("No winner!");
      //backToStart();
    }
}

function wins(player){
    alert("The " + player + " wins!");
    //backToStart(); 
}

function backToStart() {
    location.href = "start.html";
}

};

































// //namespace which contains all global variables, to not pollute the global namespace
// var globals = { 
//   fields : ["2","9","4","7","5","3","6","1","8"],
//   gameRound : 0,
//   computerChoices : [], computerResults : [],
//   userChoices : [], userResults : [] 
// }

// //prompt to ask user if he wants to begin
// function AskUser() {
//     var askTurn = confirm("If you want to begin, please press ok");
//     if (!askTurn) {
//         computerNextRound();
//     }
// }

// //function for game engine
// function manageGame(id, player, colour){
//     var fieldNumber = id[5];
//     loadImage(id, colour);
//     pushValue(fieldNumber,player);
//     manageDeletion(fieldNumber);
//     if(globals.gameRound>=4){computeResult(player);}
//     globals.gameRound += 1;
//     managePlayerTurn(player);
// }

// //loading image
// function loadImage(id, colour) {
//     document.getElementById(id).style.background = colour;
// }

// function pushValue(fieldNumber, player){
//     var playerChoice = 'globals.' + player + 'Choices';
//     eval(playerChoice).push(fieldNumber);
// }

// //functions to delete chosen move from total fields 
// //fields are all remaining empty fields
// function manageDeletion(fieldNumber){
//   deleteFields(fieldNumber);
// }

// function deleteFields(fieldNumber){
//     var toDeleteField = globals.fields.indexOf(fieldNumber);
//     globals.fields.splice(toDeleteField,1);
// }


// //to manage who's turn it is
// function managePlayerTurn(player){
//     if (player == 'user'){
//       player = 'computer';
//       computerNextRound();
//     }
//     else {
//       player = 'user';
//     }
// }

// function computerNextRound() {
//     alert("computing...");
//     var fields = globals.fields;
//     var choiceIndex = Math.floor(Math.random() * (fields.length));
//     var computerChoice = fields[choiceIndex];
//     var choiceString = 'field' + computerChoice; 
//     setTimeout(function(){manageGame(choiceString, 'computer', 'blue')}, 1000); 
// }


// //computing the results, checking if there is a winner
// function computeResult(player){
//     var playerChoice = eval('globals.' + player + 'Choices');
//     var playerResults = eval('globals.' + player + 'Results');
//     if(globals.gameRound==4 || globals.gameRound==5){
//       var result = parseInt(playerChoice[0])+parseInt(playerChoice[1])+parseInt(playerChoice[2]);
//       if(result == 15){wins(player);}
//       else{ addFirstResults(playerChoice, playerResults);}
//     } 
//     else {
//       var endResult = computeEndResult(playerChoice, playerResults, player);
//     }
// }

// function addFirstResults(playerChoice,playerResults) {
//     for(i=0;i<playerChoice.length;++i){
//       var first = playerChoice[i];
//         for(j=i+1;j<playerChoice.length;++j){
//           var second = playerChoice[j];
//           var addChoices = parseInt(first) + parseInt(second);
//           playerResults.push(addChoices);
//         }
//     }
// }

// function computeEndResult(playerChoice, playerResults, player) {
//     for(i=0;i<playerResults.length;++i){
//       var oldResult = playerResults[i];
//       var newResult = parseInt(oldResult) + parseInt(playerChoice[3]);
//       if (newResult == 15){wins(player);}
//     }
//     if(globals.gameRound == 7){
//       checkForTie(newResult);
//     }
// }

// function checkForTie(newResult){
//     if(newResult != 15){
//       alert("No winner!");
//       backToStart();
//     }
// }

// function wins(player){
//     alert("The " + player + " wins!");
//     backToStart(); 
// }

// function backToStart() {
//     location.href = "start.html";
// }


// //var winningNumbers = ["1","5","9","1","6","8","2","4","9","2","5","8","2","6","7","3","4","8","3","5","7","4","5","6"];
// /* wenn 1: 5,6,8,9
//    wenn 2: 4,5,6,7,8,9
//    wenn 3: 4,5,7,8

//    wenn 4: 2,3,5,6,8,9
//    wenn 5: 1,2,3,4,6,7,8,9
//    wenn 6: 1,2,4,5,7,8

//    wenn 7: 2,3,5,6
//    wenn 8: 1,2,3,4,5,6
//    wenn 9: 1,2,4,5
// */
