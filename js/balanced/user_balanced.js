//USER PLAYER OBJECT (BALANCED MODE)
var user = {
  choices : [],
  results : [],
  colour : "black",

  searchForWin : function(){
    var nextChoice = user.getWinningMove();
    return nextChoice ? nextChoice : "noSuccess";
  },
  getWinningMove : function(){
    for(var i = 0;i < board.fields.length; ++i){
      var nextChoice = user.winInNextRounds(board.fields[i]);
      if (nextChoice === board.fields[i]){ break; }
    }
    return nextChoice;
  },
  winInNextRounds : function(possibleWin){
    var winner = false;
    for(var k = 0;k < user.choices.length; ++k){
      for(var l = k + 1;l < user.choices.length; ++l){
        if((parseInt(parseInt(user.choices[k])
          + parseInt(user.choices[l]))
          + parseInt(possibleWin)) === ticTacToe.WINNING_SUM){ winner = true; break; }
      }
    }
    return winner ? possibleWin : "noSuccess";
  }
}