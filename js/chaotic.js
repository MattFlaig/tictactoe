var fields = ["2","7","6","9","5","1","4","3","8"];
var gameRound = 0;
var computerChoices = [];
var computerResults = [];
var userChoices = [];
var userResults = [];
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
    pushingValues(player, fieldNumber);
    var toDelete = fields.indexOf(fieldNumber);
    fields.splice(toDelete,1);
    gameRound += 1;
    alert("Fields: "+fields);
    if(gameRound>=5){computeResult(playerTurn)};
    if (player == 'user'){
      computerNextRound();
      playerTurn = 'computer';
    }
    else {
      playerTurn = 'user';
    }
}

function computerNextRound() {
    var choiceIndex = Math.floor(Math.random() * (fields.length));
    var computerChoice = fields[choiceIndex];
    var choiceString = 'field' + computerChoice; 
    loadImage(choiceString, 'computer', 'blue'); 
 }

function pushingValues(player, fieldNumber){
    var playerChoice = window[player + 'Choices'];
    playerChoice.push(fieldNumber);
    alert("Computer: " + computerChoices);
    alert("User: " + userChoices);
}

function computeResult(player){
    var playerChoice = window[player + 'Choices'];
    var playerResults = window[player + 'Results'];

    if(gameRound==5 || gameRound==6){
      var result = parseInt(playerChoice[0])+parseInt(playerChoice[1])+parseInt(playerChoice[2]);
      alert("Result: "+result);
      if(result == 15){
        alert("The " + player + " has won!");
        backToStart(); 
      }
      else{
        for(i=0;i<playerChoice.length;++i){
        var first = playerChoice[i];
          for(j=i+1;j<playerChoice.length;++j){
          var second = playerChoice[j];
          var addChoices = parseInt(first) + parseInt(second);
          playerResults.push(addChoices);
          }
        }
      }
    } 
    else if (gameRound >= 7) {
      for(i=0;i<playerResults.length;++i){
      var oldResult = playerResults[i];
      var endResult = oldResult + playerChoice[3];
        if (endResult == 15){
          alert("The " + player + " has won!");
          backToStart();
        }
        else if (endResult != 15  && gameRound == 8){
          alert("No winner!");
          backToStart();
        }
      }
    }
    
}

function backToStart() {
    location.href = "start.html";
}






//var winningNumbers = ["1","5","9","1","6","8","2","4","9","2","5","8","2","6","7","3","4","8","3","5","7","4","5","6"];

// /*2,7,6
//   9,5,1
//   4,3,8

// */

