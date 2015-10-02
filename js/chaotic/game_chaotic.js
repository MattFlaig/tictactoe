//TICTACTOE GAME OBJECT (CHAOTIC MODE)
var ticTacToe = {
  round : 0,
  ending : false,
  turn : " ",
  WINNING_SUM : 15,

  whoBegins : function(nextPlayer){
    if(ticTacToe.round === 0){
      ticTacToe.disableButtons();
      ticTacToe.prepareFirstMove(nextPlayer);
    }
  },
  disableButtons : function(){
    $(".begin").addClass('disabled').prop('disabled',true);
  },
  prepareFirstMove : function(player){
    ticTacToe.turn = player;
    board.prepare();
    if(player === 'computer') {
      setTimeout(function(){ticTacToe.computerTurn()}, 1000);
    }
  },
  userTurn : function(field){
    var fieldNumber = field[5];
    board.loadImage(field, user.colour);
    ticTacToe.pushValue(fieldNumber);
    if(ticTacToe.round>=4){ ticTacToe.computeResult(user.choices); }
    ticTacToe.endOfRound(fieldNumber);
  },
  computerTurn : function(){
    var fieldNumber = ticTacToe.getChaoticField();
    board.loadImage("field" + fieldNumber, computer.colour);
    ticTacToe.pushValue(fieldNumber);
    if(ticTacToe.round>=4){ ticTacToe.computeResult(computer.choices); }
    ticTacToe.endOfRound(fieldNumber);
  },
  getChaoticField : function(){
    return ticTacToe.computeRandomField();
  },
  endOfRound : function(fieldNumber){
    board.deleteFields(fieldNumber);
    ticTacToe.round += 1;
    ticTacToe.managePlayerTurn();
  },
  managePlayerTurn : function(){
    if (ticTacToe.turn === 'user'){
      if(!ticTacToe.ending){ ticTacToe.setComputerTurn(); }
      else{ ticTacToe.manageEnding(); }
    }
    else {
      ticTacToe.setUserTurn();
    }
  },
  setComputerTurn : function(){
    ticTacToe.turn = 'computer';
    board.disable();
    setTimeout(function(){ticTacToe.computerTurn()}, 1000);
  },
  setUserTurn : function(){
    ticTacToe.turn = 'user';
    board.prepare();
    if(ticTacToe.ending){
      ticTacToe.manageEnding();
    }
  },
  manageEnding: function(){
    board.setDefaultCursor();
    board.disable();
  },
  computeRandomField : function(){
    var fields = board.fields;
    var choiceIndex = Math.floor(Math.random() * (fields.length));
    var fieldNumber = fields[choiceIndex];
    return fieldNumber;
  },
  pushValue : function(fieldNumber){
    if(ticTacToe.turn === 'user'){var playerChoices = user.choices;}
    else{var playerChoices = computer.choices;}
    playerChoices.push(fieldNumber);
  },
  computeResult : function(playerChoices){
    if(ticTacToe.round === 4 || ticTacToe.round === 5){
      ticTacToe.computeFirstResult(playerChoices);
    }
    else {
      ticTacToe.computeNextResult(playerChoices);
    }
  },
  computeFirstResult : function(playerChoices){
    var result = 0;
    for(var i in playerChoices) { result += parseInt(playerChoices[i]); }
    if(result === ticTacToe.WINNING_SUM) { ticTacToe.winner(); }
  },
  computeNextResult : function(playerChoices){
    for(var i=0;i<playerChoices.length-1;++i){
      var winner = ticTacToe.manageNextResult(i, playerChoices);
      if (winner){ ticTacToe.winner(); break; }
    }
    ticTacToe.checkForTie();
  },
  manageNextResult : function(i, playerChoices){
    var winner = false;
    for(var j = i+1;j<playerChoices.length-1;++j){
      var firstChoice = playerChoices[i], secondChoice = playerChoices[j];
      var combinedWithLast = parseInt(firstChoice) + parseInt(secondChoice)
                           + parseInt(playerChoices[playerChoices.length - 1]);
      if (combinedWithLast === ticTacToe.WINNING_SUM){ winner = true; }
    }
    return winner;
  },
  checkForTie : function(){
    if(!ticTacToe.ending && ticTacToe.round === 8){
      ticTacToe.ending = true;
      $('#message').addClass('maroon-message');
      $('#message').html("No Winner!");
    }
  },
  winner : function(){
    ticTacToe.ending = true;
    if(ticTacToe.turn === 'user'){ $('#message').addClass('maroon-message'); }
    else{ $('#message').addClass('maroon-message'); }
    $('#message').html("The " + ticTacToe.turn + " wins!");
  },
  backToMenu : function(){
    location.href = "start.html";
  },
  restart : function(){
    location.href = "chaotic.html";
  }

}

$(document).ready(function(){
  $('#userBegins').on('click', function(){
    ticTacToe.whoBegins('user');
  });

  $('#computerBegins').on('click', function(){
    ticTacToe.whoBegins('computer');
  });

  $('#back').on('click', function(){
    ticTacToe.backToMenu();
  });

  $('#restart').on('click', function(){
    ticTacToe.restart();
  });
});