//USER PLAYER OBJECT (BALANCED MODE)
var user = {
  choices : [],
  results : [],
  colour : "black",

  searchForWin : function(){
    var noSuccess = "noSuccess";
    var nextChoice = user.getWinningMove(noSuccess);
    if(nextChoice){return nextChoice;}
    else{return noSuccess;}
  },
  getWinningMove : function(noSuccess){
    for(var i = 0;i < board.fields.length; ++i){
      var possibleWin = parseInt(board.fields[i]);
      if(ticTacToe.round == 5 || ticTacToe.round == 6){
        var nextChoice = user.winInNextRounds(possibleWin);
        if (nextChoice == possibleWin){break;}
      }
      else if(ticTacToe.round < 5){
        var addedChoices = parseInt(user.choices[0]) + parseInt(user.choices[1]);
        if(possibleWin + addedChoices == ticTacToe.WINNING_SUM){var nextChoice = possibleWin;break;}
        else{var nextChoice = noSuccess;}
      }
      else{
        var nextChoice = user.winInLastRounds(possibleWin);
        if (nextChoice == possibleWin){break;}
      }
    }
    return nextChoice;
  },
  winInNextRounds : function(possibleWin){
    for(var j = 0;j < user.results.length; ++j){
      var addedChoices = parseInt(user.results[j]); 
      if(possibleWin + addedChoices == ticTacToe.WINNING_SUM){
        var nextChoice = possibleWin;break;
      }
    }
    var stillNoSuccess = "noSuccess";
    if(nextChoice == possibleWin){return nextChoice;} 
    else {return stillNoSuccess;} 
  },
  winInLastRounds : function(possibleWin){
    for(var k = 0;k < user.choices.length; ++k){
      var firstChoice = user.choices[k];
      for(var l = k + 1;l < user.choices.length; ++l){
        var secondChoice = user.choices[l];
        var combined = parseInt(firstChoice) + parseInt(secondChoice);
        var combinedChoice = possibleWin + combined;
        if(combinedChoice === ticTacToe.WINNING_SUM){
          var nextChoice = possibleWin;break;
        }
      }
    }
    var stillNoSuccess = "noSuccess";
    if(nextChoice == possibleWin){return nextChoice;} 
    else {return stillNoSuccess;} 
  }
}