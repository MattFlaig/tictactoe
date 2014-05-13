var fields = ["2","7","6","9","5","1","4","3","8"];
var lastMove = " ";
var gameRound = 0;
var computerChoices = [];
var userChoices = [];
var strategicChoices = [];



function AskUser() {
    var askTurn = confirm("If you want to begin, please press ok");
    if (!askTurn) {
        computerNextRound(lastMove);
    }
}

function loadImage(id, player, colour) {
    document.getElementById(id).style.background = colour;
    var fieldNumber = id[5];
    pushingValues(player, fieldNumber);
    lastMove = fieldNumber;
    var toDelete = fields.indexOf(fieldNumber);
    fields.splice(toDelete,1);
    gameRound += 1;
    //alert(fields);
    if (player == 'user'){
      computerNextRound();
      
    }
}

function computerNextRound() {
    if (gameRound >= 3){
      //computeStrategy(computerChoices);
      computeStrategy(userChoices);

    }
    else {
    var choiceIndex = Math.floor(Math.random() * (fields.length));
    var computerChoice = fields[choiceIndex];
    var choiceString = 'field' + computerChoice; 
    loadImage(choiceString, 'computer', 'blue'); 
    }
 }

function pushingValues(player, fieldNumber){
    if (player=="user"){userChoices.push(fieldNumber);}
    else {computerChoices.push(fieldNumber);}
    alert("Computer: " + computerChoices);
    alert("User: " + userChoices);
}

function computeStrategy(choices) {
    for(i=0; i<choices.length;++i){
        var firstAdd = choices[i];
        for(j=i+1; j<choices.length;++j){
        var secondAdd = choices[j];
        var sumChoices = parseInt(firstAdd) + parseInt(secondAdd);
        alert(sumChoices);
        var possibleMove = 15 - sumChoices;
        strategicChoices.push(possibleMove);
        alert(strategicChoices); 
        }
    }
}




//var winningNumbers = ["1","5","9","1","6","8","2","4","9","2","5","8","2","6","7","3","4","8","3","5","7","4","5","6"];

// /*2,7,6
//   9,5,1
//   4,3,8

// */

// /*

// First Round: 
// first choice: 5
// second choice: 2 || 6 || 8 || 4

// Second Round:
// => first aim: blocking user if he has already 2 in a row
// => second aim: simultaneously getting two in a row
// => third aim: trying to establish dilemma for user

// */